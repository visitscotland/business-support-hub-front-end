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
            <NuxtLazyHydrate
                :when-visible="{ rootMargin: '50px' }"
            >
                <VsBrMegalinksLinkListModule
                    v-if="hippoContent[index].model.data.layout === 'List'"
                    :module="item"
                    :theme="item.themeValue"
                />
            </NuxtLazyHydrate>

            <NuxtLazyHydrate
                :when-visible="{ rootMargin: '50px' }"
            >
                <VsBrHorizontalLinksModule
                    v-if="hippoContent[index].model.data.layout === 'Horizontal Links'"
                    :module="item"
                    :theme="item.themeValue"
                />
            </NuxtLazyHydrate>
        </template>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'ArticleModule' && item.layout === 'standard'"
        >
            <VsBrArticleModule
                :module="item"
            />
        </NuxtLazyHydrate>
        
        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'ArticleModule' && item.layout === 'accordion'"
        >
            <VsBrAccordionModule
                :id-prefix="`accordionItem-${index}-`"
                :module="item"
            />
        </NuxtLazyHydrate>
        
        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'ArticleModule' && styledListLayouts.includes(item.layout)"
        >
            <VsBrStyledListModule
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'SignpostModule'"
        >
            <VsBrCtaBannerModule 
                :module="item"
            />
        </NuxtLazyHydrate>
        
        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'FormModule'"
        >
            <VsBrForm
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            v-if="item.type === 'SingleImageLinksModule'"
            :when-visible="{ rootMargin: '50px' }"
        >
            <VsBrMegalinksSingleImageModule
                :module="item"
                :theme="item.themeValue"
            />
        </NuxtLazyHydrate>

        <div
            v-else-if="item.type === 'ErrorModule'"
        >
            <NuxtLazyHydrate
                :when-visible="{ rootMargin: '50px' }"
            >
                <VsBrPreviewError
                    v-if="page && page.isPreview()"
                    :messages="item.errorMessages"
                />
            </NuxtLazyHydrate>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';
import { BrManageContentButton } from '@bloomreach/vue3-sdk';

import VsBrMegalinksLinkListModule from '~/components/Modules/VsBrMegalinksLinkListModule.vue'
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrArticleModule from '~/components/Modules/VsBrArticleModule.vue';
import VsBrAccordionModule from '~/components/Modules/VsBrAccordionModule.vue';
import VsBrStyledListModule from '~/components/Modules/VsBrStyledListModule.vue';
import VsBrForm from '~/components/Modules/VsBrForm.vue';
import VsBrPreviewError from '~/components/Modules/VsBrPreviewError.vue';
import VsBrMegalinksSingleImageModule from './VsBrMegalinksSingleImageModule.vue';
import VsBrCtaBannerModule from '~/components/Modules/VsBrCtaBannerModule.vue';

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
