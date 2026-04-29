(function () {
  const form = document.getElementById("postForm");
  const submitBtn = document.getElementById("submit-button");
  const errorBox = document.getElementById("form-error");
  const loadingBox = document.getElementById("form-loading");

  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  function showError(msg) {
    if (loadingBox) loadingBox.textContent = msg;
  }

  function showFormError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
  }

  if (!slug) {
    showError("No post specified. Use /editPost?slug=<post-slug>.");
    return;
  }

  function setContent(text) {
    const textarea = document.getElementById("blogContent");
    textarea.value = text;
    if (window.easyMDE && typeof window.easyMDE.value === "function") {
      window.easyMDE.value(text);
    }
  }

  async function loadPost() {
    try {
      const res = await fetch(`/api/posts/slug/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Post not found.");
        throw new Error(`Server error ${res.status}`);
      }
      const post = await res.json();

      document.getElementById("blogTitle").value = post.title || "";
      setContent(post.content || "");
      document.getElementById("blogStatus").value = post.status || "draft";
      document.getElementById("blogTags").value = (post.tags || []).join(", ");
      form.dataset.postId = post._id;

      if (loadingBox) loadingBox.classList.add("hidden");
      form.classList.remove("hidden");
      form.classList.add("flex");
    } catch (err) {
      showError(err.message || "Failed to load post.");
      console.error("[edit-post] load error:", err);
    }
  }

  // EasyMDE initializes synchronously when its script tag runs (before this
  // deferred script), so window.easyMDE is already available.
  loadPost();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.add("hidden");

    const id = form.dataset.postId;
    if (!id) {
      showFormError("Post id missing — reload the page.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    const title = document.getElementById("blogTitle").value.trim();
    const content = (window.easyMDE
      ? window.easyMDE.value()
      : document.getElementById("blogContent").value
    ).trim();

    if (!content) {
      showFormError("Content is required.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Save Changes";
      return;
    }

    const status = document.getElementById("blogStatus").value;
    const tagsRaw = document.getElementById("blogTags").value;
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, status, tags }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Server error ${res.status}`);
      }

      const updated = await res.json();
      window.location.href = `/writings/post?slug=${updated.slug || slug}`;
    } catch (err) {
      showFormError(err.message || "Failed to save post.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Save Changes";
      console.error("[edit-post] error:", err);
    }
  });
})();
