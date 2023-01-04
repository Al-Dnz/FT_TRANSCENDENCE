<template>
<Teleport to="body">
<div v-if="loading">
<div v-show="ison" className=" fixed  w-full h-full bg-black bg-opacity-20">
    <div className="flex justify-center pt-24">
        <div className =" flex flex-col items-center bg-slate-100  shadow-xl w-1/2 pt-16 pl-16 pr-16 pb-8 rounded-xl">
            <span className = "pb-4" >{{ this.senderLogin }} veut se battre!</span>
            <Countdown :deadlineDate="date" :showDays=false :showHours=false :showMinutes=false mainColor='#22C55E' />
            <div className = "pt-16 flex flex-row justify-around items-end">
                <button @click="Accepted()" className = "transition ease-in-out delay-100 text-white hover:scale-110 rounded-xl pr-8 pt-4 pl-8 pb-4 mr-16 bg-green-500">Accept</button>
                <button @click="Declined()" className = "transition ease-in-out delay-100 text-white hover:scale-110 rounded-xl pr-8 pt-4 pl-8 pb-4 ml-16 bg-red-600">Decline</button>
            </div>
        </div>
    </div>
</div>
</div>
</Teleport>
</template>
  
<script>
import {Countdown} from 'vue3-flip-countdown'
  export default {
	name: 'modalVue',
    props : {
        isactive: {
            type: Function,
            required: true},
        Accept: {
            type: Function,
            required: true},
        Decline: {
            type: Function,
            required: true},
        ison: {
            type : Boolean,
            default: false
        },
        senderLogin:  {
            type: String,
            required: true
        },
        gameCode: {
            type: String,
            required: true
        }
    },
    methods : {
        activate() {
            this.isactive();
        },
        async autovalidate () {
            await this.delay(20000);
            this.isactive();
        },
        Accepted() {
            this.Accept();
            this.isactive();
            const payload =
            {
                login: this.senderLogin,
                gameCode: this.gameCode,
                accepted: true

            }
            this.$store.state.globalSocket.emit('respondToInvitation', payload);
            this.$router.push('/home/' + this.gameCode);
        },
        Declined()
        {
            this.Decline();
            this.isactive();
            const payload =
            {
                login: this.senderLogin,
                gameCode: this.gameCode,
                accepted: false

            }
            this.$store.state.globalSocket.emit('respondToInvitation', payload);
        },
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },
    data()
    {
        return{
            date:Date,
            loading : false
        }
    },
    components: {
        Countdown
    },
    watch: {
        ison: async function(newVal, oldVal)
        {
            if (newVal == true)
            {
                let date = new Date();
                date.setSeconds(date.getSeconds() + 20);
                this.date = date;
                this.loading = true;
                this.autovalidate();
            }
            if (oldVal == true)
            {
                this.loading = false;
            }
        },
    }
}
</script>
<style src="../assets/tailwind.css" />