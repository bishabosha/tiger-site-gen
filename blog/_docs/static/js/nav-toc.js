// from https://codepen.io/bramus/pen/ExaEqMJ
window.addEventListener("DOMContentLoaded", () => {
  const toggler = document.getElementById("sidebar-toggler");
  const sidebar = document.getElementById("sidebar-anchor");

  const activeIds = new Set();
  const exited = new Set();

  const select = (id) => {
    const selector = `nav li a[href="#${id}"]`;
    return document.querySelector(selector);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const link = select(id);

      // Skip if no matching navigation link found
      if (!link) {
        return;
      }

      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (toggler && sidebar && sidebar.classList.contains("expanded")) {
          toggler.click();
        }
        entry.target.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      const parent = link.parentElement;
      if (entry.intersectionRatio > 0) {
        parent.classList.add("active");
        activeIds.add(id);
        parent.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      } else {
        exited.add(id);
      }
    });

    const willRemain = [...activeIds].filter((x) => !exited.has(x));
    if (willRemain.length > 0) {
      // keep at least one active, even if nothing is intersecting
      exited.forEach((id) => {
        activeIds.delete(id);
        const link = select(id);
        // Skip if no matching navigation link found
        if (!link) {
          return;
        }
        const parent = link.parentElement;
        parent.classList.remove("active");
      });
      exited.clear();
    }
  });

  // Track all sections that have an `id` applied
  document.querySelectorAll(".anchor-link__source[id]").forEach((section) => {
    observer.observe(section);
  });
});
