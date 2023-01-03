<template>
  <div @mouseleave="hideMenu" class="flex flex-row cursor-pointer">
    <Bars3Icon class="h-6 w-6 rounded-full" @click="toggleMenu" />
    <div>
      <ul v-if="showOptions" class="form-select form-select-sm appearance-none block w-20 absolute
        px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat
        border border-solid border-gray-300 rounded transition ease-in-out m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        aria-label=".form-select-sm example">
        <li @click="goProfile" class="hover:font-semibold cursor-pointer">Profile</li>
        <li @click="gameInvite" class="hover:font-semibold cursor-pointer">Invite</li>
        <li v-if="canMute" @click="muteUser()" class="hover:font-semibold cursor-pointer">Mute</li>
        <li v-if="canUnmute" @click="unmuteUser()" class="hover:font-semibold cursor-pointer">Unmute</li>

        <li v-if="canBlock" @click="blockUser()" class="hover:font-semibold cursor-pointer">Block</li>
        <li v-else-if="canUnblock" @click="unblockUser()" class="hover:font-semibold cursor-pointer">Unblock</li>
        <li v-if="canBan" @click="banUser()" class="hover:font-semibold cursor-pointer">Ban</li>
        <li v-else-if="canUnban" @click="unbanUser()" class="hover:font-semibold cursor-pointer">Unban</li>
        <!-- <li v-if="canMute" @click="muteUser()" class="hover:font-semibold cursor-pointer">Mute</li> -->
        <!-- <li v-else-if="canUnmute" @click="unmuteUser()" class="hover:font-semibold cursor-pointer">Unmute</li> -->
        <li v-if="canPromote" @click="promoteUser()" class="hover:font-semibold cursor-pointer">Promote</li>
      </ul>
    </div>
  </div>
  <modalSend :ison="isInvite" :isactive=Invite />
</template>

