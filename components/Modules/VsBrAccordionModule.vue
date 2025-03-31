<template>
    <VsModuleWrapper
        :anchor-id="anchor || null"
        business-support
        :class="nested ? 'pt-0': null"
        :heading-level="nested ? 3 : 2"
        :heading-style="nested ? 'heading-m' : 'heading-xl'"
        :theme="themeValue"
    >
        <template #vs-module-wrapper-heading>
            {{ title }}
        </template>

        <template
            #vs-module-wrapper-intro
            v-if="introduction.value"
        >
            <VsBrRichText :input-content="introduction.value" />
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
    idPrefix: string,
    module: LooseObject,
}>();

const {
    anchor,
    introduction,
    nested,
    sections,
    themeValue,
    title,
} = props.module;
</script>
