# HR-Helper (HR 小幫手)

這是一個基於 Google GenAI 的 HR 輔助工具，旨在協助人力資源管理人員更有效率地處理日常事務。

## 功能特色
- **AI 驅動**: 整合 Google Gemini API 提供智慧建議。
- **現代化介面**: 使用 React 19 與 Vite 打造流暢的使用者體驗。
- **自動化部署**: 支援透過 GitHub Actions 自動部署至 GitHub Pages。

## 專案結構
- `src/`: 原始碼目錄
- `components/`: React 元件
- `services/`: API 服務與邏輯
- `.github/workflows/`: CI/CD 設定檔

## 快速開始

### 環境需求
- Node.js (建議 v20 或以上)
- npm (或 yarn/pnpm)

### 安裝
```bash
npm install
```

### 設定環境變數
請複製 `.env.example` (若有) 或直接建立 `.env` 檔案，並設定以下變數：
```
VITE_GEMINI_API_KEY=你的_GEMINI_API_KEY
```
> **注意**: 請確保不要將真實的 API Key 提交到版本控制系統中。`.gitignore` 已經預設忽略 `.env`。

### 開發模式
啟動本地開發伺服器：
```bash
npm run dev
```

### 建置與預覽
建置生產版本：
```bash
npm run build
```
預覽建置結果：
```bash
npm run preview
```

## 部署
本專案已設定 GitHub Actions。當你將程式碼推送到 `main` 分支時，會自動觸發建置並部署至 GitHub Pages。
請確保在 GitHub 儲存庫的 Settings > Pages 中，Source 選擇 "GitHub Actions"。
