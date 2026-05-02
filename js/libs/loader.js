import { cache } from '../connection/cache.js';

const loadAOS = () => {
    return new Promise((res, rej) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/libs/aos.css';
        link.onload = () => {
            const sc = document.createElement('script');
            sc.src = '/assets/libs/aos.js';
            sc.onload = () => {
                if (typeof window.AOS === 'undefined') {
                    rej(new Error('AOS failed'));
                    return;
                }
                window.AOS.init();
                res();
            };
            sc.onerror = rej;
            document.head.appendChild(sc);
        };
        link.onerror = rej;
        document.head.appendChild(link);
    });
};

const loadConfetti = () => {
    return new Promise((res, rej) => {
        const sc = document.createElement('script');
        sc.src = '/assets/libs/confetti.browser.js';
        sc.onload = () => typeof window.confetti === 'undefined' ? rej(new Error('Confetti failed')) : res();
        sc.onerror = rej;
        document.head.appendChild(sc);
    });
};

const loadAdditionalFont = () => {
    const fonts = [
        '/assets/libs/sacramento.css',
        '/assets/libs/noto-naskh.css',
    ];
    return Promise.all(fonts.map(href => new Promise((res, rej) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = res;
        link.onerror = rej;
        document.head.appendChild(link);
    })));
};

/**
 * @param {Object} [opt]
 * @param {boolean} [opt.aos=true] - Load AOS library
 * @param {boolean} [opt.confetti=true] - Load Confetti library
 * @param {boolean} [opt.additionalFont=true] - Load Additional Font
 * @returns {Promise<void>}
 */
export const loader = (opt = {}) => {
    const promises = [];

    if (opt?.aos ?? true) {
        promises.push(loadAOS());
    }

    if (opt?.confetti ?? true) {
        promises.push(loadConfetti());
    }

    if (opt?.additionalFont ?? true) {
        promises.push(loadAdditionalFont());
    }

    return Promise.all(promises);
};