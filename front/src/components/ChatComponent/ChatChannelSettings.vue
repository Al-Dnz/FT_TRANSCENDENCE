<template>
  <div class="flex flex-col h-full w-full mt-4 ml-4">
    <div class="h-12 w-12 bg-inherit text-slate-500 hover:text-red-500 cursor-pointer">
      <XCircleIcon @click="cancelSettings()"/>
    </div>
    <h1 class="mt-4 text-3xl font-semibold">Channel Settings</h1>
    <div v-if="currentChan?.type === 'protected'" class="w-full mt-4 mb-8">
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
      <div class="h-4 mt-2 text-green-500">
        <p v-show="passwordSuccess">A new password has been set</p>
      </div>
    </div>
    <div class="mt-4">
      <h2>Change channel type:</h2>
      <p>(current type: {{ currentChan?.type }})</p>
      <div class="w-fit mt-4">
        <select v-model="newType">
          <option disabled value="">Select type</option>
          <option v-if="currentChan?.type !== 'public'">public</option>
          <option v-if="currentChan?.type !== 'private'">private</option>
          <option v-if="currentChan?.type !== 'protected'">protected</option>
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
      <button @click="changeType()"
      class="pl-1 pr-1 rounded-lg border-2 border-slate-600 hover:text-green-500
      hover:border-green-500">Change type</button>
    </div>
    <div class="h-4 mt-2 text-green-500">
      <p v-show="typeSuccess">Channel's type has been changed</p>
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
      newType: '',
      passwordSuccess: false,
      typeSuccess: false,
    };
  },
  methods: {
    changePassword() {
      if (this.newPassword.length > 0) {

        const payload = 
        {
          id: this.currentChan?.id,
          password: this.newPassword,
        }
        this.socket?.emit('updateChannel', payload);

        console.log('password changed'); //here we change the password
        this.newPassword = '';
        this.passwordSuccess = true;
      }
      else
        this.passwordSuccess = false;
    },
    changeType() {

      if (this.newType.length > 0 && !(this.newType === 'protected' && (this.newPassword.length == 0))) {

        const payload = this.newPassword.length > 0 ?
        {
          id: this.currentChan?.id,
          password: this.newPassword, 
          type: this.newType,
        }:
        {
          id: this.currentChan?.id,
          type: this.newType,
        }

        console.log("type payload");
        console.log(payload);

        this.socket?.emit('updateChannel', payload);

        console.log('type changed'); //here we change the type of the channel
        this.newType = '';
        this.newPassword = '';
        this.typeSuccess = true;
      }
      else
        this.typeSuccess = false;
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