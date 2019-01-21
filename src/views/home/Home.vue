<template>
  <el-row class="container">
    <el-col :span="24"
      class="header">
      <div class="logo">
        {{sysName}}
      </div>
      <div class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="sysUserAvatar" />
            {{sysUserName}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided
              @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
    <el-col :span="24"
      class="main">
      <aside>
        <el-menu :default-active="$route.path"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          router
          unique-opened>
          <template v-for="(item,index) in navRouter">
            <el-menu-item v-if="item.isSingle"
              :index="item.path"
              :key="item.name">
              {{item.name}}
            </el-menu-item>
            <el-submenu v-else :index="index + ''"
              :key="item.name">
              <template slot="title">{{item.name}}</template>
              <el-menu-item v-for="child in item.children"
                :index="child.path"
                :key="child.name">
                {{child.name}}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </aside>
      <section class="content-container">
        <el-col :span="24">
          <transition name="fade"
            mode="out-in">
            <router-view></router-view>
          </transition>
        </el-col>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      sysName: "书店管理系统",
      collapsed: false,
      sysUserName: "",
      sysUserAvatar: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  computed: {
    navRouter() {
      return this.$router.options.routes.filter(router => {
        return !router.hidden;
      });
    }
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleopen() {
      //console.log('handleopen');
    },
    handleclose() {
      //console.log('handleclose');
    },
    handleselect: function(a, b) {},
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {})
        .then(() => {
          sessionStorage.removeItem("user");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.name || "";
      this.sysUserAvatar = user.avatar || "";
    }
    console.log(this.$router);
    console.log(this.$route.matched);
  }
};
</script>

<style lang="stylus" scoped>
@import './../../styl/variables.styl'

.container
  position absolute
  top 0px
  bottom 0px
  width 100%

  .header
    display flex
    height 60px
    line-height 60px
    background $color-primary
    color #fff

    .userinfo
      flex 1
      text-align right
      padding-right 35px
      float right

      .userinfo-inner
        cursor pointer
        color #fff

        img
          width 40px
          height 40px
          border-radius 20px
          margin-top 10px

    .logo
      height 60px
      font-size 22px
      font-weight 600
      padding-left 20px
      border-color rgba(238, 241, 146, 0.3)
      width 210px
      border-right-width 1px
      border-right-style solid

  .main
    display flex
    position absolute
    top 60px
    bottom 0px
    overflow hidden

    aside
      flex 0 0 230px

      .el-menu
        height 100%

    .content-container
      flex 1
      overflow-y scroll
      padding 20px
</style>
