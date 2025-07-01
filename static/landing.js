// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000, // animation duration
  once: true      // animate only once per element
});

// Additional JS if needed for smooth nav scrolling
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

document.querySelector('.newsletter button').addEventListener('click', function() {
  const email = document.querySelector('.newsletter input').value;
  if (email) {
    alert(`Thank you for subscribing with ${email}`);
  } else {
    alert('Please enter a valid email address!');
  }
});

