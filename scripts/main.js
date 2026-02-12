const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const onScroll = () => {
    const header = document.getElementById('header');
    const bg = document.querySelector('.bg-gradient');
    const scrolled = window.scrollY > 50;

    header.classList.toggle('scrolled', scrolled);

    if (!prefersReducedMotion && bg) {
        bg.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
    }
};

const createParticles = () => {
    if (prefersReducedMotion) {
        return;
    }

    const container = document.getElementById('particles');
    if (!container) {
        return;
    }

    const particleCount = 20;
    for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
};

const setupDownloads = () => {
    const statusEl = document.getElementById('downloadStatus');

    const setStatus = (text, isError = false) => {
        if (!statusEl) {
            return;
        }
        statusEl.textContent = text;
        statusEl.classList.toggle('is-error', isError);
    };

    const triggerDownload = async (button) => {
        const href = button.dataset.file;
        const fileName = button.dataset.name;

        try {
            const response = await fetch(href, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error('Файл недоступен');
            }

            const link = document.createElement('a');
            link.href = href;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();

            if (window.gsap) {
                gsap.to(button, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 });
            }
            setStatus(`Готово: ${fileName} скачивается.`);
        } catch (error) {
            setStatus('Не удалось скачать файл. Проверьте доступность конфигурации на хостинге.', true);
        }
    };

    document.querySelectorAll('.download-btn').forEach((button) => {
        button.addEventListener('click', () => triggerDownload(button));
    });
};

const setupSmoothAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) {
                return;
            }
            event.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    });
};

const runAnimations = () => {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.logo', {
        opacity: 0.5,
        x: -20,
        duration: 0.6,
        ease: 'power2.out',
    });

    gsap.from('.tg-link, .nav-link', {
        opacity: 0.5,
        x: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.1,
    });

    const revealMap = {
        '.section-card': { y: 30, opacity: 0.7, duration: 0.6, ease: 'power2.out' },
        '.instruction-step': { x: -20, opacity: 0.7, duration: 0.4, ease: 'power2.out' },
        '.game-card, .feature-card, .faq-item': { scale: 0.97, opacity: 0.7, duration: 0.45, ease: 'power2.out' },
        '.store-btn': { y: 15, opacity: 0.7, duration: 0.5, ease: 'power2.out' },
        '.download-btn': { y: 15, opacity: 0.7, duration: 0.6, ease: 'power2.out' },
        'footer': { y: 20, opacity: 0.7, duration: 0.5, ease: 'power2.out' },
    };

    Object.entries(revealMap).forEach(([selector, config]) => {
        gsap.utils.toArray(selector).forEach((element, index) => {
            gsap.from(element, {
                ...config,
                delay: index * 0.08,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 88%',
                },
            });
        });
    });
};

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupDownloads();
    setupSmoothAnchors();
    runAnimations();
    onScroll();
});
