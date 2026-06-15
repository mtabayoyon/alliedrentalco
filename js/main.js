// Nav toggle
(function(){
  var t = document.getElementById('nt');
  var n = document.getElementById('mn');
  if(!t || !n) return;

  t.addEventListener('click', function(e){
    e.stopPropagation();
    var isOpen = n.classList.toggle('open');
    t.setAttribute('aria-expanded', isOpen);
    // Animate hamburger to X
    var spans = t.querySelectorAll('span');
    if(isOpen){
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close when clicking outside
  document.addEventListener('click', function(e){
    if(!n.contains(e.target) && !t.contains(e.target)){
      n.classList.remove('open');
      t.setAttribute('aria-expanded','false');
      t.querySelectorAll('span').forEach(function(s){ s.style.transform=''; s.style.opacity=''; });
    }
  });

  // Close when a nav link is clicked
  n.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      n.classList.remove('open');
      t.setAttribute('aria-expanded','false');
      t.querySelectorAll('span').forEach(function(s){ s.style.transform=''; s.style.opacity=''; });
    });
  });
})();

// FAQ accordion
document.querySelectorAll('.fq').forEach(function(b){
  b.addEventListener('click',function(){
    var a=this.nextElementSibling, o=this.classList.contains('open');
    document.querySelectorAll('.fq').forEach(function(x){
      x.classList.remove('open');
      x.setAttribute('aria-expanded','false');
      if(x.nextElementSibling) x.nextElementSibling.classList.remove('open');
    });
    if(!o){
      this.classList.add('open');
      this.setAttribute('aria-expanded','true');
      if(a) a.classList.add('open');
    }
  });
});

// Fade-up animations on scroll
if(window.IntersectionObserver){
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(x){
      if(x.isIntersecting){ x.target.style.animationPlayState='running'; obs.unobserve(x.target); }
    });
  },{threshold:0.1});
  document.querySelectorAll('.fu').forEach(function(el){
    el.style.animationPlayState='paused'; obs.observe(el);
  });
}

// Contact form — Formspree → dispatch@teamallied.co
var cf = document.getElementById('contact-form');
if(cf){
  cf.addEventListener('submit', function(e){
    e.preventDefault();
    var btn = cf.querySelector('.bsub');
    var originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    var formData = new FormData(cf);
    fetch('https://formspree.io/f/mkoazalp',{
      method:'POST', body:formData, headers:{'Accept':'application/json'}
    }).then(function(r){
      if(r.ok){
        btn.textContent = "✓ Message Sent! We'll call you within 30 minutes.";
        btn.style.background = '#008000';
        cf.reset();
      } else {
        throw new Error('failed');
      }
    }).catch(function(){
      btn.textContent = 'Submission failed — please call (415) 529-5637';
      btn.style.background = 'var(--red)';
      btn.disabled = false;
      setTimeout(function(){ btn.textContent=originalText; btn.style.background=''; }, 5000);
    });
  });
}


// Lead form submission
document.querySelectorAll('.lead-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.lf-submit');
    const success = form.querySelector('.lf-success');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const data = new FormData(form);
      await fetch('https://formspree.io/f/xpwzgbjq', {method:'POST',body:data,headers:{'Accept':'application/json'}});
      form.querySelector('.lf-grid').style.display = 'none';
      if(success){ success.style.display='block'; }
    } catch(err) {
      btn.textContent = 'Submit Assessment Request';
      btn.disabled = false;
    }
  });
});

// Sticky bar show/hide on scroll
(function(){
  var bar = document.querySelector('.stc');
  if(!bar) return;
  var hero = document.querySelector('.hero, section');
  if(!hero) return;
  window.addEventListener('scroll', function(){
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    bar.style.display = window.scrollY > heroBottom ? 'block' : 'none';
  }, {passive:true});
})();
