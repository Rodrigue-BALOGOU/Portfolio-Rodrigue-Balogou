// ====== MENU BURGER ======
const burger = document.getElementById("burger"); 
const navLinks = document.querySelector(".nav-links"); 

burger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// ====== DROPDOWN MENU MOBILE ======
const navDropdown = document.querySelector('.nav-dropdown');
const dropdownToggle = document.querySelector('.dropdown-toggle');

if (dropdownToggle) {
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    navDropdown.classList.toggle('active');
  });

  // Fermer le dropdown quand on clique sur un lien
  document.querySelectorAll('.dropdown-menu li a').forEach(link => {
    link.addEventListener('click', () => {
      navDropdown.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ====== ANIMATIONS AU DÉFILEMENT ======
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Définir l'ordre pour l'animation
                const order = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.setProperty('--order', order);

                // Si c'est une machine-card, animer les éléments internes
                if (entry.target.classList.contains('machine-card')) {
                    entry.target.classList.add('animate-item');
                    
                    // Animer chaque élément interne
                    ['h3', 'p', '.meta-tags', '.machine-actions'].forEach((selector, index) => {
                        const element = entry.target.querySelector(selector);
                        if (element) {
                            element.classList.add('animate-item');
                        }
                    });
                } else {
                    // Pour les autres éléments
                    entry.target.classList.add('animate-item');
                }
            }
        });
    };

    const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

    // Sélectionne tous les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.project-card, .section-title, h2, .skill-card, .contact-form, .about-content, ' +
        '.machine-card, .lab-section, .web-project-card, .project-section'
    );
    
    // Ajoute les classes d'animation et configure l'ordre pour les cartes de projet
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-item');
        if (el.classList.contains('project-card') || el.classList.contains('machine-card') || el.classList.contains('web-project-card')) {
            el.setAttribute('data-order', index % 3); // Effet cascade pour tous les types de cartes
        } else if (el.classList.contains('skill-card')) {
            el.setAttribute('data-order', index % 4); // Effet cascade plus lent pour les compétences
        } else if (el.classList.contains('lab-section') || el.classList.contains('project-section')) {
            el.setAttribute('data-order', '1'); // Délai fixe pour les sections
        } else {
            el.setAttribute('data-order', index % 2); // Effet cascade pour les autres éléments
        }
        scrollObserver.observe(el);
    });
});

// ====== SCROLL FLUIDE ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 50, // ajuste selon ton header
        behavior: "smooth"
      });
    }
    navLinks.classList.remove("active"); // ferme le menu après clic
  });
});

// ====== ANIMATION COMPÉTENCES AU SCROLL ======
document.addEventListener("DOMContentLoaded", () => {
  const skills = [95, 65, 80, 65, 70, 60]; // % pour chaque compétence
  const progressBars = document.querySelectorAll(".progress");
  const pourcentages = document.querySelectorAll(".pourcentage");
  let animated = false; // évite de relancer l’animation plusieurs fois

  function animateSkills() {
    progressBars.forEach((progress, index) => {
      setTimeout(() => {
        let current = 0;
        let target = skills[index];
        let interval = setInterval(() => {
          if (current >= target) {
            clearInterval(interval);
          } else {
            current++;
            progress.style.width = current + "%";
            pourcentages[index].textContent = current + "%";
          }
        }, 1);
      }, index * 30);
    });
  }

  // Observer qui détecte quand #skills est visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animateSkills();
      animated = false; // pour ne pas rejouer plusieurs fois
    }
  }, { threshold: 0.3 }); // déclenche quand 30% de la section est visible

  const skillsSection = document.querySelector("#skills");
  observer.observe(skillsSection);
});

// ====== EMAILJS CONTACT FORM ======
// Instructions: remplacez les placeholders ci-dessous par vos vraies valeurs EmailJS:
// - YOUR_EMAILJS_USER_ID : clé user (emailjs.init)
// - YOUR_SERVICE_ID : id du service (ex: service_xxx)
// - YOUR_TEMPLATE_ID : id du template (ex: template_xxx)
// Vous pouvez obtenir ces valeurs depuis https://dashboard.emailjs.com/

