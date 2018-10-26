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
            <el-button  :loading="submitLoading">同步数据</el-button>
          </el-form-item>
<!--           <el-form-item>
            <el-button type="success" @click="submitPassedData" :loading="submitLoading">一键提交</el-button>
          </el-form-item> -->
              <el-button style="float: right; padding: 14px 0px" type="text" @click="searchForm.isVisible = !searchForm.isVisible">
                <span v-if="searchForm.isVisible">折叠</span>
                <span v-else>展开</span>
              </el-button>
        </el-form>
      </div>
      <div>
        <transition name="el-zoom-in-top">
         <el-form ref="searchForm" :model="searchForm" label-width="80px" v-show="searchForm.isVisible">
                <el-form-item label="调度原因" prop="scheduleReason" style="margin-top:10px">
                  <el-select v-model="searchForm.scheduleReason" placeholder="请选择类型" style="width: 100%" clearable>
                    <el-option
                      v-for="item in searchForm.scheduleReasonOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="派送状态" prop="dispatchStatus">
                  <el-select v-model="searchForm.dispatchStatus" placeholder="请选择类型" style="width: 100%" clearable>
                    <el-option
                      v-for="item in searchForm.dispatchStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                  <el-select v-model="searchForm.age" placeholder="请选择类型" style="width: 100%" clearable>
                    <el-option
                      v-for="item in searchForm.ageOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="收货地址" prop="shippingAddress"  style="margin-top:10px">
                  <el-input v-model="searchForm.shippingAddress"></el-input>
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
        width="280" align="center"
        >
        <template slot-scope="scope">
          <p>
            订单编号: {{scope.row.orderNumber}}  <!-- <el-tag type="success" v-if="scope.row.submitted === 1">已提交</el-tag>
            <el-tag type="danger" v-else>未提交</el-tag> -->
            <el-tag type="danger" v-if="scope.row.isAbove16 === 1">未满16周岁</el-tag>

          </p>
          <p>成交时间: {{dateFormatter(scope.row.orderDate) }}</p>
          <p style="color: red">下单时间: {{fromNow(scope.row.orderDate)}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="派单信息"
        width="250" align="center"
        >
        <template slot-scope="scope">
          <p>调度原因: {{scope.row.scheduleReasonDetail}}</p>
          <p>派单状态: {{scope.row.dispatchStatus}}</p>
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
          <p><el-button type="primary" @click="dropIn(scope.row,scope.$index)">上门</el-button>
          <el-button  type="warning" @click="selfLifting(scope.row,scope.$index)">自提</el-button></p>
          <p><el-button  @click="viewDetail(scope.row.orderId)">详情</el-button>
          <el-button type="danger" @click="review(scope.row,scope.$index)">重新审单</el-button></p>
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

<!-- dropIn dialog -->
<el-dialog title="请选择派送员" :visible.sync="isDropInDialogVisible" width="70%"  :before-close="closeDropInDialog" id="audited" 
  :close-on-click-modal="false">
  <el-form>
  <el-row>
    <el-col :span="12">
      <el-form-item style="color:blue">收货地址: {{currentRow.shippingAddress}}</el-form-item>
    </el-col>
  <el-col :span="8">
    <el-form-item><el-input placeholder="输入姓名/联系方式" v-model="nameOrPhone"></el-input></el-form-item>
  </el-col>
  <el-col :span="4">
    <el-form-item><el-button @click="searchDeliveryMan">查询</el-button></el-form-item>
  </el-col>
  </el-row>
  </el-form>

  
<el-table v-loading="deliveryManLoading"
      :data="_deliveryMen" ref="deliveryMen"
      style="width: 100%; margin-top:10px" border  highlight-current-row @current-change="handleDeliveryRowChange">

      <el-table-column
        label="姓名"
        width="300" align="center"
        >
        <template slot-scope="scope">
        {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column
        label="未完成"
        width="70" align="center"
        >
        <template slot-scope="scope">
        {{scope.row.undone}}
        </template>
      </el-table-column>

      <el-table-column
        label="接单状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>

      <el-table-column
        label="联系电话"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column
        label="工作地址"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.address}}
        </template>
      </el-table-column>
      

    </el-table>


    <!-- pagination -->
    <el-row>
      <el-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleDeliveryCurrentChange"
        :page-size="pageSize"
        prev-text="上一页"
        next-text="下一页"
        layout="total, prev, pager, next, jumper"
        :current-page="deliveryMenPage.currentPage"
        :total="deliveryMenPage.total">
      </el-pagination>
    </el-row>
    <el-row>
      
        <p style="text-align:right" v-if="currentDeliveryManRow.name">您选择了 {{currentDeliveryManRow.name}}
          <el-button type="primary" style="padding:5px" @click="sendDropIn">确认</el-button>
        </p>
        <p style="text-align:right" v-else>您还未选择派送员</p>
      </el-col>
    </el-row>
  
