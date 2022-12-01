<template>
  <div class="flex flex-row">
    <Bars3Icon  class="h-6 w-6 rounded-full bg-gray-200" @click="toggleMenu" />
    <div><ul v-if="showOptions" class="form-select form-select-sm appearance-none block w-20 absolute
        px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat
        border border-solid border-gray-300 rounded transition ease-in-out m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-sm example">
      <li class="hover:font-semibold cursor-pointer">Profile</li>
      <li class="hover:font-semibold cursor-pointer">Invite</li>
      <li v-if="(canBlock, target_user_tmp)" @click="(blockUser, target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Block</li>
      <li v-else-if="(canUnblock, target_user_tmp)" @click="(unblockUser, target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Unblock</li>
      <li v-if="(canBan, target_user_tmp)" @click="(banUser, target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Ban</li>
      <li v-else-if="(canUnban, target_user_tmp)" @click="(unbanUser, target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Unban</li>
      <li v-if="(canMute, target_user_tmp)" @click="(muteUser, target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Mute</li>
      <li v-else-if="(canUnmute, target_user_tmp)" @click="(unmuteUser, target_user_tmp)"
      class="hover:font-semibold cursor-pointer">Unmute</li>
      <li v-if="(canPromote, target_user_tmp)" @click="(promoteUser, target_user_tmp)"
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
        current_user_tmp: User1, // this should be a property originated from the back
        target_user_tmp: User2, // this should be a property originated from the back
        current_chan_tmp: {
          unremovable: this.current_chan?.unremovable,
          id: this.current_chan?.id,
          createdAt: this.current_chan?.createdAt,
          name: this.current_chan?.name,
          type: this.current_chan?.type,
          owner: User1,
          adminList: [User1],
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
      blockUser(user: UserTmpI) {
        if (!this.isUserBlocked(user))
          this.current_user_tmp.blockList.push(user); // this should update the back
      },
      unblockUser(user: UserTmpI) {
        if (this.isUserBlocked(user))
          this.current_user_tmp.blockList.splice(this.current_user_tmp.blockList.indexOf(user), 1); // this should update the back
      },
      banUser(user: UserTmpI) {
        if (!this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.banList.push(user); // this should update the back
      },
      unbanUser(user: UserTmpI) {
        if (this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.banList.splice(this.current_chan_tmp.banList.indexOf(user), 1); // this should update the back
      },
      muteUser(user: UserTmpI) {
        if (!this.isUserMuted(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.muteList.push(user); // this should update the back
      },
      unmuteUser(user: UserTmpI) {
        if (this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.muteList.splice(this.current_chan_tmp.muteList.indexOf(user), 1); // this should update the back
      },
      promoteUser(user: UserTmpI) {
        if (!this.isUserOwner(user) && !this.isUserAdmin(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          this.current_chan_tmp.adminList.push(user);
      },
    },
    computed: {
      canBlock(user: UserTmpI) {
        return (!this.isUserBlocked(user));
      },
      canUnblock(user: UserTmpI) {
        return (this.isUserBlocked(user));
      },
      canBan(user: UserTmpI) {
        if (!this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          return (true);
        return (false);
      },
      canUnban(user: UserTmpI) {
        if (this.isUserBanned(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          return (true);
        return (false);
      },
      canMute(user: UserTmpI) {
        if (!this.isUserMuted(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          return (true);
        return (false);
      },
      canUnmute(user: UserTmpI) {
        if (this.isUserMuted(user) && this.haveAuthorityOver(this.current_user_tmp, user))
          return (true);
        return (false);
      },
      canPromote(user: UserTmpI) {
        if (this.isUserOwner(this.current_user_tmp) && !(this.isUserOwner(user) || this.isUserAdmin(user)))
          return (true);
        return (false);
      },
    },
});
</script>



<style src="../../assets/tailwind.css" />
