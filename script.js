const items = document.querySelectorAll('.software-card, .hero-copy, .console, .download > *, .section-title');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

items.forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(25px)';
  item.style.transition = `opacity .7s ease ${Math.min(index * 45, 500)}ms, transform .7s cubic-bezier(.22,1,.36,1) ${Math.min(index * 45, 500)}ms`;
  observer.observe(item);
});

// Keep anchor navigation feeling smooth even when opened from another page state.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
