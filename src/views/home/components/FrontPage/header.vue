<!-- 首页 -->
<template>
  <div>
    <van-popup v-model:show="show" position="left" class="sidebar" @close="closeSideBar">
      <SideBar @closeSideBar="closeSideBar"></SideBar>
    </van-popup>
    <!-- 顶部导航 -->
    <div class="top">
      <div @click="$router.push('/home')">
        <Logo></Logo>
      </div>
      <div>
        <button
          class="serviceBtn"
          @click="openService"
          :title="'客服'"
          :aria-label="'客服'"
        >
          <img src="/resource/images/light/kefu.svg" class="serviceIcon" />
        </button>
        <img src="/resource/images/light/avatar.png" class="rightImg" @click="openSideBar" />
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-box" @click="toSearch">
        <svg-load name="sousuo" class="search-icon"></svg-load>
        <span class="search-placeholder">{{ _t18('search_placeholder') }}</span>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="carousel">
      <van-swipe :autoplay="3000" lazy-render :loop="true" :show-indicators="true">
        <van-swipe-item v-for="(item, index) in carouselList" :key="index">
          <image-load :filePath="item.imgUrl" alt="" class="carouselItem" @click="linkto(item)" />
        </van-swipe-item>
      </van-swipe>
    </div>
    
    <!-- 充值提现按钮 -->
    <div class="quick-actions">
      <div class="action-item recharge" @click="toRecharge">
        <img src="/resource/svg/light/recharge.jpg" class="action-icon" alt="recharge" />
        <span class="action-text">{{ _t18('recharge') }}</span>
      </div>
      <div class="action-item withdraw" @click="toWithdraw">
        <img src="/resource/svg/light/withdraw.jpg" class="action-icon" alt="withdraw" />
        <span class="action-text">{{ _t18('withdraw') }}</span>
      </div>
    </div>
  </div>
  <!-- 公告 -->
  <div class="notice" v-if="currentNotice">
    <div class="itemNo">
      <img src="/resource/images/light/notice.png" class="noticeImg" />
      <van-notice-bar class="currentNoticeBar" :text="currentNotice" :scrollable="shouldScroll(currentNotice)" speed="50" />
    </div>
  </div>

  <!--<div class="currentList">-->
  <!--  <div-->
  <!--    class="item centerItem"-->
  <!--    v-for="(item, index) in dataList"-->
  <!--    :key="index"-->
  <!--    @click="linkTo(item)"-->
  <!--  >-->
  <!--      <div class="itemTop fw-num">{{ item.showSymbol }}</div>-->
  <!--    <div-->
  <!--      :class="[-->
  <!--        _isRFD(-->
  <!--          tradeStore.allCoinPriceInfo[item.coin]?.openPrice,-->
  <!--          tradeStore.allCoinPriceInfo[item.coin]?.close-->
  <!--        ),-->
  <!--        'itemMain fw-num'-->
  <!--      ]"-->
  <!--    >-->
  <!--      {{ tradeStore.allCoinPriceInfo[item.coin]?.close }}-->
  <!--    </div>-->
  <!--    <div-->
  <!--      :class="[-->
  <!--        _isRFD(-->
  <!--          tradeStore.allCoinPriceInfo[item.coin]?.openPrice,-->
  <!--          tradeStore.allCoinPriceInfo[item.coin]?.close-->
  <!--        ),-->
  <!--        'rfd-sign itemFooter fw-num'-->
  <!--      ]"-->
  <!--    >-->
  <!--      {{ tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%-->
  <!--    </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <!--</div>-->
</template>
<script setup>
import { useTradeStore } from '@/store/trade/index'
import { useMainStore } from '@/store/index.js'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { publiceNotice, noticeList } from '@/api/common/index'
import { computed } from 'vue'
import { _t18 } from '@/utils/public'
import SideBar from '@/views/home/sidebar/index.vue'
import { dispatchCustomEvent } from '@/utils'
const show = ref(false)
const openSideBar = () => {
  show.value = true
}
const openService = () => {
  dispatchCustomEvent('event_serviceChange')
}
const closeSideBar = () => {
  show.value = false
}
const tradeStore = useTradeStore()
const mainStroe = useMainStore()
const $router = useRouter()

const dataList = computed(() => {
  // let tempFilterKey = Object.keys(tradeStore.allCoinPriceInfo)
  //   .filter((key) => tradeStore.allCoinPriceInfo[key]?.priceChangePercent > 0)
  //   .slice(0, 3)
  let tempData = []
  let tempFilterKey = mainStroe.getHomeCoinList.map((item) => {
    if (item.isOpen == 'true') {
      return item.coin
    }
  })
  // let tempData = tradeStore.secondContractCoinList.filter((elem) =>
  //   tempFilterKey.includes(elem.coin)
  // )
  tempFilterKey.forEach((elem) => {
    tradeStore.secondContractCoinList.forEach((elem2) => {
      if (elem2.coin == elem) {
        tempData.push(elem2)
      }
    })
  })
  return tempData
})

const linkTo = (item) => {
  mainStroe.setTradeStatus(Number(0))
  $router.push(`/trade?symbol=${item.coin}`)
}

/**
 * 跳转到搜索页面
 */
const toSearch = () => {
  $router.push('/quote')
}

/**
 * 跳转到充值页面
 */
const toRecharge = () => {
  $router.push('/recharge')
}

/**
 * 跳转到提现页面
 */
const toWithdraw = () => {
  $router.push('/withdraw')
}

const carouselList = ref([])
// 公告
const currentNotice = ref('')
const shouldScroll = (txt) => {
  return true // 始终启用滚动
}
// 轮播图跳转
const linkto = (detail) => {
  if (detail.noticeContent && detail.noticeContent !== '<p><br></p>') {
    $router.push(`/broadcastDetails?id=${detail.noticeId}`)
  } else {
    $router.push(`${detail.detailUrl}`)
  }
}

onMounted(async () => {
  try {
    const res = await publiceNotice('ACTIVITY_NOTICE', 'HOME_ACTIVITY ')
    if (res.code === 200) {
      carouselList.value = res.data.filter((item) => {
        return item.status != '1'
      })
    }
  } catch (error) {}
  // 拉取滚动公告
  try {
    const res2 = await noticeList('ROLL_NOTICE')
    if (res2.code === 200 && res2.data.length > 0 && res2.data[0].status == '0') {
      currentNotice.value = res2.data[0].noticeContent
    }
  } catch (e) {}
})
</script>
<style lang="scss" scoped>
:deep(.sidebar) {
  margin-top: -1px;
  max-width: var(--ex-max-width);
  width: 100%;
  left: auto;
  height: 100%;
}

.carousel {
  margin: 8px;
  border-radius: 8px;
  overflow: hidden;

  .carouselItem {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
}

// 快捷操作按钮（充值提现）
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 15px 12px;
  gap: 12px;

  .action-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(31, 35, 41, 0.9), rgba(26, 26, 26, 1));
    border: 1px solid rgba(64, 105, 231, 0.3);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

    &:active {
      transform: scale(0.98);
      opacity: 0.9;
    }

    .action-icon {
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
      object-fit: contain;
    }

    .action-text {
      font-size: 14px;
      font-weight: 600;
      color: var(--ex-default-font-color);
      letter-spacing: 1px;
    }

    &.recharge {
      border-color: rgba(240, 185, 11, 0.4);
      background: linear-gradient(135deg, rgba(240, 185, 11, 0.1), rgba(31, 35, 41, 0.9));
    }

    &.withdraw {
      border-color: rgba(64, 105, 231, 0.4);
      background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(31, 35, 41, 0.9));
    }
  }
}

