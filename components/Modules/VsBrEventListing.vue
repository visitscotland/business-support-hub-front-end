<template>
    <VsRow>
        <!-- <pre>{{ props.eventData }}</pre> -->
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
                        :rounded="false"
                        variant="secondary"
                        @click="clearAllFilters"
                    >
                        Clear all
                    </VsButton>
                </VsCol>
                <VsCol cols="12" class="d-block d-sm-none">Results ({{ data.total }})</VsCol>
                <VsCol cols="12" md="2">
                    <VsDropdown>
                        <template #button-content>
                            Sort by:
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
                <h3>{{ result.title }}</h3>
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
    VsPagination,
    VsRow,
} from '@visitscotland/component-library/components';

const props = defineProps<{
    dataEndpoint: string,
    eventData: any,
}>();

const query = ref<any>({});
const currentPage = ref<number>(1);

const { data, status }: { data: any, status: any } = await useFetch(props.dataEndpoint, {
    query: query.value, 
});
const totalResults = computed(() => data.value.total);
const results = computed(() => data.value.results);
const numberOfPages = computed(() => Math.ceil(totalResults.value / data.value.pageSize))

// Update the sort query parameter.
const updateSort = (event: Event) => {
    const eventTarget = event.target as HTMLButtonElement;
    const key = eventTarget.dataset.key;

    query.value.sort = key;
    currentPage.value = 1;
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
};

// Update pagination - add to pagination to query.
// Update sort - Add sortBy to query, remove pagination.
// Update filter - Add filterCat to query, remove pagination
</script>