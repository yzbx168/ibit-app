<template>
  <div class="collectItem">
    <div class="left">
      <img v-if="collectItem.icon" :src="collectItem.icon" class="leftImg" alt="" />
      <!-- <p class="fw-bold">{{ item.coin?.toUpperCase() }}</p> -->
      <div>
        <div class="topText ff-num">
          <div class="textTop fw-num">
            {{ collectItem.coin?.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="right">
          <p>{{ tradeStore.allCoinPriceInfo[`${item.coin}`]?.close }}</p>
          <p>{{ tradeStore.allCoinPriceInfo[`${item.coin}`]?.priceChangePercent }}</p>
        </div> -->
    <div class="right">
      <div class="rightLeft">
        <div class="fw-num">
          {{ priceFormat(tradeStore.allCoinPriceInfo[collectItem.coin]?.close) }}
        </div>
      </div>
      <div class="rightBox">
        <div
          :class="[
            _isRFD(
              tradeStore.allCoinPriceInfo[collectItem.coin]?.openPrice,
              tradeStore.allCoinPriceInfo[collectItem.coin]?.close
            ),
            'rfd-sign rfd-bg rightRight fw-num'
          ]"
        >
          <span>{{ tradeStore.allCoinPriceInfo[collectItem.coin]?.priceChangePercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { priceFormat } from '@/utils/decimal.js'
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()
const props = defineProps({
  collectItem: {
    type: Object
  }
})
</script>

<style lang="scss" scoped>
.collectItem {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(240, 185, 11, 0.1));
  border: 1px solid rgba(64, 105, 231, 0.3);
  border-radius: 8px;
  margin: 0 15px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(64, 105, 231, 0.3);
    border-color: rgba(64, 105, 231, 0.4);
  }

  .left {
    display: flex;
    align-items: center;
    .leftImg {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(64, 105, 231, 0.3);
    }
    .topText {
      display: flex;
      align-items: flex-end;
      font-size: 12px;
      color: var(--ex-font-color21);
      .textTop {
        color: var(--ex-font-color6);
        font-size: 14px;
        font-weight: 500;
        text-shadow: 0 0 5px rgba(64, 105, 231, 0.3);
      }
      .tip {
        margin-left: 5px;
        display: flex;
        align-items: center;
        padding: 5px;
        height: 15px;
        background: var(--ex-div-bgColor21);
        border-radius: 1px 1px 1px 1px;
        font-size: 12px;
        font-weight: 400;
        color: var(--ex-active-font-color) !important;
      }
    }
    .bottomText {
      margin-top: 4px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--ex-font-color21);
      .bottomTextNum {
        margin-left: 5px;
        color: var(--ex-font-color20s);
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .rightLeft {
      text-align: right;
      font-size: 14px;
      color: var(--ex-font-color6);
      font-weight: 500;
      text-shadow: 0 0 5px rgba(64, 105, 231, 0.3);
      .numRight {
        font-size: 12px;
        margin-top: 4px;
        color: var(--ex-font-color20);
      }
    }
    .rightBox {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .rightRight {
        max-width: 80px;
        min-width: 80px;
        height: 32px;
        margin-left: 20px;
        border-radius: 16px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        &.rfd-up {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.4));
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.4);
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }
        &.rfd-down {
          background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.4));
          color: #f44336;
          border: 1px solid rgba(244, 67, 54, 0.4);
          box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
        }
      }
    }
  }
}
</style>
