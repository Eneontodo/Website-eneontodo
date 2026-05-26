(function() {
'use strict';

const progressBar = document.getElementById('progressBar');

function updateProgress(percent) {
if (progressBar) progressBar.style.width = percent + '%';
}

let progress = 0;
const interval = setInterval(() => {
progress += Math.random() * 10;
if (progress >= 100) {
progress = 100;
clearInterval(interval);
setTimeout(() => {
const progressContainer = document.querySelector('.progress-container');
if (progressContainer) {
progressContainer.style.opacity = '0';
setTimeout(() => {
progressContainer.style.display = 'none';
}, 300);
}
}, 500);
}
updateProgress(progress);
}, 200);

window.addEventListener('load', () => {
progress = 100;
updateProgress(100);
});

function initGSAP() {
if (typeof gsap === 'undefined') {
setTimeout(initGSAP, 50);
return;
}
if (typeof ScrollTrigger !== 'undefined') {
gsap.registerPlugin(ScrollTrigger);
}

function createParticles() {
const container = document.getElementById('particles');
if (!container) return;
container.innerHTML = '';

// +20% частиц: было 25, стало 30
const particleCount = 30;
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;

for (let i = 0; i < particleCount; i++) {
const particle = document.createElement('div');
particle.className = 'particle';
particle.style.left = Math.random() * winWidth + 'px';
particle.style.top = Math.random() * winHeight + 'px';
const size = Math.random() * 3 + 2;
particle.style.width = size + 'px';
particle.style.height = size + 'px';
particle.style.opacity = Math.random() * 0.3 + 0.2;

// Разнообразие цветов частиц
const colors = [
'rgba(25, 245, 186, 0.5)',
'rgba(139, 92, 246, 0.4)',
'rgba(255, 46, 161, 0.35)'
];
particle.style.background = colors[Math.floor(Math.random() * colors.length)];
particle.style.boxShadow = `0 0 ${Math.random() * 8 + 4}px ${particle.style.background}`;

container.appendChild(particle);

// Анимация частиц
gsap.to(particle, {
y: -winHeight * 2,
x: (Math.random() - 0.5) * 200,
rotation: Math.random() * 720,
duration: 25 + Math.random() * 20,
repeat: -1,
ease: 'none',
delay: Math.random() * 15
});
}
}

// Создаём частицы после полной загрузки
if (document.readyState === 'complete') {
createParticles();
} else {
window.addEventListener('load', createParticles);
}

// Анимации появления элементов
gsap.from('.logo', { opacity: 0, x: -20, duration: 0.8, ease: 'power2.out' });
gsap.from('.tg-link', { opacity: 0, x: 20, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2 });
gsap.from('.section-card', {
scrollTrigger: { trigger: '.section-card', start: 'top 85%' },
y: 40, opacity: 0, duration: 0.8, ease: 'power2.out'
});
gsap.utils.toArray('.instruction-step').forEach((step, i) => {
gsap.from(step, {
scrollTrigger: { trigger: step, start: 'top 92%' },
x: -30, opacity: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.1
});
});
}

if (document.readyState === 'complete') {
initGSAP();
} else {
window.addEventListener('load', initGSAP);
}

// Эффект хедера при скролле
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
if (header) {
header.classList.toggle('scrolled', window.scrollY > 50);
}
}, { passive: true });

// Параллакс фона
window.addEventListener('scroll', () => {
const scrolled = window.pageYOffset;
const bg = document.querySelector('.bg-gradient');
if (bg) {
bg.style.transform = `translateY(${scrolled * 0.15}px)`;
}
}, { passive: true });

const configLink = 'https://bit.ly/eneontodo';

function tryOpenApp(url, fallback) {
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (!isMobile) {
fallback();
return;
}
window.location.href = url;
setTimeout(() => {
if (!document.hidden) {
fallback();
}
}, 800);
}

function copyToClipboard(text, message = 'Ссылка скопирована!') {
navigator.clipboard.writeText(text).then(() => {
alert(message);
}).catch(() => {
const textarea = document.createElement('textarea');
textarea.value = text;
textarea.style.position = 'fixed';
textarea.style.left = '-9999px';
document.body.appendChild(textarea);
textarea.select();
document.execCommand('copy');
document.body.removeChild(textarea);
alert(message);
});
}

// Обработчики кнопок Hiddify
const addHiddifyBtn = document.getElementById('addHiddifyBtn');
const copyHiddifyLink = document.getElementById('copyHiddifyLink');
if (addHiddifyBtn) {
addHiddifyBtn.addEventListener('click', () => {
const deepLink = `hiddify://import/?url=${encodeURIComponent(configLink)}`;
tryOpenApp(deepLink, () => {
copyToClipboard(configLink, 'Не удалось открыть Hiddify. Ссылка скопирована.');
});
});
}
if (copyHiddifyLink) {
copyHiddifyLink.addEventListener('click', () => {
copyToClipboard(configLink);
});
}

// Обработчики кнопок Happ
const addHappBtn = document.getElementById('addHappBtn');
const copyHappLink = document.getElementById('copyHappLink');
if (addHappBtn) {
addHappBtn.addEventListener('click', () => {
const deepLink = `happ://import/?url=${encodeURIComponent(configLink)}`;
tryOpenApp(deepLink, () => {
copyToClipboard(configLink, 'Не удалось открыть Happ. Ссылка скопирована.');
});
});
}
if (copyHappLink) {
copyHappLink.addEventListener('click', () => {
copyToClipboard(configLink);
});
}

// Плавная прокрутка по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function(e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
});
});
})();