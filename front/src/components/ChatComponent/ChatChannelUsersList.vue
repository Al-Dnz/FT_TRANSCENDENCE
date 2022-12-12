<template>
  <div class="h-full w-full pl-2 pr-2">
    <h1 class="mt-3 font-bold">CHANNEL MEMBERS</h1>
    <div class="overflow-auto">
      <ul>
        <!-- <li v-for="user in currentChan?.userList" :key="user.id">
          <div v-if="!compareUsers(user, currentUser)"
          class="hover:text-black">
            <ChatChannelUserBox :socket="socket" :currentUser="currentUser"
            :currentChan="currentChan" :channelUser="user" />
          </div>
        </li> -->

		<li v-for="userchan in userchannels" :key="userchan.id">
			<div>{{userchan.user.login}} ({{userchan.role}})</div>
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
    // ChatChannelUserBox,
  },
  data() {
    return {
      userchannels: [], //this.currentChan?.userList,
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
	handleChanUsersList(payload: any)
	{
		console.log(payload);
		if (payload.channelId != this.currentChan?.id)
			return;
		this.userchannels = [];
		this.userchannels = payload.userchannels;
	}
  },
  created()
  {
	this.socket?.on('channelUsersToClient', (payload: any) => {
            this.handleChanUsersList(payload)
    })
    this.socket?.emit('getChannelUsers', {id: this.currentChan?.id, password: null});
    
  },
  watch: {
    currentChan: {
        immediate: true, 
        deep: true, 
        handler(newVal, old)
        {
          this.userchannels = [];
          this.socket?.emit('getChannelUsers', {id: this.currentChan?.id, password: null});
        },  
    }
  }
});
</script>



<style src="../../assets/tailwind.css" />