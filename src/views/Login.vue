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
          label-width="80px">
          <el-form-item label="登陆账号">
            <el-input v-modal="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码">
            <el-input v-modal="formData.name"
              type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formData.checked">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              @click="submitForm">登陆</el-button>
            <el-button>注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    <el-footer>&copy; Power By Peng Wenxiang</el-footer>
  </el-container>
</template>

<script>
import { JSEncrypt } from "jsencrypt";
import { getPublicKey, login, reg } from "@/api";
export default {
  data() {
    return {
      formData: {
        name: "12",
        pwd: "12345",
        checked: true
      },
      logining: false,
      ruleForm2: {
        account: "admin",
        checkPass: "123456"
      },
      rules2: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    submitForm() {
      getPublicKey()
        .then(res => {
          if (res.errorCode === 200) {
            let name = this.formData.name;
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(res.data);
            let rsaPwd = encodeURI(encryptor.encrypt(this.formData.pwd));
            return login({ name, rsaPwd });
          }
        })
        .then(res => {
          if (res.errorCode === 200) {
            this.$message({
              message: "登陆成功",
              type: "success"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "登陆失败",
            type: "error"
          });
        });
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
        padding 80px 30px 40px 30px
        border-radius 6px

  .el-footer
    text-align center
    background-color $color-primary
    line-height 60px
    color #fff
</style>

