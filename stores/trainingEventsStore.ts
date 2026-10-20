const useTrainingEventsStore = defineStore('trainingEventsStore', () => {

    // The current date as reported by the client device
    const CURRENT_DATE: Date = new Date();
    const selectedStartDate = ref<Date>(CURRENT_DATE);
    const selectedEndDate = ref<Date | null>(null);
    
    const formatDate = (date: Date) => {
        const dateInput = typeof date === 'string' ? new Date(date) : date;
        return dateInput.toISOString().split('T')[0];
    };

    return {
        CURRENT_DATE,
        selectedStartDate,
        selectedEndDate,
        formatDate,
    };

});

export default useTrainingEventsStore;
