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
- `HANDOFF.md` — 專案交接摘要。
- `ENGINE_NOTES.md` — 承襲自原版的架構/系統/踩雷筆記（改碼前先查這份）。

## 開始遊玩

用瀏覽器直接開啟 `index.html`。發佈 GitHub Pages 後於 `https://darkbearlab.github.io/Homeward-/` 遊玩。

## 開發

改完 **一定要跑** headless 驗證（沿用原版守則：逐幀跑遍所有場景的 `update()+draw()`，不要只在戰鬥跑）：

```bash
node _check.js
```

## 進度

**Phase 0（基線與去附身）已完成** — 只操作騎士本人、騎士抵達撤離點＝過關、騎士陣亡＝run 結束、扈從為 AI 且永久死亡。攝影機（旋轉跟隨＋指標鎖定瞄準）完全沿用原版。
下一步 Phase 1＝真正的近接戰鬥（揮斬 cleave／盾格）。詳見 `PLAN.md`。
