import express from "express";
import bodyParser from "body-parser";
import { promises as fs } from 'fs';
import path from 'path';
import cors from "cors";
import db from "./core.db.js"; // 
import { whitelist } from "../common/constants.js";
import { config } from "process";
import { configDotenv } from "dotenv";
import axios from "axios";


const app = express();
const port = 3000;

export const runAppConfig = () => {

    // Database connection
    db.connect();

    /* CORS setup
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    };*/

app.use(cors());
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


//URL shortener API 
app.post("/links", async (req, res) => {

  try {
    const  description = req.body.description
    const  url  = req.body.url;
    console.log("Received URL:", url);
    console.log("Received description:", description);

    // Validate URL format (basic validation)
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // 
const data = {
    url:url,
};



axios.post('https://spoo.me/', data, {
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
    },
})

.then(function (response) {
  console.log("Spoo.me Response:", response.data);
})
.catch(function (error) {
  console.error("Error calling spoo.me:", error);
  return res.status(500).json({ error: "Failed to shorten URL" });
});

    const result = await db.query(
      "INSERT INTO links (description, url) VALUES ($1,$2) RETURNING *",[description, url]
    );

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to process URL" });
  }
});


  // Get all links
  app.get("/links", async (req, res) => {
    try {
      const allLinks = await db.query("SELECT * FROM links");
      console.log("hello"); 
      res.json(allLinks.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  

  app.get("/links/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const linkResult = await db.query("SELECT * FROM links WHERE id = $1", [id]);
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
      const id = parseInt(req.params.id);
      const { description, url } = req.body;
      const updateResult = await db.query(
        "UPDATE links SET description = $1, url = $2 WHERE id = $3 RETURNING *",
        [description, url, id]
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
      await db.query("DELETE FROM links WHERE id = $1", [parseInt(id)]);
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