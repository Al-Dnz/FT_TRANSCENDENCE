<template>
  <UserOptionsMenu />
  YOYOYOYO
  <ChatMessageBox :currentChan="currentChan" />
  <div class="flex flex-col pt-3 pl-4 pr-4 divide-y-2">
    <div v-if="currentChan">
      <div id="messages" class="card-block">
        <ul>
          <li v-for="message in messages" :key="message.id">
            <div class="flex flex-row pt-8">
              <img :src="getImgUrl('Account.png')" class="w-10 h-10 rounded-full" />
              <div>
                <div class="font-bold">
                  <h2>'Username'</h2>
                </div>
                <div class="messageText">
                  {{ message.text }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>NO CHANNEL SELECTED</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserOptionsMenu from "../UserOptionsMenu.vue";
import ChatMessageBox from "./ChatMessageBox.vue";

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
  name: "ChatMessagesListOld",
  props: {
    socket: Object,
    currentChan: Object
  },
  components: {
    UserOptionsMenu,
    ChatMessageBox,
  },
  data() {
    return {
      messages: null as any,
    };
  },
  methods: {
    getImgUrl: function (img: string) {
      return require('@/assets/' + img);
    },
    async fetchData() {
      const bearer = {
        method: 'GET',
        headers: {}
      }
      let response = await fetch(`http://localhost:3004/channel/${this.currentChan?.id}/messages`, bearer)
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
    receivedMessage(message: MessageI) {
      if (message.channel.id === this.currentChan?.id) {
        // console.log("WS new messages =>");
        // console.log(message);
        this.messages.push(message);
        // var objDiv = document.getElementById("messages");
        // objDiv.scrollTop = objDiv.scrollHeight;
      }

    },
  },
  computed: {
    loadMessage() {
      return (this.messages);
    }
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
