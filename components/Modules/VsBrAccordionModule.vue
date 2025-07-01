<template>
    <VsModuleWrapper
        :anchor-id="anchor || null"
        business-support
        :class="nested ? 'pt-0' : null"
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
            <VsCol class="col-md-8">
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
                            <VsBrDownloadCard
                                v-if="item.link"
                                :link="item.link"
                                :within-nested="nested || null"
                            />
                        </div>
                    </VsAccordionItem>
                </VsAccordion>
            </VsCol>
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
    VsCol,
} from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrDownloadCard from '~/components/Modules/VsBrDownloadCard.vue';

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
