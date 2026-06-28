<template>
  <HeaderBar :currentName="currentName" />
  <div class="news-detail-container">
    <div class="news-header">
      <h1 class="news-title">{{ currentData?.noticeTitle }}</h1>
      <div class="news-meta">
        <span class="news-time">{{ formatTime(currentData?.createTime) }}</span>
      </div>
    </div>
    <div class="news-content" v-html="currentData?.noticeContent"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { noticeDetail } from '@/api/common/index'

const $route = useRoute()
const currentName = ref('')
const currentData = ref(null)

onMounted(async () => {
  try {
    const res = await noticeDetail($route.query.id)
    if (res.code === 200) {
      currentData.value = res.data
      currentName.value = res.data.noticeTitle
    }
  } catch (error) {
    console.error('获取快讯详情失败:', error)
  }
})

// 时间格式化
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString()
}
</script>

<style lang="scss" scoped>
.news-detail-container {
  padding: 15px;
  background-color: var(--ex-default-background-color);
  min-height: calc(100vh - 100px);
}

.news-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--ex-border-color6);

  .news-title {
    font-size: 18px;
    font-weight: bold;
    color: var(--ex-default-font-color);
    line-height: 1.5;
    margin: 0 0 10px 0;
  }

  .news-meta {
    .news-time {
      font-size: 12px;
      color: #999;
    }
  }
}

.news-content {
  font-size: 14px;
  color: var(--ex-default-font-color);
  line-height: 1.8;
  word-wrap: break-word;

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10px 0;
  }
}
</style>
