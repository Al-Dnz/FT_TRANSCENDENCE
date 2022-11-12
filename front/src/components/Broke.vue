<template>
    <div className="h-58 w-58 flex flex-col justify-center items-center">
        <img src="@/assets/crying.png" className="h-46 w-56">
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