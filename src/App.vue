<template>
  <div id="app">
    

    <el-container>
    <!-- aside -->
      <el-aside width="200px">
          <aside-menu></aside-menu>
      </el-aside>

      <el-container>
      <!-- header -->
        <el-header>
          <my-header></my-header>
        </el-header>


        <!-- main view  -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>   
  </div>
</template>




<script>
import AsideMenu from './components/AsideMenu.vue';
import Header from './components/Header.vue';



export default {
  data(){
    return {
       
    };
  },

  components: {
    'aside-menu': AsideMenu,
    'my-header': Header
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
