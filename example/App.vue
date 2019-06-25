<template>
  <el-card
    header="ele-table演示"
    shadow="never"
    style="max-width: 1250px;margin: 20px auto;"
  >
    <ele-table
      :columns-desc="columnsDesc"
      :delete-fn="handleDelete"
      :deletes-fn="handleDeletes"
      :is-show-index="false"
      :is-show-right-delete="true"
      :is-show-top-delete="true"
      :request-fn="handleRequest"
      :right-buttons="rightButtons"
      :top-buttons="topButtons"
      :top-search="topSearch"
      :top-time="topTime"
      :update-fn="handleUpdate"
      ref="table"
    />
  </el-card>
</template>

<script>
var Mock = require('mockjs')
var Random = Mock.Random

export default {
  name: 'App',
  data () {
    return {
      mockData: [],
      rightButtons: [
        {
          text: '编辑',
          click: (index, data) => {
            console.log(data)
            this.$message({
              type: 'success',
              message: '点击编辑了!'
            })
          }
        }
      ],
      topButtons: [
        {
          text: '新增',
          click: (data) => {
            console.log(data)
            this.$message({
              type: 'success',
              message: '点击新增!'
            })
          }
        },
        {
          text: '启用',
          attrs: {
            type: 'success'
          },
          click: (ids) => {
            console.log(ids)
            if (ids.length === 0) return
            this.mockData = this.mockData.map((item) => {
              if (ids.indexOf(item.id) > -1) {
                item.status = 1
              }
              return item
            })
            this.$refs.table.reset()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          }
        },
        {
          text: '禁用',
          attrs: {
            type: 'warning'
          },
          click: (ids) => {
            console.log(ids)
            if (ids.length === 0) return
            this.mockData = this.mockData.map((item) => {
              if (ids.indexOf(item.id) > -1) {
                item.status = 0
              }
              return item
            })
            this.$refs.table.reset()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          }
        }
      ],
      topTime: 'create_time',
      topSearch: [
        { text: '用户名', value: 'name' },
        { text: '省份', value: 'address' }
      ],
      columnsDesc: {
        id: {
          text: 'ID',
          sortable: true,
          width: 80
        },
        name: {
          text: '名字',
          type: 'input'
        },
        type: {
          text: '类型',
          options: ['VIP1', 'VIP2', 'VIP3', 'SVIP']
        },
        address: {
          text: '省份'
        },
        birthday: {
          text: '出生日期'
        },
        status: {
          text: '状态',
          type: 'status',
          width: 100,
          options: [
            { text: '正常', type: 'success', value: 1 },
            { text: '禁用', type: 'danger', value: 0 }
          ]
        },
        create_time: {
          text: '创建时间',
          type: 'datetime-text'
        }
      }
    }
  },
  methods: {
    handleRequest (params) {
      console.log(params)
      return new Promise((resolve) => {
        setTimeout(() => {
          let list = this.mockData
          // 过滤
          if (params._filter) {
            const filters = params._filter.split('|')
            filters.forEach((item) => {
              item = item.split(':')
              const field = item[0]
              const values = item[1].split(',')
              list = list.filter((item) => {
                // eslint-disable-next-line eqeqeq
                return values.some((value) => value == item[field])
              })
            })
          }

          // 时间过滤
          if (params._filter_time) {
            const filterTimes = params._filter_time.split('|')
            filterTimes.forEach((item) => {
              item = item.split(':')
              const field = item[0]
              const [startTime, endTime] = item[1].split(',')
              list = list.filter((item) => {
                return item[field] > Number(startTime) && item[field] <= Number(endTime)
              })
            })
          }

          // 搜索过滤
          if (params._search_field && params._search_keyword) {
            const searchFields = params._search_field.split('|')
            list = list.filter((item) => {
              return searchFields.some(field => {
                return item[field].indexOf(params._search_keyword) > -1
              })
            })
          }

          // 排序
          if (params._order_field) {
            list.sort((a, b) => {
              return params._order_direction === 'asc' ? a[params._order_field] - b[params._order_field] : b[params._order_field] - a[params._order_field]
            })
          }

          // 截取
          resolve({
            total: list.length,
            list: list.slice((params.page - 1) * params.size, params.page * params.size)
          })
        }, 1000)
      })
    },
    handleDelete (primaryKey, index, row) {
      console.log(primaryKey, index, row)
      this.mockData = this.mockData.filter((item) => item.id !== primaryKey)
      return Promise.resolve()
    },
    handleDeletes (ids, data) {
      console.log(ids, data)
      this.mockData = this.mockData.filter((item) => ids.indexOf(item.id) === -1)
      return Promise.resolve()
    },
    handleUpdate (data) {
      console.log(data)
      this.mockData = this.mockData.map((item) => {
        if (item.id === data.id) {
          item = Object.assign({}, item, data)
        }
        return item
      })
      return Promise.resolve()
    },
    // 测试数据
    getMockData () {
      const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'list|40': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 1,
          'name': '@cname',
          'birthday': '@datetime',
          'address': '@province',
          'type|1': [
            'VIP1',
            'VIP2',
            'VIP3',
            'SVIP'
          ],
          'avatar': function () {
            return Random.image('250x250', Mock.mock('@hex'))
          },
          'create_time': function () {
            return (new Date().getTime() / 1000) - Random.integer(0, 864000)
          },
          'status|0-1': 1
        }]
      })
      return data.list
    }
  },
  mounted () {
    const data = this.getMockData()
    this.mockData = data
  }
}
</script>

<style>
body {
  background-color: #f0f2f5;
}
</style>
