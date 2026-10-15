<template>
    <VsContainer class="pb-300" id="vs-br-comparator">
        <div class="alert-wrapper">
            <VsAlert role="alert">
                <div v-if="selectedFeatureValues.length === 0">
                    {{ labels['alert-no-selections'] }}
                </div>
                <div v-else-if="matchingProviders.length === 0">
                    {{ labels['alert-no-matches'] }}
                </div>
                <div v-else>
                    {{ matchingProviders.length }} {{ labels['alert-result-count'] }}
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
                            :key="`${feature}${index}`"
                        >
                            <VsCheckbox
                                v-if="feature.groupDescription === group"
                                v-model="selectedFeatureValues"
                                :name="feature.id"
                                :value="feature.id"
                                :label="checkboxLabel(feature.name, feature.description)"
                                :field-name="feature.id"
                            />
                        </div>
                    </fieldset>
                </div>
            </VsCol>
            <div class="w-lg-400">
                <VsButton
                    variant="primary"
                    :onclick="toggleView"
                    :disabled="matchingProviders.length === 0 || selectedFeatureValues.length === 0"
                >
                    <span>
                        {{ labels['viewToggle-results'] }}
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
                <VsHeading
                    class="mb-200"
                    heading-style="heading-m"
                    level="2"
                >
                    {{ labels['results-heading'] }}
                </VsHeading>
                <VsButton
                    class="mb-100"
                    variant="secondary"
                    :onclick="toggleView"
                    icon="fa-regular fa-arrow-left"
                    v-if="view === 'results'"
                >
                    {{ labels['viewToggle-features'] }}
                </VsButton>
                <div class="d-flex flex-column gap-200">
                    <div
                        class="comparator-result"
                        v-for="(provider, index) in matchingProviders"
                        :key="provider.name + index"
                    >
                        <VsCard
                            card-style="elevated"
                            fill-color="vs-color-background-secondary"
                        >
                            <template #vs-card-body>
                                <div class="px-125">
                                    <VsHeading
                                        heading-style="heading-xs"
                                        level="3"
                                    >
                                        <VsLink
                                            class="stretched-link"
                                            :href="provider.url"
                                            icon-size="sm"
                                            type="external"
                                        >
                                            {{ provider.name }}
                                        </VsLink>
                                    </VsHeading>

                                    <VsBody>
                                        <VsBrRichText :input-content="provider.description" />
                                    </VsBody>
                                </div>
                            </template>
                        </VsCard>
                    </div>
                </div>
            </VsCol>
            <div class="button-wrapper w-lg-400">
                <VsButton
                    v-if="(matchingProviders.length > 3)"
                    class="mt-300"
                    variant="secondary"
                    :onclick="toggleView"
                    :disabled="matchingProviders.length === 0 || selectedFeatureValues.length === 0"
                    icon="fa-regular fa-arrow-left"
                >
                    <span>
                        {{ labels['viewToggle-features'] }}
                    </span>
                </VsButton>
            </div>
            <VsBrComparatorForm
                :features="selectedFeatures"
                :providers="selectedProviders"
            />
        </VsRow>
    </VsContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    VsBody,
    VsCard,
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

type Feature = {
    id: string;
    name: string;
    description: string;
    group: string;
    groupDescription: string;
};

type Provider = {
    name: string;
    url: string;
    features: string[];
    description: string;
    contact: string;
};

type Props = {
    features: Feature[];
    providers: Provider[];
};

const props = defineProps<Props>();

const view = ref<'features' | 'results'>('features');

function checkboxLabel(name: string, description: string) {
    return description === null ? `${name}` : `${name} - ${description}`;
}

// Values from selected checkboxes
const selectedFeatureValues = ref<string[]>([]);
//  ...are used get a list of feature objects to add to the form payload
const selectedFeatures = computed(() => (
    props.features.filter((feature) => selectedFeatureValues.value.includes(feature.id))
));

// Provider objects supporting all the selected features
const matchingProviders = computed(() => {
    if (selectedFeatureValues.value.length === 0) return props.providers;

    return props.providers.filter((provider) => (
        selectedFeatureValues.value.every((featureId) => provider.features.includes(featureId))
    ));
});

// ...are pruned for inclusion as form data
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

async function toggleView() {
    if (view.value === 'features') {
        view.value = 'results';
    } else if (view.value === 'results') {
        view.value = 'features';
    };

    await nextTick();
    document.querySelector('#vs-br-comparator')?.scrollIntoView(true);
}
</script>

<style lang="scss">
    .alert-wrapper {
        position: sticky;
        justify-content: end;
        top: 100px;
        display: flex;
        z-index: 1;
    }
</style>
