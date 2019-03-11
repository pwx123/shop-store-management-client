<template>
  <div>
    <el-form>
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
              @click="submitNickname"></el-button>
            <el-button type="danger"
              size="mini"
              icon="el-icon-close"
              circle
              @click="isEditNickname = false"></el-button>
          </div>
          <div class="nickname"
            key="text"
            v-else>
            <span>
              {{userInfo.nickname || '--'}}
              <el-button type="text"
                @click="isEditNickname = true; editNickname = userInfo.nickname">修改</el-button>
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
            <img :src="avatarBase64 || userInfo.avator || defaultAvatar"
              alt="头像">
            <div class="modal">
              <i class="el-icon-upload"></i>
              <p>点击上传</p>
            </div>
          </el-upload>
          <div v-if="isUploadAvatar">
            <el-button type="success"
              size="mini"
              icon="el-icon-check"
              circle
              @click="submitAvatar"></el-button>
            <el-button type="danger"
              size="mini"
              icon="el-icon-close"
              circle
              @click="isUploadAvatar = false; avatarBase64 = ''"></el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="密码">
        <el-button type="text"
          @click="submitPassword">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { handleError } from "../../util/util";
import {
  updateNickname,
  updatePassword,
  updateAvatar
} from "./../../api/login";
import { getPublicKey } from "./../../api/common";

export default {
  data() {
    return {
      defaultAvatar: this.$basePath + "/images/admin/default.png",
      isEditNickname: false,
      editNickname: "",
      isUploadAvatar: false,
      avatarFile: "",
      avatarBase64: ""
    };
  },
  created() {
    this.getUserInfoFun();
  },
  computed: {
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
        `确实修改昵称为 <span style='color:#f56c6c'>${
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
            let res = await updateNickname({ nickname: this.editNickname });
            if (res.errorCode === 200) {
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
            handleError(error);
          }
        })
        .catch(() => {});
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
      console.log(file);
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
        headers: { "Content-Type": "multipart/form-data" }
      };
      try {
        this.uploadAvatarLoading = true;
        let res = await updateAvatar(data, config);
        this.uploadAvatarLoading = false;
        if (res.errorCode === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
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
    ...mapActions(["getUserInfoActions"])
  }
};
</script>

<style lang="stylus" scoped>
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

    &:hover
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
