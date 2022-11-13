<template>
    <div className="h-full w-full flex flex-col  bg-slate-200 shadow-lg overflow-auto">
    <div  className="relative flex items-center justify-center 
    w-1/2 mt-2 mb-2 mx-auto  
  bg-slate-50 hover:bg-green-600
  text-green-500 hover:text-white
    hover:rounded-xl rounded-3xl
    transition-all duration-300 ease-linear
    cursor-pointer shadow-lg">
      <PlayIcon @click="goHome()"/>
    </div>
    <div className="relative flex items-center justify-center 
    w-1/2 mt-2 mb-2 mx-auto  
  bg-slate-50 hover:bg-green-600
  text-green-500 hover:text-white
    hover:rounded-xl rounded-3xl
    transition-all duration-300 ease-linear
    cursor-pointer shadow-lg">
      <UserIcon @click="goAccount()" />
    </div>
    <div className="relative flex items-center justify-center 
    w-1/2 mt-2 mb-2 mx-auto  
  bg-slate-50 hover:bg-green-600
  text-green-500 hover:text-white
    hover:rounded-xl rounded-3xl
    transition-all duration-300 ease-linear
    cursor-pointer shadow-lg"> 
      <ChatBubbleLeftEllipsisIcon @click="goChat()" />
    </div>

    <div  className="relative flex items-center justify-center 
    w-1/2 mt-2 mb-2 mx-auto  
  bg-slate-50 hover:bg-green-600
  text-green-500 hover:text-white
    hover:rounded-xl rounded-3xl
    transition-all duration-300 ease-linear
    cursor-pointer shadow-lg">
      <UserGroupIcon @click="goFriend()" />
    </div>
    <div className="relative flex items-center justify-center 
    w-1/2 mt-2 mb-2 mx-auto  
  bg-slate-50 hover:bg-green-600
  text-green-500 hover:text-white
    hover:rounded-xl rounded-3xl
    transition-all duration-300 ease-linear
    cursor-pointer shadow-lg">
      <EyeIcon @click="goSpectate()" />
    </div>
    <div className = "relative flex items-center justify-center w-1/2 mt-2 mb-2 bg-slate-50 hover:bg-green-600 text-green-500 hover:text-white mx-auto hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
      <EyeSlashIcon @click="goBlock()" className="" />
    </div>
    <div className = "relative flex items-center justify-center w-1/2 mt-2 mb-2 bg-slate-50 hover:bg-green-600 text-green-500 hover:text-white mx-auto hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
      <Cog8ToothIcon @click="goParam()" className="" />
    </div>
    </div>
</template>

<script>
export default {
  name : 'navBar',
	created() {
		console.log ("hello nav");
	},
	beforeUnmount() {
		console.log ("bye nav");
	},
  methods : {
	goHome()
	{
		this.$router.push('/home');
	},
	goAccount()
	{
		this.$router.push('/user');
	},
	goChat()
	{
		this.$router.push('/chat');
	},
	goFriend()
	{
		this.$router.push('/friendList');
	},
	goSpectate()
	{
		this.$router.push('/spectate');
	},
  goBlock()
  {
    this.$router.push('/blocked');
  },
  goParam()
  {
    this.$router.push('/param');
  }
  }
}
</script>
<style src="../assets/tailwind.css" />
