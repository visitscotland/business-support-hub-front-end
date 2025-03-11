<template>
    <VsModuleWrapper
        :class="nested ? 'pt-0': null"
        class="vs-cta-banner-module"
        :theme="themeValue"
    >
        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    md="6"
                    class="d-flex align-items-center justify-content-center"
                >
                    <VsBrImage
                        :image="imageValue"
                        style="max-width: 100%;max-height: 312px"
                    />
                </VsCol>
                <VsCol
                    cols="12"
                    md="6"
                    class="d-flex flex-column justify-content-center text-start"
                >
                    <VsHeading
                        :level="nested ? '3' : '2'"
                        heading-style="heading-xl"
                        :id="anchor"
                    >
                        {{ title }}
                    </VsHeading>    
                
                    <VsBrRichText :input-content="copy.value" />
                    <div>
                        <VsButton :href="formatLink(cta.link)">
                            {{ cta.label }}
                        </VsButton>
                    </div>
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script setup lang="ts">
import type { LooseObject } from '~/types/types';
import {
    VsButton,
    VsCol,
    VsContainer,
    VsHeading,
    VsModuleWrapper,
    VsRow,
} from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrImage from '~/components//Utils/VsBrImage.vue';

import formatLink from '~/composables/formatLink';

const props = defineProps<{
    module: LooseObject,
}>();

const {
    anchor,
    copy,
    cta,
    image,
    themeValue,
    nested,
    title,
} = props.module;

const imageValue = computed(() => image.cmsImage);
</script>

<style lang="scss">
.vs-cta-banner-module {
    .vs-heading {
        margin-top: -0.5rem;
    }
}
</style>
