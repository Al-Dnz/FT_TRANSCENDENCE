<template>
  <div @mouseover="showOptMenuButton" @mouseleave="hideOptMenuButton"
  class="flex flex-row w-full mt-2 pt-2 pb-2 pl-6 pr-4 bg-gray-50 hover:bg-gray-200">
    <img :src="getImgUrl(channelUser?.pic)" @click="goProfile"
    class="w-12 h-12 rounded-full cursor-pointer" />
    <div class="flex flex-row ml-2">
      <h1 @click="goProfile" class="font-semibold cursor-pointer break-all">
      {{ channelUser?.name }}</h1>
      <div v-if="!isCurrentUser(channelUser)" v-show="isOptMenuButtonVisible"
      class="ml-1 rounded-full bg-gray-300">
        <UserOptionsMenu :socket="socket" :currentChan="getCurrentChan" :currentUser="getCurrentUser"
        :targetUser="getChannelUser" @toggle-opt-menu="switchOptMenuState" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserOptionsMenuVue from "../UserOptionsMenu.vue";

export default defineComponent({
  name: "ChatChannelUserBox",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
    channelUser: Object,
  },
  components: {
    UserOptionsMenuVue,
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
          || user1?.name !== user2?.name || user1?.pic !== user2?.pic
          || !this.compareArrays(user1?.blockList, user2?.blockList))
        return (false);
      return (true);
    },
    getImgUrl: function (img: string) {
      return require('@/assets/' + img);
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
        alert("going to " + this.channelUser?.name + "'s profile"); // placeholder
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
    getChannelUser() {
      return (this.channelUser);
    },
  }
});
</script>



<style src="../../assets/tailwind.css" />