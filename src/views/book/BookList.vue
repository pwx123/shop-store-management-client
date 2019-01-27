<template>
  <div>
    <div class="filter-search">
      <el-date-picker v-model="searchParam.time"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-input placeholder="书名"
        v-model="searchParam.name"
        clearable>
      </el-input>
      <el-input placeholder="作者"
        v-model="searchParam.author"
        clearable>
      </el-input>
      <el-input placeholder="出版社"
        v-model="searchParam.press"
        clearable>
      </el-input>
    </div>
    <div class="option-button">
      <el-button type="primary"
        icon="el-icon-search"
        plain>搜索</el-button>
      <el-button type="danger"
        plain>重置</el-button>
    </div>
    <div class="table-container">
      <el-table :data="tableData"
        size="medium"
        :header-cell-style="headerStyle"
        :height="400"
        border>
        <el-table-column type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column prop="date"
          align="center"
          label="书名"
          width="180">
        </el-table-column>
        <el-table-column prop="name"
          align="center"
          label="作者"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="出版社"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="描述"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="库存"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="价格"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="折后价"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="是否在售"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="图片"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column prop="address"
          align="center"
          label="修改时间"
          width="180">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchParam: {
        time: "",
        name: "",
        author: "",
        press: ""
      },
      tableData: [
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        },
        {
          date: "",
          name: "",
          address: ""
        }
      ],
      headerStyle: {
        background: "#fdfdfd"
      }
    };
  }
};
</script>

<style lang="stylus" scoped>
@import './../../styl/variables.styl'

.filter-search
  display flex
  flex-wrap wrap

  .el-date-editor
    margin-bottom 10px

  .el-input
    max-width 160px
    margin-left 20px
    margin-bottom 10px

.table-container
  margin-top 20px
</style>
