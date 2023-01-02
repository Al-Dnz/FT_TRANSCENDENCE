<template>
	<div @click="spec()" className="bg-slate-200 flex flex-row justify-between w-full h-full rounded-2xl cursor-pointer border-2 hover:border-green-500">
		<div className="pl-4 h-full flex flex-col justify-center ">
			<img :src="obj?.playerOne.actualAvatar.path" className ="h-5/6 rounded-xl hidden lg:block"/>
		</div>
		<div className="flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5">
			<span className="center-x">{{obj?.playerOne.username}} </span>
			<span className="center-x">Elo: {{obj?.playerOne.stats.level}} </span>
		</div>
		<div className="flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5">
			<span className="center-x">VS</span>
		</div>	
		<div className="flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5">
			<span className="center-x">{{obj?.playerTwo.username}} </span>
			<span className="center-x">Elo: {{obj?.playerTwo.stats.level}} </span>
		</div>
		<div className="pr-4 h-full flex flex-col justify-center ">
			<img :src="obj?.playerTwo.actualAvatar.path" className ="h-5/6 rounded-xl hidden lg:block"/>
		</div>
	</div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue"; 


export default defineComponent({
	name: 'spectateBox',
	props : {
		obj: {type: Object,
			required: true},
		index: {type : Number,
			required: true}
	},
	methods: {
		watch() {
            alert("Watch");
		},
		spec()
		{
			alert("we go spectate room number " + this.obj.room)
		}
	},
  })
</script>
  
  <style src="../assets/tailwind.css" />