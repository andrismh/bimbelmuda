(function () {
  const textarea = document.getElementById("blogContent");
  if (!textarea || typeof EasyMDE === "undefined") return;

  function insertFenced(editor, opening, body, closing) {
    const cm = editor.codemirror;
    const doc = cm.getDoc();
    const cursor = doc.getCursor();
    const atLineStart = cursor.ch === 0;
    const prefix = atLineStart ? "" : "\n";
    const snippet = `${prefix}${opening}\n${body}\n${closing}\n`;
    doc.replaceRange(snippet, cursor);
    const bodyLine = cursor.line + (atLineStart ? 1 : 2);
    doc.setCursor({ line: bodyLine, ch: body.length });
    cm.focus();
  }

  window.easyMDE = new EasyMDE({
    element: textarea,
    spellChecker: false,
    autosave: { enabled: false },
    placeholder:
      "Write your post in Markdown...\n\n```python\nprint('hello')\n```\n\n```output\nhello\n```",
    toolbar: [
      "bold",
      "italic",
      "heading",
      "|",
      "quote",
      "unordered-list",
      "ordered-list",
      "|",
      "link",
      "image",
      "|",
      {
        name: "code-snippet",
        className: "fa fa-file-code-o",
        title: "Insert code snippet",
        action: function (editor) {
          const lang = (
            window.prompt(
              "Language (e.g. python, javascript, sql, r, bash)",
              "python",
            ) || ""
          ).trim();
          insertFenced(editor, "```" + lang, "", "```");
        },
      },
      {
        name: "code-output",
        className: "fa fa-terminal",
        title: "Insert code output block",
        action: function (editor) {
          insertFenced(editor, "```output", "", "```");
        },
      },
      {
        name: "chart",
        className: "fa fa-bar-chart",
        title: "Insert Plotly chart block",
        action: function (editor) {
          const skeleton = JSON.stringify(
            {
              data: [{ x: [1, 2, 3], y: [2, 4, 3], type: "scatter" }],
              layout: { title: "Chart title" },
            },
            null,
            2,
          );
          insertFenced(editor, "```chart", skeleton, "```");
        },
      },
      "|",
      "preview",
      "side-by-side",
      "fullscreen",
      "|",
      "guide",
    ],
    previewRender: function (text) {
      return typeof marked !== "undefined" && marked.parse
        ? marked.parse(text)
        : text;
    },
  });
})();
