<template>
  <div class="flex flex-col">
    Username
    <div class="">
      <select class="form-select form-select-sm appearance-none block w-full
      px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300 rounded transition ease-in-out m-0
    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      aria-label=".form-select-sm example">
        <option selected>Open this select menu</option>
        <option value="1">Profile</option>
        <option value="2">Invite</option>
        <option value="3">Block</option>
        <option value="4">Ban</option>
        <option value="5">Mute</option>
        <option value="6">Promote</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatChannelUsersList",
  props: {
    current_chan: Object,
  },
  data() {
    return {};
  },
  methods: {},
});
</script>



<style src="../../assets/tailwind.css" />