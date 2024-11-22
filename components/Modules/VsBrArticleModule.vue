<template>
    <VsModuleWrapper business-support>
        <VsArticle
            :title="module.title"
            :anchor-link="module.anchor ? formatLink(module.anchor) : ''"
            businessSupport
            :heading-level="module.nested ? 3 : 2"
        >
            <template
                #vs-article-intro
                v-if="module.introduction"
            >
                <div v-html="module.introduction.value" />
            </template>

            <template
                v-if="module.image"
                #vs-article-img
            >
                <VsBrImageWithCaption
                    :image="module.image.cmsImage"
                />
            </template>

            <template
                v-if="module.video"
                #vs-article-img
            >
                <VsVideo
                    :video-title="module.video.label"
                    :video-id="module.video.youtubeId
                        ? module.video.youtubeId
                        : extractYoutubeId(module.video.url)
                    "
                    :locale="configStore.locale"
                    :single-minute-descriptor="configStore.getLabel('video', 'video.minute-text')"
                    :plural-minute-descriptor="configStore.getLabel('video', 'video.minutes-text')"
                    :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
                    :no-js-message="configStore.getLabel('video', 'video.no-js')"
                    :cookie-btn-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
                    :error-message="configStore.getLabel('essentials.global', 'third-party-error')"
                />
            </template>

            <VsArticleSection
                v-for="(section, index) in articleSections"
                :key="index"
                sidebar-align="right"
                businessSupport
            >
                <template
                    #article-sidebar
                     v-if="section.video || section.quote || section.image"
                >
                    <VsBrArticleSidebar
                        :section="section"
                        alignment="right"
                    />
                </template>

                <template v-if="section.copy">
                    <VsBrRichText :input-content="section.copy.value" />
                </template>
            </VsArticleSection>
        </VsArticle>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */

import {
    VsArticle,
    VsArticleSection,
    VsModuleWrapper,
    VsVideo,
} from '@visitscotland/component-library/components';

import formatLink from '~/composables/formatLink';

import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';
import VsBrArticleSidebar from '~/components/Modules/VsBrArticleSidebar.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import useConfigStore from '~/stores/configStore';
const configStore = useConfigStore();

const props = defineProps<{
    module: Object,
}>();
const module: any = props.module;

const articleSections: any[] = [];

let sidebarCount = -1;

for (let x = 0; x < module.sections.length; x++) {
    const nextSection = module.sections[x];
    let alignment = '';

    if (nextSection.quote || nextSection.image || nextSection.video) {
        sidebarCount += 1;

        if (sidebarCount % 2 !== 0) {
            alignment = 'left';
        } else {
            alignment = 'right';
        }
    } else {
        alignment = 'right';
    }

    nextSection.alignment = alignment;

    articleSections.push(nextSection);
}
</script>
