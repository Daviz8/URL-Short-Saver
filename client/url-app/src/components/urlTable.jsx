import { useEffect, useState } from "react";
import '/src/App.css'



function UrlTable(){

    const [urlData, setUrlData] = useState([]);


    //happens everytime the page reoloads 
    useEffect(() => {
        const fetchUrlData = async () => {
            try {
                const response = await fetch("http://localhost:3000/links");
                const data = await response.json();
                setUrlData(data);
            } catch (error) {
                console.error("Error fetching URL data:", error);
            }
        };

        fetchUrlData();
    }, []);

    /* Delete link */
  const Del = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/links/${id}`, {
        method: "DELETE",
      });
      console.log(response);
      setUrlData(urlData.filter((url) => url.id !== id)); // Update state after deletion
    } catch (err) {
      console.error(err.message);
    }
  };

    const [copied, setCopied] = useState(null);

    const handleCopy = async (shortUrl, id) => {
      try {
        await navigator.clipboard.writeText(shortUrl); //targeted to the shortened url 
        setCopied(id);
        setTimeout(() => setCopied(null), 2000); // Resets back to null after 2s
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    };
return(
    <>
    
    
        {  <div className="container mx-auto p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left text-lg font-semibold text-gray-700">Details</th>
                          <th className="py-3 px-4 text-left text-lg font-semibold text-gray-700">Short URL</th>
                          <th className="py-3 px-4 text-left text-lg font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {urlData.map((url) => (
                          <tr key={url.id} className="border-t">
                            <td className="py-3 libre-baskerville-regular font-bold px-6 text-sm text-gray-600">{url.description} </td>
                            <td className="py-3 font-bold px-4 text-sm text-blue-500 break-words">{url.shortenedurl}</td>
                            <td className="py-3 px-4 text-sm">
                              <button
                                onClick={() => handleCopy(url.shortenedurl, url.id)}
                                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                              >
                                {copied === url.id ? "Copied!" : "Copy"}
                              </button>

                    
                  <button onClick={()=> Del(url.id)}
                    className="bg-red-500 hover:bg-red-600 text-white mx-2 my-2  py-1 px-3 rounded"
                  >
                    Delete
                  </button>

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
}
            

            
    </>
);}

export default UrlTable;