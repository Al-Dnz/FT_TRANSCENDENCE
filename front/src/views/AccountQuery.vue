<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div  v-else-if="obj" className="flex flex-row justify-center w-full h-full ">
  <div className = "flex flex-col justify-between w-full h-full bg-slate-200 lg:w-3/4 rounded-2xl">
    <div className = "w-full h-friendbox">
      <div className = "w-full h-full flex flex-col justify-center"> 
      <div className="flex flex-row justify-center w-full rounded-2xl h-4/6 text-slate-500 focus-within:text-green-500 cursor-pointer">
				<input type="text" v-model="newSearch" @keyup.enter="search()" name="search" placeholder="Search an other player !" autocomplete="off" aria-label="Search an other player !" className="rounded-2xl px-3 placeholder-slate-500 text-slate-500 focus-within:border-green-500 focus-within:outline-0 border-2 border-slate-500 w-1/2"/>
				<MagnifyingGlassCircleIcon @click="search()" className=""/>
			</div>
      </div>
    </div>
    <div className ="center-x h-1/6">
      <img :src="obj?.actualAvatar.path" className = "rounded-xl"/>
    </div>
    <span className="center-x">{{ obj?.username }}</span>
    <span className="center-x">Elo :{{ obj?.stats.level }}</span>
    <div className="flex flex-row justify-center w-full">
      <span>Win : {{obj?.stats.victories}} </span>
      <div className="w-1/4"> </div>
      <span>Looses : {{obj?.stats.defeats}} </span>
    </div>
    <div className=" h-3/5 w-full flex justify-center items-center">
      <div className="bg-slate-300 w-3/4 h-5/6 flex flex-col justify-start items-center overflow-auto rounded-2xl">
          <!-- <div v-for="(item, index) in this.obj.matchHistory" v-bind:key="index" className="h-24 w-5/6 pt-3">
            <history-box :obj=item :index="index"/>
          </div> -->
      </div>
    </div>
  </div>
  </div>
  <div v-else-if="error" className="w-full h-full">
    <brokePage :str="error?.message" />
  </div>
</template>
  
<script lang="ts">
import { UsersApi, Configuration, UserOutput, ErrorOutput } from '@/api';
import { getCredentials } from "@/frontJS/cookies";
import  brokePage  from "@/components/Broke.vue"

interface UserData {
    obj?: UserOutput;
    loading: boolean;
    newSearch: string;
    error?: ErrorOutput;
}

//import historyBox from '../components/HistoryBox.vue'
import { defineComponent } from "vue"; 

export default defineComponent({
	name: 'accPage',
	data(): UserData {
		return {
            obj: undefined,
            loading : false,
            newSearch : '',
            error: undefined
		}
	},
  	methods: {
    getImgUrl: function (img: string) {
			return require('@/assets/' + img);
		},
    search : function() {
      this?.$router?.push('/user/' + this.newSearch);
      this.newSearch = '';
      //this.$forceUpdate();
    },
	async fetchData()
	{
    console.log(this.$route?.params.id as string);
    this.loading = true;
    getCredentials()
    .then((accessToken: string ) => {
      const userAPI = new UsersApi(new Configuration({accessToken: accessToken}))
      userAPI.getUserByID({login: this.$route?.params.id as string})
        .then((user: UserOutput ) => {
          this.obj = user})
        .catch((msg : ErrorOutput) => {
          this.error = msg;})})
    this.loading = false       
	}
  },
  components :
  {
    brokePage
  },
  async mounted() {
	  this.fetchData()
  }
  })
  </script>
  
  <style src="../assets/tailwind.css" />