try {
  /* eslint-disable no-undef */
  emailjs.init('FRbGoCGzmX31hHW1t'); // <-- changez ceci
  /* eslint-enable no-undef */
} catch (e) {
  // si EmailJS non chargé, on ignore (le script est inclus dans index.html)
  console.warn('EmailJS non initialisé (script peut-être manquant). Remplacez les clés et assurez-vous que le CDN est chargé.');
}

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const spinner = document.getElementById('contact-spinner');

    function showLoading() {
      if (spinner) spinner.classList.remove('hidden');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.7'; }
      contactStatus.style.color = '#ccc';
      contactStatus.textContent = 'Envoi en cours...';
    }

    function hideLoading() {
      if (spinner) spinner.classList.add('hidden');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
    }

    showLoading();

    // Si EmailJS non disponible -> fallback mailto
    if (!window.emailjs) {
      hideLoading();
      contactStatus.style.color = '#ffcc66';
      contactStatus.textContent = 'EmailJS non disponible — ouverture du client mail en fallback.';
      // construire mailto
      const formData = new FormData(contactForm);
      const name = formData.get('from_name') || '';
      const email = formData.get('from_email') || '';
      const message = formData.get('message') || '';
      const subject = encodeURIComponent('Contact depuis portfolio — ' + name);
      const body = encodeURIComponent(message + '\n\n--\nDe: ' + name + ' <' + email + '>');
      window.location.href = `mailto:balogourodrigue2@gmail.com?subject=${subject}&body=${body}`;
      return;
    }

        // Envoyer le formulaire via EmailJS (service/template fournis dans script)
        try {
          console.info('EmailJS disponible:', !!window.emailjs);
          console.info('Tentative d\'envoi via EmailJS — service: service_3e569yq, template: template_20dhu05');
          emailjs.sendForm('service_3e569yq', 'template_20dhu05', this)
            .then(function (response) {
              hideLoading();
              console.info('EmailJS success:', response);
              contactStatus.style.color = '#8be78b';
              contactStatus.textContent = 'Message envoyé — merci nous vous repondrons au plus vite ☑️!';
              contactForm.reset();
            }, function (error) {
              // Afficher un message d'erreur plus détaillé pour debug
              hideLoading();
              console.error('EmailJS error (promise):', error);
              let errText = 'Échec de l\'envoi via EmailJS.';
              try {
                // certains objets d'erreur contiennent status/text
                if (error && (error.status || error.text)) {
                  errText += ` Détails: ${error.status || ''} ${error.text || ''}`;
                } else if (typeof error === 'string') {
                  errText += ' ' + error;
                } else {
                  errText += ' (voir la console pour plus de détails)';
                }
              } catch (e) {
                errText += ' (erreur lors du rendu du message)';
              }
              contactStatus.style.color = '#ff6b6b';
              contactStatus.textContent = errText + ' — tentative de fallback.';

              // fallback mailto pour permettre envoi manuel
              const formData = new FormData(contactForm);
              const name = formData.get('from_name') || '';
              const email = formData.get('from_email') || '';
              const message = formData.get('message') || '';
              const subject = encodeURIComponent('Contact depuis portfolio — ' + name);
              const body = encodeURIComponent(message + '\n\n--\nDe: ' + name + ' <' + email + '>');
              // ouvrir le client mail
              window.location.href = `mailto:balogourodrigue2@gmail.com?subject=${subject}&body=${body}`;
            });
        } catch (sendError) {
          // Erreur synchrone (p.ex. emailjs.sendForm non défini)
          hideLoading();
          console.error('EmailJS send exception:', sendError);
          contactStatus.style.color = '#ff6b6b';
          contactStatus.textContent = 'Erreur lors de l\'envoi (exception). Voir console pour détails.';
          // fallback mailto
          const formData = new FormData(contactForm);
          const name = formData.get('from_name') || '';
          const email = formData.get('from_email') || '';
          const message = formData.get('message') || '';
          const subject = encodeURIComponent('Contact depuis portfolio — ' + name);
          const body = encodeURIComponent(message + '\n\n--\nDe: ' + name + ' <' + email + '>');
          window.location.href = `mailto:balogourodrigue2@gmail.com?subject=${subject}&body=${body}`;
        }
  });
}



