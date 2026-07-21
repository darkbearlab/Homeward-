# HOMEWARD（暫定代號）

**戰敗騎士的歸鄉之路。** 單一英雄動作 roguelite。

改編自 [`darkbearlab/sleeper_roguelite`](https://github.com/darkbearlab/sleeper_roguelite)（俯視戰術射擊 × 附身式小隊 × Slay-the-Spire roguelite），
沿用其 **vanilla JS + Canvas 2D、單一 `index.html`、零依賴零資產** 的架構。

## 與原版的核心差異

| 面向 | 原版 SLEEPER | HOMEWARD |
|---|---|---|
| 操作 | 附身式：切換附身多名單位 | **只操作騎士本人**（無附身） |
| 敗北 | 全員陣亡才 run 結束 | **騎士陣亡 = run 結束** |
| 戰鬥 | 純射擊 | **近接為主 + 遠程副（弓/弩/魔法）可切換** |
| 友軍 | 附身小隊 | **AI 扈從**（沿途招募、永久死亡、可下輕量指令） |
| 主題 | 間諜「沉睡者」 | 中世紀低度奇幻・敗騎歸鄉 |
| 攝影機 | 旋轉・指標鎖定 FPS 式瞄準 | **完全沿用原版，不退化** |

## 檔案

- `index.html` — 遊戲本體（開檔即玩）。
- `editor.html` — 視覺化關卡編輯器（本體選單「地圖編輯器」開啟）。
- `PLAN.md` — 分階段實作計畫（開發脈絡看這份）。

## 開始遊玩

用瀏覽器直接開啟 `index.html`。發佈 GitHub Pages 後於 `https://darkbearlab.github.io/Homeward-/` 遊玩。

> 目前 `index.html` 為 **原版基線的原封複製**（Phase 0 尚未動刀）。改造進度見 `PLAN.md`。
