document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }

  // Preloader
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 1000);
  }

  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    const closeMenu = document.querySelector('.close-menu');
    if (closeMenu) {
      closeMenu.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // Sticky Header on scroll
  const header = document.querySelector('.sticky-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 100);
    });
  }

  // Back to Top Button
  const backToTopBtn = document.querySelector('#backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible', 'animate__fadeIn');
        backToTopBtn.classList.remove('animate__fadeOut');
      } else {
        backToTopBtn.classList.remove('animate__fadeIn');
        backToTopBtn.classList.add('animate__fadeOut');
        setTimeout(() => {
          if (window.scrollY <= 300) {
            backToTopBtn.classList.remove('visible');
          }
        }, 500);
      }
    });

    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Floating Action Button Toggle
  const fabMain = document.querySelector('.fab-main');
  if (fabMain) {
    fabMain.addEventListener('click', function () {
      document.querySelector('.fab-container').classList.toggle('active');
    });
  }

  // Testimonial Slider
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function showSlide(index) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    testimonialSlides[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentSlide = index;
  }

  if (testimonialDots.length > 0) {
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', () => showSlide(index));
    });

    setInterval(() => {
      showSlide((currentSlide + 1) % testimonialSlides.length);
    }, 5000);
  }

  // Typing Text Effect
  const typingText = document.querySelector('.typing-text');
  if (typingText && typingText.getAttribute('data-text')) {
    const texts = JSON.parse(typingText.getAttribute('data-text'));
    let textIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
      const currentText = texts[textIndex];
      typingText.textContent = isDeleting
        ? currentText.substring(0, --charIndex)
        : currentText.substring(0, ++charIndex);

      let typingSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1500;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
  }

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // GSAP Scroll Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Animate feature cards
    const cards = document.querySelectorAll('.feature-card');
    if (cards.length) {
      gsap.utils.toArray(cards).forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1
        });
      });
    }

    // Hero animations
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    if (heroContent) {
      gsap.from(heroContent, {
        duration: 1,
        x: -100,
        opacity: 0,
        ease: 'power3.out'
      });
    }

    if (heroImage) {
      gsap.from(heroImage, {
        duration: 1,
        x: 100,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
      });
    }
  }

  // Particles.js Background
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#4361ee' },
        shape: { type: 'circle' },
        opacity: { value: 0.3 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#4361ee', opacity: 0.2, width: 1 },
        move: { enable: true, speed: 2 }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' }
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }

  // Pricing Switch Toggle
  const pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', function () {
      document.querySelectorAll('.price').forEach(price => {
        price.classList.toggle('active');
      });
    });
  }
});
