<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <router-link tag="div" to="/index" class="logo">
        {{ sysName }}
      </router-link>
      <span class="sound-tips" title="新订单语音提示">
        <i
          :class="
            'iconfont' +
              (isSound ? ' icon-yinlianglabashengyin' : ' icon-jingyin')
          "
          @click="toggleSoundTips"
        ></i>
      </span>
      <div class="userinfo">
        <el-dropdown trigger="hover" size="medium">
          <span class="el-dropdown-link userinfo-inner">
            <span>{{ userInfo.nickname }}</span>
            <img :src="userInfo.avatarUrl || defaultAvatar" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="linkToAdminInfo"
              >个人信息</el-dropdown-item
            >
            <el-dropdown-item @click.native="logout" divided
              >退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
    <el-col :span="24" class="main">
      <aside>
        <el-menu :default-active="$route.path" router unique-opened>
          <template v-for="(item, index) in navRouter">
            <el-menu-item
              v-if="item.isSingle"
              :index="item.path"
              :key="item.children[0].name"
            >
              <i :class="item.iconCls"></i>&nbsp; {{ item.children[0].name }}
            </el-menu-item>
            <el-submenu v-else :index="index + ''" :key="item.name">
              <template slot="title"
                ><i :class="item.iconCls"></i>&nbsp; {{ item.name }}</template
              >
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.name"
              >
                {{ child.name }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </aside>
      <section class="content-container">
        <el-col :span="24">
          <transition name="fade-transform" mode="out-in">
            <router-view v-if="showRouterView" @reload="reload"></router-view>
          </transition>
        </el-col>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { logout } from "./../../api/login";
import { handleError } from "./../../util/util";

export default {
  data() {
    return {
      sysName: "网上书店管理系统",
      defaultAvatar: this.$basePath + "/images/admin/default.png",
      showRouterView: true,
      audioTips: true,
      orderNotify: {
        newOrderNum: 0,
        newRefundOrderNum: 0,
        newOrderInstance: "",
        newRefundOrderInstance: ""
      },
      // 是否静音
      isSound: true
    };
  },
  created() {
    this.getUserInfoFun();
    this.setMessageAudioTips();
    this.$socket.open();
    let isSoundStorage = localStorage.getItem("isSound");
    if (isSoundStorage) {
      this.isSound = JSON.parse(isSoundStorage);
    }
  },
  computed: {
    navRouter() {
      return this.$router.options.routes.filter(router => {
        return !router.hidden;
      });
    },
    ...mapGetters(["userInfo"])
  },
  methods: {
    async getUserInfoFun() {
      try {
        await this.getUserInfoActions();
      } catch (error) {
        handleError(error);
      }
    },
    // 跳转个人信息页面
    linkToAdminInfo() {
      this.$router.push("/index/adminInfo");
    },
    // 切换静音
    toggleSoundTips() {
      this.isSound = !this.isSound;
      localStorage.setItem("isSound", JSON.stringify(this.isSound));
    },
    reload() {
      this.showRouterView = false;
      this.$nextTick(() => {
        this.showRouterView = true;
      });
    },
    // 退出登录
    logout() {
      this.$confirm("确认退出吗?", "提示", {})
        .then(async () => {
          try {
            let res = await logout();
            if (res.errorCode === 200) {
              this.$router.push("/login");
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
        .catch(() => {});
    },
    setMessageAudioTips() {
      let audioTips = new Audio();
      audioTips.src =
        this.$basePath + "/ding.mp3";
      this.audioTips = audioTips;
    },
    ...mapActions(["getUserInfoActions"])
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    hasNewOrder(res) {
      let _this = this;
      this.orderNotify.newOrderNum++;
      this.orderNotify.newOrderInstance &&
        this.orderNotify.newOrderInstance.close();
      this.audioTips.play && this.isSound && this.audioTips.play();
      this.orderNotify.newOrderInstance = this.$notify.info({
        title: "提示",
        message: "您有 " + this.orderNotify.newOrderNum + " 笔新订单",
        duration: 0,
        customClass: "notify",
        offset: 50,
        onClick() {
          if (_this.$route.path === "/index/orderList") {
            _this.reload();
          } else {
            _this.$router.push("/index/orderList");
          }
          _this.orderNotify.newOrderNum = 0;
          _this.orderNotify.newRefundOrderNum = 0;
          _this.$notify.closeAll();
        }
      });
    },
    hasNewRefundOrder(res) {
      let _this = this;
      this.orderNotify.newRefundOrderNum++;
      this.orderNotify.newRefundOrderInstance &&
        this.orderNotify.newRefundOrderInstance.close();
      this.audioTips.play && this.isSound && this.audioTips.play();
      this.orderNotify.newRefundOrderInstance = this.$notify({
        title: "提示",
        message:
          "您有 " + this.orderNotify.newRefundOrderNum + " 笔新的退款订单",
        type: "warning",
        duration: 0,
        customClass: "notify",
        offset: 50,
        onClick() {
          if (_this.$route.path === "/index/orderList") {
            _this.reload();
          } else {
            _this.$router.push("/index/orderList");
          }
          _this.orderNotify.newOrderNum = 0;
          _this.orderNotify.newRefundOrderNum = 0;
          _this.$notify.closeAll();
        }
      });
    },
    err(res) {
      this.$message({
        message: res.errorMsg,
        type: "error"
      });
      if (res.errorCode === 401) {
        this.$socket.close();
        this.$router.replace({
          path: `/login?redirect=${this.$router.currentRoute.fullPath}`
        });
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path.indexOf("index") === -1) {
      this.orderNotify.newOrderInstance &&
        this.orderNotify.newOrderInstance.close();
      this.orderNotify.newRefundOrderInstance &&
        this.orderNotify.newRefundOrderInstance.close();
      this.$socket.close();
    }
    next();
  }
};
</script>

<style lang="stylus" scoped>
@import './../../styl/variables.styl'

.container
  height 100%
  width 100%

  .header
    display flex
    height 60px
    background $color-primary
    color #fff

    .sound-tips
      flex 1
      text-align right
      line-height 60px
      padding-right 14px

      i
        cursor pointer
        font-size 20px

    .userinfo
      text-align right
      padding-right 35px

      .userinfo-inner
        cursor pointer
        color #fff
        display flex
        justify-content center
        align-items center
        height 60px

        img
          width 40px
          height 40px
          border-radius 50%
          border 1px solid #94bcf5

        span
          margin-right 10px

    .logo
      height 60px
      line-height 60px
      font-size 22px
      font-weight 600
      padding-left 20px
      border-color rgba(238, 241, 146, 0.3)
      width 210px
      border-right-width 1px
      border-right-style solid
      cursor pointer

  .main
    display flex
    position absolute
    top 60px
    bottom 0px
    overflow hidden

    aside
      flex 0 0 230px

      & > .el-menu
        height 100%

        .el-menu
          padding-left 10px

          .el-menu-item
            background-color #fafafa

            &:hover, &:focus
              outline 0
              background-color #ecf5ff

    .content-container
      flex 1
      overflow-y scroll
      padding 20px
</style>
