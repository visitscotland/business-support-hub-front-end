<template>
    <VsPageIntro
        :background="lightBackground ? themeCalculator(1) : themeCalculator(0)"
        :hero-intro="heroImage ? true : false"
        :is-itinerary="itinerary ? true : false"
        :has-toc="tableOfContentsLinks ? true : false"
    >
        <template
            #vs-intro-hero
            v-if="heroImage"
        >
            <template
                v-if="heroVideo"
            >
                <VsBrVideoModal
                    :is-video-modal="true"
                    :close-btn-text="configStore.getLabel('essentials.global', 'close')"
                    :modal-id="youtubeId"
                    :video="heroVideo"
                />

                <VsBrImageWithCaption
                    :is-video="true"
                    :is-hero="true"
                    :use-lazy-loading="false"
                    variant="large"
                    :image="heroImage"
                    :video-id="youtubeId"
                    :video-title="heroVideo.displayName"
                    :video-btn="heroVideo.cta"
                />
            </template>
            <template
                v-else
            >
                <VsBrImageWithCaption
                    :is-video="false"
                    :is-hero="true"
                    :use-lazy-loading="false"
                    variant="large"
                    :image="heroImage"
                />
            </template>
        </template>

        <!-- TODO
            Social schema
        -->

        <template #vs-intro-breadcrumb>
            <VsBrBreadcrumb
                :breadcrumb="breadcrumb"
                :is-home="isHome"
            />
        </template>

        <template
            v-if="content.theme === 'standard' || content.theme === 'simple'"
            #vs-intro-heading
        >
            {{ content.title }}
        </template>

        <template
            #vs-article-data
        >
            <VsArticleDetails
                v-if="content.readingTime !== 0"
                :article-publish-date="lastPublished"
                :article-read-time="readTime"
            />
            <div v-else class="mb-150">
                <span class="vs-article-details vs-article-details__date vs-article-details--highlight">
                    {{ lastPublished }}
                </span>
            </div>
        </template>

        <!-- TODO - Share Button -->

        <template
            #vs-intro-content
        >
            <VsBrRichText :input-content="content.introduction.value" />
        </template>

        <!-- TODO - Itinerary Summary -->

        <template
            #vs-intro-table-of-contents
            v-if="tableOfContentsLinks"
        >
            <VsBrLinkListModule
                :heading="configStore.getLabel('table-contents', 'title')"
                :links="tableOfContentsLinks"
                toc
            />
        </template>
    </VsPageIntro>
</template>

<script lang="ts" setup>
import {
    inject, ref, toRefs,
} from 'vue';
import type { TableOfContentLink } from '~/types/types';
import { VsPageIntro, VsArticleDetails } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import themeCalculator from '~/composables/themeCalculator.ts';
import extractYoutubeId from '~/composables/extractYoutubeId.ts';

import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';
import VsBrBreadcrumb from '~/components/Modules/VsBrBreadcrumb.vue';
import VsBrVideoModal from '~/components/Modules/VsBrVideoModal.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrLinkListModule from './VsBrLinkListModule.vue';

const configStore = useConfigStore();

const page: any = inject('page');

const props = defineProps<{
    content: any,
    lightBackground: boolean,
    tableOfContentsLinks?: TableOfContentLink[] | undefined,
    heroImage?: any,
    itinerary?: any,
    blog?: any,
}>();

const {
    content,
    lightBackground,
    heroImage,
    itinerary,
} = toRefs(props);

const breadcrumb = ref<any[]>([]);
const isHome = ref(false);
const readTime = ref<string | null>(null);
const publishDate = ref('');
const lastPublished = ref('');
const heroVideo = ref<any>(undefined);
const youtubeId = ref('');

if (page) {
    const pageContent : any = page.getContent(page.model.root);
    const pageModels : any = pageContent.models;

    if (pageModels) {
        isHome.value = pageModels.isHome;
        breadcrumb.value = pageModels.breadcrumb.items;

        // TODO - localised labels for minute/s and reading time:
        readTime.value = `${content.value.readingTime} minute read`;

        if (content.value.publishDate) {
            publishDate.value = new Date(content.value.publishDate).toLocaleString(
                'en-GB',
                {
                    year: 'numeric',
                    day: 'numeric',
                    month: 'long',
                },
            );
            lastPublished.value = `${configStore.getLabel('essentials.global', 'last-update')} ${publishDate.value}`;
        }

        if (content.value.heroVideo) {
            const video = page.getContent(content.value.heroVideo.videoLink);
            if (video) {
                heroVideo.value = video.model.data;

                youtubeId.value = extractYoutubeId(heroVideo.value.url);
            }
        }
    }
}
</script>

<style lang="scss">
    .vs-page-intro__wrapper {

        >.container {
            padding-bottom: 0;
        }
    }
</style>
