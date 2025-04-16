/* eslint no-undef: 0 */

export default defineNuxtPlugin(() => {
    const scrollToHash = async() => {
        const hash = window.location.hash;

        if (hash) {
            const findEl = async(searchHash: string, attempts = 0): Promise<Element | null> => {
                const el = document.querySelector(searchHash);
                if (el) return el;
                if (attempts > 50) return null; // Stop after ~2.5s
                await new Promise((resolve) => { setTimeout(resolve, 50); });
                return findEl(searchHash, attempts + 1);
            };

            const el = await findEl(hash);
            if (el) {
                el.scrollIntoView();
            }
        }
    };

    window.addEventListener('vs-app-hydrated', () => {
        scrollToHash();
    });
});
