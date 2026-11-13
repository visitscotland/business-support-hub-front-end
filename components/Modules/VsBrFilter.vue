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
                    <fieldset>
                        <label :for="`${props.filterId}-${listFilter.key}`">
                            {{ listFilter.label }}
                        </label>
                        <div>
                            <!-- TODO use the VsInput component here -->
                            <input
                                type="date"
                                class="form-control vs-input"
                                :class="!getValidationState(props.filterId, listFilter.key) ? 'vs-input--error' : ''"
                                :id="`${props.filterId}-${listFilter.key}`"
                                :name="`${props.filterId}-${listFilter.key}`"
                                data-type="date"
                                :ref="setDateFilterRefs(`${props.filterId}-${listFilter.key}`)"
                                :data-label="listFilter.label"
                                @input="handleDateInput(props.filterId, listFilter.key, $event)"
                                :min="trainingEventStore.formatDate(minDate(props.filterId, listFilter.key))"
                                :max="trainingEventStore.formatDate(maxDate)"
                            >
                            <VsDetail
                                v-if="!getValidationState(props.filterId, listFilter.key)"
                                class="date-input--error-msg"
                                no-margins
                            >
                                <!--@TODO Needs a proper error message-->
                                Error. Date outside of acceptable range
                            </VsDetail>
                        </div>
                    </fieldset>
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
    VsCheckbox,
    VsDetail,
    VsFilter,
    VsFilterSection,
} from '@visitscotland/component-library/components';
import useTrainingEventsStore from '~/stores/trainingEventsStore.ts';
import type { EventsTabKey } from '~/types/types';
import debounceAsync from '~/utls/debounceAsync.ts';

const props = defineProps<{
    filters: any,
    filterId: keyof EventsTabKey,
}>();

const emit = defineEmits(['filter-updated']);

const configStore = useConfigStore();
const filter = ref();
const filterGroups = ref<any>();

const trainingEventStore = useTrainingEventsStore();

const dateFiltersRefs = ref<Record<string, HTMLInputElement>>({
});

// Valid = true, Invalid = false
const validationStates = {
    'training-start-date': ref(true),
    'training-end-date': ref(true),
    'industry-start-date': ref(true),
    'industry-end-date': ref(true),
    'travel-start-date': ref(true),
    'travel-end-date': ref(true),
};

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

// Reset validation state for one date picker
const resetOneValidationState = (id: string) => {
    const state = validationStates[id as keyof typeof validationStates];
    state.value = true;
};

// Reset validation states for all date pickers
const resetAllValidationStates = () => {
    for (const id in validationStates) {
        resetOneValidationState(id);
    };
};

// Reset all input fields.
const resetAll = () => {
    filter.value.resetAll();
    resetAllValidationStates();
};

// Reset one input field.
const resetOne = (id: string) => {
    if(id.endsWith('date')) {
        resetOneValidationState(id);
    }
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


const minDate = (id: string, key: string): Date => {
    if(key.endsWith('end-date') && trainingEventStore.selectedStartDate[props.filterId] && getValidationState(id, key)) {
        return trainingEventStore.selectedStartDate[props.filterId]!;
    } else {
        return new Date();
    }
};

const maxDate = computed((): Date => {
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() + 2);
    
    return targetDate;
});

const handleDateInput = (id: string, key: string, event: any): void => {
    if (key.endsWith('start-date')) {
        trainingEventStore.selectedStartDate[id as keyof EventsTabKey] = event.target.value;
    } else if (key.endsWith('end-date')) {
        trainingEventStore.selectedEndDate[id as keyof EventsTabKey] = event.target.value;
    }
};

const setDateFilterRefs = (key: string) => (element: any): void => {
    if(element) {
        dateFiltersRefs.value[key] = element;
    }
};

function validateDateInput(fieldId: string, value: string): {isValid: boolean} {
    if (!value) return {
        isValid: false,
    };

    const inputtedDate = new Date(value);
    inputtedDate.setHours(0, 0, 0, 0);

    if(Number.isNaN(inputtedDate.getTime())) {
        return {
            isValid: false,
        };
    }

    const isStartDate = fieldId.includes('start');
    const isEndDate = fieldId.includes('end');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maximum = new Date(maxDate.value);
    maximum.setHours(0, 0, 0, 0);

    if(
        isStartDate
        && inputtedDate <= today 
        || inputtedDate > maximum
    ) {
        return {
            isValid: false,
        };
    }

    const startFieldId = `${fieldId.split('-')[0]}-start-date`;
    const inputtedStartDate = dateFiltersRefs.value[startFieldId].valueAsDate;

    if (
        isEndDate 
        && inputtedDate > maximum
        || inputtedDate < today
        || (inputtedStartDate && inputtedDate < inputtedStartDate)
    ) {
        return {
            isValid: false,
        };
    }

    return {
        isValid: true,
    };
}

const debounceValidation = debounceAsync((fieldId: string, value: string) => {
    return validateDateInput(fieldId, value);
}, 750);

const handleUpdate = async(event: Event) => {
    if (!event.target) return;

    const type: string = event.target.dataset.type;
    const fieldId: string = event.target.id;

    let key: string = cleanKey(event.target.id);
    let label: string = event.target.dataset.label;
    let value: string | boolean;

    if (type === 'date') {
        const target: HTMLInputElement = event.target;
        const state = validationStates[target.id as keyof typeof validationStates];
        state.value = true;
        const validity = await debounceValidation(target.id, target.value);
        if(!validity.isValid) {
            state.value = false;
        } else{
            value = formatDate(event.target.value);
            label = `${label}: ${value}`;
        }
    } else if (type === 'boolean') {
        value = !!event.target.checked;
    } else {
        key = type;
        value = cleanKey(event.target.id);
    }

    if(value) {
        emit('filter-updated', {
            fieldId,
            key,
            label,
            type,
            value,
        });
    }

};

const getValidationState = (filterId: string, filterKey: string) => {
    const target = `${filterId}-${filterKey}`;
    return validationStates[target as keyof typeof validationStates]?.value;
};

</script>

<style lang="scss">
.vs-filter {
    .date-picker {
        margin-bottom: 0.75rem;
    }
}

.date-input {
    &--error-msg {
        color: #940F2C; //vs-color-support-error
    }
}
</style>
