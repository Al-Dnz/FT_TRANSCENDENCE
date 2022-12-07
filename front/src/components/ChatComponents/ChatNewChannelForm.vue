<template>
  <div class="flex flex-col h-full w-full mt-4 ml-4">
    <div class="h-12 w-12 bg-gray-50 text-slate-500 hover:text-red-500 cursor-pointer">
      <XCircleIcon @click="cancelForm()"/>
    </div>
    <h1 class="mt-4 text-3xl font-semibold">New Channel</h1>
    <textarea v-model="newName" id="textarea" class="form-control w-52 mt-4 border-2"
    placeholder="Name"></textarea>
    <textarea v-model="newType" id="textarea" class="form-control w-52 mt-4 border-2"
    placeholder="Type"></textarea>
    <textarea v-if="newType === 'protected'" v-model="newPassword" id="textarea"
    class="form-control w-52 mt-4 border-2" placeholder="Password"></textarea>
    <div class="mt-4">
      <button class="rounded-lg border-2 border-slate-600
      hover:text-green-500 hover:border-green-500"
      @click="createChannel">Create</button>
    </div>
  </div>
</template>
  
<script lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'ChatChannelInput',
    props: {
        socket: Object,
    },
    data() {
        return {
            sender: '',
            newName: '',
            newType: '',
            newPassword: '',
        };
    },
    methods: {
        createChannel() {
            if (this.validateInput()) {
                const channel = {
                    // sender: this.sender,
                    name: this.newName,
                    type: this.newType,
                    password: this.newPassword,
                };
                this.socket?.emit("chanToServer", channel);
                this.cancelForm();
            }
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
});
</script>



<style src="../../assets/tailwind.css" />