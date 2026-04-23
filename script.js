// ===== PRICING CONFIG =====
// Based on the attachment pricing table:
// April (Tháng 4): 26,800,000₫
// From May 1 (Từ 1/5): 26,900,000₫ then +100,000₫/day
// Caps at 29,800,000₫ on day 30 (May 30)

const EVENT_START = new Date('2026-04-23T00:00:00+07:00');
const ESCALATION_START = new Date('2026-05-01T00:00:00+07:00');
const END_DATE = new Date('2026-05-30T23:59:59+07:00');
const DAILY_INCREASE = 100000;
const BASE_PRICE = 26800000;
const MAX_PRICE = 29800000;

// ===== PRICE CALCULATION =====
function getTodayPrice() {
    const now = new Date();
    if (now < ESCALATION_START) {
        return BASE_PRICE;
    }
    const start = new Date(ESCALATION_START);
    start.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - start) / 86400000) + 1;

    let currentPrice = BASE_PRICE + (diff * DAILY_INCREASE);
    return Math.min(currentPrice, MAX_PRICE);
}

function formatVND(n) {
    return n.toLocaleString('vi-VN') + '₫';
}

function formatVNDShort(n) {
    if (n >= 1000000) {
        const m = n / 1000000;
        return m % 1 === 0 ? m + ' triệu' : m.toFixed(1) + ' triệu';
    }
    return formatVND(n);
}

function isEventEnded() {
    return new Date() > END_DATE;
}

// ===== UPDATE PRICES =====
function updatePrices() {
    if (isEventEnded()) {
        const endedOverlay = document.getElementById('eventEnded');
        if (endedOverlay) endedOverlay.classList.add('show');
        return;
    }

    const todayPrice = getTodayPrice();
    const savings = MAX_PRICE - todayPrice;

    // Product card
    const priceTodayEl = document.getElementById('price-today');
    const priceSaveEl = document.getElementById('price-save');
    if (priceTodayEl) priceTodayEl.textContent = formatVND(todayPrice);
    if (priceSaveEl) priceSaveEl.textContent = 'Tiết kiệm ' + formatVND(savings) + ' so với giá niêm yết';

    // Price comparison: today card
    const compHighlight = document.querySelector('.comp-highlight');
    if (compHighlight) compHighlight.textContent = formatVND(todayPrice);

    // Timeline
    const tlTodayEl = document.getElementById('tl-today');
    if (tlTodayEl) tlTodayEl.textContent = formatVND(todayPrice);

    // Timeline node highlighting
    const nodeStart = document.getElementById('tl-node-start');
    const nodeToday = document.getElementById('tl-node-today');
    const nodeFinal = document.getElementById('tl-node-final');

    if (nodeStart && nodeToday && nodeFinal) {
        if (todayPrice === BASE_PRICE) {
            nodeStart.classList.add('active');
            nodeToday.style.display = 'none';
            if (nodeToday.previousElementSibling) nodeToday.previousElementSibling.style.display = 'none';
        } else if (todayPrice === MAX_PRICE) {
            nodeToday.style.display = 'none';
            if (nodeToday.previousElementSibling) nodeToday.previousElementSibling.style.display = 'none';
            nodeFinal.classList.add('active');
        } else {
            nodeToday.style.display = 'block';
            if (nodeToday.previousElementSibling) nodeToday.previousElementSibling.style.display = 'block';
            nodeToday.classList.add('active');
            nodeStart.classList.remove('active');
        }
    }
}

// ===== COUNTDOWN =====
function updateCountdown() {
    const now = new Date();
    const diff = END_DATE - now;

    if (diff <= 0) {
        if (document.getElementById('cd-days')) document.getElementById('cd-days').textContent = '0';
        if (document.getElementById('cd-hours')) document.getElementById('cd-hours').textContent = '00';
        if (document.getElementById('cd-mins')) document.getElementById('cd-mins').textContent = '00';
        if (document.getElementById('cd-secs')) document.getElementById('cd-secs').textContent = '00';
        return;
    }

    if (document.getElementById('cd-days')) document.getElementById('cd-days').textContent = Math.floor(diff / 86400000);
    if (document.getElementById('cd-hours')) document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    if (document.getElementById('cd-mins')) document.getElementById('cd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    if (document.getElementById('cd-secs')) document.getElementById('cd-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}

// ===== IMAGE AUTO CAROUSEL =====
const productImages = [
    'images/gallery-1.jpg',
    'images/gallery-2.jpg',
    'images/gallery-3.jpg'
];

let currentImageIndex = 0;

function initAutoCarousel() {
    const mainImg = document.getElementById('main-product-img');
    if (!mainImg) return;

    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
        mainImg.style.opacity = 0;
        setTimeout(() => {
            mainImg.src = productImages[currentImageIndex];
            mainImg.style.opacity = 1;
        }, 300);
    }, 3500);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updatePrices();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    initScrollAnimations();
    initAutoCarousel();
});
