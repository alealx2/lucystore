/* ===== VIA LUCI V21 — page transitions, stable header, carousel polish ===== */
(function(){
  var root = document.documentElement;
  function getMotionMs(){
    var raw = getComputedStyle(document.documentElement).getPropertyValue('--vl-motion-duration').trim();
    if(!raw) return 200;
    var value = parseFloat(raw);
    return raw.endsWith('s') && !raw.endsWith('ms') ? value * 1000 : value;
  }

  function isInternalNavigableLink(a){
    if(!a || !a.href) return false;
    if(a.target && a.target !== '_self') return false;
    if(a.hasAttribute('download')) return false;
    if(a.dataset && (a.dataset.noTransition === 'true' || a.dataset.noRouteFade === 'true')) return false;
    var url;
    try { url = new URL(a.href, window.location.href); } catch(e){ return false; }
    if(url.origin !== window.location.origin) return false;
    if(url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return false;
    if(a.href.indexOf('/cart/add') > -1 || a.href.indexOf('/checkout') > -1) return false;
    return true;
  }

  document.addEventListener('click', function(e){
    if(e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if(!isInternalNavigableLink(a)) return;
    root.classList.add('vl-route-fading');
    window.setTimeout(function(){
      window.location.href = a.href;
    }, getMotionMs());
    e.preventDefault();
  }, true);

  window.addEventListener('pageshow', function(){
    root.classList.remove('vl-route-fading');
    root.classList.remove('vl-first-paint');
    root.classList.add('vl-page-ready');
  });

  // Neutralize theme sticky hide/reveal transforms that caused edge bounce.
  function stabilizeHeader(){
    document.querySelectorAll('.section-header, .shopify-section-header-sticky').forEach(function(el){
      el.classList.remove('shopify-section-header-hidden');
      el.style.transform = 'translate3d(0,0,0)';
      el.style.top = '0px';
    });
  }
  stabilizeHeader();
  window.addEventListener('scroll', stabilizeHeader, { passive:true });
  window.addEventListener('resize', stabilizeHeader);
})();
