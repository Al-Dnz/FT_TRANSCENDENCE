<template>

  <div class="flex flex-col pt-3 pl-4 pr-4 divide-y-2">
    <div class="flex flex-row pb-8">
      <div class="flex flex-col">
        <!-- <img :src="getImgUrl(messages[1].pic)" class="w-20 h-20 rounded-full" /> -->
        <!-- <h1 class="text-3xl font-bold">{{ messages[1].from }}</h1> -->
        <!-- <p>This is the start of your conversation with {{ messages[1].from }}</p> -->
      </div>
      <div>
        <div className="relative flex items-center justify-center 
        w-12 h-12 mt-2 mb-2 mx-auto  
      bg-slate-50 hover:bg-green-600
      text-green-500 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg">
          <UserIcon />
    </div>
      </div>
    </div>

    <div v-if="current_chan">
      <div>CURRENT CHANNEL: {{current_chan.name}}</div>
      <div id="messages" class="card-block">
        <ul>
          <li v-for="message in messages" :key="message.id">
            <div class="flex flex-row pt-8">
              <img v-if="message.sender" v-bind:src="`${message.sender.avatar.path}`" class="w-10 h-10 rounded-full" />
              <div class="pl-2">
                <div v-if="message.sender" class="font-bold">
                  
                
                  {{ message.sender.login }}
                
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



<script >

export default {
  name: "ChatMessagesList",
  methods: {
    getImgUrl: function (img) {
			return require('@/assets/' + img);
		},
    async fetchData()
    {
      const bearer =
      {
            method: 'GET',
            headers: {}
      }
      let response = await fetch(`http://localhost:3004/channel/${this.current_chan.id}/messages`, bearer)
      let data = await response.json();
      this.messages = [...data];

    },
    receivedMessage(message) 
    {
        if (message.channel.id === this.current_chan.id)
        {
            // console.log("WS new messages =>");
            // console.log(message);
            this.messages.push(message);
            // var objDiv = document.getElementById("messages");
            // objDiv.scrollTop = objDiv.scrollHeight;
        }
        
    },
  },
  data() {
    return {
      messages: null,
    };
  },
  props: 
	{
		socket: Object,
    current_chan: Object,
    token: String,
	},
  computed:
  {
    loadMessage()
    {
      return (this.messages);
    }
  },
  watch:
  { 
    current_chan: function(newVal, oldVal) 
    {
      this.messages = [];
      const payload =
      {
        id: this.current_chan.id,
        token: this.token,
        password:  null
      }      
      this.socket.emit('requestAllMessagesFromChan', payload);
    }
  },
  async created()
  {
    if (this.current_chan)
    {
      const payload =
      {
        id: this.current_chan.id,
        token: this.token,
        passowrd: null
      }
      this.socket.emit('requestAllMessagesFromChan', payload);
      this.socket.on(`allChanMessagesToClient`, (messages) => 
      {
          this.messages = [];
          this.messages = messages;
      })
      this.socket.on(`msgToChannel`, (message) => 
      {
          this.receivedMessage(message);
         
      })
    }
  }
};
</script>

<style src="../../assets/tailwind.css" />
