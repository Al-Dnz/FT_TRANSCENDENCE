<template>
    <div className="h-full w-full flex flex-col justify-center items-center">
        <img src="@/assets/crying.png" className="h-4/5">
        <p> {{str}}</p>
    </div>
</template>

<script lang="ts">

import { defineComponent } from "@vue/runtime-core";


export default defineComponent({
    name: "brokePage",
    props: {
        str : {
            type: String
        }
    }
})
</script>

<style>

</style>