<template>
	<div :class=" obj.results === 'W' ? 'bg-green-400' : 'bg-red-400'" class="flex flex-row justify-between w-full h-full rounded-2xl" >
		<div className="pl-4 h-full flex flex-col justify-center ">
			<img :src="getImgUrl(obj.pp1)" className ="h-5/6 rounded-xl hidden lg:block"/>
		</div>
		<div className="flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5">
			<span className="center-x">{{obj.p1}} </span>
		</div>
		<div className='flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5'>
			<span className="center-x">{{obj.pts1}}	{{obj.results}}	{{obj.pts2}}</span>
		</div>	
		<div className="flex flex-col justify-center overflow-hidden w-1/3 lg:w-1/5">
			<span className="center-x">{{obj.p2}} </span>
		</div>
		<div className="pr-4 h-full flex flex-col justify-center ">
			<img :src="getImgUrl(obj.pp2)" className ="h-5/6 rounded-xl hidden lg:block"/>
		</div>
	</div>
</template>
  
  <script>
  export default {
	name: 'historyBox',
	props : {
		obj: Object,
		index: Number
	},
	methods: {
		getImgUrl: function (img) {
			return require('@/assets/' + img);
		}
	},
  }
  </script>
  
  <style src="../assets/tailwind.css" />