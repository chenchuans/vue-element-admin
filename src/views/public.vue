<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-left">
        <!-- <el-button type="primary" v-if="!isNoAdmin" @click="dialogVisibleAdd = true">批量添加</el-button> -->
        <el-popconfirm
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确认要删除吗？"
          @onConfirm="handleDelete"
        >
          <el-button v-if="isAdmin2" slot="reference" type="primary" :disabled="!multipleSelection.length" style="margin-right: 10px">批量删除</el-button>
        </el-popconfirm>
        <el-button v-if="!isNoAdmin" type="primary" :disabled="!multipleSelection.length" @click="dialogVisibleTransfer = true">批量转移</el-button>
        <el-button v-if="!isNoAdmin" type="primary" style="margin-left: 10px" :disabled="!multipleSelection.length" @click="dialogAvgVisibleTransfer = true">平均转移</el-button>
        <el-button
          v-if="isAdmin2"
          type="primary"
          style="margin-left: 10px"
          @click="handleDownload"
        >下载</el-button>
      </div>

      <div class="aaaaaa">
        <el-date-picker
          v-model="timeDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
          :picker-options="pickerOptions"
          style="margin-right: 20px"
          @change="handleDateChange"
        />
        <el-select
          v-model="searchFlowerType"
          placeholder="请选择跟进类型"
          clearable
          style="margin-right: 8px;"
          @change="handleSearch"
        >
          <el-option
            label="已跟进"
            value="1"
          />
          <el-option
            label="未跟进"
            value="0"
          />
        </el-select>
        <el-select
          v-model="searchSelectId"
          placeholder="请选择负责人"
          filterable
          clearable
          style="margin-right: 8px;"
          @change="handleSearch"
        >
          <el-option
            v-for="(item, index) in ownerList"
            :key="index"
            :label="item.ownerName"
            :value="item.ownerId"
          />
        </el-select>
        <el-select
          v-model="searchData"
          placeholder="请选择数据类型"
          filterable
          clearable
          style="margin-right: 8px;"
          @change="handleChangeData"
        >
          <el-option
            v-for="(item, index) in dataTypeList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="detailStatusIndex"
          placeholder="请选择详细跟进状态"
          filterable
          style="margin-right: 8px;"
          @change="handleSelectDetailStatus"
        >
          <el-option
            v-for="(item, index) in detailStatusList"
            :key="index"
            :label="item"
            :value="index"
          />
        </el-select>
        <el-date-picker
          v-model="timeUpdateDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="更新开始日期"
          end-placeholder="更新结束日期"
          :picker-options="pickerOptions"
          style="margin-right: 20px"
          @change="handleDateChange"
        />
        <el-input v-model="searchKey" class="input" placeholder="请输入搜索内容" clearable>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
        </el-input>
      </div>
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
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="微信号" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.wxNum }}
        </template>
      </el-table-column>
      <el-table-column label="学历" width="50" align="center">
        <template slot-scope="scope">
          {{ scope.row.edu }}
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="50" align="center">
        <template slot-scope="scope">
          {{ scope.row.age }}
        </template>
      </el-table-column>
      <el-table-column label="报考省份" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="城市" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="电话号码" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="客户意向" align="center">
        <template slot-scope="scope">
          {{ scope.row.statusDetailString }}
        </template>
      </el-table-column>
      <el-table-column label="最新跟进" width="500" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.followUpContent }}
        </template>
      </el-table-column>
      <el-table-column label="跟进时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.followTime }}
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ownerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isFirstCall === 1" type="success">首咨数据</el-tag>
          <el-tag v-else type="info">轮转数据</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="跟进状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">已跟进</el-tag>
          <el-tag v-else type="info">未跟进</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="status-col" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.row)"
            style="margin-right: 10px"
            :disabled="isNoAdmin"
          >编辑</el-button>
        </template>
      </el-table-column> -->
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
      title="编辑信息"
      :visible.sync="dialogVisibleEdit"
      width="600px"
    >
      <el-form ref="form" :model="tableEditForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="tableEditForm.name" />
        </el-form-item>
        <el-form-item label="电话号">
          <el-input v-model="tableEditForm.phone" />

        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            v-model="tableEditForm.ownerId"
            placeholder="请选择负责人"
            clearable
            filterable
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
      title="批量增加信息"
      :visible.sync="dialogVisibleAdd"
      width="600px"
    >
      <el-form ref="tableAddForm" :model="tableAddForm" label-width="100px">
        <el-form-item label="名称前缀">
          <el-input
            v-model="tableAddForm.name"
            placeholder="请输入名称前缀"
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
      title="线索转移"
      :visible.sync="dialogAvgVisibleTransfer"
      width="600px"
    >
      <el-form ref="tableAvgTransForm" :model="tabAvgTransForm" label-width="80px">
        <el-form-item label="负责人">
          <el-select
            v-model="tabAvgTransForm.ownerId"
            clearable
            filterable
            multiple
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
        <el-button @click="dialogAvgVisibleTransfer = false">取 消</el-button>
        <el-button type="primary" @click="handleAvgVisibleTransfer">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="批量转移"
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
      title="详情"
      :visible.sync="drawer"
      size="70%"
      direction="rtl"
      :modal="false"
    >
      <drawercontent
        v-if="drawer"
        :drawer-list="tableList"
        :drawer-infos="drawerInfo"
        @drawerEdit="drawerEdit"
      />
    </el-drawer>
  </div>
