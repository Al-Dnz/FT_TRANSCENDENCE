<template>
  <div class="h-full w-full">
    <div class="h-14 w-full pt-4 pl-2">
      <div v-if="!creatingChan" class="w-10 h-10
      bg-slate-50 border-4 hover:bg-green-600
      text-gray-500 hover:text-white
      hover:rounded-xl rounded-3xl
      transition-all duration-300 ease-linear
      cursor-pointer shadow-lg">
        <PlusIcon @click="showForm()"/>
      </div>
    </div>
    <div class="">
      <div class="pt-2 pl-2">
        <ul class="list-none">
          <li v-for="channel in channels" :key="channel.id">
            <div v-if="channel.type === 'direct_message'" class="pb-2 font-semibold">
              <button @click="changeChannel(channel)"># {{ channel.name }} </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="h-12 w-full mt-1 ml-2">
      <div v-if="!creatingChan" class="w-10 h-10
      bg-slate-50 border-4 hover:bg-green-600
      text-gray-500 hover:text-white
      hover:rounded-xl rounded-3xl
      transition-all duration-300 ease-linear
      cursor-pointer shadow-lg">
        <PlusIcon @click="showForm()"/>
      </div>
      </div>
      <div class="mt-1 ml-2">
        <ul class="list-none">
          <li v-for="channel in channels" :key="channel.id">
            <div v-if="channel.type !== 'direct_message'" class="pb-2 font-semibold">
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

// interface ChannelI {
//   unremovable: boolean;
//   id: number;
//   createdAt: string;
//   name: string;
//   type: string;
// }

export default defineComponent({
  name: "ChatChannelsList",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
    channels: Object,
    creatingChan: Boolean,
  },
  data() {
    return {
      // channels: null as any,
    };
  },
  methods: {
    // async fetchData() {
    //   const bearer = {
    //     method: 'GET',
    //     headers: {}
    //   }
    //   let response = await fetch('http://localhost:3004/channel', bearer)
    //   let data: Response["type"] = await response.json();
    //   this.channels = [...data];
    // },
    // receivedChannel(channel: ChannelI) {
    //   this.channels.push(channel);
    // },
    // backUpChan(channel: ChannelI) {
    //   this.$emit('selectedChannel', channel);
    // },
    changeChannel(channel: any) {
      // alert('a channel has been selected');
      this.$emit('selectedChannel', channel);
    },
    showForm() {
      this.$emit('showForm');
    },
  },
  // computed: {
  //   loadChannel() {
  //     return (this.channels);
  //   }
  // },
  // async created() {
  //   this.fetchData();
  //   this.socket?.on(`chanToClient`, (channel: ChannelI) => {
  //     console.log("ws new_channel =>");
  //     console.log(channel);
  //     this.receivedChannel(channel);
  //   })
  // },
});
</script>



<style src="../../assets/tailwind.css" />