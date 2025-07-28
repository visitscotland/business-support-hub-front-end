<template>
    <VsContainer>
        <!-- {{ featureStore }} -->
        <!-- <div class="flex-wrapper">
            <div class="flex-column">
                <VsAlert>
                    <div v-if="selectedFeatures.length === 0">
                        HARDCODED - Select features to see matching providers.
                    </div>
                    <div v-else-if="matchingProviders.length === 0">
                        HARDCODED - No matches! Select fewer features.
                    </div>
                    <div v-else>
                        HARDCODED - Shortlisted providers: {{ matchingProviders.length }}
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
                            HARDCODED - View results
                        </span>
                        <span v-if="view === 'results'">
                            HARDCODED - Select features
                        </span>
                    </VsButton>
                </div>
            </div>
        </div> -->
        <!-- <VsRow v-if="view === 'features'">
            <VsCol
                cols="12"
                md="10"
                lg="7"
                class="col-xxl-6"
            >
                <h3>HARDCODED - Select Features</h3>
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
                                @status-update="updateStore"
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
                <h3>HARDCODED - Matching providers</h3>
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
        </VsRow> -->
        <VsTabs>
            <VsTabItem
                title="Select features"
            >
                <div class="mb-400 p-200">
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
                                @status-update="updateStore"
                            />
                        </div>
                    </fieldset>
                </div>
            </VsTabItem>
            <VsTabItem
                :title="resultTabTitle"
                :disabled="selectedFeatures.length === 0 || matchingProviders.length === 0"
            >
                <div class="p-200">
                    <VsCol
                        cols="12"
                        md="10"
                        lg="7"
                        class="col-xxl-6"
                    >
                        <ul>
                            <li
                                v-for="(provider, index) in matchingProviders"
                                :key="provider.name + index"
                            >
                                <a href="provider.url">
                                    {{ provider.name }}
                                </a>
                            </li>
                        </ul>
                    </VsCol>
                </div>
            </VsTabItem>
        </VsTabs>
    </VsContainer>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
    VsContainer,
    VsCol,
    VsCheckbox,
    VsTabs,
    VsTabItem,
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

const selectedFeatures = ref([]);

// COMPUTED MICROCOPY
function checkboxLabel(name, description) {
    return description === null ? `${name}` : `${name} - ${description}`;
}

const matchingProviders = computed(() => {
    if (selectedFeatures.value.length === 0) return props.providers;

    return props.providers.filter((provider) => (
        selectedFeatures.value.every((featureId) => provider.features.includes(featureId))
    ));
});

const resultTabTitle = computed(() => {
    if (selectedFeatures.value.length > 0) {
        return `Results (${matchingProviders.value.length})`;
    };
    return 'No matches';
});

const selectedProviders = computed(() => (
    matchingProviders.value.map((provider) => {
        const details = {
            name: provider.name,
            url: provider.url,
        };
        return JSON.stringify(details);
    })
));

const groups = new Set(props.features.map((feature) => feature.groupDescription));

function updateStore() {
    featureStore.update(selectedFeatures, selectedProviders);
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
