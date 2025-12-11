# AI営業エージェントシステム データベース設計書（MVP版）

## 1. 概要

本ドキュメントでは、AI営業エージェントシステムのデータベーススキーマを定義する。
Supabase（PostgreSQL）を使用し、シングルテナント構成を前提とする。

---

## 2. ER図（概念）

```
┌─────────────┐       ┌─────────────────┐
│   users     │       │    projects     │
├─────────────┤       ├─────────────────┤
│ id (PK)     │───┐   │ id (PK)         │
│ email       │   │   │ name            │
│ name        │   └──→│ created_by (FK) │
│ role        │       │ ...             │
└─────────────┘       └────────┬────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ draft_templates │  │    targets      │  │ outbound_tasks  │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │  │ id (PK)         │
│ project_id (FK) │  │ project_id (FK) │  │ target_id (FK)  │
│ type            │  │ company_name    │  │ template_id(FK) │
│ ...             │  │ ...             │  │ ...             │
└─────────────────┘  └─────────────────┘  └────────┬────────┘
                                                   │
                                                   ▼
                                         ┌─────────────────┐
                                         │outbound_history │
                                         ├─────────────────┤
                                         │ id (PK)         │
                                         │ task_id (FK)    │
                                         │ ...             │
                                         └─────────────────┘

┌─────────────────┐  ┌─────────────────┐
│ inbox_messages  │  │ business_cards  │
├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │
│ target_id (FK)  │  │ created_by (FK) │
│ ...             │  │ ...             │
└─────────────────┘  └─────────────────┘
```

---

## 3. テーブル定義

### 3.1. users（ユーザー）

システムを利用するユーザー情報。Supabase Authと連携。

| カラム名 | 型 | 制約 | 説明 |
|----------|-----|------|------|
| `id` | UUID | PK | Supabase Auth の user id |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | メールアドレス |
| `name` | VARCHAR(100) | NOT NULL | 表示名 |
| `role` | ENUM | NOT NULL, DEFAULT 'member' | `admin` / `member` |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 作成日時 |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 更新日時 |

```sql
CREATE TYPE user_role AS ENUM ('admin', 'member');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

### 3.2. projects（プロジェクト）

営業プロジェクト（商材×ターゲット戦略）の管理。

| カラム名 | 型 | 制約 | 説明 |
|----------|-----|------|------|
| `id` | UUID | PK | プロジェクトID |
| `name` | VARCHAR(100) | NOT NULL | プロジェクト名 |
| `product_description` | TEXT | | 商材情報 |
| `target_persona` | TEXT | | ターゲットペルソナ |
| `strategy_threshold` | BIGINT | NOT NULL, DEFAULT 1000000000 | 売上分岐の閾値（円） |
| `status` | ENUM | NOT NULL, DEFAULT 'active' | `active` / `archived` |
| `created_by` | UUID | FK → users.id | 作成者 |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 作成日時 |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 更新日時 |

```sql
CREATE TYPE project_status AS ENUM ('active', 'archived');

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  product_description TEXT,
  target_persona TEXT,
  strategy_threshold BIGINT NOT NULL DEFAULT 1000000000,
  status project_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

### 3.3. draft_templates（文面パターン）

プロジェクトごとの文面テンプレート（Mass型/Account型）。

| カラム名 | 型 | 制約 | 説明 |
|----------|-----|------|------|
| `id` | UUID | PK | テンプレートID |
| `project_id` | UUID | FK → projects.id, NOT NULL | 所属プロジェクト |
| `type` | ENUM | NOT NULL | `mass` / `account` |
| `name` | VARCHAR(100) | NOT NULL | テンプレート名 |
| `subject_template` | TEXT | NOT NULL | 件名テンプレート |
| `body_template` | TEXT | NOT NULL | 本文テンプレート |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 作成日時 |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 更新日時 |

