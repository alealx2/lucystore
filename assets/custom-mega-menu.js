document.addEventListener('DOMContentLoaded', function () {

    var header = document.querySelector('.header-wrapper');

    if(document.body.classList.contains('is-home')){
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;

            if (scrollPosition > 0) {
                header.style.background = '#000000';
            } else {
                header.style.background = 'transparent';
            }
        });
    }else{
      header.style.background = '#000000';
    }



    var desktopMQ = window.matchMedia('(min-width: 990px)');

    /* ========== DESKTOP MEGA ========== */
    document.querySelectorAll('.mega-menu').forEach(function (mega) {
        var tabs   = mega.querySelectorAll('.optionB__tabs-link');
        var panels = mega.querySelectorAll('.optionB__panel');
        var wrap   = mega.querySelector('.optionB__panels');
        var content= mega.querySelector('.mega-menu__content');
        var inner  = mega.querySelector('.optionB__container');

        if (!tabs.length || !wrap || !content || !inner) return;

        function setHeights(activePanel) {
        if (activePanel) {
            wrap.style.height = activePanel.scrollHeight + 'px';
        } else {
            wrap.style.height = '0px';
        }
        }

        /* ------- Season/Brand/Collection ------- */
        function initExpanding(panel) {
        if (panel.dataset.expandingInit === 'true') return;
        panel.dataset.expandingInit = 'true';

        var featured = panel.querySelector('.megamenu-pb__featured--expanding, .megamenu-pb__featured');
        if (!featured) return;

        var cards = featured.querySelectorAll('.megamenu-pb__card[data-card-index]');
        if (!cards.length) return;

        var links = panel.querySelectorAll('.megamenu-pb__nav .megamenu-pb__link[data-card-index]');
        featured.classList.add('has-active');

        function setActive(idx) {
            idx = parseInt(idx, 10);
            if (isNaN(idx)) return;

            cards.forEach(function (card, i) {
            var on = i === idx;
            card.classList.toggle('is-expanded', on);
            card.classList.toggle('is-active',  on);
            });

            links.forEach(function (link, i) {
            link.classList.toggle('is-active', i === idx);
            });
        }

        setActive(0);

        links.forEach(function (link) {
            var idx = link.getAttribute('data-card-index');
            link.addEventListener('mouseenter', function () { setActive(idx); });
            link.addEventListener('focus',      function () { setActive(idx); });
        });

        cards.forEach(function (card) {
            var idx = card.getAttribute('data-card-index');
            card.addEventListener('mouseenter', function () { setActive(idx); });
            card.addEventListener('focus',      function () { setActive(idx); });
        });
        }

        /* ------- Category ------- */
        function initCategory(panel) {
        if (panel.dataset.categoryInit === 'true') return;
        panel.dataset.categoryInit = 'true';

        var thumbs = panel.querySelectorAll('.megamenu-cat__thumb');
        var heroes = panel.querySelectorAll('.megamenu-cat__hero');
        if (!thumbs.length || !heroes.length) return;

        function setActive(heroId) {
            thumbs.forEach(function (t) {
            t.classList.toggle('is-active', t.getAttribute('data-hero') === heroId);
            });
            heroes.forEach(function (h) {
            h.classList.toggle('is-active', h.id === heroId);
            });
        }

        var first = thumbs[0];
        if (first) setActive(first.getAttribute('data-hero'));

        thumbs.forEach(function (t) {
            var id = t.getAttribute('data-hero');
            t.addEventListener('mouseenter', function () { setActive(id); });
            t.addEventListener('focus',      function () { setActive(id); });
        });
        }

        /* ------- Activate tab (Season / Category / Collection) ------- */
        function activateTab(tab) {
        var target = tab.getAttribute('data-panel');

        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        var activePanel = null;
        panels.forEach(function (p) {
            if (p.id === target) {
            p.classList.add('is-active');
            activePanel = p;
            } else {
            p.classList.remove('is-active');
            }
        });

        if (activePanel) {
            if (activePanel.classList.contains('optionB__panel--category')) {
            initCategory(activePanel);
            } else {
            initExpanding(activePanel);
            }

            setHeights(activePanel);
            setTimeout(function () { setHeights(activePanel); }, 50);
            setTimeout(function () { setHeights(activePanel); }, 250);

            activePanel.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('load', function () { setHeights(activePanel); }, { once: true });
            });
        }
        }

        /* ------- Init onload ------- */
        setHeights(null);

        tabs.forEach(function (tab) {
        var hasPanel = tab.getAttribute('data-has-panel') === 'true';
        if (!hasPanel) return;

        tab.addEventListener('click', function (e) {
            e.preventDefault();
            activateTab(tab);
        });

        var tabHoverDelay;

        tab.addEventListener('mouseenter', function () {
        if (!desktopMQ.matches) return;
        clearTimeout(tabHoverDelay);

        tabHoverDelay = setTimeout(function () {
            activateTab(tab);
        }, 180); 
        });

        tab.addEventListener('mouseleave', function () {
        clearTimeout(tabHoverDelay);
        });

        });

        window.addEventListener('resize', function () {
        var current = mega.querySelector('.optionB__panel.is-active');
        setHeights(current);
        });

        mega.addEventListener('toggle', function () {
        if (mega.open) {
            if(document.body.classList.contains('is-home')){
                header.style.background = '#000000';
            }
            var current = mega.querySelector('.optionB__panel.is-active');
            setHeights(current);
        } else {
            if(document.body.classList.contains('is-home')){
                header.style.background = 'transparent';
            }
            wrap.style.height = '0px';
        }
        });
    });

    /* ========== MOBILE mega menu ========== */
    var tmplRoot = document.getElementById('mobile-mega-templates');
    if (!tmplRoot) return;

    function normalize(s) { return (s || '').toString().trim().toLowerCase(); }

    document.body.addEventListener('click', function (e) {
        var a = e.target.closest('a.menu-drawer__menu-item, button.menu-drawer__menu-item');
        if (!a) return;

        var label = normalize(a.textContent);
        var t = Array.from(tmplRoot.querySelectorAll('template')).find(function (t) {
        return normalize(t.dataset.trigger) === label;
        });
        if (!t) return;

        e.preventDefault();

        var li = a.closest('li');
        if (!li) return;

        var host = li.nextElementSibling;
        if (host && host.classList && host.classList.contains('mobile-mega-host')) {
        var open = host.classList.toggle('is-open');
        host.style.maxHeight = open ? (host.scrollHeight + 'px') : '0';
        return;
        }

        host = document.createElement('div');
        host.className = 'mobile-mega-host is-open';
        li.parentNode.insertBefore(host, li.nextSibling);
        host.appendChild(t.content.cloneNode(true));
        host.style.maxHeight = host.scrollHeight + 'px';
    }, true);
});

