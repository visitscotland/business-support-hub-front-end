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

        // The first module will always be light.
        if (x === 0) {
            modules[x].themeIndex = 0;
            modules[x].themeValue = themes[0];
            currentTheme.value = themes[0];
        // If the module is nested then use the previous module's theme.
        } else if (modules[x].nested) {
            modules[x].themeValue = currentTheme.value;
        } else {
            modules[x].themeValue = currentTheme.value === themes[0] ? themes[1] : themes[0];
            currentTheme.value = modules[x].theme;
        }

        if (modules[x].hippoBean && page) {
            hippoContent[x] = page.getContent(modules[x].hippoBean);
        }
    }
}
</script>
