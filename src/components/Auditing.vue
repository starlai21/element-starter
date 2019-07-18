<template>
	<div>
		<el-row>
            <el-card shadow="hover" :body-style="searchForm.bodyStyle">
              <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toggleSearchForm">
                  <span v-if="searchForm.isVisible">折叠</span>
                  <span v-else>展开</span>
                </el-button>
              </div>          
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
                  <el-select v-model="searchForm.types" placeholder="请选择类型" style="width: 100%" multiple>
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>

                  </el-select>
                </el-form-item>
<!-- 
                <el-form-item label="入网时间">
                  <el-col :span="11">
                    <el-form-item prop="startDate">
                      <el-date-picker  type="date" placeholder="起始时间" v-model="searchForm.startDate" style="width: 100%;" clearable></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="endDate">
                      <el-date-picker   type="date" placeholder="终止时间" v-model="searchForm.endDate" style="width: 100%;" clearable></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item> -->

                <el-form-item label="靓号级别" prop="specialTypes">
                  <el-select v-model="searchForm.specialTypes" multiple placeholder="请选择类型" style="width: 100%">
                    <el-option
                      v-for="item in specialtyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>        
                </el-form-item> 
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
              <template v-if="isAdmin">
                <el-form-item label="稽核结果" prop="states">
                  <el-select v-model="searchForm.states" multiple placeholder="县分稽核结果" style="width: 100%">
                    <el-option
                      v-for="item in statesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>        
                </el-form-item>
                <el-form-item label="稽核结果" prop="adminStates">
                  <el-select v-model="searchForm.adminStates" multiple placeholder="市公司稽核结果" style="width: 100%">
                    <el-option
                      v-for="item in statesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>        
                </el-form-item>
                <el-form-item label="码上购" prop="msg"  style="margin-top:10px">
                  <el-switch
                    v-model="searchForm.msg"
                    active-text="是"
                    inactive-text="否">
                  </el-switch>
                </el-form-item>
                <el-form-item label="需要抽查" prop="needSpotCheck"  style="margin-top:10px">
                  <el-switch
                    v-model="searchForm.needSpotCheck"
                    active-text="是"
                    inactive-text="否">
                  </el-switch>
                </el-form-item>
              </template>
                <el-form-item>
                  <el-button type="info" @click="clearForm('searchForm')">重置</el-button>
                  <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
              </el-form>
            </transition>
          

              <!-- display current search conditions -->
              <div v-show="!searchForm.isVisible">
                <el-tag v-show="searchForm.mobile != ''">手机号码: {{searchForm.mobile}}</el-tag>
                <el-tag type="success"  v-show="searchForm.types.length > 0">一证N户: <template v-for="t in searchForm.types">{{t}} </template></el-tag>
                <el-tag type="info"  v-show="searchForm.channel != ''">发展渠道:{{searchForm.channel}} </el-tag>
                <el-tag type="warning" v-show="searchForm.startDate != null">起始时间: {{searchForm.startDate | dateFormatter}}</el-tag>
                <el-tag type="warning" v-show="searchForm.endDate != null">终止时间: {{searchForm.endDate | dateFormatter}}</el-tag>
                <el-tag type="danger" v-show="searchForm.specialTypes.length > 0">靓号类型: <template v-for="t in searchForm.specialTypes">{{t}} </template>
                </el-tag>
              </div>                

            </el-card>
        </el-row>

          <!-- user pictures -->
        <div v-show="isAuditUIVisible">
          <el-row v-loading="isLoading">
            <el-col :span="8" >
<!--               用户信息
              <br> -->
