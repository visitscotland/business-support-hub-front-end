<template>
    <VsFilter
        :filter-id="props.filterId"
        :filter-label="configStore.getLabel('events-listings-module', 'filter')"
        @filter-updated="handleUpdate"
        ref="filter"
    >
        <VsFilterSection
            v-for="(group, index) in filterGroups"
            :key="group"
            :section-title="getSectionLabel(group)"
            :type="getGroupType(group)"
        >
            <template v-if="getGroupType(group) === 'list' && index === 0">
                <div
                    v-for="(listFilter, listIndex) in group"
                    :key="listIndex"
                    class="date-picker"
                >
                    <label :for="`${props.filterId}-${listFilter.key}`">
                        {{ listFilter.label }}
                    </label>
                    <div>
                        <input
                            type="date"
                            :id="`${props.filterId}-${listFilter.key}`"
                            :name="`${props.filterId}-${listFilter.key}`"
                            data-type="date"
                            :data-label="listFilter.label"
                        >
                    </div>
                </div>
            </template>
            <template v-else-if="getGroupType(group) === 'list'">
                <VsCheckbox
                    v-for="(listFilter, listIndex) in group"
                    :key="listIndex"
                    :field-name="`${props.filterId}-${listFilter.key}`"
                    :label="listFilter.label"
                    value="checked"
                    size="sm"
                    data-type="boolean"
                    :data-label="listFilter.label"
                />
            </template>
            <template v-else-if="getGroupType(group) === 'group'">
                <VsCheckbox
                    v-for="(groupFilter, groupIndex) in group[0].values"
                    :key="groupIndex"
                    :field-name="`${props.filterId}-${groupFilter.key}`"
                    :label="groupFilter.label"
                    value="checked"
                    size="sm"
                    :data-type="getSectionKey(group)"
                    :data-label="groupFilter.label"
                />
            </template>
        </VsFilterSection>
    </VsFilter>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useConfigStore from '~/stores/configStore.ts';
import {
    VsFilter, VsFilterSection, VsCheckbox,
} from '@visitscotland/component-library/components';

const props = defineProps<{
    filters: any,
    filterId: string,
}>();

const emit = defineEmits(['filter-updated']);

const configStore = useConfigStore();
const filter = ref();
const filterGroups = ref<any>();

onMounted(() => {
    // Group filters for use in filter sections.
    filterGroups.value = Object.values(
        props.filters.reduce((acc: any, value: any) => {
            acc[value.group] = acc[value.group] || [];
            acc[value.group].push(value);
            return acc;
        }, Object.create(null)),
    );
});

// Determine the group type.
const getGroupType = (group: any) => {
    if (group.some((g: any) => g.type === 'DATE')) {
        return 'list';
    } if (group.some((g: any) => g.type === 'BOOLEAN')) {
        return 'list';
    } if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return 'group';
    }

    return '';
};

// Determine the section label.
const getSectionLabel = (group: any) => {
    if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return group[0].label;
    }
    return null;
};

// Determine the section key.
const getSectionKey = (group: any) => {
    if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return group[0].key;
    }
    return null;
};

// Reset all input fields.
const resetAll = () => {
    filter.value.resetAll();
};

// Reset one input field.
const resetOne = (id: string) => {
    filter.value.resetOne(id);
};

defineExpose({
    resetAll,
    resetOne,
});

// Remove the filter id from the input id.
// This is needed for updating the api query parameter.
const cleanKey = (key: string) => key.slice(props.filterId.length + 1);

// Format date from 'YYYY-mm-dd' to 'dd/mm/YYYY'.
const formatDate = (value: string) => value.split('-').reverse().join('/');

// set and emit a payload when a filter input has change.
// This payload will be used by the parent to set the
// selected filters list and api query parameters.
const handleUpdate = (event: Event) => {
    if (!event.target) return;

    const type: string = event.target.dataset.type;
    const fieldId: string = event.target.id;

    let key: string = cleanKey(event.target.id);
    let label: string = event.target.dataset.label;
    let value: string | boolean;

    if (type === 'date') {
        value = formatDate(event.target.value);
        label = `${label}: ${value}`;
    } else if (type === 'boolean') {
        value = !!event.target.checked;
    } else {
        key = type;
        value = cleanKey(event.target.id);
    }

    emit('filter-updated', {
        fieldId,
        key,
        label,
        type,
        value,
    });
};
</script>

<style lang="scss">
.vs-filter {
    .date-picker {
        margin-bottom: 0.75rem;
    }
}
</style>
