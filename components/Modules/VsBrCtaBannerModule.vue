<template>
    <VsModuleWrapper>
        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    md="6"
                    class="d-flex justify-content-center"
                >
                    <VsBrImage
                        :image="imageValue"
                        style="max-width: 80%"
                    />

                </VsCol>
                <VsCol
                    cols="12"
                    md="6"
                    class="d-flex flex-column justify-content-center text-start"
                >
                    <VsHeading
                        level="2"
                        heading-style="heading-xl"
                        id="test"
                    >
                        {{ props.module.title }}
                    </VsHeading>    
                
                    <VsBrRichText :input-content="props.module.copy.value" />
                    <div>
                        <VsButton :href="props.module.cta.link">
                            {{ props.module.cta.label}}
                        </VsButton>
                    </div>
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';
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

const props = defineProps<{
    module: LooseObject,
}>();
const page: Page | undefined = inject('page');

const imageValue = computed(() => props.module.image.cmsImage);
console.log('imagevalue',imageValue)
</script>