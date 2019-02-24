<template>
  <div>
    <div class="filter-search">
      <el-date-picker v-model="dataPicker"
        size="medium"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm:ss"
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
    </div>
    <div class="table-container">
      <el-table :data="tableData"
        size="small"
        :header-cell-style="headerStyle"
        :height="460"
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
        <el-table-column align="center"
          label="创建时间"
          width="160">
          <template slot-scope="scope">
            <span>{{ timeFormatLocal(scope.row.createAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          label="修改时间"
          width="160">
          <template slot-scope="scope">
            <span>{{ timeFormatLocal(scope.row.updateAt) }}</span>
          </template>
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
import * as bookApi from "@/api/bookList";
import { timeFormat, getDatePickerTime } from "./../../util/util";
export default {
  data() {
    return {
      total: 0,
      dataPicker: [],
      tableData: [],
      headerStyle: {
        background: "#fdfdfd"
      },
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
    this.dataPicker = getDatePickerTime(30);
    this.getBookList();
  },
  methods: {
    search() {
      this.getBookList();
    },
    getBookList() {
      this.searchParam.startTime = this.dataPicker[0];
      this.searchParam.endTime = this.dataPicker[1];
      bookApi.getBookList(this.searchParam).then(res => {
        if (res.errorCode === 200) {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$message({
            message: res.errorMsg,
            type: "error"
          });
        }
      });
    },
    resetSearch(){

    },
    handleSizeChange(val) {
      this.searchParam.pageSize = val;
      this.getBookList();
    },
    handleCurrentChange(val) {
      this.searchParam.pageNumber = val;
      this.getBookList();
    },
    timeFormatLocal(val) {
      return timeFormat(val, true);
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
    margin-bottom 10px

  .el-input
    max-width 140px
    margin-left 10px
    margin-bottom 10px

.table-container
  margin-top 20px

  .el-pagination
    margin-top 20px
</style>
