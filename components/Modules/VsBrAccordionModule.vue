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
                v-for="(item, index) in props.module.sections"
                :control-id="`${props.idPrefix}${index}`"
                variant="transparent"
            >
                <template #title>
                    {{ item.heading }}
                </template>

                <div class="p-3">
                    <VsBrRichText :input-content="item.copy.value" />
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
} from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

const props = defineProps<{
    module: LooseObject,
    idPrefix: string,
}>();
</script>
