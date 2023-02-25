<!-- 业绩排行 -->
<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="部门" prop="deptName" />
      <el-table-column label="姓名" prop="userCnName" />
      <el-table-column sortable label="单量" prop="saleCount" />
    </el-table>
  </div>
</template>
<script>
import { todayRank } from '@/api/achieve'

export default {
  data() {
    return {
      tableList: [],
      listLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      todayRank({
      }).then(response => {
        this.tableList = response.data
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
        this.tableList = []
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>
