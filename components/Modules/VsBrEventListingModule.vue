<template>
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
                <VsBrEventListing data-endpoint="http://localhost:8080/site/api/bsh/events-search/training" />

                    <!-- <template v-if="status === 'success'">
                        <VsCol cols="12" md="4">
                            <p>Results ({{ data.total }})</p>

                            <p>Filters here</p>
                        </VsCol>

                        <VsCol cols="12" md="8">
                            <template v-for="result in data.results">
                                <h3>{{ result.title }}</h3>
                            </template>
                        </VsCol>
                    </template> -->
            </VsContainer>
        </VsTabItem>
    </VsTabs>

    <!-- <pre>{{ module }}</pre> -->
</template>

<script setup lang="ts">
/**
 * TODO: Tabs
 * Update to new variant (once ready).
 * TODO: Pagination
 *  Add component
 *  Update api query parameter when page clicked.
 * TODO: Filters
 * Add component
 * Update api query parameter when filter clicked.
 * TODO: Selected filters
 * Clear all query params when clicked
 * Remove selected filter from query when click on selected filter button
 * TODO: Sort
 * Add dropdown component
 * Update api query parameter when changed.
 * TODO: Loading spinner?
 * TODO
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

module.eventsListings[0].baseEndPoint = 'http://localhost:8080/site/api/bsh/events-search/training';
module.eventsListings[1].baseEndPoint = 'http://localhost:8080/site/api/bsh/events-search/industry';
module.eventsListings[2].baseEndPoint = 'http://localhost:8080/site/api/bsh/events-search/travel';

const { data, status }: { data: any, status: any } = await useFetch(temporaryEndpoint);
const totalResults = computed(() => data.value.total);
const results = computed(() => data.value.results);
</script>


<style lang="scss">
.vs-tabs .tab-pane .vs-heading {
    display: block !important;

    &.vs-tab__item__heading {
        display: none !important;
    }
}
</style>
