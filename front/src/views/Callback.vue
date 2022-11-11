<template>
  <p>Loading ...</p>
</template>

<script lang="ts">
import { AuthenticationApi, UsersApi, Configuration } from "@/api";
import { OauthToken } from "@/api/models";
import { defineComponent } from "vue";
import { setRefreshCookie, setAccessCookie } from "@/frontJS/cookies";

export default defineComponent({
  name: "callBack",
  mounted() {
    console.log(this.$route.query.code);
    if (!this.$route.query.code) {
      this.$router.push("/");
      this.$toast("Error log", {
        styles: { backgroundColor: "#FF0000", color: "#FFFFFF" },
      });
      return;
    }

    const authApi = new AuthenticationApi();
    authApi
      .oauthAuthentication({
        oauthAuthenticationRequest: { code: this.$route.query.code as string },
      })
      .then((value: OauthToken) => {
        setAccessCookie(value.accessToken)
        setRefreshCookie(value.refreshToken)

        new UsersApi(new Configuration({accessToken: value.accessToken}))
        .createUser().catch((error: Error) => {
            throw new Error(error.message)
        })
        this.$router.push("/param");
      });
  },
});
</script>
<style src="@/assets/tailwind.css" />
