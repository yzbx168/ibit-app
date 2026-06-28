<!-- 行情——>币币交易 -->
<template>
  <div>
    <Filter :list="currentCoinList" @toSort="toSort" />
    <div v-if="currentList.length" class="currentCoinListStyle">
      <CurrencyItem
        v-for="(item, index) in filterKeyCoin(currentList, searchName)"
        :key="index"
        :currencyItem="item"
        @click="linkTo(item)"
      >
      </CurrencyItem>
    </div>
  </div>
</template>

<script setup>
import { filterKeyCoin} from '@/utils/filters'
import Filter from './common/filter.vue'
import CurrencyItem from '@/components/CurrencyList/currencyItem.vue'
import { useTradeStore } from '@/store/trade'
import { onMounted } from 'vue'
const props = defineProps({
  searchName: {
    type: String
  }
})
const tradeStore = useTradeStore()
const currentCoinList = computed(() => {
  let tempList = tradeStore.spotCoinList
  return tempList
})
const currentList = ref(tradeStore.spotCoinList)
const toSort = (v) => {
  currentList.value=v
}
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/index'
const router = useRouter()
const mainStore = useMainStore()
const linkTo=(item)=>{
  mainStore.setTradeFlag(0) // 币币交易在 trade 页面的索引是 0
  router.push(`/tradeBB?symbol=${item.coin}`)
}
</script>

<style lang="scss" scoped>
.currentCoinListStyle {
  padding-bottom: 74px;
}
</style>