/* 公告样式（优化版） */
.notice {
  padding: 8px 12px;
  width: 100%;
  .itemNo {
    display: flex;
    height: 40px;
    align-items: center;
    background: linear-gradient(135deg, rgba(31, 31, 31, 0.9), rgba(26, 26, 26, 1));
    border: 1px solid rgba(64, 105, 231, 0.3);
    border-radius: 12px;
    width: 100%;
    padding: 0 16px;
    gap: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    .noticeImg {
      width: 18px;
      height: 18px;
      flex: none;
      filter: drop-shadow(0 0 5px rgba(64, 105, 231, 0.5));
    }
    :deep(.van-notice-bar) {
      flex: 1;
      height: 40px;
      padding: 0;
      width: 100%;
      background: transparent !important;
    }
    :deep(.van-notice-bar__left-icon) {
      display: none;
    }
    :deep(.van-notice-bar__wrap) {
      padding: 0;
    }
    .currentNoticeBar {
      font-size: 13px;
      letter-spacing: 0.2px;
      color: #ffffff !important;
      font-weight: 500;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
    }
  }
}

.top {
  height: 52px;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 50%, #121212 100%);
  padding: 15px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  box-sizing: border-box;
  box-shadow: 0 2px 20px rgba(64, 105, 231, 0.15);
  border-bottom: 1px solid rgba(64, 105, 231, 0.2);
  /* 减去两侧的间距 */
  .leftImg {
    width: 25px;
    height: 25px;
  }

  .centerImg {
    width: 56px;
    height: 14px;
    margin-left: 5px;
  }

  .rightImg {
    width: 33px;
    height: 33px;
    border-radius: 50%;
    border: 1px solid rgba(64, 105, 231, 0.3);
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 0 15px rgba(64, 105, 231, 0.5);
      transform: scale(1.05);
    }
  }
  /* 右侧容器与头像对齐 */
  > div:last-child {
    display: flex;
    align-items: center;
  }
  .serviceBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 33px;
    margin-right: 10px;
    border: 1px solid rgba(64, 105, 231, 0.3);
    border-radius: 8px;
    box-sizing: border-box;
    background: rgba(64, 105, 231, 0.05);
    color: var(--ex-default-font-color);
    font-size: 12px;
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 0 15px rgba(64, 105, 231, 0.5);
      background: rgba(64, 105, 231, 0.1);
      transform: scale(1.05);
    }
  }
  .serviceIcon {
    width: 33px;
    height: 33px;
    margin-right: 0;
  }
}

