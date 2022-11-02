<template>
  <div className = "">
    <div className = "w-full h-12">
      <span>{{declare_text}}</span>
    </div>
    <div  className="flex flex-row justify-around w-full h-36 overflow-auto">
          <div v-for="(item, index) in obj" v-bind:key="index" className = "w-36 h-36 center-y p-4">
              <img :src="getImgUrl(item)" @click="set_object(index)" class = "border-4 bg-slate-200 rounded-xl" :class="current_obj === index ? 'border-green-600' : 'border-transparent hover:border-green-300'"/>
          </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
	name: 'spectateBox',
	props : {
		obj: Object,
    current_obj : Number,
    set_object: { type: Function },
    declare_text: String
	},
	methods: {
		set_obj: function(num) {
            this.set_object(num);
        },
		getImgUrl: function (img) {
			return require('@/assets/' + img);
		}
	},
  }
  </script>
  
  <style src="../assets/tailwind.css" />