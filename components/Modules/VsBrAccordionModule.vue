<template>
    <pre>{{ module }}</pre>
    <VsModuleWrapper
        :anchor-id="anchor || null"
        :heading-level="nested ? 3 : 2"
        businessSupport
    >
        <template #vs-module-wrapper-heading>
            {{ title }}
        </template>
        <VsContainer>
            <VsAccordion>
                <VsAccordionItem
                    v-for="(item, index) in sections"
                    :key="index"
                    :control-id="`${props.idPrefix}${index}`"
                    :heading-level="nested ? 4 : 3"
                    variant="transparent"
                >
                    <template #title>
                        {{ item.heading }}
                    </template>

                    <div class="p-075">
                        <VsBrRichText :input-content="item.copy.value" />
                    </div>
                </VsAccordionItem>
            </VsAccordion>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script setup lang="ts">
import type { LooseObject } from '~/types/types';
import {
    VsAccordion,
    VsAccordionItem,
    VsContainer,
    VsModuleWrapper,
} from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

const props = defineProps<{
    module: LooseObject,
    idPrefix: string,
}>();

const {
    anchor,
    nested,
    sections,
    title,
} = props.module;
</script>
