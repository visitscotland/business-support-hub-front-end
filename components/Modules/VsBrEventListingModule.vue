<template>
    <VsTabs
        class="my-400 vs-events-listing"
        :id="moduleId"
        no-container
        data-event-listing="True"
    >
        <VsTabItem 
            v-for="eventList in module.eventsListings"
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
                    data-endpoint="http://localhost:8080/site/api/bsh/events-search/training" 
                    :module-id="moduleId"
                />
            </VsContainer>
        </VsTabItem>
    </VsTabs>

    <VsContainer>
        <VsRow>
            <VsWarning class="my-400">
                {{ configStore.getLabel('events-listings-module', 'no-js')}}
            </VsWarning>
        </VsRow>
    </VsContainer>
</template>

<script setup lang="ts">
import {
    VsContainer,
    VsHeading,
    VsTabs,
    VsTabItem,
    VsRow,
    VsWarning,
} from '@visitscotland/component-library/components';
import VsBrRichText from './VsBrRichText.vue';
import VsBrEventListing from './VsBrEventListing.vue';
import useConfigStore from '~/stores/configStore';

const props = defineProps<{
    module: Object,
}>();

const configStore = useConfigStore();
const module: any = props.module;

const moduleId = computed(() => module.anchor || 'events-listing-module');
</script>

<style lang="scss">
.vs-tabs--no-container .tab-pane .vs-heading {
    display: block !important;

    &.vs-tab__item__heading {
        display: none !important;
    }
}

.vs-warning {
    display: none;
}

.no-js {
    .vs-events-listing {
        display: none;
    }

    .vs-warning {
        display: block;
    }
}
</style>
