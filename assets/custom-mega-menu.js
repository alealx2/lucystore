document.addEventListener('DOMContentLoaded', function () {

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

        tab.addEventListener('mouseenter', function () {
            if (!desktopMQ.matches) return;
            activateTab(tab);
        });
        tab.addEventListener('focus', function () {
            if (!desktopMQ.matches) return;
            activateTab(tab);
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

        /* ------- open/close hover ------- */
        var hoverTimeout;
        mega.addEventListener('mouseenter', function () {
        if (!desktopMQ.matches) return;
        clearTimeout(hoverTimeout);
        mega.open = true;
        });

        mega.addEventListener('mouseleave', function () {
        if (!desktopMQ.matches) return;
        hoverTimeout = setTimeout(function () {
            mega.open = false;
        }, 180);
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