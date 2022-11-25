<template>
	<div v-if="obj.friend == true" className="bg-slate-200 flex flex-row justify-between w-full h-full rounded-2xl">
		<div className="pl-4 h-full flex flex-col justify-center">
			<img src="../assets/pp.jpeg" className ="h-5/6 rounded-xl"/>
		</div>
		<div className="w-1/3 flex flex-row justify-between h-full">
			<div className="flex flex-col justify-center w-1/2">
				<span> {{obj.login}} </span>
			</div>
			<div className="flex flex-col justify-center w-1/2">
				<span v-if="obj.status==='online'" className="text-green-500">En ligne</span>
				<span v-else-if="obj.status==='ingame'" className="text-red-400">En game</span>
				<span v-else className="text-slate-500">Disconnected</span>
			</div>
		</div>
		<div className="flex flex-row justify-around w-1/3 text-green-500">
			<ChatBubbleBottomCenterTextIcon @click="msg()"/>
			<EyeIcon @click="watch()"/>
			<TrashIcon @click="del()" />
		</div>
	</div>
	<div v-else className="bg-slate-200 flex flex-row justify-between w-full h-full rounded-2xl">
		<div className="pl-4 h-full flex flex-col justify-center">
			<img src="../assets/pp.jpeg" className ="h-5/6 rounded-xl"/>
		</div>
		<div className="flex flex-col justify-center w-1/3">
			<span> {{obj.login}} </span>
		</div>
		<div className="flex flex-row justify-end w-1/3">
			<CheckIcon @click="accept()" class="text-green-400"/>
			<XMarkIcon @click="del()" class = "text-red-400"/>
		</div>
	</div>
</template>
  
  <script>
  export default {
	name: 'friendBox',
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
		},
		accept() {
			let temp;
			temp = this.obj;
			temp.friend = true;
			this.mod(this.index, temp)
		},
		msg() {
			alert("Start une conv avec: " + this.obj.login);
		},
		watch() {
			if (this.obj.status == 2)
				alert("On va spectate :" + this.obj.login);
			else
				alert("Can't spectate :" + this.obj.login + " because he is not in game");
		}
	},
  }
  </script>
  
  <style src="../assets/tailwind.css" />