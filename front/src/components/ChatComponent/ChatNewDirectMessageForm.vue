<template>
  <div class="flex flex-col h-full w-full mt-4 ml-4">
    <div class="h-12 w-12 bg-inherit text-slate-500 hover:text-red-500 cursor-pointer">
      <XCircleIcon @click="cancelForm()"/>
    </div>
    <h1 class="mt-4 text-3xl font-semibold">New Direct Message</h1>
    <div class="w-fit mt-4">
      <input type="text" v-model="newUser" name="User"
      placeholder="Choose a user" autocomplete="off"
      class="w-full rounded-2xl px-3 placeholder-slate-500 text-slate-500
      focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500" />
    </div>
    <div v-if="doesDMExists" class="mt-4 text-red-500">
      <p>This direct message already exists</p>
    </div>
    <div class="mt-4">
      <button @click="createChannel()"
      class="pl-1 pr-1 rounded-lg border-2 border-slate-600 hover:text-green-500
      hover:border-green-500">Create direct message</button>
    </div>
    <div v-if="formInvalid" class="mt-4 text-red-500">
      <p>Invalid form</p>
    </div>
  </div>
</template>
  
<script lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

export default defineComponent({
  name: 'ChatNewDirectMessageForm',
  props: {
      socket: Object,
  },
  data() {
    return {
      newUser: '',
      formInvalid: false,
    };
  },
  methods: {
    createChannel() {
      if (this.validateInput()) 
	  {
		payload =
		{
			login: this.newUser
		}
        this.socket?.emit('directMessage', payload)
        this.cancelForm();
      }
      else
        this.formInvalid = true;
    },
    validateInput() {
      return (this.newUser.length > 0);
    },
    cancelForm() {
      this.newUser = '';
      this.$emit("cancelForm");
    }
  },
  computed: {
    doesDMExists() {
      return (false); // here we check if this direct message channel already exists
    },
  }
});
</script>



<style src="../../assets/tailwind.css" />