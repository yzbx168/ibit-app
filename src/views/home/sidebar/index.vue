<template>
  <div class="slidebar">
    <div class="close">
      <svg-load name="guanbi" class="closeImg" @click="closeSideBar"></svg-load>
    </div>
    <UserLogin v-if="isSign"></UserLogin>
    <Navigation></Navigation>
    <!-- 未登录 -->
    <div v-if="!isSign" class="notLogged">
      <div class="btnBox" @click="_toView('/sign-in')">
        <!-- 登录 -->
        <ButtonBar :btnValue="_t18('login')" />
      </div>
      <div class="btnBox" @click="_toView('/sign-up')">
        <!-- 注册 -->
        <ButtonBar :btnReverse="false" :btnValue="_t18('register')" :btnColor="'#fff'" />
      </div>
    </div>
    <!-- 已登录 -->
    <div v-if="isSign && !userInfo.addressFlag" class="logged" @click="exit">
      <svg-load name="tuichu" class="loggedImg"></svg-load>
      <!-- 退出登录 -->
      <div>{{ _t18('layout', ['aams']) }}</div>
    </div>

    <!-- 退出弹窗 -->
    <!-- 您确定要退出登录吗 -->
    <Dialog
      v-model:value="showDialog"
      :title="``"
      :content="_t18('layout_require')"
      confirm-button-color="#4069e7"
      @cancelBtn="cancelBtn"
      @confirmBtn="confirmBtn"
      :confirmButtonText="_t18('btnConfirm', ['bitmake'])"
      :cancelButtonText="_t18('cancel')"
      z-index="200"
    ></Dialog>
  </div>
</template>
<script setup>
import { _back, _t18, _toView, _toReplace } from '@/utils/public'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { signOut } from '@/api/user'
import { useUserStore } from '@/store/user/index'
import UserLogin from '../components/Sidebar/userLogin.vue'
import Navigation from '../components/Sidebar/navigation.vue'
import Dialog from '@/components/Dialog/index.vue'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
// 判断是否登录
const isSign = ref(userStore.isSign)
/**
 * 显示弹窗
 */
const showDialog = ref(false)
// 退出登录
const exit = () => {
  showDialog.value = true
}
const confirmBtn = () => {
  showDialog.value = false
  signOut()
    .then((res) => {
      if (res.code == '200') {
        _toast('layout_success')
        // 清除token
        userStore.signOut()
        _toReplace('/')
        closeSideBar()
        isSign.value = false
        setTimeout(() => location.reload(), 10)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const cancelBtn = () => {
  showDialog.value = false
}
const emit = defineEmits(['closeSideBar'])
const closeSideBar = () => {
  emit('closeSideBar')
}
</script>
<style lang="scss" scoped>
.slidebar {
  height: 100vh;
  padding-bottom: 100px;
  overflow: auto;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  border-left: 1px solid rgba(64, 105, 231, 0.3);
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.5);
}
.close {
  padding: 20px 20px;
  display: flex;
  justify-content: flex-end;
  .closeImg {
    width: 24px;
    height: 24px;
    color: #fff;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
    transition: all 0.3s ease;
    &:hover {
      filter: drop-shadow(0 0 10px rgba(64, 105, 231, 0.5));
      transform: scale(1.1);
    }
  }
}

// 未登录
.notLogged {
  border-top: 1px solid rgba(64, 105, 231, 0.3);
  padding: 40px 20px 30px;
  .btnBox {
    margin-bottom: 16px;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 0 15px rgba(64, 105, 231, 0.5);
      transform: translateY(-2px);
    }
  }
}
// 登录
.logged {
  border-top: 1px solid rgba(64, 105, 231, 0.3);
  margin-top: 40px;
  padding: 25px 20px;
  font-size: 14px;
  color: var(--ex-font-color9);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: #4069e7;
    background: rgba(64, 105, 231, 0.1);
    box-shadow: 0 0 10px rgba(64, 105, 231, 0.3);
  }
  .loggedImg {
    width: 20px;
    height: 20px;
    margin-right: 20px;
    filter: drop-shadow(0 0 5px rgba(64, 105, 231, 0.5));
  }
  div {
    color: var(--ex-font-color9);
    transition: all 0.3s ease;
  }
  &:hover div {
    color: #4069e7;
  }
}
</style>
