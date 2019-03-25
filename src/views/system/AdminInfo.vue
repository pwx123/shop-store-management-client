<template>
  <div>
    <el-form class="userinfo">
      <el-form-item label="账号">{{userInfo.name}}</el-form-item>
      <el-form-item label="昵称"
          class="edit">
        <transition name="el-fade-in-linear"
            mode="out-in">
          <div class="nickname-edit"
              key="edit"
              v-if="isEditNickname">
            <el-input v-model.trim="editNickname"
                maxlength="20"></el-input>
            <el-button type="success"
                size="mini"
                icon="el-icon-check"
                circle
                @click.native="submitNickname"></el-button>
            <el-button type="danger"
                size="mini"
                icon="el-icon-close"
                circle
                @click.native="isEditNickname = false"></el-button>
          </div>
          <div class="nickname"
              key="text"
              v-else>
            <span>
              {{userInfo.nickname || "--"}}
              <el-button type="text"
                  @click.native="isEditNickname = true; editNickname = userInfo.nickname">修改</el-button>
            </span>
          </div>
        </transition>
      </el-form-item>
      <el-form-item label="头像"
          class="edit">
        <div class="avatar">
          <el-upload action="#"
              accept=".png, .jpg"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="uploadAvatar">
            <img :src="avatarUrl"
                alt="头像">
            <div class="modal">
              <i class="el-icon-upload"></i>
              <p>点击上传</p>
            </div>
          </el-upload>
          <transition name="el-fade-in-linear">
            <div v-if="isUploadAvatar">
              <el-button type="success"
                  size="mini"
                  icon="el-icon-check"
                  circle
                  ::loading="uploadAvatarLoading"
                  @click.native="submitAvatar"></el-button>
              <el-button type="danger"
                  size="mini"
                  icon="el-icon-close"
                  circle
                  @click.native="isUploadAvatar = false; avatarBase64 = ''"></el-button>
            </div>
          </transition>
        </div>
      </el-form-item>
      <el-form-item label="密码">
        <el-button type="text"
            @click.native="updatePwdVisible = true">修改密码
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="修改密码"
        width="400px"
        :visible.sync="updatePwdVisible"
        @close="closeDialog">
      <el-form ref="form"
          :model="updatePwdForm"
          :rules="formRules">
        <el-form-item label="原密码"
            maxlength="16"
            prop="pwd"
            label-width="80px">
          <el-input v-model.trim="updatePwdForm.pwd"
              type="password"
              placeholder="输入原密码"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
            prop="newPwd"
            label-width="80px">
          <el-input v-model.trim="updatePwdForm.newPwd"
              type="password"
              maxlength="16"
              placeholder="密码要求8-16位数字、字母组合"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重复密码"
            prop="repNewPwd"
            label-width="80px">
          <el-input v-model.trim="updatePwdForm.repNewPwd"
              type="password"
              maxlength="16"
              placeholder="重复输入新密码"
              autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
          class="dialog-footer">
        <el-button size="small"
            @click.native="updatePwdVisible = false">取 消
        </el-button>
        <el-button size="small"
            type="primary"
            @click.native="submitUpdatePwd('form')">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import MD5 from "crypto-js/md5";
  import {JSEncrypt} from "jsencrypt";
  import {mapActions, mapGetters} from "vuex";
  import {pwdReg, handleError} from "../../util/util";
  import {
    updateNickname,
    updatePassword,
    updateAvatar
  } from "./../../api/login";
  import {getPublicKey} from "./../../api/common";

  export default {
    data() {
      return {
        // 默认头像
        defaultAvatar: this.$basePath + "/images/admin/default.png",
        // 编辑昵称
        isEditNickname: false,
        // 昵称
        editNickname: "",
        // 上传头像
        isUploadAvatar: false,
        // 头像文件
        avatarFile: "",
        // 上传头像loading
        uploadAvatarLoading: false,
        // 头像base64
        avatarBase64: "",
        // 修改密码弹窗
        updatePwdVisible: false,
        updatePwdForm: {
          pwd: "",
          newPwd: "",
          repNewPwd: ""
        },
        formRules: {
          pwd: [{required: true, message: "请输入原密码", trigger: "blur"}],
          newPwd: [
            {required: true, validator: this.pwdRegFun, trigger: "blur"}
          ],
          repNewPwd: [
            {required: true, validator: this.repPwdRegFun, trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getUserInfoFun();
    },
    computed: {
      avatarUrl() {
        return this.avatarBase64 || this.userInfo.avatarUrl || this.defaultAvatar;
      },
      ...mapGetters(["userInfo"])
    },
    methods: {
      // 获取用户信息
      async getUserInfoFun() {
        try {
          await this.getUserInfoActions();
        } catch (error) {
          handleError(error);
        }
      },
      // 修改昵称
      async submitNickname() {
        if (this.editNickname === this.userInfo.nickname) {
          this.$message({
            message: "昵称未作更改",
            type: "error"
          });
          return false;
        }
        this.$confirm(
          `确定修改昵称为 <span style='color:#f56c6c'>${
            this.editNickname
            }</span> 吗？`,
          "提示",
          {
            type: "warning",
            dangerouslyUseHTMLString: true
          }
        )
          .then(async () => {
            try {
              let res = await updateNickname({nickname: this.editNickname});
              this.isEditNickname = false;
              if (res.errorCode === 200) {
                this.getUserInfoActions();
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.errorMsg,
                  type: "error"
                });
              }
            } catch (error) {
              this.isEditNickname = false;
              handleError(error);
            }
          })
          .catch(() => {
          });
      },
      // 上传头像
      uploadAvatar(file) {
        let reg = /.*\.(png|jpg)$/;
        if (!reg.test(file.name)) {
          this.$message({
            message: "格式不正确",
            type: "error"
          });
          return false;
        }
        if (file.size > 1024 * 500) {
          this.$message({
            message: "大小不能超过500KB",
            type: "error"
          });
          return false;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = e => {
          this.avatarBase64 = e.currentTarget.result;
          this.avatarFile = file.raw;
          this.isUploadAvatar = true;
        };
      },
      // 提交上传图片
      async submitAvatar() {
        let data = new FormData();
        data.append("avatar", this.avatarFile);
        let config = {
          headers: {"Content-Type": "multipart/form-data"}
        };
        try {
          this.uploadAvatarLoading = true;
          let res = await updateAvatar(data, config);
          this.uploadAvatarLoading = false;
          this.avatarFile = "";
          this.isUploadAvatar = false;
          if (res.errorCode === 200) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.getUserInfoActions();
          } else {
            this.$message({
              message: res.errorMsg,
              type: "error"
            });
          }
        } catch (error) {
          this.uploadAvatarLoading = false;
          handleError(error);
        }
      },
      closeDialog() {
        this.$refs["form"].clearValidate();
      },
      // 修改密码提交
      submitUpdatePwd(form) {
        this.$refs[form].validate(async valid => {
          if (valid) {
            try {
              let res = await getPublicKey();
              if (res.errorCode === 200) {
                let encryptor = new JSEncrypt();
                encryptor.setPublicKey(res.data);
                let md5Pwd = MD5(this.updatePwdForm.pwd).toString();
                let md5NewPwd = MD5(this.updatePwdForm.newPwd).toString();
                let md5RepNewPwd = MD5(this.updatePwdForm.repNewPwd).toString();
                let pwd = encodeURI(encryptor.encrypt(md5Pwd));
                let newPwd = encodeURI(encryptor.encrypt(md5NewPwd));
                let repNewPwd = encodeURI(encryptor.encrypt(md5RepNewPwd));
                let pwdRes = await updatePassword({pwd, newPwd, repNewPwd});
                this.updatePwdVisible = false;
                this.updatePwdForm = {
                  pwd: "",
                  newPwd: "",
                  repNewPwd: ""
                };
                if (pwdRes.errorCode === 200) {
                  this.$message({
                    message: "修改成功,请重新登陆",
                    type: "success",
                    duration: 1500,
                    onClose: () => {
                      this.$router.push("/login");
                    }
                  });
                } else {
                  this.$message({
                    message: pwdRes.errorMsg,
                    type: "error"
                  });
                }
              } else {
                this.updatePwdVisible = false;
                this.$message({
                  message: res.errorMsg,
                  type: "error"
                });
              }
            } catch (error) {
              this.updatePwdVisible = false;
              handleError(error);
            }
          }
        });
      },
      pwdRegFun(rule, value, callback) {
        if (!pwdReg.test(value)) {
          callback(new Error("请输入符合格式的密码"));
        }
        if (this.updatePwdForm.newPwd === this.updatePwdForm.pwd) {
          callback(new Error("新密码不能与原密码相同"));
        } else {
          callback();
        }
      },
      repPwdRegFun(rule, value, callback) {
        if (!pwdReg.test(value)) {
          callback(new Error("请输入符合格式的密码"));
        } else if (this.updatePwdForm.newPwd !== this.updatePwdForm.repNewPwd) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      },
      ...mapActions(["getUserInfoActions"])
    }
  };
</script>

<style lang="stylus" scoped>
  .userinfo
    .el-form-item
      margin-bottom 10px

  .edit
    display flex
    align-items center

    .el-button
      margin-left 10px

    .nickname-edit
      .el-input
        width 120px

    .avatar
      display flex
      align-items center
      position relative
      height 100px
      overflow hidden

      > div:first-child
        height 100px

      .el-upload:hover
        .modal
          opacity 1

      .modal
        position absolute
        left 0
        top 0
        text-align center
        color #fefefe
        width 100px
        height 100px
        border-radius 50%
        background rgba(0, 0, 0, 0.5)
        opacity 0
        transition all 0.5s

        i
          font-size 20px
          margin-top 26px

        p
          margin 0
          line-height 14px

      img
        width 100px
        height 100px
        border-radius 50%
</style>
