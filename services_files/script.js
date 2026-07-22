/* =====================================================
   XTX TRANSPORT - Main JavaScript
   Version: 2026
   ===================================================== */

'use strict';

/* =====================================================
   SPLASH LOADER
   ===================================================== */
window.addEventListener('load', function () {
  setTimeout(function () {
    const loader = document.getElementById('splash-loader');
    if (loader) {
      loader.classList.add('hide');
      setTimeout(() => { loader.style.display = 'none'; }, 800);
    }
  }, 2400);
});

/* =====================================================
   STICKY NAVBAR
   ===================================================== */
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  });
}

/* =====================================================
   HERO SLIDER
   ===================================================== */
(function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;

  let current = 0;
  let autoplayTimer = null;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() { goToSlide(current + 1); }
  function prevSlide() { goToSlide(current - 1); }

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5500);
  }

  // Dots
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goToSlide(i);
      startAutoplay();
    });
  });

  // Arrows
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoplay(); });

  // Touch swipe
  let touchStartX = 0;
  const heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    heroSlider.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; });
    heroSlider.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide(); else prevSlide();
        startAutoplay();
      }
    });
  }

  startAutoplay();
})();

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
(function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(function (el) { observer.observe(el); });
})();

/* =====================================================
   COUNTER ANIMATION
   ===================================================== */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const decimals = el.getAttribute('data-decimals') || 0;

        function update(timestamp) {
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = eased * target;
          el.textContent = prefix + value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function (counter) { observer.observe(counter); });
})();

/* =====================================================
   BACK TO TOP
   ===================================================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* =====================================================
   MULTI-STEP DRIVER FORM
   ===================================================== */
(function initDriverForm() {
  const modal = document.getElementById('driverModal');
  if (!modal) return;

  let currentStep = 1;
  const totalSteps = 3;

  function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(function (s) { s.classList.remove('active'); });
    document.querySelectorAll('.step-dot').forEach(function (d, i) {
      d.classList.remove('active', 'done');
      if (i + 1 < step) d.classList.add('done');
      if (i + 1 === step) d.classList.add('active');
    });
    document.querySelectorAll('.step-line').forEach(function (l, i) {
      l.classList.toggle('done', i < step - 1);
    });
    const activeStep = document.getElementById('step' + step);
    if (activeStep) activeStep.classList.add('active');
    currentStep = step;

    const prevBtn = document.getElementById('stepPrev');
    const nextBtn = document.getElementById('stepNext');
    const submitBtn = document.getElementById('stepSubmit');
    if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = step === totalSteps ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
  }

  function validateStep(step) {
    const fields = document.querySelectorAll('#step' + step + ' [required]');
    let valid = true;
    fields.forEach(function (field) {
      field.classList.remove('is-invalid');
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        valid = false;
      }
    });
    return valid;
  }

  const nextBtn = document.getElementById('stepNext');
  const prevBtn = document.getElementById('stepPrev');
  const submitBtn = document.getElementById('stepSubmit');
  const driverForm = document.getElementById('driverForm');

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (validateStep(currentStep)) goToStep(currentStep + 1);
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToStep(currentStep - 1);
    });
  }

  if (driverForm) {
    driverForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      const submitBtnEl = document.getElementById('stepSubmit');
      if (submitBtnEl) {
        submitBtnEl.disabled = true;
        submitBtnEl.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
      }

      const formData = new FormData(driverForm);
      formData.append('form_type', 'driver_application');

      formData.append('access_key', '4e22f732-e4a0-4e41-a4b6-26b84065e4c7');
      formData.append('subject', 'XTX Website - ' + formData.get('form_type'));
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(function (r) { if (!r.ok) throw new Error('failed'); return r.json(); })
        .then(function (data) {
          const firstName = document.getElementById('driverFirstName')?.value || 'Driver';
          const formContainer = document.getElementById('driverFormContainer');
          const successEl = document.getElementById('driverSuccess');
          if (formContainer) formContainer.style.display = 'none';
          if (successEl) {
            successEl.style.display = 'block';
            const nameEl = successEl.querySelector('.success-name');
            if (nameEl) nameEl.textContent = firstName;
          }
        })
        .catch(function () {
          alert('Sorry, submission failed. Please email CONTACT@XTXTRANSPORT.COM directly.'); return;
          const firstName = document.getElementById('driverFirstName')?.value || 'Driver';
          const formContainer = document.getElementById('driverFormContainer');
          const successEl = document.getElementById('driverSuccess');
          if (formContainer) formContainer.style.display = 'none';
          if (successEl) {
            successEl.style.display = 'block';
            const nameEl = successEl.querySelector('.success-name');
            if (nameEl) nameEl.textContent = firstName;
          }
        });
    });
  }

  // Reset on modal close
  if (modal) {
    modal.addEventListener('hidden.bs.modal', function () {
      goToStep(1);
      if (driverForm) driverForm.reset();
      document.querySelectorAll('.form-step [required]').forEach(function (f) { f.classList.remove('is-invalid'); });
      const formContainer = document.getElementById('driverFormContainer');
      const successEl = document.getElementById('driverSuccess');
      if (formContainer) formContainer.style.display = 'block';
      if (successEl) successEl.style.display = 'none';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Application'; }
    });
  }

  goToStep(1);
})();

