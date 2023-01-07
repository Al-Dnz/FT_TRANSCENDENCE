<template>
  <div class="flex flex-col h-full w-full mt-4 ml-4">
    <div class="h-12 w-12 bg-inherit text-slate-500 hover:text-red-500 cursor-pointer">
      <XCircleIcon @click="cancelSettings()"/>
    </div>
    <h1 class="mt-4 text-3xl font-semibold">Channel Settings</h1>
    <h1 class="mt-4 text-3xl font-semibold">#{{ currentChan?.name }}</h1>
    <!-- <div v-if="currentChan?.type === 'protected'" class="w-full mt-4 mb-8">
      <h2>Change password:</h2>
      <div class="w-full flex flex-row">
        <div class="w-fit mt-4">
          <input type="text" v-model="newPassword" name="Name" @keyup.enter="changePassword"
          placeholder="Choose a new password" autocomplete="off"
          class="w-full rounded-2xl px-3 placeholder-slate-500 text-slate-500
          focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500" />
        </div>
        <div class="w-12 flex justify-center mt-3 text-slate-500 hover:text-green-500 cursor-pointer">
          <ArrowRightCircleIcon class="h-10 w-10" @click.prevent="changePassword()" />
        </div>
      </div>
    </div> -->
    <div class="mt-4">
      <h2>Channel settings:</h2>
      <div class="w-fit mt-4">
        <select v-model="newType">
          <option disabled value="">Select type</option>
          <option>public</option>
          <option>private</option>
          <option>protected</option>
        </select>
      </div>
    </div>
    <div v-if="newType === 'protected'" class="w-fit mt-4">
      <input type="text" v-model="newPassword" name="Password"
      placeholder="Choose a password" autocomplete="off"
      class="w-full rounded-2xl px-3 placeholder-slate-500 text-slate-500
      focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500" />
    </div>
    <div class="mt-4">
      <button @click="updateChan()"
      class="pl-1 pr-1 rounded-lg border-2 border-slate-600 hover:text-green-500
      hover:border-green-500">Update Settings</button>
    </div>
  </div>
</template>
  
<script lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

export default defineComponent({
  name: 'ChatChannelSettings',
  props: {
    socket: Object,
    currentChan: Object,
  },
  data() {
    return {
      newPassword: '',
      newType: this.currentChan?.type,
    };
  },
  methods: {
    changePassword(newPass : string) {
        const payload = 
        {
          id: this.currentChan?.id,
          password: newPass,
        }
        this.socket?.emit('updateChannel', payload);

        console.log('password changed'); //here we change the password
    },
    updateChan(newPass : string, newType: string) {
        const payload = newPass.length > 0 ?
        {
          id: this.currentChan?.id,
          password: newPass, 
          type: newType,
        }:
        {
          id: this.currentChan?.id,
          type: newType,
        }
        this.socket?.emit('updateChannel', payload);
    },
    cancelSettings() {
      this.newPassword = '';
      this.newType = '';
      this.$emit("toggleSettings");
    }
  },
});
</script>



<style src="../../assets/tailwind.css" />