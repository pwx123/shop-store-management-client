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
          :default-time="['00:00:00', '23:59:59']"></el-date-picker>
      <el-select v-model="searchParam.status"
          size="medium"
          placeholder="订单类型"
          clearable>
        <el-option v-for="item in status"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
      </el-select>
      <el-input placeholder="订单编号"
          size="medium"
          v-model.trim="searchParam.orderNumId"
          clearable
          @keyup.native.enter="search"></el-input>
      <el-input placeholder="用户账号"
          size="medium"
          v-model.trim="searchParam.userName"
          clearable
          @keyup.native.enter="search"></el-input>
    </div>
    <div class="option-button">
      <el-button type="primary"
          size="medium"
          icon="el-icon-search"
          @click.native="search">搜索
      </el-button>
      <el-button type="danger"
          size="medium"
          @click.native="resetSearch">重置
      </el-button>
    </div>
    <div class="table-container">
      <el-table size="mini"
          v-loading="loading"
          :data="tableData"
          :header-cell-style="{background: '#fdfdfd'}"
          :height="460"
          border>
        <el-table-column prop="orderNumId"
            align="center"
            label="用户账号"
            width="190"></el-table-column>
        <el-table-column prop="userName"
            align="center"
            label="用户账号"
            width="130"></el-table-column>
        <el-table-column align="center"
            label="订单状态"
            width="120">
          <template slot-scope="scope">
            <span>{{statusMap[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
            label="退款金额"
            width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.refundMoney">{{ scope.row.refundMoney | money}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark"
            align="center"
            min-width="300"
            label="备注"></el-table-column>
        <el-table-column prop="createdAt"
            align="center"
            label="操作时间"
            width="180"></el-table-column>
      </el-table>
      <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParam.pageNumber"
          :page-sizes="[15, 30, 50]"
          :page-size="searchParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
  import {getRefundRecord} from "./../../api/order";
  import {timeFormat, getDatePickerTime, handleError} from "./../../util/util";

  export default {
    data() {
      return {
        // 列表数据总数
        total: 0,
        // 时间选择框
        dataPicker: [],
        // 列表数据
        tableData: [],
        // 加载中
        loading: false,
        // 搜索参数
        searchParam: {
          pageNumber: 1,
          pageSize: 15,
          startTime: "",
          endTime: "",
          status: "",
          orderNumId: "",
          userName: ""
        },
        status: [
          {
            value: 7,
            label: "退款完成"
          },
          {
            value: 8,
            label: "拒绝退款"
          }
        ]
      };
    },
    computed: {
      statusMap() {
        let obj = {};
        for (let i = 0, len = this.status.length; i < len; i++) {
          obj[this.status[i].value] = this.status[i].label;
        }
        return obj;
      }
    },
    created() {
      // 默认查一个月的
      this.dataPicker = getDatePickerTime(30);
      this.getOrderRefundRecord();
    },
    methods: {
      // 执行搜索
      search() {
        this.searchParam.pageNumber = 1;
        this.getOrderRefundRecord();
      },
      // 获取表格数据
      async getOrderRefundRecord() {
        this.searchParam.startTime = this.dataPicker[0];
        this.searchParam.endTime = this.dataPicker[1];
        try {
          this.loading = true;
          let res = await getRefundRecord(this.searchParam);
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
          status: "",
          orderNumId: "",
          userName: ""
        };
        this.getOrderRefundRecord();
      },
      // 每页页数变化
      handleSizeChange(val) {
        this.searchParam.pageSize = val;
        this.getOrderRefundRecord();
      },
      // 页码变化
      handleCurrentChange(val) {
        this.searchParam.pageNumber = val;
        this.getOrderRefundRecord();
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

    .el-input, .el-select
      max-width 140px
      margin-right 10px
      margin-bottom 10px

  .table-container
    margin-top 20px

    .el-pagination
      margin-top 20px
</style>
