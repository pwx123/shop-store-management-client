<template>
  <div class="classify">
    <div class="filter-search">
      <el-input placeholder="分类名称"
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
          @click.native="addClassifyFun('form')">
        添加
      </el-button>
    </div>
    <div class="classify-cards"
        v-loading="loading">
      <el-card shadow="hover"
          v-for="item in filterDate"
          :body-style="{padding:'10px',display:'flex',justifyContent:'space-between',lineHeight:'32px'}"
          :key="item.id">
        <span>{{item.name}}</span>
        <el-button type="text"
            size="small"
            @click.native="deleteClassify(item)">删除
        </el-button>
      </el-card>
    </div>
    <el-dialog title="添加分类"
        width="400px"
        :visible.sync="dialogVisible"
        @close="closeDialog">
      <el-form ref="form"
          :model="addClassifyValue"
          :rules="addClassifyValidate">
        <el-form-item prop="classifyName">
          <el-input v-model.trim="addClassifyValue.classifyName"
              placeholder="请输入分类名称"
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
            @click="submitAddClassify('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getAllClassify,
    deleteClassify,
    addClassify
  } from "./../../api/bookList";
  import {handleError, tirmAll} from "./../../util/util";

  export default {
    data() {
      return {
        filterName: "",
        classifyData: [],
        filterDate: [],
        loading: false,
        dialogVisible: false,
        addClassifyValue: {
          classifyName: ""
        },
        addClassifyValidate: {
          classifyName: [
            {required: true, message: "请输入分类名称", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getAllClassifyFun();
    },
    methods: {
      // 获取全部分类
      async getAllClassifyFun() {
        try {
          this.loading = true;
          let res = await getAllClassify();
          this.loading = false;
          if (res.errorCode === 200) {
            this.classifyData = res.data;
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
      // 删除分类
      deleteClassify(item) {
        this.$confirm(
          `确定删除 <span style='color:#f56c6c'>${item.name}</span> 这个分类吗？`,
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
              let res = await deleteClassify({id: item.id});
              if (res.errorCode === 200) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getAllClassifyFun();
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
      // 搜索
      filterByName() {
        if (tirmAll(this.filterName) === "") {
          this.filterDate = this.classifyData;
        } else {
          this.filterDate = this.classifyData.filter(item => {
            return item.name.indexOf(this.filterName) !== -1;
          });
        }
      },
      // 添加分类
      addClassifyFun(formName) {
        this.addClassifyValue = {
          classifyName: ""
        };
        this.dialogVisible = true;
      },
      // 添加分类提交
      submitAddClassify(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            try {
              let res = await addClassify({
                classifyName: this.addClassifyValue.classifyName
              });
              if (res.errorCode === 200) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.dialogVisible = false;
                this.getAllClassifyFun();
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

    .el-input
      width 220px
      margin-right 20px

  .classify-cards
    display flex
    flex-wrap wrap

    .el-card
      width 160px
      margin-right 10px
      margin-bottom 10px

      .el-button--text
        color #f56c6c
</style>
