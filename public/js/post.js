(async function () {
  const container = document.getElementById("post-content");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = '<p class="text-red-500 text-center py-12">No post ID provided.</p>';
    return;
  }

  try {
    const res = await fetch(`/api/posts/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const post = await res.json();

    const date = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    document.title = `${post.title} — Bimbel Muda`;

    const tags = (post.tags || [])
      .map((t) => `<span class="px-2 py-0.5 bg-white/60 rounded-full text-xs font-poppins text-gray-500">${t}</span>`)
      .join("");

    container.innerHTML = `
      <header class="mb-8 pb-6 border-b border-gray-200/60">
        <h1 class="text-3xl font-poppins font-semibold text-[#333] leading-tight mb-3">${post.title}</h1>
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs text-gray-400 font-poppins">${date}</span>
          <div class="flex flex-wrap gap-1">${tags}</div>
        </div>
      </header>
      <div class="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">${post.content}</div>
    `;
  } catch (err) {
    container.innerHTML = '<p class="text-red-500 text-center py-12">Failed to load post.</p>';
    console.error("[post] load error:", err);
  }
})();
