<template>
	<p>Loading ... </p>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'callBack',
  mounted() {
		console.log(this.$route.query.code);
		if (!this.$route.query.code)
		{
			this.$router.push('/');
			this.$toast("Error log", {styles: {backgroundColor: '#FF0000', color: '#FFFFFF',}},);
			return;
		}
		this.$cookies.set("trans", this.$route.query.code, "1y");
		this.$router.push('/param');
	}
})
</script>

<style src="@/assets/tailwind.css" />