document.addEventListener('DOMContentLoaded', _ => {
  // hljs.highlightAll();
  hljs.configure({
    languages: ["scala"]
  })
  hljs.registerLanguage("scala", highlightDotty);
  hljs.initHighlighting();
});
