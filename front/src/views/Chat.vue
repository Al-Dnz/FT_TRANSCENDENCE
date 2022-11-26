<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/5 text-slate-600 bg-gray-100">
      <ChatChannelInput :socket="socket" :current_chan="current_chan" />
      <ChatChannelsList :socket="socket" @selectedChannel="getCurrentChannel" />
    </div>
    <div class="h-full w-4/5 bg-gray-50">
      <div class="h-5/6 w-full">
        <ChatMessagesList :socket="socket" :current_chan="current_chan" />
      </div>
      <div>
      <ChatMessageInput :socket="socket" :current_chan="current_chan" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import ChatMessagesList from "../components/ChatComponent/ChatMessagesList.vue";
import ChatMessageInput from "../components/ChatComponent/ChatMessageInput.vue";
import ChatChannelsList from "../components/ChatComponent/ChatChannelsList.vue";
import ChatChannelInput from "../components/ChatComponent/ChatChannelInput.vue";
import { defineComponent } from "vue";

interface ChannelI {
  unremovable: boolean;
  id: number;
  createdAt: string;
  name: string;
  type: string;
}

export default defineComponent({
  name: "ChatPage",
  components: {
    ChatChannelInput,
    ChatChannelsList,
    ChatMessagesList,
    ChatMessageInput,
  },
  data() {
    return {
      socket: null as any,
      current_chan: {
        unremovable: true,
        id: 1,
        createdAt: '',
        name: 'main_chan',
        type: 'public'
      },
    };
  },
  methods: {
    getCurrentChannel(channel: ChannelI) {
      this.current_chan = channel;
    },
  },
  computed: {
    loadMainChan(): ChannelI {
      return (this.current_chan);
    }
  },
  created() {
    this.socket = io(`http://127.0.0.1:3004`);
  }
});
</script>

<style src="../assets/tailwind.css" />