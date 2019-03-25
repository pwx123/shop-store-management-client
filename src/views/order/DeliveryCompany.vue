<template>
  <div class="deliveryCompany">
    <div class="filter-search">
      <el-input placeholder="物流公司名称"
          size="medium"
          v-model.trim="filterName"
          clearable
          @keyup.native.enter="filterByName">
      </el-input>
      <el-button type="primary"
          size="medium"
          icon="el-icon-search"
          @click.native="filterByName">
        搜索
      </el-button>
      <el-button type="success"
          size="medium"
          @click.native="addDeliveryCompanyFun('form')">
        添加
      </el-button>
      <el-button type="danger"
          size="medium"
          @click.native="downloadFile">模板下载
      </el-button>
      <el-upload class="form-upload-excel"
          ref="uploadExcel"
          name="bookList"
          action="#"
          accept=".xlsx, .xls"
          :http-request="uploadExcelFile"
          :show-file-list="false">
        <el-button slot="trigger"
            size="medium"
            type="success"
            :loading="uploadExcelLoading">批量上传
        </el-button>
      </el-upload>
    </div>
    <div class="deliveryCompany-cards"
        v-loading="loading">
      <el-card shadow="hover"
          v-for="item in filterDate"
          :body-style="{padding:'10px',display:'flex',justifyContent:'space-between',lineHeight:'32px'}"
          :key="item.id">
        <span>{{item.name}}</span>
        <el-button type="text"
            size="small"
            @click.native="deleteDeliveryCompany(item)">删除
        </el-button>
      </el-card>
    </div>
    <el-dialog title="添加物流公司"
        width="400px"
        :visible.sync="dialogVisible"
        @close="closeDialog">
      <el-form ref="form"
          :model="addDeliveryCompanyValue"
          :rules="addDeliveryCompanyValidate">
        <el-form-item prop="deliveryCompanyName">
          <el-input v-model.trim="addDeliveryCompanyValue.deliveryCompanyName"
              placeholder="请输入物流公司名称"
              maxlength="100"
              autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
          class="dialog-footer">
        <el-button size="small"
            @click="dialogVisible = false">取 消</el-button>
        <el-button size="small"
            type="primary"
            @click="submitAddDeliveryCompany('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getAllDeliveryCompany,
    deleteDeliveryCompany,
    addDeliveryCompany,
    uploadDeliveryExcel,
    downloadDeliveryTemplate
  } from "./../../api/order";
  import {handleError, tirmAll} from "./../../util/util";

  export default {
    data() {
      return {
        // 物流公司搜索
        filterName: "",
        // 物流公司数据
        deliveryCompanyData: [],
        // 搜索过滤数据
        filterDate: [],
        // 加载中
        loading: false,
        // 新增弹框
        dialogVisible: false,
        // 新增数据
        addDeliveryCompanyValue: {
          deliveryCompanyName: ""
        },
        // 上传excel按钮loading
        uploadExcelLoading: false,
        // 新增校验
        addDeliveryCompanyValidate: {
          deliveryCompanyName: [
            {required: true, message: "请输入物流公司名称", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getAllDeliveryCompanyFun();
    },
    methods: {
      // 获取全部物流公司
      async getAllDeliveryCompanyFun() {
        try {
          this.loading = true;
          let res = await getAllDeliveryCompany();
          this.loading = false;
          if (res.errorCode === 200) {
            this.deliveryCompanyData = res.data;
            this.filterByName();
          } else {
            this.$message({
              message: res.errorMsg,
              type: "error"
            });
          }
        } catch (error) {
          this.loading = false;
          handleError(error);
        }
      },
      // 删除物流公司
      deleteDeliveryCompany(item) {
        this.$confirm(
          `确定删除 <span style='color:#f56c6c'>${
            item.name
            }</span> 这个物流公司吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            dangerouslyUseHTMLString: true
          }
        )
          .then(async () => {
            try {
              let res = await deleteDeliveryCompany({id: item.id});
              if (res.errorCode === 200) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getAllDeliveryCompanyFun();
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
          });
      },
      // 上传excel
      async uploadExcelFile(params) {
        let reg = /.*\.(xlsx|xls)$/;
        if (!reg.test(params.file.name)) {
          this.$message({
            message: "格式不支持",
            type: "error"
          });
          return false;
        }
        if (params.file.size > 1024 * 1024 * 20) {
          this.$message({
            message: "大小不能超过20M",
            type: "error"
          });
          return false;
        }
        let data = new FormData();
        data.append("excel", params.file);
        let config = {
          headers: {"Content-Type": "multipart/form-data"}
        };
        try {
          this.uploadExcelLoading = true;
          let res = await uploadDeliveryExcel(data, config);
          this.uploadExcelLoading = false;
          if (res.errorCode === 200) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.getAllDeliveryCompanyFun();
          } else {
            this.$alert(res.errorMsg, "提示", {
              dangerouslyUseHTMLString: true
            });
          }
        } catch (error) {
          this.uploadExcelLoading = false;
          handleError(error);
        }
      },
      // 下载模板excel
      async downloadFile() {
        let params = {};
        let config = {
          responseType: "blob",
          headers: {filename: "utf-8"}
        };
        try {
          let data = await downloadDeliveryTemplate(params, config);
          let blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          let objectUrl = window.URL.createObjectURL(blob);
          let downloadElement = document.createElement("a");
          downloadElement.href = objectUrl;
          downloadElement.download = `物流公司上传模板.xlsx`;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
          handleError(error);
        }
      },
      // 搜索
      filterByName() {
        if (tirmAll(this.filterName) === "") {
          this.filterDate = this.deliveryCompanyData;
        } else {
          this.filterDate = this.deliveryCompanyData.filter(item => {
            return item.name.indexOf(this.filterName) !== -1;
          });
        }
      },
      // 添加物流公司
      addDeliveryCompanyFun(formName) {
        this.addDeliveryCompanyValue = {
          deliveryCompanyName: ""
        };
        this.dialogVisible = true;
      },
      // 添加物流公司提交
      submitAddDeliveryCompany(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            try {
              let res = await addDeliveryCompany({
                deliveryCompanyName: this.addDeliveryCompanyValue
                  .deliveryCompanyName
              });
              if (res.errorCode === 200) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.dialogVisible = false;
                this.getAllDeliveryCompanyFun();
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
      // 关闭弹框
      closeDialog() {
        this.$refs["form"].clearValidate();
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .filter-search
    display flex
    margin-bottom 20px

    .form-upload-excel
      display inline-block
      margin-left 10px

    .el-input
      width 220px
      margin-right 20px

  .deliveryCompany-cards
    display flex
    flex-wrap wrap

    .el-card
      width 160px
      margin-right 10px
      margin-bottom 10px

      .el-button--text
        color #f56c6c
</style>
