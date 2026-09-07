window.addEventListener("DOMContentLoaded", () => {
  const toggler = document.getElementById("sidebar-toggler");
  const sidebar = document.getElementById("sidebar-anchor");

  if (toggler && sidebar && toggler.children.length) {
    const innerText = toggler.children[0];

    toggler.addEventListener("click", () => {
      sidebar.classList.toggle("expanded");
      if (innerText) {
        innerText.classList.toggle("fa-square-caret-right");
        innerText.classList.toggle("fa-square-caret-left");
      }
    });
  }
});
