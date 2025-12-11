"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// モックデータ
const weeklyTrends = [
  {
    period: "2024-W50",
    sent: 42,
    replied: 8,
    replyRate: 19.0,
    appointments: 3,
    change: 5.2,
  },
  {
    period: "2024-W49",
    sent: 38,
    replied: 5,
    replyRate: 13.2,
    appointments: 2,
    change: -2.1,
  },
  {
    period: "2024-W48",
    sent: 35,
    replied: 6,
    replyRate: 17.1,
    appointments: 1,
    change: 8.3,
  },
  {
    period: "2024-W47",
    sent: 28,
    replied: 4,
    replyRate: 14.3,
    appointments: 2,
    change: null,
  },
];

const monthlyTrends = [
  {
    period: "2024年12月",
    sent: 80,
    replied: 13,
    replyRate: 16.3,
    appointments: 5,
    change: 18.2,
  },
  {
    period: "2024年11月",
    sent: 62,
    replied: 10,
    replyRate: 16.1,
    appointments: 3,
    change: -5.0,
  },
  {
    period: "2024年10月",
    sent: 55,
    replied: 9,
    replyRate: 16.4,
    appointments: 2,
    change: null,
  },
];

const projects = [
  { id: "1", name: "SaaS営業2024Q1" },
  { id: "2", name: "金融業界開拓" },
];

const unitOptions = [
  { value: "weekly", label: "週次" },
  { value: "monthly", label: "月次" },
];

const periodOptions = [
  { value: "last_month", label: "過去1ヶ月" },
  { value: "last_3_months", label: "過去3ヶ月" },
  { value: "last_6_months", label: "過去6ヶ月" },
  { value: "this_year", label: "今年" },
];

function ChangeIndicator({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (change > 0) {
    return (
      <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
        <TrendingUp className="h-4 w-4" />↑ +{change}%
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="flex items-center gap-1 text-red-600 dark:text-red-500">
        <TrendingDown className="h-4 w-4" />↓ {change}%
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-muted-foreground">
      <Minus className="h-4 w-4" />
      0%
    </span>
  );
}

export default function AnalyticsTrendsPage() {
  const [projectFilter, setProjectFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("weekly");
  const [periodFilter, setPeriodFilter] = useState("last_3_months");

  const currentData = unitFilter === "weekly" ? weeklyTrends : monthlyTrends;

  return (
    <MainLayout title="分析・レポート">
      <div className="space-y-6">
        {/* タブ */}
        <Tabs defaultValue="trends">
          <TabsList>
            <TabsTrigger value="effect" asChild>
              <Link href="/analytics">施策別効果</Link>
            </TabsTrigger>
            <TabsTrigger value="trends" asChild>
              <Link href="/analytics/trends">期間別推移</Link>
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
          <Select value={unitFilter} onValueChange={setUnitFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="単位" />
            </SelectTrigger>
            <SelectContent>
              {unitOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
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
        </div>

        {/* 週次/月次パフォーマンス推移 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {unitFilter === "weekly" ? "週次" : "月次"}パフォーマンス推移
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>期間</TableHead>
                  <TableHead className="text-right">送信数</TableHead>
                  <TableHead className="text-right">返信数</TableHead>
                  <TableHead className="text-right">返信率</TableHead>
                  <TableHead className="text-right">アポ獲得</TableHead>
                  <TableHead className="text-right">
                    {unitFilter === "weekly" ? "前週比" : "前月比"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row) => (
                  <TableRow key={row.period}>
                    <TableCell className="font-medium">{row.period}</TableCell>
                    <TableCell className="text-right">{row.sent}</TableCell>
                    <TableCell className="text-right">{row.replied}</TableCell>
                    <TableCell className="text-right font-medium">
                      {row.replyRate}%
                    </TableCell>
                    <TableCell className="text-right">{row.appointments}</TableCell>
                    <TableCell className="text-right">
                      <ChangeIndicator change={row.change} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 月次サマリー（週次表示時のみ） */}
        {unitFilter === "weekly" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">月次サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>期間</TableHead>
                    <TableHead className="text-right">送信数</TableHead>
                    <TableHead className="text-right">返信数</TableHead>
                    <TableHead className="text-right">返信率</TableHead>
                    <TableHead className="text-right">アポ獲得</TableHead>
                    <TableHead className="text-right">前月比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyTrends.map((row) => (
                    <TableRow key={row.period}>
                      <TableCell className="font-medium">{row.period}</TableCell>
                      <TableCell className="text-right">{row.sent}</TableCell>
                      <TableCell className="text-right">{row.replied}</TableCell>
                      <TableCell className="text-right font-medium">
                        {row.replyRate}%
                      </TableCell>
                      <TableCell className="text-right">{row.appointments}</TableCell>
                      <TableCell className="text-right">
                        <ChangeIndicator change={row.change} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
