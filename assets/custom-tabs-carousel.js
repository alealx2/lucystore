  (function(){

    function openModalFromItem(item, mediaEl){
      if(!modal || !modalContent) return;

      modalContent.innerHTML = '';

      var clone = null;

      if(mediaEl){
        clone = mediaEl.cloneNode(true);
        if(clone.tagName === 'VIDEO'){
          clone.setAttribute('controls', 'true');
          clone.muted = false;
          clone.removeAttribute('playsinline');
        }
      } else {
        var iframe = item.querySelector('.tc-item__video--external, iframe');
        if(iframe){
          clone = iframe.cloneNode(true);
        } else {
          var img = item.querySelector('.tc-item__media-img');
          if(img){
            clone = img.cloneNode(true);
          }
        }
      }

      if(clone){
        clone.classList.add('tc-modal__media');
        modalContent.appendChild(clone);
        if(clone.tagName === 'VIDEO'){
          try { clone.play(); } catch(e){}
        }
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden','false');
      document.body.classList.add('tc-modal-open');
    }

    function closeModal(){
      if(!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden','true');
      if(modalContent){
        modalContent.innerHTML = '';
      }
      document.body.classList.remove('tc-modal-open');
    }

    if(modalClose){
      modalClose.addEventListener('click', function(e){
        e.preventDefault();
        closeModal();
      });
    }
    if(modal){
      modal.addEventListener('click', function(e){
        if(e.target === modal){
          closeModal();
        }
      });
    }
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && modal && modal.classList.contains('is-open')){
        closeModal();
      }
    });

    if(tabsShell && tabs.length <= 4){
      tabsShell.classList.add('tc__tabs-shell--no-arrows');
    }

    function scrollTabs(delta){
      if(!tabsShell) return;
      var target = tabsShell.scrollLeft + delta;
      if(typeof tabsShell.scrollTo === 'function'){
        tabsShell.scrollTo({ left: target, behavior: 'smooth' });
      } else {
        tabsShell.scrollLeft = target;
      }
    }

    if(tabsShell){
      if(tabsPrev){
        tabsPrev.addEventListener('click', function(){
          scrollTabs(-tabsShell.clientWidth * 0.7);
        });
      }
      if(tabsNext){
        tabsNext.addEventListener('click', function(){
          scrollTabs(tabsShell.clientWidth * 0.7);
        });
      }
    }

    function hexToRGB(h){
      if(!h) return [255,255,255];
      h = h.replace('#','');
      if(h.length === 3){
        h = h.split('').map(function(c){ return c + c; }).join('');
      }
      var n = parseInt(h,16);
      return [(n>>16)&255, (n>>8)&255, n&255];
    }
    function luminance(r,g,b){
      var a = [r,g,b].map(function(v){
        v/=255;
        return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4);
      });
      return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
    }
    function contrastColor(hex){
      try{
        var rgb = hexToRGB(hex);
        return luminance(rgb[0],rgb[1],rgb[2]) > 0.5 ? '#111111' : '#ffffff';
      }catch(e){
        return '#111111';
      }
    }
    function applyAutoContrast(btn){
      var auto = btn.getAttribute('data-auto') === 'true';
      if(!auto) return;
      var bg  = (btn.getAttribute('data-bg') || '#f2f2f2').trim();
      var bgh = (btn.getAttribute('data-bg-hover') || '#111111').trim();
      btn.style.setProperty('--tab-text',  contrastColor(bg));
      btn.style.setProperty('--tab-text-h',contrastColor(bgh));
    }
    tabs.forEach(applyAutoContrast);

    /* =====================
       Indicador glow tabs
       ===================== */
    function setIndicator(btn){
      if(!btn) return;

      var rect       = btn.getBoundingClientRect();
      var parentRect = btn.parentElement.getBoundingClientRect();

      var extra  = 18;
      var width  = rect.width + extra;
      var offsetX = (rect.left - parentRect.left + btn.parentElement.scrollLeft) - extra/2;

      root.querySelectorAll('.tc__indicator').forEach(function(ind){
        ind.style.width = width + 'px';
        ind.style.transform = 'translateX(' + offsetX + 'px)';
      });
    }

    
    function setHeights(panel){
      if(!wrap || !panel) return;
      wrap.style.height = panel.scrollHeight + 'px';
      panel.querySelectorAll('img').forEach(function(img){
        img.addEventListener('load', function(){
          wrap.style.height = panel.scrollHeight + 'px';
        }, { once: true });
      });
    }


    function activate(btn){
      var id = btn.getAttribute('aria-controls');

      tabs.forEach(function(t){
        t.classList.remove('is-active');
        t.setAttribute('aria-selected','false');
        t.setAttribute('tabindex','-1');
      });
      panels.forEach(function(p){
        p.classList.remove('is-active');
      });

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected','true');
      btn.setAttribute('tabindex','0');

      var panel = root.querySelector('#'+id);
      if(panel){
        panel.classList.add('is-active');
        setHeights(panel);
        setTimeout(function(){ setHeights(panel); }, 80);
      }
      setIndicator(btn);
    }

    tabs.forEach(function(btn, i){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        activate(btn);
      });
      btn.addEventListener('keydown', function(e){
        if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
          e.preventDefault();
          var next = (e.key === 'ArrowRight') ? i+1 : i-1;
          if(next < 0) next = tabs.length-1;
          if(next >= tabs.length) next = 0;
          tabs[next].focus();
          activate(tabs[next]);
        }
      });
    });

    var initial = root.querySelector('.tc-tab__btn.is-active') || tabs[0];
    if(initial){
      setIndicator(initial);
      var p = root.querySelector('#'+initial.getAttribute('aria-controls'));
      setHeights(p);
    }

    window.addEventListener('resize', function(){
      var activeTab   = root.querySelector('.tc-tab__btn.is-active');
      var activePanel = root.querySelector('.tc-panel.is-active');
      setIndicator(activeTab);
      setHeights(activePanel);
    });
    if(tabsShell){
      tabsShell.addEventListener('scroll', function(){
        var active = root.querySelector('.tc-tab__btn.is-active');
        setIndicator(active);
      }, { passive:true });
    }

    /* ============================
       VIDEO CONTROLS (cards)
       ============================ */
    function attachVideoControls(item){
      if(item.dataset.videoBound === '1') return;

      var video = item.querySelector('video.tc-item__video');
      if(!video) return;

      var playBtn  = item.querySelector('.tc-vid-btn--play');
      var pauseBtn = item.querySelector('.tc-vid-btn--pause');
      var fullBtn  = item.querySelector('.tc-vid-btn--fullscreen');

      function playVideo(){
        try { video.play(); } catch(e){}
        item.classList.add('is-playing');
      }
      function pauseVideo(){
        try { video.pause(); } catch(e){}
        item.classList.remove('is-playing');
      }

      if(playBtn){
        playBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          playVideo();
        });
      }
      if(pauseBtn){
        pauseBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          pauseVideo();
        });
      }
      if(fullBtn){
        fullBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();

          pauseVideo();

          if(video.requestFullscreen){
            video.requestFullscreen();
          } else if(video.webkitRequestFullscreen){
            video.webkitRequestFullscreen();
          } else if(video.msRequestFullscreen){
            video.msRequestFullscreen();
          } else {
            openModalFromItem(item, video);
          }
        });
      }

      item._pauseVideo = pauseVideo;
      item.dataset.videoBound = '1';
    }

    function pauseItemVideo(item){
      if(item && typeof item._pauseVideo === 'function'){
        item._pauseVideo();
      }
    }


    function initPanelCarousel(panel){
      var track = panel.querySelector('.tc-items');
      if(!track) return;

      var items = Array.from(track.querySelectorAll('.tc-item'));
      if(!items.length) return;

      items.forEach(attachVideoControls);

      var prev = panel.querySelector('.tc-arrow--prev');
      var next = panel.querySelector('.tc-arrow--next');

      var mqDesktop = window.matchMedia('(min-width: 990px)');
      var isDesktop = mqDesktop.matches;

      function initDesktopMode(){
        if(items.length < 3) return false;

        var animating = false;

        function updateCenter(){
          var cards = Array.from(track.querySelectorAll('.tc-item'));
          cards.forEach(function(card, i){
            var isActive = (i === 1);
            card.classList.toggle('is-active', isActive);
            if(!isActive) pauseItemVideo(card);
          });
        }

        function slide(direction){
          if(animating) return;
          animating = true;

          var cards = track.querySelectorAll('.tc-item');
          if(!cards.length){
            animating = false;
            return;
          }

          var firstCard = cards[0];
          var styles = getComputedStyle(track);
          var gap = parseInt(styles.gap || '40', 10);
          if(isNaN(gap)) gap = 40;
          var distance = firstCard.offsetWidth + gap;

          track.style.transition = 'transform 0.35s ease';
          track.style.transform  = 'translateX(' + (direction > 0 ? -distance : distance) + 'px)';

          setTimeout(function(){
            track.style.transition = 'none';
            track.style.transform  = 'translateX(0)';

            if(direction > 0){
              var first = track.firstElementChild;
              if(first && first.classList.contains('tc-item')){
                track.appendChild(first);
              }
            } else {
              var last = track.lastElementChild;
              if(last && last.classList.contains('tc-item')){
                track.insertBefore(last, track.firstElementChild);
              }
            }

            Array.from(track.querySelectorAll('.tc-item')).forEach(attachVideoControls);
            updateCenter();

            setTimeout(function(){
              track.style.transition = 'transform 0.35s ease';
              animating = false;
            }, 20);

          }, 350);
        }

        if(prev){
          prev.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            slide(-1);
          });
        }
        if(next){
          next.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            slide(1);
          });
        }

        track.addEventListener('click', function(e){
          if(
            e.target.closest('.tc-arrow') ||
            e.target.closest('.tc-item__controls') ||
            e.target.closest('.tc-item__btn')
          ) return;

          var card = e.target.closest('.tc-item');
          if(!card) return;

          var cards = Array.from(track.querySelectorAll('.tc-item'));
          var idx   = cards.indexOf(card);

          if(idx === 0) slide(-1);
          if(idx === 2) slide(1);
        });

        updateCenter();
        return true;
      }

      function initSimpleMode(){
        var index = 0;

        function scrollToIndex(newIndex){
          if(!items.length) return;
          if(newIndex < 0) newIndex = items.length - 1;
          if(newIndex >= items.length) newIndex = 0;
          index = newIndex;

          var cardWidth = track.clientWidth;
          var target    = cardWidth * index;

          if(typeof track.scrollTo === 'function'){
            track.scrollTo({ left: target, behavior: 'smooth' });
          } else {
            track.scrollLeft = target;
          }

          items.forEach(function(item, i){
            var isActive = (i === index);
            if(!isActive){
              pauseItemVideo(item);
            }
            item.classList.toggle('is-active', isActive);
          });
        }

        if(prev){
          prev.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            scrollToIndex(index - 1);
          });
        }
        if(next){
          next.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            scrollToIndex(index + 1);
          });
        }

        var scrollTimeout = null;
        track.addEventListener('scroll', function(){
          if(scrollTimeout) window.clearTimeout(scrollTimeout);
          scrollTimeout = window.setTimeout(function(){
            var cardWidth = track.clientWidth || 1;
            var newIndex  = Math.round(track.scrollLeft / cardWidth);
            if(newIndex < 0) newIndex = 0;
            if(newIndex >= items.length) newIndex = items.length - 1;
            index = newIndex;
            items.forEach(function(item, i){
              var isActive = (i === index);
              if(!isActive){
                pauseItemVideo(item);
              }
              item.classList.toggle('is-active', isActive);
            });
          }, 80);
        }, { passive:true });

        scrollToIndex(0);
      }

      if(isDesktop && items.length >= 3){
        initDesktopMode();
      } else {
        initSimpleMode();
      }
    }

    panels.forEach(function(panel){
      initPanelCarousel(panel);
    });

  })();