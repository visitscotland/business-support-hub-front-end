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
                    :is-marketo="false"
                    submit-url="#"
                    data-url="https://static.visitscotland.com/forms/testing/BSHUB-968.json"
                    :messaging-url="configStore.getLabel('forms', 'form.messaging-url')"
                    recaptcha-key="6LfqqfcZAAAAACbkbPaHRZTIFpKZGAPZBDkwBKhe"
                    language="en"
                    :is-prod="false"
                    recaptcha-textarea-label="configStore.getLabel('forms', 'form.recaptcha-textarea-label')"
                >
                    <template #no-js>
                        {{ noJsMessage }}
                    </template>

                    <template #submit-error>
                        {{ configStore.getLabel('forms', 'form.error') }}
                    </template>

                    <template #submitting>
                        {{ configStore.getLabel('forms', 'form.submitting') }}
                    </template>

                    <template
                        #hidden-fields
                    >
                        <input
                            type="hidden"
                            name="activity_description"
                            value="Business Support Hub Online Booking System (Activities) download"
                        >

                        <input
                            type="hidden"
                            name="activity_source"
                            value="BSH Web Form"
                        >

                        <input
                            type="hidden"
                            name="consents"
                            value=""
                        >
                        <input
                            type="hidden"
                            name="comparisonFeatures"
                            :value="JSON.stringify(features)"
                        >
                        <input
                            type="hidden"
                            name="comparisonProviders"
                            :value="JSON.stringify(providers)"
                        >
                    </template>
                </VsForm>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */
import useConfigStore from '~/stores/configStore.ts';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsForm,
} from '@visitscotland/component-library/components';

const configStore = useConfigStore();

const props = defineProps<{ features: Array, providers: Array }>();
const features: any = props.features;
const providers: any = props.providers;

const noJsMessage = module.noJavaScriptMessage || configStore.getLabel('forms', 'form.no-js');
</script>
