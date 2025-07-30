<template>
    <VsContainer>
        <div class="alert-wrapper">
            <VsAlert>
                <div v-if="selectedFeatureValues.length === 0">
                    {{ labels.alert_no_selections }}
                </div>
                <div v-else-if="matchingProviders.length === 0">
                    {{ labels.alert_no_matches }}
                </div>
                <div v-else>
                    {{ matchingProviders.length }} {{ labels.alert_result_count }}
                </div>
            </VsAlert>
        </div>
        <VsRow v-if="view === 'features'">
            <VsCol
                cols="12"
                md="10"
                lg="7"
                class="col-xxl-6"
            >
                <div class="mb-400">
                    <fieldset
                        :key="index"
                        v-for="(group, index) in groups"
                        class="mb-200"
                    >
                        <legend class="vs-heading vs-heading--heading-m mb-100">
                            {{ group }}
                        </legend>
                        <div
                            v-for="(feature) in features"
                            :key="feature + index"
                        >
                            <VsCheckbox
                                v-if="feature.groupDescription === group"
                                v-model="selectedFeatureValues"
                                :key="feature"
                                :ref="feature.id"
                                :name="feature.id"
                                :value="feature.id"
                                :label="checkboxLabel(feature.name, feature.description)"
                                :field-name="feature.id"
                                @status-update="updateStore"
                            />
                        </div>
                    </fieldset>
                </div>
            </VsCol>
            <div class="button-wrapper w-lg-400">
                <VsButton
                    class="mt-100"
                    :variant="view === 'results' ? 'secondary' : 'primary'"
                    :onclick="toggleView"
                    :disabled="matchingProviders.length === 0 || selectedFeatureValues.length === 0"
                >
                    <span v-if="view === 'features'">
                        {{ labels.viewToggle_results }}
                    </span>
                    <span v-if="view === 'results'">
                        {{ labels.viewToggle_features }}
                    </span>
                </VsButton>
            </div>
        </VsRow>
        <VsRow v-if="view === 'results'">
            <VsCol
                cols="12"
                md="10"
                lg="7"
                class="col-xxl-6"
            >
                <h2>{{ labels.results_heading }}</h2>
                <!-- <VsEventCard
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
                </VsEventCard> -->

                <div
                    class="comparator-result"
                    v-for="(provider, index) in matchingProviders"
                    :key="provider.name + index"
                >
                    <VsLink href="{{ provider.url }}">
                        <h3>
                            {{ provider.name }}
                        </h3>
                    </VsLink>
                    <VsBrRichText :input-content="provider.description" />
                </div>
            </VsCol>
            <div class="button-wrapper w-lg-400">
                <VsButton
                    class="mt-100"
                    :class="{ 'btn-primary': view === 'features', 'btn-secondary': view === 'results' }"
                    :onclick="toggleView"
                    :disabled="matchingProviders.length === 0 || selectedFeatureValues.length === 0"
                >
                    <span v-if="view === 'features'">
                        {{ labels.viewToggle_results }}
                    </span>
                    <span v-if="view === 'results'">
                        {{ labels.viewToggle_features }}
                    </span>
                </VsButton>
            </div>
            <VsBrComparatorForm />
        </VsRow>
    </VsContainer>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
    VsRow,
    VsContainer,
    VsCol,
    VsCheckbox,
    VsAlert,
    VsButton,
    VsLink,
} from '@visitscotland/component-library/components';
import useFeatureStore from '~/stores/featureStore.ts';
import useConfigStore from '~/stores/configStore.ts';

const featureStore = useFeatureStore();
const configStore = useConfigStore();
const labels = configStore.labels['online-booking-system-comparator'];

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

const selectedFeatureValues = ref([]); // feature ID provided by ticked checkbox
const selectedFeatures = computed(() => (
    props.features.filter((feature) => selectedFeatureValues.value.includes(feature.id))
)); // array of objects to be added to the store for inclusion in the form

function checkboxLabel(name, description) {
    return description === null ? `${name}` : `${name} - ${description}`;
}

const matchingProviders = computed(() => {
    if (selectedFeatureValues.value.length === 0) return props.providers;

    return props.providers.filter((provider) => (
        selectedFeatureValues.value.every((featureId) => provider.features.includes(featureId))
    ));
});

const selectedProviders = computed(() => (
    matchingProviders.value.map((provider) => {
        const details = {
            name: provider.name,
            url: provider.url,
            contact: provider.contact,
        };
        return details;
    })
));

const groups = new Set(props.features.map((feature) => feature.groupDescription));

function toggleView() {
    if (view.value === 'features') {
        view.value = 'results';
    } else if (view.value === 'results') {
        view.value = 'features';
    }
}

function updateStore() {
    featureStore.update(selectedFeatures, selectedProviders);
}

</script>

<style lang="scss">
    .alert-wrapper {
        position: sticky;
        justify-content: end;
        top: 100px;
        display: flex;
    }
</style>
