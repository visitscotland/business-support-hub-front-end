import type { EventsTabKey } from '~/types/types';

const useTrainingEventsStore = defineStore('trainingEventsStore', () => {
    const selectedStartDate = ref<EventsTabKey>({
        training: undefined,
        industry: undefined,
        travel: undefined,
    });
    const selectedEndDate = ref<EventsTabKey>({
        training: undefined,
        industry: undefined,
        travel: undefined,
    });
    
    const formatDate = (date: Date) => {
        const dateInput = typeof date === 'string' ? new Date(date) : date;
        return dateInput.toISOString().split('T')[0];
    };

    return {
        selectedStartDate,
        selectedEndDate,
        formatDate,
    };

});

export default useTrainingEventsStore;
