window.addEventListener("DOMContentLoaded", () => {
  const tocToggler = document.getElementById("toc-toggler");
  const sidebarExpander = document.getElementById("sidebar-expander");
  const mainContent = document.querySelector(".main-content");
  const row = mainContent?.parentElement;

  if (tocToggler && row) {
    tocToggler.addEventListener("click", () => {
      row.classList.toggle("sidebar-collapsed");
      document.body.classList.toggle("sidebar-collapsed");
      const icon = tocToggler.querySelector("i");
      if (row.classList.contains("sidebar-collapsed")) {
        icon.classList.remove("fa-square-caret-down");
        icon.classList.add("fa-square-caret-left");
      } else {
        icon.classList.remove("fa-square-caret-left");
        icon.classList.add("fa-square-caret-down");
      }
    });
  }

  if (sidebarExpander && row) {
    sidebarExpander.addEventListener("click", () => {
      row.classList.remove("sidebar-collapsed");
      document.body.classList.remove("sidebar-collapsed");
      const tocToggler = document.getElementById("toc-toggler");
      const icon = tocToggler?.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-square-caret-left");
        icon.classList.add("fa-square-caret-down");
      }
    });
  }
});
