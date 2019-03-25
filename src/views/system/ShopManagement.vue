<template>
  <div>
    <el-form class="shop-info">
      <el-form-item label="店铺名称"
          class="edit">
        <transition name="el-fade-in-linear"
            mode="out-in">
          <div class="shop-name-edit"
              key="edit"
              v-if="isEditShopName">
            <el-input v-model.trim="editShopInfo.shopName"
                maxlength="40"></el-input>
            <el-button type="success"
                size="mini"
                icon="el-icon-check"
                circle
                @click.native="submitShopName"></el-button>
            <el-button type="danger"
                size="mini"
                icon="el-icon-close"
                circle
                @click.native="isEditShopName = false"></el-button>
          </div>
          <div class="shop-name"
              key="text"
              v-else>
            <span>
              {{shopInfo.shopName || "--"}}
              <el-button type="text"
                  @click.native="isEditShopName = true; editShopInfo.shopName = shopInfo.shopName">修改</el-button>
            </span>
          </div>
        </transition>
      </el-form-item>
      <el-form-item label="店铺开关"
          class="edit">
        <el-switch v-model="editShopInfo.status"
            :active-value="1"
            :inactive-value="0"
            @change="submitShopStatus"></el-switch>
      </el-form-item>
      <el-form-item label="店铺介绍"
          class="edit">
        <transition name="el-fade-in-linear"
            mode="out-in">
          <div class="shop-name-edit"
              key="edit"
              v-if="isEditDescription">
            <el-input v-model.trim="editShopInfo.description"
                type="textarea"
                resize="none"
                rows="4"
                maxlength="200"></el-input>
            <el-button type="success"
                size="mini"
                icon="el-icon-check"
                circle
                @click.native="submitShopDescription"></el-button>
            <el-button type="danger"
                size="mini"
                icon="el-icon-close"
                circle
                @click.native="isEditDescription = false"></el-button>
          </div>
          <div class="shop-name-edit"
              key="text"
              v-else>
            <p>{{shopInfo.description || "--"}}</p>
            <el-button type="text"
                @click.native="isEditDescription = true; editShopInfo.description = shopInfo.description">修改
            </el-button>
          </div>
        </transition>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {handleError, removeSpace} from "../../util/util";
  import * as bookApi from "./../../api/shop";

  export default {
    data() {
      return {
        // 编辑店铺名
        isEditShopName: false,
        // 编辑描述
        isEditDescription: false,
        // 编辑信息
        editShopInfo: {
          shopName: "",
          status: 0,
          description: ""
        },
        shopInfo: {}
      };
    },
    created() {
      this.getShopInfoFun();
    },
    methods: {
      // 获取店铺信息
      async getShopInfoFun() {
        try {
          let res = await bookApi.getShopInfo();
          if (res.errorCode === 200) {
            this.shopInfo = res.data;
            this.editShopInfo = Object.assign({}, res.data);
          } else {
            this.$message({
              message: res.errorMsg,
              type: "error"
            });
          }
        } catch (error) {
          handleError(error);
        }
      },
      // 修改店铺名
      submitShopName() {
        if (this.editShopInfo.shopName === this.shopInfo.shopName) {
          this.$message({
            message: "店铺名未作更改",
            type: "error"
          });
          return false;
        }
        if (this.editShopInfo.shopName === "") {
          this.$message({
            message: "店铺名不能为空",
            type: "error"
          });
          return false;
        }
        this.$confirm(
          `确定修改店铺名为 <span style='color:#f56c6c'>${
            this.editShopInfo.shopName
            }</span> 吗？`,
          "提示",
          {
            type: "warning",
            dangerouslyUseHTMLString: true
          }
        )
          .then(() => {
            this.$prompt("请输入备注信息", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputValidator(val) {
                if (val == null || removeSpace(val) === "") {
                  return "备注信息不能为空";
                } else {
                  return true;
                }
              }
            })
              .then(async ({value}) => {
                try {
                  let res = await bookApi.updateShopName({
                    shopName: this.editShopInfo.shopName,
                    remark: value
                  });
                  this.isEditShopName = false;
                  if (res.errorCode === 200) {
                    this.getShopInfoFun();
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
                  this.isEditShopName = false;
                  handleError(error);
                }
              })
              .catch(() => {
              });
          })
          .catch(() => {
          });
      },
      // 修改店铺状态
      submitShopStatus(val) {
        let msg =
          val == "1"
            ? "<span style=\"color:#67c23a\">打开</span>"
            : "<span style=\"color:#f56c6c\">关闭</span>";
        this.$confirm(`确定 ${msg} 店铺吗？`, "提示", {
          type: "warning",
          dangerouslyUseHTMLString: true
        })
          .then(() => {
            this.$prompt("请输入备注信息", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputValidator(val) {
                if (val == null || removeSpace(val) == "") {
                  return "备注信息不能为空";
                } else {
                  return true;
                }
              }
            })
              .then(async ({value}) => {
                try {
                  let res = await bookApi.changeShopStatus({
                    status: this.editShopInfo.status,
                    remark: value
                  });
                  if (res.errorCode === 200) {
                    this.getShopInfoFun();
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
              .catch(() => {
                this.editShopInfo.status = this.editShopInfo.status == 1 ? 0 : 1;
              });
          })
          .catch(() => {
            this.editShopInfo.status = this.editShopInfo.status == 1 ? 0 : 1;
          });
      },
      // 修改店铺介绍
      submitShopDescription() {
        if (this.editShopInfo.description === this.shopInfo.description) {
          this.$message({
            message: "店铺描述未作更改",
            type: "error"
          });
          return false;
        }
        if (this.editShopInfo.description === "") {
          this.$message({
            message: "店铺描述不能为空",
            type: "error"
          });
          return false;
        }
        this.$confirm(`确定修改店铺描述吗？`, "提示", {
          type: "warning",
          dangerouslyUseHTMLString: true
        })
          .then(async () => {
            this.$prompt("请输入备注信息", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputValidator(val) {
                if (val == null || removeSpace(val) == "") {
                  return "备注信息不能为空";
                } else {
                  return true;
                }
              }
            })
              .then(async ({value}) => {
                try {
                  let res = await bookApi.updateShopDescription({
                    description: this.editShopInfo.description,
                    remark: value
                  });
                  this.isEditDescription = false;
                  if (res.errorCode === 200) {
                    this.getShopInfoFun();
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
                  this.isEditDescription = false;
                  handleError(error);
                }
              })
              .catch(() => {
              });
          })
          .catch(() => {
          });
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .shop-info
    .el-form-item
      margin-bottom 10px

    .edit
      display flex
      align-items center
      color #333

      .el-button
        margin-left 10px

      .shop-name-edit
        display flex
        align-items center

        .el-input
          width 220px

        .el-textarea
          width 500px
          font-family Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif

        p
          max-width 500px
          line-height 22px
          margin-right 20px
</style>
