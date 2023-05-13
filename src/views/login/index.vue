<template>
  <div class="login-container">
    <div class="login-img">
      <h2>嘉晟CRM</h2>
      <img src="@/assets/login-bag.png" alt="">
    </div>
    <div class="login-form">
      <!-- 右上角切换 -->
      <div class="login-tab" @click="handleChangeLogin">
        <img v-show="currentLoginType === 'phone'" src="@/assets/account.svg" alt="">
        <img v-show="currentLoginType === 'account'" src="@/assets/phone.svg" alt="">
      </div>
      <!-- 登录模块 -->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form-wrap" auto-complete="on" label-position="left">
        <el-form-item prop="aaa">
          <div class="login-text">
            <span class="title">欢迎登录</span>
            <span class="note">无需注册，可直接使用手机登录</span>
          </div>
        </el-form-item>

        <el-form-item v-show="currentLoginType === 'account'" prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="请输入用户名"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item v-show="currentLoginType === 'account'" prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            name="请输入密码"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-form-item v-show="currentLoginType === 'phone'" prop="phone">
          <el-input
            ref="phone"
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            name="请输入手机号"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item v-show="currentLoginType === 'phone'" style="display: flex" prop="code">
          <el-input
            ref="phone"
            v-model="loginForm.code"
            placeholder="请输入验证码"
            name="请输入验证码"
            type="text"
            tabindex="1"
            auto-complete="on"
            class="input"
          />
          <el-button class="button" :disabled="!!countDown" @click.native.prevent="handleCode">{{ countDown ? `${countDown}s` : '获取验证码' }}</el-button>
        </el-form-item>
        <el-button style="width: 100%" :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCode } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      countDown: 0,
      timeIntervalId: null,
      currentLoginType: 'phone', // phone
      loginForm: {
        username: '',
        password: '',
        phone: '',
        code: ''
      },
      loginRules: {},
      loading: false
    }
  },
  methods: {
    // 手机号码正确验证
    phoneNumVerify() {
      const phone = Number(this.loginForm.phone)
      return /[1][3,4,5,6,7,8][0-9]{9}$/.test(phone)
    },
    handleChangeLogin() {
      this.currentLoginType = this.currentLoginType === 'account' ? 'phone' : 'account'
    },
    handleLogin() {
      if (this.currentLoginType === 'phone' && !this.loginForm.code) {
        this.$message({
          message: '手机号或者验证码不正确',
          type: 'error'
        })
        return
      }
      this.loading = true
      this.$store.dispatch('user/login', {
        ...this.loginForm,
        type: this.currentLoginType
      }).then(() => {
        this.$router.push({ path: '/dashboard/index' })
        this.loading = false
      }).catch((error) => {
        console.log('error', error)
        this.loading = false
      })
    },
    getCode() {
      const { phone } = this.loginForm
      getCode({
        phone
      }).then(response => {
        this.sendVerifyCode()
        this.$message({
          message: '获取成功',
          type: 'success'
        })
      })
    },
    sendVerifyCode() {
      this.countDown = 60
      this.timeIntervalId = setInterval(() => {
        this.countDown--
        // 如果减到0 则清除定时器
        if (this.countDown === 0) {
          clearInterval(this.timeIntervalId)
        }
      }, 1000)
    },
    handleCode() { // 发送验证码
      if (!this.phoneNumVerify()) { // 验证不通过
        this.$message({
          message: '手机号不符合规定',
          type: 'error'
        })
        return
      }
      this.getCode()
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -500px;
  display: flex;
  flex-direction: row;
  box-shadow: 0 18px 30px 0 rgba(192, 195, 204, 0.4);
}
.login-img {
  position: relative;
  img {
    overflow: clip;
  }
  h2 {
    width: 100%;
    position: absolute;
    top: 80px;
    text-align: center;
    color: #fff;
    font-size: 32px;
  }
}

.login-form {
  min-width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.login-form-wrap {
  width: 360px;
}

.login-tab {
  cursor: pointer;
  font-size: 50px;
  line-height: 50px;
  position: absolute;
  right: 30px;
  top: 30px;
}
.login-text {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.title {
  font-size: 28px;
  color: #252a3d;
}
.note {
  font-size: 14px;
  color: #666a77;
}

.input {
  width: 248px;
}
.code {
  width: 112px;
}
.button {
  width: 112px;
}
</style>
