# 凡人小幫手（前台）

這是「凡人小幫手」的**公開前台**，純靜態網頁，部署在 GitHub Pages：

> https://peien1013.github.io/fanren/

## 架構

- **前台（這個 repo）**：純靜態 HTML，使用者看到的全部畫面。
  - `index.html` 首頁選單
  - `qa.html` 常見問題
  - `message.html` 留言詢問
  - `reply.html` 查詢回覆
- **後端（不在這裡）**：Google Apps Script「隱形資料 API」，前台用 JSONP / POST 跟它要資料；資料存在 Google 試算表。原始碼放在私人 repo。

## 維護

- 改文字／選單／圖片／Q&A → 直接編輯 Google 試算表，重新整理網頁即生效。
- 後端 API 網址（`/exec`）寫在各 HTML 檔最上方的 `var API`。若重新部署導致網址改變，更新這個值即可。
