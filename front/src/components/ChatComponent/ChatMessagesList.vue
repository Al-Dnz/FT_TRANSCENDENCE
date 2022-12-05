<template>
  <div class="h-full w-full overflow-auto pt-3">
    <div v-if="currentChan">
      <div class="">
        <ul>
          <li v-for="message in messages" :key="message.id">
            <ChatMessageBox :socket="socket" :currentChan="currentChan"
            :currentUser="currentUser" :message="message" />
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
    ChatMessageBox,
  },
  data() {
    return {
      messages: this.currentChan?.msgList,
    };
  },
  methods: {},
});
</script>



<style src="../../assets/tailwind.css" />