<!--               <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress> -->

              <el-card :body-style="{ padding: '13px' }" >
                <div slot="header" v-if="isAdmin">
                  稽核状态:  &nbsp 
                  <el-tag v-if="auditing.state && auditing.state === 1" type="success">人工审核通过|县分</el-tag>
                  <el-tag v-else-if="auditing.state && auditing.state !== 2" type="danger">{{auditing.state}}|县分</el-tag>
                  <el-tag v-else-if="auditing.state && auditing.state === 2" type="danger">人工审核未通过|县分</el-tag>
                  <el-tag v-else type="warning">未稽核|县分</el-tag>

                  <el-tag v-if="auditing.adminStatus && auditing.adminStatus === 1" type="success">人工审核通过|市公司</el-tag>
                  <el-tag v-else-if="auditing.adminStatus && auditing.adminStatus !== 2" type="danger">{{auditing.adminStatus}}|市公司</el-tag>
                  <el-tag v-else-if="auditing.adminStatus && auditing.adminStatus === 2" type="danger">人工审核未通过|市公司</el-tag>
                  <el-tag v-else type="warning">未稽核|市公司</el-tag>
                </div>
                <div slot="header" v-else>
                  稽核状态:  &nbsp 
                  <el-tag v-if="auditing.state && auditing.state === 1" type="success">人工审核通过</el-tag>
                  <el-tag v-else-if="auditing.state" type="danger">{{auditing.state}}</el-tag>
                  <el-tag v-else type="warning">未稽核</el-tag>
                </div>
                <el-form label-position="left" label-width="100px" id="userInfo">
                  <el-form-item label="客户姓名:">
                    {{auditing.name}}
                  </el-form-item>
                  <el-form-item label="手机号码:">
                    {{auditing.mobile}}
                  </el-form-item>
                  <el-form-item label="身份证号:">
                    {{auditing.id | processId}}
                  </el-form-item>
                  <el-form-item label="系统来源:">
                    {{auditing | msgFormatter}}
                  </el-form-item>
                  <el-form-item label="发展渠道:">
                    {{auditing.channel | showPart}}
                  </el-form-item>
                  <el-form-item label="入网时间:">
                    {{auditing.entryDate | dateFormatter}}
                  </el-form-item>
                  <el-form-item label="一证N户:">
                    {{auditing.type}}
                  </el-form-item>
                  <el-form-item label="靓号类型:">
                    {{auditing.numType}}
                  </el-form-item>
                  <el-form-item label="县分:" v-if="isAdmin">
                    {{auditing.countyId}}
                  </el-form-item>
                  <el-form-item label="对比度:" v-if="auditing.dbd">
                    {{auditing.dbd}}
                  </el-form-item>
                </el-form>

              </el-card> 
            </el-col>



            <el-col :span="6" :offset="2" >
              <video-player :options="playerOptions" v-show="isVideoExist(auditing.pictures)"></video-player>
              <el-card :body-style="{ padding: '0px' }" v-loading="pictureLoading" class="box-card" v-if="livingPicExists(auditing.pictures)">

                <img :src="livingPic(auditing.pictures)" class="my-image" v-viewer>                
                <div style="padding: 14px;">
                  <span>现场照 <template v-if="isLiving(auditing.pictures)">(活体)</template></span> 
                </div>
              </el-card>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-card :body-style="{ padding: '0px' }" v-loading="pictureLoading" class="box-card">
                <div>
                  <template v-if="isIdPicLengthGt1(auditing.pictures)">
                    <img :src="idPic(auditing.pictures)" class="id-image-first" v-viewer>
                    <img :src="idPic(auditing.pictures,4)" class="id-image" v-viewer>
                    <img :src="idPic(auditing.pictures,3)" class="id-image" v-viewer>
                  </template>
                  <template v-else>
                    <img :src="idPic(auditing.pictures)" class="my-image" v-viewer>
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
                  <el-select v-model="violationValue" placeholder="未通过原因" clearable>
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


          <!-- paginations -->
          <el-row v-loading="isLoading">
            <el-pagination
              style="margin-top: 20px"
              @current-change="handleCurrentChange"
              layout=" prev, pager, next, jumper, slot"
              prev-text="上一页"
              next-text="下一页"
              :current-page.sync="page.currentPage"
              :page-count="page.total">
              <!-- <el-button style="padding: 0px; margin-left:30px">下一批</el-button> -->
            </el-pagination>

           
            
          </el-row>
        </div>
    </div>
</template>

<style type="text/css" scoped>
  .el-row {
    margin:5px;
  }

  #userInfo .el-form-item{
    margin-bottom: 0px;
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
    width: 100%;
    height: 100%;
  }



