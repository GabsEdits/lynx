import { useEffect, useState } from "preact/hooks";

export default function Welcome() {
  const [shortLinks, setShortLinks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleSampleLink = () => {
    const inputElement = document.getElementById("input");
    if (inputElement) {
      inputElement.value = "https://example.org";
    }
  };

  const handlePopupSampleLink = () => {
    const inputElement = document.getElementById("input");
    if (inputElement) {
      inputElement.value = "https://example.com/test";
    }
  };

  const handleNext = async () => {
    const inputElement = document.getElementById("input");
    if (inputElement && inputElement.value) {
      const originalUrl = inputElement.value;
      try {
        const response = await fetch("https://lynx.gxbs.dev/api/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ originalUrl }),
        });

        if (response.ok) {
          const data = await response.json();
          const shortUrl = data.shortUrl;
          const originalUrl = data.originalUrl;

          const updatedShortLinks = [...shortLinks, { shortUrl, originalUrl }];
          setShortLinks(updatedShortLinks);
          localStorage.setItem("shortLinks", JSON.stringify(updatedShortLinks));
        } else {
          console.error("Failed to create short URL");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleRemove = async (shortUrl) => {
    try {
      const response = await fetch(shortUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedShortLinks = shortLinks.filter((link) =>
          link.shortUrl !== shortUrl
        );
        setShortLinks(updatedShortLinks);
        localStorage.setItem("shortLinks", JSON.stringify(updatedShortLinks));
      } else {
        console.error("Failed to delete short URL");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const storedShortLinks = JSON.parse(localStorage.getItem("shortLinks")) ||
      [];
    setShortLinks(storedShortLinks);
  }, []);

  return (
    <div id="container" class="flex flex-col gap-2 justify-center p-4">
      {shortLinks.length > 0
        ? (
          <>
            <div class="flex flex-col gap-4 items-center justify-center p-4">
              <h1 class="flex flex-col font-serif text-4xl items-center justify-center text-center">
                <span class="text-lg font-serif italic">
                  Lynx
                </span>
                My Short Links
              </h1>
              <div id="card" class="flex flex-col gap-3 w-full">
                {shortLinks.map((link) => (
                  <div class="p-7 flex flex-col gap-2 bg-white dark:bg-zinc-900 rounded-xl shadow-md w-full">
                    <a
                      class="text-2xl font-bold hover:underline hover:text-black dark:hover:text-white no-underline text-black dark:text-white break-all"
                      href={link.shortUrl}
                    >
                      {link.shortUrl}
                    </a>
                    <div class="w-full flex lg:flex-row sm:flex-col gap-2 mt-4 items-center justify-between">
                      <div class="flex flex-row sm:flex-col gap-2">
                        <p class="text-base bg-green-200 text-green-900 dark:bg-green-500 dark:text-green-950 rounded-lg py-2 px-4 w-max">
                          Live
                        </p>
                        <p class="text-base bg-zinc-200 dark:bg-zinc-700 rounded-lg py-2 px-4 w-max p-2 break-all">
                          Goes to: {link.originalUrl}
                        </p>
                      </div>
                      <div class="flex flex-row gap-2">
                        <button
                          class="text-base bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-950 rounded-lg py-2 px-4 w-max"
                          onClick={() => handleRemove(link.shortUrl)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div class="w-full flex flex-col items-center justify-center">
                <button
                  class="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-zinc-700 dark:hover:text-white transition-colors"
                  onClick={showPopup
                    ? () => setShowPopup(false)
                    : () => setShowPopup(true)}
                >
                  Add Short Link
                </button>
              </div>
            </div>
          </>
        )
        : (
          <>
            <h1 class="flex flex-col font-serif text-4xl items-center justify-center text-center">
              Welcome to
              <span class="italic text-6xl">Lynx</span>
              <span class="text-base">A simple url shortener</span>
            </h1>
            <div class="flex flex-col gap-6 items-center w-full">
              <p class="text-lg text-center">Start by adding a new url</p>
              <input
                id="input"
                class="px-6 py-3 w-full max-w-md rounded-lg bg-zinc-100 dark:bg-zinc-900"
                type="url"
                placeholder="URL"
              />
              <div class="w-full flex flex-col md:flex-row items-center justify-end gap-2">
                <button
                  class="px-6 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-900"
                  onClick={handleSampleLink}
                >
                  Use Sample Link
                </button>
                <button
                  class="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black"
                  onClick={handleNext}
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </>
        )}
      {showPopup && (
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
          <div class="bg-white relative dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
            <button
              class="absolute top-4 right-6 text-3xl"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <h2 class="text-2xl font-serif mb-4">Add a new URL</h2>
            <input
              id="input"
              class="px-6 py-3 w-full max-w-md rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-4"
              type="url"
              placeholder="URL"
            />
            <div class="flex flex-col md:flex-row justify-end gap-2">
              <button
                class="px-6 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                onClick={handlePopupSampleLink}
              >
                Use Sample Link
              </button>
              <button
                class="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black"
                onClick={handleNext}
              >
                Continue &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
