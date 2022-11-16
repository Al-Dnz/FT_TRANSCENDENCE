<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/5 text-slate-600 bg-gray-100">
      <ChatConvList
        :convList="convList"
        @changeConv="changeConv" />
    </div>
    <div class="h-full w-4/5 bg-gray-50">
      <ChatConv
        :conv="currConv" />
    </div>
  </div>
</template>

<script lang="ts">
import ChatConvList from "../components/ChatConvList.vue";
import ChatConv from "../components/ChatConv.vue";
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

interface ChatDataI {
  convList?: ConvI[];
  currConv?: ConvI;
}

//tmp var
let user0: UserI = { name: 'Jean_didier', pic: 'Bannedpp.png' };
let user1: UserI = { name: 'Bob', pic: 'pp.jpeg' };
let user2: UserI = { name: 'Jeff', pic: 'Accountpp.jpeg' };
let user3: UserI = { name: 'Sam', pic: 'madgeleft.jpeg' };
let conv1: ConvI = {
  id: 1,
  name: '@' + user1.name,
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
  name: '@' + user2.name,
  pic: user2.pic,
  userList: [ user0, user2 ],
  msgList: [
    { id: 1, from: user0, text: 'Waza?' },
    { id: 2, from: user2, text: 'WAZAAAAA!!' }
  ]
};
let conv3: ConvI = {
  id: 3,
  name: '@' + user3.name,
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
  name: '#' + 'Work Group',
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
  name: '#' + 'The Boys',
  pic: 'MultipleUsers.png',
  userList: [ user0, user1, user2 ],
  msgList: [
    { id: 1, from: user0, text: 'Bon entre nous, Sam est super relou nan ?' },
    { id: 2, from: user3, text: 'Oui' },
    { id: 3, from: user1, text: 'Carrément' },
  ]
};
export default defineComponent({
  name: "chatPage",
  data(): ChatDataI {
    return {
      convList: [ conv1, conv2, conv3, conv4, conv5 ],
      currConv: conv1
    }
  },
/*    let defUser: UserI = { name: 'Jean_didier', pic: 'Bannedpp.png' };
    let defUser1: UserI = { name: 'Bob', pic: 'pp.jpeg' };
    let defUser2: UserI = { name: 'Jeff', pic: 'Accountpp.jpeg' };
    let defUser3: UserI = { name: 'Sam', pic: 'madgeleft.jpeg' };
    let defChan1 = { name: 'Work Group', pic: 'MultipleUsers.png' };
    let defChan2 = { name: 'The Boys', pic: 'MultipleUsers.png' };

    let defPrivConv1 = [
      { id: 1, from: defUser.name, pic: defUser.pic, text: 'Salut' },
      { id: 2, from: defUser1.name, pic: defUser1.pic, text: 'Bonjour' },
      { id: 3, from: defUser.name, pic: defUser.pic, text: 'Comment vas-tu ?' },
      { id: 4, from: defUser1.name, pic: defUser1.pic, text: 'Bien, et toi ?' },
    ];
    let defPrivConv2 = [
      { id: 1, from: defUser.name, pic: defUser.pic, text: 'Waza?' },
      { id: 2, from: defUser2.name, pic: defUser2.pic, text: 'WAZAAAAA!!' },
    ];
    let defPrivConv3 = [
      { id: 1, from: defUser3.name, pic: defUser3.pic, text: 'Yo !' },
      { id: 2, from: defUser3.name, pic: defUser3.pic, text: 'T\'es là ?' },
      { id: 3, from: defUser3.name, pic: defUser3.pic, text: 'oh jte parle!!' },
      { id: 4, from: defUser3.name, pic: defUser3.pic, text: 'va te faire' },
    ];
    let defConv1 = [
      { id: 1, from: defUser.name, pic: defUser.pic, text: 'Tout le monde est là ?' },
      { id: 2, from: defUser3.name, pic: defUser3.pic, text: 'Yep' },
      { id: 3, from: defUser1.name, pic: defUser1.pic, text: 'Présent !' },
      { id: 4, from: defUser2.name, pic: defUser2.pic, text: 'Chuis là' },
      { id: 5, from: defUser.name, pic: defUser.pic, text: 'Ok parfait, on va pouvoir commencer' },
    ];
    let defConv2 = [
      { id: 1, from: defUser.name, pic: defUser.pic, text: 'Bon entre nous, Sam est super relou nan ?' },
      { id: 2, from: defUser3.name, pic: defUser3.pic, text: 'Oui' },
      { id: 3, from: defUser1.name, pic: defUser1.pic, text: 'Carrément' },
    ];
    return {
      convList: undefined,
      friends: [
        { id: 1, name: 'Bob', pic: 'pp.jpeg' },
        { id: 2, name: 'Jeff', pic: 'Accountpp.jpeg' },
        { id: 3, name: 'Sam', pic: 'madgeleft.jpeg' },
      ],
      channels: [
        { id: 1, name: 'Work Group', pic: 'MultipleUsers.png' },
        { id: 2, name: 'The Boys', pic: 'MultipleUsers.png' },
      ],
      privConvList: [ defPrivConv1, defPrivConv2, defPrivConv3, ],
      convList: [ defConv1, defConv2 ],
      currentConv: defPrivConv1,
      privHeadList: [ defUser1, defUser2, defUser3, ],
      chanHeadList: [ defChan1, defChan2, ],
      currentHead: defUser1,
    };
  },*/
  methods: {
/*    changeConv: function (convType: string, convId: number) {
      if (convType === 'privConv') {
//      this.currentHead = this.privHeadList[convId];
        this.sgHead = this.privHeadList[convId];
        console.log(this.sgHead);
        this.currentConv = this.privConvList[convId];
      }
      else if (convType === 'channel') {
        this.currentHead = this.chanHeadList[convId];
        this.currentConv = this.convList[convId];
      }
		},*/
    changeConv: function(conv: ConvI) {
      this.currConv = conv;
    }
  },
/*  computed: {
    sgHead: {
      get: () => {
        return this.currentHead
      },
      set: function (newHead: userI) {
        this.currentHead = newHead
      },
    }
  },*/
  components: {
    ChatConvList,
    ChatConv,
  },
})
</script>

<style src="../assets/tailwind.css" />