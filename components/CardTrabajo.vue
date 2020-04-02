<template>
  <v-hover v-slot:default="{ hover }" open-delay="200">
    <v-card outlined :elevation="hover ? 1 : 0" class="my-4">
      <v-card-text>
        <v-layout :column="$vuetify.breakpoint.smAndDown">
          <v-flex xs12 md4 d-inline-flex>
            <v-img
              :src="`/images/jobs/${trabajo._id}.jpeg`"
              height="225"
              width="225"
              aspect-ratio="1"
            />
          </v-flex>
          <v-flex xs12 md8>
            <v-layout column pl-4 fill-height>
              <v-layout align-center mb-2>
                <v-flex xs12>
                  <v-layout
                    class="flex-row text-no-wrap"
                    align-center
                    fill-height
                  >
                    <p class="headline black--text text-truncate mb-0">
                      {{ trabajo.descripcion_breve }}
                    </p>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout align-center>
                <!-- <p class="mb-0">Profesiones:</p> -->
                <v-chip
                  v-for="(h, $i) in trabajo.servicios"
                  :key="$i"
                  outlined
                  class="mx-2"
                  v-text="h"
                />
              </v-layout>
              <v-layout column fill-height align-start>
                <p v-text="trabajo.descripcion" />
              </v-layout>
              <v-layout align-center>
                <v-flex> {{ fechText }} </v-flex>
                <v-flex v-if="!publish" xs12 md4>
                  <v-layout justify-end align-start>
                    <Rating :value="trabajo.puntuacion" star />
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import Rating from './Rating'
import dateFormat from '~/utils/dateFormat'

export default {
  components: { Rating },
  props: {
    trabajo: { type: Object, required: true },
  },
  computed: {
    publish() {
      return typeof this.trabajo.cliente === 'undefined'
    },
    fechText() {
      const text = this.publish ? 'Publicado ' : 'Realiazdo '
      return text + dateFormat(this.trabajo.createdAt, 'dd MM yyyy')
    },
  },
}
</script>
