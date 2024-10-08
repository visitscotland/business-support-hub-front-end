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
            :imageSrc="item.imageSrc ? item.imageSrc : null"
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

const variantMap = {
    'bullet-list': 'icon',
    'horizontal-list': 'image-horizontal',
    'numbered-list': 'numbered',
    'visual-list': 'image',
};

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
    switch (layout) {
        case 'bullet-list':
            return 'icon';
            break;
        case 'horizontal-list':
            return 'image-horizontal';
            break;
        case 'numbered-list':
            return 'numbered';
            break;
        case 'visual-list':
            return 'image';
    }
});
</script>
