<template>
    <VsContainer>
        <VsRow>
            <VsCol>
                <VsHeading
                    :id="props.module.anchor ? props.module.anchor : null"
                    level="2"
                >
                    {{ props.module.title }}
                </VsHeading>
            </VsCol>
        </VsRow>
        <VsAccordion>
            <VsAccordionItem
                v-for="(item, index) in accordionItems"
                :control-id="`accordionItem${index}`"
                variant="transparent"
            >
                <template #title>
                    {{ item.title }}
                </template>

                <div class="p-3">
                    <VsBrRichText :input-content="item.content" />

                    <VsBrImageWithCaption
                        v-if="item.image"
                        :image="item.image.cmsImage"
                    />
                    <VsVideo
                        v-if="item.video"
                        :video-title="item.video.label"
                        :video-id="item.video.youtubeId
                            ? item.video.youtubeId
                            : extractYoutubeId(item.video.url)
                        "
                        :locale="configStore.locale"
                        :single-minute-descriptor="configStore.getLabel('video', 'video.minute-text')"
                        :plural-minute-descriptor="configStore.getLabel('video', 'video.minutes-text')"
                        :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
                        :no-js-message="configStore.getLabel('video', 'video.no-js')"
                        :cookie-btn-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
                        :error-message="configStore.getLabel('essentials.global', 'third-party-error')"
                    />
                </div>
            </VsAccordionItem>
        </VsAccordion>
    </VsContainer>
</template>

<script setup lang="ts">
import type { LooseObject } from '~/types/types';
import {
    VsAccordion,
    VsAccordionItem,
    VsCol,
    VsContainer,
    VsHeading,
    VsRow,
    VsVideo,
} from '@visitscotland/component-library/components';
import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import separateTitleFromContent from '~/composables/separateTitleFromContent';
import useConfigStore from '~/stores/configStore';
const configStore = useConfigStore();

const props = defineProps<{
    module: LooseObject,
}>();

// Set the accordionItem content by extracting the data from the sections.
const accordionItems = computed(() => {
    return props.module.sections.map(({ copy, image, video, }: { copy: LooseObject, image: LooseObject, video: LooseObject }) => {
        const { title, content } = separateTitleFromContent(copy.value)
        return {
            title,
            content,
            image,
            video,
        };
    });
});
</script>