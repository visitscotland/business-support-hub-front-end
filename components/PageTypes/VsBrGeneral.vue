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

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
    <pre>{{ documentData }}</pre>
        <VsBrNewsletterSignpost 
            v-if="!documentData.hideNewsletter && configStore.newsletterSignpost"
            :data="configStore.newsletterSignpost"
        />
    </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore';

import VsBrHeroSectionModule from '~/components/Modules/VsBrHeroSectionModule.vue';
import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
import VsBrModuleBuilder from '~/components/Modules/VsBrModuleBuilder.vue';
import VsBrNewsletterSignpost from '../Modules/VsBrNewsletterSignpost.vue';

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
</script>