```sql
CREATE TYPE template_type AS ENUM ('mass', 'account');

CREATE TABLE draft_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type template_type NOT NULL,
  name VARCHAR(100) NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

### 3.4. targets（ターゲット企業）

アプローチ対象の企業リスト。

| カラム名 | 型 | 制約 | 説明 |
|----------|-----|------|------|
| `id` | UUID | PK | ターゲットID |
| `project_id` | UUID | FK → projects.id, NOT NULL | 所属プロジェクト |
| `company_name` | VARCHAR(200) | NOT NULL | 企業名 |
| `industry` | VARCHAR(100) | | 業界 |
| `website_url` | VARCHAR(500) | | 企業サイトURL |
| `estimated_revenue` | BIGINT | | 推定売上（円） |
| `employee_count` | INTEGER | | 従業員数 |
| `contact_email` | VARCHAR(255) | | 連絡先メールアドレス |
| `contact_name` | VARCHAR(100) | | 担当者名 |
| `phone` | VARCHAR(50) | | 代表電話 |
| `is_excluded` | BOOLEAN | NOT NULL, DEFAULT false | 除外フラグ |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 作成日時 |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 更新日時 |

```sql
CREATE TABLE targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  industry VARCHAR(100),
  website_url VARCHAR(500),
  estimated_revenue BIGINT,
  employee_count INTEGER,
  contact_email VARCHAR(255),
  contact_name VARCHAR(100),
  phone VARCHAR(50),
  is_excluded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_targets_project_id ON targets(project_id);
CREATE INDEX idx_targets_estimated_revenue ON targets(estimated_revenue);
```

---

### 3.5. outbound_tasks（アプローチタスク）

AIが生成したドラフト。承認待ち→承認済み→送信済みの状態遷移を持つ。

| カラム名 | 型 | 制約 | 説明 |
|----------|-----|------|------|
| `id` | UUID | PK | タスクID |
| `target_id` | UUID | FK → targets.id, NOT NULL | 対象企業 |
| `template_id` | UUID | FK → draft_templates.id | 使用テンプレート |
| `applied_type` | ENUM | NOT NULL | 適用された戦略タイプ `mass` / `account` |
| `subject` | TEXT | NOT NULL | 生成された件名 |
| `body` | TEXT | NOT NULL | 生成された本文 |
| `status` | ENUM | NOT NULL, DEFAULT 'pending' | `pending` / `approved` / `rejected` / `sent` |
| `approved_by` | UUID | FK → users.id | 承認者 |
| `approved_at` | TIMESTAMP | | 承認日時 |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 作成日時 |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 更新日時 |

```sql
CREATE TYPE outbound_status AS ENUM ('pending', 'approved', 'rejected', 'sent');

CREATE TABLE outbound_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id UUID NOT NULL REFERENCES targets(id) ON DELETE CASCADE,
  template_id UUID REFERENCES draft_templates(id) ON DELETE SET NULL,
  applied_type template_type NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status outbound_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outbound_tasks_status ON outbound_tasks(status);
CREATE INDEX idx_outbound_tasks_target_id ON outbound_tasks(target_id);
```

---

### 3.6. outbound_history（送信履歴）

実際に送信されたメールの履歴。

| カラム名 | 型 | 制約 | 説明 |
|----------|-----|------|------|
| `id` | UUID | PK | 履歴ID |
| `task_id` | UUID | FK → outbound_tasks.id, NOT NULL | 元タスク |
| `sent_to` | VARCHAR(255) | NOT NULL | 送信先メールアドレス |
| `subject` | TEXT | NOT NULL | 送信時の件名 |
| `body` | TEXT | NOT NULL | 送信時の本文 |
| `sent_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 送信日時 |
| `delivery_status` | ENUM | NOT NULL, DEFAULT 'sent' | `sent` / `delivered` / `bounced` / `failed` |
| `error_message` | TEXT | | エラー内容（失敗時） |

```sql
CREATE TYPE delivery_status AS ENUM ('sent', 'delivered', 'bounced', 'failed');

CREATE TABLE outbound_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES outbound_tasks(id) ON DELETE CASCADE,
  sent_to VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  delivery_status delivery_status NOT NULL DEFAULT 'sent',
  error_message TEXT
);

CREATE INDEX idx_outbound_history_task_id ON outbound_history(task_id);
CREATE INDEX idx_outbound_history_sent_at ON outbound_history(sent_at);
```

