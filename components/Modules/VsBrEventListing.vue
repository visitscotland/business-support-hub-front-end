<template>
    <VsRow>
        <!-- <pre>{{ props.eventData }}</pre> -->
        <!-- <pre>{{ data.results }}</pre> -->
        <!-- <pre>{{ configStore.labels }}</pre> -->
        <VsCol cols="12" md="3">
            <div
                class="d-none d-lg-block"
            >
                Results ({{ data.total }})
            </div>
            
            <p>Filters</p>
        </VsCol>

        <VsCol cols="12" md="9">
            <VsRow>
                <VsCol cols="12" md="10">
                    <VsButton
                        v-if="selectedFilters.length >= 0"
                        :rounded="false"
                        variant="secondary"
                        size="sm"
                        @click="clearAllFilters"
                    >
                        Clear all
                    </VsButton>
                </VsCol>
                <VsCol cols="12" class="d-block d-sm-none">Results ({{ data.total }})</VsCol>
                <VsCol cols="12" md="2">
                    <VsDropdown variant="secondary">
                        <template #button-content>
                            Sort by: {{ selectedSortBy }}
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
                </VsCol>
            </VsRow>

            <template v-for="result in data.results">
                <VsEventCard
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

            <VsPagination
                v-if="numberOfPages > 1"
                class="mt-300"
                of-label="Of"
                next-button-label="Next"
                :number-of-pages="numberOfPages"
                page-label="Page"
                previous-button-label="Previous"
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
import useConfigStore from '~/stores/configStore';

const props = defineProps<{
    dataEndpoint: string,
    eventData: any,
}>();

const configStore = useConfigStore();
const query = ref<any>({});
const currentPage = ref<number>(1);
const selectedSortBy = ref();
const selectedFilters = ref([]);

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

const updateSelectedFilters = () => {
    // start-date=dd/MM/YYYY
    // end-date=dd/MM/YYYY
    // online=true 
    // topic=bookkeeping-finance
    // sector=accommodation

    // query.value['start-date'] = 14/02/2025
    // query.value['end-date'] = 14/03/2025
    
    // query.value.online = true

    // query.value.sector = ['accommodation', 'event']
};

// Update page query parameter when the page number updates.
watch(currentPage, (newPage, oldPage) => {
    if (newPage === 1) {
        delete query.value.page;
    } else if (oldPage !== newPage) {
        query.value.page = newPage;
    }
});

// Clear all filters and remove all query parameters.
const clearAllFilters = () => {
    // Delete all parameters from the query.
    Object.keys(query.value).forEach(key => delete query.value[key]);
    currentPage.value = 1;
    selectedSortBy.value = ''; 
};

const setIcon = (linkType: string) => {
    if (linkType === 'EXTERNAL') {
        return 'external-link';
    } else if (linkType === 'INTERNAL') {
        return 'internal-link';
    }

    return null;
}
// Update pagination - add to pagination to query.
// Update sort - Add sortBy to query, remove pagination.
// Update filter - Add filterCat to query, remove pagination
</script>