<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/5 text-slate-600 bg-gray-100">
      <ChatConvList
      :privConvList="privConvList" :chanConvList="chanConvList"
      @changeConv="changeConv" />
    </div>
    <div class="h-full w-4/5 bg-gray-50">
      <component :is="activeConvType " :conv="currConv" />
    </div>
  </div>
</template>

<script lang="ts">
import ChatConvList from "../components/ChatConvList.vue";
import PrivConv from "../components/PrivConv.vue";
import ChanConv from "../components/ChanConv.vue";
import { defineComponent } from "vue";

interface UserI {
  name: string;
  pic: string;
}

interface MsgI {
  id: number;
  from: UserI;
  text: string;
}

interface ConvI {
  id: number;
  name: string;
  pic: string;
  userList?: UserI[];
  msgList?: MsgI[];
}

interface DataI {
  privConvList?: ConvI[];
  chanConvList?: ConvI[];
  currConv?: ConvI;
  activeConvType: string;
}

//tmp var
let user0: UserI = { name: 'Jean_didier', pic: 'Bannedpp.png' };
let user1: UserI = { name: 'Bob', pic: 'pp.jpeg' };
let user2: UserI = { name: 'Jeff', pic: 'Accountpp.jpeg' };
let user3: UserI = { name: 'Sam', pic: 'madgeleft.jpeg' };
let conv1: ConvI = {
  id: 1,
  name: user1.name,
  pic: user1.pic,
  userList: [ user0, user1 ],
  msgList: [
    { id: 1, from: user0, text: 'Salut' },
    { id: 2, from: user1, text: 'Bonjour' },
    { id: 3, from: user0, text: 'Comment vas-tu ?' },
    { id: 4, from: user1, text: 'Bien, et toi ?' }
  ]
};
let conv2: ConvI = {
  id: 2,
  name: user2.name,
  pic: user2.pic,
  userList: [ user0, user2 ],
  msgList: [
    { id: 1, from: user0, text: 'Waza?' },
    { id: 2, from: user2, text: 'WAZAAAAA!!' }
  ]
};
let conv3: ConvI = {
  id: 3,
  name: user3.name,
  pic: user3.pic,
  userList: [ user0, user3 ],
  msgList: [
    { id: 1, from: user3, text: 'Yo !' },
    { id: 2, from: user3, text: 'T\'es là ?' },
    { id: 3, from: user3, text: 'oh jte parle!!' },
    { id: 4, from: user3, text: 'va te faire' }
  ]
};
let conv4: ConvI = {
  id: 4,
  name: 'Work Group',
  pic: 'MultipleUsers.png',
  userList: [ user0, user1, user2, user3 ],
  msgList: [
    { id: 1, from: user0, text: 'Tout le monde est là ?' },
    { id: 2, from: user3, text: 'Yep' },
    { id: 3, from: user1, text: 'Présent !' },
    { id: 4, from: user2, text: 'Chuis là' },
    { id: 5, from: user2, text: 'Ok parfait, on va pouvoir commencer' }
  ]
};
let conv5: ConvI = {
  id: 5,
  name: 'The Boys',
  pic: 'MultipleUsers.png',
  userList: [ user0, user1, user2 ],
  msgList: [
    { id: 1, from: user0, text: 'Bon entre nous, Sam est super relou nan ?' },
    { id: 2, from: user3, text: 'Oui' },
    { id: 3, from: user1, text: 'Carrément' },
  ]
};
export default defineComponent({
  name: "ChatPage",
  components: {
    ChatConvList,
    PrivConv,
    ChanConv,
  },
  data(): DataI {
    return {
      privConvList: [ conv1, conv2, conv3 ],
      chanConvList: [ conv4, conv5 ],
      currConv: conv1,
      activeConvType: 'PrivConv',
    }
  },
  methods: {
    changeConv: function(conv: ConvI, convType: string) {
      if (convType === 'privConv')
        this.$router.push('/chat/' + conv.name);
      else
        this.$router.push('/chan/' + conv.name);
      this.currConv = conv;
    }
  },
  mounted() {
    if (this.$route.name === 'chat') {
      this.activeConvType = 'PrivConv';
      const found = this.privConvList?.find(element => element.name === this.$route.params.id);
      if (found)
        this.currConv = found;
    }
    else {
      this.activeConvType = 'ChanConv'
      const found = this.chanConvList?.find(element => element.name === this.$route.params.id);
      if (found)
        this.currConv = found;
    }
  }
})
</script>

<style src="../assets/tailwind.css" />