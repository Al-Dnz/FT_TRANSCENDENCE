<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/5 text-slate-600 bg-gray-100">
      <ChatChannelsList :socket="socket" :creatingChan="creatingChan"
      @selectedChannel="getCurrentChannel" @showForm="showCreationForm" />
    </div>
    <div v-if="!creatingChan" class="h-full w-4/5 flex flex-row bg-gray-50">
      <div class="h-full w-4/5">
        <div class="h-full w-full flex flex-col divide-y-2">
          <div class="">
            <ChatChannelHeader :socket="socket" :current_chan="current_chan" />
          </div> 
          <div class="">
            <div class="h-5/6">
              <ChatMessagesList :socket="socket" :current_chan="current_chan" />
            </div>
            <div class="h-1/6 pl-2">
              <ChatMessageInput :socket="socket" :current_chan="current_chan" />
            </div>
          </div>
        </div>
      </div>
      <div class="h-full w-1/5 bg-gray-100">
        <ChatChannelUsersList :current_chan="current_chan" />
      </div>
    </div>
    <div v-else class="h-full w-4/5">
      <ChatNewChannelForm :socket="socket" @cancelForm="showCreationForm" />
    </div>
  </div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import ChatMessagesList from "../components/ChatComponent/ChatMessagesList.vue";
import ChatMessageInput from "../components/ChatComponent/ChatMessageInput.vue";
import ChatChannelsList from "../components/ChatComponent/ChatChannelsList.vue";
import ChatNewChannelForm from "../components/ChatComponent/ChatNewChannelForm.vue";
//import ChatDirectMessageHeader from "../components/ChatComponent/ChatDirectMessageHeader.vue";
import ChatChannelHeader from "../components/ChatComponent/ChatChannelHeader.vue";
import ChatChannelUsersList from "../components/ChatComponent/ChatChannelUsersList.vue";
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
    ChatNewChannelForm,
    ChatChannelsList,
    ChatMessagesList,
    ChatMessageInput,
    //ChatDirectMessageHeader,
    ChatChannelHeader,
    ChatChannelUsersList,
  },
  data() {
    return {
      height: 40,
      socket: null as any,
      current_chan: {
        unremovable: true,
        id: 1,
        createdAt: '',
        name: 'main_chan',
        type: 'public'
      },
      creatingChan: false,
    };
  },
  methods: {
    getCurrentChannel(channel: ChannelI) {
      this.current_chan = channel;
    },
    showCreationForm() {
      this.creatingChan = !this.creatingChan;
    }
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