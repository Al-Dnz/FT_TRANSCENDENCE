<template>
	<div v-if="this.$route.name === 'log'" class="GlobalLoggin">
		<router-view name="log" />
	</div>
	<div v-else class="GlobalApp">
		<div className="fixed top-0 left-0 w-1/12 h-full">
			<router-view name="navbar" />
		</div>
		<div className="fixed top-0 right-0 w-11/12 h-headh">
			<router-view name="headbar" />
		</div>
		<div className="fixed bottom-0 right-0 w-11/12 h-content">
			<router-view :key="$route.path"/>
		</div>
	</div>
	<modalReception :ison="isInvite" :isactive=Invite :Accept=Accept :Decline=Decline />
</template>
<script lang="ts">
interface appData
{
	isInvite: boolean;
}
import { defineComponent } from 'vue';
import modalReception from "@/components/modalSend.vue";
export default defineComponent({
  name: 'App',
  created()
  {
	const transAccessCookie = this.$cookies.get("trans_access");
	// const refreshAccessCookie = this.$cookies.get("trans_refresh");
	if (transAccessCookie)
	{
		if (!this.$store.state.globalSocket.connected)
			this.$store.dispatch('setGlobalSocket', transAccessCookie);
		// if (!this.$store.state.chatSocket.connected)
		// 	this.$store.dispatch('setChatSocket', transAccessCookie);
		// if (!this.$store.state.gameSocket.connected)
		// 	this.$store.dispatch('setGameSocket', transAccessCookie);
	}
  },
  components : {
	modalReception
  },
	data(): appData
	{
		return{
			isInvite: false
		}
	},
	methods: {
		Invite()
		{
			this.isInvite = false;
		},
		Invited()
		{
			this.isInvite = true;
		},
		Accept()
		{
			console.log("accepted");
		},
		Decline()
		{
			console.log("Declined");
		}
	}
})
</script>

<style src="./assets/tailwind.css" />
