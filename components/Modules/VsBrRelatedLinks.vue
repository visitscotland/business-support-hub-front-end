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
                    >
                        <template #stretched-card-header>
                            {{ link.title }}
                        </template>

                        <template #stretched-card-content>
                            {{ link.teaser }}
                        </template>

                        <template
                            v-if="link.readTime || link.type"
                            v-slot:stretched-card-badges
                        >
                            <div class="text-start">
                                <VsBadge v-if="link.readTime">
                                    {{ link.readTime }}
                                </VsBadge>

                                <VsBadge v-if="link.type">
                                    {{ link.type }}
                                </VsBadge>
                            </div>
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

        return {
            readTime: displayReadTime(contentModel.data.readingTime),
            teaser: contentModel.data.teaser,
            title: contentModel.data.title,
            type: captialiseFirstCharacter(contentModel.data.type),
            url: contentModel.links.site.href,
        };
    });
});

const captialiseFirstCharacter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();
};

const displayReadTime = (time: number) => {
    if (time === 0) return;

    // TODO: replace hardcoded text with CMS labels.
    const unit = (time > 1) ? 'minutes' : 'minute';

    return `Reading time: ${time} ${unit}`;
};
</script>