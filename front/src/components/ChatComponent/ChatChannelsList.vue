
<template>
		<div class="pt-1 pl-2">
			<ul class="list-none">
			<li
				v-for="channel in channels"
				:key="channel.id"
			>
				<div class="pb-2 font-semibold">
				<button @click="backUpChan(channel)" ># {{ channel.name }} </button>
				</div>
			</li>
			</ul>
		</div>
	
</template>

<script>
export default {
  name: "ChatChannelsList",
  methods: {
	async fetchData()
    {
      const bearer =
      {
            method: 'GET',
            headers: {}
      }
	  
      let response = await fetch('http://localhost:3004/channel', bearer)
      let data = await response.json();
      this.channels = [...data];
    },
	receivedChannel(channel)
	{
		this.channels.push(channel);
	},
	backUpChan(channel)
	{
		this.$emit('selectedChannel', channel);
		console.log("all chan =>");
		console.log(this.channels);
		
	},

  },
  emits: ['selectedChannel'],
  components: {},
  data() {
    return {
      channels: null,
    };
  },
  computed:
  {
    loadChannel()
    {
      return (this.channels);
    }
  },
  props: 
  {
	socket: Object,
	current_chan: Object
  },
  async created()
  {
    this.fetchData();
	
    this.socket.on(`chanToClient`, (channel) => 
    {
		console.log("ws new_channel =>");
		console.log(channel);
        this.receivedChannel(channel);
    })
	
  }
};
</script>

<style src="../../assets/tailwind.css" />