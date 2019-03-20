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
        v-model.trim="searchParam.name"
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
          label="用户账号"
          width="140"></el-table-column>
        <el-table-column prop="nickname"
          align="center"
          label="用户名"
          width="140"></el-table-column>
        <el-table-column align="center"
          label="性别"
          width="60">
          <template slot-scope="scope">
            <span>{{sexMap[scope.row.sex]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="changeUserStatusFun(scope.row)">
            </el-switch>
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
      width="1050px"
      :visible.sync="dialogTableVisible">
      <el-table :data="deliveryAddressData"
        size="mini"
        :header-cell-style="{background: '#fdfdfd'}"
        border>
        <el-table-column type="index"
          align="center"
          label="序号"
          width="50"></el-table-column>
        <el-table-column prop="deliveryName"
          align="center"
          label="收货人"
          width="110"></el-table-column>
        <el-table-column prop="deliveryMobile"
          align="center"
          label="手机号"
          width="130"></el-table-column>
        <el-table-column align="center"
          label="收货地址">
          <template slot-scope="scope">
            {{scope.row.provinceName + ' ' + scope.row.cityName + ' ' + scope.row.countryName + ' ' + scope.row.detailAddress}}
          </template>
        </el-table-column>
        <el-table-column align="center"
          label="默认地址"
          width="70">
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
    <el-dialog width="400px"
      title="重置成功"
      :visible.sync="resetPwdDialog">
      <div class="reset-pwd">
        <span>新密码：</span>
        <span class="new-pwd">{{newPwd}}</span>
        <el-button type="text"
          size="medium"
          v-clipboard:copy="newPwd"
          v-clipboard:success="onCopySuccess"
          v-clipboard:error="onCopyError">一键复制</el-button>
      </div>
    </el-dialog>
    <el-dialog top="50px"
      width="700px"
      :visible.sync="showImgDialog">
      <div class="dialog-img">
        <img :src="showImageUrl"
          alt="图片详情">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as userApi from "./../../api/user";
import Base64 from "./../../util/base64";
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
      // 重置密码成功后弹窗
      resetPwdDialog: false,
      // 新密码
      newPwd: "",
      // 加载中
      loading: false,
      // 查看大图Url
      showImageUrl: "",
      // 查看大图弹窗
      showImgDialog: false,
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
    this.getUserList();
  },
  methods: {
    // 执行搜索
    search() {
      this.searchParam.pageNumber = 1;
      this.getUserList();
    },
    // 获取表格数据
    async getUserList() {
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
    // 查看大图
    showImgDialogFun(imageUrl, isBase64) {
      if (isBase64) {
        this.showImageUrl = imageUrl;
      } else {
        this.showImageUrl = imageUrl + this.getTimeUrl();
      }
      this.showImgDialog = true;
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
      this.getUserList();
    },
    // url加上时间参数
    getTimeUrl() {
      return `?t=${new Date().getTime()}`;
    },
    // 重置密码
    resetPwd(row) {
      this.$confirm(
        `确定 重置用户 <span style="color:#409eff">${name}</span> 的密码吗？`,
        "提示",
        {
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(async () => {
          try {
            let res = await userApi.resetUserPwd({
              id: row.id
            });
            if (res.errorCode === 200) {
              let newPwd = Base64.decode(res.data.newPwd);
              this.$message({
                message: "重置成功",
                type: "success"
              });
              this.resetPwdDialog = true;
              this.newPwd = newPwd;
              this.getUserList();
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
        .catch(() => {
          row.status = row.status == 0 ? 1 : 0;
        });
    },
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
    changeUserStatusFun(row) {
      let { status, name } = row;
      let str =
        status == 1
          ? '<span style="color:#f56c6c">封禁</span>'
          : '<span style="color:#67c23a">启用</span>';
      this.$confirm(
        `确定 ${str} 用户 <span style="color:#409eff">${name}</span> 的账号吗？`,
        "提示",
        {
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(async () => {
          try {
            let res = await userApi.changeUserStatus({
              id: row.id,
              status: row.status
            });
            if (res.errorCode === 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.getUserList();
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
        .catch(() => {
          row.status = row.status == 0 ? 1 : 0;
        });
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
    },
    // 查看订单
    showUserOrder(row) {},
    // 每页页数变化
    handleSizeChange(val) {
      this.searchParam.pageSize = val;
      this.getUserList();
    },
    // 页码变化
    handleCurrentChange(val) {
      this.searchParam.pageNumber = val;
      this.getUserList();
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

  .el-switch
    margin-right 6px

  .el-pagination
    margin-top 20px

.dialog-img
  display flex
  justify-content center
  align-items center
  padding 10px

  img
    max-width 600px

.new-pwd
 margin-right 10px
</style>
