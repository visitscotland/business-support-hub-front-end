<template>
    <VsFilter
        apply-button-text="Apply"
        filter-button-text="filter"
        filter-id="events-list-filter"
    >
        <VsFilterPanel
            filter-label="Filter"
            @filter-updated="(event) => $emit('filter-updated', event)"
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
                        <label for="filter.key">
                            {{ filter.label }}
                        </label>
                        <div>
                            <input
                                type="date"
                                :id="filter.key"
                                :name="filter.key"
                                data-type="date"
                                :min="getTodayDate()"
                            >
                        </div>
                    </div>
                </template>
                <template v-else-if="getGroupType(group) === 'list'">
                    <VsCheckbox
                        v-for="filter in group"
                        :field-name="filter.key"
                        :label="filter.label"
                        value="checked"
                        size="sm"
                        data-type="boolean"
                    />
                </template>
                <template v-else-if="getGroupType(group) === 'group'">
                    <VsCheckbox
                        v-for="filter in group[0].values"
                        :field-name="filter.key"
                        :label="filter.label"
                        value="checked"
                        size="sm"
                        :data-type="getSectionKey(group)"
                    />
                </template>
            </VsFilterSection>

            <!-- <pre>{{ filterGroups }}</pre> -->
        </VsFilterPanel>
    </VsFilter>
</template>

<script setup lang="ts">
import { VsFilter, VsFilterPanel, VsFilterSection, VsCheckbox } from '@visitscotland/component-library/components';
import mitt from 'mitt';

const emitter = mitt();
provide('emitter', emitter);

const props = defineProps<{
    filters: any,
}>();

defineEmits(['filter-updated']);

// Group filters for use in filter sections.
const filterGroups: any = computed(() => {
    if (props.filters) {
        return Object.values(
            Object.groupBy(props.filters, ({ group }: { group: any }) => group)
        );
    } else {
        return [];
    }
});

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

const getTodayDate = () => {
    let todayDate = new Date();
    const offset = todayDate.getTimezoneOffset();
    todayDate = new Date(todayDate.getTime() - (offset * 60 * 1000));
    return todayDate.toISOString().split('T')[0];
};
</script>
