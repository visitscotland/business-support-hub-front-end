<template>
    <VsFilter
        :filter-id="props.filterId"
        :filter-label="configStore.getLabel('events-listings-module', 'filter')"
        @filter-updated="handleUpdate"
        ref="filter"
    >
        <VsFilterSection
            v-for="group in filterGroups"
            :key="group"
            :section-title="getSectionLabel(group)"
            :type="getGroupType(group)"
        >
            <template v-if="getGroupType(group) === 'inline'">             
                <div
                    v-for="filter in group"
                    class="date-picker"
                >
                    <label :for="`${props.filterId}-${filter.key}`">
                        {{ filter.label }}
                    </label>
                    <div>
                        <input
                            type="date"
                            :id="`${props.filterId}-${filter.key}`"
                            :name="`${props.filterId}-${filter.key}`"
                            data-type="date"
                            :data-label="filter.label"
                        >
                    </div>
                </div>
            </template>
            <template v-else-if="getGroupType(group) === 'list'">
                <VsCheckbox
                    v-for="filter in group"
                    :field-name="`${props.filterId}-${filter.key}`"
                    :label="filter.label"
                    value="checked"
                    size="sm"
                    data-type="boolean"
                    :data-label="filter.label"
                />
            </template>
            <template v-else-if="getGroupType(group) === 'group'">
                <VsCheckbox
                    v-for="filter in group[0].values"
                    :field-name="`${props.filterId}-${filter.key}`"
                    :label="filter.label"
                    value="checked"
                    size="sm"
                    :data-type="getSectionKey(group)"
                    :data-label="filter.label"
                />
            </template>
        </VsFilterSection>
    </VsFilter>
</template>

<script setup lang="ts">
import useConfigStore from '~/stores/configStore';
import { VsFilter, VsFilterSection, VsCheckbox } from '@visitscotland/component-library/components';

const props = defineProps<{
    filters: any,
    filterId: string,
}>();

const emit = defineEmits(['filter-updated']);

const configStore = useConfigStore();
const filter = ref();
const filterGroups = ref<any>();

watch(filter, () => {
    // Group filters for use in filter sections.
    filterGroups.value = Object.values(
        Object.groupBy(props.filters, ({ group }: { group: any }) => group)
    );   
}, { once: true });

// Determine the group type.
const getGroupType = (group: any) => {
    if (group.some((g: any) => g.type === 'DATE')) {
        return 'inline';
    } else if (group.some((g: any) => g.type === 'BOOLEAN')) {
        return 'list';
    } else if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return 'group';
    }
};

// Determine the section label.
const getSectionLabel = (group: any) => {
    if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return group[0].label;
    } else {
        return null;
    }
};

// Determine the section key.
const getSectionKey = (group: any) => {
    if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return group[0].key;
    } else {
        return null;
    }
};

// Reset all input fields.
const resetAll = () => {
    filter.value.resetAll();
}

// Reset one input field.
const resetOne = (id: string) => {
    filter.value.resetOne(id);
};

defineExpose({
    resetAll,
    resetOne,
});

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
        value = event.target.value;
        label = `${label}: ${value}`;
    } else if (type === 'boolean') {
        value = event.target.checked ? true : false;
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

// Remove the filter id from the input id.
// This is needed for updating the api query parameter.
const cleanKey = (key: string) => {
    return key.slice(props.filterId.length + 1);
}
</script>
