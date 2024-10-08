<template>
    <VsContainer>
        <VsRow>
            <VsCol>
                <VsHeading
                    :id="props.module.anchor ? props.module.anchor : null"
                    level="2"
                >
                    {{ props.module.title }}
                </VsHeading>
            </VsCol>
        </VsRow>
        <VsAccordion>
            <VsAccordionItem
                v-for="(item, index) in accordionItems"
                :control-id="`accordionItem${index}`"
                variant="transparent"
            >
                <template #title>
                    {{ item.title }}
                </template>

                <div class="p-3" v-html="item.content" />
            </VsAccordionItem>
        </VsAccordion>
    </VsContainer>
</template>

<script setup lang="ts">
import type { LooseObject } from '~/types/types';
import {
    VsAccordion,
    VsAccordionItem,
    VsContainer,
    VsHeading,
} from '@visitscotland/component-library/components';
import separateTitleFromContent from '~/composables/separateTitleFromContent';

const props = defineProps<{
    module: LooseObject,
}>();

// Set the accordionItem content by extracting the data from the sections.
const accordionItems = computed(() => {
    return props.module.sections.map(({ copy }: { copy: LooseObject }) => {
        return separateTitleFromContent(copy.value);
    });
});
</script>