# アプローチタスク管理 (Outbound Tasks) 画面仕様

## 1. 概要

AIが生成したアプローチ文面の確認と送信指示を行う画面。
承認ワークフローの中核となる画面。

---

## 2. 画面一覧

| 画面 | パス | 説明 |
|------|------|------|
| タスク一覧（承認キュー） | `/outbound` | 生成ドラフトの一覧・承認 |
| 送信履歴 | `/outbound/history` | 送信済みメールの履歴 |

---

## 3. タスク一覧画面（承認キュー）

### 3.1. 画面構成

```
┌─────────────────────────────────────────────────────────────────────┐
│  アプローチタスク管理                         [ドラフト一括生成]   │
├─────────────────────────────────────────────────────────────────────┤
│  [承認キュー]  [送信履歴]                                           │
├─────────────────────────────────────────────────────────────────────┤
│  プロジェクト: [すべて ▼]  ステータス: [承認待ち ▼]  タイプ: [すべて ▼]│
├─────────────────────────────────────────────────────────────────────┤
│  選択中: 5件  [一括承認] [一括却下]                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │□│企業名      │タイプ   │件名              │ステータス│作成日│操作│
│  ├─┼───────────┼────────┼─────────────────┼─────────┼─────┼────┤
│  │☑│株式会社ABC │Account │業務効率化のご提案│ Pending │12/10│ ⋮ │
│  │☑│DEF商事    │Mass    │ツール導入のご案内│ Pending │12/10│ ⋮ │
│  │□│GHI工業    │Account │DX推進のご相談   │Approved │12/09│ ⋮ │
│  │☑│JKLテック  │Mass    │無料トライアルのご案内│Pending│12/10│ ⋮ │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  表示: 1-50 / 128件                    ← 1 2 3 →                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2. テーブルカラム定義

| カラム | 型 | 幅 | ソート | フィルタ | 説明 |
|--------|-----|-----|:------:|:-------:|------|
| チェックボックス | Checkbox | 40px | - | - | 一括操作用 |
| 企業名 | Text | 150px | ✓ | - | `targets.company_name` |
| タイプ | Badge | 80px | - | ✓ | `mass` / `account` |
| 件名 | Text | 250px | - | - | `subject` クリックで詳細表示 |
| ステータス | Badge | 100px | - | ✓ | `pending` / `approved` / `rejected` / `sent` |
| 作成日 | Date | 80px | ✓ | - | `created_at` |
| 操作 | Dropdown | 60px | - | - | 詳細・承認・却下 |

### 3.3. ステータスバッジ

| ステータス | 色 | 説明 |
|------------|-----|------|
| `pending` | Yellow | 承認待ち |
| `approved` | Blue | 承認済み（未送信） |
| `rejected` | Gray | 却下 |
| `sent` | Green | 送信済み |

### 3.4. 操作メニュー

| 操作 | 表示条件 | 説明 |
|------|----------|------|
| 詳細を見る | 常時 | ドラフト詳細モーダルを開く |
| 承認 | `status = pending` | 承認済みに変更 |
| 却下 | `status = pending` | 却下に変更 |
| 送信 | `status = approved` | メール送信を実行 |
| 再生成 | `status = rejected` | AIで再度生成 |

### 3.5. 一括操作

| 操作 | 説明 |
|------|------|
| 一括承認 | 選択した `pending` タスクを `approved` に |
| 一括却下 | 選択した `pending` タスクを `rejected` に |
| 一括送信 | 選択した `approved` タスクを送信 |

---

## 4. ドラフト詳細モーダル

### 4.1. 画面構成

```
┌─────────────────────────────────────────────────────────────────┐
│  ドラフト詳細                                           [×]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ 送信先情報 ───────────────────────────────────────────────┐│
│  │  企業名:     株式会社ABC                                   ││
│  │  担当者:     山田太郎                                      ││
│  │  メール:     info@abc.co.jp                                ││
│  │  推定売上:   15億円  →  適用タイプ: [Account]             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ 件名 ─────────────────────────────────────────────────────┐│
│  │ [株式会社ABC様｜業務効率化についてのご提案              ] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ 本文 ─────────────────────────────────────────────────────┐│
│  │ [山田太郎様                                              ] ││
│  │ [                                                        ] ││
│  │ [突然のご連絡失礼いたします。                            ] ││
│  │ [株式会社〇〇の△△と申します。                          ] ││
│  │ [                                                        ] ││
│  │ [御社のIT業界でのご活躍を拝見し、                       ] ││
│  │ [弊社のクラウドCRMが御社の営業効率化に                  ] ││
│  │ [お役に立てるのではないかと考え、ご連絡いたしました。    ] ││
│  │ [                                                        ] ││
│  │ [...                                                     ] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ 履歴 ─────────────────────────────────────────────────────┐│
│  │  12/10 14:30  作成（AI生成）                               ││
│  │  12/10 15:00  編集（山田）                                 ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│              [却下]  [再生成]           [保存]  [承認して送信] │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2. 編集可能フィールド

| フィールド | 型 | 説明 |
|------------|-----|------|
| 件名 | Input | 生成された件名を編集可能 |
| 本文 | Textarea | 生成された本文を編集可能 |

### 4.3. アクションボタン

| ボタン | 表示条件 | 動作 |
|--------|----------|------|
| 却下 | `status = pending` | ステータスを `rejected` に |
| 再生成 | 常時 | AIで再度生成（現在の内容は破棄） |
| 保存 | 編集時 | 変更内容を保存 |
| 承認して送信 | `status = pending` or `approved` | 承認→即座にメール送信 |

