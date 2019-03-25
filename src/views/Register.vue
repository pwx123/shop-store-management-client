<template>
  <el-container>
    <el-header>
      <el-row type="flex"
          justify="space-between"
          class="header">
        <el-col :span="6">
          <h3>网上书店管理系统</h3>
        </el-col>
        <el-col :span="3">
          <span @click="backLogin">返回首页 &gt;</span>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="main-form">
        <el-form ref="form"
            :model="formData"
            :rules="formRules"
            label-width="80px">
          <h1>欢迎注册</h1>
          <el-form-item label="登陆账号"
              prop="name">
            <el-input v-model.trim="formData.name"
                maxlength="11"
                placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="昵称"
              prop="nickname">
            <el-input v-model.trim="formData.nickname"
                maxlength="20"
                placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码"
              prop="pwd">
            <el-input v-model.trim="formData.pwd"
                maxlength="16"
                placeholder="密码要求8-16位数字、字母组合"
                type="password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码"
              prop="repPwd">
            <el-input v-model.trim="formData.repPwd"
                maxlength="16"
                placeholder="重复输入密码"
                type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                @click="submitForm('form')">注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    <el-footer>&copy; Power By Peng Wenxiang</el-footer>
  </el-container>
</template>

<script>
  import MD5 from "crypto-js/md5";
  import {JSEncrypt} from "jsencrypt";
  import {register} from "./../api/login";
  import {getPublicKey} from "./../api/common";
  import {mobileReg, pwdReg, handleError} from "./../util/util";

  export default {
    data() {
      return {
        logining: false,
        formData: {
          name: "",
          nickname: "",
          pwd: "",
          repPwd: ""
        },
        formRules: {
          name: [{validator: this.mobileRegFun, trigger: "blur"}],
          nickname: [{validator: this.nicknameFun, trigger: "blur"}],
          pwd: [{validator: this.pwdRegFun, trigger: "blur"}],
          repPwd: [{validator: this.repPwdRegFun, trigger: "blur"}]
        },
        checked: true
      };
    },
    methods: {
      submitForm(form) {
        this.$refs[form].validate(async valid => {
          if (valid) {
            try {
              let res = await getPublicKey();
              if (res.errorCode === 200) {
                let name = this.formData.name;
                let encryptor = new JSEncrypt();
                encryptor.setPublicKey(res.data);
                let md5Pwd = MD5(this.formData.pwd).toString();
                let md5RepPwd = MD5(this.formData.repPwd).toString();
                let pwd = encodeURI(encryptor.encrypt(md5Pwd));
                let repPwd = encodeURI(encryptor.encrypt(md5RepPwd));
                let nickname = this.formData.nickname;
                let logRes = await register({name, nickname, pwd, repPwd});
                if (logRes.errorCode === 200) {
                  this.$message({
                    message: "注册成功",
                    type: "success",
                    duration: 1000,
                    onClose: () => {
                      this.$router.push("/login");
                    }
                  });
                } else {
                  this.$message({
                    message: logRes.errorMsg,
                    type: "error"
                  });
                }
              } else {
                this.$message({
                  message: res.errorMsg,
                  type: "error"
                });
              }
            } catch (error) {
              handleError(error);
            }
          }
        });
      },
      backLogin() {
        this.$router.push("/login");
      },
      mobileRegFun(rule, value, callback) {
        if (!mobileReg.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      },
      nicknameFun(rule, value, callback) {
        if (!value || value.length == 0) {
          callback(new Error("请输入昵称"));
        } else {
          callback();
        }
      },
      pwdRegFun(rule, value, callback) {
        if (!pwdReg.test(value)) {
          callback(new Error("请输入符合格式的密码"));
        } else {
          callback();
        }
      },
      repPwdRegFun(rule, value, callback) {
        if (!pwdReg.test(value)) {
          callback(new Error("请输入符合格式的密码"));
        } else if (this.formData.pwd !== this.formData.repPwd) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      }
    }
  };
</script>
<style lang="stylus" scoped>
  @import './../styl/variables.styl'

  .el-container
    height 100%

    .el-header
      background-color $color-primary

      h3
        text-align center
        color #fff
        margin 0
        line-height 60px
        font-size 20px

      .el-col-3
        text-align center
        line-height 60px
        color #fff

        span
          cursor pointer

    .el-main
      display flex
      padding 40px
      background-color #f5f5f5

      .main-form
        width 100%
        padding 60px
        background-color #fff
        display flex
        justify-content center

        .el-form
          width 400px

          h1
            text-align center
            padding-left 40px
            margin-bottom 30px

          .el-button
            width 100%

    .el-footer
      text-align center
      background-color $color-primary
      line-height 60px
      color #fff
</style>

