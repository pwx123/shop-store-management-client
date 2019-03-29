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
          <el-radio-group size="mini" v-model="saleOption" @change="saleOptionChange">
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
            <span>销售数量</span>
            <span>排行</span>
          </li>
          <li :key="item.name" v-for="(item,index) in bookTop10">
            <span>{{item.name}}</span>
            <span>{{item.num}}</span>
            <span>{{index < 3 ? "": (index+1)}}
            <span :class="topClass(index)" v-if="index < 3"></span>
            </span>
          </li>
        </ul>
      </div>
      <div>
        <div class="title">
          本月分类销量Top 10
        </div>
        <ul>
          <li>
            <span>分类名称</span>
            <span>销售数量</span>
            <span>排行</span>
          </li>
          <li :key="item.name" v-for="(item,index) in classifyTop10">
            <span>{{item.name}}</span>
            <span>{{item.num}}</span>
            <span>{{index < 3 ? "": (index+1)}}
            <span :class="topClass(index)" v-if="index < 3"></span>
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
            <span>消费金额</span>
            <span>排行</span>
          </li>
          <li :key="item.name" v-for="(item,index) in userTop10">
            <span>{{item.name}}</span>
            <span>{{item.num}}</span>
            <span>{{index < 3 ? "": (index+1)}}
            <span :class="topClass(index)" v-if="index < 3"></span>
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
        <el-radio-group size="mini" v-model="trendOption">
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
        // 每月销售量
        monthSaleCountData: [],
        // 每月销售额
        monthSaleMoneyData: [],
        // 切换销售额/销售量
        saleOption: 0,
        // 切换销售额/销售 走势
        trendOption: 0,
        // 订单信息
        orderStatistics: {},
        // 订单日周月信息
        orderStatisticsType: {},
        // 书籍top
        bookTop10: [
          {
            name: "12",
            num: 12
          },
          {
            name: "13",
            num: 12
          },
          {
            name: "14",
            num: 12
          },
          {
            name: "15",
            num: 12
          }
        ],
        classifyTop10: [],
        userTop10: []
      };
    },
    computed: {
      orderStatisticsTypeArr() {
        return [this.orderStatisticsType.month, this.orderStatisticsType.week, this.orderStatisticsType.today];
      },
      ...mapGetters(["userInfo"])
    },
    created() {
      this.getOrderStatistics();
      this.getOrderStatisticsByType();
    },
    mounted() {
      this.setMonthSaleCharts();
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
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          },
          yAxis: {
            type: "value"
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }]
        });
      },
      // 日周月变化
      saleOptionChange(){
        this.getOrderStatisticsByType();
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

          span
            flex 1
            text-align center

            &:first-child
              overflow hidden

          .top
            display inline-block
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
