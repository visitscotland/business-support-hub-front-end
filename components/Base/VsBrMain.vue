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
        const customerId = componentModels.cludoCustomerId;
        const cludoEngineId = componentModels.cludoEngineId;
        const cludoExperienceId = componentModels.cludoExperienceId;

        window.cludoCustomerId = customerId;
        window.cludoEngineId = cludoEngineId;
        window.cludoExperienceId = cludoExperienceId;

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

        if (cludoExperienceId && cludoExperienceId !== 'not-defined') {
            cludoExperienceBuilder.setAttribute('data-xid', cludoExperienceId);
        }

        document.body.appendChild(cludoExperienceBuilder);

        const config = {
            apiKey: 'b1bb8c0dde81a164f6d00d1bf108837fefb2def6',
            product: 'COMMUNITY',
            statement: {
                description: 'For more detailed information, please check our',
                name: 'Cookie and Privacy Statement',
                url: 'https://www.visitscotland.com/policies/privacy',
                updated: '25/05/2018',
            },
            optionalCookies: [
                {
                    name: 'Marketing',
                    label: 'Marketing Cookies',
                    description: 'These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose. These cookies may be set through our site by our advertising partners. They do not store directly personal information but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, the advertising you see may not be as relevant.',
                    onAccept() {
                        setTimeout(() => {
                            window.dispatchEvent(new Event('cookiesUpdated'));
                        });
                    },
                    onRevoke() {
                        setTimeout(() => {
                            window.dispatchEvent(new Event('cookiesUpdated'));
                        });
                    },
                },
                {
                    name: 'Analytics',
                    label: 'Analytics Cookies',
                    description: 'These cookies allow us to count the number of visitors, help us to know which pages are the most and least popular and see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily. All information these cookies collect is combined together and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site and will not be able to monitor its performance. Third party performance cookies are deployed by a different website provider, such as Google.',
                    onAccept() {
                        setTimeout(() => {
                            window.dispatchEvent(new Event('cookiesUpdated'));
                        });
                    },
                    onRevoke() {
                        setTimeout(() => {
                            window.dispatchEvent(new Event('cookiesUpdated'));
                        });
                    },
                },
                {
                    name: 'Functional',
                    label: 'Functional Cookies',
                    description: 'These cookies allow us to give you extra functionalities on the website, such as social media sharing features. This enables us to personalise our content for you, and remember your preferences, for example, your choice of language or region. They may be set by us or by third party providers whose services we have added to our pages. If you do not allow these cookies, then some or all of these services may not function properly.',
                    cookieName: 'functional',
                    onAccept() {
                        setTimeout(() => {
                            window.dispatchEvent(new Event('cookiesUpdated'));
                        });
                    },
                    onRevoke() {
                        setTimeout(() => {
                            window.dispatchEvent(new Event('cookiesUpdated'));
                        });
                    },
                },
            ],
        };

        const civicScript = document.createElement('script');
        civicScript.src = 'https://cc.cdn.civiccomputing.com/9/cookieControl-9.5.min.js';
        civicScript.onload = () => {
            CookieControl.load(config);
            window.dispatchEvent(new Event('cookieManagerLoaded'));
        };

        document.body.append(civicScript);
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
