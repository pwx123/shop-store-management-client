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
      <el-select v-model="searchParam.optionType"
          size="medium"
          placeholder="操作类型"
          clearable>
        <el-option v-for="item in optionType"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
      </el-select>
      <el-input placeholder="操作账号/人"
          size="medium"
          v-model.trim="searchParam.name"
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
          <el-table-column v-if="(item.name === 'optionName') && item.isShow"
              key="optionName"
              prop="optionName"
              align="center"
              label="操作账号"
              width="160"></el-table-column>
          <el-table-column v-if="(item.name === 'optionNickname') && item.isShow"
              key="optionNickname"
              prop="optionNickname"
              align="center"
              label="操作人"
              width="160"></el-table-column>
          <el-table-column v-if="(item.name === 'optionType') && item.isShow"
              key="optionType"
              align="center"
              label="操作类型"
              width="140">
            <template slot-scope="scope">
              <span>{{optionTypeMap[scope.row.optionType]}}</span>
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
                :disabled="item.name === 'name'">
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
  import {getOptionRecord} from "./../../api/shop";
  import {timeFormat, getDatePickerTime, handleError} from "./../../util/util";
  import {SlickList, SlickItem, HandleDirective} from "vue-slicksort";

  const STORAGE_NAME = "shopOptionRecordTable";

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
          optionType: "",
          name: ""
        },
        // 编辑表格弹窗
        editTableDialog: false,
        // 临时编辑表格数据
        editTableItem: [],
        // 编辑表格要显示的
        selectEditTable: [],
        optionType: [
          {
            value: 0,
            label: "店铺名"
          },
          {
            value: 1,
            label: "店铺状态"
          },
          {
            value: 2,
            label: "店铺介绍"
          }
        ],
        tableItem: [
          {
            name: "optionName",
            title: "操作账号",
            isShow: true
          },
          {
            name: "optionNickname",
            title: "操作人",
            isShow: true
          },
          {
            name: "optionType",
            title: "操作类型",
            isShow: true
          },
          {
            name: "remark",
            title: "备注",
            isShow: true
          },
          {
            name: "createdAt",
            title: "操作时间",
            isShow: true
          }]
      };
    },
    computed: {
      optionTypeMap() {
        let obj = {};
        for (let i = 0, len = this.optionType.length; i < len; i++) {
          obj[this.optionType[i].value] = this.optionType[i].label;
        }
        return obj;
      }
    },
    created() {
      // 默认查一个月的
      this.dataPicker = getDatePickerTime(30);
      this.getShopOptionRecord();
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
        this.getShopOptionRecord();
      },
      // 获取表格数据
      async getShopOptionRecord() {
        this.searchParam.startTime = this.dataPicker[0];
        this.searchParam.endTime = this.dataPicker[1];
        try {
          this.loading = true;
          let res = await getOptionRecord(this.searchParam);
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
          optionType: "",
          name: ""
        };
        this.getShopOptionRecord();
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
      // 每页页数变化
      handleSizeChange(val) {
        this.searchParam.pageSize = val;
        this.getShopOptionRecord();
      },
      // 页码变化
      handleCurrentChange(val) {
        this.searchParam.pageNumber = val;
        this.getShopOptionRecord();
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

  .table-container
    margin-top 20px

    .el-pagination
      margin-top 20px

  .option-button
    position relative
    padding-right 50px

    .edit-btn
      position absolute
      right 4px
</style>
