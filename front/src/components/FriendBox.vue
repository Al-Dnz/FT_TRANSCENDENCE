<template>
	<div className="bg-slate-200 flex flex-row justify-between w-full h-full rounded-2xl">
		<div className="pl-4 h-full flex flex-col justify-center">
			<img :src="obj?.actualAvatar.path" className ="h-5/6 rounded-xl"/>
		</div>
		<div className="w-1/3 flex flex-row justify-between h-full">
			<div className="flex flex-col justify-center w-1/2">
				<span> {{obj?.login}} </span>
			</div>
			<div className="flex flex-col justify-center w-1/2">
				<span v-if="(obj?.status==='online')" className="text-green-500">En ligne</span>
				<span v-else-if="obj?.status==='in_game'" className="text-red-400">En game</span>
				<span v-else className="text-slate-500">Disconnected</span>
			</div>
		</div>
		<div className="flex flex-row justify-around h-full w-1/3">
			<div className="icon w-1/4 mt-1 mb-1 mx-2">
				<div className="w-1/2">
					<goToAcc :accName=obj?.username />
				</div>
			</div>
			<div className="icon w-1/4 mt-1 mb-1 mx-2">
				<div className="w-1/2">
					<goToChat :accName=obj?.username />
				</div>
			</div>
			<div className="icon w-1/4 mt-1 mb-1 mx-2">
				<div className="w-1/2">
					<goToWatch :accName=obj?.username />
				</div>
			</div>
			<div className="icon w-1/4 mt-1 mb-1 mx-2">
				<div className="w-1/2">
				<TrashIcon @click="del()"/>
			</div>
			</div>
		</div>
	</div>
</template>
  
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import GoToAcc from './GoToAcc.vue';
import GoToChat from './GoToChat.vue';
import GoToWatch from './GoToWatch.vue';
import { FriendsApi, UserOutput, Configuration, ResponseError, ErrorOutput } from '@/api';
import { getCredentials } from "@/frontJS/cookies"
export default defineComponent({
	name: 'friendBox',
	props : {
		obj: {type: Object as PropType<UserOutput>},
		index: Number,
		refresh: {type: Function}
	},
	components : {
		GoToAcc,
		GoToChat,
		GoToWatch
	},
	methods: {
		async del() {
			getCredentials().then((accessToken: string) => {
				const Fapi = new FriendsApi(new Configuration({accessToken: accessToken}))
				Fapi.deleteFriendship({login:this.obj!.login})
					.then(() => {this.obj!.login = ''; this.refresh!()})
					.catch((msg:ResponseError) => { msg.response.json().then((str: ErrorOutput) =>
						this.$toast(str.message, {
              			styles: { backgroundColor: "#FF0000", color: "#FFFFFF" },
            			}));})
					.catch((msg :any) => {console.log(msg)})
			})
		},
	},
})
</script>
  
<style src="../assets/tailwind.css" />