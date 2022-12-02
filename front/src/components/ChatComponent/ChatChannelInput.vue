<template>
	<textarea v-model="text" id="textarea" class="form-control"  @keyup.enter="createChannel" placeholder="New Channel"></textarea>
	<!-- <button id="send" class="btn" @click.prevent="createChannel"></button> -->
</template>
  
  <script>

  export default {
    name: "ChatChannelInput",
    methods: {
      createChannel() 
      {
          if(this.validateInput())
          {
              const channel = 
              {
                  // sender: this.sender,
                  name: this.text,
              }
              this.socket.emit('chanToServer', channel)
              this.text = '';
          }
      },
      validateInput() 
      {
          return this.text.length > 0
      },
    },
    data() {
      return {
          sender: "",
          text: "",
      };
    },
    props: 
    {
      socket: Object,
      current_chan: Object,
      token: String,
    },
  };

  </script>
  
  <style src="../../assets/tailwind.css" />
  