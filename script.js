const PASSWORD = '2323';
const AUTH_KEY = 'eevsetup_auth';

const gate = document.getElementById('login-gate');
const form = document.getElementById('login-form');
const input = document.getElementById('password-input');
const error = document.getElementById('login-error');

function unlock() {
  document.body.classList.remove('locked');
  document.body.classList.add('authenticated');
  gate.remove();
}

if (sessionStorage.getItem(AUTH_KEY) === '1') unlock();

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (input.value === PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, '1');
    unlock();
  } else {
    error.textContent = 'INCORRECT PASSWORD';
    input.value = '';
    input.focus();
  }
});

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

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('.software-icon img').forEach((img) => {
  img.addEventListener('error', () => {
    const box = img.closest('.software-icon');
    if (!box) return;
    box.classList.add('fallback');
    box.dataset.fallback = img.dataset.fallback || img.alt.replace(/ icon$/i, '').slice(0, 4);
  });
});