/* === JS: appliquer les images en background + modal improvements === */
document.addEventListener('DOMContentLoaded', function () {
  // 1) Convertir <img> en background-image sur .web-project-figure
  document.querySelectorAll('.web-project-figure').forEach(fig => {
    const img = fig.querySelector('img');
    if (img && img.src) {
      // applique en background
      fig.style.backgroundImage = `url('${img.src}')`;
      fig.style.backgroundSize = 'cover';
      fig.style.backgroundPosition = 'center center';
      // pour mobile, allow fallback via CSS media query (background-attachment: scroll)
      // cache l'image (nous ne modifions pas le HTML structurel, juste le style)
      img.style.display = 'none';
      img.setAttribute('aria-hidden','true');
    }
  });

  // 2) Modal: ouverture via data-video (déjà en place) mais on ajoute la classe modal-open au body
  const modal = document.getElementById('demo-modal');
  const iframe = document.getElementById('demo-iframe');
  const closeBtn = document.getElementById('close-demo');
function openModalWithVideo(src) {
    if (!src) return;

    // Si c'est un fichier vidéo local → afficher dans une balise <video>
    if (src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".ogg")) {
        iframe.style.display = "none";

        // créer un lecteur vidéo
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.style.width = "100%";
        video.style.height = "min(70vh, 720px)";
        video.id = "local-video";

        // injecter dans le modal
        document.querySelector("#demo-modal > div").appendChild(video);
    }

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
  };

function closeModal() {
    iframe.src = "";
    const localVideo = document.getElementById("local-video");
    if (localVideo) localVideo.remove();

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open");
}
});


if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const spinner = document.getElementById('contact-spinner');

    function showLoading() {
      if (spinner) spinner.classList.remove('hidden');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.7'; }
      if (contactStatus) {
        contactStatus.style.color = '#ccc';
        contactStatus.textContent = 'Envoi en cours...';
      } else {
        console.info('contactStatus absent — Envoi en cours...');
      }
    }

    function hideLoading() {
      if (spinner) spinner.classList.add('hidden');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
    }

    showLoading();

    if (!window.emailjs) {
      hideLoading();
      if (contactStatus) {
        contactStatus.style.color = '#ffcc66';
        contactStatus.textContent = 'EmailJS non disponible — ouverture du client mail en fallback.';
      } else {
        console.warn('EmailJS non dispo — fallback mailto.');
      }
      // fallback mailto construction...
      const formData = new FormData(contactForm);
      const name = formData.get('from_name') || '';
      const email = formData.get('from_email') || '';
      const message = formData.get('message') || '';
      const subject = encodeURIComponent('Contact depuis portfolio — ' + name);
      const body = encodeURIComponent(message + '\n\n--\nDe: ' + name + ' <' + email + '>');
      window.location.href = `mailto:balogourodrigue2@gmail.com?subject=${subject}&body=${body}`;
      return;
    }

    try {
      emailjs.sendForm('service_3e569yq', 'template_20dhu05', this)
        .then(function (response) {
          hideLoading();
          if (contactStatus) {
            contactStatus.style.color = '#8be78b';
            contactStatus.textContent = 'Message envoyé — merci ☑️!';
          } else {
            console.info('Message envoyé — merci !');
          }
          contactForm.reset();
        }, function (error) {
          hideLoading();
          console.error('EmailJS error (promise):', error);
          if (contactStatus) {
            contactStatus.style.color = '#ff6b6b';
            contactStatus.textContent = 'Échec de l\'envoi via EmailJS. Voir console pour détails.';
          } else {
            console.warn('Échec de l\'envoi (voir console).');
          }
          // fallback mailto...
          const formData = new FormData(contactForm);
          const name = formData.get('from_name') || '';
          const email = formData.get('from_email') || '';
          const message = formData.get('message') || '';
          const subject = encodeURIComponent('Contact depuis portfolio — ' + name);
          const body = encodeURIComponent(message + '\n\n--\nDe: ' + name + ' <' + email + '>');
          window.location.href = `mailto:balogourodrigue2@gmail.com?subject=${subject}&body=${body}`;
        });
    } catch (sendError) {
      hideLoading();
      console.error('EmailJS send exception:', sendError);
      if (contactStatus) {
        contactStatus.style.color = '#ff6b6b';
        contactStatus.textContent = 'Erreur lors de l\'envoi (exception). Voir console pour détails.';
      } else {
        console.warn('Erreur lors de l\'envoi (exception).');
      }
      // fallback mailto...
      const formData = new FormData(contactForm);
      const name = formData.get('from_name') || '';
      const email = formData.get('from_email') || '';
      const message = formData.get('message') || '';
      const subject = encodeURIComponent('Contact depuis portfolio — ' + name);
      const body = encodeURIComponent(message + '\n\n--\nDe: ' + name + ' <' + email + '>');
      window.location.href = `mailto:balogourodrigue2@gmail.com?subject=${subject}&body=${body}`;
    }
  });
}