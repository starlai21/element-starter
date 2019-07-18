<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="1">    
        <el-button type="success" @click="exportData" :loading="exportLoading" style="margin-bottom: 20px; margin-left: 10px">导出</el-button>
      </el-col>

    </el-row>

    <el-table
      :data="tableData"
      v-loading="isLoading"
      border
      stripe
      max-height="700"
      style="width: 100%">
      <el-table-column
        fixed
        align="center"
        sortable
        prop="devOfficeId"
        label="发展点"
        width="100">
      </el-table-column>
      <el-table-column
        fixed
        sortable
        align="center"
        prop="channelName"
        label="发展点名称"
        width="350">
      </el-table-column>
      <el-table-column
        prop="devTotal"
        sortable
        align="center"
        label="发展量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="devCall"
        align="center"
        sortable
        label="通话用户数"
        width="120">
      </el-table-column>
      <el-table-column
        prop="ppCall"
        align="center"
        sortable
        label="通话占比"
        width="100">
      </el-table-column>
      <el-table-column
        prop="wzCall"
        align="center"
        sortable
        label="通话地温州"
        width="120">
      </el-table-column>
      <el-table-column
        prop="ppWzCall"
        sortable
        align="center"
        label="通话地温州占比"
        width="120">
      </el-table-column>
      <el-table-column
        prop="zjCall"
        sortable
        align="center"
        label="通话地省内"
        width="120">
      </el-table-column>
      <el-table-column
        prop="ppZjCall"
        sortable
        align="center"
        label="通话地省内占比"
        width="120">
      </el-table-column>
      <el-table-column
        prop="outCall"
        align="center"
        sortable
        label="通话地省外"
        width="120">
      </el-table-column>
      <el-table-column
        prop="ppOutCall"
        align="center"
        sortable
        label="通话地省外占比"
        width="120">
      </el-table-column>
      <el-table-column
        prop="outCall1"
        sortable
        align="center"
        label="通话地省外(入网3天内通话)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="ppOutCall1"
        sortable
        align="center"
        label="通话地省外占比(入网3天内通话)"
        width="120">
      </el-table-column>  

    </el-table>
  </div>

</template>

<script>
import moment from 'moment';
import {getAbnormalCallReport, exportAbnormalCallReport} from '../api';
  export default {

    created(){
      this.fetchAbnormalCallReport();
    },
    methods: {

      fetchAbnormalCallReport(){
        this.isLoading = true;
        getAbnormalCallReport().then(data => {
          this.tableData = data.data
          this.isLoading = false;
        })
        .catch(e => {
          console.log(e)
          this.isLoading = false;
        })
      },

      exportData(){
        this.exportLoading = true;
          exportAbnormalCallReport()
              .then(res => {
                if (res.data.size === 0){
                  this.$message({
                    type: 'error',
                    message: '导出失败!',
                    duration: 3000
                  });
                  this.exportLoading = false;
                  return;
                }
                const blob = res.data
                const reader = new FileReader()
                reader.readAsDataURL(blob)
                    reader.onload = (e) => {
                      const a = document.createElement('a')
                      a.download = '通话异常监控 ' + moment(new Date()).format('l')
                      a.href = e.target.result
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      this.exportLoading = false;
                }
              })
              .catch(e=>{
                this.exportLoading = false;
                console.log(e);
              })

      }
    },


    data() {
      return {
        tableData: [],
        isLoading:false,
        exportLoading:false
      }
    }
  }
</script>