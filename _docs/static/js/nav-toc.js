// from https://codepen.io/bramus/pen/ExaEqMJ
window.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");

      const selector = `nav li a[href="#${id}"]`;
      const parent = document.querySelector(selector).parentElement;
      if (entry.intersectionRatio > 0) {
        parent.classList.add("active");
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
