<template>
    <!-- TODO - error-message, itinerary, themes -->
    <VsMegalinks
        :title="module.title"
        variant="link-list"
        :theme="theme"
        :cookie-link-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
        :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
        :no-js-message="configStore.getLabel('video', 'video.no-js')"
        :button-link="module.cta ? formatLink(module.cta.link) : undefined"
        :sectionId="module.anchor"
        :heading-level="module.nested ? 3 : 2"
        :heading-style="module.nested ? 'heading-m' : 'heading-xl'"
    >
        <template
            v-if="module.introduction"
            #vs-megalinks-intro
        >
            <VsBrRichText :input-content="module.introduction.value" />
        </template>

        <VsRow>
            <VsCol
                v-for="(link, index) in links"
                :key="index"
                cols="12"
                md="6"
            >
                <VsMegalinkLinkList
                    :img-src="link.image ? link.image : ''"
                    :theme="theme"
                    :link-type="link.type"
                    :link-url="link.url"
                    :error-message="link['error-message']"
                    :video-id="link.type === 'video'
                        ? extractYoutubeId(link.url)
                        : ''
                    "
                    :video-btn-text="configStore.getLabel('video', 'video.play-btn')"
                    business-support
                    :is-home-page="isHomePage"
                >
                    <template #vs-link-list-heading>
                        {{ link.label }}
                    </template>

                    <template
                        #vs-link-list-content
                        v-if="module.teaserVisible"
                    >
                        <p>{{ link.teaser }}</p>
                    </template>

                    <template
                        #vs-link-list-badges
                    >
                        <VsBadge 
                            v-for="(badge, badgeIndex) in link.badges"
                            :key="badgeIndex"
                        >
                            {{ badge }}
                        </VsBadge>
                    </template>
                    
                </VsMegalinkLinkList>

                <VsBrVideoModal
                    v-if="link.type === 'video'"
                    :is-video-modal="true"
                    :close-btn-text="configStore.getLabel('essentials.global', 'close')"
                    :modal-id="link.type === 'video'
                        ? extractYoutubeId(link.url)
                        : ''
                    "
                    :video="link"
                />
            </VsCol>
        </VsRow>
        <template #vs-megalinks-button>
            {{ module.cta.label }}
        </template>
    </VsMegalinks>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */
import { inject } from 'vue';

import { type Page } from '@bloomreach/spa-sdk';

import {
    VsMegalinks,
    VsMegalinkLinkList,
    VsRow,
    VsCol,
    VsBadge,
} from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore';

import formatLink from '~/composables/formatLink';

const configStore = useConfigStore();

const props = defineProps<{ module: Object, theme: string }>();
const module: any = props.module;
const theme: string = props.theme;

const page: Page | undefined = inject('page');
const route = useRoute();
const links: any[] = [];

const isHomePage = computed(() => route.path === '/');

if (page && module.links) {
    for (let x = 0; x < module.links.length; x++) {
        const nextLink = module.links[x];

        const image: any = nextLink.image.cmsImage
            ? page.getContent(nextLink.image.cmsImage.$ref)
            : page.getContent(nextLink.image.externalImage.$ref);

        let badgesArray: Array<string> = [];

        if(nextLink.type === "EXTERNAL") {
            badgesArray.push('External website');
        }

        if(nextLink.type === "DOWNLOAD") {
            badgesArray.push('Download');
        }

        if(nextLink.contentType) {
            badgesArray.push(nextLink.contentType);
        }

        if(nextLink.readTime) {
            badgesArray.push(nextLink.readTime)
        }

        links.push({
            image: image?.getOriginal().getUrl(),
            type: nextLink.type.toLowerCase(),
            url: formatLink(nextLink.link),
            'error-message': '',
            label: nextLink.label,
            teaser: nextLink.teaser,
            badges: badgesArray,
        });
    }
}
</script>

<style>
    div.link-list-module {
        span {
            display: block;
        }
    }
    
</style>
