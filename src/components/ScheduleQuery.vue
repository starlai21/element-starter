<template>
  <div >
    <el-card class="box-card" shadow="hover" :body-style="searchForm.bodyStyle" >
      <div slot="header" class="clearfix">
        <el-form :inline="true">
          <el-form-item label="订单区域">
            <el-col :span="15">
              <el-cascader
                placeholder=""
                v-model="searchForm.region"
                :options="searchForm.regionOptions"
                filterable
              ></el-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label="订单编号">
            <el-col :span="18">
              <el-input v-model="searchForm.orderNumber"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitPassedData" :loading="submitLoading">同步数据</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitPassedData" :loading="submitLoading">一键提交</el-button>
          </el-form-item>
              <el-button style="float: right; padding: 14px 0px" type="text" @click="searchForm.isVisible = !searchForm.isVisible">
                <span v-if="searchForm.isVisible">折叠</span>
                <span v-else>展开</span>
              </el-button>
        </el-form>
      </div>
      <div>
        <transition name="el-zoom-in-top">
         <el-form ref="searchForm" :model="searchForm" label-width="120px" v-show="searchForm.isVisible">
                <el-form-item label="派单方式" prop="dispatchMethod" style="margin-top:10px">
                  <el-select v-model="searchForm.dispatchMethod" placeholder="请选择类型" style="width: 100%" clearable>
                    <el-option
                      v-for="item in searchForm.dispatchMethodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="超时状态" prop="timeoutStatus">
                  <el-select v-model="searchForm.timeoutStatus" placeholder="请选择类型" style="width: 100%" clearable>
                    <el-option
                      v-for="item in searchForm.timeoutStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="派送员/营业厅" prop="nameOrPhone" placeholder="名称/联系电话" style="margin-top:10px">
                  <el-input v-model="searchForm.nameOrPhone"></el-input>
                </el-form-item>
                <el-form-item label="成交时间">
                   <el-col :span="11">
                     <el-form-item prop="orderStartDate">
                       <el-date-picker type="date" placeholder="起始时间"  v-model="searchForm.orderStartDate" style="width: 100%;"></el-date-picker>
                     </el-form-item>
                   </el-col>
                   <el-col class="line" :span="2">-</el-col>
                   <el-col :span="11">
                     <el-form-item prop="orderEndDate">
                       <el-date-picker type="date" placeholder="终止时间"  v-model="searchForm.orderEndDate" style="width: 100%;"></el-date-picker>
                     </el-form-item>
                   </el-col>
                 </el-form-item>
                 <el-form-item label="派单时间">
                   <el-col :span="11">
                     <el-form-item prop="dispatchStartDate">
                       <el-date-picker type="date" placeholder="起始时间"  v-model="searchForm.dispatchStartDate" style="width: 100%;"></el-date-picker>
                     </el-form-item>
                   </el-col>
                   <el-col class="line" :span="2">-</el-col>
                   <el-col :span="11">
                     <el-form-item prop="dispatchEndDate">
                       <el-date-picker type="date" placeholder="终止时间"  v-model="searchForm.dispatchEndDate" style="width: 100%;"></el-date-picker>
                     </el-form-item>
                   </el-col>
                 </el-form-item>
                <el-form-item>
                  <el-button type="info" @click="clearForm('searchForm')">重置</el-button>
                  <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
          </el-form> 
          </transition>
      </div>

    </el-card>
    <el-table v-loading="isLoading"
      :data="_tableData"
      style="width: 100%; margin-top:10px" border stripe>

      <el-table-column
        label="订单标识"
        width="250" align="center"
        >
        <template slot-scope="scope">
          <p>
            订单编号: {{scope.row.orderNumber}}  <el-tag type="success" v-if="scope.row.submitted === 1">已提交</el-tag>
            <el-tag type="danger" v-else>未提交</el-tag>
          </p>
          <p>成交时间: {{dateFormatter(scope.row.orderDate)}}</p>
          <p>订单区域: {{scope.row.orderRegion}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="派单信息"
        width="250" align="center"
        >
        <template slot-scope="scope">
          <p>派送员/厅: {{scope.row.deliveryName}}</p>
          <p>联系电话: {{scope.row.deliveryPhone}}</p>
          <p>派单时间: {{dateFormatter(scope.row.dispatchDate)}}</p>
          <p>派单方式: {{scope.row.dispatchMethod}}</p>
        </template>
      </el-table-column>

      <el-table-column
        label="订单信息"
        width="500"
        align="center"
      >
        <template slot-scope="scope">
          <p>商品名称: {{scope.row.productName}}</p>
          <p>订购号码: {{scope.row.mobileNumber}}</p>
          <p>收货地址: {{scope.row.shippingAddress}}</p>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
         align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="reaudit(scope.row,scope.$index)">撤回</el-button>
          <el-button @click="viewDetail(scope.row.orderId)">详情</el-button>
        </template>
      </el-table-column>  

    </el-table>


    <!-- pagination -->
    <el-row>
      <el-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        prev-text="上一页"
        next-text="下一页"
        layout="total, prev, pager, next, jumper"
        :current-page="page.currentPage"
        :total="page.total">
      </el-pagination>
    </el-row>

    <!-- reaudit dialog -->
<el-dialog :title="currentRowState" :visible.sync="isReauditDialogVisible" width="80%"  :before-close="handleClose" id="audited">
          
</el-dialog>

  </div>

</template>
<style type="text/css">
  #audited .el-form-item{
    margin-bottom: 8px;
  }
  .image {
    width:360px;
    height:360px;
  }
  p {
    text-align:left;
  }

