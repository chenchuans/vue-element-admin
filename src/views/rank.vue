<!-- 业绩排行 -->
<template>
  <div class="app-container">
    <div class="app-container-top">
      <el-select
        v-model="dimension"
        placeholder="请选择"
        style="margin-right: 20px"
        @change="handledimension"
      >
        <el-option
          v-for="(item, index) in dimensionList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="time"
        placeholder="请选择"
        @change="handleTime"
      >
        <el-option
          v-for="(item, index) in timeList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="handleDownload"
      >业绩下载</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column :label="dimensionList.find(item => item.value === dimension).label" prop="name" />
      <el-table-column label="时间" prop="formatTime" />
      <el-table-column sortable label="单量" prop="saleCount" />
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { rankList, rankDownload } from '@/api/achieve'

const download = (fileStream, filename = '业绩') => {
  const blob = new Blob([fileStream], {
    // type值如后台设置，前端可省略，具体type值可参考https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const downloadElement = document.createElement('a') // 创建a标签
  const href = window.URL.createObjectURL(blob) // 创建DOMString
  // 设置文件名字
  downloadElement.style.display = 'none' // 隐藏a标签
  downloadElement.href = href // 赋值a标签的href
  downloadElement.download = filename // 下载后文件名
  document.body.appendChild(downloadElement) // 插入a标签
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

export default {
  data() {
    return {
      pagination: {},
      tableList: [],
      time: 'DAY',
      dimension: '1',
      timeList: [
        { label: '每日', value: 'DAY' },
        { label: '每周', value: 'WEEK' },
        { label: '每月', value: 'MONTH' }
      ],
      dimensionList: [
        { label: '全公司', value: '1' },
        { label: '部门', value: '2' },
        { label: '小组', value: '3' },
        { label: '个人', value: '4' }
      ],
      listLoading: false
    }
  },
  created() {
    this.pagination = JSON.parse(localStorage.getItem('loginInfo') || '{}').pagination
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const { page, size } = this.pagination
      rankList({
        page,
        size,
        time: this.time,
        dimension: this.dimension
      }).then(response => {
        this.tableList = response.data.data
        this.pagination.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
        this.tableList = []
      })
    },
    async handleDownload() {
      const { page, size } = this.pagination
      rankDownload({
        page,
        size,
        time: this.time,
        dimension: this.dimension
      }).then(response => {
        download(response)
      })
    },
    handledimension() {
      this.fetchData()
    },
    handleTime() {
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.fetchData()
    },
    handleCurrentChange(page) {
      this.pagination.page = page
      this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container-top {
  display: flex;
  margin-bottom: 20px;
}
.pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>
