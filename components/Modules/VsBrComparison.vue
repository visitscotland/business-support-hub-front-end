<template>
    <VsContainer>
        <div class="flex-wrapper">
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
        </div>
        <VsRow>
            <VsCol
                cols="12"
                md="10"
                lg="7"
                class="col-xxl-6"
            >
                <!-- {{ selectedFeatures }} -->
                <h3>Select Features</h3>
                <!-- <div v-for="feature in features" :key="feature" class="vs-checkbox form-check">
                    <label>
                        <input
                        class="form-check-input"
                            type="checkbox"
                            :value="feature.id"
                            v-model="selectedFeatures"
                        />
                        {{ feature.description }}
                    </label>
                </div> -->
                <form action="http://localhost:8080/site/bsh-api/api/obs/form/shortlist" method="GET">
                    <!-- I don't which of these parameters are actually needed -->
                    <VsCheckbox
                        v-for="feature in features"
                        v-model="selectedFeatures"
                        :key="feature"
                        :ref="feature.id"
                        :name="feature.id"
                        :value="feature.id"
                        :label="feature.description"
                        :field-name="feature.id"
                    />
                    <!-- <VsInput
                        autoComplete
                        fieldName="email-address"
                        invalid="false"
                        label="Email address"
                        reAlertErrors="false"
                        triggerValidate="false"
                        type="email"
                    /> -->
                    <!-- <label for="email-address">Email address</label>
                    <input
                        id="email-address"
                        class="form-control vs-input vs-input--email-address"
                        name="email-address"
                        type="email"
                        placeholder=""
                        autocomplete="on"
                        aria-invalid="false"
                        v=""
                        value=""
                    > -->
                    <!-- <input type="submit">Submit</input> -->
                    <VsButton
                        variant="primary"
                        :onclick="handleSubmit"
                    >
                        Submit
                    </VsButton>
                </form>
                <!-- <ul>
                    <li v-for="provider in matchingProviders" :key="provider.name">
                        <a :href="provider.url" target="_blank" rel="noopener noreferrer">
                            {{ provider.name }}
                        </a>
                    </li>
                </ul> -->
            </VsCol>
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
} from '@visitscotland/component-library/components';

// Props
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

// Selected features
const selectedFeatures = ref([]);

const matchingProviders = computed(() => {
    if (selectedFeatures.value.length === 0) return props.providers;

    return props.providers.filter((provider) => selectedFeatures.value.every((featureId) => provider.functions.includes(featureId)));
});

// const handleSubmit = () => {
//     console.log('SUBMIT!');
// };
</script>

<style lang="scss">
    .flex-wrapper {
        position: sticky;
        justify-content: end;
        top: 60px;
        display: flex;
    }
</style>
