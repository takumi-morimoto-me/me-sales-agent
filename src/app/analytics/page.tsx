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
import { Lightbulb } from "lucide-react";

// モックデータ
const performanceByType = [
  {
    type: "Account型",
    sent: 45,
    opened: 32,
    openRate: 71.1,
    replied: 12,
    replyRate: 26.7,
    appointments: 5,
  },
  {
    type: "Mass型",
    sent: 97,
    opened: 58,
    openRate: 59.8,
    replied: 11,
    replyRate: 11.3,
    appointments: 3,
  },
];

const performanceByIndustry = [
  { industry: "IT", sent: 58, replied: 15, replyRate: 25.9, appointments: 4 },
  { industry: "製造", sent: 42, replied: 5, replyRate: 11.9, appointments: 2 },
  { industry: "商社", sent: 25, replied: 2, replyRate: 8.0, appointments: 1 },
  { industry: "金融", sent: 12, replied: 1, replyRate: 8.3, appointments: 1 },
  { industry: "その他", sent: 5, replied: 0, replyRate: 0.0, appointments: 0 },
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
  { value: "last_6_months", label: "過去6ヶ月" },
  { value: "this_year", label: "今年" },
];

export default function AnalyticsPage() {
  const [projectFilter, setProjectFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("this_month");

  const totalSent = performanceByType.reduce((acc, row) => acc + row.sent, 0);
  const totalOpened = performanceByType.reduce((acc, row) => acc + row.opened, 0);
  const totalReplied = performanceByType.reduce((acc, row) => acc + row.replied, 0);
  const totalAppointments = performanceByType.reduce((acc, row) => acc + row.appointments, 0);

  return (
    <MainLayout title="分析・レポート">
      <div className="space-y-6">
        {/* タブ */}
        <Tabs defaultValue="effect">
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

        {/* 文面パターン別パフォーマンス */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">文面パターン別パフォーマンス</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>文面パターン</TableHead>
                  <TableHead className="text-right">送信数</TableHead>
                  <TableHead className="text-right">開封数</TableHead>
                  <TableHead className="text-right">開封率</TableHead>
                  <TableHead className="text-right">返信数</TableHead>
                  <TableHead className="text-right">返信率</TableHead>
                  <TableHead className="text-right">アポ獲得</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceByType.map((row) => (
                  <TableRow key={row.type}>
                    <TableCell className="font-medium">{row.type}</TableCell>
                    <TableCell className="text-right">{row.sent}</TableCell>
                    <TableCell className="text-right">{row.opened}</TableCell>
                    <TableCell className="text-right">{row.openRate}%</TableCell>
                    <TableCell className="text-right">{row.replied}</TableCell>
                    <TableCell className="text-right font-medium">
                      {row.replyRate}%
                    </TableCell>
                    <TableCell className="text-right">{row.appointments}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell>合計</TableCell>
                  <TableCell className="text-right">{totalSent}</TableCell>
                  <TableCell className="text-right">{totalOpened}</TableCell>
                  <TableCell className="text-right">
                    {((totalOpened / totalSent) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">{totalReplied}</TableCell>
                  <TableCell className="text-right">
                    {((totalReplied / totalSent) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">{totalAppointments}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* インサイト */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              インサイト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Account型は返信率がMass型の2.4倍高い</li>
              <li>• 売上10億円以上の企業へのAccount型アプローチが効果的</li>
            </ul>
          </CardContent>
        </Card>

        {/* 業界別パフォーマンス */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">業界別パフォーマンス</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>業界</TableHead>
                  <TableHead className="text-right">送信数</TableHead>
                  <TableHead className="text-right">返信数</TableHead>
                  <TableHead className="text-right">返信率</TableHead>
                  <TableHead className="text-right">アポ獲得</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceByIndustry.map((row) => (
                  <TableRow key={row.industry}>
                    <TableCell className="font-medium">{row.industry}</TableCell>
                    <TableCell className="text-right">{row.sent}</TableCell>
                    <TableCell className="text-right">{row.replied}</TableCell>
                    <TableCell className="text-right font-medium">
                      {row.replyRate}%
                    </TableCell>
                    <TableCell className="text-right">{row.appointments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
