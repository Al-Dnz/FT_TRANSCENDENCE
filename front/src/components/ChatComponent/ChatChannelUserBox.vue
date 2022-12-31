<template>
  <div @mouseover="showOptMenuButton" @mouseleave="hideOptMenuButton"
  class="flex flex-row w-full mt-2 pt-2 pb-2 bg-inherit hover:bg-gray-300">
    <img :src="currentUser?.actualAvatar.path" @click="goProfile"
    class="w-12 h-12 rounded-full cursor-pointer" />
    <div class="flex flex-col ml-2">
      <h1 @click="goProfile" class="font-semibold cursor-pointer break-all">
      {{ userChannel?.user.userName }}</h1>
      <div v-if="userChannel?.user.login !== currentUser?.login" v-show="isOptMenuButtonVisible">
        <UserOptionsMenu :socket="socket" :currentChan="getCurrentChan" :currentUser="getCurrentUser"
        :targetUser="getUserChannel" @toggle-opt-menu="switchOptMenuState"
        class="h-6 w-6 rounded-full bg-gray-400" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserOptionsMenu from "../UserOptionsMenu.vue";

export default defineComponent({
  name: "ChatChannelUserBox",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
    userChannel: Object,
  },
  components: {
    UserOptionsMenu,
  },
  data() {
    return {
      isOptMenuButtonVisible: false,
      isOptMenuVisible: false,
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
          || user1?.login !== user2?.login)
        return (false);
      return (true);
    },
    showOptMenuButton() {
      this.isOptMenuButtonVisible = true;
    },
    hideOptMenuButton() {
      if (!this.isOptMenuVisible)
        this.isOptMenuButtonVisible = false;
    },
    switchOptMenuState() {
      this.isOptMenuVisible = !this.isOptMenuVisible;
    },
    goProfile() {
        alert("going to " + this.userChannel?.user.userName + "'s profile"); // placeholder
    },
    isCurrentUser(user: any) {
      return(this.compareUsers(this.currentUser, user));
    },
  },
  computed: {
    getCurrentUser() {
      return (this.currentUser);
    },
    getCurrentChan() {
      return (this.currentChan);
    },
    getUserChannel() {
      return (this.userChannel?.user);
    },
  }
});
</script>



<style src="../../assets/tailwind.css" />