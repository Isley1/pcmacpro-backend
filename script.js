
  // Hamburger menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  function closeMobile() {
    mobileMenu.classList.remove('open');
  }

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Form submission
  function submitForm() {
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const deviceType = document.getElementById('deviceType').value;
    const deviceModel = document.getElementById('deviceModel').value.trim();
    const repairType = document.getElementById('repairType').value;
    const issue = document.getElementById('issue').value.trim();
    const serviceOption = document.getElementById('serviceOption').value;
    const source = document.getElementById('source').value;

    if (!fname || !lname || !phone || !deviceType || !deviceModel || !repairType || !issue) {
      alert('Please fill in all required fields (marked with *).');
      return;
    }

    // Disable submit button to prevent double submissions
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Send form data to backend
    fetch('https://pcmacpro-backend.onrender.com/submit-repair-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fname,
        lname,
        phone,
        email,
        deviceType,
        deviceModel,
        repairType,
        issue,
        serviceOption,
        source
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('successPhone').textContent = phone;
        document.getElementById('formContent').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        alert('Error submitting form: ' + (data.message || 'Unknown error'));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Repair Request →';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error submitting form. Please check the server is running or try again later.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Repair Request →';
    });
  }

  function resetForm() {
    document.getElementById('formContent').style.display = 'block';
    document.getElementById('formSuccess').style.display = 'none';
    ['fname','lname','phone','email','deviceType','deviceModel','repairType','issue'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  // Contact form submission
  function submitContactForm() {
    const fname = document.getElementById('contact-fname').value.trim();
    const lname = document.getElementById('contact-lname').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!fname || !lname || !email || !subject || !message) {
      alert('Please fill in all required fields (marked with *).');
      return;
    }

    // Disable submit button to prevent double submissions
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Send form data to backend
    fetch('https://pcmacpro-backend.onrender.com/submit-contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
        phone,
        subject,
        message
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('contactFormContent').style.display = 'none';
        document.getElementById('contactFormSuccess').style.display = 'block';
      } else {
        alert('Error submitting form: ' + (data.message || 'Unknown error'));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message →';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error submitting form. Please check the server is running or try again later.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
    });
  }

  function resetContactForm() {
    document.getElementById('contactFormContent').style.display = 'block';
    document.getElementById('contactFormSuccess').style.display = 'none';
    ['contact-fname','contact-lname','contact-email','contact-phone','contact-subject','contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  // Device section image galleries
  document.querySelectorAll('[data-device-gallery]').forEach((root) => {
    const track = root.querySelector('.device-gallery-track');
    const slides = root.querySelectorAll('.device-gallery-slide');
    const prev = root.querySelector('.device-gallery-prev');
    const next = root.querySelector('.device-gallery-next');
    const dotsWrap = root.querySelector('.device-gallery-dots');
    if (!track || !slides.length || !prev || !next || !dotsWrap) return;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'device-gallery-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Photo ${i + 1} of ${slides.length}`);
      dot.addEventListener('click', () => {
        track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
      });
      dotsWrap.appendChild(dot);
    });

    function syncDots() {
      const w = track.clientWidth;
      if (!w) return;
      const idx = Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / w)));
      dotsWrap.querySelectorAll('.device-gallery-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === idx);
      });
    }

    let scrollTick = false;
    track.addEventListener('scroll', () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        scrollTick = false;
        syncDots();
      });
    }, { passive: true });

    function step(delta) {
      const w = track.clientWidth;
      const idx = Math.round(track.scrollLeft / w);
      const nextIdx = Math.min(slides.length - 1, Math.max(0, idx + delta));
      track.scrollTo({ left: nextIdx * w, behavior: 'smooth' });
    }

    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
  });