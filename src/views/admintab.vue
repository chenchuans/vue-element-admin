<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-left">
        <el-date-picker
          v-model="dateTime"
          type="datetime"
          :clearable="false"
          value-format="yyyy-MM-DD HH:mm:ss"
          placeholder="选择日期时间"
          @change="handleChange"
        />
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.userCnName }}
        </template>
      </el-table-column>
      <el-table-column label="首咨数据条数" align="center">
        <template slot-scope="scope">
          {{ scope.row.count1 }}
        </template>
      </el-table-column>
      <el-table-column label="轮转数据条数" align="center">
        <template slot-scope="scope">
          {{ scope.row.count2 }}
        </template>
      </el-table-column>
      <el-table-column label="拨打次数" align="center">
        <template slot-scope="scope">
          {{ scope.row.callCount }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tabList } from '@/api/user'
import { getCurrentTime } from '@/utils/tool'

export default {
  data() {
    return {
      tableList: [
      ],
      dateTime: new Date(),
      listLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const endTime = getCurrentTime(this.dateTime)
      this.listLoading = true
      tabList({
        startTime: `${endTime.slice(0, 10)} 00:00:00`,
        endTime
      }).then(response => {
        this.tableList = response.data
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
        this.tableList = []
      })
    },
    handleChange() {
      this.fetchData()
    },
    handleSearch() {
      this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.app-container-top-left {
  display: flex;
  justify-content: space-between;
  width: 400px;
}
.input {
  width: 300px;
}
.pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>
