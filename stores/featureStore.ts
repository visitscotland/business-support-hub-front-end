import { defineStore } from 'pinia';

const useFeatureStore = defineStore('featureStore', {
    state: () => ({
    }),
    actions: {
        update(features, providers) {
            this.selectedFeatures = features;
            this.selectedProviders = providers;
        },
    },
});

export default useFeatureStore;
