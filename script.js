/* ==========================================================
   Atelier Cucina — script.js
   - Scroll animation Canvas (food-fresh, 151 frame .webp, cover)
   - IntersectionObserver: .fade-up, .text-reveal, .stagger-card
   - Parallax image su .parallax-wrap
   - Anno corrente nel footer
   Vanilla JS, no dipendenze esterne.
   ========================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------
     Anno corrente nel footer
     -------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl && (!yearEl.textContent || /^\{\{/.test(yearEl.textContent))) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------
     Scroll Animation — food-fresh (§4.2 cover mode)
     Solo su pagine che contengono #scroll-anim (index.html)
     -------------------------------------------------------- */
  var canvas = document.getElementById('scroll-canvas');
  var section = document.getElementById('scroll-anim');

  if (canvas && section) {
    var ctx = canvas.getContext('2d');
    var pin = section.querySelector('.scroll-anim-pin');

    var FRAME_PATH = 'assets/scroll/frames-upscaled/';
    var FRAME_COUNT = 151;
    var FRAME_PREFIX = 'frame_';
    var FRAME_PAD = 4;
    var FRAME_EXT = '.webp';

    var images = [];
    var loaded = 0;

    function setupCanvas() {
      var dpr = window.devicePixelRatio || 1;
      var cw = pin.clientWidth;
      var ch = pin.clientHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = cw + 'px';
      canvas.style.height = ch + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function render(progress) {
      var idx = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(progress * FRAME_COUNT))
      );
      var img = images[idx];
      if (!img || !img.complete) return;

      var cw = pin.clientWidth;
      var ch = pin.clientHeight;
      var iw = img.naturalWidth;
      var ih = img.naturalHeight;

      var scale = Math.max(cw / iw, ch / ih);
      var dw = iw * scale;
      var dh = ih * scale;
      var dx = (cw - dw) / 2;
      var dy = (ch - dh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function onScroll() {
      var rect = section.getBoundingClientRect();
      var scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) { render(0); return; }
      var progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      render(progress);
    }

    for (var i = 1; i <= FRAME_COUNT; i++) {
      var img = new Image();
      var num = String(i);
      while (num.length < FRAME_PAD) num = '0' + num;
      img.src = FRAME_PATH + FRAME_PREFIX + num + FRAME_EXT;
      img.onload = (function () {
        loaded++;
        if (loaded === 1) {
          setupCanvas();
          onScroll();
        }
      });
      images.push(img);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      setupCanvas();
      onScroll();
    });
  }

  /* --------------------------------------------------------
     Parallax Image — offset multiplier 300
     -------------------------------------------------------- */
  var parallaxWraps = document.querySelectorAll('.parallax-wrap');

  function updateParallax() {
    parallaxWraps.forEach(function (wrap) {
      var img = wrap.querySelector('.parallax-image');
      if (!img) return;
      var rect = wrap.getBoundingClientRect();
      var viewH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewH) return;
      var progress = (viewH - rect.top) / (viewH + rect.height);
      var offset = (progress - 0.5) * 300;
      img.style.transform = 'translateY(' + offset + 'px)';
    });
  }

  if (parallaxWraps.length) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* --------------------------------------------------------
     IntersectionObserver — Fade Up + Text Reveal
     -------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.fade-up, .text-reveal').forEach(function (el) {
      fadeObserver.observe(el);
    });

    /* Stagger Cards */
    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.dataset.stagger || 0, 10) * 180;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-card').forEach(function (el) {
      staggerObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-up, .text-reveal, .stagger-card').forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();

// ----------------------------------------------------------
// Animation Pass — Text Reveal (wrapper), Image Reveal, Tilt 3D, Typewriter
// ----------------------------------------------------------
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-wrapper').forEach(function (el) {
      el.classList.add('visible');
    });
    document.querySelectorAll('.image-reveal').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  // Text Reveal observer (wrapper variant)
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal-wrapper').forEach(function (el) {
    revealObs.observe(el);
  });

  // Image Reveal observer
  var imageRevealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        imageRevealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.image-reveal').forEach(function (el) {
    imageRevealObs.observe(el);
  });

  // Tilt 3D soft — desktop only
  if (!('ontouchstart' in window)) {
    var ROT_MAX = 5;
    document.querySelectorAll('.tilt-soft').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotY = (x - 0.5) * ROT_MAX * 2;
        var rotX = (0.5 - y) * ROT_MAX * 2;
        card.style.transform = 'perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.02)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  // Typewriter
  var twEl = document.getElementById('tw-hero');
  if (twEl) {
    var words = [];
    try { words = JSON.parse(twEl.getAttribute('data-words') || '[]'); } catch (e) {}
    if (words.length) {
      var cursor = document.createElement('span');
      cursor.className = 'tw-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      twEl.textContent = '';
      twEl.parentNode.insertBefore(cursor, twEl.nextSibling);

      var wordIdx = 0;
      var charIdx = 0;
      var isErasing = false;
      var TYPE_SPEED = 90;
      var ERASE_SPEED = 50;
      var PAUSE = 1400;

      function twTick() {
        var word = words[wordIdx];
        if (!isErasing) {
          charIdx++;
          twEl.textContent = word.substring(0, charIdx);
          if (charIdx === word.length) {
            isErasing = true;
            setTimeout(twTick, PAUSE);
          } else {
            setTimeout(twTick, TYPE_SPEED);
          }
        } else {
          charIdx--;
          twEl.textContent = word.substring(0, charIdx);
          if (charIdx === 0) {
            isErasing = false;
            wordIdx = (wordIdx + 1) % words.length;
            setTimeout(twTick, TYPE_SPEED);
          } else {
            setTimeout(twTick, ERASE_SPEED);
          }
        }
      }

      setTimeout(twTick, PAUSE);
    }
  }

})();
