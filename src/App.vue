<template>
  <div id="app">
    <transition name="fade-transform"
        mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "App"
  };
</script>

<style>
  body,
  html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  a {
    text-decoration: none;
  }

  li {
    list-style: none;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  .el-notification.notify {
    cursor: pointer;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #c9c9c9;
  }

  .el-picker-panel__footer .el-picker-panel__link-btn:first-child span {
    display: none;
  }

  .edit-table-dialog {
    position: relative;
  }

  .edit-table-dialog .tips {
    display: flex;
    width: 100%;
    position: absolute;
    top: -30px;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #66b1ff;
  }


  .edit-table-dialog .slick-list {
    background-color: #f3f3f3;
    border: 1px solid #efefef;
    max-height: 400px;
    overflow: auto;
  }


  .edit-table-dialog .slick-list .slick-item {
    display: flex;
    align-items: center;
    color: #333;
    background-color: #fff;
    border-bottom: 1px solid #efefef;
    padding: 10px;
  }

  .slick-helper {
    padding: 10px;
    z-index: 9999;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: rgba(185, 218, 255, 0.8);
    color: #fff;
  }

  .handle {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2250%22%20height=%2250%22%20viewBox=%220%200%2050%2050%22%3E%3Cpath%20d=%22M%200%207.5%20L%200%2012.5%20L%2050%2012.5%20L%2050%207.5%20L%200%207.5%20z%20M%200%2022.5%20L%200%2027.5%20L%2050%2027.5%20L%2050%2022.5%20L%200%2022.5%20z%20M%200%2037.5%20L%200%2042.5%20L%2050%2042.5%20L%2050%2037.5%20L%200%2037.5%20z%22%20color=%22black%22%3E%3C/path%3E%3C/svg%3E');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.25;
    margin-right: 10px;
    cursor: row-resize;
  }

</style>
