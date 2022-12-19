<template>
  <div class="flex flex-col h-full w-full mt-4 ml-4">
    <div class="h-12 w-12 bg-inherit text-slate-500 hover:text-red-500 cursor-pointer">
      <XCircleIcon @click="cancelForm()"/>
    </div>
    <h1 class="mt-4 text-3xl font-semibold">New Channel</h1>
    <div class="w-fit mt-4">
      <input type="text" v-model="newName" name="Name"
      placeholder="Choose a name" autocomplete="off"
      class="w-full rounded-2xl px-3 placeholder-slate-500 text-slate-500
      focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500" />
    </div>
    <div v-if="isNameTaken" class="mt-4 text-red-500">
      <p>This name is already taken</p>
    </div>
    <div class="w-fit mt-4">
      <select v-model="newType">
        <option disabled value="">Select a type</option>
        <option>public</option>
        <option>private</option>
        <option>protected</option>
      </select>
    </div>
    <div v-if="newType === 'protected'" class="w-fit mt-4">
      <input type="text" v-model="newName" name="Name"
      placeholder="Choose a password" autocomplete="off"
      class="w-full rounded-2xl px-3 placeholder-slate-500 text-slate-500
      focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500" />
    </div>
    <div class="mt-4">
      <button @click="createChannel()"
      class="pl-1 pr-1 rounded-lg border-2 border-slate-600 hover:text-green-500
      hover:border-green-500">Create channel</button>
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
  name: 'ChatNewChannelForm',
  props: {
      socket: Object,
  },
  data() {
    return {
      newName: '',
      newType: '',
      newPassword: '',
      formInvalid: false,
    };
  },
  methods: {
    createChannel() {
      if (this.validateInput()) {
        // here we create a new channel
        this.cancelForm();
      }
      else
        this.formInvalid = true;
    },
    validateInput() {
      return (this.newName.length > 0 && this.newType.length > 0
      && !(this.newType === 'protected' && !this.newPassword.length));
    },
    cancelForm() {
      this.newName = '';
      this.newType = '';
      this.newType = '';
      this.$emit("cancelForm");
    }
  },
  computed: {
    isNameTaken() {
      return (false); // here we check if this name is already used by another channel
    },
  }
});
</script>



<style src="../../assets/tailwind.css" />