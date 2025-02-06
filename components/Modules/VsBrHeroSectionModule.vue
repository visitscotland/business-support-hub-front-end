<template>
    <VsHeroSection
        :heading="props.content.title"
        :inset="isHomePage"
        :lede="props.content.teaser"
        :src="isHomePage ? imageSrc : null"
        :img-caption="isHomePage ? imageData.description : null"
        :img-credit="isHomePage ? imageData.credit : null"
        :split="isHomePage"
    />
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';
import type { LooseObject } from '~/types/types';
import { VsHeroSection } from '@visitscotland/component-library/components';

const props = defineProps<{
    content: LooseObject,
}>();

const page: Page | undefined = inject('page');
const route = useRoute();

const isHomePage = computed(() => route.path === '/');

const imageValue = ref<any>();
const imageSrc = ref('');
const imageData = ref<any>();

 // Get the hero image data.
if (page && props.content.heroImage) {
    imageValue.value = page.getContent(props.content.heroImage.$ref);
    imageSrc.value = imageValue.value.getOriginal().getUrl();
    imageData.value = imageValue.value.model.data;
}
</script>
