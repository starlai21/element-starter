<template>
	<div>
       <a href="/"><img src="../assets/logo.png" style="width:100px"></a>
        <el-menu
          default-active="2" router unique-opened>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>系统菜单</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-view"></i>
                <span>实名稽核</span>
              </template>
              <el-menu-item-group>
                <template slot="title">稽核</template>
                <el-menu-item index="audited">已稽核结果</el-menu-item>
                <el-menu-item index="auditing">未稽核数据</el-menu-item>
              </el-menu-item-group>

          </el-submenu>
          <el-menu-item index="3">
            <i class="el-icon-star-off"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-search"></i>
            <span slot="title">客户资料查询</span>
          </el-menu-item>
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

	}
</script>