document.addEventListener('DOMContentLoaded', () => {
  const mq = window.matchMedia('(min-width: 990px)');
  const OPEN_DELAY  = 220;  // más elegante (180–260 recomendado)
  const CLOSE_DELAY = 180;  // cierre suave
  const GRACE_MS    = 120;  // “perdón” si el mouse se mueve rápido

  const detailsList = Array.from(document.querySelectorAll('header-menu details.mega-menu'));
  if (!detailsList.length) return;

  function closeAll(except) {
    detailsList.forEach(d => {
      if (d !== except) d.removeAttribute('open');
    });
  }

  detailsList.forEach((details) => {
    const summary  = details.querySelector('summary');
    const content  = details.querySelector('.mega-menu__content');

    let openT = null;
    let closeT = null;
    let graceT = null;

    const clearTimers = () => {
      if (openT)  { clearTimeout(openT);  openT = null; }
      if (closeT) { clearTimeout(closeT); closeT = null; }
      if (graceT) { clearTimeout(graceT); graceT = null; }
    };

    const openMenu = () => {
      clearTimers();
      closeAll(details);
      details.setAttribute('open', '');
    };

    const closeMenu = () => {
      clearTimers();
      details.removeAttribute('open');
    };

    const scheduleOpen = () => {
      clearTimers();
      openT = setTimeout(openMenu, OPEN_DELAY);
    };

    const scheduleClose = () => {
      clearTimers();

      // GRACE: no cierres de inmediato, da tiempo para entrar al panel
      graceT = setTimeout(() => {
        closeT = setTimeout(closeMenu, CLOSE_DELAY);
      }, GRACE_MS);
    };

    // Hover intent: pointerenter/pointerleave es más estable que mouseenter/leave en algunos casos
    details.addEventListener('pointerenter', () => {
      if (!mq.matches) return;
      scheduleOpen();
    });

    details.addEventListener('pointerleave', () => {
      if (!mq.matches) return;
      scheduleClose();
    });

    // Si entra al contenido, cancelamos el cierre (evita flicker al cruzar el borde)
    if (content) {
      content.addEventListener('pointerenter', () => {
        if (!mq.matches) return;
        clearTimers();
      });
      content.addEventListener('pointerleave', () => {
        if (!mq.matches) return;
        scheduleClose();
      });
    }

    // Accesibilidad: teclado
    details.addEventListener('focusin', () => {
      if (!mq.matches) return;
      clearTimers();
      openMenu();
    });

    details.addEventListener('focusout', (e) => {
      if (!mq.matches) return;
      if (!details.contains(e.relatedTarget)) scheduleClose();
    });

    // Evita “toggle” por click en desktop (solo hover)
    if (summary) {
      summary.addEventListener('click', (e) => {
        if (!mq.matches) return;
        e.preventDefault();
      });
    }
  });

  // Click fuera cierra
  document.addEventListener('click', (e) => {
    if (!mq.matches) return;
    if (e.target.closest('header-menu details.mega-menu')) return;
    detailsList.forEach(d => d.removeAttribute('open'));
  });

  // ESC cierra
  document.addEventListener('keydown', (e) => {
    if (!mq.matches) return;
    if (e.key !== 'Escape') return;
    detailsList.forEach(d => d.removeAttribute('open'));
  });
});