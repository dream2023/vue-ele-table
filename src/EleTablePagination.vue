<template>
  <div style="overflow:hidden;">
    <el-pagination
      :current-page="page"
      :page-size="size"
      :page-sizes="[size, size * 2, size * 3, size * 5]"
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
        page: this.page,
        size: val
      })
    }
  }
}
</script>