---

### 3.7. inbox_messages（受信メッセージ）

顧客からの返信メッセージ。MVPでは手動登録を想定。

| カラム名 | 型 | 制約 | 説明 |
|----------|-----|------|------|
| `id` | UUID | PK | メッセージID |
| `target_id` | UUID | FK → targets.id | 関連企業（紐付け可能な場合） |
| `from_email` | VARCHAR(255) | NOT NULL | 送信元メールアドレス |
| `from_name` | VARCHAR(100) | | 送信者名 |
| `subject` | TEXT | | 件名 |
| `body` | TEXT | NOT NULL | 本文 |
| `received_at` | TIMESTAMP | NOT NULL | 受信日時 |
| `is_read` | BOOLEAN | NOT NULL, DEFAULT false | 既読フラグ |
| `response_status` | ENUM | NOT NULL, DEFAULT 'unresponded' | `unresponded` / `responded` |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 登録日時 |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 更新日時 |

```sql
CREATE TYPE response_status AS ENUM ('unresponded', 'responded');

CREATE TABLE inbox_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id UUID REFERENCES targets(id) ON DELETE SET NULL,
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(100),
  subject TEXT,
  body TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  response_status response_status NOT NULL DEFAULT 'unresponded',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inbox_messages_is_read ON inbox_messages(is_read);
CREATE INDEX idx_inbox_messages_response_status ON inbox_messages(response_status);
```

---

### 3.8. business_cards（名刺データ）

OCRで読み取った名刺情報。

| カラム名 | 型 | 制約 | 説明 |
|----------|-----|------|------|
| `id` | UUID | PK | 名刺ID |
| `image_url` | VARCHAR(500) | | 名刺画像URL（Supabase Storage） |
| `name` | VARCHAR(100) | NOT NULL | 氏名 |
| `company_name` | VARCHAR(200) | | 会社名 |
| `department` | VARCHAR(100) | | 部署 |
| `position` | VARCHAR(100) | | 役職 |
| `email` | VARCHAR(255) | | メールアドレス |
| `phone` | VARCHAR(50) | | 電話番号 |
| `mobile` | VARCHAR(50) | | 携帯番号 |
| `address` | TEXT | | 住所 |
| `ocr_raw_data` | JSONB | | OCR解析結果（生データ） |
| `exchanged_at` | DATE | | 名刺交換日 |
| `notes` | TEXT | | メモ |
| `created_by` | UUID | FK → users.id | 登録者 |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 作成日時 |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | 更新日時 |

```sql
CREATE TABLE business_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url VARCHAR(500),
  name VARCHAR(100) NOT NULL,
  company_name VARCHAR(200),
  department VARCHAR(100),
  position VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  address TEXT,
  ocr_raw_data JSONB,
  exchanged_at DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_business_cards_company_name ON business_cards(company_name);
CREATE INDEX idx_business_cards_created_by ON business_cards(created_by);
```

---

## 4. ENUM型一覧

| ENUM名 | 値 | 説明 |
|--------|-----|------|
| `user_role` | `admin`, `member` | ユーザー権限 |
| `project_status` | `active`, `archived` | プロジェクト状態 |
| `template_type` | `mass`, `account` | 文面戦略タイプ |
| `outbound_status` | `pending`, `approved`, `rejected`, `sent` | タスク状態 |
| `delivery_status` | `sent`, `delivered`, `bounced`, `failed` | 配信状態 |
| `response_status` | `unresponded`, `responded` | 返信対応状態 |

---

## 5. RLS（Row Level Security）ポリシー

MVPではシングルテナントのため、基本的なRLSのみ設定。

```sql
-- 全テーブルでRLSを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは全データにアクセス可能（シングルテナント前提）
CREATE POLICY "Authenticated users can access all data" ON users
  FOR ALL USING (auth.role() = 'authenticated');

-- 他のテーブルも同様のポリシーを適用
```

---

## 関連ドキュメント

- [全体要件定義書](../overview/requirements.md)
- [技術スタック](./tech-stack.md)
