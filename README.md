# TOPRISE 営業資料 PWA — 公開と運用の手引き

このフォルダ一式を Web 上のどこかに置けば、iPad の「ホーム画面に追加」でアプリ化できます。
追加後はオフラインでも表示できます。

## 1. このフォルダの中身

```
toprise-app/
├── index.html                  ← 目次画面（PWAのトップ）
├── manifest.json               ← アプリ宣言（名前・アイコン・テーマ色）
├── service-worker.js           ← オフラインキャッシュ
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png    ← iOS ホーム画面アイコン
├── toprise_company.html        ← 会社紹介
├── toprise_field_cards.html    ← 現場提案カード（iPad現場用）
├── toprise_sheet_p40.html      ← Leica P40 機材シート
├── toprise_sheet_navvis.html   ← NavVis VLX 機材シート
├── toprise_sheet_uav.html      ← DJI Matrice 300 RTK 機材シート
├── toprise_sheet_proscan.html  ← ProScan 機材シート
└── README.md                   ← このファイル
```

## 2. PWA が動く条件

- **HTTPS で配信されていること**（http:// では Service Worker が動きません。`localhost` だけ例外）
- ファイルが**そのままの構造**で同じフォルダに置かれていること
- `index.html` を入口に開くこと

これを満たせばホスティング先は何でもよいです。代表的な無料の選択肢：

### 選択肢A：GitHub Pages（おすすめ・無料・HTTPS自動付与）

1. GitHub に新しいリポジトリ（例：`toprise-app`）を作成。Public で OK。
2. このフォルダの中身**すべて**をリポジトリのルートにアップロード（ドラッグ＆ドロップでもよい）。
3. リポジトリの **Settings → Pages** を開く。
4. *Source* を「Deploy from a branch」、Branch を `main` / `(root)` に設定して Save。
5. 1〜2分待つと URL が表示される（例：`https://<ユーザー名>.github.io/toprise-app/`）。
6. iPad の Safari でその URL を開く → 共有ボタン `[↑]` → **「ホーム画面に追加」**。
7. ホーム画面に TOPRISE アイコンができる。タップでフルスクリーン起動・オフライン対応。

### 選択肢B：Netlify Drop（さらに手軽・要アカウント1つ）

1. [https://app.netlify.com/drop](https://app.netlify.com/drop) にアクセス。
2. このフォルダを丸ごとドラッグ＆ドロップ。
3. 表示された URL（例：`https://xxx.netlify.app/`）を iPad で開いて「ホーム画面に追加」。

### 選択肢C：社内サーバ／既存の自社ドメイン配下

すでに会社の Web サーバがあるなら、`/toprise-app/` のようなパスに上記ファイルを置くだけ。
HTTPS であることだけ確認してください。

## 3. iPad へのインストール手順

1. Safari でアプリの URL を開く（`https://...` で始まる URL）
2. 画面下の **共有ボタン**（四角＋上矢印のアイコン）をタップ
3. メニューを下にスクロールして **「ホーム画面に追加」** をタップ
4. 名前を確認（デフォルトで「TOPRISE」）→ 「追加」
5. ホーム画面に TR アイコンが現れる。タップで全画面起動。

**ポイント**：初回はオンラインで開いてください。2回目以降は機内モードでも開けます。

## 4. 資料を更新したいとき

中身（例：`toprise_sheet_p40.html`）を差し替えただけでは、ホーム画面アプリは
**キャッシュ済みの古いバージョンを表示し続けます**。

新しい内容を反映するには、`service-worker.js` の冒頭にある以下の行を変更してください：

```javascript
const CACHE_VERSION = "toprise-v1";   //  ← v2, v3 … と数字を上げる
```

`v1` → `v2` のように上げてからアップロードすると、次にオンラインで開いたとき
古いキャッシュが破棄され、最新のファイルが再キャッシュされます。

> 簡単ルール：**資料を1回でも触ったら、必ず CACHE_VERSION の数字を1つ上げる**

## 5. うまく動かないとき

| 症状 | 原因 / 対処 |
|---|---|
| 「ホーム画面に追加」が出ない | Safari 以外（Chrome等）で開いていませんか？ iOS では Safari のみ対応 |
| 古い内容が表示される | `CACHE_VERSION` を上げ忘れ。上げて再アップ→Safariで一度開き直す |
| アイコンが灰色になる | `apple-touch-icon.png` が正しい場所にあるか確認 |
| オフラインで開けない | 初回はオンラインで一度開く必要がある。フォント等の取得が完了するまで2〜3秒待つ |
| URL が変わった | ホーム画面アイコンを削除して、新しい URL で「追加」し直す |

## 6. 制限事項（正直なところ）

- iOS では Service Worker のキャッシュは **数週間アクセスが無いと OS に削除される**ことがあります。
  営業現場で定期的に開いていれば問題になりませんが、長期間放置するとオンライン接続が必要になります。
- App Store には載りません（その代わり審査・年99ドルの開発者登録は不要です）。
- プッシュ通知は iOS 16.4 以降で可能ですが、このアプリでは使っていません。

---

何か困ったら、HTMLファイルを直接 Safari で開けば普通の Web ページとして見られます。
PWA は「便利な皮」であって、中身は普通の HTML なので、最悪 PWA が動かなくても資料は失われません。
