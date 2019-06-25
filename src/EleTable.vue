<template>
  <div class="ele-table">
    <!-- 顶部工具栏 -->
    <ele-table-toolbar
      :is-show-top-delete="isShowTopDelete"
      :primary-key="primaryKey"
      :selected-data="selectedData"
      :top-buttons="topButtons"
      :top-search="topSearch"
      :top-time="topTime"
      @deletes="handleDeletes"
      @search="handleSearch"
      @time-filter="handleTimeFilter"
    />

    <!-- toggleShow 列 -->
    <div>
      <template v-for="(column, field) of columnsDesc">
        <el-checkbox
          :key="field"
          :label="column.text"
          v-if="column.toggleShow !== undefined"
          v-model="column.toggleShow"
        ></el-checkbox>
      </template>
    </div>

    <!-- 表格 -->
    <el-table
      :class="tableDesc.class"
      :data="tableData"
      :style="tableDesc.style"
      @filter-change="handleFilter"
      @selection-change="handleSelectionChange"
      @sort-change="handleSort"
      style="margin: 20px 0;"
      v-bind="tableAttrs"
      v-loading="isLoading"
      v-on="tableDesc.on"
    >
      <!-- 多选 -->
      <el-table-column
        type="selection"
        v-if="isShowSelection"
        width="55"
      ></el-table-column>

      <!-- index 列 -->
      <el-table-column
        :index="getIndex"
        align="center"
        label="序号"
        type="index"
        v-if="isShowIndex"
        width="50"
      ></el-table-column>

      <!-- 普通列 -->
      <template v-for="(column, field) of columnsDesc">
        <template v-if="column.toggleShow !== false">
          <!-- 兼容 attrs.formatter -->
          <el-table-column
            :column-key="field"
            :filters="getOptions(column.options)"
            :key="field"
            :label="column.text"
            :prop="field"
            v-bind="getColumnAttrs(column.columnAttrs)"
            v-if="column.columnAttrs && column.columnAttrs.formatter"
          />

          <el-table-column
            :column-key="field"
            :filters="getOptions(column.options)"
            :key="field"
            :label="column.text"
            :prop="field"
            :sortable="column.sortable === true ? 'custom' : column.sortable"
            :width="column.width"
            @selection-change="handleSelectionChange"
            @sort-change="handleSort"
            v-bind="getColumnAttrs(column.columnAttrs)"
            v-else
          >
            <!-- 具名插槽 & 作用域插槽 -->
            <template slot-scope="scope">
              <slot
                :desc="column"
                :name="field"
                :scope="scope"
              >
                <!-- 特殊类型 -->
                <ele-editable
                  :customAttrs="column.componentAttrs"
                  :customData="{
                    [primaryKey]: scope.row[primaryKey]
                  }"
                  :defaultValue="column.defaultValue"
                  :displayFormatter="column.displayFormatter"
                  :emptyText="column.emptyText"
                  :field="field"
                  :inline="column.inline"
                  :isNoWrapper="column.isNoWrapper"
                  :options="column.options"
                  :request-fn="updateFn"
                  :rules="column.rules"
                  :title="column.titleField ? scope.row[column.titleField] : column.text"
                  :type="column.type"
                  :valueFormatter="column.valueFormatter"
                  v-model="scope.row[field]"
                />
              </slot>
            </template>
          </el-table-column>
        </template>
      </template>
      <!-- 操作列 -->
      <el-table-column
        :width="rightColumnWidth"
        align="center"
        fixed="right"
        key="_action"
        label="操作"
        v-if="isShowRightColumn"
      >
        <template slot-scope="scope">
          <!-- 右侧按钮列表 -->
          <el-button
            :class="btn.class"
            :key="key"
            :style="btn.style"
            @click="btn.click && btn.click(scope.row[primaryKey], scope.$index,  scope.row)"
            size="small"
            v-bind="getRightButtonsAttrs(btn.attrs)"
            v-for="(btn, key) of rightButtons"
          >{{btn.text}}</el-button>

          <!-- 删除按钮 -->
          <el-button
            @click="handleDelete(scope.row[primaryKey], scope.$index, scope.row)"
            size="small"
            type="danger"
            v-if="isShowRightDelete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页 -->
    <ele-table-pagination
      :page="page"
      :size="size"
      :total="total"
      @change="handlePageOrSizeChange"
      v-if="isShowPagination && isDataCanPagination"
    />
  </div>
