<template>
  <el-card
    header="ele-table演示"
    shadow="never"
    style="max-width: 1250px;margin: 50px auto;"
  >
    <ele-table
      :columns-desc="columnsDesc"
      :delete-fn="handleDelete"
      :deletes-fn="handleDeletes"
      :is-show-right-delete="true"
      :is-show-top-delete="true"
      :request-fn="handleRequest"
      :right-buttons="rightButtons"
      :top-buttons="topButtons"
      :top-search="topSearch"
      :top-time="['create_time', 'update_time']"
      :update-fn="handleUpdate"
    />
  </el-card>
</template>

<script>
// import { getUsers } from './request.js'

export default {
  name: 'App',
  data () {
    return {
      rightButtons: [
        {
          text: '编辑',
          click: (index, data) => {
            console.log(data)
            console.log('编辑, 点击')
          }
        }
      ],
      topButtons: [
        {
          text: '新增',
          click: () => {
            console.log('新增, 点击')
          }
        },
        {
          text: '导入',
          attrs: {
            type: 'success'
          },
          click: (data) => {
            console.log(data)
            console.log('导入, 点击')
          }
        },
        {
          text: '禁用',
          attrs: {
            type: 'warning'
          },
          click: (data) => {
            console.log(data)
            console.log('按钮3, 点击')
          }
        }
      ],
      topSearch: [
        { text: '用户名', value: 'username' },
        { text: '昵称', value: 'nickname' },
        { text: '手机号', value: 'mobile' }
      ],
      columnsDesc: {
        id: {
          text: 'ID',
          columnAttrs: {
            sortable: 'custom',
            width: 180
          }
        },
        type: {
          text: '类型',
          options: ['user', 'repo']
        },
        title: {
          text: '标题',
          type: 'input',
          toggleShow: false
        },
        url: {
          type: 'url',
          text: '链接',
          toggleShow: true
        },
        state: {
          text: '状态',
          type: 'status',
          options: [
            {
              text: 'open',
              value: 1,
              type: 'success'
            },
            {
              text: 'closed',
              value: 0,
              type: 'danger'
            }
          ]
        },
        created_at: {
          text: '创建时间',
          type: 'datetime-text'
        },
        _action: {
          width: 200
        }
      }
    }
  },
  methods: {
    handleRequest (params) {
      console.log(params)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, status: 0, title: '测试' }
          ])
        }, 1000)
      })
    },
    handleDelete (primaryKey, index, row) {
      console.log(primaryKey, index, row)
      return Promise.resolve()
    },
    handleDeletes (ids, data) {
      console.log(ids, data)
      return Promise.resolve()
    },
    handleUpdate (data) {
      console.log(data)
      return Promise.resolve()
    }
  },
  mounted () {}
}
</script>

<style>
body {
  background-color: #f0f2f5;
}
</style>
