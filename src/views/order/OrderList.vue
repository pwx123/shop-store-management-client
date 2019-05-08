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
          @click.native="search">搜索
      </el-button>
      <el-button type="danger"
          size="medium"
          @click.native="resetSearch">重置
      </el-button>
      <el-button type="primary"
          size="medium"
          @click.native="submitOrder">确认订单
      </el-button>
      <el-button type="danger"
          size="medium"
          @click.native="submitRefundOrder">处理退款订单
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
          v-if="showTable"
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
            <div class="expand-title">
              <span>书籍</span>
              <span>数量</span>
              <span>价格</span>
              <span>折后价</span>
              <span>总价</span>
            </div>
            <div v-for="item in props.row.orders"
                class="expand-info"
                :key="item.id">
              <div class="img">
                <img :src="item.bookImageUrl">
              </div>
              <div class="book-info">
                <span>{{item.bookName}}</span><br>
                <span>{{item.bookTitle.length > 13 ?  item.bookTitle.slice(0,13) + "..." : item.bookTitle}}</span>
              </div>
              <span>{{item.bookNum}}</span>
              <span>{{item.bookPrice | money}}</span>
              <span>{{item.bookSalePrice | money}}</span>
              <span>{{(item.bookSalePrice * item.bookNum).toFixed(2) | money}}</span>
            </div>
          </template>
        </el-table-column>
        <template v-for="item in tableItem">
          <el-table-column v-if="(item.name === 'orderId') && item.isShow"
              key="orderId"
              align="center"
              label="订单号"
              width="190">
            <template slot-scope="scope">
              <el-tooltip effect="dark"
                  content="点击复制"
                  placement="top"
                  :enterable="false">
              <span v-clipboard:copy="scope.row.orderId"
                  v-clipboard:success="onCopySuccess"
                  v-clipboard:error="onCopyError">
                {{scope.row.orderId}}
              </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'userName') && item.isShow"
              key="userName"
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
              label="状态"
              width="120">
            <template slot-scope="scope">
            <span
                :style="'color: ' + (statusMap[scope.row.status] ? statusMap[scope.row.status].color : '') ">{{statusMap[scope.row.status] ? statusMap[scope.row.status].val : "--"}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'orderNum') && item.isShow"
              key="orderNum"
              align="center"
              width="90"
              label="书籍数">
            <template slot-scope="scope">
              <el-button size="mini"
                  type="text"
                  class="has-underline"
                  @click="(expandColumn(scope.row))">{{scope.row.orderNum}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'orderMoney') && item.isShow"
              key="orderMoney"
              align="center"
              label="商品总价"
              width="120">
            <template slot-scope="scope">
              <span>{{scope.row.orderMoney | money}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'deliveryMoney') && item.isShow"
              key="deliveryMoney"
              align="center"
              label="运费"
              width="90">
            <template slot-scope="scope">
              <span>{{scope.row.deliveryMoney | money}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'totalMoney') && item.isShow"
              key="totalMoney"
              align="center"
              label="实付款"
              width="120">
            <template slot-scope="scope">
              <span>{{scope.row.totalMoney | money}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'deliveryId') && item.isShow"
              key="deliveryId"
              align="center"
              width="120"
              label="快递公司">
            <template slot-scope="scope">
              <template v-if="scope.row.deliveryId === 0 || scope.row.deliveryId">
                <span>{{deliveryCompanyMap[scope.row.deliveryId]}}</span>
                <el-button type="text"
                    v-if="scope.row.status === 3"
                    size="mini"
                    @click="showDeliveryDialog(scope.row, true)">编辑
                </el-button>
              </template>
              <el-button v-else-if="scope.row.status === 2"
                  type="text"
                  size="mini"
                  @click="showDeliveryDialog(scope.row, false)">上传物流信息
              </el-button>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'deliveryOrderId') && item.isShow"
              key="deliveryOrderId"
              align="center"
              width="180"
              label="快递单号">
            <template slot-scope="scope">
              <template v-if="scope.row.deliveryOrderId === 0 || scope.row.deliveryOrderId">
                <el-tooltip effect="dark"
                    content="点击复制"
                    placement="top"
                    :enterable="false">
                <span>
                  <span v-clipboard:copy="scope.row.deliveryOrderId"
                      v-clipboard:success="onCopySuccess"
                      v-clipboard:error="onCopyError">
                    {{scope.row.deliveryOrderId}}
                  </span>
                  <el-button type="text"
                      size="mini"
                      @click="showDeliveryInfo(scope.row.deliveryOrderId)">查看
                  </el-button>
                </span>
                </el-tooltip>
                <el-button type="text"
                    v-if="scope.row.status === 3"
                    size="mini"
                    @click="showDeliveryDialog(scope.row, true)">编辑
                </el-button>
              </template>
              <el-button v-else-if="scope.row.status === 2"
                  type="text"
                  size="mini"
                  @click="showDeliveryDialog(scope.row, false)">上传物流信息
              </el-button>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'deliveryAddressId') && item.isShow"
              key="deliveryAddressId"
              align="center"
              width="120"
              label="收货地址">
            <template slot-scope="scope">
              <el-popover placement="top"
                  :key="scope.row.id"
                  @show="showAddress(scope.row)">
                <div class="show-address">
                  <p>
                    <span>收货人：</span>
                    <span>{{orderAddress.deliveryName || "--"}}</span>
                  </p>
                  <p>
                    <span>手机号：</span>
                    <span>{{orderAddress.deliveryMobile || "--"}}</span>
                  </p>
                  <p>
                    <span>收货地址：</span>
                    <span>{{`${orderAddress.provinceName || "--"} ${orderAddress.cityName || "--"} ${orderAddress.countryName || "--"} ${orderAddress.detailAddress || "--"}`}}</span>
                  </p>
                  <p>
                    <el-button type="primary"
                        v-if="scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 3"
                        size="mini"
                        @click.native="editOrderAddress(scope.row)">修改
                    </el-button>
                  </p>
                </div>
                <el-button type="text"
                    slot="reference"
                    size="mini">查看
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'remark') && item.isShow"
              key="remark"
              align="center"
              label="备注"
              width="200">
            <template slot-scope="scope">
              {{scope.row.remark || '--'}}
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'createdAt') && item.isShow"
              key="createdAt"
              prop="createdAt"
              align="center"
              label="创建时间"
              width="160"></el-table-column>
          <el-table-column v-if="(item.name === 'deliveryAt') && item.isShow"
              key="deliveryAt"
              align="center"
              label="发货时间"
              width="160">
            <template slot-scope="scope">
              <span>{{scope.row.deliveryAt || "--"}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'dealAt') && item.isShow"
              key="dealAt"
              prop="dealAt"
              align="center"
              label="完成时间"
              width="160">
            <template slot-scope="scope">
              <span>{{scope.row.dealAt || "--"}}</span>
            </template>
          </el-table-column>
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
    <el-dialog class="address-dialog"
        title="修改收货地址"
        width="600px"
        :visible.sync="editAddressDialog">
      <el-dialog width="500px"
          title="新增收货地址"
          :visible.sync="addAddressDialog"
          append-to-body>
        <el-form ref="addAddress"
            label-width="80px"
            :model="addAddressInfo"
            :rules="addAddressInfoValidate">
          <el-form-item prop="deliveryName"
              label="收货人">
            <el-input v-model.trim="addAddressInfo.deliveryName"
                placeholder="请输入收货人姓名"
                maxlength="20"
                autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="deliveryMobile"
              label="手机号">
            <el-input v-model.trim="addAddressInfo.deliveryMobile"
                type="tel"
                placeholder="请输入收货人手机号"
                maxlength="20"
                autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="area"
              label="地址">
            <div class="select-group">
              <el-select placeholder="请选择省"
                  v-model.trim="addAddressInfo.provinceId"
                  @change="handleProvinceChange">
                <el-option v-for="item in areaData.province"
                    :key="item.provinceId"
                    :label="item.name"
                    :value="item.provinceId"></el-option>
              </el-select>
              <el-select placeholder="请选择市"
                  v-model.trim="addAddressInfo.cityId"
                  @change="handleCityChange">
                <el-option v-for="item in areaData.city"
                    :key="item.cityId"
                    :label="item.name"
                    :value="item.cityId"></el-option>
              </el-select>
              <el-select placeholder="请选择县"
                  v-model.trim="addAddressInfo.countryId">
                <el-option v-for="item in areaData.country"
                    :key="item.countryId"
                    :label="item.name"
                    :value="item.countryId"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="detailAddress"
              label="详细地址">
            <el-input v-model.trim="addAddressInfo.detailAddress"
                type="textarea"
                resize="none"
                rows="3"
                placeholder="请输入详细地址"
                maxlength="255"
                autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small"
              @click="addAddressDialog = false">取 消
          </el-button>
          <el-button type="primary"
              size="small"
              @click="submitAddAddress('addAddress')">确 定
          </el-button>
        </div>
      </el-dialog>
      <el-button class="add-address"
          type="primary"
          size="mini"
          @click="addAddressBtnClick">新增
      </el-button>
      <div class="edit-address">
        <div v-for="item in userAddressList"
            :class="'address-list' + (item.id === selectAddress ? ' active' : '')"
            :key="item.id"
            @click="selectAddressRadio(item.id)">
          <el-radio :label="item.id"
              v-model="selectAddress">&nbsp;
          </el-radio>
          <div class="address">
            <p>
              <span class="show-address-label">收货人：</span>
              <span class="show-address-content">{{item.deliveryName}}</span>
            </p>
            <p>
              <span class="show-address-label">手机号：</span>
              <span class="show-address-content">{{item.deliveryMobile}}</span>
            </p>
            <p>
              <span class="show-address-label">收货地址：</span>
              <span
                  class="show-address-content">{{`${item.provinceName} ${item.cityName} ${item.countryName} ${item.detailAddress}`}}</span>
            </p>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button size="small"
            @click="editAddressDialog = false">取 消
        </el-button>
        <el-button type="primary"
            size="small"
            @click="submitEditAddress">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="处理退款订单"
        width="400px"
        class="refund-dialog"
        :visible.sync="refundDialog"
        @close="closeDialog">
      <el-form ref="refund"
          label-width="80px"
          :model="refundData"
          :rules="refundValidate">
        <el-form-item prop="refundStatus"
            label="处理结果">
          <el-radio-group v-model="refundData.refundStatus"
              size="medium">
            <el-radio :label="1"
                border>同意退款
            </el-radio>
            <el-radio :label="0"
                border>拒绝退款
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="refundRemark"
            label="备注">
          <el-input v-model.trim="refundData.refundRemark"
              type="textarea"
              placeholder="请输入备注"
              maxlength="100"
              resize="none"
              autocomplete="off"
              :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
          class="dialog-footer">
        <el-button size="small"
            @click="cancelDialog">取 消</el-button>
        <el-button size="small"
            type="primary"
            @click="submitRefundInfo('refund')">确 定</el-button>
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
                :disabled="item.name === 'orderId'">
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
    <el-dialog title="物流详情"
        top="60px"
        width="560px"
        class="delivery-detail-dialog"
        :visible.sync="deliveryDetailDialog">
      <div class="delivery-detail-content">
        <ul>
          <li>
            <div class="border-left"></div>
            <span :class="'status' + (deliveryInfoDetail.status === 0 ? '': ' finished')">{{deliveryInfoDetail.status === 0 ? "运输中": "已完成"}}</span>
          </li>
          <li v-for="item in deliveryInfoDetail.infoArr">
            <div class="border-left"></div>
            <div class="dot"></div>
            <p class="info">{{item.info}}</p>
            <p class="time">{{item.time}}</p>
          </li>
        </ul>
      </div>
      <span slot="footer"
          class="dialog-footer">
        <el-button size="small"
            type="primary"
            @click="deliveryDetailDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as orderApi from "./../../api/order";
  import {getOrderAddressById, getUserDeliveryAddress} from "./../../api/user";
  import {
    getProvince,
    getCityByProvince,
    getCountryByCity
  } from "./../../api/common";
  import {timeFormat, getDatePickerTime, handleError} from "./../../util/util";
  import {getDeliveryInfoById} from "./../../api/common";
  import {SlickList, SlickItem, HandleDirective} from "vue-slicksort";

  const STORAGE_NAME = "orderListTable";

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
        // 展示table
        showTable: true,
        // 多选数组
        multipleSelection: [],
        // 物流公司数据
        deliveryCompanyData: [],
        // 上传物流弹窗
        addDeliveryInfoDialog: false,
        // 修改收货地址弹窗
        editAddressDialog: false,
        // 新增收货地址弹窗
        addAddressDialog: false,
        // 退款确认弹窗
        refundDialog: false,
        // 编辑表格弹窗
        editTableDialog: false,
        // 物流详情弹窗
        deliveryDetailDialog: false,
        // 临时编辑表格数据
        editTableItem: [],
        // 编辑表格要显示的
        selectEditTable: [],
        // 用户地址列表
        userAddressList: [],
        // 选择收货地址
        selectAddress: "",
        // 修改的订单
        editRow: "",
        // 上传物流信息
        deliveryInfo: {
          id: "",
          deliveryId: "",
          deliveryOrderId: ""
        },
        // 新增收货地址数据
        addAddressInfo: {
          deliveryName: "",
          deliveryMobile: "",
          provinceId: "",
          cityId: "",
          countryId: "",
          detailAddress: ""
        },
        // 收货地址
        orderAddress: "",
        // 是否编辑物流
        isEditDelivery: false,
        // 省市县信息
        areaData: {
          province: [],
          city: [],
          country: []
        },
        // 退款确认信息
        refundData: {
          refundStatus: 1,
          refundRemark: ""
        },
        deliveryInfoDetail: {
          infoArr: [],
          status: ""
        },
        // 上传物流校验
        deliveryInfoValidate: {
          deliveryId: [
            {required: true, message: "请选择物流公司", trigger: "change"}
          ],
          deliveryOrderId: [
            {
              required: true,
              validator: this.deliveryOrderIdReg,
              trigger: "blur"
            }
          ]
        },
        // 新增收货地址校验
        addAddressInfoValidate: {
          deliveryName: [
            {required: true, message: "请输入收货人姓名", trigger: "blur"}
          ],
          deliveryMobile: [
            {
              required: true,
              validator: this.deliveryMobileReg,
              trigger: "blur"
            }
          ],
          area: [{required: true, validator: this.areaReg, trigger: "change"}],
          detailAddress: [
            {required: true, message: "请输入详细地址", trigger: "blur"}
          ]
        },
        // 退款处理校验
        refundValidate: {
          refundStatus: [
            {required: true, message: "请选择处理结果", trigger: "change"}
          ],
          refundRemark: [
            {
              required: true,
              message: "请输入备注",
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
            label: "待确认",
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
        ],
        tableItem: [
          {
            name: "orderId",
            title: "订单号",
            isShow: true
          },
          {
            name: "userName",
            title: "用户账号",
            isShow: true
          },
          {
            name: "status",
            title: "状态",
            isShow: true
          },
          {
            name: "orderNum",
            title: "书籍数",
            isShow: true
          },
          {
            name: "orderMoney",
            title: "商品总价",
            isShow: true
          },
          {
            name: "deliveryMoney",
            title: "运费",
            isShow: true
          },
          {
            name: "totalMoney",
            title: "实付款",
            isShow: true
          },
          {
            name: "deliveryId",
            title: "快递公司",
            isShow: true
          },
          {
            name: "deliveryOrderId",
            title: "快递单号",
            isShow: true
          },
          {
            name: "deliveryAddressId",
            title: "收货地址",
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
          },
          {
            name: "deliveryAt",
            title: "发货时间",
            isShow: true
          },
          {
            name: "dealAt",
            title: "完成时间",
            isShow: true
          }]
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
      this.getProvinceInfo();
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
            let res = await orderApi.submitOrder({ids: ids.join(",")});
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
            message: "只能确认 待确认 的订单",
            type: "warning"
          });
        }
      },
      // 处理退款订单
      submitRefundOrder() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: "请选择要处理的退款订单",
            type: "warning"
          });
          return false;
        }
        if (this.multipleSelection.every(item => item.status === 6)) {
          this.refundData = {
            refundStatus: 1,
            refundRemark: ""
          };
          this.refundDialog = true;
        } else {
          this.$message({
            message: "只能处理 退款处理中 的订单",
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
                let str = "上传成功，状态已更改为已发货";
                if (this.isEditDelivery) {
                  str = "修改成功";
                }
                this.$message({
                  message: str,
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
      // 确定退款信息
      submitRefundInfo(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            try {
              let ids = this.multipleSelection.map(item => item.id);
              let obj = {
                ids: ids.join(","),
                ...this.refundData
              };
              let res = await orderApi.submitRefundInfo(obj);
              if (res.errorCode === 200) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.refundDialog = false;
                this.$refs["refund"] && this.$refs["refund"].clearValidate();
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
        if (row.status !== 2 && !isEdit) {
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
      // 展示收货地址
      async showAddress(row) {
        try {
          this.selectAddress = "";
          this.editRow = "";
          let res = await getOrderAddressById({id: row.deliveryAddressId});
          if (res.errorCode === 200) {
            this.orderAddress = res.data;
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
      // 修改收货地址
      async editOrderAddress(row) {
        try {
          this.selectAddress = row.deliveryAddressId;
          this.editAddressDialog = true;
          this.editRow = row;
          let res = await getUserDeliveryAddress({userId: row.userId});
          if (res.errorCode === 200) {
            this.userAddressList = res.data;
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
      // 提交修改收货地址
      async submitEditAddress() {
        if (this.selectAddress === "") {
          this.$message({
            message: "请选择收货地址",
            type: "error"
          });
          return false;
        }
        let obj = {
          id: this.editRow.id,
          deliveryAddressId: this.selectAddress
        };
        try {
          let res = await orderApi.updateOrderAddress(obj);
          this.editAddressDialog = false;
          if (res.errorCode === 200) {
            this.$message({
              message: "修改成功",
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
      },
      // 获取省份信息
      async getProvinceInfo() {
        try {
          let res = await getProvince();
          if (res.errorCode === 200) {
            this.areaData.province = res.data;
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
      // 根据省份获取市信息
      async handleProvinceChange(val) {
        try {
          this.addAddressInfo.cityId = "";
          this.addAddressInfo.countryId = "";
          let res = await getCityByProvince({provinceId: val});
          if (res.errorCode === 200) {
            this.areaData.city = res.data;
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
      // 根据市获取县信息
      async handleCityChange(val) {
        try {
          this.addAddressInfo.countryId = "";
          let res = await getCountryByCity({cityId: val});
          if (res.errorCode === 200) {
            this.areaData.country = res.data;
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
      // 提交新增收货地址
      async submitAddAddress(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            try {
              let res = await orderApi.submitAddAddress({
                ...this.addAddressInfo,
                userId: this.editRow.userId
              });
              this.addAddressDialog = false;
              if (res.errorCode === 200) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                let resAddress = await getUserDeliveryAddress({
                  userId: this.editRow.userId
                });
                if (resAddress.errorCode === 200) {
                  this.userAddressList = resAddress.data;
                } else {
                  this.$message({
                    message: res.errorMsg,
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
          }
        });
      },
      // 新增收货地址
      addAddressBtnClick() {
        this.addAddressDialog = true;
        this.addAddressInfo = {
          deliveryName: "",
          deliveryMobile: "",
          provinceId: "",
          cityId: "",
          countryId: "",
          detailAddress: ""
        },
        this.$refs["addAddress"] && this.$refs["addAddress"].clearValidate();
      },
      // 根据物流单号查看物流信息
      async showDeliveryInfo(id) {
        try {
          this.deliveryInfoDetail = {
            infoArr: [],
            status: ""
          };
          let res = await getDeliveryInfoById({id});
          if (res.errorCode === 200) {
            this.deliveryInfoDetail = res.data;
            this.deliveryDetailDialog = true;
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
      // 选择收货地址
      selectAddressRadio(id) {
        this.selectAddress = id;
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
      // 收货手机号校验
      deliveryMobileReg(rule, value, callback) {
        if (value === "") {
          callback(new Error("请输入收货人手机号"));
        } else if (/[\u4E00-\u9FA5]/i.test(value)) {
          callback(new Error("请输入正确的收货人手机号"));
        } else {
          callback();
        }
      },
      // 省市信息校验
      areaReg(rule, value, callback) {
        if (this.addAddressInfo.provinceId === "") {
          callback(new Error("请选择省份"));
        } else if (this.addAddressInfo.cityId === "") {
          callback(new Error("请选择市"));
        } else if (this.addAddressInfo.countryId === "") {
          callback(new Error("请选择区/县"));
        } else {
          callback();
        }
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
      // 关闭弹框事件
      closeDialog() {
        this.$refs["addDelivery"] && this.$refs["addDelivery"].clearValidate();
        this.$refs["refund"] && this.$refs["refund"].clearValidate();
      },
      // 主动关闭弹窗
      cancelDialog() {
        this.refundDialog = false;
        this.$refs["refund"] && this.$refs["refund"].clearValidate();
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

    .has-underline
      text-decoration underline

    .el-pagination
      margin-top 20px

    .expand-title
      width 800px
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
        min-width 300px

    .expand-info
      width 800px
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
        width 100px
        height 70px
        margin-right 20px
        padding 10px
        overflow hidden

        img
          width 80px

      .book-info
        width 180px
        line-height 24px

  .delivery-dialog
    .el-select
      width 100%

  .select-group
    display flex
    width 100%
    justify-content space-between

    .el-select
      width 118px

  .show-address
    padding 0 10px

    p:last-child
      text-align right

  .address-dialog
    .add-address
      position absolute
      right 40px
      top 50px

    .edit-address
      height 300px
      padding 10px
      overflow-y scroll

      .address-list
        display flex
        align-items center
        border 1px dashed #ccc
        border-radius 10px
        padding 2px 16px
        margin-bottom 10px
        cursor pointer

        &.active
          border-color #409eff
          color #409eff

        p
          margin 8px 0

        .el-radio
          margin-right 0

  .delivery-detail-dialog
    .delivery-detail-content

      ul
        padding-left 45px
        max-height 400px
        overflow-y scroll
        margin 0
        padding-top 30px

        li
          position relative
          border-top 1px solid #ececec
          padding 6px 0 4px 16px

          .border-left
            position absolute
            left -16px
            top 2px
            width 1px
            height 100%
            background-color #e4e7ed

          .dot
            position absolute
            width 8px
            height 8px
            left -21px
            bottom -2px
            background-color #33a2f7
            border 2px solid #fff
            border-radius 50%

          &:last-child
            .border-left, .dot
              display none

          &:first-child
            border-top none

            .status
              position absolute
              left -44px
              top -26px
              display inline-block
              width 58px
              height 25px
              line-height 25px
              text-align center
              background-color #ff5a00
              color #fff
              border-radius 2px
              z-index 99

              &.finished
                background-color #409eff

          p
            margin 0

          .info
            font-size 14px
            line-height 22px

          .time
            font-size 12px
            color #a1a1a1
            line-height 22px
</style>
