<!-- 行情页面：自选，秒合约，币币交易，U本位 -->
<template>
  <div>
    <!-- 搜索 -->
    <div class="search">
      <div class="searchBtn">
        <svg-load name="lujing3047" class="searchLeft"></svg-load>
        <input
          type="text"
          v-model.trim="searchName"
          :placeholder="_t18(`search_currency`)"
          class="searchInput"
        />
      </div>
    </div>
    <!-- tabs -->

    <div class="headerChoose">
      <van-tabs
        swipeable
        shrink
        :swipe-threshold="2"
        v-model:active="currentIndex"
        line-width="20"
        line-height="2"
        color="rgb(240, 185, 11)"
        title-active-color="rgb(240, 185, 11)"
        title-inactive-color="#5d626d"
        background="var(--ex-div-bgColor8)"
      >
        <van-tab v-for="(item, index) in headerList" :key="index" :title="item.title">
          <component :is="currentComponent" :searchName="searchName"></component>
        </van-tab>
      </van-tabs>
    </div>
    <!-- tab -->
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
import { useTradeStore } from '@/store/trade'

const tradeStore = useTradeStore()
import { computed } from 'vue'
import Optional from './components/quoteOptional.vue'
import SecondContract from './components/quoteSecondContract.vue'
import BBTrading from './components/quoteBBTrading.vue'
import Ustandard from './components/quoteUstandard.vue'
// 搜索
const searchName = ref('')
const searchBtn = () => {}
// tabs
const headerList = computed(() => {
  let tempList = mainStore.getTradeHeaderList
  return tempList
})
const currentIndex = ref(mainStore.tradeFlag + mainStore.isOption)
// 切换组件
const currentComponent = computed(() => {
  let temp = ''
  if (headerList.value[currentIndex.value].componentName == 'Optional') {
    temp = Optional
  } else if (headerList.value[currentIndex.value].componentName == 'SecondContract') {
    temp = SecondContract
  } else if (headerList.value[currentIndex.value].componentName == 'BBTrading') {
    temp = BBTrading
  } else if (headerList.value[currentIndex.value].componentName == 'Ustandard') {
    temp = Ustandard
  }
  return temp
})
watch(
  currentIndex,
  (n) => {
    mainStore.setTradeFlag(n)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
// 搜索
.search {
  padding: 20px 15px 10px;

  .searchBtn {
    height: 34px;
    background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(240, 185, 11, 0.1));
    border: 1px solid rgba(64, 105, 231, 0.3);
    border-radius: 20px 20px 20px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(64, 105, 231, 0.2);
    backdrop-filter: blur(10px);

    .searchLeft {
      width: 12px;
      height: 12px;
      margin-right: 10px;
      margin-top: -1.5px;
      filter: drop-shadow(0 0 5px rgba(240, 185, 11, 0.6));
    }

    .searchInput {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      background: transparent;
      flex: 1;
      color: var(--ex-font-color12);
      &:focus {
        outline: none;
      }
    }

    input::-webkit-input-placeholder {
      color: var(--ex-font-color12);
    }

    input::-moz-input-placeholder {
      color: var(--ex-font-color12);
    }

    input::-ms-input-placeholder {
      color: var(--ex-font-color12);
    }
  }
}
.headerChoose {
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  :deep(.van-tabs__nav) {
    background: linear-gradient(135deg, var(--ex-div-bgColor8), rgba(64, 105, 231, 0.1)) !important;
    border-bottom: 1px solid rgba(64, 105, 231, 0.2);
  }
  
  :deep(.van-tab) {
    flex: none;
    font-size: 14px;
    margin-right: 30px;
    padding: 0;
    color: var(--ex-home-list-ftcolor) !important;
    background: transparent !important;
    position: relative;
    transition: all 0.3s ease;
    &:hover {
      color: rgba(240, 185, 11, 0.8) !important;
    }
  }
  
  :deep(.van-tab--active) {
    font-weight: normal;
    color: rgb(240, 185, 11) !important;
    text-shadow: 0 0 8px rgba(240, 185, 11, 0.6);
  }
  
  :deep(.van-tabs__line) {
    background: linear-gradient(90deg, rgba(240, 185, 11, 0.8), rgba(240, 185, 11, 1)) !important;
    box-shadow: 0 0 10px rgba(240, 185, 11, 0.8);
  }
}
</style>
