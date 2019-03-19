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
        placeholder="状态"
        clearable>
        <el-option v-for="item in status"
          :key="item.value"
          :value="item.value"
          :label="item.label"></el-option>
      </el-select>
      <el-input placeholder="订单号"
        size="medium"
        v-model="searchParam.orderId"
        clearable
        @keyup.native.enter="search"></el-input>
      <el-input placeholder="用户账号"
        size="medium"
        v-model="searchParam.userName"
        clearable
        @keyup.native.enter="search"></el-input>
    </div>
    <div class="option-button">
      <el-button type="primary"
        size="medium"
        icon="el-icon-search"
        @click.native="search">搜索</el-button>
      <el-button type="danger"
        size="medium"
        @click.native="resetSearch">重置</el-button>
    </div>
    <div class="table-container">
      <el-table size="mini"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{background: '#fdfdfd'}"
        :height="460"
        border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div v-for="item in props.row.orders"
              class="expand-info"
              :key="item.id">
              <div class="img">
                <img :src="item.bookImageUrl">
              </div>
              <span>书籍名称：{{item.bookName}}</span>
              <span>数量：{{item.bookNum}}</span>
              <span>价格：{{item.bookPrice}}</span>
              <span>折后价：{{item.bookSalePrice}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderId"
          align="center"
          label="订单号"
          width="160"></el-table-column>
        <el-table-column prop="userName"
          align="center"
          label="用户账号"
          width="160"></el-table-column>
        <el-table-column align="center"
          label="状态"
          width="140">
          <template slot-scope="scope">
            <span>{{statusMap[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          width="140"
          label="书籍数">
          <template slot-scope="scope">
            <span>{{scope.row.orderNum}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderMoney"
          align="center"
          label="商品总价"
          width="180"></el-table-column>
        <el-table-column prop="deliveryMoney"
          align="center"
          label="运费"
          width="180"></el-table-column>
        <el-table-column prop="totalMoney"
          align="center"
          label="实付款"
          width="180"></el-table-column>
        <el-table-column align="center"
          width="140"
          label="快递公司">
          <template slot-scope="scope">
            <span>{{scope.row.deliveryId || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          width="140"
          label="快递单号">
          <template slot-scope="scope">
            <span>{{scope.row.deliveryOrderId || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          width="140"
          label="收货地址">
          <template slot-scope="scope">
            <span>{{scope.row.deliveryAddressId || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt"
          align="center"
          label="创建时间"
          width="180"></el-table-column>
        <el-table-column prop="deliveryAt"
          align="center"
          label="发货时间"
          width="180"></el-table-column>
        <el-table-column prop="dealAt"
          align="center"
          label="完成时间"
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
import * as orderApi from "./../../api/order";
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
      // 加载中
      loading: false,
      // 搜索参数
      searchParam: {
        pageNumber: 1,
        pageSize: 15,
        startTime: "",
        endTime: "",
        status: "",
        orderId: "",
        userName: ""
      },
      status: [
        {
          value: 0,
          label: "待处理"
        },
        {
          value: 1,
          label: "待发货"
        },
        {
          value: 2,
          label: "已发货"
        },
        {
          value: 3,
          label: "待收货"
        },
        {
          value: 4,
          label: "已完成"
        },
        {
          value: 5,
          label: "退款处理中"
        },
        {
          value: 6,
          label: "退款完成"
        },
        {
          value: 7,
          label: "已删除"
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
    this.getOrderList();
  },
  methods: {
    // 执行搜索
    search() {
      this.getOrderList();
    },
    // 获取表格数据
    async getOrderList() {
      this.searchParam.startTime = this.dataPicker[0];
      this.searchParam.endTime = this.dataPicker[1];
      try {
        this.loading = true;
        let res = await orderApi.getOrderList(this.searchParam);
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
        orderId: "",
        userName: ""
      };
      this.getOrderList();
    },
    // 每页页数变化
    handleSizeChange(val) {
      this.searchParam.pageSize = val;
      this.getOrderList();
    },
    // 页码变化
    handleCurrentChange(val) {
      this.searchParam.pageNumber = val;
      this.getOrderList();
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

  .expand-info
    width 800px
    display flex
    justify-content space-around
    align-items center
    margin-bottom 10px
    border 1px dashed #ccc
    border-radius 10px
    font-size 14px

    span
      flex 1

    .img
      width 140px
      margin-right 20px
      padding 10px

      img
        width 140px
</style>
