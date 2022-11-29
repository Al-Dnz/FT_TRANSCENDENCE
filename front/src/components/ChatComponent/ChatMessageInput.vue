<template>
  <div v-if="current_chan" className="flex flex-row ml-4 mr-10">
    <!-- <textarea v-model="text" id="textarea" class="form-control" @keyup.enter="sendMessage"
      placeholder="Enter message..."></textarea> -->
        <input type="text" v-model="text" @keyup.enter="sendMessage()" name="sendMessage" placeholder="New message"
        autocomplete="off" aria-label="New message" className="rounded-2xl px-3 placeholder-slate-500
        text-slate-500 focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500 w-11/12" />
    <div className="w-1/12 pt-3 pb-3 pl-3 pr-3 bg-gray-50 text-slate-500 hover:text-green-500 cursor-pointer">
      <ArrowRightCircleIcon @click.prevent="sendMessage" />
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatMessageInput",
  props: {
    socket: Object,
    current_chan: Object
  },
  data() {
    return {
      sender: '',
      text: '',
      channelId: null,
    };
  },
  methods: {
    sendMessage() {
      if (this.validateInput() && this.current_chan) {
        const message =
        {
          // sender: this.sender,
          text: this.text,
          channelId: this.current_chan.id
        }
        this.socket?.emit('msgToServer', message)
        this.text = '';
      }
    },
    validateInput() {
      return this.text.length > 0
    },
  },
});
</script>
  
  

<style src="../../assets/tailwind.css" />
  