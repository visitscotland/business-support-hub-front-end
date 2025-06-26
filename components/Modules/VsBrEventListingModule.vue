<template>
    <VsTabs
        class="my-400 vs-events-listing"
        :id="moduleId"
        no-container
        data-event-listing="True"
    >
        <VsTabItem
            v-for="(eventList, index) in module.eventsListings"
            :key="index"
            :title="eventList.title"
        >
            <VsContainer class="mt-300">
                <VsRow>
                    <VsHeading
                        level="3"
                        heading-style="heading-m"
                    >
                        {{ eventList.title }}
                    </VsHeading>

                    <VsBrRichText :input-content="eventList.copy.value" />
                </VsRow>
                <VsBrEventListing
                    :event-data="eventList"
                    :module-id="moduleId"
                />
            </VsContainer>
        </VsTabItem>
    </VsTabs>

    <VsContainer>
        <VsRow>
            <VsWarning class="my-400">
                {{ configStore.getLabel('events-listings-module', 'no-js') }}
            </VsWarning>
        </VsRow>
    </VsContainer>
</template>

<script setup lang="ts">
/* eslint import/no-import-module-exports: 0 */

import { computed } from 'vue';
import {
    VsContainer,
    VsHeading,
    VsTabs,
    VsTabItem,
    VsRow,
    VsWarning,
} from '@visitscotland/component-library/components';
import useConfigStore from '~/stores/configStore.ts';
import VsBrRichText from './VsBrRichText.vue';
import VsBrEventListing from './VsBrEventListing.vue';

const props = defineProps<{
    module: Object,
}>();

const configStore = useConfigStore();
const module: any = props.module;

const moduleId = computed(() => module.anchor || 'events-listing-module');
</script>

<style lang="scss">

.featured {
    .vs-event-card {
        border: 1px solid rgb(233,233,233);
    }
}
.vs-tabs--no-container .tab-pane .vs-heading {
    display: block !important;

    &.vs-tab__item__heading {
        display: none !important;
    }
}

.vs-events-listing {
    .vs-warning {
        display: none;
    }
}

.no-js {
    .vs-events-listing {
        display: none;

        .vs-warning {
            display: block;
        }
    }
}
</style>
