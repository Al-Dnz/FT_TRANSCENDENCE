<template>
	<div className="absolute flex flex-col justify-start items-center w-full h-full overflow-auto">
		<div className="w-3/4 pt-3 h-friendbox">
			<div className="flex flex-row justify-center w-full rounded-2xl h-full text-slate-500 focus-within:text-green-500 ">
				<input type="text" v-model="newfriend" @keyup.enter="add()" name="search" placeholder="Add a friend !" autocomplete="off" aria-label="Add a friend !" className="rounded-2xl px-3 placeholder-slate-500 text-slate-500 focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500 w-1/2"/>
				<PaperAirplaneIcon @click="add()" />
			</div>
		</div>
		<div v-for="(item, index) in sortedTab()" v-bind:key="index" className="h-friendbox w-3/4 pt-3">
			<friendBox :obj=item :index="index" :delI="delIndex" :mod="modify"/>
		</div>
	</div>
  </template>
  
  <script>
import friendBox from '../components/FriendBox.vue';
  export default {
	name: 'friendPage',
	created() {
		console.log ("hello");
	},
	beforeUnmount() {
		console.log ("bye");
	},
	data() {
		return(
		{
			newfriend: '',
			tab : [
				{
					username: 'Jean Neymar',
					friend: true,
					status: 1
				},
				{
					username: 'Jean Bombeur',
					friend: true,
					status: 0
				},
				{
					username: 'Jean Peuxplus',
					friend: true,
					status: 2
				},
				{
					username: 'Jean claude',
					friend: false,
					status: 1
				},
				{
					username: 'Jean Alban',
					friend: false,
					status: 1
				},
				{
					username: 'Jean Neymar',
					friend: true,
					status: 1
				},
				{
					username: 'Jean Bombeur',
					friend: true,
					status: 0
				},
				{
					username: 'Jean Peuxplus',
					friend: true,
					status: 2
				},
				{
					username: 'Jean claude',
					friend: false,
					status: 1
				},
				{
					username: 'Jean Alban',
					friend: false,
					status: 1
				},
				{
					username: 'Jean Neymar',
					friend: true,
					status: 1
				},
				{
					username: 'Jean Bombeur',
					friend: true,
					status: 0
				},
				{
					username: 'Jean Peuxplus',
					friend: true,
					status: 2
				},
				{
					username: 'Jean claude',
					friend: false,
					status: 1
				},
				{
					username: 'Jean Alban',
					friend: false,
					status: 1
				},
				{
					username: 'Jean Neymar',
					friend: true,
					status: 1
				},
				{
					username: 'Jean Bombeur',
					friend: true,
					status: 0
				},
				{
					username: 'Jean Peuxplus',
					friend: true,
					status: 2
				},
				{
					username: 'Jean claude',
					friend: false,
					status: 1
				},
				{
					username: 'Jean Alban',
					friend: false,
					status: 1
				}
			]
		})
	},
	components : {
	friendBox
	},
	methods : {
		delIndex(index) {
			this.tab.splice(index, 1);
		},
		sortedTab() {
		return this.tab.sort((a, b) => Number(a.friend) - Number(b.friend) || a.username.localeCompare(b.username))
		},
		modify(index, obj)
		{
			this.tab[index] = obj;
		},
		add() {
			alert(this.newfriend);
			this.newfriend = '';
		}
	}
  }
  </script>
  
  <style src="../assets/tailwind.css" />