<template>
	<textarea v-model="text" id="textarea" class="form-control"  @keyup.enter="sendMessage" placeholder="Enter message..."></textarea>
	<button id="send" class="btn" @click.prevent="sendMessage">Send</button>

</template>
  
  <script>


  export default 
  {
    name: "ChatMessageInput",
    methods: 
    {
      sendMessage() 
      {
          if(this.validateInput())
          {
              const message = 
              {
                  // sender: this.sender,
                  text: this.text,
                  // channelId: this.current_chan_id
              }
              this.socket.emit('msgToServer', message)
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
      channelId: null,
      };
    },
    props: 
    {
      socket: Object
    },
  };
  </script>
  
  <style src="../../assets/tailwind.css" />
  