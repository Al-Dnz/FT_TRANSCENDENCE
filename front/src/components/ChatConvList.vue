<template>
  <div class="ml-2 mr-2 divide-y-2">
    <div class="mt-3 mb-5">
      <div>
        <ul class="list-none">
          <li v-for="conv in privConvList" v-bind:key="conv.id">
            <div class="pb-2 font-semibold">
              <button @click="$emit('changeConv', conv, 'privConv')">
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
          <PlusIcon @click="newPrivConv" />
        </div>
      </div>
    </div>
    <div>
      <div class="mt-5 mb-3">
        <ul class="list-none">
          <li v-for="conv in chanConvList" v-bind:key="conv.id">
            <div class="mb-4 font-semibold">
              <button @click="$emit('changeConv', conv, 'chanConv')">
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
          <PlusIcon @click="newChan" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatConvList",
  props: {
    privConvList: Object,
    chanConvList: Object,
  },
  methods: {
    getImgUrl: function (img: string) {
			return require('@/assets/' + img);
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
