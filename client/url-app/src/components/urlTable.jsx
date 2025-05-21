import { useEffect, useState } from "react";
import '/src/App.css';

function UrlTable() {
  const [urlData, setUrlData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(null);

  const fetchUrlData = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/links?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUrlData(data.links);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrlData(0); 
  }, []);

  const getNextPage = async () => {
    if (totalPages === null || currentPage < totalPages - 1) {
      fetchUrlData(currentPage + 1);
    }
  };

  const getPreviousPage = async () => {
    if (currentPage > 0) {
      fetchUrlData(currentPage - 1);
    }
  };

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

  if (loading) {
    return <p>Loading links...</p>;
  }

  if (error) {
    return <p>Error loading links: {error}</p>;
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-lg font-extrabold text-gray-700 font-serif">Details</th>
                <th className="py-3 px-4 text-left text-lg font-extrabold text-gray-700 font-serif">Short URL</th>
                <th className="py-3 px-4 text-left text-lg font-extrabold text-gray-700 font-serif">Actions</th>
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
                    <button
                      onClick={() => Del(url.id)}
                      className="bg-red-500 hover:bg-red-600 text-white mx-2 my-2  py-1 px-3 rounded"
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
      <br />
      <br />
      <div className="max-w-2xl mx-auto">
        <nav aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px">
            <li>
              <button
                onClick={getPreviousPage}
                disabled={currentPage === 0}
                className="bg-white border font-bold border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 ml-0 rounded-l-lg leading-tight py-2 px-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </button>
            </li>
            <li>
              <button
                onClick={getNextPage}
                disabled={totalPages !== null && currentPage >= totalPages - 1}
                className="bg-white border font-bold border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-r-lg leading-tight py-2 px-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
        {totalPages !== null && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Page {currentPage + 1} of {totalPages}
          </p>
        )}
      </div>
    </>
  );
}

export default UrlTable;