<script lang="ts">
import { Bars3Icon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";
import modalSend from "@/components/modalSend.vue";
import { decodePayload } from "engine.io-parser";

interface DataI {
  showOptions: boolean;
  canBlock: boolean;
  canUnblock: boolean;
  canBan: boolean;
  canUnban: boolean;
  canMute: boolean;
  canUnmute: boolean;
  canPromote: boolean;
  isInvite: boolean;
}

export default defineComponent({
  name: "UserOptionsMenu",
  props: {
    socket: Object,
    currentChan: Object,
    currentUser: Object,
    targetUser: Object,
    userChannel: Object,
  },
  data(): DataI {
    return {
      showOptions: false,
      canBlock: false,
      canUnblock: false,
      canBan: false,
      canUnban: false,
      canMute: false,
      canUnmute: false,
      canPromote: false,
      isInvite: false
    };
  },
  components : {
    modalSend
  },
  methods: {
    Invite()
    {
      this.isInvite = false
    },
    toggleMenu() {
      this.showOptions = !this.showOptions;
      this.$emit('toggleOptMenu');
    },
    hideMenu() {
      this.showOptions = false;
      this.$emit('hideMenu');
    },
    goProfile() {
      alert("going to " + this.targetUser?.name + "'s profile"); // placeholder
    },
    gameInvite() {
      // this.isInvite = true;
      const payload = 
      {
        login: this.targetUser?.login,
        gameCode: 'xxxxxxxrandom_uuidxxxxxxx'
      }
      this.$store.state.globalSocket.emit('emitInvitation', payload);
    },
    compareArrays(arr1: any[], arr2: any[]): boolean {
      let i = arr1?.length;
      if (i !== arr2?.length)
        return (false);
      while (i) {
        if (arr1[i] !== arr2[i])
          return (false);
        --i;
      }
      return (true);
    },
    compareUsers(user1: any, user2: any): boolean {
      if (user1?.length !== user2?.length || user1?.id !== user2?.id
        || user1?.login !== user2?.login)
        return (false);
      return (true);
    },
    isUserOwner(): boolean {
      return (this.compareUsers(this.currentChan?.creator, this.currentUser));
    },
    isUserAdmin(): boolean {
      return (this.currentChan?.adminList?.includes(this.currentUser));
    },
    isTargetOwner(): boolean {
      return (this.compareUsers(this.currentChan?.creator, this.targetUser));
    },
    isTargetAdmin(): boolean {
      return (this.currentChan?.adminList?.includes(this.targetUser));
    },
    haveAuthorityOver(): boolean {
      if (this.isUserOwner() || (this.isUserAdmin()
        && !(this.isTargetOwner() || this.isTargetAdmin())))
        return (true);
      return (false);
    },
    isUserBlocked(): boolean {
      return (this.currentUser?.blockList?.includes(this.targetUser));
    },
    isUserBanned(): boolean {
      return (this.currentChan?.banList?.includes(this.targetUser));
    },
    isUserMuted(): boolean {
      return (this.currentChan?.muteList?.includes(this.targetUser));
    },
    setCanBlock() {
      if (!this.isUserBlocked())
        this.canBlock = true;
      else
        this.canBlock = false;
    },
    setCanUnblock() {
      if (this.isUserBlocked())
        this.canUnblock = true;
      else
        this.canUnblock = false;
    },
    setCanBan() {
      if (!this.isUserBanned() && this.haveAuthorityOver())
        this.canBan = true;
      else
        this.canBan = false;
    },
    setCanUnban() {
      if (this.isUserBanned() && this.haveAuthorityOver())
        this.canUnban = true;
      else
        this.canUnban = false;
    },
    setCanMute() {

        this.canMute = !this.userChannel?.muted;

      // if (!this.isUserMuted() && this.haveAuthorityOver())
      //   this.canMute = true;
      // else
      //   this.canMute = false;
    },
    setCanUnmute() {
        this.canUnmute = this.userChannel?.muted;
    
      // if (this.isUserMuted() && this.haveAuthorityOver())
      //   this.canUnmute = true;
      // else
      //   this.canUnmute = false;
    },
    setCanPromote() {

      // this.canPromote = this.userChannel?.role == 'owner' || this.userChannel?.role == 'admin';
      if (this.isUserOwner() && !(this.isTargetOwner() || this.isTargetAdmin()))
        this.canPromote = true;
      else
        this.canPromote = false;
    },
    setAll() {
      this.setCanBlock();
      this.setCanUnblock();
      this.setCanBan();
      this.setCanUnban();
      this.setCanMute();
      this.setCanUnmute();
      this.setCanPromote();
    },
    blockUser() {
      if (!this.isUserBlocked())
        alert('user has been blocked'); // here, targetUser should be added to currentUser's blockList
      this.setCanBlock();
      this.setCanUnblock();
    },
    unblockUser() {
      if (this.isUserBlocked())
        alert('user has been unblocked'); // here, targetUser should be removed from currentUser's blockList
      this.setCanUnblock();
      this.setCanBlock();
    },
    banUser() {
      if (!this.isUserBanned() && this.haveAuthorityOver())
        alert('user has been banned');  // here, targetUser should be added to currentChan's banList
      this.setCanBan();
      this.setCanUnban();
    },
    unbanUser() {
      if (this.isUserBanned() && this.haveAuthorityOver())
        alert('user has been unbanned');  // here, targetUser should be removed from currentChan's banList
      this.setCanUnban();
      this.setCanBan();
    },
    muteUser() {

      console.log("mute user =>" + this.targetUser?.login);

      const payload =
      {
        userLogin: this.targetUser?.login,
        channelId: this.currentChan?.id,
        muted: true
      }
      this.socket?.emit('muteUser', payload);


      // if (!this.isUserMuted() && this.haveAuthorityOver())
      //   alert('user has been muted'); // here, targetUser should be added to currentChan's muteList
      // this.setCanMute();
      // this.setCanUnmute();
    },
    unmuteUser() {

      console.log("unmute user =>" + this.targetUser?.login);

      const payload =
      {
        userLogin: this.targetUser?.login,
        channelId: this.currentChan?.id,
        muted: false
      }
      this.socket?.emit('muteUser', payload);

      // if (this.isUserMuted() && this.haveAuthorityOver())
      //   alert('user has been unmuted'); // here, targetUser should be removed from currentChan's muteList
      // this.setCanUnmute();
      // this.setCanMute();  
    },
    promoteUser() {
      if (!this.isTargetOwner() && !this.isTargetAdmin() && this.haveAuthorityOver())
        alert('user has been promoted');  // here, targetUser should be added to currentChan's adminList
      this.setCanPromote();
    },
  },
  mounted() {
    this.setAll();
  },
  updated() {
    this.setAll();
  },
});
</script>





<style src="../assets/tailwind.css" />