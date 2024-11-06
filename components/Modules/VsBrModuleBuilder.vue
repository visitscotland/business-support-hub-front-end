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
                <VsBrListLinksModule
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

import VsBrListLinksModule from '~/components/Modules/VsBrListLinksModule.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrArticleModule from '~/components/Modules/VsBrArticleModule.vue';
import VsBrAccordionModule from '~/components/Modules/VsBrAccordionModule.vue';
import VsBrStyledListModule from '~/components/Modules/VsBrStyledListModule.vue';
// import VsBrForm from '~/components/Modules/VsBrForm.vue';
import VsBrPreviewError from '~/components/Modules/VsBrPreviewError.vue';

const props = defineProps<{
    modules: any[],
}>();

const { modules } = props;

const page: Page | undefined = inject('page');

const hippoContent : any = {
};

// Article layouts that use the Styled list module.
const styledListLayouts = ['bullet-list', 'horizontal-list', 'numbered-list', 'visual-list'];

// Set module theme
// The first module should always be light (white) and the 
// remaining modules will alternate between grey and light.
// Unless the module is nested, in which case it will use the 
// same theme as the previous module.
const themes = ['light', 'grey'];
const currentTheme = ref(themes[0]);

if (modules) {
    for (let i = 0; i < modules.length; i++) {
        if (i === 0) {
            modules[i].theme = themes[0];
            currentTheme.value = themes[0];
        } else if (modules[i].nested) {
            modules[i].theme = currentTheme.value;
        } else {
            modules[i].theme = currentTheme.value === themes[0] ? themes[1] : themes[0];
            currentTheme.value = modules[i].theme;
        }
    }
}
</script>
