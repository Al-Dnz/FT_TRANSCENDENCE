<template>
  <div v-show="protected" class="h-full w-full">
    <ChatChanPass :Connect="joinChannel" :ChannelName="currentChan?.name" />
  </div>
  <div v-show="!protected" class="h-full w-full flex flex-row">
    <div class="h-full w-full flex flex-col divide-y-2">
      <div class="h-[22%]">
        <ChatChannelHeader :socket="socket" :currentUser="currentUser" :currentChan="currentChan"
        @toggleSettings="toggleSettings" @toggleInvite="toggleInvite" @quitChan="quitChan" />
      </div>
      <div class="flex flex-col h-[78%] ml-2 mr-2">
        <div class="h-[90%]">
          <ChatMessagesList :socket="socket" :currentUser="currentUser" :currentChan="currentChan"
          @isProtected="protect" @isValidated="validate" />
        </div>
        <div class="h-[10%] mb-8">
          <ChatMessageInput :socket="socket" :currentChan="currentChan" />
        </div>
      </div>
    </div>
    <div class="h-full w-1/5 text-slate-600 bg-gray-100">
      <ChatChannelUsersList :socket="socket" :currentUser="currentUser" :currentChan="currentChan" />
    </div>
  </div>
</template>

<script lang="ts">
import ChatMessagesList from "./ChatMessagesList.vue";
import ChatMessageInput from "./ChatMessageInput.vue";
import ChatChannelHeader from "./ChatChannelHeader.vue";
import ChatChannelUsersList from "./ChatChannelUsersList.vue";
import ChatChanPass from "./ChatChanPass.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatChannelBox",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
  },
  components: {
    ChatMessagesList,
    ChatMessageInput,
    ChatChannelHeader,
    ChatChannelUsersList,
    ChatChanPass,
  },
  data() {
    return {
      protected: false,
    };
  },
  methods: {
    protect() {
      this.protected = true;
    },
    validate() {
      this.protected = false;
    },
    joinChannel(password: string) {
      this.socket?.emit('joinChannel', {id: this.currentChan?.id, password: password}); 
    },
    toggleSettings() {
      this.$emit('toggleSettings');
    },
    toggleInvite()
    {
      this.$emit('toggleInvite');
    },
    quitChan() {
      this.$emit('quitChan');
    },
  },
});
</script>



<style src="../../assets/tailwind.css" />