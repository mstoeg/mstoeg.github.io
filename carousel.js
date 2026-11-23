document.querySelectorAll('.carousel').forEach(function (box) {
  var track = box.querySelector('.carousel-track');
  var slides = track.children;
  var dots = box.querySelectorAll('.carousel-dot');
  function current() {
    var c = track.scrollLeft + track.clientWidth / 2, best = 0, d = 1e9;
    for (var i = 0; i < slides.length; i++) {
      var m = slides[i].offsetLeft + slides[i].offsetWidth / 2;
      if (Math.abs(m - c) < d) { d = Math.abs(m - c); best = i; }
    }
    return best;
  }
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    var s = slides[i];
    track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' });
  }
  function sync() {
    var c = current();
    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.toggle('is-active', i === c);
      dots[i].classList.toggle('is-active', i === c);
    }
  }
  box.querySelector('.carousel-prev').onclick = function () { go(current() - 1); };
  box.querySelector('.carousel-next').onclick = function () { go(current() + 1); };
  dots.forEach(function (d, i) { d.onclick = function () { go(i); }; });
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(current() + 1);
    if (e.key === 'ArrowLeft') go(current() - 1);
  });
  var timer = null, paused = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start() {
    if (reduced || timer) return;
    timer = setInterval(function () {
      if (paused || document.hidden) return;
      var c = current();
      go(c >= slides.length - 1 ? 0 : c + 1);
    }, 5000);
  }
  ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) {
    box.addEventListener(ev, function () { paused = true; }, { passive: true });
  });
  ['mouseleave', 'focusout', 'touchend'].forEach(function (ev) {
    box.addEventListener(ev, function () { paused = false; }, { passive: true });
  });
  window.addEventListener('load', function () { go(0); sync(); start(); });
  sync();
});
