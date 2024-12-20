<template>
    <div class="vs-sticky-nav" :class="{ 'has-edit-button': page.isPreview() }">
        <VsBrSkipTo />
        <header>
            <VsGlobalMenu
             active-site=""
            />

            <BrManageMenuButton :menu="menuData" />

            <VsMeganav
                href="/"
                :menu-toggle-alt-text="configStore.getLabel('navigation.static', 'meganav-toggle-btn-alt-text')"
                search-button-text=""
                search-label-text=""
                search-clear-button-text=""
                search-close-button-text=""
                :logo-alt-text="configStore.getLabel('navigation.static', 'meganav.logo-alt-text')"
                :no-search="true"
                :is-static="true"
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

const configStore = useConfigStore();

if (page.value) {
    // Menu content can be retrieved from the models on the sdk core Menu component
    // like so
    // Multiple menus may exist depending on the site

    menu = component.value.getModels().menu;
    menuData = page.value.getContent(menu.$ref);
    menuItems = menuData.items;
}
</script>
