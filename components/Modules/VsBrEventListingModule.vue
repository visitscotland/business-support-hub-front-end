<template>
    <VsTabs
        class="my-400 vs-events-listing"
        :id="moduleId"
        no-container
        data-event-listing="True"
    >
        <VsTabItem
            v-for="(eventList, index) in module.eventsListings"
            :key="index"
            :title="eventList.title"
        >
            <VsContainer class="mt-300">
                <VsRow>
                    <section class="vs-rich-text-wrapper featured">
                        <div class="container">
                            <div class="row">
                                <div class="col-12">
                                    <h2 class="vs-heading vs-heading--heading-xl">
                                        Featured webinar
                                    </h2>
                                    <VsEventCard
                                        :cta-label="featuredEvent.cta.label"
                                        :cta-href="featuredEvent.cta.link"
                                        :key="featuredEvent.title"
                                        :data-event-listing="True"
                                    >
                                        <template #event-card-header>
                                            {{ featuredEvent.title }}
                                        </template>

                                        <template #event-card-date>
                                            {{ featuredEvent.dates }}
                                        </template>

                                        <template #event-card-content>
                                            <VsBrRichText :input-content="featuredEvent.summary" />

                                            <VsList unstyled>
                                                <VsRow>
                                                    <VsCol
                                                        cols="2"
                                                        md="4"
                                                    >
                                                        <li>
                                                            <strong>Time: </strong>
                                                            {{ featuredEvent.times }}
                                                        </li>
                                                        <li>
                                                            <strong>Price:</strong> Free
                                                        </li>
                                                        <li>
                                                            <strong>Location:</strong> Online
                                                        </li>
                                                    </VsCol>

                                                    <VsCol
                                                        cols="12"
                                                        md="4"
                                                    >
                                                        <li>
                                                            <strong>Organiser: </strong>
                                                            VisitScotland
                                                        </li>
                                                    </VsCol>
                                                </VsRow>
                                            </VsList>
                                        </template>
                                    </VsEventCard>
                                </div>
                            </div>
                        </div>
                    </section>
                    <VsHeading level="3" heading-style="heading-m">
                        {{ eventList.title }}
                    </VsHeading>

                    <VsBrRichText :input-content="eventList.copy.value" />
                </VsRow>
                <VsBrEventListing :event-data="eventList" :module-id="moduleId" />
            </VsContainer>
        </VsTabItem>
    </VsTabs>

    <VsContainer>
        <VsRow>
            <VsWarning class="my-400">
                {{ configStore.getLabel('events-listings-module', 'no-js') }}
            </VsWarning>
        </VsRow>
    </VsContainer>
</template>

<script setup lang="ts">
/* eslint import/no-import-module-exports: 0 */

import { computed } from 'vue';
import {
    VsContainer,
    VsHeading,
    VsTabs,
    VsTabItem,
    VsRow,
    VsWarning,
    VsEventCard,
    VsList,
} from '@visitscotland/component-library/components';
import useConfigStore from '~/stores/configStore.ts';
import VsBrRichText from './VsBrRichText.vue';
import VsBrEventListing from './VsBrEventListing.vue';

const props = defineProps<{
    module: Object,
}>();

const configStore = useConfigStore();
const module: any = props.module;
const featuredEvent = {
    hippoBean: null,
    anchor: null,
    errorMessages: null,
    marketoId: null,
    title: 'VisitScotland bitesize webinars: importance of international markets',
    summary: '<p>International visitors are vital for your business as you broaden your reach and reduce your risk. Discover the volume and value that these international markets can bring, with practical tips on how to understand booking behaviours and reach these visitors.</p>',
    dates: '19 June, 2025',
    times: '14:00 - 14:30',
    price: 'Free',
    location: 'Online',
    organiser: 'VisitScotland',
    contact: null,
    registrationDeadline: null,
    cta: {
        label: 'Find out more',
        link: 'https://visitscotland.eventsair.com/2025-2026-business-development-programme/registration-webinars/Site/Register',
        type: 'EXTERNAL',
    },
    type: 'EventCard',
};

const moduleId = computed(() => module.anchor || 'events-listing-module');
</script>

<style lang="scss">
.featured {
    .vs-event-card {
        border: 1px solid rgb(233, 233, 233);
    }
}

.vs-tabs--no-container .tab-pane .vs-heading {
    display: block !important;

    &.vs-tab__item__heading {
        display: none !important;
    }
}

.vs-warning {
    display: none;
}

.no-js {
    .vs-events-listing {
        display: none;
    }

    .vs-warning {
        display: block;
    }
}
</style>
