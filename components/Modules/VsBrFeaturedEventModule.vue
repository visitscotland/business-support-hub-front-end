// NB — this is an experimental module created to test interactions in a specific page of the BSH (/training-events). See BSHUB-830
// It should not be used anywhere else and the changes should be reverted on or before the date of the hardcoded event in the data below, and will be removed as soon as the UX experiment concludes.

<template>
    <section class="vs-rich-text-wrapper featured">
        <VsContainer>
            <div class="row">
                <div class="col-12">
                    <VsHeading
                        level="3"
                        heading-style="heading-xl"
                    >
                        Featured webinar
                    </VsHeading>
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
                                            <strong>Time:</strong> {{ featuredEvent.times }}
                                        </li>
                                        <li>
                                            <strong>Price:</strong> {{ featuredEvent.price }}
                                        </li>
                                        <li>
                                            <strong>Location: </strong>
                                            {{ featuredEvent.location }}
                                        </li>
                                    </VsCol>

                                    <VsCol
                                        cols="12"
                                        md="4"
                                    >
                                        <li>
                                            <strong>Organiser: </strong>
                                            {{ featuredEvent.organiser }}
                                        </li>
                                    </VsCol>
                                </VsRow>
                            </VsList>
                        </template>
                    </VsEventCard>
                </div>
            </div>
        </VsContainer>
    </section>
</template>

<script setup lang="ts">
import {
    VsContainer,
    VsHeading,
    VsRow,
    VsEventCard,
    VsList,
} from '@visitscotland/component-library/components';

import VsBrRichText from './VsBrRichText.vue';

const featuredEvent = {
    hippoBean: null,
    anchor: null,
    errorMessages: null,
    marketoId: null,
    title: 'From local to global: Elevating tourism businesses in Glasgow & The Clyde Valley',
    summary: '<p>Are you a tourism business in Glasgow & The Clyde Valley? Join this travel distribution workshop to explore routes to market, create bookable experiences, boost off-season yield, and connect with the travel trade. Includes peer exercises and practical tips to kickstart your journey. All business sizes welcome.</p>',
    dates: '11 September, 2025',
    times: '10:00 - 15:00',
    price: 'Free',
    location: 'St Mungo Museum of Religious Life and Art, 2 Castle St, Glasgow, G4 0RH',
    organiser: 'Visit Glasgow & VisitScotland',
    contact: null,
    registrationDeadline: null,
    cta: {
        label: 'Find out more',
        link: 'https://visitscotland.eventsair.com/2025-2026-business-development-programme/registration-webinars/Site/Register',
        type: 'EXTERNAL',
    },
    type: 'EventCard',
};
</script>

<style lang="scss">

.featured {
    .vs-event-card {
        border: 1px solid rgb(233,233,233);
    }
}
</style>
