<template>
    <VsRow>
        <VsCol cols="12" md="3">
            <div
                class="d-none d-lg-block event__results"
            >
                {{ configStore.getLabel('essentials.pagination', 'results.result') }} ({{ data.total }})
            </div>
            
            <VsBrFilter
                :filters="props.eventData.filters"
                :filter-id="filterId"
                ref="filter"
                @filter-updated="updateSelectedFilters"
            />
        </VsCol>

        <VsCol cols="12" md="9">
            <div class="events-controls">
                <div class="col1">
                    <VsButton
                        v-if="selectedFilters.length > 0"
                        :rounded="false"
                        variant="primary"
                        size="sm"
                        @click="clearAllFilters"
                    >
                        {{ configStore.getLabel('events-listings-module', 'clear-all') }}
                    </VsButton>

                    <VsButton
                        v-for="filter in selectedFilters"
                        :rounded="false"
                        variant="secondary"
                        size="sm"
                        icon="close"
                        icon-position="right"
                        @click="removeSelectedFilter(filter.fieldId, filter.key, filter.value)"
                    >
                        {{ filter.label }}
                    </VsButton>
                </div>
                <div class="col2 event__results">
                    {{ configStore.getLabel('essentials.pagination', 'results.result') }} ({{ data.total }})
                </div>
                <div class="col3">
                    <VsDropdown variant="secondary">
                        <template #button-content>
                            {{ configStore.getLabel('events-listings-module', 'sort-by') }}: {{ selectedSortBy }}
                        </template>

                        <VsDropdownItem
                            v-for="item in props.eventData.sortBy"
                            :key="item.key"
                            :data-key="item.key"
                            @click="updateSort"
                        >
                            {{ item.label }}
                        </VsDropdownItem>
                    </VsDropdown>
                </div>
            </div>

            <template v-if="data.results.length > 0">
                <VsEventCard
                    v-for="result in data.results"
                    :cta-icon="setIcon(result.cta.type)"
                    :cta-label="result.cta.label" 
                    :cta-href="result.cta.link"
                >
                    <template #event-card-header>
                        {{ result.title }}
                    </template>

                    <template #event-card-date>
                        {{ result.dates }}
                    </template>

                    <template #event-card-content>
                        <VsBrRichText :input-content="result.summary" />

                        <VsList unstyled>
                            <VsRow>
                            <VsCol
                                cols="12"
                                md="4"
                            >
                                <li v-if="result.times">
                                    <strong>Time:</strong> {{ result.times }}
                                </li>
                                <li v-if="result.price">
                                    <strong>Price:</strong> {{ result.price }}
                                </li>
                                <li v-if="result.location">
                                    <strong>Location:</strong> {{ result.location }}
                                </li>
                                <li v-if="result.organizer">
                                    <strong>Organiser:</strong> {{ result.organizer }}
                                </li>
                            </VsCol>

                            <VsCol
                                cols="12"
                                md="4"
                            >
                                <li v-if="result.registrationDeadline">
                                    <strong>Registration deadline: </strong> {{ result.registrationDeadline }}
                                </li>
                                <li v-if="result.organizer">
                                    <strong>Organiser:</strong> {{ result.organizer }}
                                </li>
                                <li v-if="result.contact">
                                    <strong>Contact:</strong> {{ result.contact }}
                                </li>
                            </VsCol>
                            </VsRow>
                        </VsList>
                    </template>
                </VsEventCard>
            </template>

            <template v-else>
                <VsEventCard>
                    <template #event-card-content>
                        {{ configStore.getLabel('essentials.pagination', 'no-results-message') }}
                    </template>
                </VsEventCard>
            </template>

            <VsPagination
                v-if="numberOfPages > 1"
                class="mt-300"
                :of-label="configStore.getLabel('essentials.pagination', 'page.of')"
                :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
                :number-of-pages="numberOfPages"
                :page-label="configStore.getLabel('essentials.pagination', 'page.page')"
                :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
                v-model="currentPage"
                @page-click="(page: number) => currentPage = page"
            />
        </VsCol>
    </VsRow>
</template>

<script setup lang="ts">
import {
    VsButton,
    VsCol,
    VsDropdown,
    VsDropdownItem,
    VsEventCard,
    VsList,
    VsPagination,
    VsRow,
} from '@visitscotland/component-library/components';
import VsBrRichText from './VsBrRichText.vue';
import VsBrFilter from './VsBrFilter.vue';
import useConfigStore from '~/stores/configStore';

