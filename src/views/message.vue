<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-left">
        <el-button type="primary" style="margin-left: 20px"  @click="handleAllRead">一键已读</el-button>
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
      <el-table-column label="通知" align="center">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.readType === 0"
            size="small"
            style="margin-right: 10px"
            @click="handleRead(scope.row)"
          >已读</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { messageList, setRead, setAllRead } from '@/api/user'

export default {
  data() {
    return {
      tableList: [
      ],
      listLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      messageList({
        userId: JSON.parse(window.localStorage.loginInfo).id
      }).then(response => {
        this.tableList = response.data
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
        this.tableList = []
      })
    },
    handleRead(row) {
      setRead({
        userId: JSON.parse(window.localStorage.loginInfo).id,
        noticeId: row.id
      }).then(response => {
        this.fetchData()
      })
    },
    handleAllRead() {
      setAllRead({
        userId: JSON.parse(window.localStorage.loginInfo).id,
      }).then(response => {
        this.fetchData()
      })
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