// 搜索框区域
.search-section {
  position: fixed;
  top: 52px;
  left: 0;
  width: 100%;
  z-index: 998;
  padding: 10px 12px;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  box-sizing: border-box;

  .search-box {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: rgba(31, 35, 41, 0.8);
    border: 1px solid rgba(64, 105, 231, 0.2);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      background: rgba(31, 35, 41, 1);
      border-color: rgba(64, 105, 231, 0.4);
    }

    .search-icon {
      font-size: 18px;
      color: #888888;
      margin-right: 10px;
    }

    .search-placeholder {
      font-size: 14px;
      color: #888888;
      flex: 1;
    }
  }
}

// 添加轮播图容器样式
:deep(.van-swipe) {
  margin-top: 114px;  // 为顶部导航栏和搜索框留出空间
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
}

// 轮播图图片样式
:deep(.van-swipe-item) {
  height: 100%;
  width: 100%;
}

:deep(.carouselItem) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

// 指示点样式
:deep(.van-swipe__indicators) {
  bottom: 15px;
}

:deep(.van-swipe__indicator) {
  width: 8px;
  height: 3px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

:deep(.van-swipe__indicator--active) {
  width: 24px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(64, 105, 231, 0.8), rgba(64, 105, 231, 1));
  box-shadow: 0 0 10px rgba(64, 105, 231, 0.6);
}

// 自定义涨跌幅颜色
.rise {
  color: #1cad90 !important;
  text-shadow: 0 0 8px rgba(28, 173, 144, 0.5);
}

.fall {
  color: var(--ex-rfd-fall) !important;
  text-shadow: 0 0 8px rgba(223, 22, 61, 0.5);
}

.currentList {
  margin: 6px 8px;
  background: linear-gradient(135deg, rgba(31, 35, 41, 0.8), rgba(31, 35, 41, 1));
  border: 1px solid rgba(64, 105, 231, 0.3);
  border-radius: 12px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 16px 0;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);

  .item {
    flex: 0 0 auto;
    min-width: 25%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-2px);
    }

    .itemTop {
      font-size: 14px;
      color: var(--ex-default-font-color);
      font-weight: bold;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
    }

    .itemMain {
      margin-top: 5px;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: var(--ex-default-font-color);
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
    }

    .itemFooter {
      display: flex;
      font-size: 14px;
      margin-top: 5px;
    }
  }

  .centerItem {
    justify-content: center;
    align-items: center;
  }
}

/* 隐藏滚动条（WebKit） */
.currentList::-webkit-scrollbar {
  display: none;
}
</style>
