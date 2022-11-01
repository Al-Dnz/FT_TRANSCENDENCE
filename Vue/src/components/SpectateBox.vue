<template>
	<div @click="spec()" className="bg-slate-200 flex flex-row justify-between w-full h-full rounded-2xl cursor-pointer border-2 hover:border-green-500">
		<div className="pl-4 h-full flex flex-col justify-center ">
			<img :src="getImgUrl(obj.p1.pp)" className ="h-5/6 rounded-xl hidden lg:block"/>
		</div>
		<div className="flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5">
			<span className="center-x">{{obj.p1.username}} </span>
			<span className="center-x">Elo: {{obj.p1.elo}} </span>
		</div>
		<div className="flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5">
			<span className="center-x">VS</span>
		</div>	
		<div className="flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5">
			<span className="center-x">{{obj.p2.username}} </span>
			<span className="center-x">Elo: {{obj.p2.elo}} </span>
		</div>
		<div className="pr-4 h-full flex flex-col justify-center ">
			<img :src="getImgUrl(obj.p2.pp)" className ="h-5/6 rounded-xl hidden lg:block"/>
		</div>
	</div>
</template>
  
  <script>
  export default {
	name: 'spectateBox',
	props : {
		obj: Object,
		index: Number
	},
	methods: {
		watch() {
            alert("Watch");
		},
		getImgUrl: function (img) {
			return require('@/assets/' + img);
		},
		spec()
		{
			alert("we go spectate room number " + this.obj.room)
		}
	},
  }
  </script>
  
  <style src="../assets/tailwind.css" />