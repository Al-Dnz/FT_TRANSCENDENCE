<template>
  <div class="flex flex-col h-full w-full mt-4 ml-4">
    <div class="h-12 w-12 bg-inherit text-slate-500 hover:text-red-500 cursor-pointer">
      <XCircleIcon @click="cancelInvite()"/>
    </div>
    <h1 class="mt-4 text-3xl font-semibold">Invite new users!</h1>
    <div class="w-full mt-4 mb-8">
      <h2>Login:</h2>
      <div class="w-full flex flex-row">
        <div class="w-fit mt-4">
          <input type="text" v-model="newUser" name="Name" @keyup.enter="addUser()"
          placeholder="His 42 Login" autocomplete="off"
          class="w-full rounded-2xl px-3 placeholder-slate-500 text-slate-500
          focus-within:border-green-500 focus-within:outline-none border-2 border-slate-500" />
        </div>
        <div class="w-12 flex justify-center mt-3 text-slate-500 hover:text-green-500 cursor-pointer">
          <ArrowRightCircleIcon class="h-10 w-10" @click.prevent="addUser()" />
        </div>
    </div>
  </div>
  </div>
</template>
  
<script lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

export default defineComponent({
  name: 'ChatChannelInvite',
  props: {
    socket: Object,
    currentChan: Object,
  },
  data() {
    return {
      newUser: '',
      addSuccess: false,
    };
  },
  methods: {
    addUser() {
      if (this.newUser.length > 0) {

        const payload = 
        {
          userLogin: this.newUser,
          channelId: this.currentChan?.id
        }
        this.socket?.emit('inviteUser', payload);
        this.newUser = '';
        this.addSuccess = true;
        // this.cancelInvite();
      }
      else
        this.addSuccess = false;
    },
    cancelInvite() {
      this.newUser = '';
      this.$emit("toggleInvite");
    }
  },
});
</script>



<style src="../../assets/tailwind.css" />