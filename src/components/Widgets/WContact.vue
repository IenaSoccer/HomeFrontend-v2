<template>
  <div class="py-16 flex flex-row flex-wrap justify-center items-center select-none">
    <div class="m-4 grid grid-cols-2 gap-4 grid-rows-2">
      <q-btn outline square href="tel:+393392176344" text-color="blue"
        class="md:w-[200px] z-10 md:h-[200px] bg-[#f3f4f6] rounded-none shadow-none text-center" icon="phone"
        size="70px" />
      <q-btn outline square href="https://goo.gl/maps/z7AhbyLRAB1RUdr97" text-color="orange"
        class="md:w-[200px] z-10 md:h-[200px] bg-[#f3f4f6] rounded-none shadow-none text-center" icon="location_on"
        size="70px" />
      <q-btn outline href="mailto:asdienasocceracademy@libero.it" square text-color="green"
        class="col-span-2 z-10 md:h-[200px] bg-[#f3f4f6] rounded-none shadow-none text-center" icon="email"
        size="70px" />
    </div>

    <q-card class="lg:w-[700px] md:w-[500px] w-full mx-2 md:mx-0 px-8 rounded-none border-none bg-[#f3f4f6]">
      <q-card-section>
        <div class="roboto-flex font-bold text-5xl text-center text-dark py-8">
          Contattaci
        </div>
        <div class="roboto-flex leading-tight text-xl font-light">
          Contattaci attraverso i canali di comunicazione presenti in questa
          pagina:
          <ul class="leading-tight py-4">
            <li class="font-bold text-blue-500">
              Numero di telefono (preferibile)
            </li>
            <li class="font-bold text-green-500">Email</li>
          </ul>
        </div>
      </q-card-section>
    </q-card>
  </div>
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "WContact",
  setup() {
  },
});
</script>
