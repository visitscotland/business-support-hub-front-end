<template>
    <VsRow>
        <!-- <pre>{{ props.eventData }}</pre> -->
        <!-- <pre>{{ data.results }}</pre> -->
        <pre>{{ configStore.labels }}</pre>
        <VsCol cols="12" md="3">
            <div
                class="d-none d-lg-block"
            >
                {{ configStore.getLabel('essentials.pagination', 'results.result') }} ({{ data.total }})
            </div>
            
            <ClientOnly fallback-tag="span" fallback="Loading comments...">
                <VsBrFilter 
                    :filters="props.eventData.filters"
                    @filter-updated="updateSelectedFilters"
                />
            </ClientOnly>
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
                        {{ configStore.getLabel('events-listings-module', 'clear-all') }}
                    </VsButton>
                </VsCol>
                <VsCol cols="12" class="d-block d-sm-none">
                    {{ configStore.getLabel('essentials.pagination', 'results.result') }} ({{ data.total }})
                </VsCol>
                <VsCol cols="12" md="2">
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
                </VsCol>
            </VsRow>

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
                {{ configStore.getLabel('essentials.pagination', 'no-results-message') }}
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

const updateSelectedFilters = (event: Event) => {
    if (!event.target) return;

    const type = event.target.dataset.type;

    let key: string,
        value: string | boolean;
    if (type === 'date') {
        key = event.target.id;
        value = event.target.value;

        if (value) {
            query.value[key] = value;
        } else {
            delete query.value[key];
        }
    } else if (type === 'boolean') {
        key = event.target.id;
        value = event.target.checked ? true : false;

        if (value) {
            query.value[key] = value;
        } else {
            delete query.value[key];
        }
    } else {
        key = type;
        value = event.target.id;

        if (value && query.value[key] && !query.value[key].includes(value)) {
            query.value[key].push(value);
        } else if (value && !query.value[key]) {
            query.value[key] = [value];
        } else {
            const index = query.value[key].indexOf(value);
            if (index > -1) {
                query.value[key].splice(index, 1);
            }
        }
    }
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
</script>