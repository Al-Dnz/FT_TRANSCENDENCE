<template>
  <div class="flex flex-row h-full w-full pt-2 pl-2">
    <img :src="getImgUrl(message_tmp.author.pic)" class="w-12 h-12 rounded-full" />
    <div class="flex flex-col ml-2">
      <div class="flex flex-row">
        <h1 class="font-semibold">{{ message_tmp.author.name }}</h1>
        <UserOptionsMenu :socket="socket" :currentChan="getChannelTmp"
        :currentUser="getUser1" :targetUser="getUser2" class="ml-1" />
      </div>
      <p>{{ message_tmp.text }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserOptionsMenu from "../UserOptionsMenu.vue";

//tmp def and var
interface UserTmpI {
  id: number;
  name: string;
  pic: string;
  blockList: UserTmpI[];
}
interface ChannelTmpI {
  unremovable: boolean;
  id: number;
  createdAt: string;
  name: string;
  type: string;
  owner: UserTmpI;
  adminList: UserTmpI[];
  banList: UserTmpI[];
  muteList: UserTmpI[];
}
interface MessageTmpI {
  id: number;
  createdAt: string;
  updatedAt: string;
  author: UserTmpI;
  text: string;
  channel: ChannelTmpI;
}
interface DataTmpI {
  message_tmp: MessageTmpI
}
let User1: UserTmpI = {
  id: 1,
  name: 'current_user',
  pic: 'Bannedpp.png',
  blockList: [],
}
let User2: UserTmpI = {
  id: 2,
  name: 'message_author',
  pic: 'Accountpp.jpeg',
  blockList: [],
}
let Msg1: MessageTmpI = {
  id: 1,
  createdAt: '',
  updatedAt: '',
  author: User2,
  text: 'This is a random message',
  channel: {
    unremovable: true,
    id: 1,
    createdAt: '',
    name: 'main_chan',
    type: 'public',
    owner: User1,
    adminList: [ User1 ],
    banList: [],
    muteList: []
  }
}

export default defineComponent({
  name: "ChatMessagesList",
  props: {
    socket: Object,
    currentChan: Object,
    // message: Object,
  },
  components: {
    UserOptionsMenu,
  },
  data(): DataTmpI {
    return {
      message_tmp: Msg1, // this should be a property inherited from MessagesList and originated from the back
    };
  },
  methods: {
    getImgUrl: function (img: string) {
      return require('@/assets/' + img);
    },
  },
  computed: {
    getUser1() {
      return (User1);
    },
    getUser2() {
      return (User2);
    },
    getChannelTmp() {
      return (this.message_tmp.channel);
    }
  }
});
</script>



<style src="../../assets/tailwind.css" />