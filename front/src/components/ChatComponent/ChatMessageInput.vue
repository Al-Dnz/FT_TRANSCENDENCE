<template>
  <div class="flex flex-row">
    <input type="text" v-model="text" @keyup.enter="sendMessage()" name="sendMessage"
    placeholder="New message" autocomplete="off" aria-label="New message"
    class="w-full rounded-2xl px-3 placeholder-slate-500 text-slate-500
    focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500" />
    <div class="w-12 flex justify-center text-slate-500 hover:text-green-500 cursor-pointer">
      <ArrowRightCircleIcon class="h-10 w-10" @click.prevent="sendMessage" />
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatMessageInput",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object
  },
  data() {
    return {
      text: '',
    };
  },
  methods: {
    checkInputValidity(): boolean {
      return (this.text.length > 0);
    },
    sendMessage(): void {
      if (this.checkInputValidity() && this.currentChan) 
      {
        let newMsg = {
          // id: undefined,
          // createdAt: '',
          // updatedAt: '',
          // author: this.currentUser,
          text: this.text,
          channelId: this.currentChan.id,
        };
        // this.$emit('receiveNewMsg', newMsg); // here we need to create a new message and at it to currentChan's messagesList
        // console.log("newMsg");
        // console.log(newMsg);
              
        this.socket?.emit('msgToServer', newMsg);
        this.text = '';
      }
    },
  },
});
</script>
  
  

<style src="../../assets/tailwind.css" />