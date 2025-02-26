<template>
    <!-- <pre>{{ module }}</pre> -->
    <!-- <div style="width: 500px; margin-top: 200px;">
        <VsBrFilter class="my-500" ref="filter" />

        <button @click="resetAll">Outside reset all</button>
        <button @click="resetOne">Outside reset one</button>
    </div> -->


    <VsTabs
        class="my-400"
        :id="moduleId"
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
</template>

<script setup lang="ts">
/**
 * TODO: Tabs
 * Update to new variant (once ready).
 * TODO: Filters
 * Update to new version.
 * TODO: Selected filters
 * Clear all query params when clicked
 * Remove selected filter from query when click on selected filter button
 * Only show "clear all" if a filter has been selected.
 * TODO: Sort
 * Styling, button expands to the right.
 * TODO: Loading spinner?
 * Show loading spinner while waiting for card data.
 * TODO: Cards
 * Update with fix
 * How to display different details (e.g. one column or two)
 * TODO: Tidy up
 * Tidy code
 * Remove unused/dev code
 * Add comments
 * Check spacing
 * Set min dates on datepickers.
 * labels
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
// import VsBrFilter from './VsBrFilter.vue';

const props = defineProps<{
    module: Object,
}>();

const module: any = props.module;

const moduleId = computed(() => module.anchor || 'events-listing-module');

const filter = ref();

const resetAll = () => {
    filter.value.resetAll();
};

const resetOne = () => {
    filter.value.resetOne();
};
</script>

<style lang="scss">
.vs-tabs .tab-pane .vs-heading {
    display: block !important;

    &.vs-tab__item__heading {
        display: none !important;
    }
}
</style>
