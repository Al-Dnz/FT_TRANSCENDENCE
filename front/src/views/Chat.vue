<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/6 text-slate-600 bg-gray-100">
      <ChatChannelsList :socket="socket" :currentUser="currentUser"
      :currentChan="currentChan" :channels="channelList" :creatingChan="creatingChan"
      @selectedChannel="getCurrentChannel" @showForm="showCreationForm" />
    </div>
    <div v-if="!creatingChan" class="h-full w-5/6 flex flex-row bg-gray-50">
      <div class="h-full w-4/5">
        <div class="h-full w-full flex flex-col divide-y-2">
          <div class="h-[22%]">
            <ChatChannelHeader :socket="socket" :currentChan="currentChan" />
          </div>
          <div class="flex flex-col h-[78%] ml-2 mr-2">
            <div class="h-[90%]">
              <ChatMessagesList :socket="socket" :currentUser="currentUser" :currentChan="currentChan" />
            </div>
            <div class="h-[10%] mb-8">
              <ChatMessageInput :socket="socket" :currentChan="currentChan" />
            </div>
          </div>
        </div>
      </div>
      <div class="h-full w-1/5 bg-gray-100">
        <ChatChannelUsersList :socket="socket" :currentUser="currentUser" :currentChan="currentChan" />
      </div>
    </div>
    <div v-else class="h-full w-4/5">
      <ChatNewChannelForm :socket="socket" @cancelForm="showCreationForm" />
    </div>
  </div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import ChatMessagesList from "../components/ChatComponent/ChatMessagesList.vue";
import ChatMessageInput from "../components/ChatComponent/ChatMessageInput.vue";
import ChatChannelsList from "../components/ChatComponent/ChatChannelsList.vue";
import ChatNewChannelForm from "../components/ChatComponent/ChatNewChannelForm.vue";
//import ChatDirectMessageHeader from "../components/ChatComponent/ChatDirectMessageHeader.vue";
import ChatChannelHeader from "../components/ChatComponent/ChatChannelHeader.vue";
import ChatChannelUsersList from "../components/ChatComponent/ChatChannelUsersList.vue";
import { defineComponent } from "vue";

// tmp var
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
  userList: UserTmpI[]
  adminList: UserTmpI[];
  banList: UserTmpI[];
  muteList: UserTmpI[];
  msgList: MessageTmpI[];
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
  name: 'other_user_1',
  pic: 'Accountpp.jpeg',
  blockList: [],
}
let user3: UserTmpI = {
  id: 3,
  name: 'other_user_2',
  pic: 'madgeleft.jpeg',
  blockList: [],
}
let user4: UserTmpI = {
  id: 4,
  name: 'useeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer',
  pic: 'pepethekid.png',
  blockList: [],
}
let msg1: MessageTmpI = {
  id: 1,
  createdAt: '',
  updatedAt: '',
  author: user1,
  text: 'This was written by you, "current_user"',
  channel: null as any,
}
let msg2: MessageTmpI = {
  id: 2,
  createdAt: '',
  updatedAt: '',
  author: user2,
  text: 'This is a random message from "other_user_1"',
  channel: null as any,
}
let msg3: MessageTmpI = {
  id: 3,
  createdAt: '',
  updatedAt: '',
  author: user3,
  text: 'This is a random message from "other_user_2"',
  channel: null as any,
}
let msg4: MessageTmpI = {
  id: 4,
  createdAt: '',
  updatedAt: '',
  author: user1,
  text: 'This is a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong message',
  channel: null as any,
}
let msg5: MessageTmpI = {
  id: 5,
  createdAt: '',
  updatedAt: '',
  author: user4,
  text: 'This user has a long name',
  channel: null as any,
}
let main_chan: ChannelTmpI = {
  unremovable: true,
  id: 1,
  createdAt: '',
  name: 'main_chan',
  type: 'public',
  owner: null as any,
  userList: [ user1, ],
  adminList: [],
  banList: [],
  muteList: [],
  msgList: [ msg1 ],
}
let chan1: ChannelTmpI = {
  unremovable: false,
  id: 2,
  createdAt: '',
  name: 'chan_test_1',
  type: 'public',
  owner: user1,
  userList: [ user1, user2, user3 ],
  adminList: [ user1, ],
  banList: [],
  muteList: [],
  msgList: [ msg1, msg2, msg3, ],
}
let chan2: ChannelTmpI = {
  unremovable: false,
  id: 3,
  createdAt: '',
  name: 'chan_test_2',
  type: 'public',
  owner: user2,
  userList: [ user2, user1, user3, ],
  adminList: [ user2, user1, ],
  banList: [],
  muteList: [],
  msgList: [ msg1, msg2, msg3, msg4, msg5, msg1, msg2, msg3, msg1, msg2, msg3, msg1, msg2, msg3, ],
}
let chan3: ChannelTmpI = {
  unremovable: false,
  id: 4,
  createdAt: '',
  name: 'other_user_1',
  type: 'direct_message',
  owner: null as any,
  userList: [ user1, user2,],
  adminList: [],
  banList: [],
  muteList: [],
  msgList: [ msg1, msg2, msg1, ],
}
export default defineComponent({
  name: "ChatPage",
  components: {
    ChatNewChannelForm,
    ChatChannelsList,
    ChatMessagesList,
    ChatMessageInput,
    //ChatDirectMessageHeader,
    ChatChannelHeader,
    ChatChannelUsersList,
  },
  data() {
    return {
      height: 40,
      socket: null as any,
      currentUser: user1,
      currentChan: chan2,
      channelList: [ main_chan, chan1, chan2, chan3, ],
      creatingChan: false,
    };
  },
  methods: {
    getCurrentChannel(channel: ChannelTmpI) {
      this.currentChan = channel;
    },
    showCreationForm() {
      this.creatingChan = !this.creatingChan;
    }
  },
  computed: {
    loadMainChan(): ChannelTmpI {
      return (this.currentChan);
    }
  },
  created() {
    this.socket = io(`http://127.0.0.1:3004`);
  }
});
</script>



<style src="../assets/tailwind.css" />