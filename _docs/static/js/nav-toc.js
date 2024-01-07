// from https://codepen.io/bramus/pen/ExaEqMJ
window.addEventListener('DOMContentLoaded', () => {

  let seen = [];

  const observer = new IntersectionObserver(entries => {
    const exists = entries.find(entry => (entry.intersectionRatio > 0));
    if (exists) {
      seen.forEach(el => el.classList.remove('active'));
      seen = [];
    }
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');

      const selector = `nav li a[href="#${id}"]`;
      if (entry.intersectionRatio > 0) {
        const parent = document.querySelector(selector).parentElement;
        seen.push(parent);
        parent.classList.add('active');
      }
    });
  });

  // Track all sections that have an `id` applied
  document.querySelectorAll('.anchor-link__source[id]').forEach((section) => {
    console.log("section: ", section);
    observer.observe(section);
  });

});
