(async function () {
  const container = document.getElementById("post-container");
  const pagination = document.getElementById("pagination");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const pageInfo = document.getElementById("page-info");

  const params = new URLSearchParams(window.location.search);
  let currentPage = Math.max(parseInt(params.get("page") || "1", 10), 1);

  async function loadPage(page) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12">Loading posts...</div>';

    try {
      const res = await fetch(`/api/posts/paginated?page=${page}&limit=9`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      container.innerHTML = "";

      if (data.items.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12">No published posts yet.</div>';
        pagination.classList.add("hidden");
        return;
      }

      data.items.forEach((post) => {
        const date = post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

        const tags = (post.tags || [])
          .map((t) => `<span class="px-2 py-0.5 bg-white/60 rounded-full text-xs font-poppins text-gray-600">${t}</span>`)
          .join("");

        const card = document.createElement("a");
        card.href = `/writings/post?id=${post._id}`;
        card.className = "block bg-gradient-to-bl from-[#e0e4e5] to-[#f2f6f9] rounded-2xl p-8 shadow-[inset_-2px_2px_rgba(255,255,255,1),-20px_20px_40px_rgba(0,0,0,0.25)] hover:-translate-y-2 hover:shadow-[inset_-2px_2px_rgba(255,255,255,1),-30px_30px_60px_rgba(0,0,0,0.35),0_8px_20px_rgba(120,180,255,0.25)] transition-all duration-500 cursor-pointer flex flex-col gap-3";
        card.innerHTML = `
          <div class="flex flex-col gap-1 flex-1">
            <h3 class="text-base font-poppins font-semibold text-[#444447] leading-snug">${post.title || "(untitled)"}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">${post.excerpt || ""}</p>
          </div>
          <div class="flex flex-wrap gap-1">${tags}</div>
          <p class="text-xs text-gray-400 font-poppins">${date}</p>
        `;
        container.appendChild(card);
      });

      pageInfo.textContent = `Page ${data.page} of ${data.totalPages}`;
      prevBtn.disabled = !data.hasPrev;
      nextBtn.disabled = !data.hasNext;
      pagination.classList.remove("hidden");

      currentPage = data.page;
      const url = new URL(window.location.href);
      url.searchParams.set("page", currentPage);
      window.history.replaceState({}, "", url);
    } catch (err) {
      container.innerHTML = '<div class="col-span-full text-center text-red-500 py-12">Failed to load posts.</div>';
      console.error("[writings] load error:", err);
    }
  }

  prevBtn.addEventListener("click", () => { if (currentPage > 1) loadPage(currentPage - 1); });
  nextBtn.addEventListener("click", () => loadPage(currentPage + 1));

  loadPage(currentPage);
})();
