/* Keep image-space hotspot positions aligned when the first-screen image is cropped. */
(() => {
  if (window.viaLuciHotspotViewport) return;
  window.viaLuciHotspotViewport = true;
  const instances = new Map();
  function init(root) {
    if (instances.has(root)) return;
    const canvas = root.querySelector('.hs__canvas');
    if (!canvas) return;
    const images = [...canvas.querySelectorAll('.hs__img')];
    const points = [...canvas.querySelectorAll('.hs-point')];
    let frame;
    function update() {
      if (!root.isConnected) return;
      // The section starts below the header in normal document flow. Using
      // document coordinates keeps its height stable when the visitor scrolls.
      const top = canvas.getBoundingClientRect().top + window.scrollY;
      const header = document.querySelector('.section-header');
      const offset = Math.max(0, Math.min(top, (header?.getBoundingClientRect().height || 0) + root.offsetHeight - canvas.offsetHeight));
      canvas.style.setProperty('--hs-viewport-offset', `${offset}px`);
      const image = images.find(img => getComputedStyle(img).display !== 'none');
      if (!image?.naturalWidth || !image.naturalHeight) return;
      const { width, height } = canvas.getBoundingClientRect();
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawnWidth = image.naturalWidth * scale;
      const drawnHeight = image.naturalHeight * scale;
      points.forEach(point => {
        const x = Number(point.dataset.hsX) / 100 * drawnWidth + (width - drawnWidth) / 2;
        const y = Number(point.dataset.hsY) / 100 * drawnHeight + (height - drawnHeight) / 2;
        point.style.left = `${x}px`;
        point.style.top = `${y}px`;
        // A product outside the crop must not leave an invisible focus target.
        const cropped = x < 12 || x > width - 12 || y < 12 || y > height - 12;
        point.style.visibility = cropped ? 'hidden' : '';
        point.tabIndex = cropped ? -1 : 0;
        if (cropped) point.setAttribute('aria-hidden', 'true');
        else point.removeAttribute('aria-hidden');
      });
    }
    function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }
    const observer = new ResizeObserver(schedule);
    observer.observe(canvas);
    const header = document.querySelector('.section-header');
    if (header) observer.observe(header);
    images.forEach(img => img.addEventListener('load', schedule));
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    instances.set(root, () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      images.forEach(img => img.removeEventListener('load', schedule));
      window.removeEventListener('resize', schedule);
      instances.delete(root);
    });
    schedule();
  }
  function boot() { document.querySelectorAll('[data-hs-root]').forEach(init); }
  document.addEventListener('shopify:section:load', boot);
  document.addEventListener('shopify:section:unload', event => {
    event.target.querySelectorAll('[data-hs-root]').forEach(root => instances.get(root)?.());
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
