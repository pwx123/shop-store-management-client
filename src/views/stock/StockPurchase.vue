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
      <el-input placeholder="书名"
          size="medium"
          v-model.trim="searchParam.name"
          clearable
          @keyup.native.enter="search"></el-input>
      <el-input placeholder="作者"
          size="medium"
          v-model.trim="searchParam.author"
          clearable
          @keyup.native.enter="search"></el-input>
      <el-input placeholder="出版社"
          size="medium"
          v-model.trim="searchParam.press"
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
      <el-button type="danger"
          size="medium"
          @click.native="deleteBook">删除
      </el-button>
      <el-button type="primary"
          size="medium"
          @click.native="addBook">新增
      </el-button>
      <el-button type="success"
          size="medium"
          @click.native="downloadFile">模板下载
      </el-button>
      <el-upload class="form-upload-excel"
          ref="uploadExcel"
          name="bookList"
          action="#"
          accept=".xlsx, .xls"
          :http-request="uploadExcelFile"
          :show-file-list="false">
        <el-button slot="trigger"
            size="medium"
            type="success"
            :loading="uploadExcelLoading">批量上传
        </el-button>
      </el-upload>
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
          @selection-change="handleSelectionChange"
          border>
        <el-table-column type="selection"
            align="center"
            width="40"></el-table-column>
        <template v-for="item in tableItem">
          <el-table-column v-if="(item.name === 'name') && item.isShow"
              key="name"
              prop="name"
              align="center"
              label="书名"
              width="160"></el-table-column>
          <el-table-column v-if="(item.name === 'author') && item.isShow"
              key="author"
              prop="author"
              align="center"
              label="作者"
              width="140"></el-table-column>
          <el-table-column v-if="(item.name === 'press') && item.isShow"
              key="press"
              prop="press"
              align="center"
              label="出版社"
              width="180"></el-table-column>
          <el-table-column v-if="(item.name === 'isSell') && item.isShow"
              key="isSell"
              align="center"
              label="是否在售"
              width="100">
            <template slot-scope="scope">
            <span v-if="scope.row.isSell == 1"
                class="status-success">是</span>
              <span v-else
                  class="status-failed">否</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'classify') && item.isShow"
              key="classify"
              align="center"
              label="分类"
              width="180">
            <template slot-scope="scope">
              <show-tags :classify="scope.row.classify"
                  :classifyMap="classifyMap"></show-tags>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'title') && item.isShow"
              key="title"
              align="center"
              label="标题"
              width="180">
            <template slot-scope="scope">
              <span :title="scope.row.title">{{scope.row.title ? scope.row.title.length > 8 ? scope.row.title.slice(0,10) + '...' : scope.row.title : scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'description') && item.isShow"
              key="description"
              align="center"
              label="描述"
              width="180">
            <template slot-scope="scope">
              <span :title="scope.row.description">{{scope.row.description ? scope.row.description.length > 8 ? scope.row.description.slice(0,10) + '...' : scope.row.description : scope.row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'stock') && item.isShow"
              key="stock"
              prop="stock"
              align="center"
              label="库存"
              width="100"></el-table-column>
          <el-table-column v-if="(item.name === 'price') && item.isShow"
              key="price"
              align="center"
              label="价格"
              width="100">
            <template slot-scope="scope">
              <span>{{scope.row.price | money}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'salePrice') && item.isShow"
              key="salePrice"
              align="center"
              label="折后价"
              width="100">
            <template slot-scope="scope">
              <span>{{scope.row.salePrice | money}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'imageUrl') && item.isShow"
              key="imageUrl"
              align="center"
              label="图片"
              width="100">
            <template slot-scope="scope">
              <el-button v-if="scope.row.imageUrl"
                  type="text"
                  size="mini"
                  @click.native="showImgDialogFun(scope.row.imageUrl)">查看图片
              </el-button>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column v-if="(item.name === 'createdAt') && item.isShow"
              key="createdAt"
              prop="createdAt"
              align="center"
              label="创建时间"
              width="160"></el-table-column>
          <el-table-column v-if="(item.name === 'updatedAt') && item.isShow"
              key="updatedAt"
              prop="updatedAt"
              align="center"
              label="修改时间"
              width="160"></el-table-column>
        </template>
        <el-table-column fixed="right"
            align="center"
            label="操作"
            width="140">
          <template slot-scope="scope">
            <el-button type="text"
                size="mini"
                @click.native="editBook(scope.row)">编辑
            </el-button>
            <el-button type="text"
                size="mini"
                @click.native="editStockFun(scope.row)">库存修改
            </el-button>
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
    <el-dialog :title="isEdit ? '编辑图书' : '新增图书'"
        top="50px"
        width="500px"
        class="el-dialog-edit"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showEditFormDialog"
        @close="closeDialog">
      <el-form ref="editDataForm"
          :model="editData"
          :rules="editDataValidate"
          :hide-required-asterisk="false">
        <el-form-item label="书名"
            prop="name"
            label-width="80px">
          <el-input v-model.trim="editData.name"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者"
            prop="author"
            label-width="80px">
          <el-input v-model.trim="editData.author"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版社"
            prop="press"
            label-width="80px">
          <el-input v-model.trim="editData.press"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类"
            label-width="80px">
          <el-select v-model="editData.classify"
              multiple
              placeholder="请选择">
            <el-option v-for="item in classify"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题"
            prop="title"
            label-width="80px">
          <el-input v-model.trim="editData.title"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述"
            prop="description"
            label-width="80px">
          <el-input type="textarea"
              v-model.trim="editData.description"
              resize="none"
              autocomplete="off"
              :rows="3"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit"
            label="库存量"
            prop="stock"
            label-width="80px">
          <el-input v-model.trim="editData.stock"
              type="number"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit"
            label="进货价"
            prop="stockPrice"
            label-width="80px">
          <el-input v-model.trim="editData.stockPrice"
              type="number"
              step="0.01"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格"
            prop="price"
            label-width="80px">
          <el-input v-model.trim="editData.price"
              type="number"
              step="0.01"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="折后价"
            prop="salePrice"
            label-width="80px">
          <el-input v-model.trim="editData.salePrice"
              type="number"
              step="0.01"
              autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否在售"
            label-width="80px">
          <el-switch v-model="editData.isSell"></el-switch>
        </el-form-item>
        <el-form-item label="图片"
            label-width="80px">
          <el-button v-if="editData.imageUrl"
              type="text"
              size="small"
              @click.native="showImgDialogFun(editData.imageUrl)">查看图片
          </el-button>
          <el-upload class="form-upload"
              ref="upload"
              action="#"
              name="bookImg"
              accept=".png, .jpg"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleFileChange">
            <el-button slot="trigger"
                size="small"
                type="primary">{{editData.imageUrl ? "更换":"上传"}}图片
            </el-button>
            <div slot="tip"
                class="el-upload__tip">只能上传jpg/png文件，且不超过2M
            </div>
            <div class="preview"
                @click="showImgDialogFun(previewBase64, true)"
                v-if="previewBase64">
              <img :src="previewBase64"
                  title="点击查看大图">
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"
          class="dialog-footer">
        <el-button size="small"
            @click="showEditFormDialog = false">取 消
        </el-button>
        <el-button type="primary"
            size="small"
            @click="submitEditBook('editDataForm')">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog width="400px"
        class="edit-stock"
        title="库存修改"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="editStockDialog">
      <el-form ref="editStockForm"
          :model="editData"
          :rules="editDataValidate"
          :hide-required-asterisk="false">
        <el-form-item label="操作类型"
            label-width="80px">
          <el-radio-group v-model="radioSwitch"
              size="medium"
              @change="radioChange">
            <el-radio :label="0"
                border>进货
            </el-radio>
            <el-radio :label="1"
                border>删除
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="库存量"
            prop="changeStock"
            label-width="80px">
          <div class="in-stock"
              v-if="radioSwitch == 0">
            <span>{{editData.stock + editStock}}</span>
            <el-tooltip effect="dark"
                content="实际更新数量已提交后为准"
                placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
            <el-input-number v-model.trim="editStock"
                size="small"
                :min="0"
                :step="1"></el-input-number>
          </div>
          <div class="out-stock"
              v-else>
            <span>{{editData.stock + editStock}}</span>
            <el-tooltip effect="dark"
                content="实际更新数量已提交后为准"
                placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
            <el-input-number v-model.trim="editStock"
                size="small"
                :min="-editData.stock"
                :max="0"
                :step="1"></el-input-number>
          </div>
        </el-form-item>
        <el-form-item label="进货价"
            prop="stockPrice"
            label-width="80px"
            v-if="radioSwitch == 0">
          <el-input v-model.trim="editData.stockPrice"></el-input>
        </el-form-item>
        <el-form-item label="备注"
            prop="remark"
            label-width="80px"
            v-if="radioSwitch == 1">
          <el-input v-model.trim="editData.remark"
              type="textarea"
              resize="none"
              rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
          class="dialog-footer">
        <el-button size="small"
            @click="editStockDialog = false">取 消
        </el-button>
        <el-button type="primary"
            size="small"
            @click="submitEditStock('editStockForm')">确 定
        </el-button>
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
  import * as bookApi from "./../../api/bookList";
  import {
    timeFormat,
    getDatePickerTime,
    handleError,
    decimalReg
  } from "./../../util/util";

  import showTags from "./../../components/ShowTags";
  import {SlickList, SlickItem, HandleDirective} from "vue-slicksort";

  const STORAGE_NAME = "stockPurchaseTable";

  export default {
    data() {
      return {
        // 列表数据总数
        total: 0,
        // 时间选择框
        dataPicker: [],
        // 列表数据
        tableData: [],
        // 编辑数据
        editData: {},
        // 是否是编辑图书
        isEdit: true,
        // 编辑表格弹窗
        editTableDialog: false,
        // 临时编辑表格数据
        editTableItem: [],
        // 编辑表格要显示的
        selectEditTable: [],
        // 提交校验规则
        editDataValidate: {
          name: [{required: true, message: "请输入书名", trigger: "blur"}],
          author: [{required: true, message: "请输入作者", trigger: "blur"}],
          press: [{required: true, message: "请输入出版社", trigger: "blur"}],
          title: [{required: true, message: "请输入标题", trigger: "blur"}],
          remark: [{required: true, message: "请输入备注", trigger: "blur"}],
          description: [
            {required: true, message: "请输入描述", trigger: "blur"}
          ],
          changeStock: [
            {required: true, validator: this.changeStockRegFun, trigger: "blur"}
          ],
          stock: [{required: true, validator: this.numRegFun, trigger: "blur"}],
          stockPrice: [
            {required: true, validator: this.decimalRegFun, trigger: "blur"}
          ],
          price: [
            {required: true, validator: this.decimalRegFun, trigger: "blur"}
          ],
          salePrice: [
            {required: true, validator: this.decimalRegFun, trigger: "blur"}
          ]
        },
        // 加载中
        loading: false,
        // 编辑弹框
        showEditFormDialog: false,
        // 选择的值
        multipleSelection: [],
        // 分类
        classify: [],
        // 图片预览base64
        previewBase64: "",
        // file文件
        uploadFile: "",
        // 修改库存弹框
        editStockDialog: false,
        // 增加库存 删除库存 单选
        radioSwitch: 0,
        // 展示查看大图
        showImgDialog: false,
        // 大图Url
        showImageUrl: "",
        // 库存量修改值
        editStock: 0,
        // 上传excel按钮loading
        uploadExcelLoading: false,
        // 搜索参数
        searchParam: {
          pageNumber: 1,
          pageSize: 15,
          startTime: "",
          endTime: "",
          name: "",
          author: "",
          press: ""
        },
        tableItem: [
          {
            name: "name",
            title: "书名",
            isShow: true
          },
          {
            name: "author",
            title: "作者",
            isShow: true
          },
          {
            name: "press",
            title: "出版社",
            isShow: true
          },
          {
            name: "isSell",
            title: "是否在售",
            isShow: true
          },
          {
            name: "classify",
            title: "分类",
            isShow: true
          },
          {
            name: "title",
            title: "标题",
            isShow: true
          },
          {
            name: "description",
            title: "描述",
            isShow: true
          },
          {
            name: "stock",
            title: "库存",
            isShow: true
          },
          {
            name: "price",
            title: "价格",
            isShow: true
          },
          {
            name: "salePrice",
            title: "折后价",
            isShow: true
          },
          {
            name: "imageUrl",
            title: "图片",
            isShow: true
          },
          {
            name: "createdAt",
            title: "创建时间",
            isShow: true
          }, {
            name: "updatedAt",
            title: "修改时间",
            isShow: true
          }]
      };
    },
    computed: {
      // 分类转换为 map
      classifyMap() {
        let obj = {};
        for (let i = 0, len = this.classify.length; i < len; i++) {
          obj[this.classify[i].id] = this.classify[i].name;
        }
        return obj;
      }
    },
    created() {
      // 默认查一个月的
      this.dataPicker = getDatePickerTime(90);
      this.getBookList();
      this.getAllClassifyFun();
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
        this.getBookList();
      },
      // 获取表格数据
      async getBookList() {
        this.searchParam.startTime = this.dataPicker[0];
        this.searchParam.endTime = this.dataPicker[1];
        try {
          this.loading = true;
          let res = await bookApi.getBookList(this.searchParam);
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
      // 获取全部分类
      async getAllClassifyFun() {
        try {
          this.loading = true;
          let res = await bookApi.getAllClassify();
          this.loading = false;
          if (res.errorCode === 200) {
            this.classify = res.data;
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
        this.dataPicker = getDatePickerTime(90);
        this.searchParam = {
          pageNumber: 1,
          pageSize: 15,
          startTime: "",
          endTime: "",
          name: "",
          author: "",
          press: ""
        };
        this.getBookList();
      },
      // 删除图书
      async deleteBook() {
        let params = this.multipleSelection.map(val => val.id);
        let obj = {};
        obj.ids = params.join(",");
        if (params.length === 0) {
          this.$message({
            message: "请选择要删除的图书",
            type: "warning"
          });
          return false;
        }
        this.$confirm(`确定删除所选图书吗？`, "提示", {
          type: "warning"
        })
          .then(async () => {
            try {
              let res = await bookApi.deleteBooks(obj);
              if (res.errorCode === 200) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.searchParam.pageNumber = 1;
                this.getBookList();
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
          });
      },
      // 编辑图书
      editBook(row) {
        this.isEdit = true;
        this.uploadFile = "";
        this.editData = Object.assign({}, row);
        this.previewBase64 = "";
        if (row.classify) {
          this.editData.classify = row.classify
            .split(",")
            .map(item => parseInt(item));
        } else {
          this.editData.classify = [];
        }
        this.editData.isSell = row.isSell === 1;
        this.showEditFormDialog = true;
      },
      // 提交更改
      submitEditBook(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let formData = new FormData();
            for (let key in this.editData) {
              switch (key) {
                case "classify":
                  formData.append(key, this.editData[key].join(","));
                  break;
                case "isSell":
                  formData.append(key, this.editData[key] ? 1 : 0);
                  break;
                case "imageUrl":
                  formData.append(key, this.uploadFile);
                  break;
                case "createdAt":
                case "updatedAt":
                case "stock":
                  if (!this.isEdit) {
                    formData.append(key, this.editData[key]);
                  }
                  break;
                case "stockPrice":
                  if (!this.isEdit) {
                    formData.append(key, this.editData[key]);
                  }
                  break;
                default:
                  formData.append(key, this.editData[key]);
              }
            }
            let config = {
              headers: {"Content-Type": "multipart/form-data"}
            };
            try {
              let res = "";
              if (this.isEdit) {
                res = await bookApi.updateBook(formData, config);
              } else {
                res = await bookApi.insertBook(formData, config);
              }
              if (res.errorCode === 200) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.showEditFormDialog = false;
                this.getBookList();
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
      // radio 更改
      radioChange(val) {
        this.editStock = 0;
        this.$refs["editStockForm"].clearValidate();
      },
      // 提交库存修改
      submitEditStock(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            try {
              let obj = {
                type: this.radioSwitch,
                id: this.editData.id,
                changeStock: this.editStock,
                name: this.editData.name
              };
              if (this.radioSwitch == 1) {
                obj.remark = this.editData.remark;
              } else {
                obj.stockPrice = this.editData.stockPrice;
              }
              let res = await bookApi.updateBookStock(obj);
              this.editStockDialog = false;
              if (res.errorCode === 200) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.getBookList();
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
      // 修改库存
      editStockFun(row) {
        this.editStockDialog = true;
        this.editStock = 0;
        this.editData = {
          id: row.id,
          name: row.name,
          stock: row.stock,
          stockPrice: '',
          remark: '',
        };
      },
      // 选择图片
      handleFileChange(file) {
        if (file.raw.type !== "image/jpeg" && file.raw.type !== "image/png") {
          this.$message({
            message: "格式不支持",
            type: "error"
          });
          return false;
        }
        if (file.raw.size > 1024 * 1024 * 2) {
          this.$message({
            message: "大小不能超过2M",
            type: "error"
          });
          return false;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = e => {
          this.previewBase64 = e.currentTarget.result;
          this.uploadFile = file.raw;
        };
      },
      // 上传excel
      async uploadExcelFile(params) {
        let reg = /.*\.(xlsx|xls)$/;
        if (!reg.test(params.file.name)) {
          this.$message({
            message: "格式不支持",
            type: "error"
          });
          return false;
        }
        if (params.file.size > 1024 * 1024 * 20) {
          this.$message({
            message: "大小不能超过20M",
            type: "error"
          });
          return false;
        }
        let data = new FormData();
        data.append("excel", params.file);
        let config = {
          headers: {"Content-Type": "multipart/form-data"}
        };
        try {
          this.uploadExcelLoading = true;
          let res = await bookApi.uploadExcel(data, config);
          this.uploadExcelLoading = false;
          if (res.errorCode === 200) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.showEditFormDialog = false;
            this.getBookList();
          } else {
            this.$alert(res.errorMsg, "提示", {
              dangerouslyUseHTMLString: true
            });
          }
        } catch (error) {
          this.uploadExcelLoading = false;
          handleError(error);
        }
      },
      // 下载模板zip
      async downloadFile() {
        let params = {};
        let config = {
          responseType: "blob",
          headers: {filename: "utf-8"}
        };
        try {
          let data = await bookApi.downloadBookTemplate(params, config);
          let blob = new Blob([data], {
            type: "application/zip"
          });
          let objectUrl = window.URL.createObjectURL(blob);
          let downloadElement = document.createElement("a");
          downloadElement.href = objectUrl;
          downloadElement.download = `上传模板.zip`;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
          handleError(error);
        }
      },
      // 新增图书
      addBook() {
        this.isEdit = false;
        this.uploadFile = "";
        this.previewBase64 = "";
        this.editStock = 0;
        this.editData = {
          name: "",
          author: "",
          press: "",
          classify: [],
          title: "",
          description: "",
          stock: "",
          price: "",
          salePrice: "",
          isSell: true,
          imageUrl: ""
        };
        this.showEditFormDialog = true;
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
      // 图书选择变化
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 每页页数变化
      handleSizeChange(val) {
        this.searchParam.pageSize = val;
        this.getBookList();
      },
      // 页码变化
      handleCurrentChange(val) {
        this.searchParam.pageNumber = val;
        this.getBookList();
      },
      // 关闭弹框
      closeDialog() {
        this.$refs["editDataForm"] && this.$refs["editDataForm"].clearValidate();
        this.$refs["editStockForm"] &&
        this.$refs["editStockForm"].clearValidate();
      },
      // url加上时间参数
      getTimeUrl() {
        return `?t=${new Date().getTime()}`;
      },
      // 数字校验
      numRegFun(rule, value, callback) {
        if (!/\d+/.test(value)) {
          callback(new Error("请输入正确的数字,需大于0"));
        } else {
          callback();
        }
      },
      // 库存修改校验
      changeStockRegFun(rule, value, callback) {
        if (this.editStock === 0) {
          callback(new Error("请更改库存值"));
        } else {
          callback();
        }
      },
      // 小数校验
      decimalRegFun(rule, value, callback) {
        if (!decimalReg.test(value)) {
          callback(new Error("请输入正确的数字,最多两位小数"));
        } else {
          callback();
        }
      }
    },
    components: {
      showTags,
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

  .form-upload-excel
    display inline-block
    margin-left 10px

  .table-container
    margin-top 20px

    .el-pagination
      margin-top 20px

  .el-dialog-edit
    .el-form
      height 400px
      padding 10px
      overflow-y scroll

      .el-select
        width 100%

    .preview
      display flex
      justify-content center
      align-items center
      padding 10px
      margin-top 6px
      border 1px dashed #999
      border-radius 6px

      img
        cursor pointer
        max-width 300px

  .option-button
    position relative
    padding-right 50px

    .edit-btn
      position absolute
      right 4px

  .edit-stock
    .el-input-number
      margin-left 10px

  .dialog-img
    display flex
    justify-content center
    align-items center
    padding 10px

    img
      max-width 600px
</style>
