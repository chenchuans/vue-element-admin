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
      <el-date-picker
        v-model="timeDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        style="margin-left: 20px"
        @change="handleDateChange"
      />
      <el-button
        v-if="userRole === 'SUPER_ADMIN'"
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
import { download, getNowFormatDate } from '@/utils/tool'

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
      listLoading: false,
      timeDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      userRole: JSON.parse(localStorage.getItem('loginInfo') || '{}').userRole
    }
  },
  created() {
    this.pagination = JSON.parse(localStorage.getItem('loginInfo') || '{}').pagination
    this.timeDate = [new Date(), new Date()]
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
        startTime: getNowFormatDate(this.timeDate[0]),
        endTime: getNowFormatDate(this.timeDate[1]),
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
    handleDownload() {
      const { page, size } = this.pagination
      rankDownload({
        page,
        size,
        time: this.time,
        startTime: getNowFormatDate(this.timeDate[0]),
        endTime: getNowFormatDate(this.timeDate[1]),
        dimension: this.dimension
      }).then(response => {
        download(response, '业绩')
      })
    },
    handleDateChange() {
      this.fetchData()
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
