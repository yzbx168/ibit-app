# IbitAsia APP 打包指南（Capacitor）

## 📦 项目已配置内容

✅ 已安装 Capacitor 6 核心依赖
✅ 已创建 `capacitor.config.json` 配置文件
✅ 已调整 Vite 配置适配 Capacitor
✅ 已创建 android 和 ios 目录

---

## 🔧 本地开发环境要求

由于服务器 Node.js 版本为 v16，而 Capacitor 6 需要 Node.js >= 18，**请在本地电脑上进行以下操作**：

### 1. 升级 Node.js

确保本地 Node.js 版本 >= 18：

```bash
node -v  # 检查版本，建议 v18 或 v20
```

如果版本太低，请前往 https://nodejs.org 下载 LTS 版本。

---

### 2. 在本地安装平台并添加

```bash
# 进入项目目录
cd /path/to/682vue_h5

# 安装依赖（如果本地还没有）
npm install

# 添加 Android 平台
npx cap add android

# 添加 iOS 平台（仅 macOS 需要）
npx cap add ios
```

---

### 3. 构建并同步到原生平台

```bash
# 构建 Vue 项目
npm run build

# 同步到原生平台
npx cap sync
```

---

### 4. 使用 Android Studio 打包 APK

```bash
# 打开 Android Studio 项目
npx cap open android
```

然后在 Android Studio 中：
1. 等待 Gradle 同步完成
2. 点击 **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. APK 生成在：`android/app/build/outputs/apk/debug/app-debug.apk`

---

### 5. 使用 Xcode 打包 IPA（仅 macOS）

```bash
# 打开 Xcode 项目
npx cap open ios
```

然后在 Xcode 中：
1. 选择开发团队（需要 Apple 开发者账号）
2. 点击 **Product > Archive**
3. 在 Organizer 中导出 IPA

---

## 📱 APP 配置信息

| 配置项 | 值 |
|--------|-----|
| APP 名称 | IbitAsia |
| APP ID | com.ibitasia.app |
| 版本 | 1.0.0 |
| 构建目录 | dist |

---

## 🔐 签名配置（发布正式版本）

### Android 签名

1. 生成签名密钥：
```bash
keytool -genkey -v -keystore ibitasia.keystore -alias ibitasia -keyalg RSA -keysize 2048 -validity 10000
```

2. 在 `android/app/build.gradle` 中配置签名：
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('path/to/ibitasia.keystore')
            storePassword 'your-password'
            keyAlias 'ibitasia'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### iOS 签名

需要在 Apple Developer 账号中配置：
- App ID
- Certificate
- Provisioning Profile

---

## 🚀 快速测试（Debug 模式）

如果只是想快速测试，可以使用 Capacitor 的 Live Reload 功能：

```bash
# 确保手机和电脑在同一 WiFi
# 获取电脑局域网 IP
ifconfig  # macOS/Linux
ipconfig  # Windows

# 修改 capacitor.config.json
{
  "server": {
    "url": "http://192.168.x.x:9000",
    "cleartext": true
  }
}

# 构建并运行
npm run build
npx cap sync
npx cap run android
```

---

## 📝 注意事项

1. **API 请求**：APP 中无法使用 localhost，需使用真实 IP 或域名
2. **跨域问题**：Capacitor 默认允许跨域，如有问题需配置原生代理
3. **路由模式**：已配置为 hash 模式，适合 APP 环境
4. **资源路径**：已配置为相对路径，确保本地资源正确加载

---

## 🛠 常用命令

```bash
# 构建项目
npm run build

# 同步到原生平台
npx cap sync

# 打开 Android Studio
npx cap open android

# 打开 Xcode
npx cap open ios

# 在设备上运行
npx cap run android
npx cap run ios
```

---

## ❓ 遇到问题？

如果遇到 Node 版本问题，可以使用 nvm 管理 Node 版本：

```bash
# 安装 nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装并使用 Node 20
nvm install 20
nvm use 20
```

---

**下一步**：请在本地电脑（Node.js >= 18）上执行上述命令完成平台添加和打包。
