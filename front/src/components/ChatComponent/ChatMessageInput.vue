<template>

  <div v-if="current_chan">
    <textarea v-model="text" id="textarea" class="form-control"  @keyup.enter="sendMessage" placeholder="Enter message..."></textarea>
    <button id="send" class="btn" @click.prevent="sendMessage">Send</button>
  </div>

</template>
  
  <script>


  export default {
    name: "ChatMessageInput",
    methods: 
    {
      sendMessage() 
      {
          if(this.validateInput() && this.current_chan)
          {
              const message = 
              {
                  // sender: this.sender,
                  text: this.text,
                  channelId: this.current_chan.id
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
    props: {
      socket: Object,
      current_chan: Object
    },
  };
  </script>
  
  <style src="../../assets/tailwind.css" />
  