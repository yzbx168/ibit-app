<template>
  <div class="assetDetails">
    <div v-for="(item, index) in assetDetails" :key="index">
      <div class="title" v-if="item.icon == 'usdt'">
        <!-- 资产明细 -->
        <div class="left fw-bold">{{ _t18('asset_detail', ['ebc']) }}</div>
      </div>
      <div class="details">
        <div class="top">
          <img
            class="currencyIcon"
            :src="`/resource/svg/light/${item.icon}.svg`"
            :alt="item.title"
            width="20"
            height="20"
            style="margin-right: 5px; border-radius: 100%;"
          />
          <p class="fw-num">{{ item.title }}</p>
        </div>
        <div class="bottom">
          <div>
            <!-- 可用 -->
            <p class="til">{{ _t18('asset_available') }}</p>
            <p class="num fw-num">
              {{ amountFormat(item.keyong) }}
            </p>
          </div>
          <div>
            <!-- 占用 冻结-->
            <p class="til" v-if="['rxce'].includes(_getConfig('_APP_ENV'))">
              {{ _t18('asset_cold') }}
            </p>
            <p class="til" v-else>{{ _t18('asset_occupation', ['bitmake', 'ebc']) }}</p>
            <p class="num fw-num">
              {{ amountFormat(item.zhanyong, 4) }}
            </p>
          </div>
          <div>
            <!-- 折合 -->
            <p class="til">{{ _t18('asset_equivalent', ['bitmake', 'ebc']) }}(USDT)</p>
            <p class="num fw-num">
              {{ amountFormat(item.zhehe) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _hide, _t18, _numberWithCommas } from '@/utils/public.js'
import { priceFormat } from '@/utils/decimal.js'
const props = defineProps({
  assetDetails: {
    type: Object
  },
  showNum: {
    type: Boolean
  }
})

/**
 * 金额格式化
 * @param {*} amount
 * @param {*} hide
 * @param {*} decimal
 */
const amountFormat = (amount, decimal = 0) => {
  let tempVal = priceFormat(amount, decimal)
  if (props.showNum) {
    tempVal = _numberWithCommas(tempVal)
  } else {
    tempVal = _hide(tempVal)
  }
  return tempVal
}
</script>

<style lang="scss" scoped>
.assetDetails {
  padding-bottom: 100px;
  & > div {
    padding: 20px 15px;
    margin: 0 15px 15px;
    background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(240, 185, 11, 0.1));
    border: 1px solid rgba(64, 105, 231, 0.3);
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(64, 105, 231, 0.2);
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(64, 105, 231, 0.4);
      border-color: rgba(64, 105, 231, 0.6);
    }
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .left {
        color: var(--ex-font-color6);
        font-size: 16px;
        font-weight: 500;
        text-shadow: 0 0 5px rgba(64, 105, 231, 0.5);
      }
      .yanjin {
        font-size: 16px;
        filter: drop-shadow(0 0 5px rgba(64, 105, 231, 0.5));
      }
    }
    .details {
      .top {
        display: flex;
        align-items: center;
        img {
          border-radius: 100%;
          width: 20px;
          height: 20px;
          margin-right: 5px;
          box-shadow: 0 2px 8px rgba(64, 105, 231, 0.4);
        }
        .currencyIcon {
          font-size: 20px;
          margin-right: 5px;
        }
        P {
          font-size: 14px;
          color: var(--ex-font-color6);
          text-shadow: 0 0 3px rgba(64, 105, 231, 0.3);
        }
      }
      .bottom {
        display: flex;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(64, 105, 231, 0.2);
        & > div {
          flex: 1;
          text-align: center;
          .til {
            padding: 10px 0;
            color: var(--ex-passive-font-color);
            font-size: 12px;
          }
          .num {
            color: var(--ex-font-color6);
            font-size: 14px;
            font-weight: 500;
            text-shadow: 0 0 3px rgba(64, 105, 231, 0.3);
          }
          &:first-child {
            text-align: start;
          }
          &:last-child {
            text-align: end;
          }
        }
      }
    }
  }
}
</style>
