<template>
    <section class="vs-module-wrapper vs-module-wrapper--light text-start">
        <VsBrSectionHeader :heading="title" />
        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    md="3"
                    v-for="(link, index) in links"
                    :key="index"
                >
                    <VsStretchedLinkCard
                        :link="formatLink(link.link)"
                        :type="link.type.toLowerCase()"
                        class="text-start"
                    >
                        <template #stretched-card-header>
                            {{ link.label }}
                        </template>

                        <template #stretched-card-content>
                            {{ link.teaser }}
                        </template>

                        <template
                            v-if="link.readTime || link.contentType"
                            #stretched-card-badges
                        >
                            <VsBadge v-if="link.contentType">
                                {{ link.contentType }}
                            </VsBadge>

                            <VsBadge v-if="link.readTime">
                                {{ link.readTime }}
                            </VsBadge>
                        </template>
                    </VsStretchedLinkCard>
                </VsCol>
            </VsRow>
        </VsContainer>
    </section>
</template>

<script setup lang="ts">
import {
    VsBadge,
    VsCol,
    VsContainer,
    VsRow,
    VsStretchedLinkCard,
} from '@visitscotland/component-library/components';
import VsBrSectionHeader from '~/components/Modules/VsBrSectionHeader.vue';

const props = defineProps<{
    module: any,
}>();

const {
    title,
    links,
} = props.module;
</script>
