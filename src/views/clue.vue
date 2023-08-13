<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-left">
        <el-button v-if="!isNoAdmin" type="primary" @click="dialogVisibleAdd = true">添加</el-button>
        <el-button v-if="!isNoAdmin" type="primary" @click="dialogVisibleUpload = true">上传</el-button>
        <el-button v-if="!isNoAdmin" type="primary" style="margin-left: 20px" @click="dialogVisibleAdds = true">批量添加</el-button>
        <el-popconfirm
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确认要删除吗？"
          @onConfirm="handleDelete"
        >
          <el-button slot="reference" style="margin-left: 20px" type="primary" :disabled="!multipleSelection.length">批量删除</el-button>
        </el-popconfirm>
        <el-button v-if="!isNoAdmin" type="primary" style="margin-left: 20px" :disabled="!multipleSelection.length" @click="dialogVisibleTransfer = true">批量转移</el-button>

        <el-button v-if="!isNoAdmin" type="primary" style="margin-left: 20px" :disabled="!multipleSelection.length" @click="dialogAvgVisibleTransfer = true">平均转移</el-button>
      </div>
    </div>
    <div style="margin-bottom: 20px">
      <el-date-picker
        v-model="timeDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        style="margin-right: 8px"
        @change="handleDateChange"
      />
      <el-select
        v-model="searchFlowerType"
        placeholder="请选择跟进类型"
        clearable
        style="margin-right: 8px; width: 150px;"
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
      <el-table-column label="姓名" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="电话" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
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
      <el-table-column label="客户意向" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statusDetailString }}
        </template>
      </el-table-column>
      <el-table-column label="最新跟进" width="500" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{ scope.row.followUpContent }}
        </template>
      </el-table-column>
      <el-table-column label="跟进时间" width="100" align="center">
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
      <el-table-column class-name="status-col" label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            style="margin-right: 10px"
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
      title="编辑信息"
      :visible.sync="dialogVisibleEdit"
      width="600px"
    >
      <el-form ref="form" :model="tableEditForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="tableEditForm.name" />
        </el-form-item>
        <el-form-item label="微信号">
          <el-input
            v-model="tableEditForm.wxNum"
            placeholder="请输入微信号"
          />
        </el-form-item>
        <el-form-item label="学历">
          <el-input
            v-model="tableEditForm.edu"
            placeholder="请输入学历"
          />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input
            v-model="tableEditForm.age"
            placeholder="请输入年龄"
          />
        </el-form-item>
        <el-form-item label="报考省份">
          <el-input
            v-model="tableEditForm.address"
            placeholder="请输入报考省份"
          />
        </el-form-item>
        <el-form-item label="城市">
          <el-input
            v-model="tableEditForm.city"
            placeholder="请输入城市"
          />
        </el-form-item>
        <el-form-item label="身高">
          <el-input
            v-model="tableEditForm.height"
            placeholder="请输入"
          />
        </el-form-item>
        <!-- <el-form-item label="体重">
          <el-input
            v-model="tableEditForm.weight"
            placeholder="请输入"
          />
        </el-form-item> -->
        <!-- <el-form-item label="电话号">
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
        </el-form-item> -->
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
      title="增加信息"
      :visible.sync="dialogVisibleAdd"
      width="600px"
    >
      <el-form ref="tableAddForm" :model="tableAddForm" label-width="100px">
        <el-form-item label="姓名前缀">
          <el-input
            v-model="tableAddForm.name"
            placeholder="请输入姓名前缀"
          />
        </el-form-item>
        <el-form-item label="微信号">
          <el-input
            v-model="tableAddForm.wxNum"
            placeholder="请输入微信号"
          />
        </el-form-item>
        <el-form-item label="学历">
          <el-input
            v-model="tableAddForm.edu"
            placeholder="请输入学历"
          />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input
            v-model="tableAddForm.age"
            placeholder="请输入年龄"
          />
        </el-form-item>
        <el-form-item label="报考省份">
          <el-input
            v-model="tableAddForm.address"
            placeholder="请输入报考省份"
          />
        </el-form-item>
        <el-form-item label="城市">
          <el-input
            v-model="tableAddForm.city"
            placeholder="请输入城市"
          />
        </el-form-item>
        <!-- <el-form-item label="电话号">
          <el-input
            v-model="tableAddForm.phone"
            placeholder="请输入电话号"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            v-model="tableAddForm.ownerId"
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
          </el-select> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="批量增加信息"
      :visible.sync="dialogVisibleAdds"
      width="600px"
    >
      <el-form ref="tableAddForms" :model="tableAddForms" label-width="100px">
        <el-form-item label="数据">
          <el-input
            v-model="tableAddForms.phone"
            type="textarea"
            placeholder="回车换行，按行分割"
            rows="4"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            v-model="tableAddForms.ownerId"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdds = false">取 消</el-button>
        <el-button type="primary" @click="handleAdds">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="EXCEL上传"
      :visible.sync="dialogVisibleUpload"
      width="600px"
    >
      <el-form ref="tableAddForms" :model="tableAddForms" label-width="150px">
        <el-form-item label="上传Excel文件">
          <input type="file" @change="uploadData">
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            v-model="tableAddForms.ownerId"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleUpload = false">取 消</el-button>
        <el-button type="primary" @click="handledialogVisibleUpload">确 定</el-button>
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
import { clueAdds, clueAdd, publicDel, clueEdit, clueList, clueTrans, clueUsers, phoneAdd, clueAvgTrans, upload } from '@/api/clue'
import drawercontent from './drawercontent'
import { getNowFormatDate, defaultStartEndDate } from '@/utils/tool'

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
      searchKey: '',
      searchSelectId: '',
      searchFlowerType: '',
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogVisibleAdds: false,
      dialogVisibleTransfer: false,
      dialogAvgVisibleTransfer: false,
      dialogVisibleUpload: false,
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
        name: '',
        wxNum: '',
        edu: '',
        address: ''
      },
      tableAddForms: {
        phone: '',
        ownerName: '',
        name: ''
      },
      uploadFile: {},
      tabAvgTransForm: {},
      tableTransForm: {},
      tableList: [],
      listLoading: false,
      timeDate: [],
      drawer: false,
      drawerInfo: {}
    }
  },
  created() {
    this.timeDate = defaultStartEndDate(30)
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
      const { page, size } = this.pagination

      const req = {
        page,
        size,
        phone: this.searchKey,
        isFirstCall: 1,
        startTime: getNowFormatDate(this.timeDate[0]),
        endTime: getNowFormatDate(this.timeDate[1])
      }

      if (this.searchSelectId) {
        req.userId = this.searchSelectId
      }

      if (this.searchFlowerType) {
        req.status = this.searchFlowerType
      }

      clueList(req).then(response => {
        this.tableList = response.data.data
        this.pagination.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    handleDateChange() {
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
      const req = Object.assign(this.tableEditForm, {
        ownerName: this.ownerList.find(item => item.ownerId === this.tableEditForm.ownerId).ownerName
      })
      // 调用编辑接口
      clueEdit(req).then(response => {
        this.dialogVisibleEdit = false
        this.fetchData()
      })
    },
    handleAdd() {
      const req = Object.assign(this.tableAddForm, {
        ownerName: this.ownerList.find(item => item.ownerId === this.tableAddForm.ownerId).ownerName,
        isFirstCall: 1
      })
      clueAdds(req).then(response => {
        this.dialogVisibleAdd = false
        this.fetchData()
      })
    },
    handleAdds() {
      const req = Object.assign(this.tableAddForms, {
        ownerName: this.ownerList.find(item => item.ownerId === this.tableAddForms.ownerId).ownerName,
        isFirstCall: 1
      })
      clueAdd(req).then(response => {
        this.dialogVisibleAdds = false
        this.fetchData()
      })
    },
    uploadData(event) {
      this.uploadFile = event.target.files[0]
    },
    handledialogVisibleUpload() {
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      const ownerName = this.ownerList.find(item => item.ownerId === this.tableAddForms.ownerId).ownerName
      const paramsUrl = `ownerName=${ownerName}&isFirstCall=1&ownerId=
        ${this.tableAddForms.ownerId}`
      upload(formData, paramsUrl).then(response => {
        this.dialogVisibleUpload = false
      })
    },
    handleDelete() {
      // 批量删除
      publicDel({
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
