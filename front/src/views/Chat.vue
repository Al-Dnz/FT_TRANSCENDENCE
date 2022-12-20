<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/6 text-slate-600 bg-gray-100">
      <ChatChannelsList :socket="socket" :currentUser="currentUser"
      :currentChan="currentChan" :channelsList="channelsList" :creatingChan="creatingChan" :creatingDM="creatingDM"
      @selectedChannel="changeCurrentChannel" @showChanForm="showChanCreationForm" @showDMForm="showDMCreationForm" />
    </div>
    <div v-if="(!currentChan && !creatingChan)" class="mt-4 ml-2">
      <p class="text-3xl">NO CHANNEL SELECTED</p>
    </div>
    <div v-else-if="creatingChan" class="h-full w-5/6">
      <ChatNewChannelForm :socket="socket" @cancelForm="showChanCreationForm" />
    </div>
    <div v-else-if="creatingDM" class="h-full w-5/6">
      <ChatNewDirectMessageForm :socket="socket" @cancelForm="showDMCreationForm" />
    </div>
    <div v-else-if="currentChan?.type === 'direct_message'"
    class="h-full w-5/6 bg-gray-50">
      <ChatDirectMessageBox :socket="socket" :currentUser="currentUser"
      :currentChan="currentChan" @receiveNewMsg="addMessage"/>
    </div>
    <div v-else-if="currentChan?.type !== 'direct_message'"
    class="h-full w-5/6 bg-gray-50">
      <ChatChannelBox :socket="socket" :currentUser="currentUser"
      :currentChan="currentChan" @receiveNewMsg="addMessage"/>
    </div>
  </div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import ChatChannelsList from "../components/ChatComponent/ChatChannelsList.vue";
import ChatChannelBox from "../components/ChatComponent/ChatChannelBox.vue";
import ChatDirectMessageBox from "../components/ChatComponent/ChatDirectMessageBox.vue";
import ChatNewChannelForm from "../components/ChatComponent/ChatNewChannelForm.vue";
import ChatNewDirectMessageForm from "../components/ChatComponent/ChatNewDirectMessageForm.vue";
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
interface DataI {
  creatingChan: boolean,
  creatingDM: boolean,
  socket: any,
  currentUser: UserTmpI,
  currentChan: ChannelTmpI,
  channelsList: ChannelTmpI[],
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
  unremovable: true,
  id: 4,
  createdAt: '',
  name: 'other_user_1',
  type: 'direct_message',
  owner: null as any,
  userList: [ user1, user2,],
  adminList: [],
  banList: [],
  muteList: [],
  msgList: [ msg1, msg2, ],
}
let chan4: ChannelTmpI = {
  unremovable: true,
  id: 5,
  createdAt: '',
  name: 'other_user_2',
  type: 'direct_message',
  owner: null as any,
  userList: [ user1, user3,],
  adminList: [],
  banList: [],
  muteList: [],
  msgList: [ msg3, msg1, ],
}
export default defineComponent({
  name: "ChatPage",
  components: {
    ChatChannelsList,
    ChatChannelBox,
    ChatDirectMessageBox,
    ChatNewChannelForm,
    ChatNewDirectMessageForm,
  },
  data(): DataI {
    return {
      creatingChan: false,
      creatingDM: false,
      socket: null as any, // not of any use right now, but kept it around, it is still given as a property to children
      currentUser: user1,
      currentChan: null as any,
      channelsList: [ main_chan, chan1, chan2, chan3, chan4, ],
    };
  },
  methods: {
    changeCurrentChannel(channel: ChannelTmpI) {
      this.currentChan = channel;
    },
    showChanCreationForm() {
      this.creatingChan = !this.creatingChan;
    },
    showDMCreationForm() {
      this.creatingDM = !this.creatingDM;
    },
    addMessage(message: MessageTmpI) {
      this.currentChan.msgList.push(message); // this is temporary, this should be dealt with in ChatMessageInput
    },
  },
  // created() {
  //   this.socket = io(`http://127.0.0.1:3004`); // not of any use right now, but kept it around
  // }
});

</script>



<style src="../assets/tailwind.css" />