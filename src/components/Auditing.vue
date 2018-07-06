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
                    <el-option label="二" value="1"></el-option>
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
                <el-form-item label="是否靓号" prop="isSpecial">
                  <el-switch v-model="searchForm.isSpecial"></el-switch>
                </el-form-item>             

                <el-form-item>
                  <el-button type="info" @click="clearForm('searchForm')">重置</el-button>
                  <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
              </el-form>    
          

              <!-- display current search conditions -->
              <div v-show="!searchForm.isVisible">
                <el-tag v-show="searchForm.mobile != ''">手机号码: {{searchForm.mobile}}</el-tag>
                <el-tag type="success"  v-show="searchForm.type != ''">一证N户: {{searchForm.type}}</el-tag>
                <el-tag type="info"  v-show="searchForm.channel != ''">发展渠道: {{searchForm.channel}}</el-tag>
                <el-tag type="warning" v-show="searchForm.startDate != null">起始时间: {{searchForm.startDate | dateFormater}}</el-tag>
                <el-tag type="warning" v-show="searchForm.endDate != null">终止时间: {{searchForm.endDate | dateFormater}}</el-tag>
                <el-tag type="danger" v-show="searchForm.isSpecial">是否靓号: 是</el-tag>
              </div>                

            </el-card>
        </el-row>

          <!-- user pictures -->
          <el-row>
            <el-col :span="6">
              稽核进度
              <br><br>
              <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
              <br>
              <el-card :body-style="{ padding: '10px' }" >
                <el-form label-position="left" label-width="80px" id="userInfo">
                  <el-form-item label="客户姓名:">
                    王小明
                  </el-form-item>
                  <el-form-item label="手机号码:">
                    12321312321
                  </el-form-item>
                  <el-form-item label="身份证号:">
                    3303031999023234312
                  </el-form-item>
                  <el-form-item label="发展渠道:">
                    龙湾XX营业厅
                  </el-form-item>
                  <el-form-item label="入网时间:">
                    2018/07/01
                  </el-form-item>
                  <el-form-item label="一证N户:">
                    2
                  </el-form-item>
                  <el-form-item label="靓号类型:">
                    AA
                  </el-form-item>
                </el-form>
              </el-card> 
            </el-col>

            <el-col :span="8" :offset="1" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="https://placeimg.com/700/323/any" class="image">
                <div style="padding: 14px;">
                  <span>现场照</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-card :body-style="{ padding: '0px' }">
                <img src="https://placeimg.com/700/323/any" class="image">
                <div style="padding: 14px;">
                  <span>身份证照</span>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- operations -->
          <el-row style="margin-top: 20px">
            <el-col :span="1" >
              <el-button type="success" style="padding: 16px" @click="onSubmit">通过</el-button>
            </el-col>       

                <el-col :span="4" :offset="2">
                  <el-select v-model="violationValue" placeholder="实名违规" clearable :disabled="nonComplainceValue != ''">
                    <el-option
                      v-for="item in violationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-select v-model="nonComplainceValue" placeholder="实名操作不合规" clearable :disabled="violationValue != ''">
                    <el-option
                      v-for="item in nonComplianceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
      


                <el-col :span="6" :offset="1">
                  <el-input type="textarea" v-model="note" placeholder="备注"></el-input>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-button type="danger" style="padding: 16px" @click="onSubmit">未通过</el-button>
                </el-col>
            
          </el-row>


          <!-- paginations -->
          <el-row>
            <div class="block" style="margin-top: 20px">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="1000">
              </el-pagination>
            </div>
          </el-row>
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
	export default {
		data(){
			return {
				searchForm: {
		          mobile: '',
		          type: '',
		          channel: '',
		          startDate: null,
		          endDate: null,
		          isSpecial: false,
		          isVisible: false,
		          bodyStyle:{
		            padding: '0px'
		          }
		        },		

		        violationOptions: [{
		          value: '选项1',
		          label: '人脸无法辨识'
		        }, {
		          value: '选项2',
		          label: '非活体照'
		        }, {
		          value: '选项3',
		          label: '人证不一致'
		        }, {
		          value: '选项4',
		          label: '未按规范拍摄现场人脸照'
		        }, {
		          value: '选项5',
		          label: '其他'
		        }],		

		        nonComplianceOptions: [{
		          value: '选项1',
		          label: '大头照'
		        }, {
		          value: '选项2',
		          label: '非正面清晰照/完整照'
		        }, {
		          value: '选项3',
		          label: '持证照'
		        }, {
		          value: '选项4',
		          label: '其他'
		        }],
		        note: '',
		        violationValue: '',
		        nonComplainceValue: ''
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
		          		alert('search...');
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
		    	// this.searchForm.isSpecial = false;
		    	this.$refs[formName].resetFields();
		    },
		    onSubmit(){
		      this.startHacking();
		    },
		    isConditionChanged(){
		      var form = this.searchForm;
		      return form.mobile != '' || form.type != '' || form.channel != '' || form.isSpecial || form.startDate != null || form.endDate != null;
		    },		

		    startHacking () {
		      this.$notify({
		        title: 'It works!',
		        type: 'success',
		        message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
		        duration: 5000
		      })
		    }
		  }
	}
</script>