<template>


<div id="particle">


  <el-row>
  <el-col :span="6" :offset="9" style="margin-top:100px">
  <el-card >
    <el-form ref="accountForm" :model="account" :rules="rules" label-position="left" label-width="0px"
             class="demo-ruleForm ">
      <h3 class="title">温州联通 实名制稽核系统</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="account.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="account.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
<!--       <el-form-item prop="safetyCode">
        <el-input type="text" v-model="account.safetyCode" auto-complete="off" placeholder="请输入验证码"></el-input><el-button @click="getSafetyCode" :loading="isLoading">获取验证码</el-button>
      </el-form-item> -->
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  </el-col>
  </el-row>
</div>

  





</template>


<script>

import {requestLogin, submitPassedData, isAdmin} from '../api';
import particles from 'particles.js'


export default {
  
  beforeCreate: function() {
  
      // document.getElementsByTagName("body")[0].className="active";
  
  },
  
  beforeDestroy: function() {
  
      // document.body.removeAttribute("class","active");
  
  },
  mounted(){
    particlesJS("particle", {
  "particles": {
    "number": {
      "value": 150,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#000000"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#000000",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});


  },
  data () {
    return  {
        isLoading: false,
        account: {
          username: '',
          password: '',
          safetyCode:''
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ],
          safetyCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ],
        },
      };
  },
  methods: {
    login(){
      this.$refs.accountForm.validate((valid) => {
        if (valid){
          this.isLoading = true;
          var loginParams = {username: this.account.username, password: this.account.password};
          requestLogin(loginParams).then(res => {
            this.isLoading = false;
            let {msg, code, data} = res;
            if(code == 200){
              this.$store.commit('setToken', data);
              this.$store.commit("setUsername", this.account.username);

              isAdmin().then(res => {

                this.$store.commit("setIsAdmin", res);
                var welcomeMsg = "欢迎回来";
                if (res){
                  welcomeMsg = welcomeMsg+", 管理员"
                } 
                this.$message({
                  message: welcomeMsg,
                  type: 'success'
                }); 

                this.$router.push({path:'/'});
              }).catch(e => console.log(e));

              // this.$message({
              //   message: '欢迎回来',
              //   type: 'success'
              // });

              // this.$router.push({path:'/'});
            }
            else {
              this.$message({
                message: msg,
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
    },
    getSafetyCode(){
      if (this.username != '' && this.password != ''){
        this.isLoading = true;
        submitPassedData().then(data => {
        this.$message({
                message: '验证码将在几秒后发送到您的手机',
                type: 'success'
              });
          this.isLoading = false;
        }).catch(e => {
          this.isLoading = false;
          console.log(e);
        })
      }
      else{

      }
    }
  }
}
</script>
 
 
<style>

#particle{
  height:300px;
}


</style>
