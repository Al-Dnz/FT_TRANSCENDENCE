<template>
  <div class="h-full w-full overflow-auto pt-3">
    <div>
      <ul>
        <li v-for="user in users" :key="user.id">
          <ChatChannelUserBox :socket="socket" :currentUser="currentUser"
          :currentChan="currentChan" :channelUser="user" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChatChannelUserBox from "./ChatChannelUserBox.vue";

export default defineComponent({
  name: "ChatChannelUsersList",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
  },
  components: {
    ChatChannelUserBox,
  },
  data() {
    return {
      users: this.currentChan?.userList,
    };
  },
  methods: {},
});
</script>



<style src="../../assets/tailwind.css" />