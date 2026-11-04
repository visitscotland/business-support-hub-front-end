<template>
    <section class="vs-module-wrapper vs-module-wrapper--light text-start">
        <VsBrSectionHeader :heading="props.module.title" />

        <VsContainer>
            <VsRow>
                <VsCol
                    v-for="(link, index) in props.module.links"
                    :key="index"
                    cols="12"
                    md="3"
                >
                    <VsCard
                        accent-bar
                        card-style="elevated"
                        class="py-125"
                    >
                        <template
                            v-if="link.contentType"
                            #vs-card-header
                        >
                            <VsBadge variant="subtle">
                                <div class="px-125">
                                    {{ link.contentType }}
                                </div>
                            </VsBadge>
                        </template>

                        <template #vs-card-body>
                            <div class="px-125">
                                <VsHeading
                                    heading-style="heading-xs"
                                    level="3"
                                >
                                    <VsLink
                                        class="stretched-link"
                                        :href="formatLink(link.link)"
                                        icon-size="xs"
                                        type="internal"
                                        variant="secondary"
                                    >
                                        {{ link.label }}   
                                    </VsLink>
                                </VsHeading>

                                <VsBody>
                                    {{ link.teaser }}
                                </VsBody>
                            </div>
                        </template>

                        <template
                            v-if="link.readTime"
                            #vs-card-footer
                        >
                            <div class="px-125">
                                <VsDetail
                                    color="secondary"
                                    icon="fa-regular fa-clock"
                                    icon-variant="highlight"
                                    size="small"
                                >
                                    {{ link.readTime }}
                                </VsDetail>
                            </div>
                        </template>
                    </VsCard>
                </VsCol>
            </VsRow>
        </VsContainer>
    </section>
</template>

<script setup lang="ts">
import {
    VsBadge,
    VsBody,
    VsCard,
    VsCol,
    VsContainer,
    VsDetail,
    VsHeading,
    VsLink,
    VsRow,
} from '@visitscotland/component-library/components';
import VsBrSectionHeader from '~/components/Modules/VsBrSectionHeader.vue';

const props = defineProps<{
    module: {
        title: string;
        links: {
            contentType: string;
            label: string;
            link: string;
            readTime: string;
            teaser: string;
            // Don't need to type the rest of the links properties.
            [key: string]: unknown;
        }[];
        // Don't need to type the rest of the module properties.
        [key: string]: unknown;
    },
}>();
</script>
