<template>
  <!-- 导航网格已隐藏 -->
  <!-- <div :class="DIFF_HOME_BANNER.includes(_getConfig('_APP_ENV')) ? 'main mainEbc' : 'main'">
    <div
      class="item"
      v-for="item in menuList"
      :key="item.img"
      @click="routeLink(item.linkUrl, item.flag)"
    >
      <image-load :filePath="item.imgUrl" :name="item.img" class="itemImg" />
      <div class="itemName text-ellipsis2">
        {{ _t18(`${item.key}`, ['robinhood2']) }}
      </div>
    </div>
  </div> -->
  
  <!-- 充值按钮已隐藏 -->
  <!-- <div class="linkList">
    <div class="linkLeft">
      <div class="item rightItem" @click="toRecharge">
        <div class="right">
          <div class="top">{{ _t18(`home_recharge`, ['latcoin', 'aams', 'robinhood2']) }}</div>
          <div class="subtitle">Support</div>
          <div class="subtitle">BTC USDT ETH</div>
        </div>
      </div>
    </div>
    <InfoPopup :show="showInfoPopup" :data="infoData" @closeBtn="closeBtn"></InfoPopup>
    <van-popup v-model:show="showNotice" round closeable>
      <div class="showNoticeContent">
        <p class="showNoticeContent_title fw-bold">
          {{ showNoticeContent?.noticeTitle || '' }}
        </p>
        <div class="showNoticeContent_content">
          <image-load :filePath="showNoticeContent?.imgUrl" v-if="showNoticeContent?.imgUrl" />
        </div>
      </div>
    </van-popup>
  </div> -->
</template>
<script setup>
import { DIFF_RECHARGE_COSTORM, DIFF_HOME_BANNER } from '@/config/index'
import { publiceNotice } from '@/api/common/index'
import { onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/index.js'
import { useUserStore } from '@/store/user/index'
import { getInfo } from '@/api/info.js'
import { noticeList } from '@/api/common/index'
import { _t18, _toView } from '@/utils/public'
import InfoPopup from '@/views/home/components/InfoPopup.vue'
import { dispatchCustomEvent } from '@/utils'

const mainStroe = useMainStore()
const userStore = useUserStore()
const tokenStatus = ref(userStore.isSign)
const $router = useRouter()
// DeFi挖矿 质押挖矿 助力货 闪兑 下载中心 推广中心 秒合约 理财 申购 直播 福利活动
const menuList = computed(() => {
  let tempData = mainStroe.getJinGangList.filter((item) => {
    return item.isOpen == true
  })
  return tempData
})
const currentNotice = ref('')
const routeLink = (link) => {
  if (link === 'live' && showNoticeContent.value) {
    // showNotice.value=true
    getOpenPopupContent()
  } else if (link === '/trade') {
    mainStroe.setTradeStatus(Number(0))
    $router.push(link)
  } else if (link.includes('http')) {
    location.href = link
  } else {
    $router.push(link)
  }
}
const showInfoPopup = ref(false)
const closeBtn = () => {
  showInfoPopup.value = false
}
const infoData = ref([])
/**
 * 用户信息改变监听回调事件
 * @param {*} e
 */
const event_userInfoChange = (e) => {
  getInfoList()
}

const getInfoList = async () => {
  if (tokenStatus.value) {
    let res = await getInfo()
    if (res.code == '200' && res.rows.length > 0) {
      console.log(res.rows)
      infoData.value = res.rows
      showInfoPopup.value = true
    }
  }

  // getInfo().then((res) => {
  //   if (res.code == 200) {
  //     infoData.value = res.rows
  //     showInfoPopup.value = true
  //   }
  // })
}
getInfoList()
/**直播弹窗内容 */
const showNotice = ref(false)
const showNoticeContent = ref({})
const getOpenPopupContent = async () => {
  const res = await publiceNotice('POP_UPS_NOTICE', 'DEFI_POP_UPS_NOTICE')
  if ((res.code = '200')) {
    if (res.data.length) {
      showNotice.value = true
      showNoticeContent.value = res.data[0]
    }
  }
}
onMounted(async () => {
  try {
    const res = await noticeList('ROLL_NOTICE')
    if (res.code === 200) {
      if (res.data.length > 0 && res.data[0].status == '0')
        currentNotice.value = res.data[0].noticeContent
    }
  } catch (error) {}
  document.addEventListener('event_userInfoChange', event_userInfoChange)
  // getInfoList()
})

onUnmounted(() => {
  document.removeEventListener('event_userInfoChange', event_userInfoChange)
})
/**
 * 点击快捷充币
 */
const toRecharge = () => {
  if (DIFF_RECHARGE_COSTORM.includes(__config._APP_ENV)) {
    if (tokenStatus.value) {
      dispatchCustomEvent('event_serviceChange')
    } else {
      _toView('/sign-in')
    }
  } else {
    _toView('/recharge')
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding: 10px 0 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-3px);
    }

    .itemImg {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(64, 105, 231, 0.2));
      padding: 8px;
      border: 1px solid rgba(64, 105, 231, 0.3);
      box-shadow: 0 2px 8px rgba(64, 105, 231, 0.2);
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 0 15px rgba(64, 105, 231, 0.5);
        transform: scale(1.1);
      }
    }

    .itemName {
      margin-top: 8px;
      font-size: 11px;
      color: var(--ex-default-font-color);
      text-align: center;
      width: 80px;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: 'DINOT-Medium', 'Arial', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      letter-spacing: 0.5px;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
    }
  }
}

