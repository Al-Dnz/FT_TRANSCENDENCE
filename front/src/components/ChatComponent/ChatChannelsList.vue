
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
	},

  },
  emits: ['selectedChannel'],
  components: {},
  data() {
    return {
      channels: null,
      // token: this.$cookies.get("trans_access")
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
    current_chan: Object,
    token: String,
  },
  async created()
  {
    // this.fetchData();
    // console.log("COOKIE FOM CHAN");
    // console.log(this.token);

    const payload =
    {
      token: this.token,
      id: 1,//this.current_chan.id,
      password: null,

    }
    this.socket.emit('requestAllChannels');
    this.socket.on(`allChansToClient`, (channels) => 
    {
      this.channels = channels;
    });
    this.socket.on(`chanToClient`, (channel) => 
    {
        this.receivedChannel(channel);
    })
	
  }
};
</script>

<style src="../../assets/tailwind.css" />