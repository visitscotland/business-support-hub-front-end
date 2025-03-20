<template>
    <VsContainer>
        <VsRow>
            <VsCol
                cols="12"
                lg="8"
                offset-lg="2"
            >
                <VsBrImageWithCaption
                    :is-video="false"
                    :is-hero="false"
                    variant="fullwidth"
                    :image="image"
                    :toggleButtonText="configStore.getLabel('essentials.global', 'image.toggle.text')"
                />
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

import {
    VsContainer, VsRow, VsCol,
} from '@visitscotland/component-library/components';

import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';
import useConfigStore from '~/stores/configStore';
const configStore = useConfigStore();

const props = defineProps<{
    image?: any,
}>();

const { image } = toRefs(props);
</script>
