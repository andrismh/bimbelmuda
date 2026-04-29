(async function () {
  const container = document.getElementById("post-content");

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    container.innerHTML =
      '<p class="text-red-500 text-center py-12">No post specified.</p>';
    return;
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  }

  function buildToc(root) {
    const toc = document.getElementById("post-toc");
    if (!toc) return;
    const headings = root.querySelectorAll("h2, h3");
    if (headings.length < 2) return;

    const used = new Map();
    const items = [];
    headings.forEach((h) => {
      if (!h.id) {
        let base = slugify(h.textContent || "");
        let id = base;
        const n = used.get(base) || 0;
        if (n > 0) id = `${base}-${n}`;
        used.set(base, n + 1);
        h.id = id;
      }
      items.push({ id: h.id, text: h.textContent || "", level: h.tagName.toLowerCase() });
    });

    const list = items
      .map((it) => `<li class="toc-${it.level}"><a href="#${it.id}" data-toc-id="${it.id}">${it.text}</a></li>`)
      .join("");
    toc.innerHTML = `<p class="toc-label">Contents</p><ul>${list}</ul>`;

    const anchors = new Map();
    toc.querySelectorAll("a[data-toc-id]").forEach((a) => anchors.set(a.dataset.tocId, a));

    let activeId = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible.length === 0) return;
        const id = visible[0].target.id;
        if (id === activeId) return;
        if (activeId && anchors.get(activeId)) anchors.get(activeId).classList.remove("active");
        if (anchors.get(id)) anchors.get(id).classList.add("active");
        activeId = id;
      },
      { rootMargin: "-10% 0px -75% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
  }

  try {
    // Single request returns both post metadata and rendered HTML
    const res = await fetch(`/api/posts/slug/${slug}/rendered`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { post, renderedContent } = await res.json();

    const date = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : new Date(post.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

    document.title = `${post.title} — Bimbel Muda`;

    const tags = (post.tags || [])
      .map(
        (t) =>
          `<span class="px-2 py-0.5 bg-white/60 rounded-full text-xs font-poppins text-gray-500">${t}</span>`,
      )
      .join("");

    container.innerHTML = `
      <header class="mb-8 pb-6 border-b border-gray-200/60">
        <h1 class="text-3xl font-poppins font-semibold text-[#333] leading-tight mb-3">${post.title}</h1>
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs text-gray-400 font-poppins">${date}</span>
          <div class="flex flex-wrap gap-1">${tags}</div>
        </div>
      </header>
      <div class="prose max-w-none text-gray-800 leading-relaxed notebook-content">${renderedContent}</div>
    `;

    buildToc(container);

    // Only load Plotly if there are chart blocks in the rendered output
    const chartDivs = container.querySelectorAll(".plotly-chart[data-chart]");
    if (chartDivs.length > 0) {
      await loadScript("/vendor/plotly.js");
      if (typeof Plotly !== "undefined") {
        chartDivs.forEach((el) => {
          try {
            const spec = JSON.parse(decodeURIComponent(el.dataset.chart));
            const layout = Object.assign(
              {
                height: 400,
                margin: { t: 40, r: 20, b: 40, l: 50 },
                paper_bgcolor: "transparent",
                plot_bgcolor: "transparent",
              },
              spec.layout || {},
            );
            Plotly.newPlot(el, spec.data || [], layout, {
              responsive: true,
              displayModeBar: false,
            });
          } catch (e) {
            el.textContent = "Chart failed to render.";
            console.error("[plotly]", e);
          }
        });
      }
    }
  } catch (err) {
    container.innerHTML =
      '<p class="text-red-500 text-center py-12">Failed to load post.</p>';
    console.error("[post] load error:", err);
  }
})();