</template>

<script>
import EleTableToolbar from './EleTableToolbar'
import EleTablePagination from './EleTablePagination'
import goTopMixin from './easyGoTopMixin'
import { EleEditable } from 'vue-ele-editable/src/index'

export default {
  name: 'EleTable',
  mixins: [goTopMixin],
  components: {
    EleEditable,
    EleTableToolbar,
    EleTablePagination
  },
  props: {
    // 是否显示顶部删除按钮
    isShowTopDelete: {
      type: Boolean,
      default: true
    },
    // 是否显示右侧删除按钮
    isShowRightDelete: {
      type: Boolean,
      default: true
    },
    // 是否显示多选框
    isShowSelection: {
      type: Boolean,
      default: true
    },
    // 是否显示index列
    isShowIndex: {
      type: Boolean,
      default: true
    },
    // 主键
    primaryKey: {
      type: String,
      default: 'id'
    },
    // 请求函数
    requestFn: {
      type: Function,
      required: true
    },
    // 更新函数
    updateFn: Function,
    // 批量删除函数
    deletesFn: Function,
    // 删除函数
    deleteFn: Function,
    // 表格描述
    tableDesc: {
      type: Object,
      default () {
        return {}
      }
    },
    // 列描述
    columnsDesc: {
      type: Object,
      required: true
    },
    // 顶部按钮
    topButtons: Array,
    // 顶部时间过滤字段
    topTime: [String, Array],
    // 顶部搜索字段
    topSearch: [Object, Array],
    // 右侧按钮
    rightButtons: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否显示分页
    isShowPagination: {
      type: Boolean,
      default: true
    }
  },
  data () {
    // 获取默认排序
    let orderField = ''
    let orderDirection = ''
    if (this.tableDesc && this.tableDesc.attrs && this.tableDesc.attrs['default-sort']) {
      orderField = this.tableDesc.attrs['default-sort'].prop
      orderDirection = this.tableDesc.attrs['default-sort'].order === 'ascending' ? 'asc' : 'desc'
    }
    return {
      // 当前页面
      page: 1,
      // 数据总数
      total: 0,
      // 每页个数
      size: 20,
      // 加载状态
      isLoading: false,
      // 排序字段
      orderField: orderField,
      // 排序方向
      orderDirection: orderDirection,
      // 搜索字段
      searchField: '',
      // 搜索值
      searchKeyword: '',
      // 选中的数据
      selectedData: [],
      // 过滤字段
      filter: {},
      // 过滤值
      filterValues: '',
      // 时间筛选
      filterTime: '',
      // 本页数据
      tableData: [],
      // 是否可以分页
      isDataCanPagination: true
    }
  },
  computed: {
    // 全局配置属性
    globalParams () {
      return this.$EleTableParams || {}
    },
    // 请求参数的 key
    paramsKey () {
      return Object.assign({}, {
        size: 'size',
        page: 'page',
        _order_field: '_order_field',
        _order_direction: '_order_direction',
        _filter: '_filter',
        _filter_time: '_filter_time',
        _search_field: '_search_field',
        _search_keyword: '_search_keyword'
      }, this.globalParams.paramsKey)
    },
    // 表格属性
    tableAttrs () {
      return Object.assign({}, { border: true, stripe: true }, this.tableDesc.attrs)
    },
    // 判断是否显示右侧列
    isShowRightColumn () {
      return Object.keys(this.rightButtons).length > 0 || this.isShowRightDelete === true
    },
    rightColumnWidth () {
      let width = 60
      if (this.isShowRightDelete) {
        width += 60
      }
      if (this.rightButtons) {
        this.rightButtons.forEach((btn) => {
          width += 32
          width += btn.text.length * 12
        })
      }
      return width
    }
  },
  methods: {
    // 获取数据
    async getData () {
      if (this.isLoading) return
      this.isLoading = true
      const paramsKey = this.paramsKey
      const params = {
        [paramsKey.size]: this.size,
        [paramsKey.page]: this.page,
        [paramsKey._order_field]: this.orderField,
        [paramsKey._order_direction]: this.orderDirection,
        [paramsKey._filter]: this.filterValues,
        [paramsKey._filter_time]: this.filterTime,
        [paramsKey._search_field]: this.searchField,
        [paramsKey._search_keyword]: this.searchKeyword
      }
      try {
        // 切换 key
        let res = await this.requestFn(params)

        if (res instanceof Array) {
          // 不分页
          this.isDataCanPagination = false
          this.tableData = res
        } else {
          // 分页
          this.isDataCanPagination = true
          this.total = res.total
          this.tableData = res.list
        }
      } catch {
        this.$message.error('获取数据错误, 请刷新页面重试')
      } finally {
        this.isLoading = false
      }
    },
    // 初始化
    reset () {
      this.page = 1
      this.getData()
    },

    // 批量删除
    handleDeletes () {
      if (this.selectedData.length && this.deletesFn) {
        this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const primaryKeys = this.selectedData.map((item) => item[this.primaryKey])
            await this.deletesFn(primaryKeys, this.selectedData)
            this.$message.success('删除成功')
            this.reset()
          } catch {
            this.$message.error('删除失败, 请重试')
          }
        }).catch(() => {})
      }
    },
    // 批量删除
    handleDelete (primaryKey, index, row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (this.deleteFn) {
          try {
            await this.deleteFn(primaryKey, index, row)
            this.$message.success('删除成功')
            this.reset()
          } catch {
            this.$message.success('删除失败, 请重试')
          }
        }
      }).catch(() => {})
    },
    // 过滤
    handleFilter (value) {
      this.filter = Object.assign(this.filter, value)
      this.filterValues = this.formatValues(this.filter)
      this.reset()
    },
    // 多选操作
    handleSelectionChange (arr) {
      this.selectedData = arr
    },
    // 改变排序
    handleSort ({ order, prop }) {
      if (order) {
        this.orderDirection = order === 'ascending' ? 'asc' : 'desc'
        this.orderField = prop
      } else {
        this.orderDirection = ''
        this.orderField = ''
      }

      this.reset()
    },
    // 格式化筛选字段: 值 "_filter" = "sex:1,2,3|name:abc"
    formatValues (obj) {
      let values = ''
      let objIndex = 0
      for (let key in obj) {
        let itemIndex = 0
        if (obj[key].length !== 0) {
          values += objIndex > 0 ? `|${key}:` : `${key}:`
          objIndex++
          obj[key].forEach(item => {
            values += itemIndex > 0 ? `,${item}` : `${item}`
            itemIndex++
          })
        }
      }
      return values
    },
    // 搜索
    handleSearch (field, value) {
      this.searchField = field
      this.searchKeyword = value
      this.reset()
    },
    // 时间过滤
    handleTimeFilter (filterTime) {
      this.filterTime = filterTime
      this.reset()
    },
    // 当前页面或者页面显示数据个数变动
    handlePageOrSizeChange ({ page, size }) {
      this.page = page
      this.size = size
      this.getData()
      this.$goTop()
    },
    // 获取Index列值
    getIndex (index) {
      return (this.page - 1) * this.size + index + 1
    },
    // 获取options
    getOptions (options) {
      if (options && Array.isArray(options)) {
        return options.map((item) => {
          if (typeof item === 'string') {
            return {
              text: item,
              value: item
            }
          } else {
            return item
          }
        })
      } else {
        return options
      }
    },
    // 获取column的属性值
    getColumnAttrs (attrs) {
      return Object.assign({}, { align: 'center', 'header-align': 'center' }, attrs)
    },
    // 右侧按钮默认属性
    getRightButtonsAttrs (attrs) {
      return Object.assign({}, { type: 'primary' }, attrs)
    }
  },
  mounted () {
    if (this.globalParams.defaultSize) {
      this.size = this.globalParams.defaultSize
    }

    this.getData()
  }
}
</script>