</el-dialog>

<!-- selfLifting dialog -->
<el-dialog title="请选择营业厅" :visible.sync="isSelfLiftingDialogVisible" width="80%"  :before-close="closeSelfLiftingDialog" id="audited"
:close-on-click-modal="false">
  <el-form>
    <el-row>
      <el-col :span="12">
        <el-form-item style="color:blue">收货地址: {{currentRow.shippingAddress}}</el-form-item>
      </el-col>
    <el-col :span="8">
      <el-form-item><el-input placeholder="输入营业厅名称/负责人/联系电话" v-model="nameOrPrincipalOrPhone"></el-input></el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item><el-button @click="searchHalls">查询</el-button></el-form-item>
    </el-col>
    </el-row>
  </el-form>
<el-table v-loading="hallLoading"
      :data="_businessHalls" ref="businessHall"
      style="width: 100%; margin-top:10px" border  highlight-current-row @current-change="handleHallRowChange">

      <el-table-column
        label="营业厅名称"
        width="230" align="center"
        >
        <template slot-scope="scope">
        {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column
        label="未完成量"
        width="70" align="center"
        >
        <template slot-scope="scope">
        {{scope.row.undone}}
        </template>
      </el-table-column>

      <el-table-column
        label="营业厅负责人"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.principal}}
        </template>
      </el-table-column>

      <el-table-column
        label="联系电话"
        width="250"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column
        label="工作地址"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.address}}
        </template>
      </el-table-column>
      

    </el-table>


    <!-- pagination -->
    <el-row>
      <el-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleHallCurrentChange"
        :page-size="pageSize"
        prev-text="上一页"
        next-text="下一页"
        layout="total, prev, pager, next, jumper"
        :current-page="businessHallPage.currentPage"
        :total="businessHallPage.total">
      </el-pagination>
    </el-row>
    <el-row>
      
        <p style="text-align:right" v-if="currentBusinessHallRow.name">您选择了 {{currentBusinessHallRow.name}}
          <el-button type="primary" style="padding:5px" @click="sendSelfLifting">确认</el-button>
        </p>
        <p style="text-align:right" v-else>您还未选择营业厅</p>
      </el-col>
    </el-row>
  
</el-dialog>