const props = defineProps<{
    dataEndpoint: string,
    eventData: any,
    moduleId: string,
}>();

const configStore = useConfigStore();
const query = ref<any>({
    sort: 'date',
});
const currentPage = ref<number>(1);
const selectedSortBy = ref(props.eventData.sortBy[0].label);
const selectedFilters = ref<any>([]);
const filterId = props.eventData.title.split(' ')[0].toLowerCase();
const filter = ref();

// Call the api to get the event card data.
const { data, status }: { data: any, status: any } = await useFetch(props.eventData.baseEndPoint, {
    query: query.value, 
});
const totalResults = computed(() => data.value.total);
const results = computed(() => data.value.results);
const numberOfPages = computed(() => Math.ceil(totalResults.value / data.value.pageSize))

// Update the sort query parameter.
const updateSort = (event: Event) => {
    const eventTarget = event.target as HTMLButtonElement;
    const key = eventTarget.dataset.key;
    const label = eventTarget.textContent;

    query.value.sort = key;
    currentPage.value = 1;
    selectedSortBy.value = label;
};

// Update the selected filters when a filter input is changed.
const updateSelectedFilters = (payload: any) => {
    const {
        fieldId,
        key,
        label,
        type,
        value,
    } = payload;

    if (value && query.value[key] && !query.value[key].includes(value) && type !== 'date') {
        query.value[key].push(value);
        // Add filter to selectedFilters list.
        selectedFilters.value.push({
            fieldId,
            key,
            label,
            value,
        });
    } else if (value && (!query.value[key] || type === 'date')) {
        query.value[key] = [value];

        // If date input then remove any previous from or to filters before adding a new one.
        if (type === 'date') {
            const index = selectedFilters.value.findIndex((el) => el.key === key);
            if (index > -1) {
                selectedFilters.value.splice(index, 1);
            }
        }
        
        // Add filter to selectedFilters list.
        selectedFilters.value.push({
            fieldId,
            key,
            label,
            value,
        });
    } else {
        removeSelectedFilter(fieldId, key, value);
    }

    // Reset pagination.
    currentPage.value = 1;
};

// Remove a filter from the selected filters and api query parameters.
const removeSelectedFilter = (fieldId: string, key: string, value: string | boolean) => {
    // Remove filter from API query.
    const queryIndex = query.value[key].indexOf(value);
    
    if (queryIndex > -1) {
        query.value[key].splice(queryIndex, 1);
    } else {
        delete query.value[key];
    }

    // Remove filter from selectedFilters list.
    const index = selectedFilters.value.findIndex((el) => el.key === key);
    if (index > -1) {
        selectedFilters.value.splice(index, 1);
    }

    // Clear the filter input field.
    filter.value.resetOne(fieldId);

    // Reset pagination.
    currentPage.value = 1;
};

// Update page query parameter when the page number updates.
watch(currentPage, (newPage, oldPage) => {
    if (newPage === 1) {
        delete query.value.page;
    } else if (oldPage !== newPage) {
        query.value.page = newPage;
    }

    // Scroll to the top of the listing when the pagination changed.
    const element = document.getElementById(props.moduleId);
    element?.scrollIntoView({ behavior: 'smooth' });
});

// Clear all filters and remove all query parameters.
const clearAllFilters = () => {
    // Delete all parameters from the query.
    Object.keys(query.value).forEach(key => {
        if (key !== 'sort') {
            delete query.value[key];
        } else {
            query.value[key] = 'date';
        }
    });

    // Reset pagination, sort by and selected filters to defaults.
    currentPage.value = 1;
    selectedSortBy.value = props.eventData.sortBy[0].label;
    selectedFilters.value = [];

    // Clear all filter input fields.
    filter.value.resetAll();
};

// Map the linkType to an icon name;
const setIcon = (linkType: string) => {
    if (linkType === 'EXTERNAL') {
        return 'external-link';
    } else if (linkType === 'INTERNAL') {
        return 'internal-link';
    }

    return null;
}
</script>

<style lang="scss">
.event__results {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.25rem 0 1.75rem;

    @media (max-width: 991.98px) {
        margin: 1rem 0;
    }
}

.events-controls {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 10px;
    padding: 0 1rem;

    @media (max-width: 991.98px) {
        grid-template-columns: 1fr;
        margin-top: 2rem;
    }

    .col1 {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .col2 {
        @media (min-width: 991.98px) {
            display: none;
        }
    }
}

.vs-filter {
    @media (max-width: 991.98px) {
        padding: 0 0.5rem;
    }
}
</style>