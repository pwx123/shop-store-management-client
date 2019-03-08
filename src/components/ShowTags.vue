<template>
  <div>
    <template v-if="classifyData&&classifyData.length>0">
      <el-popover trigger="hover"
        width="240">
        <el-tag v-for="item in classifyData"
          :key="item">{{classifyMap[item] || '---'}}</el-tag>
        <div slot="reference">
          <el-tag v-for="item in classifyDataEllipsis"
            :key="item">{{classifyMap[item] || '---'}}</el-tag>
          <el-tag v-show="classifyData.length>ellipsisNum">...</el-tag>
        </div>
      </el-popover>
    </template>
    <template v-else>
      <span>---</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    classify: String,
    classifyMap: Object,
    ellipsisNum: {
      type: Number,
      default: 2
    }
  },
  computed: {
    classifyDataEllipsis() {
      return this.classify
        ? this.classify.split(",").slice(0, this.ellipsisNum)
        : [];
    },
    classifyData() {
      return this.classify ? this.classify.split(",") : [];
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-tag
  margin-left 6px
  margin-bottom 6px
</style>
