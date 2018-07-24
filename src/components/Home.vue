<template>
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
</template>

<script type="text/javascript">
import AsideMenu from './AsideMenu.vue';
import Header from './Header.vue';

export default {

	components: {
	  'aside-menu': AsideMenu,
	  'my-header': Header
	}
}
</script>