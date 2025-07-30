<template>
    <VsContainer class="pb-300">
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
                        <legend
                            class="vs-heading vs-heading--heading-m mb-100"
                        >
                            {{ group }}
                        </legend>
                        <div
                            v-for="(feature) in features"
                            :key="feature + index"
                        >
                            <VsCheckbox
                                v-if="feature.groupDescription === group"
                                v-model="selectedFeatureValues"
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
            <div class="w-lg-400">
                <VsButton
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
                <VsHeading level="2" class="mb-200">
                    {{ labels.results_heading }}
                </VsHeading>
                <div class="d-flex flex-column gap-200">
                    <div
                        class="comparator-result"
                        v-for="(provider, index) in matchingProviders"
                        :key="provider.name + index"
                    >
                        <VsHeading level="3">
                            <VsLink
                                href="{{ provider.url }}"
                                type="external"
                                icon-size="sm"
                            >
                                {{ provider.name }}
                            </VsLink>
                        </VsHeading>
                        <VsBrRichText :input-content="provider.description" />
                    </div>
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
    VsHeading,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

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

function checkboxLabel(name, description) {
    return description === null ? `${name}` : `${name} - ${description}`;
}

const selectedFeatureValues = ref([]);

const matchingProviders = computed(() => {
    if (selectedFeatureValues.value.length === 0) return props.providers;

    return props.providers.filter((provider) => (
        selectedFeatureValues.value.every((featureId) => provider.features.includes(featureId))
    ));
});

const groups = new Set(props.features.map((feature) => feature.groupDescription));

function toggleView() {
    if (view.value === 'features') {
        view.value = 'results';
    } else if (view.value === 'results') {
        view.value = 'features';
    }
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