---

## 5. ドラフト一括生成モーダル

### 5.1. 画面構成

```
┌─────────────────────────────────────────────────────────────────┐
│  ドラフト一括生成                                       [×]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  プロジェクト:  [SaaS営業2024Q1 ▼]                             │
│                                                                 │
│  対象ターゲット:                                                │
│  ○ 未処理のターゲットすべて（142件）                           │
│  ○ 選択したターゲットのみ（15件選択中）                        │
│                                                                 │
│  ┌─ 生成設定 ─────────────────────────────────────────────────┐│
│  │  □ 売上10億円以上 → Account型テンプレートを使用           ││
│  │  □ 売上10億円未満 → Mass型テンプレートを使用              ││
│  │                                                            ││
│  │  ※ プロジェクトの分岐設定に基づいて自動判定されます       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ⚠️ 注意: 生成には数分かかる場合があります                     │
│                                                                 │
│                              [キャンセル]  [生成開始]          │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2. 生成処理フロー

```typescript
const generateDrafts = async (projectId: string, targetIds: string[]) => {
  // 1. プロジェクト設定を取得
  const project = await getProject(projectId);
  const templates = await getTemplates(projectId);

  // 2. ターゲットを取得
  const targets = await getTargets(targetIds);

  // 3. 並列数を制限して生成
  const results = [];
  const chunks = chunkArray(targets, 5); // 5件ずつ

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(async (target) => {
        // 売上に基づいてタイプを決定
        const type = target.estimated_revenue >= project.strategy_threshold
          ? 'account'
          : 'mass';

        const template = templates.find(t => t.type === type);

        // Gemini APIで生成
        const draft = await generateWithAI({
          target,
          template,
          project,
        });

        // DBに保存
        return saveDraft({
          target_id: target.id,
          template_id: template.id,
          applied_type: type,
          subject: draft.subject,
          body: draft.body,
          status: 'pending',
        });
      })
    );

    results.push(...chunkResults);

    // 進捗を更新
    updateProgress(results.length, targets.length);
  }

  return results;
};
```

---

## 6. 送信履歴画面

### 6.1. 画面構成

```
┌─────────────────────────────────────────────────────────────────────┐
│  アプローチタスク管理                                              │
├─────────────────────────────────────────────────────────────────────┤
│  [承認キュー]  [送信履歴]                                           │
├─────────────────────────────────────────────────────────────────────┤
│  プロジェクト: [すべて ▼]  期間: [今月 ▼]  配信状況: [すべて ▼]    │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │送信日時     │企業名      │送信先           │件名    │配信状況│
│  ├────────────┼───────────┼────────────────┼───────┼───────┤
│  │12/10 15:30 │株式会社ABC │info@abc.co.jp  │業務効率│Delivered│
│  │12/10 15:25 │DEF商事    │contact@def...  │ツール導│Delivered│
│  │12/10 14:00 │GHI工業    │sales@ghi...    │DX推進の│ Bounced │
│  │12/09 18:00 │JKLテック  │info@jkl...     │無料トラ│Delivered│
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  表示: 1-50 / 89件                     ← 1 2 →                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2. テーブルカラム定義

| カラム | 型 | ソート | 説明 |
|--------|-----|:------:|------|
| 送信日時 | DateTime | ✓ | `sent_at` |
| 企業名 | Text | - | `targets.company_name` |
| 送信先 | Text | - | `sent_to` |
| 件名 | Text | - | `subject` クリックで詳細表示 |
| 配信状況 | Badge | - | `delivery_status` |

### 6.3. 配信状況バッジ

| ステータス | 色 | 説明 |
|------------|-----|------|
| `sent` | Blue | 送信済み（確認待ち） |
| `delivered` | Green | 配信成功 |
| `bounced` | Red | バウンス |
| `failed` | Red | 送信失敗 |

---

## 7. データ操作

### 7.1. タスク一覧取得

```typescript
const getOutboundTasks = async (filters: TaskFilters) => {
  let query = supabase
    .from('outbound_tasks')
    .select(`
      *,
      targets (
        company_name,
        contact_email,
        contact_name,
        estimated_revenue
      ),
      draft_templates (name, type)
    `)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.type) {
    query = query.eq('applied_type', filters.type);
  }

  return query.range(filters.offset, filters.offset + filters.limit - 1);
};
```

### 7.2. 承認処理

```typescript
const approveTask = async (taskId: string, userId: string) => {
  return supabase
    .from('outbound_tasks')
    .update({
      status: 'approved',
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .eq('id', taskId);
};
```

### 7.3. 送信処理

```typescript
const sendEmail = async (taskId: string) => {
  const task = await getTask(taskId);
  const target = await getTarget(task.target_id);

  // Resend APIでメール送信
  const result = await resend.emails.send({
    from: 'sales@example.com',
    to: target.contact_email,
    subject: task.subject,
    text: task.body,
  });

  // 履歴を保存
  await supabase.from('outbound_history').insert({
    task_id: taskId,
    sent_to: target.contact_email,
    subject: task.subject,
    body: task.body,
    delivery_status: 'sent',
  });

  // タスクのステータスを更新
  await supabase
    .from('outbound_tasks')
    .update({ status: 'sent' })
    .eq('id', taskId);

  return result;
};
```

---

## 関連ドキュメント

- [全体要件定義書](../../overview/requirements.md)
- [データベース設計](../../technical/database-schema.md)
- [ターゲットリスト画面](./targets.md)
- [分析・レポート画面](./analytics.md)
