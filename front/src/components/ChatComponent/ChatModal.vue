<template>

<Teleport to=".MainDiv">
<div className="fixed bottom-0 w-11/12 h-content bg-black bg-opacity-20">
<div className="flex justify-center pt-24">
    <div className =" flex flex-col items-center bg-slate-100  shadow-xl lg:w-1/2 w-full pt-2 pl-16 pr-16 pb-8 rounded-xl">
    <div class="h-12 w-12 bg-inherit text-slate-500 hover:text-red-500 cursor-pointer ml-auto mr-2">
      <XCircleIcon @click="desactivate()" classname=""/>
    </div>
        <span className = "pb-4 pt-8" >Vous souhaitez ban {{target?.login}} pour : </span>
        <img src="@/assets/pepe-the-frog-ban.gif" className="object-scale-down lg:h-56 lg:w-56 h-20 w-20"/>
        <div className = "flex flex-row justify-around items-end">
            <button @click="activate(10)" className = "transition ease-in-out delay-100 text-white hover:scale-110 h-16 w-16 lg:h-20 lg:w-20 m-2 rounded-xl bg-green-600">1 sec</button>
            <button @click="activate(15)" className = "transition ease-in-out delay-100 text-white hover:scale-110 h-16 w-16 lg:h-20 lg:w-20 m-2 rounded-xl bg-green-600">1 min</button>
            <button @click="activate(20)" className = "transition ease-in-out delay-100 text-white hover:scale-110 h-16 w-16 lg:h-20 lg:w-20 m-2 rounded-xl bg-green-600">10 min</button>
            <button @click="activate(25)" className = "transition ease-in-out delay-100 text-white hover:scale-110 h-16 w-16 lg:h-20 lg:w-20 m-2 rounded-xl bg-green-600">1 H</button>
            <button @click="activate(50)" className = "transition ease-in-out delay-100 text-white hover:scale-110 h-16 w-16 lg:h-20 lg:w-20 m-2 rounded-xl bg-green-600">def</button>
        </div>
    </div>
</div>
</div>
</Teleport>

</template>

<script>
export default {
name: 'chatModal',
props : {
    isactive: {type: Function},
    ban: {type: Function},
    target: {type: Object}
},
created() {
    console.log("Created")
    console.log(this.target);
},
methods : {
    activate(num) {
        this.ban(num);
        this.isactive();
    },
    desactivate(){
        this.isactive();
    }
}
}
</script>

<style src="@/assets/tailwind.css" />