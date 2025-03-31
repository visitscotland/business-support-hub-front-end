<template>
    <VsModuleWrapper
        :anchor-id="anchor || null"
        business-support
        :class="nested ? 'py-0 mt-n500' : 'py-0'"
        :heading-level="nested ? 3 : 2"
        :heading-style="nested ? 'heading-m' : 'heading-xl'"
        :theme="themeValue"
    >
        <template
            v-if="title"
            #vs-module-wrapper-heading
        >
            {{ title }}
        </template>

        <template
            v-if="introduction.value && layout !== 'horizontal-list'"
            #vs-module-wrapper-intro
        >
            <VsBrRichText :input-content="introduction.value" />
        </template>

        <VsStyledList
            :source="layout === 'horizontal-list' ? introduction.value : null"
            :variant="variant"
        >
            <VsStyledListItem
                v-for="(item, index) in listItems"
                :key="index"
                :heading="item.heading"
                :heading-level="nested ? 4 : 3"
                :imageSrc="item.imageSrc ? item.imageSrc : null"
                :variant="variant"
            >
                <VsBrRichText :input-content="item.content" />
            </VsStyledListItem>

            <template
                v-if="introduction.value && layout === 'horizontal-list'"
                #list-source
            >
                <VsBrRichText :input-content="introduction.value" />
            </template>
        </VsStyledList>
    </VsModuleWrapper>
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';
import type { LooseObject } from '~/types/types';
import { VsModuleWrapper, VsStyledList, VsStyledListItem } from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

const props = defineProps<{
    module: LooseObject,
}>();

const {
    anchor,
    introduction,
    layout,
    nested,
    sections,
    themeValue,
    title,
} = props.module;
const page: Page | undefined = inject('page');

// Set the listItem content by extracting the data from the sections.
const listItems = computed(() => {
    return sections.map(({ copy, heading, image }: { copy: LooseObject, heading: string, image: LooseObject }) => {
        const content = copy.value;
        let imageSrc = '';

        // Get the image src URL.
        if (page && image) {
            const imageValue: any = page.getContent(image.cmsImage.$ref);
            imageSrc = imageValue.getOriginal().getUrl();
        }

        return { content, heading, imageSrc };
    });
});

const variant = computed(() => {
    let selectedVariant = '';

    switch (layout) {
        case 'bullet-list':
            selectedVariant = 'icon';
            break;
        case 'horizontal-list':
            selectedVariant = 'image-horizontal';
            break;
        case 'numbered-list':
            selectedVariant = 'numbered';
            break;
        case 'visual-list':
            selectedVariant = 'image';
            break;
        default:
            selectedVariant = 'image';
    }

    return selectedVariant;
});
</script>
