<template>
  <div class="h-full w-full flex flex-col pt-3 pl-4 pr-4 divide-y-2">
    <div class="h-full w-full flex flex-col">
      <!-- <img :src="getImgUrl('MultipleUsers')" class="w-20 h-20 rounded-full" /> -->
      <h1 class="text-3xl font-bold">{{ current_chan?.name }}</h1>
      <p class="mt-4">This is the start of the #{{ current_chan?.name }} channel.</p>
      <div class="w-full flex justify-end mt-2">
        <button class="rounded-lg border-2 border-slate-600
      hover:text-red-500 hover:border-red-500">Quit channel</button>
      </div>
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
  name: "ChatChannelHeader",
  props: {
    socket: Object,
    current_chan: Object
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
      let response = await fetch(`http://localhost:3004/channel/${this.current_chan?.id}/messages`, bearer)
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
      if (message.channel.id === this.current_chan?.id) {
        this.messages.push(message);
      }
    },
  },
  computed: {
    loadMessage() {
      return (this.messages);
    }
  },
  async created() {
    if (this.current_chan) {
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
