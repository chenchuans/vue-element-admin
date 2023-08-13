<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-badge style="margin-right: 20px;" :value="noticeInfo" :max="99">
        <el-button size="small" @click="goMessage">消息未读数量</el-button>
      </el-badge>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          {{ userName }}
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getNoticeInfo, unreadCount } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      userName: JSON.parse(localStorage.getItem('loginInfo') || '{}').userName || '暂无用户名',
      noticeInfo: ''
    }
  },
  created() {
    setInterval(() => {
      this.getNoticeMessage()
      this.getUnreadCount()
    }, 10000)
  },
  methods: {
    logout() {
      localStorage.removeItem('loginInfo')
      this.$router.push('/login')
    },
    getNoticeMessage() {
      getNoticeInfo({
        userId: JSON.parse(localStorage.getItem('loginInfo') || '{}')?.id
      }).then(response => {
        response.data.map(item => this.openMessage(item.content))
      })
    },
    getUnreadCount() {
      unreadCount({
        userId: JSON.parse(localStorage.getItem('loginInfo') || '{}')?.id
      }).then(response => {
        this.noticeInfo = response.data
      })
    },
    openMessage(message) {
      if (!message) return
      this.$notify.success({
        title: '消息',
        message,
        duration: 5000,
        offset: 50
      })
    },
    goMessage() {
      this.$router.push('/message/index')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  padding-top: 10px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 50px;

      .avatar-wrapper {
        position: relative;
        font: 500 18px/1 '';

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 3px;
          font-size: 12px;
        }
      }
    }
  }
}
::v-deep .el-dropdown-menu__item--divided {
  border: none !important;
}
</style>
