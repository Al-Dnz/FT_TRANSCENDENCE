<template>
  <div className="h-full w-full flex flex-col justify-center items-center pb-5 pt-5">
    <img src="@/assets/cookies.gif" className="object-scale-down h-44 w-44 rounded-xl">
    <p>Loading cookies...</p>
  </div>
</template>

<script lang="ts">
import { AuthenticationApi, UsersApi, Configuration, ResponseError } from "@/api";
import { ErrorOutput, OauthToken } from "@/api/models";
import { defineComponent } from "vue";
import { setRefreshCookie, setAccessCookie } from "@/frontJS/cookies";

export default defineComponent({
  name: "callBack",
  mounted() {
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
      .then(async (value: OauthToken) => {
        setAccessCookie(value.accessToken)
        setRefreshCookie(value.refreshToken)
        await new UsersApi(new Configuration({accessToken: value.accessToken}))
        .createUser()
        .then(() => {this.$router.push("/param");})
        .catch((errorMsg: ResponseError) => { errorMsg.response.json().then((str : ErrorOutput) =>
          {
            this.$cookies.remove("trans_access")
		        this.$cookies.remove("trans_refresh")
            this.$router.push("/");
            this.$toast(str.message, {
              styles: { backgroundColor: "#FF0000", color: "#FFFFFF" },
            });
          });})
      });
  },
});
</script>
<style src="@/assets/tailwind.css" />
