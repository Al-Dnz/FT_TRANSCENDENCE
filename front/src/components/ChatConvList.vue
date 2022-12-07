<template>
  YO
  <div class="pt-3 pl-2">
    <ul class="list-none">
      <li
        v-for="friend in friends"
        :key="friend.id"
      >
        <div class="pb-2 font-semibold">
          <button @clickb="goPrivateRoom(friend.name), $emit('changeConv', friend.id - 1)">
            <div class="flex flex-row">
              <img :src="getImgUrl(friend.pic)" class="w-8 h-8 rounded-full" />
              <div class="pl-2">{{ friend.name }}</div>
            </div>
          </button>
        </div>
      </li>
    </ul>
  </div>
  <div class="pt-1 pl-2">
    <ul class="list-none">
      <li
        v-for="channel in channels"
        :key="channel.id"
      >
        <div class="pb-2 font-semibold">
          <button># {{ channel.name }}</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
//do it all again
export default {
  name: "ChatConvList",
  methods: {
    getImgUrl: function (img) {
			return require('@/assets/' + img);
		},
    goPrivateRoom(user)
    {
      this.$router.push('/chat/@' + user);
    }
  },
  emits: ['changeConv'],
  components: {},
  props: {
    friends: Object,
    channels: Object,
  },
};
</script>

<style src="../assets/tailwind.css" />
