<!-- 首页 -->
<template>
  <div>
    <van-popup v-model:show="show" position="right" class="sidebar" @close="closeSideBar">
      <SideBar @closeSideBar="closeSideBar"></SideBar>
    </van-popup>
    <div class="top">
      <div>
        <Logo></Logo>
      </div>
      <div>
        <button
          class="langBtn"
          @click="openLanguage"
          :title="$t('sidebar_language')"
          :aria-label="$t('sidebar_language')"
        >
          <span class="langText">{{ currentLang?.remark || $t('sidebar_language') }}</span>
          <image-load
            v-if="currentLang?.imgUrl"
            :filePath="currentLang.imgUrl"
            class="langIcon"
          />
          <svg-load
            v-else-if="currentLang?.dictValue"
            :name="currentLang?.dictValue"
            class="langIcon"
          />
          <img v-else src="/resource/images/light/language.png" class="langIcon" />
        </button>
        <img src="/resource/images/light/avatar.png" class="rightImg" @click="openSideBar" />
      </div>
    </div>
    <div class="carousel">
      <van-swipe :autoplay="3000" lazy-render :loop="true" :show-indicators="false">
        <van-swipe-item v-for="(item, index) in carouselList" :key="index">
          <image-load
            :filePath="item.imgUrl"
            alt=""
            class="carouselItem"
            @click="linkto(item.detailUrl)"
          />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 公告：移动到轮播图下方 -->
    <div class="notice" v-if="currentNotice">
      <div class="itemNo">
        <img src="/resource/images/light/notice.png" class="noticeImg" />
        <van-notice-bar class="currentNoticeBar" :text="currentNotice" :scrollable="shouldScroll(currentNotice)" speed="50" />
      </div>
    </div>
  </div>
  <div class="currentList">
    <div
      class="item centerItem"
      v-for="(item, index) in dataList"
      :key="index"
      @click="linkTo(item)"
    >
      <div class="itemTop ff-num">{{ item.showSymbol }}</div>
      <div
        :class="[
          _isRFD(
            tradeStore.allCoinPriceInfo[item.coin]?.openPrice,
            tradeStore.allCoinPriceInfo[item.coin]?.close
          ),
          'rfd-sign itemMain ff-num'
        ]"
      >
        {{ tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%
      </div>
      <div
        :class="[
          _isRFD(
            tradeStore.allCoinPriceInfo[item.coin]?.open,
            tradeStore.allCoinPriceInfo[item.coin]?.close
          ),
          'itemFooter fw-num'
        ]"
      >
        {{ tradeStore.allCoinPriceInfo[item.coin]?.close }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { useTradeStore } from '@/store/trade/index'
import { useMainStore } from '@/store/index.js'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { publiceNotice, noticeList } from '@/api/common/index'
import { computed } from 'vue'
import SideBar from '@/views/home/sidebar/index.vue'
import { dispatchCustomEvent } from '@/utils'
const show = ref(false)
const openSideBar = () => {
  show.value = true
}
const openService = () => {
  dispatchCustomEvent('event_serviceChange')
}
const openLanguage = () => {
  $router.push('/language-selection')
}
const closeSideBar = () => {
  show.value = false
}
const tradeStore = useTradeStore()
const mainStroe = useMainStore()
const $router = useRouter()

const currentLang = computed(() => {
  const list = mainStroe.languageList || []
  const lang = mainStroe.language
  return list.find((i) => i.dictValue === lang) || {}
})

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
const carouselList = ref([])
// 公告
const currentNotice = ref('')
const shouldScroll = (txt) => {
  const t = (txt || '').toString()
  return t.length > 40
}
const linkto = (detailUrl) => {
  if (detailUrl.includes('http')) {
    location.href = detailUrl
  } else {
    $router.push(`${detailUrl}`)
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
  max-width: var(--ex-max-width);
  width: 100vw;
  height: 100vh;
  right: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform right left var(--van-duration-base);
}
.top {
  height: 52px;
  background: var(--ex-default-background-color);
  border-radius: 5px;
  padding: 15px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // transform: translateX(-50%);
  // width: calc(100% - 30px); /* 减去两侧的间距 */
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
    width: 24px;
    height: 24px;
  }
  .serviceBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    padding: 0 8px;
    margin-right: 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--ex-default-font-color);
    font-size: 12px;
  }
  .serviceIcon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }
  .langIcon {
    width: 20px;
    height: 20px;
  }
  .langBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 24px;
    margin-right: 10px;
    border: none;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }
  .langText {
    font-size: 12px;
    color: var(--ex-default-font-color);
    margin-right: 6px;
    white-space: nowrap;
  }
}
.carousel {
  // height: 200px;
  padding: 0 15px;
  .carouselItem {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
}
.notice {
  padding: 6px 15px 0;
  width: 100%;
  .itemNo {
    display: flex;
    height: 32px;
    align-items: center;
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 10px;
    padding: 1px 10px;
    gap: 8px;
    width: 100%;
    .noticeImg {
      width: 18px;
      height: 18px;
      flex: none;
    }
    :deep(.van-notice-bar) {
      flex: 1;
      height: 32px;
      padding: 0;
      width: 100%;
      background: transparent !important;
    }
    :deep(.van-notice-bar__left-icon) { display: none; }
    :deep(.van-notice-bar__wrap) { padding: 0; }
    .currentNoticeBar {
      font-size: 12.5px;
      letter-spacing: 0.2px;
      color: var(--ex-home-notice-color) !important;
      font-weight: 500;
    }
  }
}
.currentList {
  margin: 15px 15px 20px;
  box-sizing: border-box;
  background-color: var(--ex-home-box-background-color);
  box-shadow: 0px 1px 10px 1px rgba(5, 5, 5, 0.1);
  border-radius: 10px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  padding: 20px 0;
  .item {
    flex: 0 0 auto;
    min-width: 25%;
    display: flex;
    flex-direction: column;
    .itemTop {
      font-size: 14px;
      color: var(--ex-default-font-color);
      font-weight: 400;
    }
    .itemMain {
      margin-top: 5px;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      .itemMainImg {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
    }
    .itemFooter {
      display: flex;
      font-size: 16px;
      margin-top: 10px;
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
