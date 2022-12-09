<template>
  <div class="h-full w-full overflow-y-auto pt-3">
    <div v-if="currentChan">
      <div class="">
        <ul>
          <!-- <li v-for="message in messages" :key="message.id">
            <ChatMessageBox :socket="socket" :currentChan="currentChan"
            :currentUser="currentUser" :message="message" />
          </li> -->

          <li v-for="message in messages" :key="message.id">
            {{message.sender.login}} : {{message.text}}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>NO CHANNEL SELECTED</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChatMessageBox from "./ChatMessageBox.vue";



export default defineComponent({
  name: "ChatMessagesList",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
  },
  components: {
    // ChatMessageBox,
  },
  data() {
    return {
      locked: false as boolean,
      messages: [] as any[],
      password: null
    };
  },
  methods:
  {
    handleChanConnection(payload: any)
    {
      this.locked =  payload.locked;
      this.messages = payload.messages;
    },
    receiveMessage(message: any)
    {
      if (this.locked)
        return;
      if (message.channel.id == this.currentChan?.id)
        this.messages.push(message);
    }
  },
  created()
  {
    this.socket?.emit('joinChannel', {id: this.currentChan?.id, password: this.password});
    this.socket?.on('allChanMessagesToClient', (payload: any) => {
            this.handleChanConnection(payload)
        })
    this.socket?.on('msgToChannel', (message: any) => {
        this.receiveMessage(message)
    })
  }
});
</script>



<style src="../../assets/tailwind.css" />