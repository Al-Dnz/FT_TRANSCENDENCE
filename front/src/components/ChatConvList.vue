<template>
  <div class="ml-2 mr-2 divide-y-2">
    <div class="mt-3 mb-5">
      <div>
        <ul class="list-none">
          <li
            v-for="conv in privConvList"
            v-bind:key="conv.id"
          >
            <div class="pb-2 font-semibold">
              <button @click="goConv(conv.name)">
                <div class="flex flex-row">
                  <img :src="getImgUrl(conv.pic)" class="w-8 h-8 rounded-full" />
                  <div class="pl-2">@{{ conv.name }}</div>
                </div>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="">
        <div class="w-8 h-8
          bg-slate-50 border-4 hover:bg-green-600
          text-gray-500 hover:text-white
          hover:rounded-xl rounded-3xl
          transition-all duration-300 ease-linear
          cursor-pointer shadow-lg">
            <PlusIcon @click="newPrivConv"/>
        </div>  
      </div>
    </div>
    <div>
      <div class="mt-5 mb-3">
        <ul class="list-none">
          <li
            v-for="conv in chanConvList"
            v-bind:key="conv.id"
          >
            <div class="mb-4 font-semibold">
              <button @click="goConv(conv.name)">
                #{{ conv.name }}
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="">
        <div class="w-8 h-8
          bg-slate-50 border-4 hover:bg-green-600
          text-gray-500 hover:text-white
          hover:rounded-xl rounded-3xl
          transition-all duration-300 ease-linear
          cursor-pointer shadow-lg">
            <PlusIcon @click="newChan"/>
        </div>  
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface ConvI {
  id: number;
  name: string;
  pic: string;
}
interface DataI {
  privConvList: ConvI[];
  chanConvList: ConvI[];
}

//tmp var
let privConv1: ConvI = { id: 1, name: '/chat/Bob', pic: 'pp.jpeg'};
let privConv2: ConvI = { id: 2, name: '/chat/Jeff', pic: 'Accountpp.jpeg'};
let privConv3: ConvI = { id: 3, name: '/chat/Sam', pic: 'madgeleft.jpeg'};
let chanConv1: ConvI = { id: 1, name: '/chan/Work Group', pic: 'MultipleUsers.png'};
let chanConv2: ConvI = { id: 1, name: '/chan/The Boys', pic: 'MultipleUsers.png'};

export default defineComponent({
  name: "ChatConvList",
  data(): DataI {
    return {
      privConvList: [ privConv1, privConv2, privConv3 ],
      chanConvList: [ chanConv1, chanConv2 ],
    }
  },
  methods: {
    getImgUrl: function (img: string) {
			return require('@/assets/' + img);
		},
    goConv(convName: string) {
//    this.$router.push('/chat/' + convName);
      this.$emit('swapConvType', convName);
    },
    newPrivConv() {
			alert("we create a new private conversation")
		},
    newChan() {
			alert("we create a new channel")
		},
  },
});
</script>

<style src="../assets/tailwind.css" />
