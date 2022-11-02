<template>
	<div v-if="this.$route.name === 'log'" class="GlobalLoggin">
		<RouterView name="logpage" />
	</div>
	<div v-else class="GlobalApp">
		<div className="fixed top-0 left-0 w-1/12 h-full">
			<router-view name="navbar" />
		</div>
		<div className="fixed top-0 right-0 w-11/12 h-headh">
			<router-view name="headbar" />
		</div>
		<div className="fixed bottom-0 right-0 w-11/12 h-content">
			<router-view />
		</div>
	</div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App'
})
</script>

<style src="./assets/tailwind.css" />
