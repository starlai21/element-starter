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
                <el-form-item label="手机号码" prop="mobile" :rules="{pattern: /^1[34578]\d{9}$/, message: '请输入有效的手机号码！', trigger: 'blur'}" style="margin-top:10px">
                  <el-input v-model="searchForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="一证N户" prop="type">
                  <el-select v-model="searchForm.type" placeholder="请选择类型" style="width: 100%">
                    <el-option label="一" value="1"></el-option>
                    <el-option label="二" value="2"></el-option>
                    <el-option label="三" value="3"></el-option>
                    <el-option label="四" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发展渠道" prop="channel">
                  <el-select v-model="searchForm.channel" placeholder="请选择类型" style="width: 100%">
                    <el-option label="一" value="1"></el-option>
                    <el-option label="二" value="2"></el-option>
                    <el-option label="三" value="3"></el-option>
                    <el-option label="四" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间筛选">
                  <el-col :span="11">
                    <el-form-item prop="startDate">
                      <el-date-picker type="date" placeholder="起始时间" v-model="searchForm.startDate" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="endDate">
                      <el-date-picker type="date" placeholder="终止时间" v-model="searchForm.endDate" style="width: 100%;"></el-date-picker>
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
                <el-tag type="success"  v-show="searchForm.type != ''">一证N户: {{searchForm.type}}</el-tag>
                <el-tag type="info"  v-show="searchForm.channel != ''">发展渠道: {{searchForm.channel}}</el-tag>
                <el-tag type="warning" v-show="searchForm.startDate != null">起始时间: {{searchForm.startDate | dateFormater}}</el-tag>
                <el-tag type="warning" v-show="searchForm.endDate != null">终止时间: {{searchForm.endDate | dateFormater}}</el-tag>
                <el-tag type="danger" v-show="searchForm.specialTypes.length > 0">靓号类型: <template v-for="t in searchForm.specialTypes">{{t}} </template></el-tag>
              </div>                

            </el-card>
        </el-row>

          <!-- user pictures -->
        <div v-show="isAuditUIVisible">
          <el-row v-loading="isLoading">
            <el-col :span="6" >
              稽核进度
              <br><br>
              <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
              <br>
              <el-card :body-style="{ padding: '10px' }" >
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
                    {{auditing.entryDate}}
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
                <img :src="auditing.livingPicture" class="image">
                <div style="padding: 14px;">
                  <span>现场照</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-card :body-style="{ padding: '0px' }">
                <img :src="auditing.idPicture" class="image">
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
          <el-row>
            <el-pagination
              style="margin-top: 20px"
              @current-change="handleCurrentChange"
              layout=" prev, pager, next, jumper"
              :total="100">
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


</style>
<script type="text/javascript">
import moment from 'moment';
import {fetchAuditingData} from '../api';


	export default {
		data(){
			return {
				searchForm: {
		          mobile: '',
		          type: '',
		          channel: '',
		          startDate: null,
		          endDate: null,
		          specialTypes: [],
		          isVisible: true,
		          bodyStyle:{
		            padding: '0px'
		          }
		        },		

		        violationOptions: [{
		          value: '1',
		          label: '人脸无法辨识'
		        }, {
		          value: '2',
		          label: '非活体照'
		        }, {
		          value: '3',
		          label: '人证不一致'
		        }, {
		          value: '4',
		          label: '未按规范拍摄现场人脸照'
		        },{
              value: '5',
              label: '大头照'
            }, {
              value: '6',
              label: '非正面清晰照/完整照'
            }, {
              value: '7',
              label: '未按要求持证/未持证'
            }, {
              value: '8',
              label: '其他'
            }],		

            specialtyOptions: [{
              value: '1',
              label: '1'
            },{
              value: '2',
              label: '2'
            },{
              value: '3',
              label: '3'
            },{
              value: '4',
              label: '4'
            },{
              value: '5',
              label: '5'
            }],
		        note: '',
		        violationValue: '',
            isAuditUIVisible: false,
            isLoading: false,
            auditings: [],
            auditing: [],
            currentIndex: -1
			};
		},
	  	filters:{
	    	dateFormater(date){
	      		return moment(date).format('l');
	    	}
	  	},
	  	methods: {	
	    	search(){
	      		this.$refs['searchForm'].validate((valid) => {
		        	if (valid) {
                this.isLoading = true;
                var params = {mobile: this.searchForm.mobile, type: this.searchForm.type, channel: this.searchForm.channel, 
                              startDate: this.searchForm.startDate, endDate: this.searchForm.endDate,
                              specialTypes: this.searchForm.specialTypes};
                fetchAuditingData(params).then(data => {

                  this.auditings = data.auditings;


                  if (this.auditings.length>0)
                    this.auditing = this.auditings[0];
                  this.isLoading = false;
                }).catch(e => {
                  this.isLoading = false;
                  console.log(e);
                })
		          		// alert('search...');
                this.isAuditUIVisible = true;
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
		    clearForm(formName){
		    	this.$refs[formName].resetFields();
		    },
        resetAuditForm(){
          this.violationValue = '';
          this.note = '';
        },
		    onSubmit(state){
          if (state === 'success'){
            this.send();
          }
          else{
            if ((this.violationValue !== '' && this.violationValue !== "8") || this.note !== ''){
              this.send();
            }
            else{
              this.$message({
                type: 'error',
                message: '请选择未通过原因或填写备注!',
                duration: 3000
              });
            }
          }
		      
		    },
		    isConditionChanged(){
		      var form = this.searchForm;
		      return form.mobile != '' || form.type != '' || form.channel != '' || form.isSpecial || form.startDate != null || form.endDate != null;
		    },		

		    send() {
          this.resetAuditForm();
		      this.$message({
		        type: 'success',
		        message: '提交成功!',
		        duration: 3000
		      })
		    },
        handleCurrentChange(val){
          this.auditing = this.auditings[val-1];
        }

		  }
	}
</script>