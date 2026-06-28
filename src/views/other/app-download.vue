<!-- APP 下载页面 -->
<script setup>
import { useMainStore } from '@/store'
import { useRoute } from 'vue-router'
import { getPlatform } from '@/utils/index'
import { _t18 } from '@/utils/public'

const mainStore = useMainStore()
const route = useRoute()

/**
 * 下载列表（从 store 获取配置）
 */
const downLoadList = computed(() => {
  let data = []
  if (mainStore.getDownLoadList.length) {
    data = mainStore.getDownLoadList
      .map((item) => {
        return {
          icon: `${item.name}.png`,
          path: item.url,
          isOpen: item.isOpen,
          name: item.name,
          version: _t18('app_download_version'),
          direct: _t18('app_download_direct'),
          label: item.name === 'android' ? _t18('app_download_android_btn') : _t18('app_download_ios_btn')
        }
      })
      .filter((item) => item.isOpen == 'true')
  }
  return data
})

/**
 * iOS 下载链接
 */
const iosDownload = computed(() => {
  return downLoadList.value.find((item) => item.name === 'apple')?.path || '#'
})

/**
 * Android 下载链接
 */
const androidDownload = computed(() => {
  return downLoadList.value.find((item) => item.name === 'android')?.path || '#'
})

/**
 * 处理下载点击
 */
const handleDownload = (url) => {
  if (url && url !== '#') {
    window.open(url)
  }
}

/**
 * 返回上一页
 */
const goBack = () => {
  if (route.query.flag) {
    window.history.back()
  } else {
    window.location.href = '/#/home'
  }
}

/**
 * 特性列表
 */
const featureList = [
  {
    icon: 'security',
    iconBg: '#F5C518',
    titleKey: 'app_download_security_title',
    descKey: 'app_download_security_desc'
  },
  {
    icon: 'latency',
    iconBg: '#0066FF',
    titleKey: 'app_download_latency_title',
    descKey: 'app_download_latency_desc'
  },
  {
    icon: 'terminal',
    iconBg: '#9333EA',
    titleKey: 'app_download_terminal_title',
    descKey: 'app_download_terminal_desc'
  }
]
</script>

