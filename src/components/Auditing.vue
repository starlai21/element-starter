<template>
	<div>
		<el-row>
            <el-card class="box-card" shadow="hover" :body-style="searchForm.bodyStyle">
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
                <el-form-item label="发展渠道" prop="channels">
                  <el-select v-model="searchForm.channels" placeholder="请选择类型" style="width: 100%" clearable multiple>
                    <el-option
                      v-for="item in channelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间筛选">
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
                </el-form-item>
                <el-form-item label="靓号类型" prop="specialTypes">
                  <el-select v-model="searchForm.specialTypes" multiple placeholder="请选择类型" style="width: 100%">
                    <el-option
                      v-for="item in specialtyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>        
                </el-form-item> 
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
                <el-tag type="info"  v-show="searchForm.channels.length > 0">发展渠道:<template v-for="t in searchForm.channels">{{t}} </template></el-tag>
                <el-tag type="warning" v-show="searchForm.startDate != null">起始时间: {{searchForm.startDate | dateFormatter}}</el-tag>
                <el-tag type="warning" v-show="searchForm.endDate != null">终止时间: {{searchForm.endDate | dateFormatter}}</el-tag>
                <el-tag type="danger" v-show="searchForm.specialTypes.length > 0">靓号类型: <template v-for="t in searchForm.specialTypes">{{t}} </template></el-tag>
              </div>                

            </el-card>
        </el-row>

          <!-- user pictures -->
        <div v-show="isAuditUIVisible">
          <el-row v-loading="isLoading">
            <el-col :span="6" >
<!--               用户信息
              <br> -->
<!--               <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress> -->

              <el-card :body-style="{ padding: '13px' }" >
                <div slot="header">
                  稽核状态:  &nbsp 
                  <el-tag v-if="auditing.state && auditing.state === '人工审核通过'" type="success">{{auditing.state}}</el-tag>
                  <el-tag v-else-if="auditing.state" type="danger">{{auditing.state}}</el-tag>
                  <el-tag v-else type="warning">未稽核</el-tag>
                </div>
                <el-form label-position="left" label-width="80px" id="userInfo">
                  <el-form-item label="客户姓名:">
                    {{auditing.name}}
                  </el-form-item>
                  <el-form-item label="手机号码:">
                    {{auditing.mobile}}
                  </el-form-item>
                  <el-form-item label="身份证号:">
                    {{auditing.id}}
                  </el-form-item>
                  <el-form-item label="发展渠道:">
                    {{auditing.channel}}
                  </el-form-item>
                  <el-form-item label="入网时间:">
                    {{auditing.entryDate | dateFormatter}}
                  </el-form-item>
                  <el-form-item label="一证N户:">
                    {{auditing.type}}
                  </el-form-item>
                  <el-form-item label="靓号类型:">
                    {{auditing.specialType}}
                  </el-form-item>
                </el-form>

              </el-card> 
            </el-col>

            <el-col :span="8" :offset="1" >
              <el-card :body-style="{ padding: '0px' }">
                <img :src="livingPic(auditing.pictures)" class="image">
                <div style="padding: 14px;">
                  <span>现场照</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-card :body-style="{ padding: '0px' }">
                <img :src="idPic(auditing.pictures)" class="image">
                <div style="padding: 14px;">
                  <span>身份证照</span>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- operations -->
          <el-row style="margin-top: 20px">
            <el-col :span="1" >
              <el-button type="success" style="padding: 16px" @click="onSubmit('success')">通过</el-button>
            </el-col>       

                <el-col :span="4" :offset="6">
                  <el-select v-model="violationValue" placeholder="未通过原因" clearable>
                    <el-option
                      v-for="item in violationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>

      


                <el-col :span="9" :offset="1">
                  <el-input type="textarea" v-model="note" placeholder="备注"></el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                  <el-button type="danger" style="padding: 16px" @click="onSubmit('failure')">未通过</el-button>
                </el-col>
          </el-row>


          <!-- paginations -->
          <el-row v-loading="isLoading">
            <el-pagination
              style="margin-top: 20px"
              @current-change="handleCurrentChange"
              layout=" prev, pager, next, jumper"
              prev-text="上一页"
              next-text="下一页"
              :current-page.sync="page.currentPage"
              :page-count="page.total">
            </el-pagination>
          </el-row>
        </div>
    </div>
</template>

<style type="text/css">
  .el-row {
    margin:5px;
  }

  #userInfo .el-form-item{
    margin-bottom: 0px;
  }
  .image {
    width:500px;
    height:323px;
  }



</style>
<script type="text/javascript">
import moment from 'moment';
import {fetchAuditingData,postAuditingForm} from '../api';
import {AuditMixin} from './mixins/AuditMixin'

	export default {
    mixins: [AuditMixin],

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

                var params = {mobile: this.searchForm.mobile, types: this.searchForm.types, channels: this.searchForm.channels, 
                             startDate: this.sDate, endDate: this.eDate,
                             specialTypes: this.searchForm.specialTypes};
                
               fetchAuditingData(params).then(data => {
                // console.log(data);
                // this.auditings = data.auditings;
                 this.auditings = data;
                 this.$set(this.page,'total',this.auditings.length);
                 if (this.auditings.length>0){
                   this.auditing = this.auditings[0];
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
        if (state === 1)
          type = 0
        var params = {state: state, note: this.note, type: type, uuid: this.auditing.uuid, idPicUuid:"", livingPicUuid:"",
                      subscriptionId: this.auditing.subscriptionId};
        postAuditingForm(params).then(data => {


          this.$message({
            type: 'success',
            message: '提交成功!',
            duration: 3000
          });
        }).catch(e => {
          console.log(e);
        })
         var des = '';
         if (state === 1)
           des = "人工审核通过";
         else
           des = this.violationOptions.find((obj) => obj.value === this.violationValue).label;
         this.$set(this.auditing, 'state', des);
         this.$set(this.auditings, this.currentIndex, this.auditing);
         if (this.page.currentPage < this.page.total){
           this.$set(this.page,'currentPage', this.page.currentPage+1);
           this.handleCurrentChange(this.page.currentPage);
         }

         this.resetAuditForm();

	    },
       handleCurrentChange(val){
         this.currentIndex = val-1;
         this.auditing = this.auditings[val-1];
       }
	  }
	}
</script>