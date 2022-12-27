<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/6 text-slate-600 bg-gray-100">
      <ChatChannelsList :socket="socket"
      :currentChan="currentChan" :creatingChan="creatingChan" :creatingDM="creatingDM"
      @selectedChannel="changeCurrentChannel" @showChanForm="showChanCreationForm" @showDMForm="showDMCreationForm" />
    </div>
    <div v-if="(!currentChan && !creatingChan && !creatingDM)" class="mt-4 ml-2">
      <p class="text-3xl">NO CHANNEL SELECTED</p>
    </div>
    <div v-else-if="creatingChan" class="h-full w-5/6">
      <ChatNewChannelForm :socket="socket" @cancelForm="showChanCreationForm" />
    </div>
    <div v-else-if="creatingDM" class="h-full w-5/6">
      <ChatNewDirectMessageForm :socket="socket" @cancelForm="showDMCreationForm" />
    </div>
    <div v-else-if="currentChan?.type === 'direct_message'"
    class="h-full w-5/6 bg-gray-50">
      <ChatDirectMessageBox :socket="socket"
      :currentChan="currentChan" @quitChan="quitChan" />
    </div>
    <div v-else-if="currentChan?.type !== 'direct_message'"
    class="h-full w-5/6 bg-gray-50">
      <ChatChannelBox :socket="socket"
      :currentChan="currentChan" @quitChan="quitChan" />
    </div>
  </div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import ChatChannelsList from "../components/ChatComponent/ChatChannelsList.vue";
import ChatChannelBox from "../components/ChatComponent/ChatChannelBox.vue";
import ChatDirectMessageBox from "../components/ChatComponent/ChatDirectMessageBox.vue";
import ChatNewChannelForm from "../components/ChatComponent/ChatNewChannelForm.vue";
import ChatNewDirectMessageForm from "../components/ChatComponent/ChatNewDirectMessageForm.vue";
import { defineComponent } from "vue";

interface DataI {
  creatingChan: boolean,
  creatingDM: boolean,
  socket: any,
  currentChan: any,
}
export default defineComponent({
  name: "ChatPage",
  components: {
    ChatChannelsList,
    ChatChannelBox,
    ChatDirectMessageBox,
    ChatNewChannelForm,
    ChatNewDirectMessageForm,
  },
  data(): DataI {
    return {
      creatingChan: false,
      creatingDM: false,
      socket: null as any,
      currentChan: null as any,
    };
  },
  methods: {
    changeCurrentChannel(channel: any) {
      this.currentChan = channel;
    },
    showChanCreationForm() {
      this.creatingChan = !this.creatingChan;
    },
    showDMCreationForm() {
      this.creatingDM = !this.creatingDM;
    },
    quitChan() {
      this.currentChan = null as any;
    },
  },
  created() {
    const authPayload = { auth: { token: this.$cookies.get("trans_access") } };
    this.socket = io("http://" + process.env.VUE_APP_IP + ":3004", authPayload);
    this.socket.on('chatError', (error: any) => {
      this.$toast(error, { styles: { backgroundColor: "#FF0000", color: "#FFFFFF" } });
    })
  },
  unmounted() {
    this.socket.disconnect();
  }
})
</script>



<style src="../assets/tailwind.css" />