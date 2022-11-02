<template>
  <div class="flex flex-col pt-3 pl-4 pr-4 divide-y-2">
    <div class="flex flex-row pb-8">
      <div class="flex flex-col">
        <img :src="getImgUrl(messages[1].pic)" class="w-20 h-20 rounded-full" />
        <h1 class="text-3xl font-bold">{{ messages[1].from }}</h1>
        <p>This is the start of your conversation with {{ messages[1].from }}</p>
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
    <div class="">
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
  </div>
  
</template>

<script>
export default {
  name: "ChatConv",
  methods: {
    getImgUrl: function (img) {
			return require('@/assets/' + img);
		}
  },
  components: {},
  props: {
    messages: Object
  },
};
</script>

<style src="../assets/tailwind.css" />
