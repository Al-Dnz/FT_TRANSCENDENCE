<template>
    <ChatBubbleLeftEllipsisIcon @click="goToChat()" className="cursor-pointer"/>
</template>

<script lang="ts">
//mettre en ts normalement c bon
import { defineComponent } from 'vue';


export default defineComponent({
    name: 'goToChat',
    props : {
        accName: String
    },
    methods : {
        goToChat() {
            if (this.accName)
                this.$router.push('/chat/' + this.accName);
            else
                this.$router.push('/chat');
        }
    }
})
</script>
<style src="@/assets/tailwind.css" />