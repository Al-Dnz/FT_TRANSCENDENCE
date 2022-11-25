<template>
  <div class="flex flex-col h-full w-full pt-3 pl-4 pr-4 divide-y-2">
    <!-- Header -->
    <div class="flex flex-row pb-8">
      <div class="flex flex-col">
        <img :src="getImgUrl(conv?.pic)" class="w-20 h-20 rounded-full" />
        <h1 class="text-3xl font-bold">{{ conv?.name }}</h1>
        <p>This is the beginning of your direct message history with {{ conv?.name }}</p>
      </div>
      <div class="pt-8 pl-16">
        <div class="relative flex items-center justify-center 
        w-16 h-16 mt-2 mb-2 mx-auto  
        bg-slate-50 border-4 hover:bg-green-600
        text-green-500 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg">
          <UserIcon @click="goProfile(conv?.name)" />
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
          <PlayIcon @click="gameInvite(conv?.name)" />
        </div>
      </div>
    </div>
    <div class="h-full">
      <!-- Messages -->
      <div class="h-5/6">
        <ul class="list-none">
          <li v-for="message in conv?.msgList" v-bind:key="message.id">
            <div class="flex flex-row pt-8">
              <img :src="getImgUrl(message.from.pic)" class="w-10 h-10 rounded-full" />
              <div class="pl-2">
                <div class="font-bold">
                  {{ message.from.name }}
                </div>
                <div class="">
                  {{ message.text }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- Input Bar -->
      <div class="mt-10 pr-20">
        <input type="text" v-model="newMsg" @keyup.enter="send()" name="send" placeholder="New message"
          autocomplete="off" aria-label="New message" className="rounded-2xl px-3 placeholder-slate-500
       text-slate-500 focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500 w-full" />
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PrivConv",
  props: {
    conv: Object
  },
  data() {
    return {
      newMsg: ''
    }
  },
  methods: {
    getImgUrl: function (img: string) {
      return require('@/assets/' + img);
    },
    goProfile(userName: string) {
      this.$router.push('/user/' + userName);
      alert("going to " + userName + "'s user account");
    },
    gameInvite(userName: string) {
      alert("a game invitation has been sent to " + userName);
    },
    send() {
      if (this.newMsg !== '') {
        this.newMsg = '';
        alert("a new message has been sent");
      }
    },
  },
});
</script>
  
<style src="../assets/tailwind.css" />