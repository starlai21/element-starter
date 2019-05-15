<template>
	<div id="particle">


  <el-row>
  <el-col :span="6" :offset="9" style="margin-top:100px">
  <el-card >
    <el-form ref="accountForm" :model="account" :rules="rules" label-position="left" label-width="0px"
             class="demo-ruleForm ">
      <el-form-item prop="oldPassword">
        <el-input type="password" v-model="account.oldPassword" auto-complete="off" placeholder="原密码"></el-input>
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input type="password" v-model="account.newPassword" auto-complete="off" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item prop="newPasswordConfirm">
        <el-input type="password" v-model="account.newPasswordConfirm" auto-complete="off" placeholder="新密码确认"></el-input>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="submit">修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  </el-col>
  </el-row>
</div>
</template>

<script type="text/javascript">
import {requestChangePassword} from '../api';
export default {
	data () {
	  return  {
	      isLoading: false,
	      account: {
	        oldPassword: '',
	        newPassword: '',
	        newPasswordConfirm:''
	      },
	      rules: {
	        oldPassword: [
	          {required: true, message: '请输入原密码', trigger: 'blur'},
	          //{ validator: validaePass }
	        ],
	        newPassword: [
	          {required: true, message: '请输入新密码', trigger: 'blur'},
	          //{ validator: validaePass2 }
	        ],
	        newPasswordConfirm: [
	          {required: true, message: '请输入新密码', trigger: 'blur'},
	          //{ validator: validaePass2 }
	        ],
	      },
	    };
	},
	methods:{
		submit(){
	      	this.$refs.accountForm.validate((valid) => {
	      	  if (valid){
	      	    this.isLoading = true;
	      	    var loginParams = {oldPassword: this.account.oldPassword, 
	      	    	newPassword: this.account.newPassword, newPasswordConfirm: this.account.newPasswordConfirm};
	      	    requestChangePassword(loginParams).then(res => {
	      	      this.isLoading = false;
	      	      if(res){
	      	      	this.$message({
	      	            message: '密码修改成功',
	      	            type: 'success'
	      	        }); 	
	      	      }
	      	      else {
	      	        this.$message({
	      	          message: '密码修改失败',
	      	          type: 'error'
	      	        });
	      	      }
	      	    });
	      	  }
	      	  else {
	      	    console.log('error')
	      	    return false;
	      	  }
	      	})
		}
	}
}	

</script>