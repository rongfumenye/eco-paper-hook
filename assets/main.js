// ===== 侧边栏抽屉 =====
const sidebar = document.querySelector('.sidebar');
const burger = document.querySelector('.burger');
const scrim = document.querySelector('.scrim');
if (burger && sidebar) {
  burger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (scrim) scrim.classList.toggle('on');
  });
  if (scrim) {
    scrim.addEventListener('click', () => {
      sidebar.classList.remove('open');
      scrim.classList.remove('on');
    });
  }
  document.querySelectorAll('.side-nav a').forEach(a => {
    a.addEventListener('click', () => {
      sidebar.classList.remove('open');
      if (scrim) scrim.classList.remove('on');
    });
  });
}

// ===== 滚动淡入 =====
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
    io.observe(el);
  });

  // 兜底：若观察器完全未生效（例如被 CSP/插件拦截），3 秒后强制显示全部内容
  setTimeout(() => {
    const anyShown = document.querySelector('.reveal.in');
    if (!anyShown) reveals.forEach(el => el.classList.add('in'));
  }, 3000);
} else {
  reveals.forEach(el => el.classList.add('in'));
}

// ===== 数字滚动 =====
const nums = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window && nums.length) {
  const ioNum = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const pre = el.dataset.pre || '';
      const suf = el.dataset.suf || '';
      const dec = parseInt(el.dataset.dec || 0);
      let start = null;
      const run = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1300, 1);
        const v = target * (1 - Math.pow(1 - p, 3));
        el.textContent = pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf;
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      ioNum.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => ioNum.observe(n));
} else {
  nums.forEach(el => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || 0);
    el.textContent = (el.dataset.pre || '') +
      (dec ? target.toFixed(dec) : Math.round(target).toLocaleString('en-US')) +
      (el.dataset.suf || '');
  });
}

// ===== 询价表单逻辑已迁移至 inquiry.js（含真后端+兜底）=====

// ===== 多语言：记住语言偏好 =====
(function () {
  var links = document.querySelectorAll('.lang-switch a, .tb-lang a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      var m = this.getAttribute('href').match(/(?:\.\.\/)?(en|zh|ru|ar)\//);
      if (m) { try { localStorage.setItem('ph-lang', m[1]); } catch (e) {} }
    });
  }
})();

// ===== 语言下拉菜单交互 =====
(function () {
  function closeAll(except) {
    var all = document.querySelectorAll('.lang-dd');
    for (var i = 0; i < all.length; i++) {
      if (all[i] !== except) {
        all[i].classList.remove('open');
        var btn = all[i].querySelector('.lang-dd-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    }
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.lang-dd-btn') : null;
    if (btn) {
      var dd = btn.parentElement;
      var willOpen = !dd.classList.contains('open');
      closeAll(dd);
      dd.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      e.stopPropagation();
      return;
    }
    // 点击下拉内选项：记忆语言偏好
    var item = e.target.closest ? e.target.closest('.lang-dd-menu a') : null;
    if (item) {
      var m = (item.getAttribute('href') || '').match(/(?:\.\.\/)?(?:en|zh|ru|ar)\//);
      if (!m) m = (item.getAttribute('href') || '').match(/^\/?(?:eco-paper-hook\/)?(en|zh|ru|ar)\//);
      if (m) { try { localStorage.setItem('ph-lang', m[1]); } catch (err) {} }
      return;
    }
    closeAll(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
