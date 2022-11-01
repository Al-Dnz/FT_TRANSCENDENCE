<template>
  <div className="flex flex-row justify-center w-full h-full ">
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
      <img :src="getImgUrl(pp)" className = "rounded-xl"/>
    </div>
    <span className="center-x">{{ usernam }}</span>
    <span className="center-x">Elo :{{ elo }}</span>
    <div className="flex flex-row justify-center w-full">
      <span>Win : {{wins}} </span>
      <div className="w-1/4"> </div>
      <span>Looses : {{looses}} </span>
    </div>
    <div className=" h-3/5 w-full flex justify-center items-center">
      <div className="bg-slate-300 w-3/4 h-5/6 flex flex-col justify-start items-center overflow-auto rounded-2xl">
          <div v-for="(item, index) in this.matchHistory" v-bind:key="index" className="h-24 w-5/6 pt-3">
            <history-box :obj=item :index="index"/>
          </div>
      </div>
    </div>
  </div>
  </div>
</template>
  
  <script>
  import historyBox from '../components/HistoryBox.vue'
  export default {
	name: 'accPage',
  methods :{
    getImgUrl: function (img) {
			return require('@/assets/' + img);
		},
    search : function() {
      this.$router.push('/user/' + this.newSearch);
      this.newSearch = '';
      //this.$forceUpdate();
    }
  },
  components :
  {
    historyBox
  },
  computed : {
    usernam: function() {
      return this.$route.params.id;
    }
  },
  data () {
    return {
      username : this.$route.params.id,
      elo : 1000,
      wins: 15,
      looses : 15,
      pp : 'Accountpp.jpeg',
      newSearch: '',
      components : {},
      matchHistory : [
        {
          p1 : "Player1",
          pp1 : 'pp.jpeg',
          pts1 : 9,
          p2 : 'David',
          pp2 : 'madgeleft.jpeg',
          pts2 : 8,
          results : 'W'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 150,
          p2 : "Player1",
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'W'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 0,
          p2 : "Player1",
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'L'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 9,
          p2 : 'David',
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'W'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 150,
          p2 : "Player1",
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'W'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 0,
          p2 : "Player1",
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'L'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 9,
          p2 : 'David',
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'W'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 150,
          p2 : "Player1",
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'W'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 0,
          p2 : "Player1",
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'L'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 9,
          p2 : 'David',
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'W'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 150,
          p2 : "Player1",
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'W'
        },
        {
          p1 : "Player1",
          pp1 : 'Accountpp.jpeg',
          pts1 : 0,
          p2 : "Player1",
          pp2 : 'Accountpp.jpeg',
          pts2 : 8,
          results : 'L'
        }
      ]
    }
  }
  }
  </script>
  
  <style src="../assets/tailwind.css" />