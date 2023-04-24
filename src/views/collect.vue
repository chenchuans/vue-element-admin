<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-left">
        <el-button v-if="!isNoAdmin" type="primary" @click="dialogVisibleAdd = true">批量添加线索</el-button>
        <el-popconfirm
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确认要删除吗？"
          @onConfirm="handleDelete"
        >
          <el-button slot="reference" type="primary" :disabled="!multipleSelection.length">批量删除线索</el-button>
        </el-popconfirm>
        <el-button v-if="!isNoAdmin" type="primary" :disabled="!multipleSelection.length" @click="dialogVisibleTransfer = true">批量转移线索</el-button>
      </div>
      <h2 class="title">每小时40通次，每小时3单+，月入4万+</h2>
      <el-input v-model="searchKey" class="input" placeholder="请输入搜索内容" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
      </el-input>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
      @cell-click="rowClick"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column label="线索名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="电话号码" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="剩余时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.remainderTime }}
        </template>
      </el-table-column>
      <el-table-column label="最新跟进" align="center">
        <template slot-scope="scope">
          {{ scope.row.followUpContent }}
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ownerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟进状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">已跟进</el-tag>
          <el-tag v-else type="info">未跟进</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            style="margin-right: 10px"
            :disabled="isNoAdmin"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
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
      title="编辑线索信息"
      :visible.sync="dialogVisibleEdit"
      width="600px"
    >
      <el-form ref="form" :model="tableEditForm" label-width="80px">
        <el-form-item label="线索名称">
          <el-input v-model="tableEditForm.name" />
        </el-form-item>
        <el-form-item label="电话号">
          <el-input v-model="tableEditForm.phone" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            v-model="tableEditForm.ownerId"
            clearable
            filterable
            placeholder="请选择负责人"
          >
            <el-option
              v-for="(item, index) in ownerList"
              :key="index"
              :label="item.ownerName"
              :value="item.ownerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跟进状态">
          <el-radio-group v-model="tableEditForm.status">
            <el-radio :label="0">未跟进</el-radio>
            <el-radio :label="1">已跟进</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseEdit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="批量增加线索信息"
      :visible.sync="dialogVisibleAdd"
      width="600px"
    >
      <el-form ref="tableAddForm" :model="tableAddForm" label-width="100px">
        <el-form-item label="线索名称前缀">
          <el-input
            v-model="tableAddForm.name"
            placeholder="请输入线索名称前缀"
          />
        </el-form-item>
        <el-form-item label="电话号">
          <el-input
            v-model="tableAddForm.phone"
            type="textarea"
            placeholder="回车换行，按行分割"
            rows="4"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            v-model="tableAddForm.ownerId"
            clearable
            filterable
            placeholder="请选择负责人"
          >
            <el-option
              v-for="(item, index) in ownerList"
              :key="index"
              :label="item.ownerName"
              :value="item.ownerId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="批量转移线索"
      :visible.sync="dialogVisibleTransfer"
      width="600px"
    >
      <el-form ref="tableTransForm" :model="tableTransForm" label-width="80px">
        <el-form-item label="负责人">
          <el-select
            v-model="tableTransForm.ownerId"
            clearable
            filterable
            placeholder="请选择负责人"
          >
            <el-option
              v-for="(item, index) in ownerList"
              :key="index"
              :label="item.ownerName"
              :value="item.ownerId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTransfer = false">取 消</el-button>
        <el-button type="primary" @click="handleTransfer">确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer
      title="线索详情"
      :visible.sync="drawer"
      size="70%"
      direction="rtl"
    >
      <drawercontent
        v-if="drawer"
        :drawer-list="tableList"
        :drawer-infos="drawerInfo"
      />
    </el-drawer>
  </div>
</template>

<script>
import { clueAdd, clueDel, clueEdit, collectList, clueTrans, clueUsers, phoneAdd } from '@/api/clue'
import drawercontent from './drawercontent'

export default {
  components: {
    drawercontent
  },
  data() {
    return {
      isNoAdmin: false,
      searchKey: '',
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogVisibleTransfer: false,
      pagination: {
        page: 1,
        size: 50,
        total: 0,
        sizes: [20, 50, 100]
      },
      ownerList: [],
      multipleSelection: [], // 多选选中的项
      tableEditForm: {},
      tableAddForm: {
        phone: '',
        ownerName: '',
        name: ''
      },
      tableTransForm: {},
      tableList: [],
      listLoading: false,

      drawer: false,
      drawerInfo: {}
    }
  },
  created() {
    const { userRole = '', pagination } = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    this.isNoAdmin = userRole === 'COMMON_USER'
    this.pagination = pagination
    this.fetchData()
    clueUsers({}).then(response => {
      this.ownerList = response.data.map(item => ({
        ownerName: item.userCnName || '暂无中文名',
        ownerId: item.id
      }))
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const { pagination } = this
      const { page, size } = pagination

      collectList({
        page,
        size,
        phone: this.searchKey
      }).then(response => {
        this.tableList = response.data.data
        this.pagination.total = response.data.total
        this.listLoading = false
      })
    },
    handleSearch() {
      this.fetchData()
    },
    handleEdit(row) {
      this.tableEditForm = JSON.parse(JSON.stringify(row))
      this.dialogVisibleEdit = true
    },
    handleCloseEdit() {
      const { name, ownerId, phone, status, id } = this.tableEditForm
      // 调用编辑接口
      clueEdit({
        name,
        ownerId,
        ownerName: this.ownerList.find(item => item.ownerId === ownerId).ownerName,
        status,
        phone,
        id
      }).then(response => {
        this.dialogVisibleEdit = false
        this.fetchData()
      })
    },
    handleAdd() {
      const { name, ownerId, phone } = this.tableAddForm
      clueAdd({
        namePrefix: name,
        ownerId,
        ownerName: this.ownerList.find(item => item.ownerId === ownerId).ownerName,
        phone: phone.split('\n')
      }).then(response => {
        this.dialogVisibleAdd = false
        this.fetchData()
      })
    },
    handleDelete() {
      // 批量删除线索
      clueDel({
        ids: this.multipleSelection.map(item => item.id)
      }).then(response => {
        this.fetchData()
      })
    },
    handleTransfer() {
      // 批量修改跟进
      const { ownerId } = this.tableTransForm
      clueTrans({
        id: this.multipleSelection.map(item => item.id),
        ownerId,
        ownerName: this.ownerList.find(item => item.ownerId === ownerId).ownerName
      }).then(response => {
        this.fetchData()
        this.dialogVisibleTransfer = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    rowClick(row, column) {
      // 点击某一行时会触发
      if (column.type === 'selection' || column.label === '操作') return
      this.drawer = true
      this.drawerInfo = JSON.parse(JSON.stringify(row))
      // 上报电话
      phoneAdd({
        phone: row.phone
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
.title {
  line-height: 40px;
  color: #fe3549;
  margin: 0;
}
.app-container-top-left {
  display: flex;
  justify-content: space-between;
  justify-items: center;
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
