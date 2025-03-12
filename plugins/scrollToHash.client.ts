export default defineNuxtPlugin((nuxtApp) => {
    const scrollToHash = async () => {
        const hash = window.location.hash;

        if (hash) {
            const findEl = async (hash: string, attempts = 0): Promise<Element | null> => {
                const el = document.querySelector(hash);
                if (el) return el;
                if (attempts > 50) return null; // Stop after ~2.5s
                await new Promise(resolve => setTimeout(resolve, 50));
                return findEl(hash, attempts + 1);
            };

            const el = await findEl(hash);
            if (el) {
                el.scrollIntoView();
            }
        }
    }

    window.addEventListener('vs-app-hydrated', () => {
        scrollToHash();
    });
  });