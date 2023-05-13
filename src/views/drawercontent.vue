<template>
  <div class="drawer">
    <el-form label-position="left" class="list" size="mini">
      <el-form-item label="线索名称：">
        <span>{{ drawerInfo.name }}</span>
      </el-form-item>
      <el-form-item label="跟进状态：">
        <span>{{ drawerInfo.status === 1 ? '已跟进' : '未跟进' }}</span>
      </el-form-item>
      <el-form-item label="手机号：">
        <span style="padding-right: 30px">{{ drawerInfo.phone }}</span>
        <el-button v-show="!isShowAllButton" size="small" style="margin-right: 30px" @click="handleCopy">复制</el-button>
        <el-button v-show="!isShowAllButton" size="small" @click="handlePhone">拨打手机</el-button>
      </el-form-item>
      <el-form-item label="负责人：">
        <span>{{ drawerInfo.ownerName }}</span>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeTabName" type="card" class="tab">
      <el-tab-pane label="跟进记录" name="flower">
        <div v-show="!isShowAllButton" class="flower">
          <el-input v-model="flowerInput" type="textarea" rows="4" placeholder="请输入点击按钮确认提交" />
          <div class="flower-btn">
            <el-button
              type="primary"
              @click="handleCloseFlower"
            >{{ btnText === '增加跟进记录' && flowerInput ? '确认添加' : btnText }}</el-button>
            <el-button
              type="primary"
              @click="handleNextClue"
            >下一条线索</el-button>
            <el-button
              type="primary"
              @click="handleCollect"
            >{{ collectStatus === 0 ? '收藏' : '取消收藏' }}</el-button>
            <el-button
              type="primary"
              @click="handlePrevClue"
            >上一条线索</el-button>
          </div>
        </div>
        <el-table
          fit
          highlight-current-row
          :data="followList"
        >
          <el-table-column label="跟进记录内容">
            <template slot-scope="scope">
              {{ scope.row.content }}
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                v-show="!isShowAllButton"
                size="small"
                style="margin-right: 10px"
                @click="handleFlowerEdit(scope.row)"
              >编辑</el-button>
              <el-popconfirm
                v-show="!isShowAllButton"
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                title="确认要删除吗？"
                @onConfirm="handleFlowerDelete(scope.row)"
              >
                <el-button slot="reference" size="small" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="operation">
        <el-table
          :data="operateList"
          fit
          highlight-current-row
        >
          <el-table-column label="操作记录">
            <template slot-scope="scope">
              {{ scope.row }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { opList, followupList, followupAdd, followupEdit, followupDel, addCollect, cancelCollect } from '@/api/cluedetail'
import { phoneAdd } from '@/api/clue'

export default {
  props: {
    drawerInfos: {
      type: Object,
      default: () => {}
    },
    drawerList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTabName: 'flower',
      drawerInfo: {},
      flowerInput: '',
      flowerId: 0,
      collectStatus: 0, // 未收藏 1 已收藏
      btnText: '增加跟进记录',
      followList: [],
      operateList: [],
      isShowAllButton: this.$route.path.includes('public')
    }
  },
  created() {
    this.drawerInfo = JSON.parse(JSON.stringify(this.drawerInfos))
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
      this.collectStatus = this.drawerInfo.star
      opList({
        clueId: this.drawerInfo.id
      }).then(response => {
        this.operateList = response.data
      })
    },
    fetchData() {
      followupList({
        clueId: this.drawerInfo.id
      }).then(response => {
        this.followList = response.data
      })
    },
    handleCopy() {
      // text是复制文本
      // 创建input元素
      const el = document.createElement('input')
      // 给input元素赋值需要复制的文本
      el.setAttribute('value', this.drawerInfo.phone)
      // 将input元素插入页面
      document.body.appendChild(el)
      // 选中input元素的文本
      el.select()
      // 复制内容到剪贴板
      document.execCommand('copy')
      // 删除input元素
      document.body.removeChild(el)
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    handlePhone() {
      // window.location.href = `tel://${this.drawerInfo.phone}`
      // 上报电话
      phoneAdd({
        phone: this.drawerInfo.phone
      })
    },
    handleNextClue() {
      const currentIndex = this.drawerList.findIndex(item => item.id === this.drawerInfo.id)
      const length = this.drawerList.length - 2
      if (currentIndex > length || currentIndex < 0) {
        this.$message({
          message: '已经是当前页面最后一条线索，请退出线索详情进入下一页！',
          type: 'info'
        })
        return
      }
      this.drawerInfo = JSON.parse(JSON.stringify(this.drawerList[currentIndex + 1]))
      this.init()
    },
    handlePrevClue() {
      const currentIndex = this.drawerList.findIndex(item => item.id === this.drawerInfo.id)
      if (currentIndex < 1) {
        this.$message({
          message: '已经是当前页面第一条线索，请退出线索详情进入上一页！',
          type: 'info'
        })
        return
      }
      this.drawerInfo = JSON.parse(JSON.stringify(this.drawerList[currentIndex - 1]))
      this.init()
    },
    // 收藏
    handleCollect() {
      if (this.collectStatus === 0) {
        addCollect({
          clueId: this.drawerInfo.id
        }).then(response => {
          this.collectStatus = 1
        })
      } else {
        cancelCollect({
          clueId: this.drawerInfo.id
        }).then(response => {
          this.collectStatus = 0
        })
      }
    },
    // ----跟进操作------
    handleFlowerDelete(row) {
      // 删除跟进
      followupDel({
        id: row.id,
        clueId: this.drawerInfo.id
      }).then(response => {
        this.fetchData()
      })
    },
    handleFlowerEdit(row) {
      // 编辑跟进
      this.btnText = '确认编辑'
      this.flowerInput = row.content
      this.flowerId = row.id
    },
    handleCloseFlower() {
      if (this.btnText !== '确认编辑') {
        followupAdd({
          content: this.flowerInput,
          clueId: this.drawerInfo.id
        }).then(response => {
          // 添加跟进记录自动将状态设置为已跟进（详情页面页面改变一下状态就行）
          this.drawerInfo.status = 1
          this.btnText = '增加跟进记录'
          this.flowerInput = ''
          this.fetchData()
        })
      } else {
        followupEdit({
          content: this.flowerInput,
          id: this.flowerId,
          clueId: this.drawerInfo.id
        }).then(response => {
          this.btnText = '增加跟进记录'
          this.flowerInput = ''
          this.fetchData()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer {
  padding-left: 20px;
}
.tab {
  margin: 20px 0;
}
.flower {
  margin: 10px;
}
.flower-input {
  width: 600px;
}
.flower-btn {
  padding-top: 20px;
  width: 400px;
  display: flex;
  justify-content: space-between;
}
</style>