/* =====================================================
   QUOTE FORM
   ===================================================== */
(function initQuoteForm() {
  const quoteForm = document.getElementById('quoteForm');
  if (!quoteForm) return;

  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = quoteForm.querySelector('[type="submit"]');
    const origText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    }

    const formData = new FormData(quoteForm);
    formData.append('form_type', 'quote_request');

    formData.append('access_key', '4e22f732-e4a0-4e41-a4b6-26b84065e4c7');
      formData.append('subject', 'XTX Website - ' + formData.get('form_type'));
      fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(function (r) { if (!r.ok) throw new Error('failed'); return r.json(); })
      .then(showQuoteSuccess)
      .catch(showQuoteSuccess);

    function showQuoteSuccess() {
      const name = quoteForm.querySelector('[name="name"]')?.value || 'Customer';
      const container = document.getElementById('quoteFormContainer');
      const success = document.getElementById('quoteSuccess');
      if (container) container.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        const nameEl = success.querySelector('.success-name');
        if (nameEl) nameEl.textContent = name;
      }
    }
  });
})();

/* =====================================================
   CARRIER FORM
   ===================================================== */
(function initCarrierForm() {
  const carrierForm = document.getElementById('carrierForm');
  if (!carrierForm) return;

  carrierForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = carrierForm.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    }

    const formData = new FormData(carrierForm);
    formData.append('form_type', 'carrier_inquiry');

    formData.append('access_key', '4e22f732-e4a0-4e41-a4b6-26b84065e4c7');
      formData.append('subject', 'XTX Website - ' + formData.get('form_type'));
      fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(function (r) { if (!r.ok) throw new Error('failed'); return r.json(); })
      .then(showSuccess)
      .catch(showSuccess);

    function showSuccess() {
      const name = carrierForm.querySelector('[name="name"]')?.value || 'Carrier';
      const container = document.getElementById('carrierFormContainer');
      const success = document.getElementById('carrierSuccess');
      if (container) container.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        const nameEl = success.querySelector('.success-name');
        if (nameEl) nameEl.textContent = name;
      }
    }
  });
})();

/* =====================================================
   CONTACT FORM
   ===================================================== */
(function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    }

    const formData = new FormData(contactForm);
    formData.append('form_type', 'general_contact');

    formData.append('access_key', '4e22f732-e4a0-4e41-a4b6-26b84065e4c7');
      formData.append('subject', 'XTX Website - ' + formData.get('form_type'));
      fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(function (r) { if (!r.ok) throw new Error('failed'); return r.json(); })
      .then(showSuccess)
      .catch(showSuccess);

    function showSuccess() {
      const name = contactForm.querySelector('[name="name"]')?.value || 'Friend';
      const container = document.getElementById('contactFormContainer');
      const success = document.getElementById('contactSuccess');
      if (container) container.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        const nameEl = success.querySelector('.success-name');
        if (nameEl) nameEl.textContent = name;
      }
    }
  });
})();

/* =====================================================
   ACTIVE NAV LINK
   ===================================================== */
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navMap = {
    'index.html': '.nav-home',
    '': '.nav-home',
    'about.html': '.nav-about',
    'services.html': '.nav-services',
    'safety.html': '.nav-safety',
    'shippers.html': '.nav-shippers',
    'carriers.html': '.nav-carriers',
    'drivers.html': '.nav-drivers',
    'contact.html': '.nav-contact'
  };
  const selector = navMap[currentPage];
  if (selector) {
    const el = document.querySelector(selector);
    if (el) el.classList.add('active');
  }
})();

/* =====================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =====================================================
   PARALLAX (LIGHTWEIGHT)
   ===================================================== */
(function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length || window.innerWidth < 768) return;

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    parallaxEls.forEach(function (el) {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el.style.transform = 'translateY(' + scrollY * speed + 'px)';
      }
    });
  }, { passive: true });
})();

(function(){
  var pages=['index.html','about.html','services.html','safety.html','shippers.html','carriers.html','contact.html'];
  var labels=['Home','About','Services','Safety','Shippers','Carriers','Contact'];
  var f=window.location.pathname.split('/').pop();
  if(!f||f==='')f='index.html';
  var i=pages.indexOf(f);
  if(i<0)return;
  function mk(href,dir,label){
    var a=document.createElement('a');
    a.className='pageturn pageturn-'+dir;
    a.href=href;
    a.title=label;
    a.setAttribute('aria-label',label);
    a.innerHTML='<i class="fas fa-chevron-'+(dir==='prev'?'left':'right')+'"></i>';
    document.body.appendChild(a);
  }
  if(i>0)mk(pages[i-1],'prev',labels[i-1]);
  if(i<pages.length-1)mk(pages[i+1],'next',labels[i+1]);
})();