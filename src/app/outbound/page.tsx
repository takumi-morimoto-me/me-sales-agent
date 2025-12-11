"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Wand2,
  Check,
  X,
  Send,
  RefreshCw,
  Eye,
} from "lucide-react";

type TaskStatus = "pending" | "approved" | "rejected" | "sent";
type AppliedType = "mass" | "account";

interface OutboundTask {
  id: string;
  companyName: string;
  appliedType: AppliedType;
  subject: string;
  status: TaskStatus;
  createdAt: string;
}

// モックデータ
const outboundTasks: OutboundTask[] = [
  {
    id: "1",
    companyName: "株式会社ABC",
    appliedType: "account",
    subject: "業務効率化のご提案",
    status: "pending",
    createdAt: "2024/12/10",
  },
  {
    id: "2",
    companyName: "DEF商事",
    appliedType: "mass",
    subject: "ツール導入のご案内",
    status: "pending",
    createdAt: "2024/12/10",
  },
  {
    id: "3",
    companyName: "GHI工業",
    appliedType: "account",
    subject: "DX推進のご相談",
    status: "approved",
    createdAt: "2024/12/09",
  },
  {
    id: "4",
    companyName: "JKLテック",
    appliedType: "mass",
    subject: "無料トライアルのご案内",
    status: "sent",
    createdAt: "2024/12/08",
  },
];

const projects = [
  { id: "1", name: "SaaS営業2024Q1" },
  { id: "2", name: "金融業界開拓" },
];

const statusConfig: Record<TaskStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "承認待ち", variant: "secondary" },
  approved: { label: "承認済み", variant: "default" },
  rejected: { label: "却下", variant: "outline" },
  sent: { label: "送信済み", variant: "default" },
};

export default function OutboundPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<typeof outboundTasks[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const filteredTasks = outboundTasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false;
    }
    if (typeFilter !== "all" && task.appliedType !== typeFilter) {
      return false;
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map((t) => t.id));
    }
  };

  const openDetail = (task: typeof outboundTasks[0]) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  return (
    <MainLayout
      title="アプローチタスク管理"
      actions={
        <Button onClick={() => setIsGenerateOpen(true)}>
          <Wand2 className="mr-2 h-4 w-4" />
          ドラフト一括生成
        </Button>
      }
    >
      <div className="space-y-4">
        {/* タブ */}
        <Tabs defaultValue="queue">
          <TabsList>
            <TabsTrigger value="queue" asChild>
              <Link href="/outbound">承認キュー</Link>
            </TabsTrigger>
            <TabsTrigger value="history" asChild>
              <Link href="/outbound/history">送信履歴</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* フィルター */}
        <div className="flex flex-wrap items-center gap-4">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="プロジェクト" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="pending">承認待ち</SelectItem>
              <SelectItem value="approved">承認済み</SelectItem>
              <SelectItem value="rejected">却下</SelectItem>
              <SelectItem value="sent">送信済み</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="タイプ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="mass">Mass</SelectItem>
              <SelectItem value="account">Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 一括操作 */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 py-2 px-4 bg-muted rounded-md">
            <span className="text-sm">選択中: {selectedIds.length}件</span>
            <Button variant="outline" size="sm">
              <Check className="mr-2 h-4 w-4" />
              一括承認
            </Button>
            <Button variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              一括却下
            </Button>
          </div>
        )}

        {/* テーブル */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      filteredTasks.length > 0 &&
                      selectedIds.length === filteredTasks.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>企業名</TableHead>
                <TableHead>タイプ</TableHead>
                <TableHead>件名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead className="w-[60px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(task.id)}
                      onCheckedChange={() => toggleSelect(task.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{task.companyName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={task.appliedType === "account" ? "default" : "secondary"}
                    >
                      {task.appliedType === "account" ? "Account" : "Mass"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-left hover:underline"
                      onClick={() => openDetail(task)}
                    >
                      {task.subject}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[task.status].variant}>
                      {statusConfig[task.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {task.createdAt}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetail(task)}>
                          <Eye className="mr-2 h-4 w-4" />
                          詳細を見る
                        </DropdownMenuItem>
                        {task.status === "pending" && (
                          <>
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              承認
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <X className="mr-2 h-4 w-4" />
                              却下
                            </DropdownMenuItem>
                          </>
                        )}
                        {task.status === "approved" && (
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            送信
                          </DropdownMenuItem>
                        )}
                        {task.status === "rejected" && (
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            再生成
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ページネーション */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            表示: 1-{filteredTasks.length} / {outboundTasks.length}件
          </p>
        </div>
      </div>

      {/* ドラフト詳細モーダル */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ドラフト詳細</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-medium">送信先情報</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">企業名:</span>
                    <span>{selectedTask.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">担当者:</span>
                    <span>山田太郎</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">メール:</span>
                    <span>info@example.co.jp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">推定売上:</span>
                    <span>15億円</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">適用タイプ:</span>
                    <Badge
                      variant={
                        selectedTask.appliedType === "account" ? "default" : "secondary"
                      }
                    >
                      {selectedTask.appliedType === "account" ? "Account" : "Mass"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">件名</label>
                <Input defaultValue={`${selectedTask.companyName}様｜${selectedTask.subject}`} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">本文</label>
                <Textarea
                  rows={10}
                  defaultValue={`山田太郎様

突然のご連絡失礼いたします。
株式会社〇〇の△△と申します。

御社のIT業界でのご活躍を拝見し、
弊社のクラウドCRMが御社の営業効率化に
お役に立てるのではないかと考え、ご連絡いたしました。

...`}
                />
              </div>

              <div className="rounded-lg border p-4 space-y-1">
                <p className="text-sm font-medium">履歴</p>
                <div className="text-sm text-muted-foreground">
                  <p>12/10 14:30 作成（AI生成）</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              却下
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              再生成
            </Button>
            <Button variant="outline">保存</Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              承認して送信
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ドラフト一括生成モーダル */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>ドラフト一括生成</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">プロジェクト</label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">対象ターゲット</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="radio" name="target" id="all" defaultChecked />
                  <label htmlFor="all" className="text-sm">
                    未処理のターゲットすべて（142件）
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="target" id="selected" />
                  <label htmlFor="selected" className="text-sm">
                    選択したターゲットのみ（0件選択中）
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-medium">生成設定</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span>売上10億円以上 → Account型テンプレートを使用</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span>売上10億円未満 → Mass型テンプレートを使用</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ※ プロジェクトの分岐設定に基づいて自動判定されます
              </p>
            </div>

            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              ⚠️ 注意: 生成には数分かかる場合があります
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={() => setIsGenerateOpen(false)}>生成開始</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
