<template>
  <div style="overflow:hidden;">
    <el-pagination
      :current-page="page"
      :page-size="size"
      :page-sizes="[20, 40, 50, 100]"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
      style="float: right;"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'EleTablePagination',
  props: {
    // 当前页面
    page: Number,
    // 每页数量
    size: Number,
    // 总数
    total: Number
  },
  methods: {
    // 当前页码变化
    handleCurrentChange (val) {
      this.$emit('change', {
        page: val,
        size: this.size
      })
    },

    // 每页大小变化
    handleSizeChange (val) {
      this.$emit('change', {
        page: 1,
        size: val
      })
    }
  }
}
</script>