.mainEbc {
  padding-top: 0;
}

.notice {
  padding: 0;
  width: 100%;

  .itemNo {
    display: flex;
    height: 30px;
    align-items: center;
    background: var(--ex-home-notice-bgcolor);
    border-radius: 0;
    width: 100%;

    .noticeImg {
      margin-left: 12px;
      width: 16px;
      height: 16px;
    }

    :deep(.van-notice-bar) {
      height: 30px;
      padding: 0 12px 0 8px;
      width: 100%;
    }

    .currentNotice {
      flex: 1;
      border-radius: 0;
      font-size: 12px;
      color: var(--ex-home-notice-color);
      background: var(--ex-home-notice-bgcolor);
    }
  }
}

.linkList {
  padding: 20px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .linkLeft {
    min-height: 55px;
    flex: 1;
    width: 100%;
    display: flex;
    gap: 12px;

    .item {
      flex: 1;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      border-radius: 12px;
      padding: 15px 20px;
      background: linear-gradient(135deg, rgba(31, 35, 41, 0.9), rgba(26, 26, 26, 1));
      border: 1px solid rgba(64, 105, 231, 0.3);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 0 15px rgba(64, 105, 231, 0.4);
        transform: translateY(-2px);
      }

      .leftImg {
        width: 24px;
        height: 24px;
        margin-right: 15px;
        margin-top: 2px;
        filter: drop-shadow(0 0 5px rgba(64, 105, 231, 0.5));
      }

      .right {
        font-size: 12px;
        color: #888888;

        .top {
          font-size: 18px;
          font-weight: bold;
          color: var(--ex-home-font-color);
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }
      }
    }

    .rightItem {
      margin-left: 0px;
      width: 100%;
      height: 110px;
      background: linear-gradient(135deg, rgba(31, 35, 41, 0.9), rgba(26, 26, 26, 1));
      background-image: url('/resource/images/light/bg.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border: 1px solid rgba(64, 105, 231, 0.3);

      .right {
        .top {
          font-size: 18px;
          font-weight: bold;
          color: rgb(240, 185, 11);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 0 8px rgba(240, 185, 11, 0.5);
        }
        .subtitle {
          font-size: 14px;
          color: #888888;
          line-height: 1.4;
          margin-top: 6px;
        }
      }
    }
  }

  .linkRight {
    max-width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: var(--ex-default-font-color);
    margin-left: 10px;

    .itemImg {
      width: 22px;
      height: 22px;
      margin-bottom: 5px;
    }
  }
}
.showNoticeContent {
  min-width: 300px;
  text-align: center;
  .showNoticeContent_title {
    font-size: 18px;
    padding: 15px 0;
    border-bottom: 1px solid #e1e1e1;
    font-weight: normal;
  }
  .showNoticeContent_content {
    padding: 20px 15px 30px;
    max-height: 400px;
  }
}
</style>