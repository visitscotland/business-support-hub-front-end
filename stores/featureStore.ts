import { defineStore } from 'pinia';

interface IFeatureState {
    selectedFeatures: any,
    matchingProviders: any,
}

const useFeatureStore = defineStore('featureStore', {
    state: (): IFeatureState => ({

    }),
    actions: {

    },
});

export default useFeatureStore;
