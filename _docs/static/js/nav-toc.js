// from https://codepen.io/bramus/pen/ExaEqMJ
window.addEventListener("DOMContentLoaded", () => {
  const shouldScroll = () => (window.innerWidth >= 992 ? true : false);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");

      const selector = `nav li a[href="#${id}"]`;
      const link = document.querySelector(selector);
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const elem = document.querySelector(`[id="${id}"]`);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      const parent = link.parentElement;
      if (entry.intersectionRatio > 0) {
        parent.classList.add("active");
        if (shouldScroll()) {
          parent.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        }
      } else {
        parent.classList.remove("active");
      }
    });
  });

  // Track all sections that have an `id` applied
  document.querySelectorAll(".anchor-link__source[id]").forEach((section) => {
    console.log("section: ", section);
    observer.observe(section);
  });
});
