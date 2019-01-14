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
      <el-row type="flex"
        class="container">
        <el-col :span="16">
          <div></div>
        </el-col>
        <el-col :span="7">
          <el-form ref="form"
            :model="formData"
            label-width="80px">
            <el-form-item label="用户名">
              <el-input v-modal="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-modal="formData.name"
                type="password"></el-input>5
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="1">
          <div></div>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "",
        pwd: ""
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

    .container
      width 100%

      .el-col-7
        height 400px
        border 1px solid #eaeaea
        box-shadow 0 0 25px #cac6c6
        border-radius 5px
</style>

