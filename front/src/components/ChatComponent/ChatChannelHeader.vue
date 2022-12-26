<template>
  <div class="h-full w-full flex flex-col pt-2 pl-4 pr-4">
    <div class="h-16 w-16">
      <img :src="getImgUrl('Hashtag.png')" class="rounded-full" />
    </div>
    <h1 class="text-3xl font-bold">{{ currentChan?.name }}</h1>
    <p class="mt-3">This is the start of the #{{ currentChan?.name }} channel.</p>
    <div v-if="!currentChan?.unremovable" class="w-full flex mt-2 mb-2">
      <button @click="quitChannel()"
      class="pl-1 pr-1 rounded-lg border-2 border-slate-600 hover:text-red-500
      hover:border-red-500">Quit channel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatChannelHeader",
  props: {
    socket: Object,
    currentChan: Object
  },
  data() {
    return {};
  },
  methods: {
    getImgUrl(img: string) {
      return require('@/assets/' + img);
    },
    quitChannel() {
		console.log(`QUIT CHANNEL ${this.currentChan?.id} `);
		this.socket?.emit('quitChannel', {id: this.currentChan?.id});
    //   alert('current_user is quitting this channel'); // here we need to remove currentUser from currentChan and set currentChan either as '' or 'main_chan'
    },
  },
});
</script>



<style src="../../assets/tailwind.css" />
