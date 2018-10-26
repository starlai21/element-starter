<template>
	<div>
       <a href="/"><img src="../assets/logo.png" style="width:100px"></a>
        <el-menu
          default-active="2" router unique-opened>
<!--           <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-mobile-phone"></i>
              <span>码上购2.0</span>
            </template>
            <el-menu-item-group>
              <template slot="title">订单调度管理</template>
              <el-menu-item index="scheduling">人工调度</el-menu-item>
              <el-menu-item index="scheduleQuery">派单查询</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
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
<!--           <el-menu-item index="3">
            <i class="el-icon-star-off"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-search"></i>
            <span slot="title">客户资料查询</span>
          </el-menu-item> -->
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