<template>
  <div class="h-full w-full overflow-auto pt-3">
    <div>
      <ul>
        <li v-for="user in currentChan?.userList" :key="user.id">
          <div v-if="!compareUsers(user, currentUser)">
            <ChatChannelUserBox :socket="socket" :currentUser="currentUser"
            :currentChan="currentChan" :channelUser="user" />
          </div>
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
  methods: {
    compareArrays(arr1: any[], arr2: any[]): boolean {
      let i = arr1?.length;
      if (i !== arr2?.length)
        return (false);
      while (i) {
        if (arr1[i] !== arr2[i])
          return (false);
        --i;
      }
      return (true);
    },
    compareUsers(user1: any, user2: any): boolean {
      if (user1?.length !== user2?.length || user1?.id !== user2?.id
          || user1?.name !== user2?.name || user1?.pic !== user2?.pic
          || !this.compareArrays(user1?.blockList, user2?.blockList))
        return (false);
      return (true);
    },
  },
});
</script>



<style src="../../assets/tailwind.css" />