<template>
    <div class="vs-sticky-nav" :class="{ 'has-edit-button': page && page.isPreview() }">
        <VsBrSkipTo />
        <header>
            <VsGlobalMenu />

            <BrManageMenuButton :menu="menuData" />

            <VsMeganav
                href="/"
                :menu-toggle-alt-text="configStore.getLabel('navigation.static', 'meganav-toggle-btn-alt-text')"
                :search-button-text="configStore.getLabel('search', 'search')"
                :search-label-text="configStore.getLabel('search', 'search-label')"
                :search-clear-button-text="configStore.getLabel('search', 'clear-form')"
                :search-close-button-text="configStore.getLabel('search', 'close-form')"
                :logo-alt-text="configStore.getLabel('navigation.static', 'meganav.logo-alt-text')"
                :no-search="false"
            >
                <template #mega-nav-top-menu-items>
                    <VsBrMegaNav
                        :links="menuItems"
                    />
                </template>

                <template #mega-nav-accordion-items>
                    <VsBrAccordionNav
                        :links="menuItems"
                    />
                </template>
            </VsMeganav>
        </header>
    </div>

    <VsBanner
        v-if="banner && banner.ctaLink"
        :close-btn-text="configStore.getLabel('essentials.global', 'close')"
        aria-labelledby="vs-menu-banner-copy"
    >
        <template v-slot:banner-text>
            <div
                id="vs-menu-banner-copy"
                v-html="banner.copy.value"
            />
        </template>

        <template v-slot:banner-cta>
            <vs-link
                :href="banner.ctaLink.link"
                :type="banner.ctaLink.type.toLowerCase()"
            >
                {{ banner.ctaLink.label }}
            </vs-link>
        </template>
    </VsBanner>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import { BrManageMenuButton } from '@bloomreach/vue3-sdk';

import useConfigStore from '~/stores/configStore';

import VsBrSkipTo from '~/components/Base/VsBrSkipTo.vue';

import {
    VsGlobalMenu,
    VsMeganav,
    VsBanner,
    VsLink,
} from '@visitscotland/component-library/components';

import VsBrMegaNav from '~/components/Modules/VsBrMegaNav.vue';
import VsBrAccordionNav from '~/components/Modules/VsBrAccordionNav.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

let menu = {
    $ref: '',
};
let menuData : any = {
};
let menuItems: any[] = [];
let banner : any = null;

const configStore = useConfigStore();

if (page.value) {
    // Menu content can be retrieved from the models on the sdk core Menu component
    // like so
    // Multiple menus may exist depending on the site

    menu = component.value.getModels().menu;
    menuData = page.value.getContent(menu.$ref);
    menuItems = menuData.items;
    banner = component.value.getModels().banner;

    if (banner && banner.ctaLink) {
        banner.ctaLink.link = banner.ctaLink.link.replace('/site/resourceapi', '');
    }
}

</script>
