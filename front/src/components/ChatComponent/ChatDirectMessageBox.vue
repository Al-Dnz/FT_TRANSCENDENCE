<template>
  <div class="h-full w-full flex flex-col divide-y-2">
    <div class="h-[22%]">
      <ChatChannelHeader :socket="socket" :currentChan="currentChan" />
    </div>
    <div class="flex flex-col h-[78%] ml-2 mr-2">
      <div class="h-[90%]">
        <ChatMessagesList :socket="socket" :currentUser="currentUser" :currentChan="currentChan" />
      </div>
      <div class="h-[10%] mb-8">
        <ChatMessageInput :socket="socket" :currentUser="currentUser" :currentChan="currentChan"
        @receiveNewMsg="receiveNewMsg" />
      </div>
    </div>
  </div>
  <div class="h-full w-1/5 text-slate-600 bg-gray-100">
    <ChatChannelUsersList :socket="socket" :currentUser="currentUser" :currentChan="currentChan" />
  </div>
</template>

<script lang="ts">
import ChatMessagesList from "./ChatMessagesList.vue";
import ChatMessageInput from "./ChatMessageInput.vue";
import ChatChannelHeader from "./ChatChannelHeader.vue";
import ChatChannelUsersList from "./ChatChannelUsersList.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatDirectMessageBox",
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
  },
  data() {
    return {

    };
  },
  methods: {
    receiveNewMsg(newMsg: any) {
      this.$emit('receiveNewMsg', newMsg); // this is temporary, this should be dealt with in ChatMessageInput
    }
  },
});
</script>



<style src="../../assets/tailwind.css" />