<template>
	<div>
		<canvas ref ="game"
		width="640"
		height="480"
		style="border: 1px solid black;"></canvas> 
	</div>
</template>

<script>
import io from 'socket.io-client';

	export default {
		name: "Main-Game",
		data() {
			return {
				socket: {},
				context: {},
				position: {
					x: 0,
					y: 0
				}
			}
		},
		created() {
			this.socket = io("http://localhost:4242");
		},
		mounted() {
			this.context = this.$refs.game.getContext("2d");
			this.socket.on("position", data => {
				this.position = data;
				this.context.fillRect(this.position.x, this.position.y, 20, 20);
			});
		}
	}
</script>

<style scoped>

</style>