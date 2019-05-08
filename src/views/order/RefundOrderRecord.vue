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
      <el-input placeholder="退款流水号"
          size="medium"
          v-model.trim="searchParam.refundOrderId"
          clearable
          @keyup.native.enter="search"></el-input>
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
      <el-button type="primary"
          class="edit-btn"
          title="编辑表格"
          size="medium"
          icon="el-icon-edit-outline"
          circle
          @click.native="editTable">
      </el-button>
    </div>
    <div class="table-container">
      <el-table size="mini"
          v-loading="loading"
          :data="tableData"
          :header-cell-style="{background: '#fdfdfd'}"
          :height="460"
          border>
        <template v-for="item in tableItem">
          <el-table-column v-if="(item.name === 'refundOrderId') && item.isShow"
              key="refundOrderId"
              align="center"
              label="退款流水号"
              width="190">
            <template slot-scope="scope">
              <el-tooltip effect="dark"
                  content="点击复制"
                  placement="top"
                  :enterable="false">
              <span v-clipboard:copy="scope.row.refundOrderId"
                  v-clipboard:success="onCopySuccess"
                  v-clipboard:error="onCopyError">
                {{scope.row.refundOrderId}}
              </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'orderNumId') && item.isShow"
              key="orderNumId"
              prop="orderNumId"
              align="center"
              label="订单编号"
              width="190">
            <template slot-scope="scope">
              <el-tooltip effect="dark"
                  content="点击复制"
                  placement="top"
                  :enterable="false">
              <span v-clipboard:copy="scope.row.orderNumId"
                  v-clipboard:success="onCopySuccess"
                  v-clipboard:error="onCopyError">
                <el-button size="mini"
                    type="text"
                    class="has-underline"
                    @click="showOrderDetail(scope.row.orderNumId)">{{scope.row.orderNumId}}
                </el-button>
              </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'userName') && item.isShow"
              key="userName"
              prop="userName"
              align="center"
              label="用户账号"
              width="130">
            <template slot-scope="scope">
              <el-tooltip effect="dark"
                  content="点击复制"
                  placement="top"
                  :enterable="false">
              <span v-clipboard:copy="scope.row.userName"
                  v-clipboard:success="onCopySuccess"
                  v-clipboard:error="onCopyError">
                {{scope.row.userName}}
              </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'status') && item.isShow"
              key="status"
              align="center"
              label="订单状态"
              width="120">
            <template slot-scope="scope">
              <span :style="'color: ' + statusMap[scope.row.status].color">{{statusMap[scope.row.status].val}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'refundMoney') && item.isShow"
              key="refundMoney"
              align="center"
              label="退款金额"
              width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.refundMoney">{{ scope.row.refundMoney | money}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'remark') && item.isShow"
              key="remark"
              prop="remark"
              align="center"
              min-width="300"
              label="备注"></el-table-column>
          <el-table-column v-if="(item.name === 'createdAt') && item.isShow"
              key="createdAt"
              prop="createdAt"
              align="center"
              label="操作时间"
              width="180"></el-table-column>
        </template>
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
    <el-dialog title="订单详情"
        width="780px"
        class="detail-dialog"
        top="50px"
        :visible.sync="detailDialog">
      <div class="detail-dialog-content">
        <el-form ref="refund"
            label-width="80px"
            :model="orderDetail">
          <el-form-item label="订单号">
            <span>{{orderDetail.orderId}}</span>
          </el-form-item>
          <el-form-item label="用户账号">
            <span>{{orderDetail.userName}}</span>
          </el-form-item>
          <el-form-item label="状态">
          <span
              :style="'color: ' + (statusMap[orderDetail.status] ? statusMap[orderDetail.status].color : '')">{{statusMap[orderDetail.status] ? statusMap[orderDetail.status].val : "--"}}</span>
          </el-form-item>
          <el-form-item label="书籍数">
            {{orderDetail.orderNum}}
            <el-button type="text"
                class="book-num"
                @click="showBookToggle"
            >
              {{showBooks ? "收起": "展开"}}
              <i :class="'el-icon-arrow-right' + (showBooks ? ' active':'')"></i>
            </el-button>
            <el-collapse-transition>
              <div v-if="showBooks">
                <div class="expand-title">
                  <span>书籍</span>
                  <span>数量</span>
                  <span>价格</span>
                  <span>折后价</span>
                  <span>总价</span>
                </div>
                <div v-for="item in orderDetail.orders"
                    class="expand-info"
                    :key="item.id">
                  <div class="img">
                    <img :src="item.bookImageUrl">
                  </div>
                  <div class="book-info">
                    <span>{{item.bookName}}</span><br>
                    <span>{{item.bookTitle.length > 7 ?  item.bookTitle.slice(0,7) + "..." : item.bookTitle}}</span>
                  </div>
                  <span>{{item.bookNum}}</span>
                  <span>{{item.bookPrice | money}}</span>
                  <span>{{item.bookSalePrice | money}}</span>
                  <span>{{(item.bookSalePrice * item.bookNum).toFixed(2) | money}}</span>
                </div>
              </div>
            </el-collapse-transition>
          </el-form-item>
          <el-form-item label="商品总价">
            <span>{{orderDetail.orderMoney | money}}</span>
          </el-form-item>
          <el-form-item label="运费">
            <span>{{orderDetail.deliveryMoney | money}}</span>
          </el-form-item>
          <el-form-item label="实付款">
            <span>{{orderDetail.totalMoney | money}}</span>
          </el-form-item>
          <el-form-item label="物流公司">
            <span>{{deliveryCompanyMap[orderDetail.deliveryId] || "--"}}</span>
          </el-form-item>
          <el-form-item label="物流单号">
            <span>{{orderDetail.deliveryOrderId || "--"}}</span>
          </el-form-item>
          <el-form-item label="收货地址">
            <span v-if="orderDetail.deliveryAddressId">
              {{`${orderDetailAddress.provinceName} ${orderDetailAddress.cityName} ${orderDetailAddress.countryName} ${orderDetailAddress.detailAddress}`}}
            </span>
            <span v-else>--</span>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{orderDetail.createdAt || "--"}}</span>
          </el-form-item>
          <el-form-item label="发货时间">
            <span>{{orderDetail.deliveryAt || "--"}}</span>
          </el-form-item>
          <el-form-item label="完成时间">
            <span>{{orderDetail.dealAt || "--"}}</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer"
          class="dialog-footer">
        <el-button size="small"
            type="primary"
            @click="detailDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑表格"
        top="60px"
        width="300px"
        :visible.sync="editTableDialog">
      <div class="edit-table-dialog">
        <div class="tips">
          <span>
            <i class="el-icon-info"></i> 拖拽可排序
          </span>
          <el-button type="text"
              size="mini"
              @click="resetEditTable">
            恢复默认
          </el-button>
        </div>
        <SlickList lockAxis="y"
            class="slick-list"
            helperClass="slick-helper"
            :useDragHandle="true"
            v-model="editTableItem">
          <SlickItem v-for="(item, index) in editTableItem"
              class="slick-item"
              :index="index"
              :showHandle="true"
              :key="item.name">
            <span v-handle class="handle"></span>
            <el-checkbox v-model="selectEditTable"
                :label="item.name"
                :disabled="item.name === 'refundOrderId'">
              {{(index + 1) + " - " + item.title}}
            </el-checkbox>
          </SlickItem>
        </SlickList>
      </div>
      <span slot="footer"
          class="dialog-footer">
        <el-button size="small"
            @click="editTableDialog = false">取 消</el-button>
        <el-button size="small"
            type="primary"
            @click="submitEditTable">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getRefundRecord, getOrderByOrderId, getAllDeliveryCompany} from "./../../api/order";
  import {getOrderAddressById} from "./../../api/user";
  import {getDatePickerTime, handleError} from "./../../util/util";
  import {SlickList, SlickItem, HandleDirective} from "vue-slicksort";

  const STORAGE_NAME = "refundOrderRecordTable";

  export default {
    data() {
      return {
        // 列表数据总数
        total: 0,
        // 时间选择框
        dataPicker: [],
        // 列表数据
        tableData: [],
        // 订单详情数据
        orderDetail: {},
        // 订单详情-地址
        orderDetailAddress: {},
        // 加载中
        loading: false,
        // 全部物流公司
        deliveryCompanyData: [],
        // 订单详情弹窗
        detailDialog: false,
        // 展示图书详情
        showBooks: true,
        // 编辑表格弹窗
        editTableDialog: false,
        // 临时编辑表格数据
        editTableItem: [],
        // 编辑表格要显示的
        selectEditTable: [],
        // 搜索参数
        searchParam: {
          pageNumber: 1,
          pageSize: 15,
          startTime: "",
          endTime: "",
          refundOrderId: "",
          status: "",
          orderNumId: "",
          userName: ""
        },
        status: [
          {
            value: 7,
            label: "退款完成",
            color: "#25C6FC"
          },
          {
            value: 8,
            label: "拒绝退款",
            color: "#909399"
          }
        ],
        tableItem: [
          {
            name: "refundOrderId",
            title: "退款流水号",
            isShow: true
          },
          {
            name: "orderNumId",
            title: "订单编号",
            isShow: true
          },
          {
            name: "userName",
            title: "用户账户",
            isShow: true
          },
          {
            name: "status",
            title: "状态",
            isShow: true
          },
          {
            name: "refundMoney",
            title: "退款金额",
            isShow: true
          },
          {
            name: "remark",
            title: "备注",
            isShow: true
          },
          {
            name: "createdAt",
            title: "创建时间",
            isShow: true
          }]
      };
    },
    computed: {
      // 状态map
      statusMap() {
        let obj = {};
        for (let i = 0, len = this.status.length; i < len; i++) {
          obj[this.status[i].value] = {};
          obj[this.status[i].value].val = this.status[i].label;
          obj[this.status[i].value].color = this.status[i].color;
        }
        return obj;
      },
      // 物流公司map
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
      this.getOrderRefundRecord();
      this.getAllDeliveryCompanyFun();
      let tableItemStorage = localStorage.getItem(STORAGE_NAME);
      if (tableItemStorage) {
        this.tableItem = JSON.parse(tableItemStorage);
      }
      this.initSelectEditTable();
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
      // 获取全部物流公司
      async getAllDeliveryCompanyFun() {
        try {
          let res = await getAllDeliveryCompany();
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
      // 获取订单详情数据
      async showOrderDetail(orderId) {
        try {
          this.showBooks = true;
          this.orderDetail = {};
          this.orderDetailAddress = {};
          let res = await getOrderByOrderId({orderId});
          if (res.errorCode === 200) {
            this.orderDetail = res.data;
            this.detailDialog = true;
            let deliveryAddressId = this.orderDetail.deliveryAddressId;
            let addressRes = await getOrderAddressById({id: deliveryAddressId});
            if (addressRes.errorCode === 200) {
              this.orderDetailAddress = addressRes.data;
            } else {
              this.$message({
                message: addressRes.errorMsg,
                type: "error"
              });
            }
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
      // 切换图书展示
      showBookToggle() {
        this.showBooks = !this.showBooks;
      },
      // 编辑表格
      editTable() {
        this.editTableDialog = true;
        this.editTableItem = this.tableItem.concat();
      },
      // 编辑表格确认修改
      submitEditTable() {
        for (let i = 0, iLen = this.editTableItem.length; i < iLen; i++) {
          for (var j = 0, jLen = this.selectEditTable.length; j < jLen; j++) {
            if (this.editTableItem[i].name === this.selectEditTable[j]) {
              this.editTableItem[i].isShow = true;
              break;
            }
          }
          if (j === jLen) {
            this.editTableItem[i].isShow = false;
          }
        }
        this.editTableDialog = false;
        this.tableItem = this.editTableItem;
        this.initSelectEditTable();
        localStorage.setItem(STORAGE_NAME, JSON.stringify(this.tableItem));
        this.$emit("reload");
      },
      // 初始化编辑表格select
      initSelectEditTable() {
        this.selectEditTable = [];
        this.tableItem.forEach(item => {
          if (item.isShow) {
            this.selectEditTable.push(item.name);
          }
        });
      },
      // 重置编辑表格
      resetEditTable() {
        localStorage.removeItem(STORAGE_NAME);
        this.$emit("reload");
      },
      // 重置搜索条件
      resetSearch() {
        this.dataPicker = getDatePickerTime(30);
        this.searchParam = {
          pageNumber: 1,
          pageSize: 15,
          startTime: "",
          endTime: "",
          refundOrderId: "",
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
      },
      // 复制成功
      onCopySuccess() {
        this.$message({
          message: "复制成功",
          type: "success"
        });
      },
      // 复制失败
      onCopyError() {
        this.$message({
          message: "复制失败，请尝试手动复制",
          type: "error"
        });
      }
    },
    components: {
      SlickItem,
      SlickList
    },
    directives: {handle: HandleDirective}
  };
</script>

<style lang="stylus" scoped>
  @import './../../styl/variables.styl'
  .has-underline
    text-decoration underline

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

  .option-button
    position relative
    padding-right 50px

    .edit-btn
      position absolute
      right 4px

  .table-container
    margin-top 20px

    .el-pagination
      margin-top 20px

  .detail-dialog
    .detail-dialog-content
      height 400px
      overflow-y scroll

    .el-form-item
      margin-bottom 6px

    .expand-title
      width 600px
      display flex
      justify-content space-around
      align-items center
      font-size 14px
      line-height 40px
      border 1px solid #ebebeb
      background-color #fafafa
      border-radius 3px
      border-bottom-right-radius 0
      border-bottom-left-radius 0

      & > span
        flex 1
        text-align center

      & > span:first-child
        min-width 220px

    .expand-info
      width 600px
      display flex
      justify-content space-around
      align-items center
      font-size 12px
      border 1px solid #ebebeb
      border-top none
      padding 10px

      & > span
        flex 1
        text-align center

      .img
        display flex
        justify-content center
        align-items center
        width 80px
        height 60px
        margin-right 20px
        padding 10px
        overflow hidden

        img
          width 80px

      .book-info
        width 100px
        line-height 24px

    .book-num
      margin-left 4px

    .el-icon-arrow-right
      transform rotate(0)
      transition all .5s

    .el-icon-arrow-right.active
      transform rotate(90deg)
</style>
