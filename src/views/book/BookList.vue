<template>
  <div>
    <div class="filter-search">
      <el-date-picker v-model="dataPicker"
        size="medium"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :editable="false"
        :clearable="false"
        :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-input placeholder="书名"
        size="medium"
        v-model="searchParam.name"
        clearable>
      </el-input>
      <el-input placeholder="作者"
        size="medium"
        v-model="searchParam.author"
        clearable>
      </el-input>
      <el-input placeholder="出版社"
        size="medium"
        v-model="searchParam.press"
        clearable>
      </el-input>
    </div>
    <div class="option-button">
      <el-button type="primary"
        size="medium"
        icon="el-icon-search"
        @click.native="search">
        搜索
      </el-button>
      <el-button type="danger"
        size="medium"
        @click.native="resetSearch">
        重置
      </el-button>
      <el-button type="danger"
        size="medium"
        @click.native="deleteBook">
        删除
      </el-button>
    </div>
    <div class="table-container">
      <el-table size="small"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="headerStyle"
        :height="460"
        @selection-change="handleSelectionChange"
        border>
        <el-table-column type="selection"
          align="center"
          width="40">
        </el-table-column>
        <el-table-column prop="name"
          align="center"
          label="书名"
          width="180">
        </el-table-column>
        <el-table-column prop="author"
          align="center"
          label="作者"
          width="180">
        </el-table-column>
        <el-table-column prop="press"
          align="center"
          label="出版社"
          width="180">
        </el-table-column>
        <el-table-column prop="title"
          align="center"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column prop="description"
          align="center"
          label="描述"
          width="180">
        </el-table-column>
        <el-table-column prop="stock"
          align="center"
          label="库存"
          width="180">
        </el-table-column>
        <el-table-column prop="price"
          align="center"
          label="价格"
          width="180">
        </el-table-column>
        <el-table-column prop="salePrice"
          align="center"
          label="折后价"
          width="180">
        </el-table-column>
        <el-table-column prop="isSell"
          align="center"
          label="是否在售"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="图片"
          width="180">
        </el-table-column>
        <el-table-column prop="createdAt"
          align="center"
          label="创建时间"
          width="160">
        </el-table-column>
        <el-table-column prop="updatedAt"
          align="center"
          label="修改时间"
          width="160">
        </el-table-column>
      </el-table>
      <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParam.pageNumber"
        :page-sizes="[15, 30, 50]"
        :page-size="searchParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import * as bookApi from "./../../api/bookList";
import { timeFormat, getDatePickerTime, handleError } from "./../../util/util";
export default {
  data() {
    return {
      // 列表数据总数
      total: 0,
      // 时间选择框
      dataPicker: [],
      // 列表数据
      tableData: [],
      // 表头颜色
      headerStyle: {
        background: "#fdfdfd"
      },
      // 加载中
      loading: false,
      // 选择的值
      multipleSelection: [],
      // 搜索参数
      searchParam: {
        pageNumber: 1,
        pageSize: 15,
        startTime: "",
        endTime: "",
        name: "",
        author: "",
        press: ""
      }
    };
  },
  created() {
    // 默认查一个月的
    this.dataPicker = getDatePickerTime(30);
    this.getBookList();
  },
  methods: {
    // 执行搜索
    search() {
      this.getBookList();
    },
    // 获取表格数据
    async getBookList() {
      this.searchParam.startTime = this.dataPicker[0];
      this.searchParam.endTime = this.dataPicker[1];
      try {
        this.loading = true;
        let res = await bookApi.getBookList(this.searchParam);
        this.loading = false;
        if (res.errorCode === 200) {
          this.tableData = res.data.rows;
          this.total = res.data.total;
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
    // 重置搜索条件
    resetSearch() {
      this.dataPicker = getDatePickerTime(30);
      this.searchParam = {
        pageNumber: 1,
        pageSize: 15,
        startTime: "",
        endTime: "",
        name: "",
        author: "",
        press: ""
      };
      this.getBookList();
    },
    // 删除图书
    async deleteBook() {
      let params = this.multipleSelection.map(val => val.id);
      let obj = {};
      obj.ids = params.join(",");
      if (params.length === 0) {
        this.$message({
          message: "请选择要删除的图书",
          type: "warning"
        });
        return false;
      }
      try {
        let res = await bookApi.deleteBooks(obj);
        if (res.errorCode === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.searchParam.pageNumber = 1;
          this.getBookList();
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
    // 图书选择变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 每页页数变化
    handleSizeChange(val) {
      this.searchParam.pageSize = val;
      this.getBookList();
    },
    // 页码变化
    handleCurrentChange(val) {
      this.searchParam.pageNumber = val;
      this.getBookList();
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../../styl/variables.styl'

.filter-search
  display flex
  flex-wrap wrap

  .el-date-editor
    max-width 360px
    margin-right 10px
    margin-bottom 10px

  .el-input
    max-width 140px
    margin-right 10px
    margin-bottom 10px

.table-container
  margin-top 20px

  .el-pagination
    margin-top 20px
</style>
