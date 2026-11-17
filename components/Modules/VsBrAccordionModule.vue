<template>
    <section
        :class="[
            'vs-module-wrapper',
            `vs-module-wrapper--${themeValue || 'light'}`,
            'text-start',
            nested ? 'pt-0' : null,
        ]"
    >
        <VsBrSectionHeader
            :anchor-id="anchor || undefined"
            business-support
            :heading="title"
            :heading-level="nested ? 3 : 2"
            :heading-style="nested ? 'heading-m' : 'heading-xl'"
            :lede="introduction.value"
        />

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
                            <VsBody>
                                <VsBrRichText :input-content="item.copy.value" />
                            </VsBody>
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
    </section>
</template>

<script setup lang="ts">
import type { LooseObject } from '~/types/types';
import {
    VsAccordion,
    VsAccordionItem,
    VsContainer,
    VsCol,
    VsBody,
} from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrDownloadCard from '~/components/Modules/VsBrDownloadCard.vue';
import VsBrSectionHeader from '~/components/Modules/VsBrSectionHeader.vue';

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
