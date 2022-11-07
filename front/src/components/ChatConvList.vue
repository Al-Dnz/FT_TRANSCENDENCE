<template>
  <div class="ml-2 mr-2 divide-y-2">
    <div class="mt-3 mb-5">
      <div>
        <ul class="list-none">
          <li
            v-for="friend in friends"
            :key="friend.id"
          >
            <div class="pb-2 font-semibold">
              <button @click="goPrivConv(friend.name), $emit('changeConv', 'privConv', friend.id - 1)">
                <div class="flex flex-row">
                  <img :src="getImgUrl(friend.pic)" class="w-8 h-8 rounded-full" />
                  <div class="pl-2">{{ friend.name }}</div>
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
            v-for="channel in channels"
            :key="channel.id"
          >
            <div class="mb-4 font-semibold">
              <button @click="goChan(channel.name), $emit('changeConv', 'channel', channel.id - 1)">
                # {{ channel.name }}
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

<script>
export default {
  name: "ChatConvList",
  methods: {
    getImgUrl: function (img) {
			return require('@/assets/' + img);
		},
    goPrivConv(user)
    {
      this.$router.push('/chat/@' + user);
    },
    goChan(chan)
    {
      this.$router.push('/chat/' + chan);
    },
    newPrivConv()
		{
			alert("we create a new private conversation")
		},
    newChan()
		{
			alert("we create a new channel")
		},
  },
  components: {},
  props: {
    friends: Object,
    channels: Object,
  },
};
</script>

<style src="../assets/tailwind.css" />