</style>
<script type="text/javascript">
import moment from 'moment';
import {fetchAuditingData,postAuditingForm, fetchPictures} from '../api';
import {AuditMixin} from './mixins/AuditMixin'
// import { mapState } from 'vuex'

	export default {
    mixins: [AuditMixin],
    computed:{
      isAdmin(){
        return this.$store.state.isAdmin;
      }
    },
    data(){
      return {
        isAuditUIVisible: false,
        auditings: [],
        auditing: [],
        currentIndex: -1,
      };
    },

  	methods: {	
    	search(){
      		this.$refs['searchForm'].validate((valid) => {
	        	if (valid) {
              this.isLoading = true;
              this.isAuditUIVisible =true;
              if (this.searchForm.entryDate && this.searchForm.entryDate.length == 2){
                this.searchForm.startDate = this.searchForm.entryDate[0];
                this.searchForm.endDate = this.searchForm.entryDate[1];
              }
              else{
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
              }

              var params = {mobile: this.searchForm.mobile, types: this.searchForm.types, channel: this.searchForm.channel, states:this.searchForm.states, 
                              adminStates: this.searchForm.adminStates, startDate: this.searchForm.startDate, endDate: this.searchForm.endDate,
                             specialTypes: this.searchForm.specialTypes, county: this.searchForm.county, msg:this.searchForm.msg? 1:0, needSpotCheck:this.searchForm.needSpotCheck ? 1:0};
               console.log(params) 
               fetchAuditingData(params).then(data => {
                
                // this.auditings = data.auditings;
                 this.auditings = data.data;
                 this.$set(this.page,'total',this.auditings.length);
                 // this.$set(this.page,'total',data.totalElements);
                 if (this.auditings.length>0){
                   this.auditing = this.auditings[0];
                   this.fetchPictures();
                   this.isAuditUIVisible = true;
                   this.$set(this.page,'currentPage',1);
                 }
                 else{
                   // this.auditing = []
                   this.$message({
                     type: 'error',
                     message: '不存在符合上述条件的用户!',
                     duration: 3000
                   });
                   this.isAuditUIVisible = false;
                 }
                   
                   this.currentIndex = 0;
                 
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

    	toggleSearchForm(){
	      this.searchForm.isVisible = !this.searchForm.isVisible;
	      if(this.isConditionChanged())
	        this.searchForm.bodyStyle.padding = '10px';
	      else
	        this.searchForm.bodyStyle.padding = '0px';
	    },
	 
	    isConditionChanged(){
	      var form = this.searchForm;
	      return form.mobile != '' || form.type != '' || form.channel != '' || form.isSpecial || form.startDate != null || form.endDate != null;
	    },		
	    send(state) {
         // save in the db
        var type = this.violationValue
        if (state === 1){
          this.successLoading=true;
          type = 0;
        }
        else
          this.failureLoading=true;


        var params = {state: state, note: this.note, type: type, uuid: this.auditing.uuid, idPicUuid:"", livingPicUuid:"",
                      subscriptionId: this.auditing.subscriptionId};
        postAuditingForm(params).then(data => {

          this.$message({
            type: 'success',
            message: '提交成功!',
            duration: 3000
          });
          this.successLoading = false;
          this.failureLoading = false;
         var des = '';
         if (state === 1)
           des = 1;
         else
           des = this.violationOptions.find((obj) => obj.value === this.violationValue).label;
          // des = this.violationOptions[parseInt(this.violationValue)-1].label;
          this.resetAuditForm();

          if (this.isAdmin){
            this.$set(this.auditing, 'adminStatus', des);
          }
          else{
            this.$set(this.auditing, 'state', des);
          }
         
         this.$set(this.auditings, this.currentIndex, this.auditing);
         if (this.page.currentPage < this.page.total){
           this.$set(this.page,'currentPage', this.page.currentPage+1);
           this.handleCurrentChange(this.page.currentPage);
         }

        }).catch(e => {
          console.log(e);
        })

         

	    },
      handleCurrentChange(val){
        this.currentIndex = val-1;
        this.auditing = this.auditings[val-1];
        this.fetchPictures();
      },
      fetchPictures(){
        if (!this.auditing.pictures){
          this.pictureLoading = true;
          fetchPictures({userUuid: this.auditing.uuid}).then(data => {
            // console.log(data);
            this.pictureLoading = false;
            this.$set(this.auditing, 'pictures', data.data);
            this.$set(this.auditings, this.currentIndex, this.auditing);
          }).catch(e => {
            this.pictureLoading = false;
            console.log(e);
          })
        }
      }
	  }
	}
</script>