<template>
  <div class="pt-1 pl-2">
    <ul class="list-none">
      <li v-for="channel in channels" :key="channel.id">
        <div class="pb-2 font-semibold">
          <button @click="backUpChan(channel)"># {{ channel.name }} </button>
        </div>
      </li>
    </ul>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";

interface ChannelI {
  id: number;
  name: string;
}

export default defineComponent({
  name: "ChatChannelsList",
  components: {},
  props: {
    socket: Object,
    current_chan: Object
  },
  data() {
    return {
      channels: null as any,
    };
  },
  methods: {
    async fetchData() {
      const bearer = {
        method: 'GET',
        headers: {}
      }
      let response = await fetch('http://localhost:3004/channel', bearer)
      let data: Response["type"] = await response.json();
      this.channels = [...data];
    },
    receivedChannel(channel: ChannelI) {
      this.channels.push(channel);
    },
    backUpChan(channel: ChannelI) {
      this.$emit('selectedChannel', channel);
      console.log("all chan =>");
      console.log(this.channels);

    },
  },
  computed: {
    loadChannel() {
      return (this.channels);
    }
  },
  async created() {
    this.fetchData();
    this.socket?.on(`chanToClient`, (channel: ChannelI) => {
      console.log("ws new_channel =>");
      console.log(channel);
      this.receivedChannel(channel);
    })
  },
  emits: ['selectedChannel']
});
</script>



<style src="../../assets/tailwind.css" />