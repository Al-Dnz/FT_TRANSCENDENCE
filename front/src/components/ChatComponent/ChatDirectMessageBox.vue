<template>
  <div class="h-full w-full flex flex-col divide-y-2">
    <div class="h-[22%]">
      <ChatDirectMessageHeader :socket="socket" :currentUser="currentUser" :currentChan="currentChan" />
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
</template>

<script lang="ts">
import ChatMessagesList from "./ChatMessagesList.vue";
import ChatMessageInput from "./ChatMessageInput.vue";
import ChatDirectMessageHeader from "./ChatDirectMessageHeader.vue";
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
    ChatDirectMessageHeader,
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