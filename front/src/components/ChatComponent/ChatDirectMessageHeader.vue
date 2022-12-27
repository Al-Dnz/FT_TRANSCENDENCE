<template>
  <div class="h-full w-full flex flex-col pt-2 pl-4 pr-4">
    <div class="h-16 w-16">
      <img :src="getImgUrl(getOtherUserPic)" class="rounded-full" />
    </div>
    <h1 class="text-3xl font-bold">{{ getOtherUserName }}</h1>
    <p class="mt-3">This is the start of the #{{ getOtherUserName }} channel.</p>
    <div class="w-full flex mt-2 mb-2">
      <button @click="BlockUser(getOtherUserName)"
      class="pl-1 pr-1 rounded-lg border-2 border-slate-600
    hover:text-red-500 hover:border-red-500">Quit channel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface ChannelI {
  unremovable: boolean;
  id: number;
  createdAt: string;
  name: string;
  type: string;
}
interface MessageI {
  id: number;
  createdAt: string;
  updatedAt: string;
  text: string;
  channel: ChannelI;
}

export default defineComponent({
  name: "ChatDirectMessageHeader",
  props: {
    socket: Object,
    currentUser: Object,
    currentChan: Object,
  },
  data() {
    return {
      otherUser: null as any,
      messages: null as any,
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
    getImgUrl(img: string) {
      return require('@/assets/' + img);
    },
    async fetchData() {
      const bearer = {
        method: 'GET',
        headers: {}
      }
      let response = await fetch("http://" + process.env.VUE_APP_IP + ":3004/channel/${this.currentChan?.id}/messages", bearer)
      let data: Response["type"] = await response.json();
      this.messages = [...data];

    },
    goProfile(userName: string) {
      this.$router.push('/user/' + userName);
      alert("going to " + userName + "'s user account");
    },
    gameInvite(userName: string) {
      alert("a game invitation has been sent to " + userName);
    },
    BlockUser(userName: string) {
      // alert(userName + "has been blocked/unblocked");
      this.$emit('quitChan');
    },
    receivedMessage(message: MessageI) {
      if (message.channel.id === this.currentChan?.id) {
        this.messages.push(message);
      }
    },
  },
  computed: {
    getOtherUserName() {
      if (!this.compareUsers(this.currentUser, this.currentChan?.userList[0]))
        return (this.currentChan?.userList[0].name);
      return (this.currentChan?.userList[1].name);
    },
    getOtherUserPic() {
      if (!this.compareUsers(this.currentUser, this.currentChan?.userList[0]))
        return (this.currentChan?.userList[0].pic);
      return (this.currentChan?.userList[1].pic);
    },
    loadMessage() {
      return (this.messages);
    },
  },
  async created() {
    if (this.currentChan) {
      this.fetchData();
      this.socket?.on(`msgToChannel`, (message: MessageI) => {
        this.receivedMessage(message);
      })
    }
  },
  watch: {
    current_chan: function (newVal, oldVal) {
      this.messages = [];
      this.fetchData();
    }
  }
});
</script>



<style src="../../assets/tailwind.css" />
