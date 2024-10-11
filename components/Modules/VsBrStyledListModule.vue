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
            <VsBrRichText :input-content="introduction.value" />
        </template>

        <VsStyledListItem
            v-for="(item, index) in listItems"
            :key="index"
            :heading="item.title"
            :imageSrc="item.imageSrc ? item.imageSrc : null"
            :variant="variant"
        >
            <VsBrRichText :input-content="item.content" />
        </VsStyledListItem>
    </VsStyledList>
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';
import type { LooseObject } from '~/types/types';
import { VsStyledList, VsStyledListItem } from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

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
