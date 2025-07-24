<template>
    <!-- {{  features }}
    {{ providers }} -->
    <VsContainer>
        <div class="flex-wrapper">
            <div class="flex-column">
                <VsAlert>
                    <div v-if="selectedFeatures.length === 0">
                        Select features to see matching providers.
                    </div>
                    <div v-else-if="matchingProviders.length === 0">
                        No matches! Select fewer features.
                    </div>
                    <div v-else>
                        Shortlisted providers: {{ matchingProviders.length }}
                    </div>
                </VsAlert>
                <div class="w-200">
                    <VsButton
                        class="mt-200"
                        variant="primary"
                        :onclick="toggleView"
                        :disabled="matchingProviders.length === 0 || selectedFeatures.length === 0"
                    >
                        <span v-if="view === 'features'">
                            View results
                        </span>
                        <span v-if="view === 'results'">
                            Select features
                        </span>
                    </VsButton>
                </div>
            </div>
        </div>
        <VsRow v-if="view === 'features'">
            <VsCol
                cols="12"
                md="10"
                lg="7"
                class="col-xxl-6"
            >
                <h3>Select Features</h3>
                <div class="mb-400">
                    <fieldset
                        :key="index"
                        v-for="(group, index) in groups"
                        class="mb-200"
                    >
                        <legend>
                            {{ group }}
                        </legend>
                        <div
                            v-for="(feature) in features"
                            :key="feature + index"
                        >
                            <VsCheckbox
                                v-if="feature.groupDescription === group"
                                v-model="selectedFeatures"
                                :key="feature"
                                :ref="feature.id"
                                :name="feature.id"
                                :value="feature.id"
                                :label="checkboxLabel(feature.name, feature.description)"
                                :field-name="feature.id"
                            />
                        </div>
                    </fieldset>
                </div>
            </VsCol>
        </VsRow>
        <VsRow v-if="view === 'results'">
            <VsCol
                cols="12"
                md="10"
                lg="7"
                class="col-xxl-6"
            >
                <VsEventCard
                    v-for="(provider, index) in matchingProviders"
                    cta-icon="fa-regular fa-square-arrow-up-right"
                    cta-label="Visit website"
                    :cta-href="provider.url"
                    :key="provider.name + index"
                    data-event-listing="True"
                >
                    <template #event-card-header>
                        {{ provider.name }}
                    </template>

                    <template #event-card-content>
                        <VsBrRichText :input-content="provider.description" class="mb-lg-400" />
                    </template>
                </VsEventCard>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script setup>
import { computed, ref } from 'vue';
// import axios from 'axios';
import {
    VsRow,
    VsContainer,
    VsCol,
    VsCheckbox,
    VsAlert,
    VsButton,
    VsEventCard,
} from '@visitscotland/component-library/components';
import useFeatureStore from '~/stores/featureStore.ts';

const featureStore = useFeatureStore();

const props = defineProps({
    features: {
        type: Array,
        required: true,
    },
    providers: {
        type: Array,
        required: true,
    },
});

const view = ref('features');
const selectedFeatures = ref([]);

function checkboxLabel(name, description) {
    return description === null ? `${name}` : `${name} - ${description}`;
}

const matchingProviders = computed(() => {
    if (selectedFeatures.value.length === 0) return props.providers;

    return props.providers.filter((provider) => selectedFeatures.value.every((featureId) => provider.functions.includes(featureId)));
});

// const groups = props.features.((feature) => feature.group);
const groups = new Set(props.features.map((feature) => feature.groupDescription));

// const local = 'http://localhost:8080/site/bsh-api/api/obs/form/shortlist';
// const devBrc = 'https://develop-brc-support.visitscotland.org/api/obs/form/shortlist';

// async function handleSubmit(event) {
//     event.preventDefault();
//     const payload = {
//         'online-booking-process': 'true',
//     };

//     const jsonPayload = JSON.stringify(payload);

//     try {
//         const response = await axios.post(devBrc, jsonPayload, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         console.log('Response:', response.data);
//     } catch (error) {
//         console.error('Error submitting form:', error);
//     }
// }

function toggleView() {
    if (view.value === 'features') {
        view.value = 'results';
    } else if (view.value === 'results') {
        view.value = 'features';
    }
    featureStore.selectedFeatures = selectedFeatures;
    featureStore.matchingProviders = matchingProviders;
}

</script>

<style lang="scss">
    .flex-wrapper {
        position: sticky;
        justify-content: end;
        top: 100px;
        display: flex;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        align-items: end;
    }
</style>
