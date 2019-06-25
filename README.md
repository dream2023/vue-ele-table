# vue-ele-table | 基于 element-ui 的表格二次封装

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg)](https://opensource.org/licenses/mit-license.php)
[![npm](https://img.shields.io/npm/v/vue-ele-table.svg)](https://www.npmjs.com/package/vue-ele-table)
[![download](https://img.shields.io/npm/dw/vue-ele-table.svg)](https://npmcharts.com/compare/vue-ele-editable?minimal=true)

## 说明

vue-ele-table 是基于[element-ui table](https://element.eleme.cn/#/zh-CN/component/table) 和 [vue-ele-editable](https://github.com/dream2023/vue-ele-editable) 的进一步封装, 内置了 <code>搜索、排序、筛选、过滤、分页、显示隐藏列、行内编辑</code> 功能, 隐藏了细节, 目的是为了保证开发的质量, 加快开发的速度 😁。

⚠️ 但是, 由于在接口的设计上, 每个项目千差万别, 本来想将本组件变得更加通用和适应, 但是发现越改操作越复杂, 违背了当初的意愿。所以您如果想要应用到自己的项目中, 一种方法是可以参考本项目的 API 设计规范, 另一种方法是 clone/download 后, 放到自己项目中进行修改, 另外如果您有好的建议, 尽管提 issue, 一定第一时间响应(PS: 本项目代码注释相当详细, 相信你能看懂)

> 如果 star 超过 100, 有视频详细源码讲解

## 演示

[![演示图](./public/example.gif)](https://codepen.io/dream2023/pen/agwMpY)

## 在线示例

[https://codepen.io/dream2023/pen/agwMpY](https://codepen.io/dream2023/pen/agwMpY)

## 安装

```bash
npm install vue-ele-table --save
```

## 使用

```js
import EleTable from 'vue-ele-table'
Vue.use(EleTable)

// 在引入 EleTable 时，可以传入一个全局配置对象, 例如:
Vue.use(EleTable, {
  // 每页显示的数量
  defaultSize: 10,
  // 用于改变请求的key,
  // 例如: 原 { page: 1, size: 20  }, 经过下面设置后, 就会变为: { page: 1, per_page: 20 }
  paramsKey: {
    size: 'per_page'
  },
  // editable 相关的配置, 具体参考:
  // https://github.com/dream2023/vue-ele-editable
  editable: {
    image: {
      lazy: true
    }
    // ...
  }
})
```

## API 规范

### 返回数据格式

```js
{
  "total": Number, // 总条数
  "list": Array // 数据列表
},
// 或者 直接数组
[
  { },
  { }
]


// 例如:
// 默认分页
{
  "total": 300,
  "list": [
    { id: 1, age: 19, name: '张三' },
    { id: 2, age: 33, name: '李四' },
    { id: 3, age: 22, name: '王五' },
  ]
}

// 直接返回数组, 则表明无需分页
[
  { id: 1, age: 19, name: '张三' },
  { id: 2, age: 33, name: '李四' },
  { id: 3, age: 22, name: '王五' },
]
```

### 分页控制

```js
{
  "page": Number, // 页码, 默认为 1
  "size": Number, // 每页显示条数，默认值 20
},

// 例如:
// 也就是 当前是 第2页, 每页显示 30 条
{
  "page": 2,
  "size": 30
}
```

### 排序控制

```js
// 请求参数
{
  "_order_field": String, // 排序字段名
  "_order_direction": "asc" || "desc", // 正序 或 倒序
},

// 例如:
// 含义: 排序字段是 id, 正序 asc
{
  "_order_field": 'id',
  "_order_direction": "asc"
}
```

### 筛选控制

```js
{
  "_filter": String, // 支持多筛选, 用 | 分割不同字段, 用 : 分割值和字段, 用 , 分割值

  // 例如:
  // 含义: (type=1 或 type = 2 或 type=3) 且 name = 'abc'
  "_filter": "type:1,2,3|name:abc"
}


```

### 时间筛选控制

```js
{
  "_filter_time" : String, // 分割原理同上

  // 例如:
  // 含义: (create_time > 12121212 且 create_time < 13131313) 且 (update_time > 14141414 且 update_time < 15151515)
  "_filter_time" = "create_time:12121212,13131313|update_time:14141414,15151515",
}
```

### 搜索控制

```js
{
  "_search_field": "字段|字段|字段",
  "_search_keyword": "搜索内容"
},

// 例如:
// 含义: (name 或者 title 或者 article) 包含 学习vue 的记录
{
  "_search_field": "name|title|article",
  "_search_keyword": "学习vue"
}
```

## Props 参数

```js
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
  // 是否显示分页
  isShowPagination: {
    type: Boolean,
    default: true
  },
  // 主键
  // 用途: 删除, 更新等按钮操作
  primaryKey: {
    type: String,
    default: 'id'
  },
  // 请求函数
  // 用途: 所有请求都有内部完成, 所以需要一个请求函数, 改函数的返回值必须是一个Promise实例
  requestFn: {
    type: Function,
    required: true
  },
  // 更新函数
  // 用途: 用于行内编辑时, 更新数据, 具体参考: https://github.com/dream2023/vue-ele-editable
  updateFn: Function,
  // 批量删除函数
  deletesFn: Function,
  // 删除函数
  deleteFn: Function,
  // 表格描述, 下面会详细论述
  tableDesc: {
    type: Object,
    default () {
      return {}
    }
  },
  // 列描述, 下面会详细论述
  columnsDesc: {
    type: Object,
    required: true
  },
  // 顶部按钮, 下面会详细论述
  topButtons: Array,
  // 顶部时间过滤字段
  // 这个比较简单, 只需要传递字段就行了, 例如 ['create_time', 'update_time'] 或者 'create_time'
  topTime: [String, Array],
  // 顶部搜索字段, 下面会详细论述
  topSearch: [Object, Array],
  // 右侧按钮, 下面会详细论述
  rightButtons: {
    type: Array,
    default () {
      return []
    }
  }
}
```

### columnsDesc

```html
<!-- 伪代码, 帮助理解 -->
<el-table-column
  v-for="(column, field) of columnsDesc"
  :key="field"
  :filters="column.options"
  :label="column.text"
  :sortable="column.sortable === true ? 'custom' : column.sortable"
  :width="column.width"
  v-bind="column.columnAttrs"
>
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
</el-table-column>
```

```js
columnsDesc: {
  // 字段
  status: {
    text: '状态', // 表头名字
    sortable: true, // 该列是否需要排序,
    width: 100, // 列宽
    options: [ // 用于筛选
      { text: '正常', value: true }, // text 用来显示, value 是 text 对应的值
      { text: '禁用', value: false }
    ],
    columnAttrs: { // 其他关于 column 的属性, 都使用 columnAttrs
      resizable: false, // 禁止拖动
    },

    // 下面的是关于 editable 相关的属性
    // https://github.com/dream2023/vue-ele-editable
    type: 'status', // 指定 列 显示的类型,
    defaultValue: 1, // 默认值,
    // ...
  },
  name: {
    type: 'input',
    text: '姓名'
  },
  // ...
}
```

### tableDesc

```html
<!-- 伪代码 -->
<el-table
  :class="tableDesc.class"
  :style="tableDesc.style"
  v-bind="tableDesc.attrs"
  v-on="tableDesc.on"
></el-table>
```

```js
tableDesc: {
  class: {},  // 添加的类
  style: {}, // 添加的自定义样式
  attrs: {}, // 添加的自定义属性
  on: {}, // 添加的自定义事件
}
```

```js
// 例子: 指定默认排序字段
tableDesc: {
  attrs: {
    'default-sort': {prop: 'date', order: 'descending'}
  }
}
```

### topButtons

```js
{
  primaryKey: 'id', // 假定主键字段为 id
  topButtons: [
    {
      text: '新增', // 文字
      attrs: { // btn相关属性
        type: 'success',
      },
      click: (ids, rows) => {
        // 点击事件
        console.log(ids, rows) // 传递过来勾选中的列的 主键集合 和 列的集合
      }
    },
    {
      // ...
    }
  ]
}
```

### rightButtons

```js
{
  primaryKey: 'id', // 假定主键字段为 id
  rightButtons: [
    {
      text: '编辑', // 显示的文字
      attrs: { // btn相关属性
        type: 'success',
      },
      click: (id, index, row) => {
        // 点击事件
        console.log(id, index, row) // 传递过来 主键值, 行的index值, 和 行值
      }
    }
  ]
}
```

### topSearch

```js
topSearch: [
  { text: '用户名', value: 'name' }, // text: 显示在提示框的内容, value: 字段
  { text: '省份', value: 'address' }
]
```

### 综合案例

```js
data () {
  return {
    rightButtons: [
      {
        text: '编辑',
        click: (id, index, data) => {
          console.log(id, index, data)
        }
      }
    ],
    topButtons: [
      {
        text: '新增',
        click: (ids) => {
          console.log(ids)
        }
      },
      {
        text: '启用',
        attrs: {
          type: 'success'
        },
        click: (ids) => {
          console.log(ids)
        }
      },
      {
        text: '禁用',
        attrs: {
          type: 'warning'
        },
        click: (ids) => {
          console.log(ids)
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
      avatar: {
        text: '头像',
        type: 'image'
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
}
```

## 相关链接

- [vue-ele-editable](https://github.com/dream2023/vue-ele-editable)
- [element table](https://element.eleme.cn/#/zh-CN/component/table)
