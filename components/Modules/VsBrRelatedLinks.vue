<template>
    <VsModuleWrapper>
        <template #vs-module-wrapper-heading>
            Related links
        </template>
        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    md="3"
                    v-for="link in relatedLinksContent"
                >
                    <VsStretchedLinkCard
                        :link="link.url"
                        type="internal"
                        :img-src="link.imageSrc"
                        :img-alt="link.imageAlt"
                    >
                        <template #stretched-card-header>
                            {{ link.title }}
                        </template>

                        <template #stretched-card-content>
                            {{ link.teaser }}
                        </template>
                    </VsStretchedLinkCard>

                    
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
    <pre>{{ allContent }}</pre>
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';
import {
    VsCol,
    VsContainer,
    VsModuleWrapper,
    VsRow,
    VsStretchedLinkCard
} from '@visitscotland/component-library/components';

const props = defineProps<{
    relatedLinks: any[],
}>();

const allContent = ref<any[]>([]);

const page: Page | undefined = inject('page');

const relatedLinksContent = computed(() => {
    return props.relatedLinks.map((link) => {
        const content = page?.getContent(link.$ref);
        allContent.value.push(content);
        const title = content.model.data.title;
        const teaser = content.model.data.teaser;
        const url = content.model.links.site.href;
        const imageValue = page.getContent(content.model.data.image.$ref);
        const imageSrc = imageValue.getOriginal().getUrl();
        const imageAlt = imageValue.altText;

        return { title, teaser, url, imageSrc, imageAlt };

        // return {
        //     title: content.model.data.title,
        //     teaser: content.model.data.teaser,
        //     url: content.model.links.site.href,
        //     imageSrc: imageValue.getOriginal().getUrl(),
        //     imageAlt: imageValue.altText,
        // };
    });
});
</script>