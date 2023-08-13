<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-left">
        <el-date-picker
          v-model="dateTime"
          type="datetime"
          :clearable="false"
          placeholder="选择日期时间"
          style="margin-right: 8px;"
          @change="handleChange"
        />
        <el-select
          v-model="searchSelectId"
          placeholder="请选择员工"
          filterable
          clearable
          style="margin-right: 8px; width: 150px;"
          @change="handleSearch"
        >
          <el-option
            v-for="(item, index) in ownerList"
            :key="index"
            :label="item.ownerName"
            :value="item.ownerId"
          />
        </el-select>
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
      <!-- <el-table-column  label="姓名" prop="saleCount" align="center"/> -->
      <el-table-column label="姓名" width="80" align="center">
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
      <el-table-column label="首咨跟进条数" align="center">
        <template slot-scope="scope">
          {{ scope.row.count11 }}
        </template>
      </el-table-column>
      <el-table-column label="轮转跟进条数" align="center">
        <template slot-scope="scope">
          {{ scope.row.count22 }}
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
import { usertabList } from '@/api/user'
import { clueUsers } from '@/api/clue'
import { getCurrentTime } from '@/utils/tool'

export default {
  data() {
    return {
      tableList: [
      ],
      dateTime: new Date(),
      listLoading: false,
      searchSelectId: '',
      ownerList: []
    }
  },
  created() {
    clueUsers({}).then(response => {
      this.ownerList = response.data.map(item => ({
        ownerName: item.userCnName || '暂无中文名',
        ownerId: item.id
      }))
      this.ownerList = [{
        ownerName: '所有',
        ownerId: '-1'
      }].concat(this.ownerList)
      this.searchSelectId = response.data[0].id
      this.fetchData()
    })
  },
  methods: {
    fetchData() {
      const endTime = getCurrentTime(this.dateTime)
      this.listLoading = true
      const req = {
        startTime: `${endTime.slice(0, 10)} 00:00:00`,
        endTime: `${endTime.slice(0, 10)} 23:59:59`
      }
      if (this.searchSelectId !== '-1') {
        req.userId = this.searchSelectId
      }
      usertabList(req).then(response => {
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
