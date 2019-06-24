<template>
  <div class="ele-table-toolbar">
    <div
      class="ele-table-toolbar_btns"
      style="margin-bottom: 12px;"
    >
      <!-- 自定义按钮 -->
      <el-button
        :key="index"
        @click="handleBtnClick(btn.click)"
        size="medium"
        v-bind="getBtnAttrs(btn.attrs)"
        v-for="(btn, index) of topButtons"
      >{{btn.text}}</el-button>
      <!-- 删除按钮 -->
      <el-button
        @click="handleDeleteBtnClick"
        size="medium"
        type="danger"
        v-if="isShowTopDelete"
      >删除</el-button>
    </div>

    <div class="ele-table-toolbar_filters">
      <!-- 时间过滤框 -->
      <template v-if="timeArr">
        <el-date-picker
          :key="field"
          @change="handleTimeFilter"
          align="right"
          class="ele-table-toolbar_filters__time"
          clearable
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          style
          type="daterange"
          unlink-panels
          v-for="field of timeArr"
          v-model="timeObj[field]"
        ></el-date-picker>
      </template>
      <!-- 搜索框 -->
      <template v-if="searchArr">
        <el-input
          :placeholder="searchPlaceholder"
          @clear="handleSearchClear"
          @keyup.enter.native="handleSearch"
          class="ele-table-toolbar_filters__search"
          clearable
          v-model="searchValue"
        >
          <!-- 用于选择字段 -->
          <template
            :style="{
              width: prependWidth + 'em'
            }"
            slot="prepend"
            v-if="searchArr.length === 1"
          >{{searchArr[0].text}}</template>
          <el-select
            :style="{
              width: prependWidth + 'em'
            }"
            placeholder="请选择"
            slot="prepend"
            v-else
            v-model="searchField"
          >
            <el-option
              label="不限"
              value
            ></el-option>
            <el-option
              :key="item.value"
              :label="item.text"
              :value="item.value"
              v-for="item of searchArr"
            ></el-option>
          </el-select>
        </el-input>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EleToolbar',
  props: {
    // 是否显示顶部删除按钮
    isShowTopDelete: Boolean,
    // 自定义顶部按钮
    topButtons: Array,
    // 顶部搜索字段
    topSearch: [Object, Array],
    // 顶部时间字段
    topTime: [String, Array],
    // 选中的数据
    selectedData: Array,
    // 主键
    primaryKey: String
  },
  data () {
    return {
      // 时间过滤值(多个时间时)
      timeObj: {},
      // 搜索字段
      searchField: '',
      // 搜索值
      searchValue: '',
      // 最后搜索的值
      // 用于判定输入后, 但是没有回车搜索, 却点击了清除
      lastSearchValue: ''
    }
  },
  computed: {
    // 时间筛选字段
    // 将字符串形式和数组形式, 统一为数组形式
    timeArr () {
      if (this.topTime) {
        return Array.isArray(this.topTime) ? this.topTime : [this.topTime]
      } else {
        return null
      }
    },
    // 搜索字段
    // 将对象形式和数组形式, 统一为数组形式
    searchArr () {
      if (this.topSearch) {
        return Array.isArray(this.topSearch) ? this.topSearch : [this.topSearch]
      } else {
        return null
      }
    },
    // 搜索提示
    searchPlaceholder () {
      let placeholder = '请输入'
      if (this.searchArr) {
        // 当选择特定字段时
        if (this.searchField) {
          this.searchArr.forEach((item) => {
            if (this.searchField === item.value) {
              placeholder = item.text
            }
          })
        } else {
          // 补全字段的text
          const texts = this.searchArr.map((item) => item.text)

          placeholder = texts.join(' / ')
        }
      }

      return placeholder
    },
    // prepend宽度, 根据 field的text字的个数
    prependWidth () {
      let width = '不限'.length
      const fixWidth = 4 // 固定宽度
      if (this.searchArr) {
        const textsLength = this.searchArr.map((item) => item.text.length)
        width = Math.max.apply([], textsLength)
      }

      return width + fixWidth
    }
  },
  methods: {
    // 点击按钮
    handleBtnClick (clickFn) {
      if (clickFn && typeof clickFn === 'function') {
        const keys = this.selectedData.map((item) => item[this.primaryKey])
        clickFn(keys, this.selectedData)
      }
    },
    // 点击删除按钮
    handleDeleteBtnClick () {
      this.$emit('deletes')
    },
    // 获取 button 的 type 值, 默认是primary
    getBtnAttrs (attrs) {
      return Object.assign({}, { type: 'primary' }, attrs)
    },
    // 时间过滤
    handleTimeFilter () {
      let timeObj = this.timeObj
      let res = []
      for (const field in timeObj) {
        const time = timeObj[field]
        if (time) {
          let [startTime, endTime] = time
          startTime = new Date(startTime).getTime() / 1000
          endTime = new Date(endTime).getTime() / 1000
          if (startTime === endTime) {
            endTime += 86400 - 1
          }
          res.push(`${field}:${startTime},${endTime}`)
        }
      }

      this.$emit('time-filter', res.join('|'))
    },
    // 清除搜索
    handleSearchClear (value) {
      // 判断有无搜索过
      if (this.lastSearchValue) {
        this.lastSearchValue = ''
        this.$emit('search', '', '')
      }
    },
    // 搜索
    handleSearch () {
      let searchField = this.searchField
      if (!searchField) {
        // [{ text: '用户名', value: 'username' },{ text: '昵称', value: 'nickname' }]
        // 转为 username|nickname
        const searchFieldArr = this.searchArr.map((item) => item.value)
        searchField = searchFieldArr.join('|')
      }
      this.lastSearchValue = this.searchValue
      this.$emit('search', searchField, this.searchValue)
    }
  }
}
</script>

<style>
.ele-table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap-reverse;
}

.ele-table-toolbar_filters {
  display: flex;
  justify-content: flex-end;
}

.ele-table-toolbar_filters__time {
  width: 250px !important;
  margin-left: 12px;
  margin-bottom: 12px;
}
.ele-table-toolbar_filters__time:first-child {
  margin-left: 0;
}

.ele-table-toolbar_filters__search {
  margin-left: 12px;
  width: 300px !important;
  margin-bottom: 12px;
}

@media screen and (max-width: 768px) {
  .ele-table-toolbar_filters {
    flex-wrap: wrap;
  }
  .ele-table-toolbar_filters__time {
    width: 100% !important;
    margin-left: 0;
  }
  .ele-table-toolbar_filters__search {
    width: 100% !important;
    margin-left: 0;
  }
}
</style>
