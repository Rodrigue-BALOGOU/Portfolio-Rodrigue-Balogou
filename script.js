/*script.js — Rodrigue Balogou Portfolio */

(function () {
  'use strict';

  /* ─── Theme ─── */
  const THEME_KEY   = 'portfolio-theme';
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');

  function applyTheme(theme) {
    const light = theme === 'light';
    document.body.classList.toggle('light', light);
    if (themeIcon) themeIcon.className = light ? 'fa-solid fa-sun text-lg' : 'fa-solid fa-moon text-lg';
    if (themeToggle) {
      const label = light ? 'Activer le mode sombre' : 'Activer le mode clair';
      themeToggle.setAttribute('aria-label', label);
      themeToggle.title = label;
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  (function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(saved === 'light' || (!saved && prefersLight) ? 'light' : 'dark');
  })();

  themeToggle && themeToggle.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
  });

  /* ─── Navbar ─── */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    const y = window.scrollY;
    navbar && navbar.classList.toggle('scrolled', y > 40);
    let current = '';
    sections.forEach(s => { if (y >= s.offsetTop - 100) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Mobile menu ─── */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeNav() {
    mobileMenu && mobileMenu.classList.add('hidden');
    menuBtn && (menuBtn.innerHTML = '<i class="fa-solid fa-bars text-lg"></i>');
  }
  menuBtn && menuBtn.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('hidden');
    if (open) { closeNav(); }
    else { mobileMenu.classList.remove('hidden'); menuBtn.innerHTML = '<i class="fa-solid fa-xmark text-lg"></i>'; }
  });
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeNav));

  /* ─── Smooth scroll ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault(); closeNav();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── Scroll reveal ─── */
  const revealEls = document.querySelectorAll(
    '.project-card,.skill-card,.dev-card,.secondary-card,.stat-card,.timeline-item,.contact-btn,.section-header,.tech-card,.tools-row'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 70, 280)}ms`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ─── Hero fade-in ─── */
  document.querySelectorAll('.hero-section > div > *').forEach((el, i) => {
    el.classList.add('fade-in-up');
    el.style.animationDelay = `${0.08 + i * 0.14}s`;
  });

  /* MODAL GALERIE — crossfade pro */
  const overlay  = document.getElementById('modal');
  const imgA     = document.getElementById('modal-img-a');
  const imgB     = document.getElementById('modal-img-b');
  const mTitle   = document.getElementById('modal-caption-title');
  const mCaption = document.getElementById('modal-caption-desc');
  const mCounter = document.getElementById('modal-counter');
  const mThumbs  = document.getElementById('modal-thumbs');
  const mPrev    = document.getElementById('modal-prev');
  const mNext    = document.getElementById('modal-next');
  const mClose   = document.getElementById('modal-close');

  let captures = [], cur = 0, slot = 'a';

  function swapImage(src, alt) {
    const next = slot === 'a' ? imgB : imgA;
    const curr = slot === 'a' ? imgA : imgB;
    next.alt = alt;
    function commit() { next.classList.add('is-current'); curr.classList.remove('is-current'); slot = slot === 'a' ? 'b' : 'a'; }
    if (next.complete && next.src === src && next.naturalWidth > 0) { commit(); }
    else { next.onload = commit; next.onerror = commit; next.src = src; }
  }

  function showCap(idx) {
    cur = Math.max(0, Math.min(idx, captures.length - 1));
    const cap = captures[cur];
    if (!cap) return;
    swapImage(cap.src, cap.title);
    if (mTitle)   mTitle.textContent   = cap.title;
    if (mCaption) mCaption.textContent = cap.desc || '';
    if (mCounter) mCounter.textContent = `${cur + 1} / ${captures.length}`;
    if (mPrev) mPrev.disabled = cur === 0;
    if (mNext) mNext.disabled = cur === captures.length - 1;
    document.querySelectorAll('.modal-thumb').forEach((t, i) => t.classList.toggle('on', i === cur));
  }

  function buildThumbs() {
    if (!mThumbs) return;
    mThumbs.innerHTML = '';
    captures.forEach((cap, i) => {
      const btn = document.createElement('button');
      btn.className = 'modal-thumb';
      btn.setAttribute('aria-label', cap.title);
      btn.addEventListener('click', () => showCap(i));
      const img = document.createElement('img');
      img.src = cap.src; img.alt = cap.title;
      img.onerror = () => {
        img.remove();
        const num = document.createElement('span');
        num.className = 'modal-thumb-num';
        num.textContent = String(i + 1).padStart(2, '0');
        btn.appendChild(num);
      };
      btn.appendChild(img);
      mThumbs.appendChild(btn);
    });
  }

  function openModal(images, startIdx = 0) {
    if (!overlay) return;
    captures = images; cur = startIdx; slot = 'a';
    if (imgA) { imgA.src = ''; imgA.classList.add('is-current'); }
    if (imgB) { imgB.src = ''; imgB.classList.remove('is-current'); }
    buildThumbs(); showCap(cur);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay && overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Données projets secondaires */
  const SECONDARY = {
    wef: {
      images: [
        { src: '/images/wef-flux.png',      title: 'Flux WEF collectés',        desc: 'Événements Windows centralisés vers le collecteur.' },
        { src: '/images/wef-collector.jpg', title: 'GPO Source-Initiated',      desc: 'Politique de collecte WEF configurée via GPO.' },
        { src: '/images/logeventview.png',  title: 'Corrélation d\'événements', desc: 'Journaux de sécurité consolidés et audit centralisé.' }
      ]
    },
    wsus: {
      images: [
        { src: '/images/wsus.png',  title: 'Console WSUS',       desc: 'Mises à jour approuvées et groupes cibles.' },
        { src: '/images/wsus-approval.png', title: 'Approbation patchs', desc: 'Flux de validation pour patchs critiques.' },
        { src: '/images/wsus-clients.png',  title: 'Clients patchés',    desc: 'Statistiques de déploiement et conformité.' }
      ]
    },
    smb: {
      images: [
        { src: '/images/acl.png',       title: 'Partages sécurisés', desc: 'Permissions NTFS par groupe et contrôles d\'accès.' },
        { src: '/images/smb-audit.png', title: 'Audit SMB',          desc: 'Logs de connexions réussies/échouées.' },
        { src: '/images/smb-acl.png',   title: 'ACL détaillées',     desc: 'Autorisations par utilisateur et groupe.' }
      ]
    },
    zabbix: {
      images: [
        { src: '/images/dashboard-zabbix.png', title: 'Dashboard Zabbix',    desc: 'Performances et alertes actives.' },
        { src: '/images/zabbix-alerting.png',  title: 'Alerting temps réel', desc: 'Notifications pour seuils critiques.' },
        { src: '/images/zabbix-hosts.png',     title: 'Hôtes supervisés',    desc: 'Serveurs monitorés avec statuts.' }
      ]
    },
    ids: {
      images: [
        { src: '/images/ids-rules.png',     title: 'Règles Snort',  desc: 'Règles personnalisées pour détection réseau.' },
        { src: '/images/ids-alerts.png',    title: 'Alertes IDS',   desc: 'Journaux d\'événements et intrusions.' },
        { src: '/images/ids-dashboard.png', title: 'Dashboard IDS', desc: 'Tendances de détection et état réseau.' }
      ]
    },
    'attack-defense': {
      images: [
        { src: './images/scan-nmap.png', title: 'Phase Red Team',     desc: 'Vecteurs d\'attaque planifiés et objectifs définis.' },
        { src: './images/blueteam.png', title: 'Réponse Blue Team', desc: 'Contre-mesures et documentation défensive.' },
        { src: './images/TESTKALI.png', title: 'Playbooks',          desc: 'Procédures de réaction et axes d\'amélioration.' }
      ]
    }
  };

  /* Déclencheurs galerie */
  document.querySelectorAll('.btn-screenshots').forEach(btn => {
    btn.addEventListener('click', () => {
      const raw = btn.getAttribute('data-images');
      if (raw) { try { openModal(JSON.parse(raw), 0); } catch (e) { console.error(e); } return; }
      const proj = SECONDARY[btn.dataset.project];
      if (proj) openModal(proj.images, 0);
    });
  });

  if (overlay) {
    mPrev  && mPrev.addEventListener('click',  () => showCap(cur - 1));
    mNext  && mNext.addEventListener('click',  () => showCap(cur + 1));
    mClose && mClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape')     closeModal();
      if (e.key === 'ArrowLeft')  showCap(cur - 1);
      if (e.key === 'ArrowRight') showCap(cur + 1);
    });
  }

  /* ════════════════════════════════════════
     CV MODAL
  ════════════════════════════════════════ */
  const cvOverlay = document.getElementById('cv-modal');
  const cvIframe  = document.getElementById('cv-iframe');
  const cvOpenBtn = document.getElementById('cv-modal-btn');
  const cvClose1  = document.getElementById('cv-modal-close');
  const cvClose2  = document.getElementById('cv-modal-close2');

  function openCvModal() {
    if (!cvOverlay) return;
    if (cvIframe && !cvIframe.src) cvIframe.src = './CV_Rodrigue_BALOGOU.pdf';
    cvOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCvModal() {
    cvOverlay && cvOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cvOpenBtn && cvOpenBtn.addEventListener('click', openCvModal);
  cvClose1  && cvClose1.addEventListener('click',  closeCvModal);
  cvClose2  && cvClose2.addEventListener('click',  closeCvModal);
  cvOverlay && cvOverlay.addEventListener('click', e => { if (e.target === cvOverlay) closeCvModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cvOverlay?.classList.contains('open')) closeCvModal();
  });

})();
