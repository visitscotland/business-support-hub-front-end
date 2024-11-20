<template>
    <VsContainer>
        <VsRow>
            <VsCol>
                <VsLinkList :toc="toc">
                    <template
                        v-if="heading"
                        v-slot:heading
                    >
                        {{ heading }}
                    </template>

                    <VsLinkListItem
                        v-for="link in links"
                        :key="link.anchor"
                        :href="toc ? `#${link.anchor}` : link.anchor"
                    >
                        {{ link.title }}
                    </VsLinkListItem>
                </VsLinkList>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script setup lang="ts">
import { VsContainer, VsRow, VsCol } from '@visitscotland/component-library/components';
import { VsLinkList, VsLinkListItem } from '@visitscotland/component-library/components';

defineProps<{
    heading?: string,
    links: any[],
    toc?: boolean,
}>();
</script>