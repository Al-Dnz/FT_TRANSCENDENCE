<template>
	<div className = "h-full w-full shadow-lg text-xl text-black tracking-wider font-semibold text-opacity-80 flex justify-center items-center bg-white">
		<span># {{sectionTitle}}</span>
		<img @click="goHome()" className="fixed right-2 h-8 w-8 cursor-pointer" src="../assets/remove.png">
	</div>
</template>

<script>
export default {
props: {
	sectionTitle: String
},
methods : {
	goHome()
	{
		this.$router.push('/');
	}
},
name : 'headBar'
}
</script>