<template>
  <div class="list">
    <div
      class="item"
      v-for="item in listArray.filter((item) => item.isOpen)"
      :key="item.icon"
      @click="toView(item)"
    >
      <!-- APP下载使用SVG图标 -->
      <svg-load v-if="item.key == 'appDownload'" name="download" class="itemImg" />
      <!-- 其他菜单项使用图片 -->
      <image-load v-else :filePath="item.logoUrl" alt="" class="itemImg" />
      <div class="itemRight">
        <!-- <div>{{ item.name }}</div> -->
        <div v-if="item.key == 'language'">{{ _t18(`language_key`) }}</div>
        <div v-else>{{ _t18(`sidebar_${item.key}`, ['bitmake', 'paxpay', 'aams']) }}</div>
        <div class="right_tip">
          <span v-if="item.key == 'primary' && userInfo.detail?.auditStatusPrimary === '1'">{{
            _t18('verified_ok')
          }}</span>
          <span v-if="item.key == 'advanced' && userInfo.detail?.auditStatusAdvanced === '1'">{{
            _t18('verified_ok')
          }}</span>
          <svg-load name="jiantou-y" class="rightImg"></svg-load>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { noticeList, getWhitePaperUrl } from '@/api/common/index'
import { useMainStore } from '@/store/index.js'
// import { getCurrentInstance } from "vue";
import { _t18, _toView } from '@/utils/public'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()

const userStore = useUserStore()
if (userStore.isSign) {
  userStore.getUserInfo()
}

// 用户信息
const { userInfo } = storeToRefs(userStore)
import { useRouter } from 'vue-router'
const router = useRouter()
// const _this = getCurrentInstance().appContext.config.globalProperties
const mainStore = useMainStore()
// 获取侧边栏列表
// mainStore.setSidebarList()
const paperUrl = ref('')
const listArray = computed(() => {
  let data = mainStore.getSidebarList
  // 添加APP下载菜单项
  const appDownloadItem = {
    key: 'appDownload',
    name: _t18('sidebar_appDownload'),
    jumpUrl: '/app',
    jumpType: 'path',
    isOpen: true
  }
  // 将APP下载添加到列表末尾
  return [...data, appDownloadItem]
})
onMounted(() => {
  getWhitePaper()
})

/**
 * 获取白皮书URL
 */
/* const getWhitePaper = async () => {
  const res = await noticeList('WHITE_PAPER')
  if (res.code == '200' && res.data.length) {
    paperUrl.value = res.data[0]?.imgUrl || ''
  }
} */
const getWhitePaper = async () => {
  const res = await getWhitePaperUrl()
  if (res.code == '200') {
    paperUrl.value = res.data.url
  }
}
const toView = (item) => {
  if (item.jumpType == 'link' && (item.key == 'paper' || item.key == 'aboutUS')) {
    window.open(paperUrl.value)
  } else if (item.jumpType == 'path') {
    // _toView(item.jumpUrl)
    if (item.key == 'advanced') {
      /**
       * 在实名认证的时候 
        1. 先判断初级认证是否打开  如果是false  就不需要初级认证    直接放行
        2.如果初级认证是true  在判断用户的初级认证状态是否等于1  如果是1 放行
       * 
      */
      const target = listArray.value.find((item) => item.key == 'primary')
      // 判断是否经过初级认证
      if (target && target.isOpen) {
        const auditStatusPrimary = userInfo.value.detail.auditStatusPrimary
        if (auditStatusPrimary && auditStatusPrimary == 1) {
          router.push(item.jumpUrl)
        } else {
          _toast('please_primary')
        }
      } else {
        router.push(item.jumpUrl)
      }
    } else {
      router.push(item.jumpUrl)
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  padding: 10px 15px;
  .item {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    &:hover {
      background: rgba(64, 105, 231, 0.1);
      box-shadow: 0 0 10px rgba(64, 105, 231, 0.3);
      transform: translateX(5px);
    }
    .itemImg {
      width: 24px;
      height: 24px;
      margin-right: 20px;
      filter: drop-shadow(0 0 5px rgba(64, 105, 231, 0.5));
    }
    .itemRight {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      font-size: 14px;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
      .rightImg {
        width: 6px;
        height: 10px;
        color: rgba(255, 255, 255, 0.6);
        transition: all 0.3s ease;
      }
    }
    &:hover .itemRight .rightImg {
      color: #4069e7;
      filter: drop-shadow(0 0 5px rgba(64, 105, 231, 0.5));
    }
  }
}
.right_tip {
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
    font-size: 12px;
    color: #4069e7;
    text-shadow: 0 0 5px rgba(64, 105, 231, 0.5);
    background: rgba(64, 105, 231, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid rgba(64, 105, 231, 0.3);
  }
}
</style>
