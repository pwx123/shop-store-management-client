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
        v-model.trim="searchParam.orderId"
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
        @click.native="search">搜索</el-button>
      <el-button type="danger"
        size="medium"
        @click.native="resetSearch">重置</el-button>
      <el-button type="primary"
        size="medium"
        @click.native="submitOrder">确认订单</el-button>
    </div>
    <div class="table-container">
      <el-table size="mini"
        ref="orderTable"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{background: '#fdfdfd'}"
        :height="460"
        border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"
          align="center"
          width="40"></el-table-column>
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
          width="140"></el-table-column>
        <el-table-column prop="userName"
          align="center"
          label="用户账号"
          width="140"></el-table-column>
        <el-table-column align="center"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <span :style="'color: ' + (statusMap[scope.row.status] ? statusMap[scope.row.status].color : '--') ">{{statusMap[scope.row.status] ? statusMap[scope.row.status].val : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          width="100"
          label="书籍数">
          <template slot-scope="scope">
            <el-button size="mini"
              type="text"
              class="has-underline"
              @click="(expandColumn(scope.row))">{{scope.row.orderNum}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orderMoney"
          align="center"
          label="商品总价（元）"
          width="120"></el-table-column>
        <el-table-column prop="deliveryMoney"
          align="center"
          label="运费（元）"
          width="120"></el-table-column>
        <el-table-column prop="totalMoney"
          align="center"
          label="实付款（元）"
          width="120"></el-table-column>
        <el-table-column align="center"
          width="120"
          label="快递公司">
          <template slot-scope="scope">
            <template v-if="scope.row.deliveryId === 0 || scope.row.deliveryId">
              <span>{{deliveryCompanyMap[scope.row.deliveryId]}}</span>
              <el-button type="text"
                v-if="scope.row.status === 3"
                size="mini"
                @click="showDeliveryDialog(scope.row, true)">编辑</el-button>
            </template>
            <el-button v-else-if="scope.row.status === 2"
              type="text"
              size="mini"
              @click="showDeliveryDialog(scope.row, false)">上传物流信息</el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          width="180"
          label="快递单号">
          <template slot-scope="scope">
            <template v-if="scope.row.deliveryOrderId === 0 || scope.row.deliveryOrderId">
              <span>{{scope.row.deliveryOrderId}}</span>
              <el-button type="text"
                v-if="scope.row.status === 3"
                size="mini"
                @click="showDeliveryDialog(scope.row, true)">编辑</el-button>
            </template>
            <el-button v-else-if="scope.row.status === 2"
              type="text"
              size="mini"
              @click="showDeliveryDialog(scope.row, false)">上传物流信息</el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          width="120"
          label="收货地址">
          <template slot-scope="scope">
            <span>{{scope.row.deliveryAddressId || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt"
          align="center"
          label="创建时间"
          width="160"></el-table-column>
        <el-table-column prop="deliveryAt"
          align="center"
          label="发货时间"
          width="160"></el-table-column>
        <el-table-column prop="dealAt"
          align="center"
          label="完成时间"
          width="160"></el-table-column>
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
    <el-dialog :title="isEditDelivery ? '编辑': '上传' + '物流信息'"
      width="400px"
      class="delivery-dialog"
      :visible.sync="addDeliveryInfoDialog"
      @close="closeDialog">
      <el-form ref="addDelivery"
        label-width="80px"
        :model="deliveryInfo"
        :rules="deliveryInfoValidate">
        <el-form-item prop="deliveryId"
          label="物流公司">
          <el-select placeholder="请选择物流公司"
            v-model.trim="deliveryInfo.deliveryId"
            clearable>
            <el-option v-for="item in deliveryCompanyData"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deliveryOrderId"
          label="物流编号">
          <el-input v-model.trim="deliveryInfo.deliveryOrderId"
            placeholder="请输入物流单号"
            maxlength="40"
            autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="addDeliveryInfoDialog = false">取 消</el-button>
        <el-button size="small"
          type="primary"
          @click="submitDeliveryInfo('addDelivery')">确 定</el-button>
      </span>
    </el-dialog>
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
      // 多选数组
      multipleSelection: [],
      // 物流公司数据
      deliveryCompanyData: [],
      // 上传物流弹窗
      addDeliveryInfoDialog: false,
      // 上传物流信息
      deliveryInfo: {
        id: "",
        deliveryId: "",
        deliveryOrderId: ""
      },
      // 是否编辑物流
      isEditDelivery: false,
      // 上传物流校验
      deliveryInfoValidate: {
        deliveryId: [
          { required: true, message: "请选择物流公司", trigger: "change" }
        ],
        deliveryOrderId: [
          {
            required: true,
            validator: this.deliveryOrderIdReg,
            trigger: "blur"
          }
        ]
      },
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
          label: "待支付",
          color: "#0099cc"
        },
        {
          value: 1,
          label: "待处理",
          color: "#f56c6c"
        },
        {
          value: 2,
          label: "待发货",
          color: "#ff9966"
        },
        {
          value: 3,
          label: "已发货",
          color: "#0099cc"
        },
        {
          value: 4,
          label: "待收货",
          color: "#3366cc"
        },
        {
          value: 5,
          label: "已完成",
          color: "#67c23a"
        },
        {
          value: 6,
          label: "退款处理中",
          color: "#cc9966"
        },
        {
          value: 7,
          label: "退款完成",
          color: "#25C6FC"
        },
        {
          value: 8,
          label: "拒绝退款",
          color: "#909399"
        },
        {
          value: 9,
          label: "订单超时",
          color: "#909399"
        },
        {
          value: 10,
          label: "已删除",
          color: "#909399"
        }
      ]
    };
  },
  computed: {
    statusMap() {
      let obj = {};
      for (let i = 0, len = this.status.length; i < len; i++) {
        obj[this.status[i].value] = {};
        obj[this.status[i].value].val = this.status[i].label;
        obj[this.status[i].value].color = this.status[i].color;
      }
      return obj;
    },
    deliveryCompanyMap() {
      let obj = {};
      for (let i = 0, len = this.deliveryCompanyData.length; i < len; i++) {
        obj[this.deliveryCompanyData[i].id] = this.deliveryCompanyData[i].name;
      }
      return obj;
    }
  },
  created() {
    // 默认查一个月的
    this.dataPicker = getDatePickerTime(30);
    this.getOrderList();
    this.getAllDeliveryCompany();
  },
  methods: {
    // 执行搜索
    search() {
      this.searchParam.pageNumber = 1;
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
    // 待处理订单确认
    async submitOrder() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: "请选择要确认的订单",
          type: "warning"
        });
        return false;
      }
      if (this.multipleSelection.every(item => item.status === 1)) {
        let ids = this.multipleSelection.map(item => item.id);
        try {
          let res = await orderApi.submitOrder({ ids: ids.join(",") });
          if (res.errorCode === 200) {
            this.$message({
              message: "确认成功，请尽快发货",
              type: "success"
            });
            this.getOrderList();
          } else {
            this.$message({
              message: res.errorMsg,
              type: "error"
            });
          }
        } catch (error) {
          handleError(error);
        }
      } else {
        this.$message({
          message: "只能确认 待处理 的订单",
          type: "warning"
        });
      }
    },
    // 获取全部物流公司
    async getAllDeliveryCompany() {
      try {
        let res = await orderApi.getAllDeliveryCompany();
        if (res.errorCode === 200) {
          this.deliveryCompanyData = res.data;
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
    // 上传物流信息
    submitDeliveryInfo(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            let res = await orderApi.submitDeliveryInfo(this.deliveryInfo);
            if (res.errorCode === 200) {
              this.$message({
                message: "上传成功，状态已更改为已发货",
                type: "success"
              });
              this.addDeliveryInfoDialog = false;
              this.$refs["addDelivery"].clearValidate();
              this.getOrderList();
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
    // 展示上传物流信息弹框
    showDeliveryDialog(row, isEdit) {
      if (row.status != 2 && !isEdit) {
        this.$message({
          message: "只有待发货状态能上传物流信息",
          type: "warning"
        });
        return false;
      }
      this.deliveryInfo = {
        id: row.id,
        deliveryId: "",
        deliveryOrderId: ""
      };
      this.isEditDelivery = isEdit;
      if (isEdit) {
        this.deliveryInfo.deliveryId = row.deliveryId;
        this.deliveryInfo.deliveryOrderId = row.deliveryOrderId;
      }
      this.addDeliveryInfoDialog = true;
    },
    // 展开表格行
    expandColumn(row) {
      this.$refs["orderTable"].toggleRowExpansion(row);
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
    // 物流单号校验
    deliveryOrderIdReg(rule, value, callback) {
      if (value == "") {
        callback(new Error("请输入物流单号"));
      } else if (!/^[A-Za-z0-9]+$/.test(value)) {
        callback(new Error("物流单号只能包含字母或数字"));
      } else {
        callback();
      }
    },
    // 关闭弹框
    closeDialog() {
      this.$refs["addDelivery"].clearValidate();
    },
    // 选择变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
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

  .has-underline
    text-decoration underline

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
      width 100px
      height 100px
      margin-right 20px
      padding 10px
      overflow hidden

      img
        width 100px

.delivery-dialog
  .el-select
    width 100%
</style>