<template>
  <div class="app-download-container">
    <!-- 头部导航 -->
    <van-sticky>
      <header class="download-header">
        <div class="header-left" @click="goBack">
          <svg-load name="jiantou-z" class="back-icon"></svg-load>
        </div>
        <div class="header-title">{{ _t18('app_download_title') }}</div>
        <div class="header-right">
          <!-- 登录按钮 -->
          <div class="login-btn-header" @click="$router.push('/sign-in')">
            <svg-load name="user" class="user-icon"></svg-load>
            <span class="login-text">{{ _t18('login') }}</span>
          </div>
          <!-- 语言切换 -->
          <div class="language-btn" @click="$router.push('/language-selection')">
            <svg-load name="yuyan" class="language-icon"></svg-load>
          </div>
        </div>
      </header>
    </van-sticky>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 主标题区域 -->
      <div class="hero-section">
        <div class="subtitle">{{ _t18('app_download_subtitle') }}</div>
        <div class="main-title">{{ _t18('app_download_main_title') }}</div>
        <div class="description">{{ _t18('app_download_desc') }}</div>
      </div>

      <!-- 手机展示图 -->
      <div class="phone-showcase">
        <img src="/resource/images/light/phone-mockup.png" alt="phone mockup" class="phone-image" />
      </div>

      <!-- 下载按钮区域 -->
      <div class="download-section">
        <!-- iOS 下载 -->
        <div class="download-btn" @click="handleDownload(iosDownload)">
          <svg-load name="apple" class="platform-icon"></svg-load>
          <div class="btn-info">
            <div class="btn-title">{{ _t18('app_download_ios_btn') }}</div>
            <div class="btn-subtitle">{{ _t18('app_download_version') }}</div>
          </div>
          <svg-load name="jiantou-z" class="arrow-icon"></svg-load>
        </div>

        <!-- Android 下载 -->
        <div class="download-btn android" @click="handleDownload(androidDownload)">
          <div class="platform-icon android-icon">
            <svg-load name="download" class="android-svg"></svg-load>
          </div>
          <div class="btn-info">
            <div class="btn-title">{{ _t18('app_download_android_btn') }}</div>
            <div class="btn-subtitle">{{ _t18('app_download_direct') }}</div>
          </div>
          <svg-load name="jiantou-z" class="arrow-icon"></svg-load>
        </div>
      </div>

      <!-- 特性展示区域 -->
      <div class="features-section">
        <div class="features-title">{{ _t18('app_download_why_title') }}</div>
        
        <div class="feature-list">
          <div
            class="feature-item"
            v-for="(feature, index) in featureList"
            :key="index"
          >
            <div class="feature-icon" :style="{ backgroundColor: feature.iconBg }">
              <svg-load :name="feature.icon" class="feature-svg"></svg-load>
            </div>
            <div class="feature-content">
              <div class="feature-title">{{ _t18(feature.titleKey) }}</div>
              <div class="feature-desc">{{ _t18(feature.descKey) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部占位 -->
      <div class="bottom-spacer"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-download-container {
  min-height: 100vh;
  background: var(--ex-default-background-color);
  position: relative;

  // 头部导航
  .download-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 15px;
    background: var(--ex-default-background-color);
    border-bottom: 1px solid var(--ex-border-color);

    .header-left {
      display: flex;
      align-items: center;
      cursor: pointer;

      .back-icon {
        font-size: 20px;
        color: var(--ex-default-font-color);
      }
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--ex-primary-color);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;

      // 登录按钮
      .login-btn-header {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 8px;
        background: rgba(64, 105, 231, 0.1);
        border: 1px solid rgba(64, 105, 231, 0.3);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(64, 105, 231, 0.2);
          border-color: rgba(64, 105, 231, 0.5);
        }

        .user-icon {
          font-size: 16px;
          color: var(--ex-default-font-color);
        }

        .login-text {
          font-size: 14px;
          color: var(--ex-default-font-color);
          font-weight: 500;
        }
      }

      // 语言切换按钮
      .language-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(64, 105, 231, 0.1);
        }

        .language-icon {
          font-size: 18px;
          color: var(--ex-default-font-color);
          transition: all 0.3s ease;

          &:hover {
            color: var(--ex-primary-color);
          }
        }
      }
    }
  }

  .content {
    padding: 30px 20px;

    // 主标题区域
    .hero-section {
      text-align: center;
      margin-bottom: 30px;

      .subtitle {
        font-size: 12px;
        color: var(--ex-primary-color);
        letter-spacing: 1px;
        margin-bottom: 15px;
        font-weight: 500;
      }

      .main-title {
        font-size: 36px;
        font-weight: 700;
        color: var(--ex-default-font-color);
        margin-bottom: 20px;
        letter-spacing: 2px;
      }

      .description {
        font-size: 14px;
        color: var(--ex-font-color18);
        line-height: 1.8;
        max-width: 400px;
        margin: 0 auto;
      }
    }

    // 手机展示图
    .phone-showcase {
      margin: 30px 0;
      text-align: center;

      .phone-image {
        max-width: 100%;
        width: 280px;
        height: auto;
        border-radius: 20px;
        display: block;
        margin: 0 auto;
      }
    }

    // 下载按钮区域
    .download-section {
      margin: 40px 0;

      .download-btn {
        display: flex;
        align-items: center;
        padding: 18px 20px;
        margin-bottom: 16px;
        background: var(--ex-home-box-background-color);
        border-radius: 16px;
        border: 1px solid var(--ex-border-color);
        cursor: pointer;
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.98);
          opacity: 0.9;
        }

        .platform-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          svg {
            font-size: 28px;
            color: #ffffff;
          }
        }

        .android-icon {
          width: 44px;
          height: 44px;
          background: #34C759;
          border-radius: 10px;
          margin-right: 15px;

          .android-svg {
            font-size: 24px;
          }
        }

        .btn-info {
          flex: 1;
          margin-left: 15px;

          .btn-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--ex-default-font-color);
            margin-bottom: 4px;
          }

          .btn-subtitle {
            font-size: 12px;
            color: var(--ex-font-color18);
          }
        }

        .arrow-icon {
          font-size: 18px;
          color: var(--ex-font-color18);
        }

        &.android {
          .platform-icon {
            width: 44px;
            height: 44px;
            background: #34C759;
            border-radius: 10px;
            margin-right: 15px;

            svg {
              font-size: 24px;
            }
          }
        }
      }
    }

    // 特性展示区域
    .features-section {
      margin-top: 50px;

      .features-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--ex-default-font-color);
        text-align: center;
        margin-bottom: 30px;
        letter-spacing: 1px;
      }

      .feature-list {
        .feature-item {
          display: flex;
          align-items: center;
          padding: 20px;
          margin-bottom: 16px;
          background: var(--ex-home-box-background-color);
          border-radius: 16px;
          border: 1px solid var(--ex-border-color);

          .feature-icon {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            .feature-svg {
              font-size: 28px;
              color: #ffffff;
            }
          }

          .feature-content {
            margin-left: 16px;
            flex: 1;

            .feature-title {
              font-size: 16px;
              font-weight: 600;
              color: var(--ex-default-font-color);
              margin-bottom: 6px;
            }

            .feature-desc {
              font-size: 13px;
              color: var(--ex-font-color18);
              line-height: 1.5;
            }
          }
        }
      }
    }

    .bottom-spacer {
      height: 40px;
    }
  }
}
</style>
