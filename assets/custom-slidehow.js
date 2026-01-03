document.addEventListener('DOMContentLoaded', function () {
var slider = document.querySelector('#Slider-{{ section.id }}');
if (!slider) return;

var root = slider.closest('slideshow-component') || slider.parentElement;
if (!root) return;

var playPauseWrapper = root.querySelector('.slideshow__play-pause');
if (!playPauseWrapper) return;

var playBtn = playPauseWrapper.querySelector('.slider-circle-btn--play');
var pauseBtn = playPauseWrapper.querySelector('.slider-circle-btn--pause');

var slides = slider.querySelectorAll('.slideshow__slide');
var hasAnyVideo = false;

slides.forEach(function (slide) {
    var video = slide.querySelector('video.banner-video-bg');
    if (video) {
    slide.dataset.hasVideo = 'true';
    hasAnyVideo = true;
    } else {
    slide.dataset.hasVideo = slide.dataset.hasVideo || 'false';
    }
});

if (!hasAnyVideo) {
    playPauseWrapper.style.display = 'none';
    return;
}

function getActiveSlide() {
    var active = null;
    slides.forEach(function (slide) {
    var hidden = slide.getAttribute('aria-hidden');
    if (hidden === 'false' || hidden === null) {
        active = slide;
    }
    });
    return active;
}

function getCurrentVideo() {
    var active = getActiveSlide();
    if (!active || active.dataset.hasVideo !== 'true') return null;
    return active.querySelector('video.banner-video-bg');
}

function refreshControlsVisibility() {
    var active = getActiveSlide();
    var hasVideo = active && active.dataset.hasVideo === 'true';
    playPauseWrapper.style.display = hasVideo ? 'flex' : 'none';
}

if (playBtn) {
    playBtn.addEventListener('click', function () {
    var video = getCurrentVideo();
    if (video && video.play) {
        try { video.play(); } catch(e) {}
    }
    });
}

if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
    var video = getCurrentVideo();
    if (video && video.pause) {
        try { video.pause(); } catch(e) {}
    }
    });
}

root.addEventListener('click', function (evt) {
    var el = evt.target.closest('.slider-button, .slider-counter__link');
    if (!el) return;
    setTimeout(refreshControlsVisibility, 150);
});

var observer = new MutationObserver(function () {
    refreshControlsVisibility();
});
observer.observe(slider, { attributes:true, subtree:true, attributeFilter:['aria-hidden', 'class'] });

refreshControlsVisibility();
});