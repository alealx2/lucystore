document.addEventListener('DOMContentLoaded', function () {

    var header = document.querySelector('.header-wrapper');
    // Header background is synchronized by the Via Luci mega controller below.
    // Keeping this first initializer passive avoids duplicated abrupt bg changes.



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

        // Establish the accordion's initial geometry while it is still visually hidden.
        // This prevents Season/Collection cards from sliding horizontally into place
        // when the panel first opens, so their entrance matches By Category.
        panel.classList.add('via-luci-expanding-initializing');

        var featured = panel.querySelector('.megamenu-pb__featured--expanding, .megamenu-pb__featured');
        if (!featured) return;

        var cards = featured.querySelectorAll('.megamenu-pb__card[data-card-index]');
        if (!cards.length) return;

        var links = panel.querySelectorAll('.megamenu-pb__nav .megamenu-pb__link[data-card-index]');
        featured.classList.add('has-active');

        function setActive(idx) {
            idx = String(parseInt(idx, 10));
            if (idx === 'NaN') return;

            // Match by the explicit data-card-index instead of NodeList position.
            // This keeps Season perfectly synchronized even if a menu item/card
            // is omitted or Shopify returns links in a slightly different shape.
            cards.forEach(function (card) {
            var on = card.getAttribute('data-card-index') === idx;
            card.classList.toggle('is-expanded', on);
            card.classList.toggle('is-active',  on);
            });

            links.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('data-card-index') === idx);
            });
        }

        var cardHoverTimer = null;
        var hoverDelay = 230;
        var nav = panel.querySelector('.megamenu-pb__nav');

        function scheduleActive(idx) {
            clearTimeout(cardHoverTimer);
            cardHoverTimer = setTimeout(function () { setActive(idx); }, hoverDelay);
        }

        function activateNow(idx) {
            clearTimeout(cardHoverTimer);
            cardHoverTimer = null;
            setActive(idx);
        }

        var firstIndex = cards[0] ? cards[0].getAttribute('data-card-index') : '0';
        setActive(firstIndex);

        // Force the initial expanded/collapsed layout to be committed without animation.
        // The class is removed only after the panel has been painted in its final geometry.
        void panel.offsetWidth;
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                panel.classList.remove('via-luci-expanding-initializing');
            });
        });

        // Season and Collection intentionally share EXACTLY the same interaction
        // path. Delegation also makes the hover reliable when moving quickly
        // across the text, its <span>, or whitespace inside the nav link.
        if (nav) {
            nav.addEventListener('mouseover', function (event) {
                var link = event.target.closest('.megamenu-pb__link[data-card-index]');
                if (!link || !nav.contains(link)) return;
                scheduleActive(link.getAttribute('data-card-index'));
            });

            nav.addEventListener('focusin', function (event) {
                var link = event.target.closest('.megamenu-pb__link[data-card-index]');
                if (!link || !nav.contains(link)) return;
                activateNow(link.getAttribute('data-card-index'));
            });
        }

        featured.addEventListener('mouseover', function (event) {
            var card = event.target.closest('.megamenu-pb__card[data-card-index]');
            if (!card || !featured.contains(card)) return;
            scheduleActive(card.getAttribute('data-card-index'));
        });

        featured.addEventListener('focusin', function (event) {
            var card = event.target.closest('.megamenu-pb__card[data-card-index]');
            if (!card || !featured.contains(card)) return;
            activateNow(card.getAttribute('data-card-index'));
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
        var previousPanel = mega.querySelector('.optionB__panel.is-active');

        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        var activePanel = null;
        panels.forEach(function (p) {
            if (p.id === target) {
            activePanel = p;
            }
        });

        if (previousPanel && activePanel && previousPanel !== activePanel) {
            previousPanel.classList.add('via-luci-panel-leaving');
            previousPanel.classList.remove('is-active');
            window.setTimeout(function () {
            previousPanel.classList.remove('via-luci-panel-leaving');
            }, 760);
        }

        panels.forEach(function (p) {
            if (p === activePanel) {
            p.classList.remove('via-luci-panel-leaving');
            p.classList.add('is-active');
            } else if (p !== previousPanel) {
            p.classList.remove('is-active');
            p.classList.remove('via-luci-panel-leaving');
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
            var current = mega.querySelector('.optionB__panel.is-active');
            setHeights(current);
        } else {
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
  const CLOSE_ANIMATION = 400;
  const ACTIVE_CLASS = 'via-luci-mega-active';
  const TRANSITION_CLASS = 'via-luci-mega-transitioning';

  const root = document.documentElement;
  const header = document.querySelector('.header-wrapper');
  const detailsList = Array.from(document.querySelectorAll('header-menu details.mega-menu'));
  const closingTimers = new WeakMap();
  if (!detailsList.length) return;

  const isHome = () => root.classList.contains('is-home') || document.body.classList.contains('is-home');
  const getOpenMenu = () => detailsList.find((details) => details.hasAttribute('open'));

  function clearClosingAnimation(details) {
    const timer = closingTimers.get(details);
    if (timer) window.clearTimeout(timer);
    closingTimers.delete(details);
  }

  /*
   * Home is the only page where the header is transparent at scroll 0.
   * Keep its background driven by ONE state only: via-luci-force-solid.
   * No inline background styles are written, so fast open/close reverses the
   * same CSS transition instead of restarting from competing style sources.
   */
  function syncHeaderState() {
    const openMenu = getOpenMenu();
    const visuallyOpen = Boolean(openMenu && !openMenu.classList.contains('via-luci-is-closing'));

    document.body.classList.toggle(ACTIVE_CLASS, visuallyOpen && desktopMQ.matches);

    if (!header || !isHome()) return;

    const atTop = window.scrollY <= 8 && !document.querySelector('.section-header.scrolled-past-header');
    header.classList.toggle('via-luci-force-solid', visuallyOpen || !atTop);
  }

  function finishClose(details) {
    if (!details.classList.contains('via-luci-is-closing')) return;
    details.removeAttribute('open');
    details.classList.remove('via-luci-is-closing');
    closingTimers.delete(details);

    if (!detailsList.some((item) => item.classList.contains('via-luci-is-closing'))) {
      document.body.classList.remove(TRANSITION_CLASS);
    }
    syncHeaderState();
  }

  function closeDetails(details) {
    if (!details || !details.hasAttribute('open') || details.classList.contains('via-luci-is-closing')) return;

    clearClosingAnimation(details);
    const summary = details.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', 'false');

    /* Same frame = header black->transparent and mega opacity 1->0 together. */
    details.classList.add('via-luci-is-closing');
    document.body.classList.add(TRANSITION_CLASS);
    syncHeaderState();

    const timer = window.setTimeout(() => finishClose(details), CLOSE_ANIMATION);
    closingTimers.set(details, timer);
  }

  function closeAll(except) {
    detailsList.forEach((details) => {
      if (details !== except) closeDetails(details);
    });
  }

  function openDetails(details) {
    if (!desktopMQ.matches) return;

    /* Cancel an in-flight close before changing any visual state. This is the
       important anti-blink path when Shop is re-entered very quickly. */
    clearClosingAnimation(details);
    details.classList.remove('via-luci-is-closing');

    closeAll(details);
    details.setAttribute('open', '');
    const summary = details.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', 'true');

    const firstTab = details.querySelector('.optionB__tabs-link[data-has-panel="true"]');
    const hasActivePanel = details.querySelector('.optionB__panel.is-active');
    if (firstTab && !hasActivePanel) {
      firstTab.dispatchEvent(new Event('via-luci:activate-tab', { bubbles: true }));
    }

    /* Remove the closing guard and enter the active state together. CSS can
       smoothly reverse a close animation without a transparent/black flash. */
    document.body.classList.remove(TRANSITION_CLASS);
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

    const isInsideSafeMegaZone = (target) => {
      if (!target || target === window || target === document) return false;
      return Boolean(
        (header && header.contains(target)) ||
        (content && content.contains(target)) ||
        details.contains(target)
      );
    };

    const scheduleClose = (event) => {
      if (!desktopMQ.matches) return;
      const nextTarget = event && (event.relatedTarget || event.toElement);
      if (isInsideSafeMegaZone(nextTarget)) {
        clearCloseTimer();
        return;
      }

      clearOpenTimer();
      clearCloseTimer();
      closeTimer = setTimeout(() => {
        const hovered = document.querySelector(':hover');
        if (hovered && isInsideSafeMegaZone(hovered)) return;
        closeDetails(details);
      }, CLOSE_DELAY);
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
      if (!desktopMQ.matches) return;
      clearCloseTimer();
    });

    details.addEventListener('toggle', syncHeaderState);
  });

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
      document.body.classList.remove(ACTIVE_CLASS, TRANSITION_CLASS);
      detailsList.forEach((details) => {
        clearClosingAnimation(details);
        details.classList.remove('via-luci-is-closing');
      });
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
   if(document.body.classList.contains('via-luci-mega-active') || document.body.classList.contains('via-luci-mega-transitioning')) lockViaLuciScroll();
   else unlockViaLuciScroll();
 });
 obs.observe(document.body,{attributes:true,attributeFilter:['class']});
});
