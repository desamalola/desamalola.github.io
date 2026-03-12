// ── Dot Navigation (Mobile Only) ─────────────────────────
const dotNav     = document.getElementById('dot-nav');
const dotItems   = document.querySelectorAll('.dot-nav-item');
const sections   = ['beranda', 'sejarah', 'struktur', 'potensi', 'galeri'];

// Tampilkan hanya di mobile
function toggleDotNav() {
    if (window.innerWidth < 1024) {
        dotNav.classList.remove('hidden');
        dotNav.classList.add('flex');
    } else {
        dotNav.classList.add('hidden');
        dotNav.classList.remove('flex');
    }
}
toggleDotNav();
window.addEventListener('resize', toggleDotNav);

// Klik dot → scroll ke section
dotItems.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Highlight dot aktif saat scroll
const sectionEls = sections.map(id => document.getElementById(id));

function updateActiveDot() {
    const scrollY      = window.scrollY + window.innerHeight / 2;
    let activeIndex    = 0;

    sectionEls.forEach((el, i) => {
        if (el && el.offsetTop <= scrollY) activeIndex = i;
    });

    dotItems.forEach((btn, i) => {
        const dot = btn.querySelector('span:last-child');
        if (i === activeIndex) {
            dot.classList.add('bg-primary', 'scale-125');
            dot.classList.remove('bg-white');
        } else {
            dot.classList.remove('bg-primary', 'scale-125');
            dot.classList.add('bg-white');
        }
    });
}

updateActiveDot();
window.addEventListener('scroll', updateActiveDot, { passive: true });

// Carousel
function initCarousel(trackId, dotsId, prevId, nextId, color = 'blue') {
    const track = document.getElementById(trackId);
    const dotsEl = document.getElementById(dotsId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const slides = track.querySelectorAll(':scope > div');
    let current = 0;
    const total = slides.length;
    
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `h-1.5 rounded-full cursor-pointer ${color === 'blue' ? 'bg-blue-200' : 'bg-slate-200'} dot`;
        dot.style.width = i === 0 ? '20px' : '6px';
        if (i === 0) dot.style.backgroundColor = color === 'blue' ? '#2563eb' : '#94a3b8';
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
    });
    
    function update() {
        track.style.transform = `translateX(-${current * 100}%)`;
        dotsEl.querySelectorAll('.dot').forEach((d, i) => {
        d.style.width = i === current ? '20px' : '6px';
        d.style.backgroundColor = i === current
            ? (color === 'blue' ? '#2563eb' : '#94a3b8')
            : (color === 'blue' ? '#bfdbfe' : '#e2e8f0');
        });
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
    }
    
    function goTo(n) {
        current = Math.max(0, Math.min(n, total - 1));
        update();
    }
    
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    });
    
    let isDragging = false, dragStart = 0;
    track.addEventListener('mousedown', e => { isDragging = true; dragStart = e.clientX; });
    track.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        const dx = e.clientX - dragStart;
        if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    });
    track.addEventListener('mouseleave', () => { isDragging = false; });
    
    update();
}
    
initCarousel('kasie-track', 'kasie-dots', 'kasie-prev', 'kasie-next', 'blue');
initCarousel('kaur-track', 'kaur-dots', 'kaur-prev', 'kaur-next', 'blue');
initCarousel('jaga-track', 'jaga-dots', 'jaga-prev', 'jaga-next', 'slate');
initCarousel('potensi-track', 'potensi-dots', 'potensi-prev', 'potensi-next', '#2563eb', '#bfdbfe');

// ── Lightbox ─────────────────────────────────────────────
const allGalleryImgs = () => [...document.querySelectorAll('#galeri img')];
let lightboxIndex = 0;

function openLightbox(card) {
    const img    = card.querySelector('img');
    const imgs   = allGalleryImgs();
    lightboxIndex = imgs.indexOf(img);
    updateLightbox();
    document.getElementById('lightbox').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const imgs = allGalleryImgs();
    document.getElementById('lightbox-img').src       = imgs[lightboxIndex].src;
    document.getElementById('lightbox-img').alt       = imgs[lightboxIndex].alt;
    document.getElementById('lightbox-counter').textContent = `${lightboxIndex + 1} / ${imgs.length}`;
}

function lightboxPrev() { const imgs = allGalleryImgs(); lightboxIndex = (lightboxIndex - 1 + imgs.length) % imgs.length; updateLightbox(); }
function lightboxNext() { const imgs = allGalleryImgs(); lightboxIndex = (lightboxIndex + 1) % imgs.length;               updateLightbox(); }

// Navigasi keyboard lightbox
document.addEventListener('keydown', e => {
    if (document.getElementById('lightbox').classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft')  lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'Escape')     closeLightbox();
});