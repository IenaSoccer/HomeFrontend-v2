<template>
  <q-card class="w-full h-full m-8 border-none bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] shadow-lg rounded-xl card-hover">
    <q-card-section>
      <div class="roboto-flex font-bold text-5xl text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent py-8 title-slide-in select-none">Contattaci</div>
      <div class="roboto-flex leading-tight text-xl font-light text-gray-600 text-center subtitle-fade-in select-none">
        Contattaci attraverso i canali di comunicazione presenti in questa pagina.
      </div>
    </q-card-section>
    <q-separator class="separator-glow" />
    <q-card-section>
      <div class="flex flex-row items-center py-4 contact-item hover-lift">
        <q-icon name="email" size="2em" color="primary" class="icon-bounce" />
        <div class="roboto-flex text-lg font-light text-gray-700 ml-4">
          <a href="mailto:asdienasocceracademy@libero.it" class="link-hover">asdienasocceracademy@libero.it</a>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="flex flex-row items-center py-4 contact-item hover-lift">
        <q-icon name="phone" size="2em" color="primary" class="icon-bounce" />
        <div class="roboto-flex text-lg font-light text-gray-700 ml-4">
          <a href="tel:+393392176344" class="link-hover">+39 339 2176 344</a>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="flex flex-row items-center py-4 contact-item hover-lift">
        <q-icon name="place" size="2em" color="primary" class="icon-bounce" />
        <div class="roboto-flex text-lg font-light text-gray-700 ml-4">
          <a href="https://goo.gl/maps/z7AhbyLRAB1RUdr97" target="_blank" class="link-hover">https://goo.gl/maps/z7AhbyLRAB1RUdr97</a>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<style scoped>
.soccer-league {
  font-family: College;
}

.coolvetica {
  font-family: Coolvetica;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WContact',
  setup() { },
});
</script>
