<template>
    <VsBrHeroSectionModule :content="documentData" />
    <VsBrPageIntro
        :content="documentData"
        :light-background="true"
        :table-of-contents-links="documentData.theme === 'standard' ? tableOfContentsLinks : undefined"
    />

    <VsBrModuleBuilder
        v-if="pageItems"
        :modules="pageItems"
    />

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrRelatedLinks
            v-if="otyml"
            :module="otyml"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrNewsletterSignpost 
            v-if="!documentData.hideNewsletter && configStore.newsletterSignpost"
            :data="configStore.newsletterSignpost"
        />
    </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import type { TableOfContentLink } from '~/types/types';
import useConfigStore from '~/stores/configStore';
import VsBrHeroSectionModule from '~/components/Modules/VsBrHeroSectionModule.vue';
import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
import VsBrModuleBuilder from '~/components/Modules/VsBrModuleBuilder.vue';
import VsBrRelatedLinks from '~/components/Modules/VsBrRelatedLinks.vue';
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
let pageItems: any[] = [];
const otyml = ref<any>(null);

const relatedLinks = ref<any[]>([]);

const configStore = useConfigStore();

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    pageItems = configStore.pageItems;

    if (configStore.otyml) {
        otyml.value = configStore.otyml;
    }
}

// Create list of anchor links and titles for each module, excluding nested modules.
const tableOfContentsLinks= computed((): TableOfContentLink[] => {
    return pageItems.flatMap(({ anchor, title, nested }: { anchor: string, title: string, nested: boolean }) => {
        if (nested) return [];

        return { anchor, title };
    });
});
</script>
