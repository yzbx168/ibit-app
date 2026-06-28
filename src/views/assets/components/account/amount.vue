<template>
  <div class="userAmount">
    <div>
      <!-- 账户余额 -->
      <p>{{ _t18('asset_account', ['ebc']) }}(USDT)</p>
      <svg-load :name="showicon" class="yanjin" @click="handleYanjin"></svg-load>
      <svg-load name="refresh" class="shuaxin" @click="handleShuaxin"></svg-load>
    </div>
    <p class="userInfo fw-num">{{ _numberWithCommas(amount) }}</p>
  </div>
  <div class="currencyAbout">
    <div
      v-for="(item, index) in currencyAbout.filter((items) => {
        return items.isShow
      })"
      :key="index"
    >
      <button class="currencyBtn" @click="toRecharge(item.url)">{{ item.title }}</button>
    </div>
  </div>
</template>

<script setup>
import { dispatchCustomEvent } from '@/utils'
import { _t18, _toView } from '@/utils/public'
import { DIFF_RECHARGE_COSTORM } from '@/config/index'
const props = defineProps({
  data: {
    type: Object
  },
  amount: {
    type: String
  },
  coin: {
    type: String,
    default: 'USDT'
  },
  type: {
    type: String
  },
  showicon: {
    type: String
  }
})

const emit = defineEmits(['handleYanjin', 'handleShuaxin'])
const handleYanjin = () => {
  emit('handleYanjin')
}
const handleShuaxin = () => {
  emit('handleShuaxin')
}

const currencyAbout = computed(() => {
  let list = []
  // {
  //         icon: 'asset_ganggan',
  //         title: _t18('trade_tab5', ['paxpay']),
  //         url: '/tradeU',
  //         isShow: true
  //       }
  if (props.type == '平台资产') {
    if (['paxpay', 'aams'].includes(__config._APP_ENV)) {
      list = [
        {
          icon: 'chongbi',
          title: _t18('asset_recharge', ['aams']),
          url: '/recharge',
          isShow: true
        }, //充币 //杠杆
        { icon: 'tibi', title: _t18('asset_withdraw', ['aams']), url: '/withdraw', isShow: true }, //提币 ,
        { icon: 'dui', title: _t18('asset_swap'), url: '/swap', isShow: true }, //闪兑
        // {icon: 'asset_licai',title: _t18('financial', ['paxpay']),url: '/financial',isShow: true}, //理财
        { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: false }, //助力贷
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true } //划转
      ]
    } else if (['coinmarketcap'].includes(__config._APP_ENV)) {
      list = [
        {
          icon: 'chongbi',
          title: _t18('asset_recharge', ['coinmarketcap']),
          url: '/recharge',
          isShow: true
        },
        {
          icon: 'tibi',
          title: _t18('asset_withdraw', ['coinmarketcap']),
          url: '/withdraw',
          isShow: true
        },
        { icon: 'dui', title: _t18('asset_swap'), url: '/swap', isShow: true },
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/loan', isShow: true }
      ]
    } else {
      list = [
        {
          icon: 'chongbi',
          title: _t18('asset_recharge', ['latcoin']),
          url: '/recharge',
          isShow: true
        }, //充币
        {
          icon: 'tibi',
          title: _t18('asset_withdraw', ['latcoin']),
          url: '/withdraw',
          isShow: true
        }, //提币
        { icon: 'dui', title: _t18('asset_swap'), url: '/swap', isShow: true }, //闪兑
        { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: false }, //助力贷
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true } //划转
      ]
    }
  } else {
    if (['paxpay'].includes(__config._APP_ENV)) {
      list = [
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true }
        // { icon: 'chongbi', title: '充币', url: '/recharge', isShow: true },
        // { icon: 'tibi', title: '提币', url: '/withdraw', isShow: true },
        // { icon: 'dui', title: '闪兑', url: '/swap', isShow: true },
        // { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: true },
      ]
    } else {
      list = [
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true },
        // { icon: 'chongbi', title: '充币', url: '/recharge', isShow: true },
        // { icon: 'tibi', title: '提币', url: '/withdraw', isShow: true },
        // { icon: 'dui', title: '闪兑', url: '/swap', isShow: true },
        { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: true }
      ]
    }
  }

  return list
})
/**
 * 点击快捷充币
 */
const toRecharge = (url) => {
  _toView(url)
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.userAmount {
  padding: 30px 15px;
  background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(240, 185, 11, 0.1));
  border: 1px solid rgba(64, 105, 231, 0.3);
  border-radius: 12px;
  margin: 15px;
  box-shadow: 0 4px 15px rgba(64, 105, 231, 0.2);
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    .yanjin {
      font-size: 14px;
      margin-left: 15px;
      margin-right: 15px;
      filter: drop-shadow(0 0 5px rgba(64, 105, 231, 0.5));
      transition: all 0.3s ease;
      &:hover {
        transform: scale(1.1);
        filter: drop-shadow(0 0 8px rgba(64, 105, 231, 0.8));
      }
    }
    .shuaxin {
      font-size: 12px;
      filter: drop-shadow(0 0 5px rgba(64, 105, 231, 0.5));
      transition: all 0.3s ease;
      &:hover {
        transform: rotate(180deg);
        filter: drop-shadow(0 0 8px rgba(64, 105, 231, 0.8));
      }
    }
    p {
      font-size: 14px;
      color: var(--ex-passive-font-color);
    }
  }
  & > p {
    font-size: 30px;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(64, 105, 231, 0.5);
    transition: all 0.3s ease;
  }
}
.currencyAbout {
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(240, 185, 11, 0.1));
  border: 1px solid rgba(64, 105, 231, 0.3);
  border-radius: 12px;
  margin: 0 15px 20px;
  box-shadow: 0 4px 15px rgba(64, 105, 231, 0.2);
  & > div {
    width: 25%;
    padding: 6px; /* 增加间隔 */
  }
  .currencyBtn {
    width: 100%;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(64, 105, 231, 0.3);
    border-radius: 999px; /* 最大圆角 */
    background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(240, 185, 11, 0.1));
    color: var(--ex-default-font-color);
    font-size: 14px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(64, 105, 231, 0.2);
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(64, 105, 231, 0.4);
      border-color: rgba(64, 105, 231, 0.6);
    }
  }
  /* 第一个按钮为金色背景 */
  & > div:first-child .currencyBtn {
    background: linear-gradient(135deg, rgba(240, 185, 11, 0.8), rgba(240, 185, 11, 1));
    border-color: rgb(240, 185, 11);
    color: #000000;
    box-shadow: 0 4px 15px rgba(240, 185, 11, 0.4);
    font-weight: 500;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(240, 185, 11, 0.6);
    }
  }
}
</style>
