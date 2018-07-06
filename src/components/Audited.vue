<template>
  <div>
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="startDate">
            <el-date-picker type="date" placeholder="起始时间"  style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endDate">
            <el-date-picker type="date" placeholder="终止时间"  style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit">详细查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%" border stripe>
      <el-table-column
        prop="tag"
        label="稽核结果"
        width="220" align="center"
        :filters="[{ text: '人工审核通过', value: '人工审核通过' }, { text: '人工审核未通过', value: '人工审核未通过' },
                 { text: '县分已处理-已重拍-待重新取照', value: '县分已处理-已重拍-待重新取照' }, { text: '县分已处理-其他-待二审', value: '县分已处理-其他-待二审' },
                 { text: '已重新取照-待二审', value: '已重新取照-待二审' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag === '人工审核通过' ? 'success' : 'danger'"
            disable-transitions>{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="入网日期"
        sortable
        width="180"
        :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
        :filter-method="filterHandler" align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="80" align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="号码"
        width="200" align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="一证N户"
        width="100" align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="靓号类型"
        width="100" align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="套餐"
        width="100" align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="县分"
        width="100" align="center">
      </el-table-column>  

      <el-table-column
        prop="address"
        label="发展渠道" align="center" width="400"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="address"
        label="备注" align="center" width="400"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="date"
        label="稽核日期"
        sortable
        width="180"
        :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
        :filter-method="filterHandler" align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="稽核工号"
        width="200" align="center">
      </el-table-column>
      <el-table-column
          prop="picture"
          header-align="center"
          align="center"
          width="100"
          label="照片">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              title="现场照/证件照"
              trigger="click">
              <img :src="scope.row.picture"/>
              <img :src="scope.row.picture"/>
              <img slot="reference" :src="scope.row.picture" :alt="scope.row.picture" style="max-height: 100px;max-width: 80px">
            </el-popover>
          </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作"
        width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary">重新稽核</el-button>
        </template>
      </el-table-column>  

    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          tag: '人工审核通过',
          picture: 'https://placeimg.com/700/323/any'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          tag: '县分已处理-已重拍-待重新取照',
          picture: 'https://placeimg.com/700/323/any'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          tag: '人工审核未通过',
          picture: 'https://placeimg.com/700/323/any'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '已重新取照-待二审',
          picture: 'https://placeimg.com/700/323/any'
        }, {
          date: '2016-05-09',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '已重新取照-待二审',
          picture: 'https://placeimg.com/700/323/any'
        }]
      }
    },
    methods: {
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        // const property = column['property'];
        // return row[property] === value;
        return row.date === value;
      }
    }
  }
</script>