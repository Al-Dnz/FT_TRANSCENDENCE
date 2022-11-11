<template>
	<div className="flex flex-col justify-start items-center w-full h-full overflow-auto">
		<div v-for="(item, index) in this.tab" v-bind:key="index" className="h-1/4 w-3/4 pt-3">
			<spectateBox :obj=item :index="index"/>
		</div>
	</div>
  </template>
  
  <script>
  import spectateBox from '../components/SpectateBox.vue';
  export default {
	name: 'spectatePage',
  data() {
    return {
      tab : [
      {
        room: 6,
        p1 :
          {
            username : "Jean_Neymar",
            pp :"madgeleft.jpeg",
            elo : "1000"
          },
        p2 :
          {
            username : "Jean_Peuxplus",
            pp :"madgeright.jpeg",
            elo : "10000"
          }
      },
      {
        room: 16,
        p1 :
          {
            username : "Jean_Neymar",
            pp :"madgeleft.jpeg",
            elo : "1000"
          },
        p2 :
          {
            username : "Jean_Peuxplus",
            pp :"madgeright.jpeg",
            elo : "10000"
          }
      },
      {
        room: 15,
        p1 :
          {
            username : "Jean_Neymar",
            pp :"madgeleft.jpeg",
            elo : "1000"
          },
        p2 :
          {
            username : "Jean_Peuxplus",
            pp :"madgeright.jpeg",
            elo : "10000"
          }
      },
      {
        room: 10,
        p1 :
          {
            username : "Jean_Neymar",
            pp :"madgeleft.jpeg",
            elo : "1000"
          },
        p2 :
          {
            username : "Jean_Peuxplus",
            pp :"madgeright.jpeg",
            elo : "10000"
          }
      },
      {
        room: 9,
        p1 :
          {
            username : "Jean_Neymar",
            pp :"madgeleft.jpeg",
            elo : "1000"
          },
        p2 :
          {
            username : "Jean_Peuxplus",
            pp :"madgeright.jpeg",
            elo : "10000"
          }
      },
      ]
    };
  },
	components : {
    spectateBox
	}
  }
  </script>
  
  <style src="../assets/tailwind.css" />