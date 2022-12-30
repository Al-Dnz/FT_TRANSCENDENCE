<template>
  <div v-if="!creatingChan && !creatingDM" class="h-full w-full pl-2 pr-2 divide-y-2">
    <div>
      <h1 class="mt-3 font-semibold">DIRECT MESSAGES</h1>
      <div class="h-12 w-full mt-3">
        <div class="w-10 h-10
        bg-slate-50 border-4 hover:bg-green-600
        text-gray-500 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg">
          <PlusIcon @click="showDMForm()" />
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
      <h1 class="mt-3 font-semibold">CHANNELS</h1>
      <div class="h-12 w-full mt-3">
        <div class="w-10 h-10
        bg-slate-50 border-4 hover:bg-green-600
        text-gray-500 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg">
          <PlusIcon @click="showChanForm()" />
        </div>
      </div>
      <div class="mt-1">
        <ul class="list-none">
          <li v-for="channel in regularChannels" :key="channel.id">
            <div class="pb-2 font-semibold hover:text-black">
              <button @click="changeChannel(channel)"># {{ channel.name }} => {{ channel.participation }} </button>
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
  allChannels: any[],
  dmChannels: any[],
  regularChannels: any[],
}

export default defineComponent({
  name: "ChatChannelsList",
  props: {
    socket: Object,
    currentChan: Object,
    creatingChan: Boolean,
    creatingDM: Boolean,
  },
  data(): DataI {
    return {
      allChannels: [],
      dmChannels: [],
      regularChannels: [],
    };
  },
  methods:
  {
    changeChannel(channel: any) {
      this.$emit('selectedChannel', channel);
    },
    showDMForm() {
      this.$emit('showDMForm');
    },
    showChanForm() {
      this.$emit('showChanForm');
    },
    getRole(name: string, chan: any): string {
      for (let j = 0; j < chan["userChannels"].length; j++) {
        if (chan["userChannels"][j].user.login == name)
          return chan["userChannels"][j].role;
      }
      return "undefined";
    },
    isInChan(name: string, chan: any): boolean {
      for (let j = 0; j < chan["userChannels"].length; j++) {
        if (chan["userChannels"][j].user.login == name)
          return true
      }
      return false;
    },
    getAllChannels(channels: any) {
      this.allChannels = channels;
      this.dmChannels = [];
      this.regularChannels = [];

      let arr = channels;
      for (let i = 0; i < arr.length; i++) 
      {
        arr[i].participation = false;
        for (let j = 0; j < arr[i]["userChannels"].length; j++) 
        {
          if (arr[i]["userChannels"][j].user.login == 'nschmitt') 
          {
            arr[i].participation = true;
            break;
          }
        }
      }
      arr.sort(function (a: any, b: any) {
        return a.id - b.id;
      });
      console.log(arr);
      
      arr.forEach((chan: any) => (chan.type == 'direct' ? this.dmChannels : this.regularChannels).push(chan));
    
    },
  },
  
  created() {
    this.socket?.on('allChansToClient', (channels: any) => {
      this.getAllChannels(channels)
    })
    this.socket?.emit('getAllChannels');
  },
});
</script>

















<style src="../../assets/tailwind.css" />