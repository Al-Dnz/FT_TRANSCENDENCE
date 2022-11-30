<template>
  <div class="flex flex-row">
    <Bars3Icon  class="h-6 w-6 rounded-full bg-gray-200" @click="toggleMenu" />
    <div><ul v-if="showOptions" class="form-select form-select-sm appearance-none block w-20 absolute
        px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat
        border border-solid border-gray-300 rounded transition ease-in-out m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-sm example">
      <li class="hover:font-semibold">Profile</li>
      <li class="hover:font-semibold">Invite</li>
      <li class="hover:font-semibold">Block</li>
      <li class="hover:font-semibold">Promote</li>
    </ul></div>
  </div>
</template>

<script lang="ts">
import { Bars3Icon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

export default defineComponent({
    name: "TestMenu",
    data() {
        return {
            showOptions: false,
        };
    },
    methods: {
        toggleMenu() {
            this.showOptions = !this.showOptions;
        }
    },
});
</script>



<style src="../../assets/tailwind.css" />
