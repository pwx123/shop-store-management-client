<template>
  <div>
    {{userInfo.name}}
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { handleError } from "../../util/util";
export default {
  data() {
    return {};
  },
  created() {
    this.getUserInfoFun();
  },
  computed: {
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
    ...mapActions(["getUserInfoActions"])
  }
};
</script>

<style scoped>
</style>
