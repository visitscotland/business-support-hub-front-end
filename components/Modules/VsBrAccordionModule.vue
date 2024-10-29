<template>
    <pre>{{ module }}</pre>
    <VsModuleWrapper
        :anchor-id="props.module.anchor || null"
        :heading-level="isNested ? 3 : 2"
        businessSupport
    >
        <template #vs-module-wrapper-heading>
            {{ props.module.title }}
        </template>
        <VsContainer>
            <VsAccordion>
                <VsAccordionItem
                    v-for="(item, index) in props.module.sections"
                    :control-id="`${props.idPrefix}${index}`"
                    :heading-level="isNested ? 4 : 3"
                    variant="transparent"
                >
                    <template #title>
                        {{ item.heading }}
                    </template>

                    <div class="p-075">
                        <VsBrRichText :input-content="item.copy.value" />
                    </div>
                </VsAccordionItem>
            </VsAccordion>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script setup lang="ts">
import type { LooseObject } from '~/types/types';
import {
    VsAccordion,
    VsAccordionItem,
    VsContainer,
    VsModuleWrapper,
} from '@visitscotland/component-library/components';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

const props = defineProps<{
    module: LooseObject,
    idPrefix: string,
}>();

const isNested = computed(() => props.module.nested);
</script>
