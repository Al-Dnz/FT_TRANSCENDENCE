<template>
  <div v-if="!creatingChan" class="h-full w-full pl-2 pr-2 divide-y-2">
    <div>
      <h1 class="mt-3 font-bold">DIRECT MESSAGES</h1>
      <div class="h-12 w-full mt-3">
        <div class="w-10 h-10
        bg-slate-50 border-4 hover:bg-green-600
        text-gray-500 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg">
          <PlusIcon @click="showForm()"/>
        </div>
      </div>
      <div class="mt-1 mb-1">
        <ul class="list-none">
          <li v-for="dm in dmChannels" :key="dm.id">
            <div class="pb-2 font-semibold hover:text-black">
              <button @click="changeChannel(dm)">{{ dm.name }} </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <h1 class="mt-3 font-bold">CHANNELS</h1>
      <div class="h-12 w-full mt-3">
        <div class="w-10 h-10
        bg-slate-50 border-4 hover:bg-green-600
        text-gray-500 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg">
          <PlusIcon @click="showForm()"/>
        </div>
      </div>
      <div class="mt-1">
        <ul class="list-none">
          <li v-for="channel in regularChannels" :key="channel.id">
            <div class="pb-2 font-semibold hover:text-black">
              <button @click="changeChannel(channel)"># {{ channel.name }} </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface DataI {
  dmChannels: any[],
  regularChannels: any[],
}

export default defineComponent({
  name: "ChatChannelsList",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
    channelsList: Object,
    creatingChan: Boolean,
  },
  data(): DataI {
    return {
      dmChannels: [],
      regularChannels: [],
    };
  },
  methods: {
    splitChannels() {
      let i = -1;
      while (++i < this.channelsList?.length) {
        if (this.channelsList?.at(i).type === 'direct_message')
          this.dmChannels.push(this.channelsList?.at(i));
        else {
          this.regularChannels.push(this.channelsList?.at(i));
        }
      }
    },
    changeChannel(channel: any) {
      this.$emit('selectedChannel', channel); // here we need to modify currentChan
    },
    showForm() {
      this.$emit('showForm');
    },
  },
  mounted() {
    this.splitChannels();
  }
});
</script>



<style src="../../assets/tailwind.css" />