</style>

<script>
import moment from 'moment';
import {fetchAuditedData, postAuditingForm, fetchLogs, fetchPictures, submitPassedData, sendSafeCode, fetchDispatchedOrders} from '../api';
import {AuditMixin} from './mixins/AuditMixin'
  export default {
    mounted(){
      this.searchForm.isVisible = false;
      // this.search();
    },
    mixins: [AuditMixin],
    computed: {
      _tableData(){
        if (this.tableData.length > 0)
          return this.tableData.slice((this.page.currentPage-1)*this.pageSize, this.page.currentPage*this.pageSize);
        else
          return [];
      }
    },
    data() {
      return {
        tableData: [],
        isReauditDialogVisible: false,
        currentRowState: "原稽核结果为: ",
        currentRow: [],
        pageSize: 5,
        logLoading: false,
        logs: [],
        pictureLoading: false,
        submitLoading:false,

        searchForm:{
          region:['温州',null],
          regionOptions: [
            {
              value:'温州',
              label:'温州',
              children:[{
                value:null,
                label:'全部'
              },{
                value:'鹿城区',
                label:'鹿城区'
              },
              {
                value:'龙湾区',
                label:'龙湾区'
              },
              {
                value:'瓯海区',
                label:'瓯海区'
              },
              {
                value:'洞头县',
                label:'洞头县'
              },
              {
                value:'永嘉县',
                label:'永嘉县'
              },
              {
                value:'平阳县',
                label:'平阳县'
              },
              {
                value:'苍南县',
                label:'苍南县'
              },
              {
                value:'文成县',
                label:'文成县'
              },
              {
                value:'泰顺县',
                label:'泰顺县'
              },
              {
                value:'瑞安市',
                label:'瑞安市'
              },
              {
                value:'乐清市',
                label:'乐清市'
              }]
            }],
          orderNumber:'',
          dispatchMethod:null,
          dispatchMethodOptions:[
            { 
              value:null,
              label:'全部'
            },
            {
              value:'智能调度',
              label:'智能调度'
            },
            {
              value:'管理员派单',
              label:'管理员派单'
            },
            {
              value:'他厅转派',
              label:'他厅转派'
            },
            {
              value:'他人转派',
              label:'他人转派'
            },
          ],
          timeoutStatus:null,
          timeoutStatusOptions:[{
            value:null,
            label:'全部'
          },{
            value:'未超时',
            label:'未超时'
          },{
            value:'已超时',
            label:'已超时'
          }],
          nameOrPhone:'',
          orderStartDate:null,
          orderEndDate:null,
          dispatchStartDate:null,
          dispatchEndDate:null
        },




      };
    },
    methods: {
      viewDetail(orderId){
        var href='http://admin.mall.10010.com/Odm/Sell/Order/OrderDetails?orderId='+orderId+'&orderType=1'
        window.open(href, '_blank');
      },
      send(state){
        var type = this.violationValue
        if (state === 1){
          type = 0
          this.successLoading = true;
        }
        else
          this.failureLoading = true;
        var params = {state: state, note: this.note, type: type, uuid: this.currentRow.uuid, idPicUuid:"", livingPicUuid:"",
                      subscriptionId: this.currentRow.subscriptionId};
        postAuditingForm(params).then(data => {

          this.currentRow.state = state;

          this.$set(this.tableData, this.currentRow.index, this.currentRow)
          this.$message({
            type: 'success',
            message: '提交成功!',
            duration: 3000
          });
          this.successLoading = false;
          this.failureLoading = false;
        }).catch(e => {
          console.log(e);
        })
        this.resetAuditForm();

        this.isReauditDialogVisible = false;

      },

      fromNow(date){
        moment.locale('zh-cn');
        return moment(date).fromNow();
      },
      dateFormatter(date){
        return moment(date).format('YYYY-MM-DD hh:mm');
      },
      submitPassedData(){
        this.submitLoading =  true;
        submitPassedData().then(data => {
          this.submitLoading = false;
          this.$prompt('请输入验证码', '验证码将在几秒后发送到您的手机', {
                   confirmButtonText: '确定',
                   cancelButtonText: '取消',
                 }).then(({ value }) => {
                  this.submitLoading = true;
                  sendSafeCode({safeCode:value}).then(data => {
                    this.submitLoading = false;
                    if (data){
                      this.$message({
                       type: 'success',
                       message: '提交成功'
                      });  
                    }
                    else {
                      this.$message({
                       type: 'error',
                       message: '验证码错误'
                      });  
                      this.submitPassedData()
                    }
  
                  }).catch(e => {
                    this.submitLoading = false;
                    console.log(e);
                  });
                 }).catch((e) => {
                   this.$message({
                     type: 'info',
                     message: '取消输入'
                   });       
                 });

        }).catch(e => {
          this.submitLoading = false;
          console.log(e);
        })
      },
      search(){
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.isLoading = true;
            var params = {region:this.searchForm.region[1],orderNumber: this.searchForm.orderNumber, 
                          nameOrPhone:this.searchForm.nameOrPhone, timeoutStatus:this.searchForm.timeoutStatus, 
                          dispatchMethod:this.searchForm.dispatchMethod, orderStartDate:this.searchForm.orderStartDate,
                          orderEndDate:this.searchForm.orderEndDate, dispatchStartDate:this.searchForm.dispatchStartDate,
                          dispatchEndDate:this.searchForm.dispatchEndDate };
            fetchDispatchedOrders(params).then(data => {
              // console.log(data);
              this.tableData = data;
              this.$set(this.page,'total',this.tableData.length);
              if (this.tableData.length>0){
                this.$set(this.page,'currentPage',1);
              }
              else{

                this.$message({
                  type: 'error',
                  message: '不存在符合上述条件的数据!',
                  duration: 3000
                });

              }
              this.isLoading = false;
            }).catch(e => {
              this.isLoading = false;
              console.log(e);
            })
            
          } else {
              console.log('error submit!!');
              return false;
          }
        });
      },
      reaudit(row, index){
        this.currentRow = row;
        this.currentRow.index = index;
        this.currentRowState = "原稽核结果为: " + this.stateFormatter(row.state);
        this.fetchPictures();
        this.isReauditDialogVisible = true;
      },
      handleClose(done) {
        if (this.note == '' && this.violationValue == '')
          done();
        else{
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        }
      },

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.$set(this.page,'currentPage',val);
      }
    }
  }
</script>

