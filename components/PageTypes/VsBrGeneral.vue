<template>
    <VsContainer
        v-if="!isHomePage && documentData.theme === 'top-level'"
        class="mt-075 mt-lg-200"
    >
        <VsRow>
            <VsCol
                cols="10"
                lg="8"
            >
                <VsBrBreadcrumb
                    :breadcrumb="breadcrumb"
                    :is-home="false"
                />
            </VsCol>
        </VsRow>
    </VsContainer>
    
    <VsContainer v-if="documentData.theme === 'simple' || documentData.theme === 'standard'">
        <VsHeading
            level="1"
            heading-style="display-m"
            >
            {{ documentData.title }}
        </VsHeading>
    </VsContainer>
        <VsBrHeroSectionModule
            v-else
            :content="documentData"
        />

    <template v-if="!isHomePage">
        <VsBrPageIntro
            v-if="documentData.theme !== 'top-level'"
            :content="documentData"
            :light-background="true"
            :table-of-contents-links="documentData.theme === 'standard' ? tableOfContentsLinks : undefined"
        />

        <div class="my-n300">
            <VsBrArticleModule
                v-if="documentData.theme === 'top-level'"
                :module="topLevelArticleModule"
            />
        </div>
    </template>

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
import VsBrArticleModule from '~/components/Modules/VsBrArticleModule.vue';
import VsBrBreadcrumb from '~/components/Modules/VsBrBreadcrumb.vue';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsHeading,
    VsModuleWrapper
} from '@visitscotland/component-library/components';

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

let topLevelArticleModule : any = {
};

const configStore = useConfigStore();

const route = useRoute();

const isHomePage = computed(() => route.path === '/');

const breadcrumb = ref<any[]>([]);

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    pageItems = configStore.pageItems;

    const pageContent : any = page.value.getContent(page.value.model.root);
    const pageModels : any = pageContent.models;

    if (pageModels) {
        breadcrumb.value = pageModels.breadcrumb.items;
    }

    if (configStore.otyml) {
        otyml.value = configStore.otyml;
    }

    if (documentData.theme === 'top-level') {
        topLevelArticleModule = {
            title: '',
            sections: [{
                copy: documentData.introduction,
                image: {
                    cmsImage: documentData.heroImage,
                }
            }],
        }
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