</template>

<script>
import { clueAdd, publicDel, clueEdit, publicList, publicDownload, publicTrans, dataUsers, clueAvgTrans } from '@/api/clue'
import drawercontent from './drawercontent'
import { download, getNowFormatDate, defaultStartEndDate } from '@/utils/tool'

export default {
  components: {
    drawercontent
  },
  data() {
    return {
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
      isNoAdmin: false,
      isAdmin2: false,
      searchKey: '',
      searchSelectId: '',
      searchFlowerType: '',
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogVisibleTransfer: false,
      pagination: {
        page: 1,
        size: 50,
        total: 0,
        sizes: [20, 50, 100]
      },
      dataTypeList: [
        { id: -1, name: '所有' },
        { id: 1, name: '首咨数据' },
        { id: 0, name: '轮转数据' }
      ],
      searchData: -1,
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
      dialogAvgVisibleTransfer: false,
      tabAvgTransForm: {},
      timeDate: [],
      timeUpdateDate: [],
      drawer: false,
      drawerInfo: {},
      detailStatusIndex: 0,
      detailStatusList: ['所有', 'A类数据', 'B类数据', 'C类数据', 'D类数据', '停机/空号', '未接通/挂断/拒接/关机', '已成交']
    }
  },
  created() {
    const { userRole = '', pagination } = JSON.parse(localStorage.getItem('loginInfo') || '{}')
    this.isNoAdmin = userRole === 'SUPER_USER'
    this.isAdmin2 = userRole === 'SUPER_ADMIN'
    this.pagination = pagination
    this.fetchData()
    dataUsers({}).then(response => {
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

      const req = {
        page,
        size,
        type: window.location.hash.split('/')[2],
        phone: this.searchKey,
      }

      if (this.timeUpdateDate.length > 0) {
        req.updateStartTime = getNowFormatDate(this.timeUpdateDate[0])
        req.updateEndTime = getNowFormatDate(this.timeUpdateDate[1])
      }

      if (this.timeDate.length > 0) {
        req.startTime = getNowFormatDate(this.timeDate[0])
        req.endTime = getNowFormatDate(this.timeDate[1])
      }

      if (this.searchData !== -1) {
        req.isFirstCall = this.searchData
      }

      if (this.searchSelectId) {
        req.userId = this.searchSelectId
      }

      if (this.searchFlowerType) {
        req.status = this.searchFlowerType
      }

      if (this.detailStatusIndex) {
        req.statusDetail = this.detailStatusIndex
      }

      publicList(req).then(response => {
        this.tableList = response.data.data
        this.pagination.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    handleAvgVisibleTransfer() {
      // 批量修改跟进
      const { ownerId } = this.tabAvgTransForm
      clueAvgTrans({
        id: this.multipleSelection.map(item => item.id),
        ownerId
      }).then(response => {
        this.fetchData()
        this.dialogAvgVisibleTransfer = false
      })
    },
    handleDownload() {
      const { page, size } = this.pagination
      const req = {
        page,
        size,
        phone: this.searchKey,
        startTime: getNowFormatDate(this.timeDate[0]),
        endTime: getNowFormatDate(this.timeDate[1])
      }
      if (this.searchSelectId) {
        req.userId = this.searchSelectId
      }

      if (this.searchFlowerType) {
        req.status = this.searchFlowerType
      }
      publicDownload(req).then(response => {
        download(response, '公海')
      })
    },
    handleDateChange() {
      this.fetchData()
    },
    handleChangeData() {
      this.fetchData()
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
        phone, status, id,
        ownerName: this.ownerList.find(item => item.ownerId === ownerId).ownerName
      }).then(response => {
        this.dialogVisibleEdit = false
        this.fetchData()
      })
    },
    handleAdd() {
      const { name, ownerId, phone } = this.tableAddForm
      clueAdd({
        name,
        ownerName: this.ownerList.find(item => item.ownerId === ownerId).ownerName,
        phone: phone.split('\n')
      }).then(response => {
        this.dialogVisibleAdd = false
        this.fetchData()
      })
    },
    handleDelete() {
      // 批量删除
      publicDel({
        ids: this.multipleSelection.map(item => item.id),
        type: window.location.hash.split('/')[2],
      }).then(response => {
        this.fetchData()
      })
    },
    handleTransfer() {
      // 批量修改跟进
      const { ownerId } = this.tableTransForm
      publicTrans({
        id: this.multipleSelection.map(item => item.id),
        ownerId,
        type: window.location.hash.split('/')[2],
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
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.fetchData()
    },
    handleCurrentChange(page) {
      this.pagination.page = page
      this.fetchData()
    },
    handleSelectDetailStatus() {
      this.fetchData()
    },
    drawerEdit() {
      this.handleEdit(this.drawerInfo)
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
  justify-items: center;
  width: 600px;
  height: 40px;
}
.input {
  width: 300px;
}
.pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
.aaaaaa {
  height: 80px;
}
</style>
