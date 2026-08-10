// Header shrink on scroll
const header = document.getElementById('site-header');
if(header){
  const toggleHeaderState = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive: true });
}

// Brand logo intro animation (once per session)
const logo = document.querySelector('header .logo');
if(logo){
  const hasPlayedLogoIntro = sessionStorage.getItem('swcLogoIntroPlayed');

  if(hasPlayedLogoIntro){
    logo.classList.add('is-ready');
  } else {
    requestAnimationFrame(() => {
      logo.classList.add('is-animating');
      logo.addEventListener('animationend', () => {
        logo.classList.remove('is-animating');
        logo.classList.add('is-ready');
        sessionStorage.setItem('swcLogoIntroPlayed', 'true');
      }, { once: true });
    });
  }
}

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold:.15 });
reveals.forEach(el=>io.observe(el));

// Process tabs (Process page)
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.process-track').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.process-track[data-track="${btn.dataset.tab}"]`).classList.add('active');
  });
});

// Gallery filter (Gallery page)
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item=>{
      item.classList.toggle('hide', f !== 'all' && item.dataset.cat !== f);
    });
  });
});

// Segmented control (Contact page)
document.querySelectorAll('.seg-opt').forEach(opt=>{
  opt.addEventListener('click', ()=>{
    document.querySelectorAll('.seg-opt').forEach(o=>o.classList.remove('checked'));
    opt.classList.add('checked');
    opt.querySelector('input').checked = true;
  });
});

// Contact / enquiry Formspree integration
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if(contactForm && formStatus){
  contactForm.addEventListener('submit', async (event)=>{
    event.preventDefault();

    if(!contactForm.checkValidity()){
      contactForm.reportValidity();
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const endpoint = contactForm.getAttribute('action');

    if(!endpoint || endpoint.trim() === '' || endpoint.trim() === 'YOUR_FORMSPREE_ENDPOINT'){
      formStatus.textContent = 'Formspree endpoint is not configured yet. Please add the Formspree endpoint to the form action.';
      formStatus.className = 'form-status error';
      return;
    }

    if(submitButton){
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if(!response.ok){
        throw new Error('Request failed');
      }

      formStatus.textContent = 'Thank you! Your enquiry has been submitted successfully.';
      formStatus.className = 'form-status success';
      contactForm.reset();

      document.querySelectorAll('.seg-opt').forEach(o=>o.classList.remove('checked'));
      const homeOpt = document.querySelector('#seg-home');
      if(homeOpt){
        homeOpt.classList.add('checked');
        const radio = homeOpt.querySelector('input[type="radio"]');
        if(radio){ radio.checked = true; }
      }
    } catch (error) {
      formStatus.textContent = 'There was a problem sending your enquiry. Please try again.';
      formStatus.className = 'form-status error';
    } finally {
      if(submitButton){
        submitButton.disabled = false;
        submitButton.textContent = 'Send Inquiry';
      }
    }
  });
}
