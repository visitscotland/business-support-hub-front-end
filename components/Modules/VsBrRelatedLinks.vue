<template>
    <VsModuleWrapper>
        <template #vs-module-wrapper-heading>
            <!-- TODO: Replace hardcoded title with CMS label -->
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
                        :type="link.linkType"
                        class="text-start"
                    >
                        <template #stretched-card-header>
                            {{ link.title }}
                        </template>

                        <template #stretched-card-content>
                            {{ link.teaser }}
                        </template>

                        <template
                            v-if="link.readTime || link.contentType"
                            v-slot:stretched-card-badges
                        >
                            <VsBadge v-if="link.readTime">
                                {{ link.readTime }}
                            </VsBadge>

                            <VsBadge v-if="link.contentType">
                                {{ link.contentType }}
                            </VsBadge>
                        </template>
                    </VsStretchedLinkCard>
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
    <!-- TODO: Remove before PR -->
    <pre>{{ allContent }}</pre>
    <!-- TODO: Remove before PR -->
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';
import {
    VsBadge,
    VsCol,
    VsContainer,
    VsModuleWrapper,
    VsRow,
    VsStretchedLinkCard
} from '@visitscotland/component-library/components';

const props = defineProps<{
    relatedLinks: any[],
}>();
const page: Page | undefined = inject('page');

// Temporary to see all available related link content.
const allContent = ref<any[]>([]);

const relatedLinksContent = computed(() => {
    return props.relatedLinks.map((link) => {
        const content = page?.getContent(link.$ref);
        const contentModel = content?.model;

        allContent.value.push(content);

        // Set the link type (internal/external/download).
        // Set the content type and url depending on the link type.
        let contentType,
        linkType,
        url;

        if (contentModel.data.linkType && contentModel.data.linkType.contentType === 'visitscotland:FileLink') {
            linkType = 'download';
            url = contentModel.data.linkType.link;
        } else if (contentModel.data.linkType && contentModel.data.linkType.contentType === 'visitscotland:ExternalLink') {
            contentType = 'Partner website';
            linkType = 'external';
            url = contentModel.data.linkType.link;
        } else {
            contentType = captialiseFirstCharacter(contentModel.data.type);
            linkType = 'internal';
            url = contentModel.links.site.href;
        }

        return {
            contentType,
            linkType,
            readTime: displayReadTime(contentModel.data.readingTime),
            teaser: contentModel.data.teaser,
            title: contentModel.data.title,
            url,
        };
    });
});

const captialiseFirstCharacter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();
};

const displayReadTime = (time: number) => {
    if (!time || time === 0) return null;

    // TODO: replace hardcoded text with CMS labels.
    const unit = (time > 1) ? 'minutes' : 'minute';

    // TODO: replace hardcoded text with CMS labels.
    return `Reading time: ${time} ${unit}`;
};
</script>