<template>
    <VsContainer
        class="mb-400"
    >
        <VsRow>
            <VsCol
                cols="12"
                md="10"
                lg="7"
                class="col-xxl-6"
            >
                <VsForm
                    :is-marketo="module.config.type === 'marketo'"
                    :marketo-instance="module.config.marketoInstance ? module.config.marketoInstance : ''"
                    :munchkin-id="module.config.munchkinId ? module.config.munchkinId : ''"
                    :submit-url="module.config.submitUrl"
                    :data-url="module.config.jsonUrl"
                    :messaging-url="configStore.getLabel('forms', 'form.messaging-url')"
                    :country-list-url="configStore.getLabel('forms', 'form.country-url')"
                    recaptcha-key="6LfqqfcZAAAAACbkbPaHRZTIFpKZGAPZBDkwBKhe"
                    language="en"
                    :is-prod="module.config.production ? module.config.production : false"
                    :recaptcha-textarea-label="configStore.getLabel('forms', 'form.recaptcha-textarea-label')"
                >
                    <template #no-js>
                        {{ noJsMessage }}
                    </template>

                    <template #submit-error>
                        <!-- {{ configStore.getLabel('forms', 'form.error') }} -->
                        ERROR
                    </template>

                    <template #submitting>
                        <!-- {{ configStore.getLabel('forms', 'form.submitting') }} -->
                        ERROR
                    </template>

                    <template
                        #hidden-fields
                        v-if="module.config.type === 'breg'"
                    >
                        <input
                            v-if="module.config.activityCode"
                            type="hidden"
                            name="activity_code"
                            :value="module.config.activityCode"
                        >

                        <input
                            v-if="module.config.activityDescription"
                            type="hidden"
                            name="activity_description"
                            :value="module.config.activityDescription"
                        >

                        <input
                            v-if="module.config.activitySource"
                            type="hidden"
                            name="activity_source"
                            :value="module.config.activitySource"
                        >

                        <input
                            v-if="module.config.consents"
                            type="hidden"
                            name="consents"
                            :value="module.config.consents"
                        >

                        <input
                            v-if="module.config.legalBasis"
                            type="hidden"
                            name="legalBasis"
                            :value="module.config.legalBasis"
                        >
                        <input
                            v-if="featureStore.selectedFeatures"
                            type="hidden"
                            name="comparisonFeatures"
                            :value="JSON.stringify(featureStore.selectedFeatures)"
                        >
                        <input
                            v-if="featureStore.selectedProviders"
                            type="hidden"
                            name="comparisonProviders"
                            :value="JSON.stringify(featureStore.selectedProviders)"
                        >
                    </template>
                </VsForm>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script setup>
/* eslint-disable import/no-import-module-exports */
import useConfigStore from '~/stores/configStore.ts';
import useFeatureStore from '~/stores/featureStore.ts';
import {
    VsContainer,
    VsRow,
    VsCol,
    VsForm,
} from '@visitscotland/component-library/components';

const configStore = useConfigStore();
const featureStore = useFeatureStore();

const module = {
    anchor: null,
    errorMessages: null,
    marketoId: null,
    title: 'Get tailored worksheet to compare systems',
    noJavaScriptMessage: 'bhbvghhfg',
    copy: {
        contentType: 'hippostd:html',
        value: '<p>COPY</p>',
    },
    config: {
        recaptcha: '6LfqqfcZAAAAACbkbPaHRZTIFpKZGAPZBDkwBKhe',
        submitUrl: '#',
        jsonUrl: '/form.json',
        activityCode: '',
        activityDescription: 'Activity Description',
        activitySource: 'Activity Source',
        consents: 'fake,fake',
        legalBasis: null,
        type: 'breg',
    },
    type: 'FormModule',
    themeValue: 'grey',
    themeIndex: 1,
};

const noJsMessage = module.noJavaScriptMessage || configStore.getLabel('forms', 'form.no-js');
</script>
