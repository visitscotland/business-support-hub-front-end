<template>
    <!-- <pre>{{module}}</pre> -->
    <VsTabs class="my-400">
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
                <!-- <VsBrEventListing :data-endpoint="eventList.baseEndPoint" /> -->
                <VsBrEventListing
                    :event-data="eventList"
                    data-endpoint="http://localhost:8080/site/api/bsh/events-search/training" 
                    sort-by
                />
            </VsContainer>
        </VsTabItem>
    </VsTabs>

    <!-- <pre>{{ module }}</pre> -->
</template>

<script setup lang="ts">
/**
 * TODO: Tabs
 * Update to new variant (once ready).
 * TODO: Filters
 * Add component
 * Update api query parameter when filter clicked.
 * TODO: Selected filters
 * Clear all query params when clicked
 * Remove selected filter from query when click on selected filter button
 * Only show "clear all" if a filter has been selected.
 * TODO: Sort
 * Styling, button expands to the right.
 * TODO: Loading spinner?
 * Show loading spinner while waiting for card data.
 * TODO: Pagination
 * Scroll to top of list when clicked.
 * TODO: Cards
 * Update with fix
 * How to display different details (e.g. one column or two)
 * TODO: Tidy up
 * Tidy code
 * Remove unused/dev code
 * Add comments
 * Check spacing
 * Update endpoints for feature/prod.
 * TODO: No results message
 * TODO: Accessibility
 * Live region for results section
 */
import {
    VsCol,
    VsContainer,
    VsHeading,
    VsTabs,
    VsTabItem,
    VsRow,
} from '@visitscotland/component-library/components';
import VsBrRichText from './VsBrRichText.vue';
import VsBrEventListing from './VsBrEventListing.vue';

const props = defineProps<{
    module: Object,
}>();

const module: any = props.module;

// TODO: Replace with Endpoint from the CMS.
const temporaryEndpoint = 'http://localhost:8080/site/api/bsh/events-search/training';

const { data, status }: { data: any, status: any } = await useFetch(temporaryEndpoint);
const totalResults = computed(() => data.value.total);
const results = computed(() => data.value.results);

// Hardcoded api endpoints.
module.eventsListings[0].baseEndPoint = 'http://localhost:8080/site/api/bsh/events-search/training';
module.eventsListings[1].baseEndPoint = 'http://localhost:8080/site/api/bsh/events-search/industry';
module.eventsListings[2].baseEndPoint = 'http://localhost:8080/site/api/bsh/events-search/travel-trade';
</script>


<style lang="scss">
.vs-tabs .tab-pane .vs-heading {
    display: block !important;

    &.vs-tab__item__heading {
        display: none !important;
    }
}
</style>
