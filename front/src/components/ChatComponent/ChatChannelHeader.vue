<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-full flex flex-col pt-2 pl-4 pr-4">
      <div class="h-16 w-16">
        <img :src="getImgUrl('Hashtag.png')" class="rounded-full" />
      </div>
      <h1 class="text-3xl font-bold">{{ currentChan?.name }}</h1>
      <p class="mt-3">This is the start of the #{{ currentChan?.name }} channel.</p>
      <div class="w-full flex mt-2 mb-2">
        <button @click="quitChannel()" class="pl-1 pr-1 rounded-lg border-2 border-slate-600 hover:text-red-500
        hover:border-red-500">Quit channel</button>
        <div v-if="isAdmin" class="w-10 h-10 ml-16
        rounded-3xl bg-gray-100 text-gray-500 hover:text-black
        cursor-pointer shadow-lg">
          <Cog8ToothIcon @click="toggleSettings()" />
        </div>
        <div v-if="currentChan?.type != 'direct'" class="w-10 h-10 ml-16
        rounded-3xl bg-gray-100 text-gray-500 hover:text-black
        cursor-pointer shadow-lg">
          <PlusIcon @click="toggleInvite()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatChannelHeader",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
  },
  data() {
    return {
      newPassword:'',
    };
  },
  methods: {
    getImgUrl(img: string) {
      return require('@/assets/' + img);
    },
    toggleSettings() {
      this.$emit('toggleSettings');
    },
    toggleInvite()
    {
      this.$emit('toggleInvite');
    },
    quitChannel() {
      console.log(`QUIT CHANNEL ${this.currentChan?.id} `);
      this.socket?.emit('quitChannel', {id: this.currentChan?.id});
      this.$emit('quitChan');
    },
    setPassword() {
      this.newPassword = '';
    },
    removePassword() {
      console.log('password removed'); //this is where we remove the password
    },
    getRole(login: string, chan: any): string {
      for (let j = 0; j < chan["userChannels"].length; j++) {
        if (chan["userChannels"][j].user.login == login)
          return chan["userChannels"][j].role;
      }
      return "undefined";
  },
  },
  computed: {
    isAdmin() {
      if (this.getRole(this.currentUser?.login, this.currentChan) == 'owner' || this.getRole(this.currentUser?.login, this.currentChan) == 'admin' )
        return (true);
      return (false);
    },
  },
});
</script>



<style src="../../assets/tailwind.css" />
