import express, { request } from "express";
import { promises as fs, link } from 'fs';
import path from 'path';
import cors from "cors";
import axios from "axios";
import Db from "./core.Db.js"; 

    Db.connect();

const app = express();
const port = 3000;

export const runAppConfig = () => {

app.use(cors());  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/**Shorten the links**/

app.post("/links", async (req, res) => {
  try {
      const description = req.body.description;
      const url = req.body.url;

      console.log("Received URL:", url);
      console.log("Received description:", description);

      // Validate URL format (basic validation)
      const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlPattern.test(url)) {
          return res.status(400).json({ error: "Invalid URL format" });
      }

      const data = {
          url: url,
      };

      let shortenedUrl;

      await axios.post('https://spoo.me/', data, {
          headers: {
              'content-type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
          },
      })
      .then(function (response) {
          shortenedUrl = response.data.short_url;
          console.log("Shortened URL:", shortenedUrl);
      })
      .catch(function (error) {
          console.error("Error calling spoo.me:", error);
          return res.status(500).json({ error: "Failed to shorten URL" });
      });

      // Check if we successfully got a shortened URL
      if (!shortenedUrl) {
          return res.status(500).json({ error: "Failed to retrieve shortened URL" });
      }

      const result = await Db.query(
          "INSERT INTO links (description, url,  ShortenedUrl) VALUES ($1, $2, $3) RETURNING *",
          [description, url, shortenedUrl]
      );

      res.json({ data: result.rows[0] });
  } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Failed to process URL" });
  }
});

app.get("/links", async (req, res) => {
  try {
    const page = parseInt(req.query.page || '0');
    const linksPerPage = 10;
    const offset = page * linksPerPage;

    const countResult = await Db.query("SELECT COUNT(*) FROM links");
    const totalLinks = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalLinks / linksPerPage);

    const allLinks = await Db.query("SELECT * FROM links LIMIT $1 OFFSET $2", [linksPerPage, offset]);

    res.json({
      page: page,
      totalPages: totalPages,
      links: allLinks.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});
  
  

  app.get("/links/:id", async (req, res) => {
    
    try {
      const id = req.params.id;
      const linkResult = await Db.query("SELECT * FROM links WHERE id = $1" , [id]  );
      if (linkResult.rows.length === 0) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.json(linkResult.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
  app.put("/links/:id", async (req, res) => {
    try {
      const {id} = parseInt(req.params.id);
      const { description} = req.body;
      const updateResult = await Db.query(
        "UPDATE links SET description = $1 WHERE id = $2,",
        [description , id]
      );
      if (updateResult.rows.length === 0) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.json({ message: "This description was updated", data: updateResult.rows[0] });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });
      
  // Delete a link by id
  app.delete("/links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Db.query("DELETE FROM links WHERE id = $1", [parseInt(id)]);
      res.json({ message: "Link was deleted!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });

    const startServer = () => {
        app.listen(port, () => {
            console.log(`Server started at https://localhost:${port}`);
        });
    };

    return { app, startServer };
};
