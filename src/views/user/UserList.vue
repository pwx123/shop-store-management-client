<template>
  <div>
    <div class="filter-search">
      <el-date-picker :clearable="false"
          :default-time="['00:00:00', '23:59:59']"
          :editable="false"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          size="medium"
          start-placeholder="开始日期"
          type="datetimerange"
          v-model="dataPicker"
          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      <el-select clearable
          placeholder="状态"
          size="medium"
          v-model="searchParam.status">
        <el-option :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in status"></el-option>
      </el-select>
      <el-select clearable
          placeholder="性别"
          size="medium"
          v-model="searchParam.sex">
        <el-option :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in sex"></el-option>
      </el-select>
      <el-input @keyup.native.enter="search"
          clearable
          placeholder="用户名/手机号"
          size="medium"
          v-model.trim="searchParam.name"></el-input>
    </div>
    <div class="option-button">
      <el-button @click.native="search"
          icon="el-icon-search"
          size="medium"
          type="primary">搜索
      </el-button>
      <el-button @click.native="resetSearch"
          size="medium"
          type="danger">重置
      </el-button>
      <el-button @click.native="editTable"
          circle
          class="edit-btn"
          icon="el-icon-edit-outline"
          size="medium"
          title="编辑表格"
          type="primary">
      </el-button>
    </div>
    <div class="table-container">
      <el-table :data="tableData"
          :header-cell-style="{background: '#fdfdfd'}"
          :height="460"
          border
          size="mini"
          v-loading="loading">
        <template v-for="item in tableItem">
          <el-table-column align="center"
              key="name"
              label="用户账号"
              prop="name"
              v-if="(item.name === 'name') && item.isShow"
              width="140"></el-table-column>
          <el-table-column align="center"
              key="nickname"
              label="用户名"
              prop="nickname"
              v-if="(item.name === 'nickname') && item.isShow"
              width="140"></el-table-column>
          <el-table-column align="center"
              key="sex"
              label="性别"
              v-if="(item.name === 'sex') && item.isShow"
              width="60">
            <template slot-scope="scope">
              <span>{{sexMap[scope.row.sex] || "--"}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
              key="status"
              label="状态"
              v-if="(item.name === 'status') && item.isShow"
              width="120">
            <template slot-scope="scope">
              <el-switch :active-value="0"
                  :inactive-value="1"
                  @change="changeUserStatusFun(scope.row)"
                  v-model="scope.row.status">
              </el-switch>
              <span class="status-success"
                  v-if="scope.row.status === 0">{{statusMap[scope.row.status]}}</span>
              <span class="status-failed"
                  v-else>{{statusMap[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
              key="email"
              label="邮箱"
              v-if="(item.name === 'email') && item.isShow"
              width="160">
            <template slot-scope="scope">
              <span>{{scope.row.email || "--"}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
              key="avatarUrl"
              label="头像"
              v-if="(item.name === 'avatarUrl') && item.isShow"
              width="100">
            <template slot-scope="scope">
              <el-button @click.native="showImgDialogFun(scope.row.avatarUrl)"
                  size="mini"
                  type="text"
                  v-if="scope.row.avatarUrl">查看图片
              </el-button>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
              key="createdAt"
              label="注册时间"
              prop="createdAt"
              v-if="(item.name === 'createdAt') && item.isShow"
              width="180"></el-table-column>
          <el-table-column align="center"
              key="updatedAt  "
              label="更新时间"
              prop="updatedAt"
              v-if="(item.name === 'updatedAt') && item.isShow"
              width="180"></el-table-column>
        </template>
        <el-table-column align="center"
            fixed="right"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button @click.native="resetPwd(scope.row)"
                size="mini"
                type="text">重置密码
            </el-button>
            <el-button @click.native="showDeliveryAddress(scope.row)"
                size="mini"
                type="text">查看收货地址
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="searchParam.pageNumber"
          :page-size="searchParam.pageSize"
          :page-sizes="[15, 30, 50]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          background
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible"
        title="收货地址"
        width="1050px">
      <el-table :data="deliveryAddressData"
          :header-cell-style="{background: '#fdfdfd'}"
          border
          size="mini">
        <el-table-column align="center"
            label="序号"
            type="index"
            width="50"></el-table-column>
        <el-table-column align="center"
            label="收货人"
            prop="deliveryName"
            width="110"></el-table-column>
        <el-table-column align="center"
            label="手机号"
            prop="deliveryMobile"
            width="130"></el-table-column>
        <el-table-column align="center"
            label="收货地址">
          <template slot-scope="scope">
            {{scope.row.provinceName + " " + scope.row.cityName + " " + scope.row.countryName + " " +
            scope.row.detailAddress}}
          </template>
        </el-table-column>
        <el-table-column align="center"
            label="默认地址"
            width="70">
          <template slot-scope="scope">
            {{scope.row.isDefault == 1 ? "是": "否"}}
          </template>
        </el-table-column>
        <el-table-column align="center"
            label="创建时间"
            prop="createdAt"
            width="140"></el-table-column>
        <el-table-column align="center"
            label="更新时间"
            prop="updatedAt"
            width="140"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="resetPwdDialog"
        append-to-body
        title="重置成功"
        width="400px">
      <div class="reset-pwd">
        <span>新密码：</span>
        <span class="new-pwd">{{newPwd}}</span>
        <el-button size="medium"
            type="text"
            v-clipboard:copy="newPwd"
            v-clipboard:error="onCopyError"
            v-clipboard:success="onCopySuccess">一键复制
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showImgDialog"
        top="50px"
        width="700px">
      <div class="dialog-img">
        <img :src="showImageUrl"
            alt="图片详情">
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editTableDialog"
        title="编辑表格"
        top="60px"
        width="300px">
      <div class="edit-table-dialog">
        <div class="tips">
          <span>
            <i class="el-icon-info"></i> 拖拽可排序
          </span>
          <el-button @click="resetEditTable"
              size="mini"
              type="text">
            恢复默认
          </el-button>
        </div>
        <SlickList :useDragHandle="true"
            class="slick-list"
            helperClass="slick-helper"
            lockAxis="y"
            v-model="editTableItem">
          <SlickItem :index="index"
              :key="item.name"
              :showHandle="true"
              class="slick-item"
              v-for="(item, index) in editTableItem">
            <span class="handle" v-handle></span>
            <el-checkbox :disabled="item.name === 'name'"
                :label="item.name"
                v-model="selectEditTable">
              {{(index + 1) + " - " + item.title}}
            </el-checkbox>
          </SlickItem>
        </SlickList>
      </div>
      <span class="dialog-footer"
          slot="footer">
        <el-button @click="editTableDialog = false"
            size="small">取 消</el-button>
        <el-button @click="submitEditTable"
            size="small"
            type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as userApi from "./../../api/user";
  import Base64 from "./../../util/base64";
  import {timeFormat, getDatePickerTime, handleError} from "./../../util/util";
  import {SlickList, SlickItem, HandleDirective} from "vue-slicksort";

  const STORAGE_NAME = "userListTable";

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
        ],
        tableItem: [
          {
            name: "name",
            title: "用户账户",
            isShow: true
          },
          {
            name: "nickname",
            title: "用户名",
            isShow: true
          },
          {
            name: "sex",
            title: "性别",
            isShow: true
          },
          {
            name: "status",
            title: "状态",
            isShow: true
          },
          {
            name: "email",
            title: "邮箱",
            isShow: true
          },
          {
            name: "avatarUrl",
            title: "头像",
            isShow: true
          },
          {
            name: "createdAt",
            title: "注册时间",
            isShow: true
          }, {
            name: "updatedAt",
            title: "更新时间",
            isShow: true
          }]
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
      this.getUserList();
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
        this.dataPicker = [];
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
          `确定 重置用户 <span style="color:#409eff">${row.name}</span> 的密码吗？`,
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
          .catch();
      },
      // 查看收货地址
      async showDeliveryAddress(row) {
        this.dialogTableVisible = true;
        try {
          let res = await userApi.getUserDeliveryAddress({userId: row.id});
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
        let {status, name} = row;
        let str =
          status == 1
            ? "<span style=\"color:#f56c6c\">封禁</span>"
            : "<span style=\"color:#67c23a\">启用</span>";
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
      showUserOrder(row) {
      },
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

  .option-button
    position relative
    padding-right 50px

    .edit-btn
      position absolute
      right 4px

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
