<template>
    <section
        :class="[
            'vs-module-wrapper',
            `vs-module-wrapper--${themeValue || 'light'}`,
            'text-start',
            nested ? 'py-0 mt-n500' : 'py-0',
        ]"
    >
        <VsBrSectionHeader
            v-if="title"
            :anchor-id="anchor || undefined"
            business-support
            :heading="title"
            :heading-level="nested ? 3 : 2"
            :heading-style="nested ? 'heading-m' : 'heading-xl'"
            :lede="layout !== 'horizontal-list' ? introduction.value : undefined"
        />

        <VsStyledList
            :source="layout === 'horizontal-list' ? introduction.value : null"
            :variant="variant"
        >
            <VsStyledListItem
                v-for="(item, index) in listItems"
                :key="index"
                :heading="item.heading"
                :heading-level="nested ? 4 : 3"
                :image-src="item.imageSrc ? item.imageSrc : null"
                :variant="variant"
            >
                <VsBrRichText :input-content="item.content" />

                <VsBrDownloadCard
                    v-if="item.link"
                    :link="item.link"
                    :within-nested="nested || null"
                />
            </VsStyledListItem>

            <template
                v-if="introduction.value && layout === 'horizontal-list'"
                #list-source
            >
                <VsBrRichText :input-content="introduction.value" />
            </template>
        </VsStyledList>
    </section>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Page } from '@bloomreach/spa-sdk';
import type { DownloadCardLink, LooseObject } from '~/types/types';
import { VsStyledList, VsStyledListItem } from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrDownloadCard from '~/components/Modules/VsBrDownloadCard.vue';
import VsBrSectionHeader from '~/components/Modules/VsBrSectionHeader.vue';

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
const listItems = computed(() => sections.map(
    (
        { copy, heading, image, link }:
            { copy: LooseObject, heading: string, image: LooseObject, link: DownloadCardLink },
    ) => {
        const content = copy.value;
        let imageSrc = '';

        // Get the image src URL.
        if (page && image) {
            const imageValue: any = page.getContent(image.cmsImage.$ref);
            imageSrc = imageValue.getOriginal().getUrl();
        }

        return {
            content,
            heading,
            imageSrc,
            link,
        };
    },
));

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
