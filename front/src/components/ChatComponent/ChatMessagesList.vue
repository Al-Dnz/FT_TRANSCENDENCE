<template>
  <div class="h-full w-full overflow-auto pt-3">
    <div v-if="currentChan_tmp">
      <div class="">
        <ul >
          <li v-for="message in messages" :key="message.id">
            <ChatMessageBox :socket="socket" :currentChan="currentChan_tmp"
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
let user1: UserTmpI = {
  id: 1,
  name: 'current_user',
  pic: 'Bannedpp.png',
  blockList: [],
}
let user2: UserTmpI = {
  id: 2,
  name: 'message_author',
  pic: 'Accountpp.jpeg',
  blockList: [],
}
let chan1: ChannelTmpI = {
  unremovable: true,
  id: 1,
  createdAt: '',
  name: 'chan_test',
  type: 'public',
  owner: user1,
  adminList: [ user1, ],
  banList: [],
  muteList: [],
}
let msg1: MessageTmpI = {
  id: 1,
  createdAt: '',
  updatedAt: '',
  author: user2,
  text: 'This is a random message from "message_author"',
  channel: chan1,
}
let msg2: MessageTmpI = {
  id: 1,
  createdAt: '',
  updatedAt: '',
  author: user1,
  text: 'This is the response from you, "current_user"',
  channel: chan1,
}

export default defineComponent({
  name: "ChatMessagesList",
  props: {
    socket: Object,
    currentChan: Object,
  },
  components: {
    ChatMessageBox,
  },
  data() {
    return {
      currentChan_tmp: chan1, // this is temporary
      currentUser: user1,
      messages: [ msg1, msg2, msg1, msg1, msg1, msg1, msg1, msg2, msg1, msg1, msg1, ],
    };
  },
  methods: {

  },
});
</script>



<style src="../../assets/tailwind.css" />
