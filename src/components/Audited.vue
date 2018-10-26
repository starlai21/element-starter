<template>
  <div >
    <el-card  shadow="hover" :body-style="searchForm.bodyStyle" >
      <div slot="header" class="clearfix">
        <el-form :inline="true"  >
          <el-form-item label="最近一次稽核时间">
<!--             <el-col :span="11">
              <el-form-item prop="updateFrom">
                <el-date-picker type="date" placeholder="起始时间"  v-model="searchForm.updateFrom" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="updateTo">
                <el-date-picker type="date" placeholder="终止时间"  v-model="searchForm.updateTo" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col> -->
             <el-date-picker
              v-model="searchForm.updateDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              style="width:100%;"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item v-if="!isAdmin">
            <el-button type="success" @click="submitPassedData" :loading="submitLoading">一键提交</el-button>
          </el-form-item>
          <el-form-item v-else>
            <el-button type="success" @click="generateReport" :loading="submitLoading">生成报表</el-button>
          </el-form-item>
              <el-button style="float: right; padding: 14px 0px" type="text" @click="searchForm.isVisible = !searchForm.isVisible">
                <span v-if="searchForm.isVisible">折叠</span>
                <span v-else>展开</span>
              </el-button>
        </el-form>
      </div>
      <div>
        <transition name="el-zoom-in-top">
         <el-form ref="searchForm" :model="searchForm" label-width="80px" v-show="searchForm.isVisible">
<!--                 <el-form-item label="手机号码" prop="mobile" :rules="{pattern: /^1[34578]\d{9}$/, message: '请输入有效的手机号码！', trigger: 'blur'}" style="margin-top:10px"> -->
                <el-form-item label="手机号码" prop="mobile"  style="margin-top:10px">
                  <el-input v-model="searchForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="发展渠道" prop="channel"  style="margin-top:10px">
                  <el-input v-model="searchForm.channel"></el-input>
                </el-form-item>
                <el-form-item label="县分" prop="county"  style="margin-top:10px" v-if="isAdmin">
                  <el-input v-model="searchForm.county"></el-input>
                </el-form-item>
                <el-form-item label="一证N户" prop="types">
                  <el-select v-model="searchForm.types" multiple placeholder="请选择类型" style="width: 100%" clearable>
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="靓号级别" prop="specialTypes">
                  <el-select v-model="searchForm.specialTypes" multiple placeholder="请选择类型" style="width: 100%" >
                    <el-option
                      v-for="item in specialtyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>        
                </el-form-item>
                <el-form-item label="稽核结果" prop="states">
                  <el-select v-model="searchForm.states" multiple placeholder="请选择类型" style="width: 100%" >
                    <el-option
                      v-for="item in statesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>        
                </el-form-item> 
                <el-form-item label="稽核结果" prop="adminStates" v-if="isAdmin">
                  <el-select v-model="searchForm.adminStates" multiple placeholder="市公司稽核结果" style="width: 100%">
                    <el-option
                      v-for="item in statesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>        
                </el-form-item>

