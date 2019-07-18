<template>
	<div>
       <a href="/"><img src="../assets/logo.png" style="width:100px"></a>
        <el-menu
          default-active="2" router unique-opened>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="changePassword">修改密码</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-view"></i>
                <span>实名稽核</span>
              </template>
              <el-menu-item-group>
<!--                 <template slot="title">稽核</template> -->
                <el-menu-item index="audited">已稽核结果</el-menu-item>
                <el-menu-item index="auditing">未稽核数据</el-menu-item>
              </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3" v-if="isAdmin">
            <template slot="title">
              <i class="el-icon-phone"></i>
              <span>用户质态稽核</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="abnormalCall">通话异常监控</el-menu-item>
            </el-menu-item-group>
          </el-submenu>


        </el-menu>
    </div>
</template>
<style type="text/css">
  .el-aside {
    overflow: visible;
  }  
</style>

<script type="text/javascript">
	export default{
    computed:{
      isAdmin(){
        return this.$store.state.isAdmin;
      }
    }
	}
</script>