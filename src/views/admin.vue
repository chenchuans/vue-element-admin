<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-left">
        <el-button type="primary" @click="handleAdd">添加用户</el-button>
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
      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="用户密码" align="center">
        <template slot-scope="scope">
          {{ scope.row.passWord }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.userPhone }}
        </template>
      </el-table-column>
      <el-table-column label="中文名" align="center">
        <template slot-scope="scope">
          {{ scope.row.userCnName }}
        </template>
      </el-table-column>
      <el-table-column label="坐席号" align="center">
        <template slot-scope="scope">
          {{ scope.row.agentNum }}
        </template>
      </el-table-column>
      <el-table-column label="用户权限" align="center">
        <template slot-scope="scope">
          {{ userMap[scope.row.userRole] }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            style="margin-right: 10px"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确认要删除吗？"
            @onConfirm="handleDelete(scope.row)"
          >
            <el-button slot="reference" type="danger" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
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

    <el-dialog
      :title="`${state === 'edit' ? '编辑' : '添加'}用户信息`"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form ref="form" :model="formInfo" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formInfo.userName" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formInfo.passWord" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInfo.userPhone" />
        </el-form-item>
        <el-form-item label="中文名">
          <el-input v-model="formInfo.userCnName" />
        </el-form-item>
        <el-form-item label="坐席号">
          <el-input v-model="formInfo.agentNum" />
        </el-form-item>
        <el-form-item label="用户权限">
          <el-radio-group v-model="formInfo.userRole">
            <el-radio
              v-for="(item, index) in userList"
              :key="index"
              :label="item.label"
            >{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userAdd, userDel, userUpdate, userList } from '@/api/user'

export default {
  data() {
    return {
      dialogVisible: false,
      pagination: {},
      tableList: [
      ],
      formInfo: {
      },
      state: 'edit',
      listLoading: false,
      userMap: {
        'SUPER_ADMIN': '总监',
        'COMMON_ADMIN': '经理',
        'SUPER_USER': '主管',
        'COMMON_USER': '员工'
      },
      userList: [
        { label: 'SUPER_ADMIN', name: '总监' },
        { label: 'COMMON_ADMIN', name: '经理' },
        { label: 'SUPER_USER', name: '主管' },
        { label: 'COMMON_USER', name: '员工' }
      ]
    }
  },
  created() {
    this.pagination = JSON.parse(localStorage.getItem('loginInfo') || '{}').pagination
    this.fetchData()

    const { userRole = '' } = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    if (userRole === 'COMMON_ADMIN') {
      this.userList = [
        { label: 'SUPER_USER', name: '主管' },
        { label: 'COMMON_USER', name: '员工' }
      ]
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const { page, size } = this.pagination
      userList({
        page,
        size
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
    handleSearch() {
      this.fetchData()
    },
    handleEdit(row) {
      this.formInfo = JSON.parse(JSON.stringify(row))
      this.state = 'edit'
      this.dialogVisible = true
    },
    handleAdd() {
      this.formInfo = {}
      this.state = 'add'
      this.dialogVisible = true
    },
    handleDelete(row) {
      userDel({
        id: row.id
      }).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    handleClose() {
      this.formInfo.agentNum = +this.formInfo.agentNum
      if (this.state === 'edit') {
        userUpdate(this.formInfo).then(response => {
          this.fetchData()
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.dialogVisible = false
        })
      } else {
        userAdd(this.formInfo).then(response => {
          this.fetchData()
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.dialogVisible = false
        })
      }
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