<!--                  <el-form-item label="入网时间">
                   <el-col :span="11">
                     <el-form-item prop="startDate">
                       <el-date-picker type="date" placeholder="起始时间"  v-model="searchForm.startDate" style="width: 100%;"></el-date-picker>
                     </el-form-item>
                   </el-col>
                   <el-col class="line" :span="2">-</el-col>
                   <el-col :span="11">
                     <el-form-item prop="endDate">
                       <el-date-picker type="date" placeholder="终止时间"  v-model="searchForm.endDate" style="width: 100%;" :default-time="['23:59:59', '23:59:59']"></el-date-picker>
                     </el-form-item>
                   </el-col>
                 </el-form-item> -->
                 <!-- :default-time="['00:00:00', '23:59:59']" -->
                 <el-form-item label="入网时间" prop="entryDate">
                   <el-date-picker
                    v-model="searchForm.entryDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"

                    style="width:100%;"
                    >
                  </el-date-picker>
                 </el-form-item>

                <el-form-item>
                  <el-button type="info" @click="clearForm('searchForm')">重置</el-button>
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button type="warning" @click="exportExcel" :loading="downloadLoading">导出</el-button>
                </el-form-item>
          </el-form> 
          </transition>
      </div>

    </el-card>
    <el-table v-loading="isLoading"
      :data="tableData"
      style="width: 100%; margin-top:10px" border stripe @cell-click="cellClicked">

      <el-table-column
        fixed
        prop="state"
        label="稽核结果"
        width="150" align="center"
        >
        <template slot-scope="scope">
          <el-tag v-if="stateFormatter(scope.row.state) ==='人工审核通过'" type="success">{{stateFormatter(scope.row.state)}}</el-tag>
          <el-tag v-else-if="stateFormatter(scope.row.state) ==='人工审核未通过'" type="danger">{{stateFormatter(scope.row.state)}}</el-tag>
          <el-tag v-else-if="stateFormatter(scope.row.state) ==='已重新取照-待二审'" >{{stateFormatter(scope.row.state)}}</el-tag>
          <el-tag v-else type="warning">{{stateFormatter(scope.row.state)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="isAdmin"
        fixed
        prop="state"
        label="稽核结果(管理员)"
        width="150" align="center"
        >
        <template slot-scope="scope">
          <el-tag v-if="stateFormatter(scope.row.adminStatus) ==='人工审核通过'" type="success">{{stateFormatter(scope.row.adminStatus)}}</el-tag>
          <el-tag v-else-if="stateFormatter(scope.row.adminStatus) ==='人工审核未通过'" type="danger">{{stateFormatter(scope.row.adminStatus)}}</el-tag>
          <el-tag v-else-if="stateFormatter(scope.row.adminStatus) ==='已重新取照-待二审'" >{{stateFormatter(scope.row.adminStatus)}}</el-tag>
          <el-tag v-else type="warning">{{stateFormatter(scope.row.adminStatus)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="submitted"
        label="提交状态"
        width="100" align="center"
        >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.submitted === 1" type="success">已提交</el-tag>
          <el-tag v-else type="danger">未提交</el-tag>

        </template>
      </el-table-column>
<!--       <el-table-column
        prop="entryDate"
        label="入网日期"
        sortable
        width="180"
        :filters="entryDateFilter"
        :filter-method="entryDateFilterHandler" align="center"
      > -->
      <el-table-column
        prop="entryDate"
        label="入网日期"
        sortable
        width="180"
        :formatter="formatter"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="号码"
        width="200" align="center">
      </el-table-column>
      <el-table-column
        prop="countyId"
        label="县分"
        width="100" align="center">
      </el-table-column>  

      <el-table-column
        prop="channel"
        label="发展渠道" align="center" width="400"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="80" align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="一证N户"
        width="100" align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="套餐"
        width="200" align="center">
      </el-table-column>
      <el-table-column
        prop="specialType"
        label="靓号类型"
        width="100" align="center">
      </el-table-column>
     <!--  <el-table-column
        prop="checkLogs[0].note"
        label="备注" align="center" width="400"
      >
      </el-table-column>
      <el-table-column
        prop="auditDate"
        label="稽核日期"
        sortable
        width="180"
        :filters="auditDateFilter"
        :filter-method="auditDateFilterHandler" align="center"
      >
      <el-table-column
        prop="checkLogs"
        label="稽核日期"
        sortable
        width="180"
        :formatter="auditDateFormatter"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="checkLogs[0].operatorId"
        label="稽核工号"
        width="200" align="center">
      </el-table-column> -->
<!--       <el-table-column
          prop="idPicture"
          header-align="center"
          align="center"
          width="100"
          label="照片">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              title="现场照/证件照"
              trigger="click">
              <img :src="scope.row.livingPicture"/>
              <img :src="scope.row.idPicture"/>
              <img slot="reference" :src="scope.row.livingPicture" :alt="scope.row.livingPicture" style="max-height: 100px;max-width: 80px">
            </el-popover>
          </template>
      </el-table-column> -->
      <el-table-column
        fixed="right"
        label="操作"
        width="150" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="click">
            <el-table :data="logs" border v-loading="logLoading">
              <el-table-column width="220" property="status" label="稽核结果" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="stateFormatter(scope.row.status) ==='人工审核通过'" type="success">{{stateFormatter(scope.row.status)}}</el-tag>
                  <el-tag v-else-if="stateFormatter(scope.row.status) ==='人工审核未通过'" type="danger">{{stateFormatter(scope.row.status)}}</el-tag>
                  <el-tag v-else-if="stateFormatter(scope.row.status) ==='已重新取照-待二审'" >{{stateFormatter(scope.row.status)}}</el-tag>
                  <el-tag v-else type="warning">{{stateFormatter(scope.row.status)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="200" property="insertDate" label="稽核日期" align="center" :formatter="auditDateFormatter"></el-table-column>
              <el-table-column width="600" property="note" label="备注" align="center"></el-table-column>
              <el-table-column width="100" property="username" label="稽核工号" align="center"></el-table-column>
            </el-table>
            <el-button slot="reference" type="primary" @click="fetchLogs(scope.row)">查看日志</el-button>
          </el-popover>
          <!-- <el-button type="primary" @click="reaudit(scope.row,scope.$index)">查看稽核日志</el-button> -->
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
<el-dialog :title="currentRowState" :visible.sync="isReauditDialogVisible" width="85%"  :before-close="handleClose" id="audited">
          <el-row>
            <el-col :span="8">
              <el-card :body-style="{ padding: '10px' }" >
                <el-form label-position="left" label-width="80px" >
                  <el-form-item label="客户姓名:">
                    {{currentRow.name}}
                  </el-form-item>
                  <el-form-item label="手机号码:">
                    {{currentRow.mobile}}
                  </el-form-item>
                  <el-form-item label="身份证号:">
                    {{currentRow.id}}
                  </el-form-item>
                  <el-form-item label="码上购:">
                    {{currentRow.isMaShangGou | msgFormatter}}
                  </el-form-item>
                  <el-form-item label="发展渠道:">
                    {{currentRow.channel | showPart}}
                  </el-form-item>
                  <el-form-item label="入网时间:">
                    {{currentRow.entryDate | dateFormatter}}
                  </el-form-item>
                  <el-form-item label="一证N户:">
                    {{currentRow.type}}
                  </el-form-item>
                  <el-form-item label="靓号类型:">
                    {{currentRow.specialType}}
                  </el-form-item>
                </el-form>
              </el-card> 
            </el-col>

            <el-col :span="6" :offset="2" >
              <el-card :body-style="{ padding: '0px' }" v-loading="pictureLoading" class="box-card">
                <img :src="livingPic(currentRow.pictures)" class="my-image" v-viewer>
                <div style="padding: 14px;">
                  <span>现场照 <template v-if="isLiving(currentRow.pictures)">(活体)</template></span> 
                  <el-popover  trigger="click" v-if="isVideoExist(currentRow.pictures)">
                    <video-player :options="playerOptions"></video-player>
                    <el-button type="primary" style="padding:4px" icon="el-icon-view" slot="reference">查看视频</el-button>
                  </el-popover>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6" :offset="2">
<!--               <el-card :body-style="{ padding: '0px' }" v-loading="pictureLoading">
                <img :src="idPic(currentRow.pictures)" class="image" v-viewer>
                <div style="padding: 14px;">
                  <span>身份证照</span>
                </div>
              </el-card> -->
              <el-card :body-style="{ padding: '0px' }" v-loading="pictureLoading" class="box-card">
                <div>
                  <template v-if="isIdPicLengthGt1(currentRow.pictures)">
                    <img :src="idPic(currentRow.pictures)" class="id-image-first" v-viewer>
                    <img :src="idPic(currentRow.pictures,4)" class="id-image" v-viewer>
                    <img :src="idPic(currentRow.pictures,3)" class="id-image" v-viewer>
                  </template>
                  <template v-else>
                    <img :src="idPic(currentRow.pictures)" class="my-image" v-viewer>
                  </template>
                </div>
                <div style="padding: 14px; ">
                  <span>身份证照</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- operations -->
          <el-row style="margin-top: 20px">
            <el-col :span="1" >
              <el-button type="success" style="padding: 16px" @click="onSubmit('success')" :loading="successLoading">通过</el-button>
            </el-col>       

                <el-col :span="4" :offset="9">
                  <el-select v-model="violationValue" placeholder="实名违规" clearable>
                    <el-option
                      v-for="item in violationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
    
                <el-col :span="6" :offset="1">
                  <el-input type="textarea" v-model="note" placeholder="备注"></el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                  <el-button type="danger" style="padding: 16px" @click="onSubmit('failure')" :loading="failureLoading">未通过</el-button>
                </el-col>
            
          </el-row>

</el-dialog>





<!-- 生成报表的 dialog -->
<el-dialog
  title="生成报表"
  :visible.sync="isDialogVisible"
  width="30%"
  top="30vh"
 >
 <el-form label-position="left" label-width="120px">

  <el-form-item label="数据插入日期">
    <el-date-picker
      v-model="reportInsertDate"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyyMMdd"
      style="width:75%;">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="用户入网日期" >
    <el-date-picker
      v-model="reportEntryDate"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      type="daterange"
      placeholder="选择日期"
      format="yyyy/MM/dd"
      value-format="yyyy-MM-dd"
      style="width:75%;">
    </el-date-picker>
  </el-form-item>

 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="generateReportBtnClicked(1)">稽核报表</el-button>
        <el-button type="primary" @click="generateReportBtnClicked(2)">不合规报表</el-button>
  </span>
</el-dialog>




  </div>

</template>
<style type="text/css" scoped>
  #audited .el-form-item{
    margin-bottom: 8px;
  }
  .my-image {
    width:100%;
    height:360px;
  }

  .id-image{
    width:49%;
    height:155px;
  }
  .id-image-first{
    width:100%;
    height:200px;
  }

  .box-card{
/*    width: 300px;
    height: 414px;*/
    width: 100%;
    height: 100%;
  }


</style>

<script>
import moment from 'moment';
import {fetchAuditedData, postAuditingForm, fetchLogs, fetchPictures, submitPassedData, sendSafeCode, downloadExcel, generateReport} from '../api';
import {AuditMixin} from './mixins/AuditMixin'
// import { mapState } from 'vuex'
  export default {
    mounted(){
      this.searchForm.isVisible = false;
      this.search();
    },
    mixins: [AuditMixin],
    computed: {
      entryDateFilter: function(){
        var entryDates = this.tableData.map(function(a) {return a.entryDate;});
        var _entryDates = [];
        entryDates.filter(this.unique).forEach(function(e){
          _entryDates.push({text: e, value: e});
        });
        return _entryDates;
      },
      auditDateFilter: function(){
        var auditDates = this.tableData.map(function(a) {return a.auditDate;});
        var _auditDates = [];
        auditDates.filter(this.unique).forEach(function(e){
          _auditDates.push({text: e, value: e});
        });
        return _auditDates;
      },
      _tableData(){
        if (this.tableData.length > 0)
          return this.tableData.slice((this.page.currentPage-1)*this.pageSize, this.page.currentPage*this.pageSize);
        else
          return [];
      },
      isAdmin(){
        return this.$store.state.isAdmin;
      }
    },
    data() {
      return {
        tableData: [],
        isReauditDialogVisible: false,
        currentRowState: "原稽核结果为: ",
        currentRow: [],
        pageSize: 8,
        logLoading: false,
        logs: [],
        pictureLoading: false,
        submitLoading:false,
        isDialogVisible: false,
        reportInsertDate: null,
        reportEntryDate: null



      };
    },
    methods: {

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

          if (!this.isAdmin)
            this.currentRow.state = state;
          else
            this.currentRow.adminStatus = state;

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
      unique(value, index, self){
        return self.indexOf(value) === index;
      },

      formatter(row, column) {
        return moment(row[column.property]).format('l');

      },
      auditDateFormatter(row, column){
        return moment(row[column.property]).format('YYYY-MM-DD hh:mm a');
      },
      filterTag(value, row) {
        return row.state === value;
      },
      entryDateFilterHandler(value, row, column) {
        return row.entryDate === value;
      },
      auditDateFilterHandler(value, row, column) {
        return row.auditDate  === value;
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
      search(clickFromButton = true){

        if (clickFromButton){
          this.$set(this.page,'currentPage',1);
        }
        this.$refs['searchForm'].validate((valid) => {

          if (valid) {
            this.isLoading = true;
            if (this.searchForm.entryDate && this.searchForm.entryDate.length == 2){
                this.searchForm.startDate = this.searchForm.entryDate[0];
                this.searchForm.endDate = this.searchForm.entryDate[1];
              }
            else{
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
              }
            if (this.searchForm.updateDate && this.searchForm.updateDate.length == 2){
              this.searchForm.updateFrom = this.searchForm.updateDate[0];
              this.searchForm.updateTo = this.searchForm.updateDate[1];
              }
            else{
                this.searchForm.updateFrom = null;
                this.searchForm.updateTo = null;
              }


            var params = {mobile: this.searchForm.mobile, types: this.searchForm.types, channel: this.searchForm.channel, 
                         startDate: this.searchForm.startDate, endDate: this.searchForm.endDate, adminStates: this.searchForm.adminStates,
                         specialTypes: this.searchForm.specialTypes, states: this.searchForm.states, updateFrom: this.searchForm.updateFrom, updateTo: this.searchForm.updateTo, county:this.searchForm.county, currentPage: this.page.currentPage-1};
            // console.log(params);
            fetchAuditedData(params).then(data => {
              // console.log(data);

              this.tableData = data.content;
              this.$set(this.page,'total',data.totalElements);
              if (this.tableData.length>0){
                // this.$set(this.page,'currentPage',1);
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
        this.search(false);
      },
      rowClicked(row, event, column){

        this.reaudit(row, this.tableData.indexOf(row));

      },
      cellClicked(row, column, cell, event){
        if(column.label === '稽核结果' || column.label ==='稽核结果(管理员)'){
          this.reaudit(row, this.tableData.indexOf(row));
        }
        else{
        }
      },
      fetchLogs(row){
        this.logs = [];
        this.logLoading = true;
        fetchLogs({userUuid: row.uuid}).then(data => {
          this.logLoading = false;
          // console.log(this.logLoading)
          console.log(data);
          this.logs = data;
        }).catch( e => {
          this.logLoading = false;
          console.log(e);
        })
      },
      fetchPictures(){
        if (!this.currentRow.pictures){
          this.pictureLoading = true;
          fetchPictures({userUuid: this.currentRow.uuid}).then(data => {
            console.log(data);
            this.pictureLoading = false;
            this.$set(this.currentRow, 'pictures', data);
            this.$set(this.tableData, this.currentRow.index, this.currentRow);
          }).catch(e => {
            this.pictureLoading = false;
            console.log(e);
          })
        }
      },
      exportExcel(){
        var params = {mobile: this.searchForm.mobile, types: this.searchForm.types, channel: this.searchForm.channel, 
                     startDate: this.searchForm.startDate, endDate: this.searchForm.endDate, adminStates: this.searchForm.adminStates,
                     specialTypes: this.searchForm.specialTypes, states: this.searchForm.states, updateFrom: this.searchForm.updateFrom, updateTo: this.searchForm.updateTo, county:this.searchForm.county, currentPage: this.page.currentPage-1};

        this.downloadLoading = true;
        downloadExcel(params)
            .then(res => {
              // console.log(res);
              if (res.data.size === 0){
                this.$message({
                  type: 'error',
                  message: '不存在符合上述条件的数据, 导出失败!',
                  duration: 3000
                });
                this.downloadLoading = false;
                return;
              }
              const blob = res.data
              const reader = new FileReader()
              reader.readAsDataURL(blob)
                  reader.onload = (e) => {
                    const a = document.createElement('a')
                    a.download = '已稽核清单__' + this.dateFormatter(new Date())
                    a.href = e.target.result
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    this.downloadLoading = false;
              }
            })
            .catch(e => {
              this.downloadLoading = false;
                this.$message({
                  type: 'error',
                  message: '不存在符合上述条件的数据, 导出失败!',
                  duration: 3000
              });
            })

      },
      generateReport(){
        this.isDialogVisible = true;
      },
      generateReportBtnClicked(reportType = 1){

        if (this.reportEntryDate == null && this.reportInsertDate == null){
          this.$message({
                  type: 'error',
                  message: '请选择插入日期或入网日期',
                  duration: 3000
              });
        }
        else{
          this.isDialogVisible = false;
          this.submitLoading = true;
          var joinDateFrom = null, joinDateTo = null;

          if (this.reportEntryDate && this.reportEntryDate.length == 2){
            joinDateFrom = this.reportEntryDate[0];
            joinDateTo = this.reportEntryDate[1];
          }
          generateReport({insertDate:this.reportInsertDate, joinDateFrom:joinDateFrom, joinDateTo:joinDateTo, reportType:reportType})
              .then(res => {
                if (res.data.size === 0){
                  this.$message({
                    type: 'error',
                    message: '不存在符合上述条件的数据, 导出失败!',
                    duration: 3000
                  });
                  this.submitLoading = false;
                  return;
                }
                const blob = res.data
                const reader = new FileReader()
                reader.readAsDataURL(blob)
                    reader.onload = (e) => {
                      const a = document.createElement('a')
                      var fileName = '稽核日报__';
                      if (reportType == 2)
                        fileName = '不合规报表__'
                      a.download = fileName + this.dateFormatter(new Date())
                      a.href = e.target.result
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      this.submitLoading = false;
                }
              })
              .catch(e=>{
                this.submitLoading = false;
                console.log(e);
              })
        }
      }

    }
  }
</script>

