<template>
    <VsStyledList
        :anchor-link="anchor ? anchor : null"
        :title="title"
        :variant="variant"
    >
        <template
            v-if="introduction"
            #intro
        >
            <div v-html="introduction.value" />
        </template>

        <VsStyledListItem
            v-for="(item, index) in listItems"
            :key="index"
            :heading="item.title"
            :imageSrc="item.imageSrc ? item.imageSrc : false"
            :variant="variant"
        >
            <div v-html="item.content" />
        </VsStyledListItem>
    </VsStyledList>
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';
import type { LooseObject } from '~/types/types';
import { VsStyledList, VsStyledListItem } from '@visitscotland/component-library/components';

const props = defineProps<{
    module: LooseObject,
}>();

const {
    anchor,
    introduction,
    layout,
    sections,
    title,
} = props.module;
const page: Page | undefined = inject('page');

// Set the listItem content by extracting the data from the sections.
const listItems = computed(() => {
    return sections.map(({ copy, image }: { copy: LooseObject, image: LooseObject }) => {
        const { title, content } = separateTitleFromContent(copy.value);
        let imageSrc = '';

        // Get the image src URL.
        if (page && image) {
            const imageValue: any = page.getContent(image.cmsImage.$ref);
            imageSrc = imageValue.getOriginal().getUrl();
        }

        return { title, content, imageSrc };
    });
});

const variant = computed(() => {
    if (layout === 'bullet-list') {
        return 'icon';
    } else if (layout === 'horizontal-list') {
        return 'image-horizontal';
    } else if (layout === 'numbered-list') {
        return 'numbered';
    } else if (layout === 'visual-list') {
        return 'image';
    }
});
</script>