<!-- review dialog -->
<el-dialog title="请填写重回审单原因" :visible.sync="isReviewDialogVisible" width="50%"  :before-close="closeReviewDialog" id="audited"
:close-on-click-modal="false">
  <el-form>
    <el-form-item>
      <el-radio-group v-model="reviewRadio">

        <el-radio :label="1">用户要求转物流</el-radio>

        <el-radio :label="2">用户要求退单</el-radio>

        <el-radio :label="3">联系不上用户</el-radio>

        <el-radio :label="4">证件信息不一致</el-radio>

        <el-radio :label="5">其他</el-radio>

      </el-radio-group>
    </el-form-item>
    <el-form-item>

        <el-input v-model="reviewReason" placeholder="填写重回审单原因，50字以内"></el-input>

    </el-form-item>
    <el-form-item>
      <el-button @click="closeReviewDialog">关闭</el-button>
      <el-button  type="primary" @click="sendReview">提交</el-button>
    </el-form-item>

  </el-form>
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
import { submitPassedData, sendSafeCode, fetchUndispatchedOrders, fetchDeliveryMen,fetchBusinessHalls, sendDropIn,sendSelfLifting, sendReview} from '../api';
import {AuditMixin} from './mixins/AuditMixin'
  export default {
    mounted(){
      this.searchForm.isVisible = false;
      this.search();
    },
    mixins: [AuditMixin],
    computed: {
      _tableData(){
        if (this.tableData.length > 0)
          return this.tableData.slice((this.page.currentPage-1)*this.pageSize, this.page.currentPage*this.pageSize);
        else
          return [];
      },
      _deliveryMen(){
        if (this.deliveryMen.length > 0)
          return this.deliveryMen.slice((this.deliveryMenPage.currentPage-1)*this.pageSize, this.deliveryMenPage.currentPage*this.pageSize);
        else
          return [];
      },
      _businessHalls(){
        if (this.businessHalls.length > 0)
          return this.businessHalls.slice((this.businessHallPage.currentPage-1)*this.pageSize, this.businessHallPage.currentPage*this.pageSize);
        else
          return [];
      },

    },
    data() {
      return {

        deliveryMen:[],
        businessHalls:[],
        tableData: [],
        isDropInDialogVisible: false,
        isLoading:false,

        isSelfLiftingDialogVisible: false,

        isReviewDialogVisible: false,

        reviewRadio: 1,
        reviewReason:'',

        currentRow: [],


        nameOrPhone:'',
        deliveryManLoading: false,
        currentDeliveryManRow:[],
        deliveryMenPage: {
          total: 0,
          currentPage: 1
        },




        nameOrPrincipalOrPhone:'',
        hallLoading:false,
        currentBusinessHallRow:[],
        businessHallPage: {
          total: 0,
          currentPage: 1
        },

        pageSize: 5,

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
          scheduleReason:null,
          scheduleReasonOptions:[
            { 
              value:null,
              label:'--请选择--'
            },
            {
              value:'无匹配网格',
              label:'无匹配网格'
            },
            {
              value:'区县网格内无人接单',
              label:'区县网格内无人接单'
            },
            {
              value:'数据/服务异常',
              label:'数据/服务异常'
            },
            {
              value:'派单员回退',
              label:'派单员回退'
            },
            {
              value:'营业厅回退',
              label:'营业厅回退'
            },
            {
              value:'超时自动回退',
              label:'超时自动回退'
            },
            {
              value:'调度员超时',
              label:'调度员超时'
            },
            {
              value:'其他原因',
              label:'其他原因'
            },
          ],
          dispatchStatus:null,
          dispatchStatusOptions:[{
            value:null,
            label:'--请选择--'
          },{
            value:'首次派单',
            label:'首次派单'
          },{
            value:'再次派单',
            label:'再次派单'
          }],

          age: null,
          ageOptions:[{
            value:null,
            label:'--请选择--'
          },{
            value:1,
            label:'16岁以下',
          },{
            value:0,
            label:'16岁及以上'
          }],
          shippingAddress:''
        },




      };
    },
    methods: {
      handleDeliveryRowChange(val){
        if (val == null)
          val = []
        this.currentDeliveryManRow = val;
      },
      handleHallRowChange(val){
        if (val == null)
          val = []
        this.currentBusinessHallRow = val;
      },
      sendDropIn(){
        var params = {orderId: this.currentRow.orderId, phone:this.currentDeliveryManRow.phone, type:'courier' };
        sendDropIn(params).then(data => {

          console.log(data);

          // this.$set(this.tableData, this.currentRow.index, this.currentRow)
          this.$message({
            type: 'success',
            message: '提交成功!',
            duration: 3000
          });
          this.isLoading = false;
        }).catch(e => {
          this.isLoading = false;
          console.log(e);
        })
        this.closeDropInDialog();
      },
      sendSelfLifting(){
        var params = {orderId: this.currentRow.orderId, phone:this.currentBusinessHallRow.phone, type:'selfLifting' };
        sendDropIn(params).then(data => {

          console.log(data);

          // this.$set(this.tableData, this.currentRow.index, this.currentRow)
          this.$message({
            type: 'success',
            message: '提交成功!',
            duration: 3000
          });
          this.isLoading = false;
        }).catch(e => {
          this.isLoading = false;
          console.log(e);
        })
        this.closeSelfLiftingDialog();
      },
      sendReview(){
        var radios = ['用户要求转物流','用户要求退单','联系不上用户','证件信息不一致','其他'];

        
        var params = {orderId: this.currentRow.orderId,  reason: radios[this.reviewRadio-1]};
        sendReview(params).then(data => {

          console.log(data);

          // this.$set(this.tableData, this.currentRow.index, this.currentRow)
          this.$message({
            type: 'success',
            message: '提交成功!',
            duration: 3000
          });
          this.isLoading = false;
        }).catch(e => {
          this.isLoading = false;
          console.log(e);
        })
        this.closeReviewDialog();
      },
      fromNow(date){
        moment.locale('zh-cn');
        return moment(date).fromNow();
      },
      formatter(row, column) {
        return moment(row[column.property]).format('l');

      },
      dateFormatter(date){
        return moment(date).format('YYYY-MM-DD hh:mm:ss');
      },
      viewDetail(orderId){
        var href='http://admin.mall.10010.com/Odm/Sell/Order/OrderDetails?orderId='+orderId+'&orderType=1'
        window.open(href, '_blank');
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

            var params = {region:this.searchForm.region[1], orderNumber: this.searchForm.orderNumber, 
                          shippingAddress: this.searchForm.shippingAddress, dispatchStatus: this.searchForm.dispatchStatus,
                          dispatchReason: this.searchForm.scheduleReason, age:this.searchForm.age};
            fetchUndispatchedOrders(params).then(data => {
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

      searchDeliveryMan(){
            this.deliveryManLoading = true;
            fetchDeliveryMen({nameOrPhone:this.nameOrPhone}).then(data => {
              // console.log(data);
              this.deliveryMen = data;
              this.$set(this.deliveryMenPage,'total',this.deliveryMen.length);
              if (this.deliveryMen.length>0){
                this.$set(this.deliveryMenPage,'currentPage',1);
              }
              else{

                this.$message({
                  type: 'error',
                  message: '不存在符合上述条件的数据!',
                  duration: 3000
                });
              }
              this.deliveryManLoading = false;
            }).catch(e => {
              this.deliveryManLoading = false;
              console.log(e);
            })  
      },
      searchHalls(){
            // this.$refs.businessHall.setCurrentRow(null);
            this.hallLoading = true;
            fetchBusinessHalls({nameOrPrincipalOrPhone:this.nameOrPrincipalOrPhone}).then(data => {
              this.businessHalls = data;
              console.log(this.businessHalls[0])
              this.$set(this.businessHallPage,'total',this.businessHalls.length);
              if (this.businessHalls.length>0){
                this.$set(this.businessHallPage,'currentPage',1);
              }
              else{

                this.$message({
                  type: 'error',
                  message: '不存在符合上述条件的数据!',
                  duration: 3000
                });
              }
              
              this.hallLoading = false;
            }).catch(e => {
              // this.$refs.businessHall.setCurrentRow(null);
              this.hallLoading = false;
              console.log(e);
            })  
      },
      dropIn(row, index){
        this.currentRow = row;
        this.currentRow.index = index;


        // this.fetchPictures();
        this.isDropInDialogVisible = true;
      },
      selfLifting(row, index){
        this.currentRow = row;
        this.currentRow.index = index;

        // this.fetchPictures();
        this.isSelfLiftingDialogVisible = true;
      },
      review(row, index){
        this.currentRow = row;
        this.currentRow.index = index;

        // this.fetchPictures();
        this.isReviewDialogVisible = true;
      },

      closeReviewDialog(){
        this.isReviewDialogVisible = false;
        this.reviewReason = '';
      },

      closeDropInDialog(){
        this.$refs.deliveryMen.setCurrentRow(null);
        this.isDropInDialogVisible = false;
        this.currentDeliveryManRow = [];
      },
      closeSelfLiftingDialog(){
        this.$refs.businessHall.setCurrentRow(null);
        this.isSelfLiftingDialogVisible= false;
        this.currentBusinessHallRow = [];
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
      },
      handleDeliveryCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.$set(this.deliveryMenPage,'currentPage',val);
      },
      handleHallCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.$set(this.businessHallPage,'currentPage',val);
      }
    }
  }
</script>

