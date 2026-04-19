(function () {
  const form = document.getElementById("postForm");
  const submitBtn = document.getElementById("submit-button");
  const errorBox = document.getElementById("form-error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.add("hidden");
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    const title = document.getElementById("blogTitle").value.trim();
    const content = document.getElementById("blogContent").value.trim();
    const status = document.getElementById("blogStatus").value;
    const tagsRaw = document.getElementById("blogTags").value;
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, status, tags }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Server error ${res.status}`);
      }

      window.location.href = "/writings";
    } catch (err) {
      errorBox.textContent = err.message || "Failed to submit post.";
      errorBox.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "Publish Post";
      console.error("[create-post] error:", err);
    }
  });
})();
