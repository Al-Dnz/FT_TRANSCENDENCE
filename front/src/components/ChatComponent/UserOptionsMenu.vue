<template>
  <div class="flex flex-row">
    <Bars3Icon  class="h-6 w-6 rounded-full bg-gray-200" @click="toggleMenu" />
    <div><ul v-if="showOptions" class="form-select form-select-sm appearance-none block w-20 absolute
        px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat
        border border-solid border-gray-300 rounded transition ease-in-out m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-sm example">
      <li class="hover:font-semibold cursor-pointer">Profile</li>
      <li class="hover:font-semibold cursor-pointer">Invite</li>
      <li v-if="canBlock" @click="blockUser(target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Block</li>
      <li v-else-if="canUnblock" @click="unblockUser(target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Unblock</li>
      <li v-if="canBan" @click="banUser(target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Ban</li>
      <li v-else-if="canUnban" @click="unbanUser(target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Unban</li>
      <li v-if="canMute" @click="muteUser(target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Mute</li>
      <li v-else-if="canUnmute" @click="unmuteUser(target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Unmute</li>
      <li v-if="canPromote" @click="promoteUser(target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Promote</li>
    </ul></div>
  </div>
</template>

<script lang="ts">
import { Bars3Icon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

//tmp def and var
interface UserTmpI {
  id: number;
  name: string;
  blockList: UserTmpI[];
}
interface ChannelTmpI {
  unremovable: boolean;
  id: number;
  createdAt: string;
  name: string;
  type: string;
  owner: UserTmpI;
  adminList: UserTmpI[];
  banList: UserTmpI[];
  muteList: UserTmpI[];
}
interface DataTmpI {
  showOptions: boolean;
  canBlock: boolean;
  canUnblock: boolean;
  canBan: boolean;
  canUnban: boolean;
  canMute: boolean;
  canUnmute: boolean;
  canPromote: boolean;
  current_user_tmp: UserTmpI;
  target_user_tmp: UserTmpI;
  current_chan_tmp: ChannelTmpI;
}
let User1: UserTmpI = {
  id: 1,
  name: 'current',
  blockList: [],
}
let User2: UserTmpI = {
  id: 2,
  name: 'target',
  blockList: [],
}

export default defineComponent({
    name: "UserOptionsMenu",
    props: {
      socket: Object,
      current_chan: Object,
      // current_user: Object,
      // target_user: Object,
    },
    data(): DataTmpI {
      return {
        showOptions: false,
        canBlock: true,
        canUnblock: false,
        canBan: true,
        canUnban: false,
        canMute: true,
        canUnmute: false,
        canPromote: true,
        current_user_tmp: User1, // this should be a property originated from the back
        target_user_tmp: User2, // this should be a property originated from the back
        current_chan_tmp: {
          unremovable: this.current_chan?.unremovable,
          id: this.current_chan?.id,
          createdAt: this.current_chan?.createdAt,
          name: this.current_chan?.name,
          type: this.current_chan?.type,
          owner: User2,
          adminList: [],
          banList: [],
          muteList: []
        }, // this should be a property originated from the back
      };
    },
    methods: {
      toggleMenu() {
        this.showOptions = !this.showOptions;
      },
      isUserOwner(user: UserTmpI): boolean {
        return (this.current_chan_tmp.owner === user);
      },
      isUserAdmin(user: UserTmpI): boolean {
        return (this.current_chan_tmp.adminList.includes(user));
      },
      haveAuthorityOver(user: UserTmpI, target: UserTmpI): boolean {
        if (this.isUserOwner(user) || (this.isUserAdmin(user)
            && !(this.isUserOwner(target) || this.isUserAdmin(target))))
          return (true);
        return (false);
      },
      isUserBlocked(user: UserTmpI): boolean {
        return (this.current_user_tmp.blockList.includes(user));
      },
      isUserBanned(user: UserTmpI): boolean {
        return (this.current_chan_tmp.banList.includes(user));
      },
      isUserMuted(user: UserTmpI): boolean {
        return (this.current_chan_tmp.muteList.includes(user));
      },
      setCanBlock(user: UserTmpI) {
        if (!this.isUserBlocked(user))
          this.canBlock = true;
        else
          this.canBlock = false;
      },
      setCanUnblock(user: UserTmpI) {
        if (this.isUserBlocked(user))
          this.canUnblock = true;
        else
          this.canUnblock = false;
      },
      setCanBan(user: UserTmpI) {
        if (!this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.canBan = true;
        else
          this.canBan = false;
      },
      setCanUnban(user: UserTmpI) {
        if (this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.canUnban = true;
        else
          this.canUnban = false;
      },
      setCanMute(user: UserTmpI) {
        if (!this.isUserMuted(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.canMute = true;
        else
          this.canMute = false;
      },
      setCanUnmute(user: UserTmpI) {
        if (this.isUserMuted(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.canUnmute = true;
        else
          this.canUnmute = false;
      },
      setCanPromote(user: UserTmpI) {
        if (this.isUserOwner(this.current_user_tmp) && !(this.isUserOwner(user) || this.isUserAdmin(user)))
          this.canPromote = true;
        else
          this.canPromote = false;
      },
      blockUser(user: UserTmpI) {
        if (!this.isUserBlocked(user))
          this.current_user_tmp.blockList.push(user); // this should update the back
        this.setCanBlock(user);
        this.setCanUnblock(user);
      },
      unblockUser(user: UserTmpI) {
        if (this.isUserBlocked(user))
          this.current_user_tmp.blockList.splice(this.current_user_tmp.blockList.indexOf(user), 1); // this should update the back
        this.setCanUnblock(user);
        this.setCanBlock(user);
      },
      banUser(user: UserTmpI) {
        if (!this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.banList.push(user); // this should update the back
        this.setCanBan(user);
        this.setCanUnban(user);
      },
      unbanUser(user: UserTmpI) {
        if (this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.banList.splice(this.current_chan_tmp.banList.indexOf(user), 1); // this should update the back
        this.setCanUnban(user);
        this.setCanBan(user);
      },
      muteUser(user: UserTmpI) {
        if (!this.isUserMuted(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.muteList.push(user); // this should update the back
        this.setCanMute(user);
        this.setCanUnmute(user);
      },
      unmuteUser(user: UserTmpI) {
        if (this.isUserMuted(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.muteList.splice(this.current_chan_tmp.muteList.indexOf(user), 1); // this should update the back
        this.setCanUnmute(user);
        this.setCanMute(user);  
      },
      promoteUser(user: UserTmpI) {
        if (!this.isUserOwner(user) && !this.isUserAdmin(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.adminList.push(user); // this should update the back
        this.setCanPromote(user);  
      },
    },
    onMounted: {
      canBlockInit(user: UserTmpI) {
        console.log('Block'); //
        this.setCanBlock(user);
        return (0);
      },
      canUnblockInit(user: UserTmpI) {
        console.log('Unblock'); //
        this.setCanUnblock(user);
        return (0);
      },
      canBanInit(user: UserTmpI) {
        console.log('Ban'); //
        this.setCanBan(user);
        return (0);
      },
      canUnbanInit(user: UserTmpI) {
        console.log('Unban'); //
        this.setCanUnban(user);
        return (0);
      },
      canMuteInit(user: UserTmpI) {
        this.setCanMute(user);
        return (0);
      },
      canUnmuteInit(user: UserTmpI) {
        this.setCanUnmute(user);
        return (0);
      },
      canPromoteInit(user: UserTmpI) {
        this.setCanPromote(user);
        return (0);
      },
    },
});
</script>



<style src="../../assets/tailwind.css" />
