// from https://codepen.io/bramus/pen/ExaEqMJ
window.addEventListener("DOMContentLoaded", () => {
  const shouldScroll = () => (window.innerWidth >= 992 ? true : false);

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
      link.addEventListener("click", function (e) {
        e.preventDefault();
        entry.target.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      const parent = link.parentElement;
      if (entry.intersectionRatio > 0) {
        parent.classList.add("active");
        activeIds.add(id);
        if (shouldScroll()) {
          parent.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        }
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
