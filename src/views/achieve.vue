<!-- 业绩管理 -->
<template>
  <div class="app-container">
    <div class="app-container-top">
      <el-button
        size="small"
        type="primary"
        style="margin-right: 30px"
        @click="handleSearch"
      >查询</el-button>
      <el-cascader
        v-model="form.selected"
        :options="options"
        filterable
        :props="{
          checkStrictly: true,
          label: 'deptName',
          value: 'id',
          children: 'childDept'
        }"
        clearable
        style="margin-right: 30px; width: 300px;"
      />
      <el-date-picker
        v-model="form.time"
        type="daterange"
        align="right"
        unlink-panels
        :disabled="form.timeSelect"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        style="margin-right: 30px"
      />
      <span class="role">当前角色： {{ userMap[form.role] }}</span>
      <!-- <span class="role">总单量： {{  }}</span> -->
      <el-button
        type="primary"
        style="margin-left: 30px"
        @click="dialogVisibleAdd = true"
      >批量添加业绩</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="姓名" prop="userCnName" />
      <el-table-column label="时间" prop="currentDay" />
      <el-table-column label="今日单量" width="240" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.saleCount"
            :min="0"
            :max="100"
            size="small"
          />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.row)"
          >提交业绩修改</el-button>
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
      title="批量增加业绩"
      :visible.sync="dialogVisibleAdd"
      width="600px"
    >
      <el-form ref="tableAddForm" :model="tableAddForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input
            v-model="tableAddForm.rName"
            type="textarea"
            placeholder="回车换行，按行分割"
            rows="10"
          />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="tableAddForm.rTime"
            type="date"
            placeholder="开始日期"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAchieveInfo, listAchieve, updateAchieve, addAchieve } from '@/api/achieve'
import { getNowFormatDate } from '@/utils/tool'

export default {
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
      options: [],
      pagination: {},
      tableList: [],
      form: {
        selected: [],
        time: {},
        role: '',
        timeSelect: false
      },
      tableAddForm: {
        rName: '',
        rTime: new Date()
      },
      dialogVisibleAdd: false,
      userMap: {
        'SUPER_ADMIN': '总监',
        'COMMON_ADMIN': '经理',
        'SUPER_USER': '主管',
        'COMMON_USER': '员工'
      },
      listLoading: false
    }
  },
  created() {
    this.pagination = JSON.parse(localStorage.getItem('loginInfo') || '{}').pagination
    getAchieveInfo({}).then(response => {
      const { deptInfo, role, timeSelect, endTime, startTime } = response.data
      this.options = deptInfo
      this.form = {
        selected: [deptInfo[0].id],
        time: [startTime, endTime],
        role,
        timeSelect
      }
      this.fetchData()
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const { page, size } = this.pagination
      const { time, selected } = this.form
      const deptId = selected[selected.length - 1]
      let rank
      const findRank = (list) => {
        list.forEach(item => {
          if (item.id === deptId) {
            rank = item.rank
            return
          }
          Array.isArray(item.childDept) && findRank(item.childDept)
        })
      }
      findRank(this.options)

      listAchieve({
        page,
        size,
        deptId,
        rank,
        startTime: getNowFormatDate(time[0]),
        endTime: getNowFormatDate(time[1])
      }).then(response => {
        this.tableList = response.data.data
        this.pagination.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      const { rTime, rName } = this.tableAddForm
      addAchieve({
        rTime: getNowFormatDate(rTime),
        rName: rName.split('\n')
      }).then(response => {
        this.dialogVisibleAdd = false
        this.fetchData()
      })
    },
    handleSearch() {
      this.fetchData()
    },
    handleEdit(row) {
      updateAchieve({
        id: row.id,
        saleCount: row.saleCount
      }).then(response => {
        this.fetchData()
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
  margin-bottom: 20px;
}
.input {
  width: 300px;
}
.pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
.role {
  margin-right: 20px;
  font: 20px/2 '';
}
</style>
