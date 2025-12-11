"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// モックデータ
const sendHistory = [
  {
    id: "1",
    sentAt: "2024/12/10 15:30",
    companyName: "株式会社ABC",
    sentTo: "info@abc.co.jp",
    subject: "業務効率化のご提案",
    deliveryStatus: "delivered" as const,
  },
  {
    id: "2",
    sentAt: "2024/12/10 15:25",
    companyName: "DEF商事",
    sentTo: "contact@def.co.jp",
    subject: "ツール導入のご案内",
    deliveryStatus: "delivered" as const,
  },
  {
    id: "3",
    sentAt: "2024/12/10 14:00",
    companyName: "GHI工業",
    sentTo: "sales@ghi.co.jp",
    subject: "DX推進のご相談",
    deliveryStatus: "bounced" as const,
  },
  {
    id: "4",
    sentAt: "2024/12/09 18:00",
    companyName: "JKLテック",
    sentTo: "info@jkl.co.jp",
    subject: "無料トライアルのご案内",
    deliveryStatus: "delivered" as const,
  },
];

const projects = [
  { id: "1", name: "SaaS営業2024Q1" },
  { id: "2", name: "金融業界開拓" },
];

const periodOptions = [
  { value: "this_week", label: "今週" },
  { value: "this_month", label: "今月" },
  { value: "last_month", label: "先月" },
  { value: "last_3_months", label: "過去3ヶ月" },
];

type DeliveryStatus = "sent" | "delivered" | "bounced" | "failed";

const deliveryStatusConfig: Record<
  DeliveryStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  sent: { label: "送信済み", variant: "secondary" },
  delivered: { label: "配信成功", variant: "default" },
  bounced: { label: "バウンス", variant: "destructive" },
  failed: { label: "送信失敗", variant: "destructive" },
};

export default function OutboundHistoryPage() {
  const [projectFilter, setProjectFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("this_month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHistory, setSelectedHistory] = useState<typeof sendHistory[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openDetail = (history: typeof sendHistory[0]) => {
    setSelectedHistory(history);
    setIsDetailOpen(true);
  };

  return (
    <MainLayout title="アプローチタスク管理">
      <div className="space-y-4">
        {/* タブ */}
        <Tabs defaultValue="history">
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
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="期間" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="配信状況" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="delivered">配信成功</SelectItem>
              <SelectItem value="bounced">バウンス</SelectItem>
              <SelectItem value="failed">送信失敗</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* テーブル */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>送信日時</TableHead>
                <TableHead>企業名</TableHead>
                <TableHead>送信先</TableHead>
                <TableHead>件名</TableHead>
                <TableHead>配信状況</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sendHistory.map((history) => (
                <TableRow key={history.id}>
                  <TableCell className="text-muted-foreground">
                    {history.sentAt}
                  </TableCell>
                  <TableCell className="font-medium">{history.companyName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {history.sentTo}
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-left hover:underline"
                      onClick={() => openDetail(history)}
                    >
                      {history.subject}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={deliveryStatusConfig[history.deliveryStatus].variant}>
                      {deliveryStatusConfig[history.deliveryStatus].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ページネーション */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            表示: 1-{sendHistory.length} / {sendHistory.length}件
          </p>
        </div>
      </div>

      {/* 詳細モーダル */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>送信詳細</DialogTitle>
          </DialogHeader>
          {selectedHistory && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">送信日時:</span>
                    <span>{selectedHistory.sentAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">企業名:</span>
                    <span>{selectedHistory.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">送信先:</span>
                    <span>{selectedHistory.sentTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">配信状況:</span>
                    <Badge variant={deliveryStatusConfig[selectedHistory.deliveryStatus].variant}>
                      {deliveryStatusConfig[selectedHistory.deliveryStatus].label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">件名</label>
                <p className="text-sm p-3 bg-muted rounded-md">
                  {selectedHistory.companyName}様｜{selectedHistory.subject}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">本文</label>
                <div className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap">
                  {`山田太郎様

突然のご連絡失礼いたします。
株式会社〇〇の△△と申します。

御社のIT業界でのご活躍を拝見し、
弊社のクラウドCRMが御社の営業効率化に
お役に立てるのではないかと考え、ご連絡いたしました。

...`}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
