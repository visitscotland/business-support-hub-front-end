<template>
    <VsContainer>
        <VsRow>
            <VsCol>
                <VsHeading
                    :id="props.module.anchor ? props.module.anchor : null"
                    level="2"
                    headingStyle="heading-m"
                >
                    {{ props.module.title }}
                </VsHeading>
            </VsCol>
        </VsRow>
        <VsAccordion>
            <VsAccordionItem
                v-for="(item, index) in accordionItems"
                :control-id="`${props.idPrefix}${index}`"
                variant="transparent"
            >
                <template #title>
                    {{ item.title }}
                </template>

                <div class="p-075">
                    <VsBrRichText :input-content="item.content" />
                </div>
            </VsAccordionItem>
        </VsAccordion>
    </VsContainer>
</template>

<script setup lang="ts">
import type { LooseObject } from '~/types/types';
import {
    VsAccordion,
    VsAccordionItem,
    VsCol,
    VsContainer,
    VsHeading,
    VsRow,
} from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import separateTitleFromContent from '~/composables/separateTitleFromContent';

const props = defineProps<{
    module: LooseObject,
    idPrefix: string,
}>();

// Set the accordionItem content by extracting the data from the sections.
const accordionItems = computed(() => {
    return props.module.sections.map(({ copy }: { copy: LooseObject }) => {
        return separateTitleFromContent(copy.value);
    });
});
</script>