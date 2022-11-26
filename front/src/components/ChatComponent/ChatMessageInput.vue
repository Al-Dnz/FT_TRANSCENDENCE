<template>
  <div v-if="current_chan">
    <textarea v-model="text" id="textarea" class="form-control" @keyup.enter="sendMessage"
      placeholder="Enter message..."></textarea>
    <button id="send" class="btn" @click.prevent="sendMessage">Send</button>
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
  