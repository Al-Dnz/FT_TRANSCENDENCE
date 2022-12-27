<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-full flex flex-col divide-y-2">
      <div class="h-[22%]">
        <ChatChannelHeader :socket="socket" :currentChan="currentChan" @quitChan="quitChan" />
      </div>
      <div class="flex flex-col h-[78%] ml-2 mr-2">
        <div class="h-[90%]">
          <ChatMessagesList :socket="socket" :currentChan="currentChan" />
        </div>
        <div class="h-[10%] mb-8">
          <ChatMessageInput :socket="socket" :currentChan="currentChan" />
        </div>
      </div>
    </div>
    <div class="h-full w-1/5 text-slate-600 bg-gray-100">
      <ChatChannelUsersList :socket="socket" :currentChan="currentChan" />
    </div>
  </div>
</template>

<script lang="ts">
import ChatMessagesList from "./ChatMessagesList.vue";
import ChatMessageInput from "./ChatMessageInput.vue";
import ChatChannelHeader from "./ChatChannelHeader.vue";
import ChatChannelUsersList from "./ChatChannelUsersList.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatChannelBox",
  props: {
    socket: Object,
    currentChan: Object,
  },
  components: {
    ChatMessagesList,
    ChatMessageInput,
    ChatChannelHeader,
    ChatChannelUsersList,
  },
  data() {
    return {};
  },
  methods: {
    quitChan() {
      this.$emit('quitChan');
    },
  },
});
</script>



<style src="../../assets/tailwind.css" />