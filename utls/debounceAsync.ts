function debounceAsync<T extends(...args: any[]) => any>(fn: T, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
        if (timeoutId) clearTimeout(timeoutId);
        
        return new Promise((resolve) => {
            timeoutId = setTimeout(() => {
                resolve(fn(...args));
            }, delay);
        });
    };
}
export default debounceAsync;
