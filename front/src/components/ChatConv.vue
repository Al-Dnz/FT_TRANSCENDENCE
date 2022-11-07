<template>
  <div class="flex flex-col h-full w-full pt-3 pl-4 pr-4 divide-y-2">
    <div class="flex flex-row pb-8">
      <div class="flex flex-col">
        <img :src="getImgUrl(head.pic)" class="w-20 h-20 rounded-full" />
        <h1 class="text-3xl font-bold">{{ head.name }}</h1>
        <p>This is the beginning of your direct message history with @{{ head.name }}</p>
      </div>
      <div class="pt-8 pl-16">
        <div class="relative flex items-center justify-center 
        w-16 h-16 mt-2 mb-2 mx-auto  
        bg-slate-50 border-4 hover:bg-green-600
        text-green-500 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg">
          <UserIcon @click="goProfile(head.name)"/>
        </div>  
      </div>
      <div class="pt-8 pl-10">
        <div class="relative flex items-center justify-center 
        w-16 h-16 mt-2 mb-2 mx-auto  
        bg-slate-50 border-4 hover:bg-green-600
        text-green-500 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg">
          <PlayIcon @click="gameInvite(head.name)"/>
        </div>  
      </div>
    </div>
    <div class="h-full">
      <div class="h-5/6">
        <ul class="list-none">
          <li
            v-for="message in messages"
            :key="message.id"
          >
            <div class="flex flex-row pt-8">
              <img :src="getImgUrl(message.pic)" class="w-10 h-10 rounded-full" />
              <div class="pl-2">
                <div class="font-bold">
                  {{ message.from }}
                </div>
                <div class="">
                  {{ message.text }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="mt-10 pr-20">
        <input type="text" v-model="newMsg" @keyup.enter="send()" name="send" placeholder="New message"
        autocomplete="off" aria-label="New message" className="rounded-2xl px-3 placeholder-slate-500
        text-slate-500 focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500 w-full"/>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: "ChatConv",
  data ()
  {
    return {
      user : 'Jean_didier',
      newMsg : '',
    }
  },
  methods: {
    getImgUrl: function (img) {
			return require('@/assets/' + img);
		},
    goProfile(user)
    {
      this.$router.push('/user/' + user);
      alert("going to " + user + "'s user account");
    },
    gameInvite(user)
    {
      alert("a game invitation has been sent to " + user);
    },
    send()
    {
      if (this.newMsg !== '') {
        this.newMsg = '';
        alert("a new message has been sent");
      }
    },
  },
  components: {},
  props: {
    head: Object,
    messages: Object
  },
};
</script>

<style src="../assets/tailwind.css" />
