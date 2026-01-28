<template>
    <main
        class="vs-main-container"
        :class="{ 'has-edit-button': page.isPreview() }"
    >
        <BrManageContentButton
            :content="pageDocument"
        />

        <VsBrGtm />

        <VsBrPageViewEvent
            :data="pageDocument.model.data"
            :page-type="pageName"
        />

        <VsBrSearchResults
            v-if="pageName === 'bsh-page' && pageDocument.model.data.title === 'Search results'"
            :page="page"
            :component="component"
        />

        <VsBrGeneral
            v-else-if="pageName === 'bsh-page'"
            :page="page"
            :component="component"
        />

        <VsBr404
            v-else-if="pageName === 'pagenotfound'"
            :page="page"
            :component="component"
        />

        <VsBr500
            v-else-if="pageName === 'servererror'"
            :page="page"
            :component="component"
        />
    </main>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */
import { toRefs, provide } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import { BrManageContentButton } from '@bloomreach/vue3-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrGeneral from '~/components/PageTypes/VsBrGeneral.vue';
import VsBr404 from '~/components/PageTypes/VsBr404.vue';
import VsBr500 from '~/components/PageTypes/VsBr500.vue';
import VsBrSearchResults from '~/components/PageTypes/VsBrSearchResults.vue';

import VsBrGtm from '~/components/Modules/VsBrGtm.vue';

import VsBrPageViewEvent from '~/components/Utils/VsBrPageViewEvent.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

let pageComponent : any = {
};
let pageName : string = '';

let pageDocument : any = {
};

const configStore = useConfigStore();

if (page.value) {
    pageComponent = page.value.getComponent();
    pageName = pageComponent.model.name;

    const event = useRequestEvent();

    if (pageName === 'pagenotfound') {
        setResponseStatus(event, 404, 'Page Not Found');
    }

    if (pageName === 'servererror') {
        setResponseStatus(event, 500, 'Something Went Wrong');
    }

    const componentModels = component.value.getModels();

    configStore.pageMetaData = componentModels.metadata;

    configStore.activeSite = componentModels['site-id'];
    configStore.productSearch = componentModels.psrWidget;
    if (componentModels.otyml) {
        configStore.otyml = componentModels.otyml;
    }
    configStore.pageItems = componentModels.pageItems;
    configStore.labels = componentModels.labels;
    configStore.newsletterSignpost = componentModels.newsletterSignpost;
    configStore.gtm = componentModels.gtm;
    configStore.pageMetaData = componentModels.metadata;

    pageDocument = page.value.getDocument();

    configStore.locale = pageDocument.model.data.localeString;

    if (componentModels.pageConfiguration) {
        configStore.cludoCustomerId = componentModels.pageConfiguration['cludo.customer-id'];
        configStore.cludoExperienceId = componentModels.pageConfiguration['cludo.experience-id'];
        configStore.cludoEngineId = componentModels.pageConfiguration['cludo.engine-id'];
        configStore.cludoLanguage = componentModels.pageConfiguration.language;
    }

    let langString = '';

    switch (configStore.locale) {
    case 'fr':
        langString = 'fr-fr';
        break;
    case 'nl':
        langString = 'nl-nl';
        break;
    case 'de':
        langString = 'de-de';
        break;
    case 'it':
        langString = 'it-it';
        break;
    case 'es':
        langString = 'es-es';
        break;
    case 'en':
    default:
        langString = 'en-gb';
        break;
    }

    const runtimeConfig = useRuntimeConfig();

    useHead({
        title: `${pageDocument.model.data.seoTitle} ${configStore.getLabel('seo', 'title-suffix')}`,
        meta: [
            {
                name: 'title',
                content: `${pageDocument.model.data.seoTitle} ${configStore.getLabel('seo', 'title-suffix')}`,
            },
            {
                name: 'description',
                content: pageDocument.model.data.seoDescription,
            },
            {
                name: 'robots',
                content: pageDocument.model.data.noIndex ? 'noindex' : '',
            },
            {
                name: 'cludo:type',
                content: pageDocument.model.data.type,
            },
            {
                name: 'cludo:skill',
                content: pageDocument.model.data.skill,
            },
            {
                name: 'cludo:topic',
                content: pageDocument.model.data.topic,
            },
            {
                name: 'cludo:sectors',
                content: pageDocument.model.data.sectors,
            },
        ],
        htmlAttrs: {
            lang: langString,
            'data-version': configStore.pageMetaData.version,
            'component-library-version': runtimeConfig.public.COMP_LIBRARY_VERSION,
        },
        link: [
            {
                rel: 'icon',
                href: '/favicon.ico',
                sizes: 'any',
            },
            {
                rel: 'icon',
                href: '/favicon.svg',
                type: 'image/svg+xml',
            },
            {
                rel: 'apple-touch-icon',
                href: '/icons/apple-touch-icon-180-180.svg',
                sizes: 'any',
            },
            {
                rel: 'manifest',
                href: '/manifest.webmanifest',
            },
            {
                rel: 'canonical',
                href: useRequestURL().toString(),
            },
        ],
    });

    let ogImage = '';

    if (pageDocument.model.data.heroImage) {
        const imageValue = page.value.getContent(pageDocument.model.data.heroImage.$ref);
        if (imageValue) {
            ogImage = imageValue.getOriginal().getUrl();
        }
    }

    useSeoMeta({
        ogTitle: pageDocument.model.data.seoTitle,
        ogDescription: pageDocument.model.data.seoDescription,
        ogUrl: useRequestURL().toString(),
        ogImage,
    });

    onMounted(() => {
        const customerId = configStore.cludoCustomerId;
        const cludoEngineId = configStore.cludoEngineId;

        window.cludoCustomerId = customerId;
        window.cludoEngineId = cludoEngineId;

        const cludoExperienceBuilder = document.createElement('script');
        cludoExperienceBuilder.id = 'cludo-experience-manager';
        cludoExperienceBuilder.src = 'https://customer.cludo.com/scripts/bundles/experiences/manager.js';
        cludoExperienceBuilder.defer = true;

        if (customerId && customerId !== 'not-defined') {
            cludoExperienceBuilder.setAttribute('data-cid', customerId);
        }

        if (cludoEngineId && cludoEngineId !== 'not-defined') {
            cludoExperienceBuilder.setAttribute('data-eid', cludoEngineId);
        }

        document.body.appendChild(cludoExperienceBuilder);
    });
}

provide('page', page.value);
</script>

<style lang="scss">
    .vs-main-container {
        min-height: calc(100vh - 27rem);

        @media (min-width: 768px) {
            min-height: calc(100vh - 37rem);
        }

        @media (min-width: 992px) {
            min-height: calc(100vh - 28rem);
        }
    }

    // Cludo autocomplete results attaches to the VsMeganav's input field, but there's an inconsistency in the markup or styles that cause the icons to be positioned wrongly. This is a BSH-specific workaround.

    .cludo-search-autocomplete-results,
    .cludo-search-autocomplete-suggestions {
      list-style: none;
      padding: 0;

      h3 {
            font-size: 1.25rem;
            margin-top: 1rem
        }
    }

    .vs-site-search-form__label  {
        top: 26px;
    }

    @media (min-width: 992px) {
        .vs-site-search-form__label  {
            top: 35px;
        }
    }

    .vs-input__clear-button {
        top: 32px;
    }

</style>
