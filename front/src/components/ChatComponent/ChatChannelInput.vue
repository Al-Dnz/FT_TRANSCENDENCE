<template>
  <textarea v-model="text" id="textarea" class="form-control" @keyup.enter="createChannel"
    placeholder="New Channel"></textarea>
  <!-- <button id="send" class="btn" @click.prevent="createChannel"></button> -->
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatChannelInput",
  props: {
    socket: Object,
    current_chan: Object
  },
  data() {
    return {
      sender: '',
      text: '',
    };
  },
  methods: {
    createChannel() {
      if (this.validateInput()) {
        const channel =
        {
          // sender: this.sender,
          name: this.text,
        }
        this.socket?.emit('chanToServer', channel)
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