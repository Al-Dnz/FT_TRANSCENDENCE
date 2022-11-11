<template>
<div class="flex flex-col h-full w-full overflow-auto">
  <div className= "h-48 w-full flex flex-row">
    <div className = "h-48 w-1/6 lg:w-1/5 flex justify-center items-center">
        <input type="checkbox"> <span class="slider round">2FA</span>
    </div>
    <div className = "h-48 w-3/6 lg:w-3/5 flex flex-col justify-center items-center  overflow-hidden">
        <span>Nom d'utilisateur actuel : {{this.username}} </span>
        <input type="text" v-model="new_username" name="search" placeholder="Changer de nom d'utilisateur" autocomplete="off" aria-label="Changer de nom d'utilisateur" className="rounded-2xl px-3 placeholder-slate-500 text-slate-500 focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500 w-1/2"/>
    </div>
    <div className= "h-48 w-2/6 lg:w-1/5 flex justify-center items-center ">
        <button @click="send()" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"> Sauvegarder</button>
    </div>
  </div>
  <div className= "h-50 w-full  ptb-3">
    <imageBox :current_obj="current_map" :obj="maps" :set_object="set_map" :declare_text="'Choose your map :'" />
  </div>
  <div className= "h-50 w-full  ptb-3">
    <imageBox :current_obj="current_paddle" :obj="paddles" :set_object="set_paddle" :declare_text="'Choose your paddle :'" />
  </div>
  <div className= "h-50 w-full ptb-3">
    <imageBox :current_obj="current_avatar" :obj="avatars" :set_object="set_avatar" :declare_text="'Choose your Avatar :'" />
  </div>
    <div className= "h-50 w-full ptb-3 flex flex-col justify-around">
        <p className = "h-6">Use a custom Avatar :</p>
        <div className="flex flex-row justify-center h-44">
            <div className="flex flex-col justify-center h-full">
                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" v-on:change="previewImage" />
            </div>
                <div classNme="flex flex-col justify-center h-full">
                    <div v-if="imageData.length == 0">
                        <img src="../assets/NoImage.jpeg" className="h-36 w-36 ">
                    </div>
                    <div v-else>
                        <img :src="getImgUrl(imageData)" @click="set_avatar(4)" class="h-36 w-36 border-4 bg-slate-200 rounded-xl" :class="current_avatar === 4 ? 'border-green-600' : 'border-transparent hover:border-green-300'">
                    </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import imageBox from '../components/ImageBox.vue'
export default {
    name: 'paramPage',
    data () {
        return {
            username : 'Bob',
            new_username : '',
            current_map : 1,
            current_paddle : 1,
            current_avatar: 1,
            imageData: "",
            maps: ['map1.jpeg', 'map2.jpeg', 'map3.jpeg', 'map4.jpeg'],
            paddles: ['pad1.jpeg', 'pad2.jpeg', 'pad3.jpeg','pad4.jpeg'],
            avatars : ['pp.jpeg', 'pepethekid.png', 'Bannedpp.png', 'Accountpp.jpeg']
        }
    },
    methods : {
        set_map(num)
        {
            this.current_map = num;
        },
        set_paddle(num)
        {
            this.current_paddle = num;
        },
        set_avatar(num)
        {
            this.current_avatar = num;
        },
        send()
        {
            alert("New Username: " + this.new_username + " New map: " + this.current_map);
            this.new_username = '';
        },
		getImgUrl: function (img) {
			return require("@/assets/" + img);
		},
        previewImage: function(event) {
            // Reference to the DOM input element
            var input = event.target;
            // Ensure that you have a file before attempting to read it
            if (input.files && input.files[0]) {
                // create a new FileReader to read this image and convert to base64 format
                var reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                reader.onload = (e) => {
                    // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                    // Read image as base64 and set to imageData
                    this.imageData = e.target.result;
                }
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsDataURL(input.files[0]);
                this.set_avatar(4)
            }
        }
    },
    components : {
        imageBox
    }
}
</script>

<style src="../assets/tailwind.css" />