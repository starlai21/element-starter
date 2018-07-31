<template>
  <el-menu :default-active="activeIndex"  mode="horizontal">
    <el-menu-item index="1">处理中心</el-menu-item>
    <el-submenu index="2">
      <template slot="title">我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
      <el-submenu index="2-4">
        <template slot="title">选项4</template>
        <el-menu-item index="2-4-1">选项1</el-menu-item>
        <el-menu-item index="2-4-2">选项2</el-menu-item>
        <el-menu-item index="2-4-3">选项3</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-menu-item index="3" >消息中心</el-menu-item>
    <el-menu-item index="6" style="float: right">欢迎回来, {{username}} <el-button type="danger" @click="logout">注销</el-button></el-menu-item>
  </el-menu>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'
  export default {
    computed:{
      ...mapState([
        'username'
        ])
    },
    data(){
      return {
        activeIndex:'1'
      };
    },
    methods:{
      logout(){
        this.$store.commit('logout');
        this.$message({
          message: '注销成功',
          type: 'info'
        });
      }
    }
  }
</script>