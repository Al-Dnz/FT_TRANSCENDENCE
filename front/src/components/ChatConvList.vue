<template>
  <div class="ml-2 mr-2 divide-y-2">
    <div class="mt-3 mb-5">
      <div>
        <ul class="list-none">
          <li
            v-for="conv in convList"
          >
            <div class="pb-2 font-semibold">
              <button @click="goConv(conv.name), $emit('changeConv', conv)">
                <div class="flex flex-row">
                  <img :src="getImgUrl(conv.pic)" class="w-8 h-8 rounded-full" />
                  <div class="pl-2">{{ conv.name }}</div>
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
            v-for="conv in convList"
          >
            <div class="mb-4 font-semibold">
              <button @click="goConv(conv.name), $emit('changeConv', conv)">
                # {{ conv.name }}
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
/*interface UserI {
  name: string;
  pic: string;
}

interface MsgI {
  from: UserI;
  text: string;
}

interface ConvI {
  name: string;
  pic: string;
  userList?: UserI[];
  msgList?: MsgI[];
}*/
export default {
  name: "chatConvList",
  methods: {
    getImgUrl: function (img: string) {
			return require('@/assets/' + img);
		},
    goConv(convName: string)
    {
      if (convName[0] === '@')
        this.$router.push('/chat/@');
      else
        this.$router.push('/chat/' + convName);

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
    convList: Object
  },
};
</script>

<style src="../assets/tailwind.css" />
