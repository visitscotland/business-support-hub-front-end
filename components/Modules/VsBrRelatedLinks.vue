<template>
    <VsModuleWrapper>
        <template #vs-module-wrapper-heading>
            {{ title }}
        </template>
        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    md="3"
                    v-for="link in links"
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
                            v-slot:stretched-card-badges
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
    </VsModuleWrapper>
</template>

<script setup lang="ts">
import {
    VsBadge,
    VsCol,
    VsContainer,
    VsModuleWrapper,
    VsRow,
    VsStretchedLinkCard
} from '@visitscotland/component-library/components';

const props = defineProps<{
    module: any,
}>();

const {
    title,
    links,
} = props.module;
</script>