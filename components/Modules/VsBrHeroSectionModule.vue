<template>
    <VsHeroSection
        :heading="props.content.title"
        :inset="showHeroImage"
        :lede="props.content.teaser"
        :img-src="showHeroImage ? imageSrc : null"
        :img-caption="showHeroImage ? imageData.description : null"
        :img-credit="showHeroImage ? imageData.credit : null"
        :split="showHeroImage"
    >
        <template
            v-if="tableOfContentsLinks"
            #hero-section-article-details
        >
            <VsBrLinkListModule
                :heading="configStore.getLabel('table-contents', 'title')"
                :links="tableOfContentsLinks"
                toc
            />
        </template>
    </VsHeroSection>
</template>

<script setup lang="ts">
/* eslint no-undef: 0 */

import {
    inject, computed, ref,
} from 'vue';
import type { Page } from '@bloomreach/spa-sdk';
import type { LooseObject, TableOfContentLink } from '~/types/types';
import { VsHeroSection } from '@visitscotland/component-library/components';
import useConfigStore from '~/stores/configStore.ts';
import VsBrLinkListModule from '~/components/Modules/VsBrLinkListModule.vue';

const props = defineProps<{
    content: LooseObject,
    tableOfContentsLinks?: TableOfContentLink[],
}>();

const configStore = useConfigStore();
const page: Page | undefined = inject('page');
const route = useRoute();

const isHomePage = computed(() => route.path === '/');

const imageValue = ref<any>();
const imageSrc = ref('');
const imageData = ref<any>();
const showHeroImage = computed(() => isHomePage.value && Boolean(imageData.value));

// Get the hero image data.
if (page && props.content.heroImage) {
    imageValue.value = page.getContent(props.content.heroImage.$ref);
    imageSrc.value = imageValue.value.getOriginal().getUrl();
    imageData.value = imageValue.value.model.data;
}
</script>
