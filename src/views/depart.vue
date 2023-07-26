<!-- 部门管理 -->
<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="tableList"
      row-key="id"
      element-loading-text="Loading"
      border
      fit
      default-expand-all
      highlight-current-row
      :tree-props="{hasChildren: 'hasChildren', children: 'children' }"
    >
      <el-table-column label="部门名称" prop="deptName" width="400" />
      <el-table-column label="主管" prop="adminName" align="center" />
      <el-table-column label="所属部门" prop="pname" align="center" />
      <el-table-column class-name="status-col" label="操作" width="400">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            style="margin-right: 30px"
            @click="handleEdit(scope.row)"
          >主管设置</el-button>
          <el-button
            size="small"
            type="primary"
            style="margin-right: 30px"
            @click="openEditName(scope.row)"
          >编辑部门名称</el-button>
          <el-button
            v-if="scope.row.userAdd"
            size="small"
            @click="handleEditSetting(scope.row)"
          >下属员工设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="主管设置"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <el-form ref="form" :model="formInfo" label-width="100px">
        <el-form-item label="主管">
          <el-select v-model="formInfo.adminId" filterable placeholder="请选择主管">
            <el-option
              v-for="(item, index) in adminList"
              :key="index"
              :label="item.userCnName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑部门名称"
      :visible.sync="dialogNameVisible"
      width="400px"
    >
      <el-form ref="form" :model="formNameInfo" label-width="100px">
        <el-form-item label="部门名称">
          <el-input v-model="formNameInfo.deptName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNameClose">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="下属设置"
      :visible.sync="dialogVisibleSetting"
      width="800px"
    >
      <div class="caozuo">
        <el-button style="margin-right: 20px" type="primary" @click="handleAdd">添加</el-button>
        <el-select v-model="formInfo.adminId" filterable placeholder="请选择员工">
          <el-option
            v-for="(item, index) in adminList"
            :key="index"
            :label="item.userCnName"
            :value="item.id"
          />
        </el-select>
      </div>
      <el-table
        :data="staffList"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="员工姓名" prop="userCnName" />
        <el-table-column class-name="status-col" label="操作" align="center">
          <template slot-scope="scope">
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确认要移除吗？"
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button slot="reference" type="danger" size="small">移除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSetting = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleSetting = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editDeptAdmin, deptList, userList, addDeptStaff, delDeptStaff, listDeptStaff, editDeptName } from '@/api/user'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisibleSetting: false,
      dialogNameVisible: false,
      pagination: {},
      tableList: [],
      formInfo: {},
      formNameInfo: {},
      adminList: [],
      currentStaffId: 0,
      currentStaffRow: {},
      staffList: [],
      listLoading: false
    }
  },
  created() {
    this.fetchData()
    // 获取主管列表
    userList({
      page: 1,
      size: 10000
    }).then(response => {
      this.adminList = response.data.data
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // const { page, size } = this.pagination
      deptList({
        // page,
        // size
      }).then(response => {
        this.tableList = response.data
        // this.pagination.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
        this.tableList = []
      })
    },
    openEditName(row) {
      // 编辑名称
      this.formNameInfo = JSON.parse(JSON.stringify(row))
      this.dialogNameVisible = true
    },
    handleNameClose() {
      editDeptName({
        deptName: this.formNameInfo.deptName,
        id: this.formNameInfo.id
      }).then(response => {
        this.dialogNameVisible = false
        this.fetchData()
      })
    },
    handleEdit(row) {
      // 主管设置
      this.formInfo = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleEditSetting(row) {
      // 下属员工设置，调用接口拿到所有员工
      this.dialogVisibleSetting = true
      this.currentStaffId = row.id
      this.currentStaffRow = row
      this.getStaffList(row)
    },
    getStaffList(row) {
      listDeptStaff({
        deptId: row.id,
        userId: row.adminId
      }).then(response => {
        this.staffList = response.data
      })
    },
    handleAdd() {
      addDeptStaff({
        deptId: this.currentStaffId,
        userId: this.formInfo.adminId
      }).then(response => {
        this.getStaffList(this.currentStaffRow)
      })
    },
    handleDelete(row) {
      delDeptStaff({
        userId: row.id,
        deptId: this.currentStaffId
      }).then(response => {
        this.getStaffList(this.currentStaffRow)
      })
    },
    handleClose() {
      const { id: deptId } = this.formInfo
      editDeptAdmin({
        userId: this.formInfo.adminId, deptId
      }).then(response => {
        this.fetchData()
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.dialogVisible = false
      })
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
.caozuo {
  margin: 10px;
}
</style>
