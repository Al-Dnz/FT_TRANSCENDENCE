<template>
	<div v-if="(loading == true)">
    	<loadingPage />
  	</div>
	  <div v-else-if="error" className="flex items-center w-full h-full">
		<errorPage :str="error" />
	</div>
	<div v-else className="absolute flex flex-col justify-start items-center w-full h-full overflow-auto">
		<div className="w-3/4 pt-3 h-friendbox">
			<div className="flex flex-row justify-center w-full rounded-2xl h-full text-slate-500 focus-within:text-green-500 ">
				<input type="text" v-model="newfriend" @keyup.enter="add()" name="search" placeholder="Add a friend !" autocomplete="off" aria-label="Add a friend !" className="rounded-2xl px-3 placeholder-slate-500 text-slate-500 focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500 w-1/2"/>
			<PaperAirplaneIcon @click="add()" className="cursor-pointer" />
			</div>
		</div>
		<div v-for="(item, index) in sortedTab()" v-bind:key="index" className="lg:h-friendbox lg:w-3/4 w-11/12 h-16 pt-3">
			<friendBox :obj=item :index="index"/>
		</div>
	</div>
	
  </template>
  
<script lang="ts">
import friendBox from '../components/FriendBox.vue';
import { defineComponent } from 'vue'
import { FriendsApi, UserOutput, Configuration, ResponseError, ErrorOutput } from '@/api';
import { getCredentials } from "@/frontJS/cookies"
import  errorPage  from "@/components/Error.vue";
import  loadingPage  from "@/components/Loading.vue"

interface friendsData 
{
	tab: Array<UserOutput>;
	loading: boolean;
	newfriend: string;
	error: string;
}

export default defineComponent({
	name: 'friendPage',
	data() : friendsData{
		return {
			tab: [],
			loading : true,
			newfriend: '',
			error: ''
		}
	},
	async mounted() {
	  await this.fetchData()
	  this.loading = false;

  	},
	components : {
	friendBox,
	errorPage,
	loadingPage
	},
	methods : {
		sortedTab() : Array<UserOutput>{
		return this.tab.sort((a : UserOutput, b : UserOutput) =>  a.login.localeCompare(b.login)) // Number(a.friend) - Number(b.friend) ||
		},
		async add() {
			getCredentials().then((accessToken: string) => {
				const Fapi = new FriendsApi(new Configuration({accessToken: accessToken}))
				Fapi.createFriendship({login:this.newfriend})
					.then(() => {this.newfriend = ''; window.location.reload();})
					.catch((msg:ResponseError) => { msg.response.json().then((str: ErrorOutput) =>
						this.$toast(str.message, {
              			styles: { backgroundColor: "#FF0000", color: "#FFFFFF" },
            			}));})
					.catch((msg :any) => {console.log(msg)})
			})
		},
		async fetchData()
		{
			this.loading = true;   
			getCredentials().then((accessToken: string ) => {
				const Fapi = new FriendsApi(new Configuration({accessToken: accessToken}))
				Fapi.listUsersFriends().then((user: Array<UserOutput> ) => {
					this.tab = user
				})
				.catch((msg : ResponseError) => { msg.response.json().then((str : ErrorOutput) => {this.error = str.message;});}
				)})
		}
	}
  })
  </script>
  
  <style src="../assets/tailwind.css" />