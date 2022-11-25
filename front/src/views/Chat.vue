<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/5 text-slate-600 bg-gray-100">
      <!-- <ChatConvList
        :friends="friends"
        :channels="channels"
        @changeConv="changeConv" /> -->
      
      <ChatChannelInput :socket="socket" :current_chan="current_chan"/>
      <ChatChannelsList :socket="socket" @selectedChannel="getCurrentChannel" />
    </div>
    <div class="h-full w-4/5 bg-gray-50">
      <!-- <ChatConv :messages="currentConv" /> -->
      
      <ChatMessagesList :socket="socket" :current_chan="current_chan"/>
      <ChatMessageInput :socket="socket" :current_chan="current_chan"/>
    </div>
  </div>
</template>

<script>
import ChatConvList from "../components/ChatConvList.vue";
// import ChatConv from "../components/ChatConv.vue";


import io from 'socket.io-client';
import ChatMessagesList from "../components/ChatComponent/ChatMessagesList.vue";
import ChatMessageInput from "../components/ChatComponent/ChatMessageInput.vue";
import ChatChannelsList from "../components/ChatComponent/ChatChannelsList.vue";
import ChatChannelInput from "../components/ChatComponent/ChatChannelInput.vue";
 
export default {
  name: "ChatPage",
  methods: {
    changeConv: function (convId) {
			this.currentConv = this.convList[convId]
		},

    getCurrentChannel(channel) {
      this.current_chan = channel;
    },
  },
  data() {
    let defMsg1 = [
      { id: 1, from: 'You', pic: 'Bannedpp.png', text: 'Salut' },
      { id: 2, from: 'Bob', pic: 'pp.jpeg', text: 'Bonjour' },
      { id: 3, from: 'You', pic: 'Bannedpp.png', text: 'Comment vas-tu ?' },
      { id: 4, from: 'Bob', pic: 'pp.jpeg', text: 'Bien, et toi ?' },
    ];
    let defMsg2 = [
      { id: 1, from: 'You', pic: 'Bannedpp.png', text: 'Waza?' },
      { id: 2, from: 'Jeff', pic: 'Accountpp.jpeg', text: 'WAZAAAAA!!' },
    ];
    let defMsg3 = [
      { id: 1, from: 'Sam', pic: 'madgeleft.jpeg', text: 'Yo !' },
      { id: 2, from: 'Sam', pic: 'madgeleft.jpeg', text: 'T\'es la ?' },
      { id: 3, from: 'Sam', pic: 'madgeleft.jpeg', text: 'oh jte parle!!' },
      { id: 4, from: 'Sam', pic: 'madgeleft.jpeg', text: 'va te faire' },
    ];
    return {
      friends: [
        { id: 1, name: 'Bob', pic: 'pp.jpeg' },
        { id: 2, name: 'Jeff', pic: 'Accountpp.jpeg' },
        { id: 3, name: 'Sam', pic: 'madgeleft.jpeg' },
      ],
      channels: [
        { id: 1, name: 'channel1' },
        { id: 2, name: 'channel2' },
        { id: 3, name: 'channel3' },
      ],
      convList: [ defMsg1, defMsg2, defMsg3 ],
      currentConv: defMsg1,

      socket: null,
      current_chan: {
        id: 1,
        name: "main_chan"
      },
    };
  },
  computed:
  {
    loadMainChan()
    {
      return (this.current_chan);
    }
  },
  components: {
    // ChatConvList,
    // ChatConv,
    ChatChannelInput,
    ChatChannelsList,
    ChatMessagesList,
    ChatMessageInput,
  },
  created()
  {
    this.socket = io(`http://127.0.0.1:3004`);
  }
};
</script>

<style src="../assets/tailwind.css" />