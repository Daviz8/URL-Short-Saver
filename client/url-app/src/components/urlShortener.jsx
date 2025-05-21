import { useState } from "react";
import UrlTable from "./urlTable";

function Short() {
  const [input, setInput] = useState("");
  const [disable, setDisable] = useState(true);
  const [description, setDescription] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const validateURL = (string) => {
    const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return pattern.test(string);
  };

  const handleChange = (event) => {
    const url = event.target.value;
    setInput(url);
    const isValid = validateURL(url);
    setDisable(!isValid); 
    
    if (!isValid) {
      setUrlError("Please enter a valid URL ⚠️");
    } else {
      setUrlError(""); 
    }

  };

  const handleSubmit = async (event) => {
    event.preventDefault();
   if (!disable) {  /*checks if it't not a valid url */ 
      try {
        const response = await fetch("http://localhost:3000/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "url": input, "description": description }),
        });
        window.location = "/";
        console.log("Response:", response);
      } catch (error) {
        console.error("Error shortening URL:", error.response?.data || error.message);
      }
    } else {
      setUrlError("Please enter a valid URL before submitting ⚠️");
    }
  };

  return (
    <div className="h-full bg-white flex flex-col items-center justify-center py-12">
      <div className="sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src="images/http.png" alt="Logo" />
        <h2 className="text-center text-2xl font-bold text-gray-900">URL Shortener/Saver</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="url"
            name="url"
            value={input}
            onChange={handleChange}
            placeholder="Paste your 🔗..."
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
          />
          {urlError && <p className="text-red-500 text-sm">{urlError}</p>}
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="description..."
            className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
          />
          <button
            type="submit"
            className={`w-full rounded-md px-3 py-1.5 text-white font-semibold shadow-xs focus:outline-2 focus:outline-indigo-600 ${
              disable ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
            }`}
          >
            Generate Link
          </button>
        </form>
      </div>
      <br /><br /><br />
      <UrlTable />
    </div>
  );
}

export default Short;