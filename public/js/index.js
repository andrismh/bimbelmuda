// /public/js/home.js
(async function () {
  try {
    const container = document.getElementById("post-container");
    console.log("[home] container found?", !!container);
    if (!container) return;

    const url = "/api/titles";
    console.log("[home] fetching:", url);

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    console.log("[home] status:", res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const posts = await res.json();
    console.log("[home] posts:", posts);

    container.innerHTML = "";
    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "card p-3 mb-3";
      const h2 = document.createElement("h2");
      h2.className = "h5 mb-0";
      h2.textContent = post.title || "(untitled)";
      card.appendChild(h2);
      container.appendChild(card);
    });
  } catch (e) {
    console.error("[home] load error:", e);
  }
})();

document
  .getElementById("postForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent form reload

    const title = document.getElementById("blogTitle").value;
    const content = document.getElementById("blogContent").value;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Server returned " + response.status);
      }

      const data = await response.json();
      console.log("Server response:", data);

      alert("Post submitted successfully!");
    } catch (err) {
      console.error("Error submitting post:", err);
      alert("Failed to submit post.");
    }
  });
