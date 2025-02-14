<template>
    <VsRow>
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
                <VsCol cols="12" md="10">Selected filters</VsCol>
                <VsCol cols="12" class="d-block d-sm-none">Results ({{ data.total }})</VsCol>
                <VsCol cols="12" md="2">Sort by</VsCol>
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
                @page-click="updatePageNumber"
            />
            <button @click="update">Update</button>
        </VsCol>
    </VsRow>
</template>

<script setup lang="ts">
import {
    VsCol,
    VsPagination,
    VsRow,
} from '@visitscotland/component-library/components';

const props = defineProps<{
    dataEndpoint: string,
}>();

const query = ref<any>({
    test2: 'tim',
});

const { data, status }: { data: any, status: any } = await useFetch(props.dataEndpoint, {
    query: query.value, 
});
const totalResults = computed(() => data.value.total);
const results = computed(() => data.value.results);
const numberOfPages = computed(() => Math.ceil(totalResults.value / data.value.pageSize))

const update = () => {
    query.value['page'] = '2';

    delete query.value['test2'];
}

const updatePageNumber = (page: number) => {
    query.value.page = page;
};

// Update pagination - add to pagination to query.
// Update sort - Add sortBy to query, remove pagination.
// Update filter - Add filterCat to query, remove pagination
</script>