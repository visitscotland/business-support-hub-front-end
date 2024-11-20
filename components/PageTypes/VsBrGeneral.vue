<template>

    <VsBrHeroSectionModule :content="documentData" />

    <VsBrPageIntro
        :content="documentData"
        :light-background="true"
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

import VsBrHeroSectionModule from '~/components/Modules/VsBrHeroSectionModule.vue';
import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
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

const configStore = useConfigStore();

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    pageItems = configStore.pageItems;
}

// Create list of anchor links and titles for each module, excluding nested modules.
const tableOfContentsLinks = computed(() => {
    return pageItems.flatMap(({ anchor, title, nested }) => {
        if (nested) return [];

        return { anchor, title };
    });
});

provide('tableOfContents', tableOfContentsLinks);
</script>
