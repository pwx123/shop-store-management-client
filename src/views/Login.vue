<template>
  <el-container>
    <el-header>
      <el-row type="flex"
        class="header">
        <el-col :span="6">
          <h3>网上书店管理系统</h3>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="main-bg"></div>
      <div class="main-form">
        <el-form ref="form"
          :model="formData"
          :rules="formRules"
          :hide-required-asterisk="true"
          label-width="80px">
          <el-form-item label="登陆账号"
            prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码"
            prop="pwd">
            <el-input v-model="formData.pwd"
              type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formData.checked">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              @click="submitForm('form')">登陆</el-button>
            <el-button @click="regForm">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    <el-footer>&copy; Power By Peng Wenxiang</el-footer>
  </el-container>
</template>

<script>
import MD5 from "crypto-js/md5";
import { JSEncrypt } from "jsencrypt";
import { getPublicKey, login, register } from "@/api";
import { mobileReg } from "@/util/util";
export default {
  data() {
    return {
      logining: false,
      formData: {
        name: "",
        pwd: "",
        checked: true
      },
      formRules: {
        name: [{ validator: this.mobileRegFun, trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          getPublicKey()
            .then(res => {
              if (res.errorCode === 200) {
                let name = this.formData.name;
                let encryptor = new JSEncrypt();
                encryptor.setPublicKey(res.data);
                let md5Pwd = MD5(this.formData.pwd).toString();
                let pwd = encodeURI(encryptor.encrypt(md5Pwd));
                return login({ name, pwd });
              }
            })
            .then(res => {
              if (res.errorCode === 200) {
                this.$message({
                  message: "登陆成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    this.$router.push({
                      path: "/"
                    });
                  }
                });
              } else {
                this.$message({
                  message: res.errorMsg,
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "登陆失败",
                type: "error"
              });
            });
        } else {
          return false;
        }
      });
    },
    regForm() {
      getPublicKey()
        .then(res => {
          if (res.errorCode === 200) {
            let name = this.formData.name;
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(res.data);
            let md5Pwd = MD5(this.formData.pwd).toString();
            let md5RepPwd = MD5(this.formData.repPwd).toString();
            let pwd = encodeURI(encryptor.encrypt(md5Pwd));
            let repPwd = encodeURI(encryptor.encrypt(md5RepPwd));
            return register({ name, pwd, repPwd });
          }
        })
        .then(res => {
          if (res.errorCode === 200) {
            this.$message({
              message: "注册成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.errorMsg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "注册失败",
            type: "error"
          });
        });
    },
    mobileRegFun(rule, value, callback) {
      if (!mobileReg.test(value)) {
        callback(new Error("请输入正确的手机号"));
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

  .el-main
    display flex
    padding 80px

    .main-bg
      flex 1
      background-image url('http://127.0.0.1/images/login/login-bg-2.jpg')
      background-repeat no-repeat
      background-size cover
      box-shadow 0 0 100px 60px rgba(255, 255, 255, 0.7) inset
      margin-right 100px
      border-radius 6px

    .main-form
      display flex
      align-items center
      flex 0 0 360px

      form
        width 100%
        box-shadow 0 0 25px #cac6c6
        padding 60px 30px 20px 20px
        border-radius 6px

  .el-footer
    text-align center
    background-color $color-primary
    line-height 60px
    color #fff
</style>

