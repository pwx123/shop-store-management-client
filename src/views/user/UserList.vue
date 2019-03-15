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
      <el-select v-model="searchParam.sex"
        size="medium"
        placeholder="性别"
        clearable>
        <el-option v-for="item in sex"
          :key="item.value"
          :value="item.value"
          :label="item.label"></el-option>
      </el-select>
      <el-input placeholder="用户名/手机号"
        size="medium"
        v-model="searchParam.name"
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
        <el-table-column prop="name"
          align="center"
          label="用户手机号"
          width="160"></el-table-column>
        <el-table-column prop="nickname"
          align="center"
          label="用户名"
          width="160"></el-table-column>
        <el-table-column align="center"
          label="性别"
          width="80">
          <template slot-scope="scope">
            <span>{{sexMap[scope.row.sex]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          label="状态"
          width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0"
              class="status-success">{{statusMap[scope.row.status]}}</span>
            <span v-else
              class="status-failed">{{statusMap[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email"
          align="center"
          label="邮箱"
          width="160"></el-table-column>
        <el-table-column align="center"
          label="头像"
          width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.avatarUrl"
              type="text"
              size="mini"
              @click.native="showImgDialogFun(scope.row.avatarUrl)">查看图片</el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt"
          align="center"
          label="注册时间"
          width="180"></el-table-column>
        <el-table-column prop="updatedAt"
          align="center"
          label="更新时间"
          width="180"></el-table-column>
        <el-table-column fixed="right"
          align="center"
          label="操作"
          width="240">
          <template slot-scope="scope">
            <el-button type="text"
              size="mini"
              @click.native="resetPwd(scope.row)">重置密码</el-button>
            <el-button type="text"
              size="mini"
              @click.native="showDeliveryAddress(scope.row)">查看收货地址</el-button>
            <el-button type="text"
              size="mini"
              @click.native="showUserOrder(scope.row)">查看订单</el-button>
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
        :total="total"></el-pagination>
    </div>
    <el-dialog title="收货地址"
      width="1200px"
      :visible.sync="dialogTableVisible">
      <el-table :data="deliveryAddressData"
        size="mini"
        :header-cell-style="{background: '#fdfdfd'}"
        border>
        <el-table-column prop="deliveryName"
          align="center"
          label="收货人"
          width="120"></el-table-column>
        <el-table-column prop="deliveryMobile"
          align="center"
          label="手机号"
          width="140"></el-table-column>
        <el-table-column align="center"
          label="收货地址">
          <template slot-scope="scope">
            {{scope.row.provinceName + ' ' + scope.row.cityName + ' ' + scope.row.countryName + ' ' + scope.row.detailAddress}}
          </template>
        </el-table-column>
        <el-table-column align="center"
          label="默认地址"
          width="100">
          <template slot-scope="scope">
            {{scope.row.isDefault == 1 ? '是': '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt"
          align="center"
          label="创建时间"
          width="140"></el-table-column>
        <el-table-column prop="updatedAt"
          align="center"
          label="更新时间"
          width="140"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as userApi from "./../../api/user";
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
      // 收货地址数据
      deliveryAddressData: [],
      // 收货地址弹窗
      dialogTableVisible: false,
      // 加载中
      loading: false,
      // 搜索参数
      searchParam: {
        pageNumber: 1,
        pageSize: 15,
        startTime: "",
        endTime: "",
        status: "",
        sex: "",
        name: ""
      },
      status: [
        {
          value: 0,
          label: "正常"
        },
        {
          value: 1,
          label: "封禁"
        }
      ],
      sex: [
        {
          value: 0,
          label: "男"
        },
        {
          value: 1,
          label: "女"
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
    },
    sexMap() {
      let obj = {};
      for (let i = 0, len = this.sex.length; i < len; i++) {
        obj[this.sex[i].value] = this.sex[i].label;
      }
      return obj;
    }
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
        let res = await userApi.getShopUserInfo(this.searchParam);
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
        sex: "",
        name: ""
      };
      this.getBookList();
    },
    // 重置密码
    resetPwd(row) {},
    // 查看收货地址
    async showDeliveryAddress(row) {
      this.dialogTableVisible = true;
      try {
        let res = await userApi.getUserDeliveryAddress({ userId: row.id });
        if (res.errorCode === 200) {
          this.deliveryAddressData = res.data;
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
    // 查看订单
    showUserOrder(row) {},
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
@import './../../styl/common.styl'

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

  .el-select
    max-width 100px
    margin-right 10px
    margin-bottom 10px

.table-container
  margin-top 20px

  .el-pagination
    margin-top 20px
</style>
