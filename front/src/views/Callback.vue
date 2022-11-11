<template>
	<p>Loading ... </p>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { AuthenticationApi, OauthToken } from '@ft_transcendance/client';

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
		const test = new AuthenticationApi({},"/api");
		test.oauthAuthentication({code:this.$route.query.code}).then((value: OauthToken) => {console.log(value)});
		this.$cookies.set("trans_acces", this.$route.query.code, 60 * 15);
		this.$cookies.set("trans_refresh", this.$route.query.code, 60 * 60);
		this.$router.push('/param');
	}
})
</script>

<style src="@/assets/tailwind.css" />