document.addEventListener('DOMContentLoaded', function () {

    var header = document.querySelector('.header-wrapper');

    if(document.body.classList.contains('is-home')){
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;

            if (scrollPosition > 0) {
                header.style.backgroundColor = '#000000';
            } else {
                header.style.backgroundColor = 'transparent';
            }
        });
    }else{
      header.style.backgroundColor = '#000000';
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

        var cardHoverTimer = null;
        function scheduleActive(idx) {
            clearTimeout(cardHoverTimer);
            cardHoverTimer = setTimeout(function () { setActive(idx); }, 230);
        }

        setActive(0);

        links.forEach(function (link) {
            var idx = link.getAttribute('data-card-index');
            link.addEventListener('mouseenter', function () { scheduleActive(idx); });
            link.addEventListener('focus',      function () { setActive(idx); });
        });

        cards.forEach(function (card) {
            var idx = card.getAttribute('data-card-index');
            card.addEventListener('mouseenter', function () { scheduleActive(idx); });
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

        var thumbHoverTimer = null;
        function scheduleHero(id) {
            clearTimeout(thumbHoverTimer);
            thumbHoverTimer = setTimeout(function () { setActive(id); }, 230);
        }

        thumbs.forEach(function (t) {
            var id = t.getAttribute('data-hero');
            t.addEventListener('mouseenter', function () { scheduleHero(id); });
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
            // Desktop mega-menu tabs are hover-driven only; click must never toggle/close the details menu.
            e.preventDefault();
            e.stopPropagation();
            if (!desktopMQ.matches) {
              activateTab(tab);
              return;
            }
            activateTab(tab);
        });

        tab.addEventListener('via-luci:activate-tab', function () {
            activateTab(tab);
        });

        var tabHoverDelay;

        tab.addEventListener('mouseenter', function () {
        if (!desktopMQ.matches) return;
        clearTimeout(tabHoverDelay);

        tabHoverDelay = setTimeout(function () {
            activateTab(tab);
        }, 360); 
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
                header.style.backgroundColor = '#000000';
            }
            var current = mega.querySelector('.optionB__panel.is-active');
            setHeights(current);
        } else {
            if(document.body.classList.contains('is-home')){
                header.style.backgroundColor = 'transparent';
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
  const desktopMQ = window.matchMedia('(min-width: 990px) and (hover: hover) and (pointer: fine)');
  const CLOSE_DELAY = 650;
  const OPEN_DELAY = 170;
  const CLOSE_ANIMATION = 820;
  const ACTIVE_CLASS = 'via-luci-mega-active';
  const TRANSITION_CLASS = 'via-luci-mega-transitioning';

  const header = document.querySelector('.header-wrapper');
  const detailsList = Array.from(document.querySelectorAll('header-menu details.mega-menu'));
  if (!detailsList.length) return;

  const getOpenMenu = () => detailsList.find((details) => details.hasAttribute('open'));

  function syncHeaderState() {
    const isHome = document.body.classList.contains('is-home');
    const openMenu = getOpenMenu();
    const hasVisibleOpenMega = Boolean(openMenu && !openMenu.classList.contains('via-luci-is-closing'));

    // Overlay/header bg must fade at the same time as the mega menu.
    // During close animation the details remains [open], but visually it is closing.
    document.body.classList.toggle(ACTIVE_CLASS, hasVisibleOpenMega && desktopMQ.matches);

    if (!header) return;

    if (hasVisibleOpenMega || !isHome || window.scrollY > 0) {
      header.style.backgroundColor = '#000000';
    } else {
      header.style.backgroundColor = 'transparent';
    }
  }

  function closeAll(except) {
    detailsList.forEach((details) => {
      if (details !== except) closeDetails(details);
    });
    window.requestAnimationFrame(syncHeaderState);
  }

  function openDetails(details) {
    if (!desktopMQ.matches) return;
    closeAll(details);
    details.classList.remove('via-luci-is-closing');
    document.body.classList.remove(TRANSITION_CLASS);
    details.setAttribute('open', '');
    const summary = details.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', 'true');

    const firstTab = details.querySelector('.optionB__tabs-link[data-has-panel="true"]');
    const hasActivePanel = details.querySelector('.optionB__panel.is-active');
    if (firstTab && !hasActivePanel) firstTab.dispatchEvent(new Event('via-luci:activate-tab', { bubbles: true }));

    syncHeaderState();
  }

  function closeDetails(details) {
    if (!details || !details.hasAttribute('open')) return;
    const summary = details.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', 'false');

    details.classList.add('via-luci-is-closing');
    document.body.classList.add(TRANSITION_CLASS);
    syncHeaderState();
    window.setTimeout(() => {
      if (details.classList.contains('via-luci-is-closing')) {
        details.removeAttribute('open');
        details.classList.remove('via-luci-is-closing');
        document.body.classList.remove(TRANSITION_CLASS);
        syncHeaderState();
      }
    }, CLOSE_ANIMATION);

    syncHeaderState();
  }

  detailsList.forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.mega-menu__content');
    let openTimer = null;
    let closeTimer = null;

    const clearOpenTimer = () => {
      if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
      }
    };

    const clearCloseTimer = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const scheduleOpen = () => {
      if (!desktopMQ.matches) return;
      clearCloseTimer();
      clearOpenTimer();
      openTimer = setTimeout(() => openDetails(details), OPEN_DELAY);
    };

    const scheduleClose = () => {
      if (!desktopMQ.matches) return;

      // Cierre permisivo: si el cursor sale del header/summary/mega menu,
      // esperamos 2s antes de cerrar. Si vuelve a entrar al header o al
      // mega menu durante esa ventana, se cancela el cierre.
      clearOpenTimer();
      clearCloseTimer();
      closeTimer = setTimeout(() => closeDetails(details), CLOSE_DELAY);
    };

    details.addEventListener('pointerenter', scheduleOpen);
    details.addEventListener('pointerleave', scheduleClose);

    if (summary) {
      summary.addEventListener('pointerenter', scheduleOpen);
      summary.addEventListener('focus', () => openDetails(details));
      summary.addEventListener('click', (event) => {
        if (!desktopMQ.matches) return;
        event.preventDefault();
        openDetails(details);
      });
    }

    if (content) {
      content.addEventListener('pointerenter', () => {
        if (!desktopMQ.matches) return;
        clearOpenTimer();
        clearCloseTimer();
      });
      content.addEventListener('pointerleave', scheduleClose);
    }

    if (header) {
      header.addEventListener('pointerenter', () => {
        if (!desktopMQ.matches) return;
        clearCloseTimer();
      });
      header.addEventListener('pointerleave', (event) => {
        if (!desktopMQ.matches || !details.hasAttribute('open')) return;
        scheduleClose(event);
      });
    }

    details.addEventListener('focusin', () => {
      if (!desktopMQ.matches) return;
      clearCloseTimer();
      openDetails(details);
    });

    details.addEventListener('focusout', () => {
      // V15: no cerrar por cambio de foco en desktop; solo por salida real del DOM.
      if (!desktopMQ.matches) return;
      clearCloseTimer();
    });

    details.addEventListener('toggle', syncHeaderState);
  });

  // V15: en desktop no cerramos el mega menú por click fuera ni por zonas del viewport.
  // El cierre ocurre únicamente cuando el cursor abandona completamente el DOM/viewport.
  document.addEventListener('pointerleave', (event) => {
    if (!desktopMQ.matches) return;
    const nextTarget = event.relatedTarget || event.toElement;
    if (nextTarget) return;
    const openMenu = getOpenMenu();
    if (openMenu) closeDetails(openMenu);
  });

  window.addEventListener('mouseout', (event) => {
    if (!desktopMQ.matches) return;
    if (event.relatedTarget || event.toElement) return;
    const openMenu = getOpenMenu();
    if (openMenu) closeDetails(openMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (!desktopMQ.matches || event.key !== 'Escape') return;
    closeAll();
  });

  window.addEventListener('scroll', syncHeaderState, { passive: true });

  desktopMQ.addEventListener('change', () => {
    if (!desktopMQ.matches) {
      document.body.classList.remove(ACTIVE_CLASS);
      document.body.classList.remove(TRANSITION_CLASS);
      closeAll();
    }
    syncHeaderState();
  });

  syncHeaderState();
});


// V16 scroll lock
let __vlScrollY=0;
function lockViaLuciScroll(){
 if(document.body.classList.contains('via-luci-scroll-lock')) return;
 __vlScrollY=window.scrollY||window.pageYOffset;
 document.body.classList.add('via-luci-scroll-lock');
 document.body.style.position='fixed';
 document.body.style.top=`-${__vlScrollY}px`;
 document.body.style.left='0';
 document.body.style.right='0';
 document.body.style.width='100%';
}
function unlockViaLuciScroll(){
 if(!document.body.classList.contains('via-luci-scroll-lock')) return;
 document.body.classList.remove('via-luci-scroll-lock');
 document.body.style.position='';
 document.body.style.top='';
 document.body.style.left='';
 document.body.style.right='';
 document.body.style.width='';
 window.scrollTo(0,__vlScrollY);
}
document.addEventListener('DOMContentLoaded',()=>{
 const obs=new MutationObserver(()=>{
   if(document.body.classList.contains('via-luci-mega-active')) lockViaLuciScroll();
   else unlockViaLuciScroll();
 });
 obs.observe(document.body,{attributes:true,attributeFilter:['class']});
});
