<template>
    <VsBrPageIntro
        :content="documentData"
        :light-background="true"
    />

    <VsBrIntroImage
        :image="heroImage"
    />

    <VsBrLinkListModule
        :heading="configStore.labels['table-contents'].title"
        :links="tableOfContentsLinks"
        toc
    />

    <VsBrModuleBuilder
        v-if="pageItems"
        :modules="pageItems"
    />
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore';

import VsBrLinkListModule from '~/components/Modules/VsBrLinkListModule.vue';
import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
import VsBrIntroImage from '~/components/Modules/VsBrIntroImage.vue';
import VsBrModuleBuilder from '~/components/Modules/VsBrModuleBuilder.vue';

const props = defineProps<{
    component: Component,
    page: Page,
}>();

const { page } = toRefs(props);

let document : any = {
};
let documentData : any = {
};
let pageItems : any[] = [];
let heroImage = {
};

const configStore = useConfigStore();

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    pageItems = configStore.pageItems;
    heroImage = documentData.heroImage;
}

// Create list of anchor links and titles for each module, excluding nested modules.
const tableOfContentsLinks = computed(() => {
    return pageItems.flatMap(({ anchor, title, nested }) => {
        if (nested) return [];

        return { anchor, title };
    });
});
</script>
