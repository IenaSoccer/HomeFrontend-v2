<template>
  <div class="text-center mx-auto">
    <div class="text-4xl roboto-flex font-bold">Condividi</div>
    <div class="text-xl roboto-flex font-light py-2">
      Se vuoi condividere questo contenuto copia l'indirizzo
      <q-btn flat unelevated class="text-blue-700" @click="copyURL()">
        da qui
      </q-btn>
      oppure clicca sui pulsanti sotto.
    </div>
    <input type="text" class="p-2 text-center roboto-flex select-all w-full border-b-4 border-blue-700 font-light my-4"
      readonly ref="share" v-on:focus="$event.target ? ($event.target as HTMLInputElement).select() : null"
      :value="url" />
    <div class="flex flex-col justify-center items-center">
      <q-btn flat unelevated class="h-8 w-full p-0" target="_blank"
        :href="`https://www.facebook.com/sharer.php?u=${url}`">
        <div class="bg-blue-700 w-full h-full flex flex-row items-center justify-center">
          <q-icon tag="span" name="fab fa-facebook" color="white" size="sm"></q-icon>
        </div>
      </q-btn>
      <q-btn flat unelevated target="_blank" :href="`https://twitter.com/intent/tweet?text=${title}&url=${url}`"
        class="h-8 w-full p-0">
        <div class="bg-sky-300 w-full h-full flex flex-row items-center justify-center">
          <q-icon tag="span" name="fab fa-twitter" color="white" size="sm">

            <q-img src="/icons/twitter.svg" height="100%"></q-img>
          </q-icon>
        </div>
      </q-btn>
      <q-btn flat unelevated target="_blank"
        :href="`https://pinterest.com/pin/create/button/?url=${url}&description=${title}&media=${thumb}`"
        class="h-8 w-full p-0">
        <div class="bg-red-500 w-full h-full flex flex-row items-center justify-center">
          <q-icon tag="span" name="fab fa-pinterest" color="white" size="sm">
            <q-img src="/icons/pinterest.png" height="100%"></q-img>
          </q-icon>
        </div>
      </q-btn>
    </div>
  </div>
</template>
<style scoped>
.coolvetica {
  font-family: Coolvetica;
}

.roboto {
  font-family: Roboto;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "WShare",
  props: {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
  },
  methods: {
    copyURL() {
      const input = this.$refs.share as HTMLInputElement | null;
      if (input) {
        input.focus();
        document.execCommand("copy");
      }
    },
  },
  setup() { },
});
</script>
