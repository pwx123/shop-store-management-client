<template>
  <div>
    <div class="top">
      <div class="top-info">
        <div class="title">
          基本信息
        </div>
        <div class="content">
          <div class="user-info">
            <img :src="userInfo.avatarUrl || defaultAvatar"/>
            <p>
              <span class="user-info-nickname">欢迎 <span>{{userInfo.nickname}}</span></span><br>
              <span class="user-info-name">当前登录账户 {{userInfo.name}}</span>
            </p>
          </div>
          <div class="num-info">
            <p>今日订单<br>
              <span @click="goOrderList" style="color: #20a0ff">{{orderStatistics.todayOrderNum}}</span>
            </p>
            <p>未处理订单<br>
              <span @click="goOrderList" style="color: #f56c6c">{{orderStatistics.dealWithOrderNum}}</span>
            </p>
            <p>退款订单<br>
              <span @click="goOrderList" style="color: #808080">{{orderStatistics.refundOrderNum}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="top-num">
        <div class="title">
          销量统计
        </div>
        <div class="option">
          <el-radio-group @change="saleOptionChange" size="mini" v-model="saleOption">
            <el-radio-button :label="0">销量(本)</el-radio-button>
            <el-radio-button :label="1">销售额(元)</el-radio-button>
          </el-radio-group>
        </div>
        <div id="saleNum"></div>
      </div>
    </div>
    <div class="center">
      <div>
        <div class="title">
          本月图书销量Top 10
        </div>
        <ul>
          <li>
            <span>书籍名称</span>
            <span>销售数量(本)</span>
            <span>排行</span>
          </li>
          <li :class="'trans-li-' + index + (isActive ? ' active' : '')" :key="index" v-for="(item,index) in topInfo.book">
            <span>{{item ? item.bookName : "--"}}</span>
            <span>{{item ? item.bookCount : "--"}}</span>
            <span>{{item ? (index < 3 ? "" : index+1) : "--"}}
            <span :class="topClass(index)" v-if="(index < 3) && item"></span>
            </span>
          </li>
        </ul>
      </div>
      <div>
        <div class="title">
          本月进货Top 10
        </div>
        <ul>
          <li>
            <span>书籍名称</span>
            <span>进货数量(本)</span>
            <span>排行</span>
          </li>
          <li :class="'trans-li-' + index + (isActive ? ' active' : '')" :key="index" v-for="(item,index) in topInfo.stock">
            <span>{{item ? item.bookName : "--"}}</span>
            <span>{{item ? item.stockNum : "--"}}</span>
            <span>{{item ? (index < 3 ? "" : index+1) : "--"}}
            <span :class="topClass(index)" v-if="(index < 3) && item"></span>
            </span>
          </li>
        </ul>
      </div>
      <div>
        <div class="title">
          本月会员消费Top 10
        </div>
        <ul>
          <li>
            <span>会员名称</span>
            <span>消费金额(元)</span>
            <span>排行</span>
          </li>
          <li :class="'trans-li-' + index + (isActive ? ' active' : '')" :key="index" v-for="(item,index) in topInfo.user">
            <span>{{item ? item.userName : "--"}}</span>
            <span v-if="item">{{item.userMoney | money}}</span>
            <span v-else>--</span>
            <span>{{item ? (index < 3 ? "" : index+1) : "--"}}
            <span :class="topClass(index)" v-if="(index < 3) && item"></span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom">
      <div class="title">
        销量走势
      </div>
      <div class="option">
        <el-radio-group @change="trendOptionChange" size="mini" v-model="trendOption">
          <el-radio-button :label="0">销量(本)</el-radio-button>
          <el-radio-button :label="1">销售额(元)</el-radio-button>
        </el-radio-group>
      </div>
      <div id="monthSale">

      </div>
    </div>
  </div>
</template>

<script>
  const echarts = require("echarts/lib/echarts");

  require("echarts/lib/chart/line");
  require("echarts/lib/chart/bar");
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/title");
  require("echarts/lib/component/grid");
  require("echarts/theme/walden");

  import {mapGetters} from "vuex";
  import * as indexApi from "./../../api/common";
  import {handleError} from "./../../util/util";

  export default {
    data() {
      return {
        // 默认头像
        defaultAvatar: this.$basePath + "/images/admin/default.png",
        // 动画开关
        isActive: false,
        // 切换销售额/销售量
        saleOption: 0,
        // 切换销售额/销售 走势
        trendOption: 0,
        // 订单信息
        orderStatistics: {},
        // 订单日周月信息
        orderStatisticsType: {},
        // top信息
        topInfo: {
          book: [],
          stock: [],
          user: []
        },
        // 趋势信息
        trendData: []
      };
    },
    computed: {
      orderStatisticsTypeArr() {
        return [this.orderStatisticsType.month || 0, this.orderStatisticsType.week || 0, this.orderStatisticsType.today || 0];
      },
      trendDataDay() {
        let arr = [];
        arr = this.trendData.map(item => item.day);
        return arr;
      },
      trendDataCount() {
        let arr = [];
        arr = this.trendData.map(item => item.count);
        return arr;
      },
      ...mapGetters(["userInfo"])
    },
    created() {
      this.getOrderStatistics();
      this.getTopInfo();
    },
    mounted() {
      this.getOrderStatisticsByType();
      this.getTrendInfoByType();
    },
    methods: {
      // 获取订单信息
      async getOrderStatistics() {
        try {
          let res = await indexApi.getOrderStatistics();
          if (res.errorCode === 200) {
            this.orderStatistics = res.data;
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
      // 获取日周月订单信息
      async getOrderStatisticsByType() {
        try {
          let res = await indexApi.getOrderStatisticsByType({type: this.saleOption});
          if (res.errorCode === 200) {
            this.orderStatisticsType = res.data;
            this.setSaleCharts();
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
      // 获取top信息
      async getTopInfo() {
        try {
          let res = await indexApi.getTop10Info();
          ;
          if (res.errorCode === 200) {
            this.topInfo.book = new Array(10);
            this.topInfo.stock = new Array(10);
            this.topInfo.user = new Array(10);
            for (let i = 0; i < 10; i++) {
              this.topInfo.book[i] = res.data.book[i];
              this.topInfo.stock[i] = res.data.stock[i];
              this.topInfo.user[i] = res.data.user[i];
            }
            setTimeout(() => {
              this.isActive = true;
            }, 30);
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
      // 获取趋势变化信息
      async getTrendInfoByType() {
        try {
          let res = await indexApi.getTrendInfo({type: this.trendOption});
          ;
          if (res.errorCode === 200) {
            this.trendData = res.data;
            this.setMonthSaleCharts();
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
      topClass(index) {
        let str = "top ";
        if (index === 0) {
          str += "first";
        } else if (index === 1) {
          str += "second";
        } else {
          str += "third";
        }
        return str;
      },
      // 跳转订单列表
      goOrderList() {
        this.$router.push("/index/orderList");
      },
      setSaleCharts() {
        let saleNum = echarts.init(document.getElementById("saleNum"), "walden");
        // 绘制图表
        saleNum.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: "category",
            data: ["月", "周", "日"]
          },
          series: [
            {
              label: {
                normal: {
                  show: true,
                  position: "inside"
                }
              },
              type: "bar",
              data: this.orderStatisticsTypeArr
            }]
        });
      },
      setMonthSaleCharts() {
        let monthSale = echarts.init(document.getElementById("monthSale"), "walden");
        // 绘制图表
        monthSale.setOption({
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            data: this.trendDataDay
          },
          yAxis: {
            type: "value"
          },
          series: [{
            data: this.trendDataCount,
            type: "line"
          }]
        });
      },
      // 日周月变化
      saleOptionChange() {
        this.getOrderStatisticsByType();
      },
      // 日周月变化
      trendOptionChange() {
        this.getTrendInfoByType();
      }
    }
  };
</script>

<style lang="stylus" scoped>
  p
    margin 0

  .top
    display flex
    height 300px
    color #333

    .top-info
      min-width 400px
      border 1px solid #ededed
      border-radius 4px

      .user-info
        display flex
        height 80px
        align-items center
        font-size 15px
        padding-bottom 10px
        border-bottom 1px solid #ededed

        img
          width 60px
          height 60px
          margin-right 14px

        .user-info-nickname span
          color #20a0ff

        .user-info-name
          line-height 28px
          font-size 13px
          color #999

      .num-info
        display flex
        padding-top 40px

        p
          flex 1
          text-align center

          span
            font-size 24px
            font-weight bold
            line-height 70px
            cursor pointer

    .top-num
      flex 2
      position relative
      margin-left 20px
      border 1px solid #ededed
      border-radius 4px

      .option
        position absolute
        top 40px
        right 10px
        z-index 999

      #saleNum
        height 270px

  .center
    margin-top 20px
    display flex

    > div
      flex 1
      margin-right 20px
      border 1px solid #ededed
      border-radius 4px
      color #666

      &:last-child
        margin 0

      ul
        margin 0
        padding 10px

        li
          position relative
          display flex
          line-height 36px
          border-bottom 1px dashed #ededed
          transition all .5s

          > span
            flex 1
            text-align center
            display flex
            justify-content center

          for i in (0 .. 9)
            &.trans-li-{i}
              transform translateY(-37px * i)

          &.active
            transform translateY(0)

          .top
            display block
            width 30px
            height 30px
            background-size 100%

          .first
            background-image url("./../../assets/first.png")

          .second
            background-image url("./../../assets/second.png")

          .third
            background-image url("./../../assets/third.png")

  .bottom
    position relative
    margin-top 20px
    border 1px solid #ededed
    border-radius 4px
    color #666

    .option
      position absolute
      top 40px
      right 10px
      z-index 999

  .title
    height 30px
    line-height 30px
    background-color #20a0ff
    color #fff
    padding-left 20px

  .content
    padding 16px

  #monthSale
    height 300px
</style>
