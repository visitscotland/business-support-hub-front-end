<template>
    <div
        class="vs-module-wrapper__outer"
        v-for="(item, index) in modules"
        :key="index"
        :id="`section-${index}`"
        :class="{ 'has-edit-button': page && page.isPreview() }"
    >
        <BrManageContentButton
            v-if="item.hippoBean && page"
            :content="hippoContent[index]"
        />

        <template
            v-if="item.type === 'ListLinksModule'"
        >
            <VsBrMegalinksLinkListModule
                v-if="hippoContent[index].model.data.layout === 'List'"
                :module="item"
                :theme="item.themeValue"
            />

            <VsBrHorizontalLinksModule
                v-if="hippoContent[index].model.data.layout === 'Horizontal Links'"
                :module="item"
                :theme="item.themeValue"
            />
        </template>

        <VsBrArticleModule
            v-else-if="item.type === 'ArticleModule' && item.layout === 'standard'"
            :module="item"
        />

        <VsBrAccordionModule
            v-else-if="item.type === 'ArticleModule' && item.layout === 'accordion'"
            :id-prefix="`accordionItem-${index}-`"
            :module="item"
        />

        <VsBrStyledListModule
            v-else-if="item.type === 'ArticleModule' && styledListLayouts.includes(item.layout)"
            :module="item"
        />

        <VsBrCtaBannerModule
            v-else-if="item.type === 'SignpostModule'"
            :module="item"
        />

        <VsBrForm
            v-else-if="item.type === 'FormModule'"
            :module="item"
        />

        <VsBrMegalinksSingleImageModule
            v-if="item.type === 'SingleImageLinksModule'"
            :module="item"
            :theme="item.themeValue"
        />

        <VsBrMegalinksMultiImageModule
            v-if="item.type === 'MultiImageLinksModule'"
            :module="item"
            :theme="item.themeValue"
        />

        <VsBrDevModule
            v-if="item.type === 'SimpleDevModule'"
            :module="hippoContent[index].model.data"
            :theme="item.themeValue"
        />

        <VsBrEventListingModule
            v-if="item.type === 'EventsLingsModule'"
            :module="item"
        />

        <div
            v-else-if="item.type === 'ErrorModule'"
        >
            <VsBrPreviewError
                v-if="page && page.isPreview()"
                :messages="item.errorMessages"
            />
        </div>
        <VsBrComparator
            v-if="item.type === 'ComparatorModule'"
            :features="item.features"
            :providers="item.providers"
        />
    </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';
import { BrManageContentButton } from '@bloomreach/vue3-sdk';

import VsBrMegalinksLinkListModule from '~/components/Modules/VsBrMegalinksLinkListModule.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrArticleModule from '~/components/Modules/VsBrArticleModule.vue';
import VsBrAccordionModule from '~/components/Modules/VsBrAccordionModule.vue';
import VsBrStyledListModule from '~/components/Modules/VsBrStyledListModule.vue';
import VsBrForm from '~/components/Modules/VsBrForm.vue';
import VsBrPreviewError from '~/components/Modules/VsBrPreviewError.vue';
import VsBrCtaBannerModule from '~/components/Modules/VsBrCtaBannerModule.vue';
import VsBrComparator from '~/components/Modules/VsBrComparator.vue';
import VsBrMegalinksSingleImageModule from './VsBrMegalinksSingleImageModule.vue';
import VsBrMegalinksMultiImageModule from './VsBrMegalinksMultiImageModule.vue';
import VsBrEventListingModule from './VsBrEventListingModule.vue';

const props = defineProps<{
    modules: any[],
}>();

const { modules } = props;

const page: Page | undefined = inject('page');

const hippoContent : any = {
};

// Article layouts that use the Styled list module.
const styledListLayouts = ['bullet-list', 'horizontal-list', 'numbered-list', 'visual-list'];

const themes = ['light', 'grey'];
const currentTheme = ref(themes[0]);

let singleImageAlternate = false;

// Set the background colour (theme) for each module.
if (modules) {
    for (let x = 0; x < modules.length; x++) {
        // Set the default theme value to the opposite of the previous value.
        let themeValue = currentTheme.value === themes[0] ? themes[1] : themes[0];

        // Set the first module to be light.
        if (x === 0) {
            themeValue = themes[0];
        // If the module is nested then use the previous module's theme.
        } else if (modules[x].nested) {
            themeValue = currentTheme.value;
        }

        if (modules[x].type === 'SingleImageLinksModule') {
            modules[x].alternate = singleImageAlternate;
            singleImageAlternate = !singleImageAlternate;
        }

        // Add the theme properties to the module object.
        modules[x].themeValue = themeValue;
        modules[x].themeIndex = themeValue === themes[0] ? 0 : 1;

        // Update the current theme.
        currentTheme.value = themeValue;

        if (modules[x].hippoBean && page) {
            hippoContent[x] = page.getContent(modules[x].hippoBean);
        }
    }
}
</script>

<style lang="scss">
    .vs-module-wrapper {
        padding-top: 3rem !important;
        padding-bottom: 3.5rem !important;
    }
</style>
