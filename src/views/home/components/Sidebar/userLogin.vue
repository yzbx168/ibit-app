<template>
  <div class="userMess" v-if="userId">
    <!-- vip等级 -->
    <div class="messLeft" v-if="showVip" @click="$router.push('')">
      <image-load filePath="defi/touxiang.png" class="userMessImg"></image-load>
      <p class="fw-num">v{{ vipClass }}</p>
    </div>
    <img src="/resource/images/light/avatar.png" class="userMessImg" v-else />
    <div class="messRight">
      <Copy :data="userId">
        <template #copyMsg>
          <div class="rightTop fw-bold">UID：{{ userId }}</div>
        </template>
      </Copy>
      <!-- 钱包地址 -->
      <div class="rightBot">
           <Copy :data="address">
      <template #copyMsg>
        <p>{{ _hideAddress(address) }}</p>
      </template>
    </Copy>
      </div>
    </div>
  </div>


</template>
<script setup>
import { _t18 } from '@/utils/public'
import Copy from '@/components/common/Copy/index.vue'
import { useUserStore } from '@/store/user/index'
import { useMainStore } from '@/store/index'
import { computed } from 'vue'
import { _hideAddress } from '@/utils/public'
// const vipClass = ref(0) //vip等级
const userStore = useUserStore()
const mainStore = useMainStore()
const userId = computed(() => userStore.userInfo.user?.userId)
const address = computed(() => userStore.userInfo.user?.address)
const userAccount = computed(() => {
  let temp = userStore.userInfo.asset?.filter((item) => {
    return item.symbol == 'usdt' && item.type == 1
  })
  return temp[0]?.availableAmount || 0
})
const showVip = ref(mainStore.getVIPClass?.isOpen)
const vipClass = computed(() => {
  let temp = 0
  let start = ''
  let end = ''
  for (let key in mainStore.getVIPClass) {
    if (userAccount.value > mainStore.getVIPClass[key]) {
      start = key
    }
    if (userAccount.value <= mainStore.getVIPClass[key]) {
      end = key
      break
    }
  }
  if (start.replace('Start', '') === end.replace('End', '')) {
    temp = start.replace('Start', '').replace('vip', '')
  }
  return temp
})
</script>
<style lang="scss" scoped>
.userMess {
  padding: 25px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(64, 105, 231, 0.3);
  .userMessImg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid rgba(64, 105, 231, 0.5);
    box-shadow: 0 0 15px rgba(64, 105, 231, 0.4);
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 0 20px rgba(64, 105, 231, 0.6);
      transform: scale(1.05);
    }
  }
  .messRight {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px 0;
    .rightTop {
      font-size: 16px;
      color: #ffffff;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
    }
    .rightBot {
      font-size: 14px;
      color: #888888;
      margin-top: 5px;
    }
  }
}
.copyName {
  margin: 15px 20px;
  background: linear-gradient(135deg, rgba(64, 105, 231, 0.1), rgba(64, 105, 231, 0.2));
  font-size: 14px;
  border-radius: 8px;
  padding: 10px 15px;
  color: #ffffff !important;
  border: 1px solid rgba(64, 105, 231, 0.3);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 0 10px rgba(64, 105, 231, 0.4);
  }
}

.vipClass {
  font-size: 14px;
  color: var(--ex-passive-font-color);
  .senLeftImg {
    font-size: 20px;
  }
}
.messLeft {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #ffffff;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
}
</style>
