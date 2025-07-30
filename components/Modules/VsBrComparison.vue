<template>
    <VsContainer>
        <VsTabs class="mb-200">
            <VsTabItem
                title="Required features"
            >
                <div class="p-200">
                    <!-- <fieldset
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
                                v-model="selectedFeaturesValues"
                                :key="feature"
                                :ref="feature.id"
                                :name="feature.id"
                                :value="feature.id"
                                :label="checkboxLabel(feature.name, feature.description)"
                                :field-name="feature.id"
                                @status-update="updateStore"
                            />
                        </div>
                    </fieldset> -->
                    <VsAccordion>
                        <VsAccordionItem
                            v-for="(group, index) in groups"
                            open-by-default="false"
                            heading-level="3"
                            :key="group + index"
                        >
                            <template #title>
                                <VsIcon
                                    icon=""
                                    size="sm"
                                    class="me-025 fa-fw"
                                />
                                {{ group }}
                            </template>
                            <VsBody class="p-075">
                                <div
                                    v-for="(feature) in features"
                                    :key="feature + index"
                                >
                                    <VsCheckbox
                                        v-if="feature.groupDescription === group"
                                        v-model="selectedFeaturesValues"
                                        :key="feature"
                                        :ref="feature.id"
                                        :name="feature.id"
                                        :value="feature.id"
                                        :label="checkboxLabel(feature.name, feature.description)"
                                        :field-name="feature.id"
                                        @status-update="updateStore"
                                    />
                                </div>
                            </VsBody>
                        </VsAccordionItem>
                    </VsAccordion>
                </div>
            </VsTabItem>
            <VsTabItem
                :title="resultTabTitle"
                :disabled="selectedFeaturesValues.length === 0 || matchingProviders.length === 0"
            >
                <div>
                    <VsCol>
                        <p>
                            Based on the information you submitted, you now have a shortlist of booking system providers that should be able to provide the functionality your business requires. Once you are satisfied that a provider is likely to offer what you are looking for, you will then want to arrange a demonstration of the system - we can provide you with a free worksheet to help you score and compare systems.
                        </p>

                        <VsList unstyled>
                            <li
                                v-for="(provider, index) in matchingProviders"
                                :key="provider.name + index"
                            >
                                <a href="provider.url">
                                    <h3>{{ provider.name }}</h3>
                                </a>
                                <VsBrRichText :input-content="provider.description" />
                            </li>
                        </VsList>
                    </VsCol>
                </div>
            </VsTabItem>
            <VsTabItem
                title="Request workbook"
                :disabled="selectedFeaturesValues.length === 0 || matchingProviders.length === 0"
            >
                <div class="p-md-200 px-lg-700 pt-lg-600">
                    <VsBrComparatorForm />
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
    VsAccordion,
    VsAccordionItem,
    VsList,
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

const selectedFeaturesValues = ref([]); // the feature id values from selected checkboxes
const selectedFeatures = computed(() => (
    props.features.filter((feature) => selectedFeaturesValues.value.includes(feature.id))
));

// COMPUTED MICROCOPY
function checkboxLabel(name, description) {
    return description === null ? `${name}` : `${name} - ${description}`;
}

const matchingProviders = computed(() => {
    if (selectedFeaturesValues.value.length === 0) return props.providers;

    return props.providers.filter((provider) => (
        selectedFeaturesValues.value.every((featureId) => provider.features.includes(featureId))
    ));
});

const resultTabTitle = computed(() => {
    if (selectedFeaturesValues.value.length > 0) {
        return `Platform shortlist (${matchingProviders.value.length})`;
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
