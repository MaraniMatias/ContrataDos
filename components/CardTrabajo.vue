<template>
  <v-hover v-slot:default="{ hover }" open-delay="200">
    <v-card outlined :elevation="hover ? 1 : 0" class="my-4" @click="add()">
      <v-card-text>
        <v-layout :column="$vuetify.breakpoint.smAndDown">
          <v-flex xs12 md4 d-inline-flex>
            <v-img
              src="/avatars/molly.png"
              height="225"
              width="225"
              aspect-ratio="1"
            />
          </v-flex>
          <v-flex xs12 md8>
            <v-layout
              column
              :pt-2="$vuetify.breakpoint.smAndDown"
              :pl-4="$vuetify.breakpoint.mdAndUp"
            >
              <v-layout align-center fill-height mb-2>
                <v-flex xs12 md8>
                  <v-layout
                    class="flex-row text-no-wrap"
                    align-center
                    fill-height
                  >
                    <p class="headline black--text text-truncate mb-0">
                      Reparación de cañería.
                    </p>
                  </v-layout>
                </v-flex>
                <v-flex xs12 md4>
                  <v-layout justify-end align-start>
                    <Rating value="3.5" star />
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout column fill-height align-start>
                <p>
                  Material Design Component Framework Vuetify is a Vue UI
                  Library with beautifully handcrafted Material Components. No
                  design skills required — everything you need to create amazing
                  applications is at your fingertips.
                </p>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  computed: {},
}
</script>
