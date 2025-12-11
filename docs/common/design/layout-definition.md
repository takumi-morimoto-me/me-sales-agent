# AIネイティブCMS レイアウト定義（実装詳細）

**バージョン**: 2.0 (2025-11-16)

**ドキュメントの目的**: レイアウトの**実装詳細**。レイアウトパターンの概要は[00-quick-reference.md](../../00-quick-reference.md)を参照。

---

## 目次

1. [レスポンシブ対応](#1-レスポンシブ対応)
2. [実装方針](#2-実装方針)
3. [コンポーネント仕様](#3-コンポーネント仕様)

---

## 1. レスポンシブ対応

### 1.1. ブレークポイント戦略

Tailwind CSSのデフォルトブレークポイントを使用:

| デバイス | 幅 | ブレークポイント | レイアウト |
|---------|---|-----------------|-----------|
| **モバイル** | 〜767px | デフォルト | 単一カラム指揮モード |
| **タブレット** | 768px〜1023px | `md:` | 2カラム協働モード（幅は狭くなるが構造は維持） |
| **PC** | 1024px以上 | `lg:` | 2カラム協働モードを活用 |

### 1.2. レイアウト変化の詳細

| 要素 | PC (1024px以上) | タブレット (768px〜1023px) | モバイル (〜767px) |
|------|----------------|---------------------------|-------------------|
| **Sidebar** | 常時表示（64px） | 常時表示（64px、狭い） | ハンバーガーメニュー |
| **Pattern A** | 2カラム（AI Panel 400px + Content View 残り） | 2カラム（AI Panel 320px + Content View 残り） | 1カラム（タブ切り替えでAI Panelとontent Viewを切り替え） |
| **Pattern B** | 1カラム（広い、最大1200px中央配置） | 1カラム（狭い、全幅） | 1カラム（全幅） |
| **AIパネル** | リサイズ可能（300px〜600px） | 固定幅（320px） | 全幅（タブ切り替え時） |

### 1.3. モバイルUIの特殊仕様

#### タブ切り替え（Pattern A時）

モバイルでは2カラムを表示できないため、AIパネルとコンテンツ・ビューを**タブで切り替え**ます。

```
┌─────────────────────┐
│  [AI Panel] [Content View]  ← タブ
├─────────────────────┤
│                     │
│  選択されたタブの    │
│  内容を全画面表示    │
│                     │
└─────────────────────┘
```

#### ハンバーガーメニュー（Sidebar）

```
┌─────────────────────┐
│  [☰]  AIネイティブCMS │  ← Header
├─────────────────────┤
│                     │
│  コンテンツエリア    │
│                     │
└─────────────────────┘

[☰] クリック時：
┌─────────────────────┐
│  🤖 チャット         │
│  ✅ タスク           │
│  📈 ストラテジー     │
│  📊 レポート         │
│  🎨 コンテンツ       │
│  🧠 ナレッジベース   │
│  ⚙️ セッティング    │
└─────────────────────┘
```

---

## 2. 実装方針

### 2.1. グリッドシステム

- **8pxグリッド**を基準とする
- Tailwindのスペーシングユーティリティ（`p-4`, `m-8`など）を使用
- 具体的な数値はshadcn/uiのデフォルトに従う

### 2.2. コンポーネント利用

- **Sidebar**: shadcn/ui の `Sidebar` コンポーネントを使用
- **レイアウト分割**: Tailwind の Flexbox/Grid を使用
- **レスポンシブ**: Tailwind のブレークポイント（`md:`, `lg:`）を使用

### 2.3. 実装の優先順位

1. **shadcn/uiのデフォルトを確認**し、そのまま使えるか試す
2. 微妙な場合は**参考UI**（Linear, Notion, Vercel Dashboard等）を決める
3. Tailwindクラスで調整
4. それでも要件に合わない場合のみ手動実装を検討

### 2.4. スタイル管理

**禁止事項**:
- CSS Variablesを直接参照して独自スタイルを作る（`bg-[var(--color-surface)]`など）

**推奨事項**:
- Tailwindのユーティリティクラスを使用（`bg-surface`, `text-foreground`など）
- デザイントークンは`design-tokens.yaml`で管理
- 実装で決定した値は`layout-specs.yaml`と`component-specs.yaml`に記録

---

## 3. コンポーネント仕様

### 3.1. Sidebar コンポーネント

**shadcn/ui Sidebar**を使用し、以下のカスタマイズを適用:

| プロパティ | 値 | 説明 |
|-----------|---|------|
| **幅（デフォルト）** | 64px | アイコンのみ表示 |
| **幅（展開時）** | 240px | テキストラベル + アイコン表示 |
| **展開モード** | オーバーレイ | メインエリアに覆い被さる |
| **背景色** | `bg-surface` | デザイントークンから参照 |
| **アクティブ状態** | `bg-accent` | 現在の画面をハイライト |

**実装例**:
```tsx
<Sidebar className="w-16 lg:w-16 bg-surface">
  <SidebarItem icon={MessageSquare} label="チャット" active />
  <SidebarItem icon={CheckSquare} label="タスク" />
  {/* ... */}
</Sidebar>
```

### 3.2. AI Panel コンポーネント

**カスタムコンポーネント**（shadcn/uiのResizable Panelを使用）:

| プロパティ | 値 | 説明 |
|-----------|---|------|
| **デフォルト幅** | 400px (PC), 320px (タブレット) | AIパネルの初期幅 |
| **最小幅** | 300px | これ以上狭くできない |
| **最大幅** | 600px | これ以上広くできない |
| **リサイズ** | 可能（PC/タブレットのみ） | モバイルは全幅固定 |
| **背景色** | `bg-surface` | デザイントークンから参照 |
| **ボーダー** | `border-r border-border` | 右側に境界線 |

**実装例**:
```tsx
<ResizablePanel defaultSize={400} minSize={300} maxSize={600}>
  <AIChatPanel />
</ResizablePanel>
```

### 3.3. Content View コンポーネント

**カスタムコンポーネント**（Tailwind Gridを使用）:

| プロパティ | 値 | 説明 |
|-----------|---|------|
| **幅** | 残りスペース全体 | AI Panelの残り |
| **パディング** | `p-6 lg:p-8` | 内側の余白 |
| **背景色** | `bg-background` | メイン背景色 |
| **スクロール** | `overflow-y-auto` | 縦スクロール可能 |

**実装例**:
```tsx
<div className="flex-1 p-6 lg:p-8 bg-background overflow-y-auto">
  <ContentEditor />
</div>
```

### 3.4. レイアウト切り替えロジック

**状態管理**: React Context API を使用

```tsx
type LayoutPattern = 'A' | 'B';

interface LayoutContext {
  pattern: LayoutPattern;
  setPattern: (pattern: LayoutPattern) => void;
}

// AIの指示やユーザーの画面選択に応じて動的に切り替え
```

**切り替えトリガー**:
1. **AI→UI制御**: AIがパターンを指定（例: 「記事Aを編集」→ Pattern A）
2. **画面選択**: ユーザーがSidebarから画面を選択（各画面にパターンが紐づいている）
3. **URL**: URLパラメータからパターンを判定（例: `/content?pattern=A`）

---

## 関連ドキュメント

- [00-quick-reference.md](../../00-quick-reference.md) - プロジェクト全体のハブ（レイアウトパターン概要）
- [デザインシステム](./design-system.md) - デザイントークン、ビジュアル原則
- [Chat機能詳細定義書](../components/chat-panel/specification.md) - AIパネルの詳細仕様
- [design-tokens.yaml](./specs/design-tokens.yaml) - 色、フォント、スペーシング
- [layout-specs.yaml](./specs/layout-specs.yaml) - 実装値の記録（Header, Sidebar等）
- [component-specs.yaml](./specs/component-specs.yaml) - コンポーネントの実装値
- [技術スタック](../technical/tech-stack.md) - 技術選定、実装詳細
