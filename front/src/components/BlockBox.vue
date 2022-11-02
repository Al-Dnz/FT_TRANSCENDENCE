<template>
	<div className="bg-slate-200 flex flex-row justify-between w-full h-full rounded-2xl">
		<div className="pl-4 h-full flex flex-col justify-center bg-slate">
			<img src="../assets/pepethekid.png" className ="h-5/6 rounded-xl bg-slate-300"/>
		</div>
		<div className="flex flex-col justify-center w-1/3">
			<span> {{obj.username}} </span>
		</div>
		<div className="flex flex-row justify-end w-1/3">
			<XMarkIcon @click="del()" class = "text-red-400"/>
		</div>
	</div>
</template>
  
  <script>
  export default {
	name: 'BlockBox',
	props : {
		obj: Object,
		index: Number,
		delI: { type: Function },
		mod: { type: Function }
	},
	methods: {
		del(){
			this.delI(this.index);
			//this.$emit("delI", this.index);
		}
	},
  }
  </script>
  
  <style src="../assets/tailwind.css" />