<template>
  <div class="h-full w-full flex flex-row">
    <div class="h-full w-1/5 text-slate-600 bg-gray-100">
      <ChatConvList
        :friends="friends"
        :channels="channels"
        @changeConv="changeConv" />
    </div>
    <div class="h-full w-4/5 bg-gray-50">
      <ChatConv
        :head="currentHead"
        :messages="currentConv" />
    </div>
  </div>
</template>

<script>
import ChatConvList from "../components/ChatConvList.vue";
import ChatConv from "../components/ChatConv.vue";

export default {
  name: "ChatPage",
  methods: {
    changeConv: function (convType, convId) {
      if (convType === 'privConv') {
        this.currentHead = this.privHeadList[convId];
        this.currentConv = this.privConvList[convId];
      }
      else if (convType === 'channel') {
        this.currentHead = this.chanHeadList[convId];
        this.currentConv = this.convList[convId];
      }
		},
  },
  data() {
    let defUser = { name: 'Jean_didier', pic: 'Bannedpp.png' };
    let defUser1 = { name: 'Bob', pic: 'pp.jpeg' };
    let defUser2 = { name: 'Jeff', pic: 'Accountpp.jpeg' };
    let defUser3 = { name: 'Sam', pic: 'madgeleft.jpeg' };
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
  },
  components: {
    ChatConvList,
    ChatConv,
  },
};
</script>

<style src="../assets/tailwind.css" />