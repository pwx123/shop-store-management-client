<template>
  <div class="classify">
    <div class="filter-search">
      <el-input placeholder="分类名称"
        size="medium"
        v-model="filterName"
        clearable
        @keyup.native.enter="filterByName">
      </el-input>
      <el-button type="primary"
        size="medium"
        icon="el-icon-search"
        @click.native="filterByName">
        搜索
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
          @click.native="deleteClassify(item)">删除</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getAllClassify, deleteClassify } from "./../../api/bookList";
import { handleError, tirmAll } from "./../../util/util";

export default {
  data() {
    return {
      filterName: "",
      classifyData: [],
      filterDate: [],
      loading: false
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
        `确实删除 <span style='color:#f56c6c'>${item.name}</span> 这个分类吗？`,
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
            let res = await deleteClassify({ id: item.id });
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
        .catch(() => {});
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
