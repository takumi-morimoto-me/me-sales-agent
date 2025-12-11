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
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  MoreHorizontal,
  Search,
  Pencil,
  Trash2,
  Upload,
  Ban,
  CheckCircle,
} from "lucide-react";

// モックデータ
const targets = [
  {
    id: "1",
    companyName: "株式会社ABC",
    industry: "IT",
    estimatedRevenue: 1500000000,
    employeeCount: 120,
    contactEmail: "info@abc.co.jp",
    contactName: "山田太郎",
    isExcluded: false,
  },
  {
    id: "2",
    companyName: "DEF商事",
    industry: "商社",
    estimatedRevenue: 800000000,
    employeeCount: 80,
    contactEmail: "contact@def.co.jp",
    contactName: "鈴木花子",
    isExcluded: false,
  },
  {
    id: "3",
    companyName: "GHI工業",
    industry: "製造",
    estimatedRevenue: 4500000000,
    employeeCount: 350,
    contactEmail: "sales@ghi.co.jp",
    contactName: "佐藤一郎",
    isExcluded: true,
  },
  {
    id: "4",
    companyName: "JKLテック",
    industry: "IT",
    estimatedRevenue: 300000000,
    employeeCount: 25,
    contactEmail: "info@jkl.co.jp",
    contactName: "田中美咲",
    isExcluded: false,
  },
];

const projects = [
  { id: "1", name: "SaaS営業2024Q1" },
  { id: "2", name: "金融業界開拓" },
];

const industries = ["IT", "製造", "商社", "金融", "小売", "その他"];

const revenueRanges = [
  { value: "all", label: "すべて" },
  { value: "under_1b", label: "1億円未満" },
  { value: "1b_10b", label: "1億〜10億円" },
  { value: "10b_50b", label: "10億〜50億円" },
  { value: "50b_100b", label: "50億〜100億円" },
  { value: "over_100b", label: "100億円以上" },
];

function formatRevenue(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(0)}億円`;
  }
  return `${(value / 10000).toFixed(0)}万円`;
}

export default function TargetsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [revenueFilter, setRevenueFilter] = useState("all");
  const [showExcluded, setShowExcluded] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredTargets = targets.filter((target) => {
    if (!showExcluded && target.isExcluded) {
      return false;
    }
    if (industryFilter !== "all" && target.industry !== industryFilter) {
      return false;
    }
    if (
      searchQuery &&
      !target.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
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
    if (selectedIds.length === filteredTargets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTargets.map((t) => t.id));
    }
  };

  return (
    <MainLayout
      title="ターゲットリスト管理"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/targets/import">
              <Upload className="mr-2 h-4 w-4" />
              CSVインポート
            </Link>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新規追加
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>ターゲット企業を追加</DialogTitle>
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
                  <label className="text-sm font-medium">
                    企業名 <span className="text-destructive">*</span>
                  </label>
                  <Input placeholder="株式会社〇〇" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">業界</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">推定売上</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="10" />
                      <span className="text-sm text-muted-foreground">億円</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">従業員数</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="100" />
                      <span className="text-sm text-muted-foreground">名</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">企業サイト</label>
                  <Input placeholder="https://example.com" />
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">連絡先情報</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">担当者名</label>
                      <Input placeholder="山田太郎" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">メールアドレス</label>
                      <Input placeholder="yamada@example.com" type="email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">電話番号</label>
                      <Input placeholder="03-1234-5678" />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>追加</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <div className="space-y-4">
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
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="業界" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={revenueFilter} onValueChange={setRevenueFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="売上規模" />
            </SelectTrigger>
            <SelectContent>
              {revenueRanges.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="企業名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-excluded"
              checked={!showExcluded}
              onCheckedChange={(checked) => setShowExcluded(!checked)}
            />
            <label htmlFor="show-excluded" className="text-sm cursor-pointer">
              除外企業を非表示
            </label>
          </div>
        </div>

        {/* 一括操作 */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 py-2 px-4 bg-muted rounded-md">
            <span className="text-sm">選択中: {selectedIds.length}件</span>
            <Button variant="outline" size="sm">
              <Ban className="mr-2 h-4 w-4" />
              一括除外
            </Button>
            <Button variant="outline" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              一括解除
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
                      filteredTargets.length > 0 &&
                      selectedIds.length === filteredTargets.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>企業名</TableHead>
                <TableHead>業界</TableHead>
                <TableHead className="text-right">推定売上</TableHead>
                <TableHead className="text-right">従業員数</TableHead>
                <TableHead>メール</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead className="w-[60px]">除外</TableHead>
                <TableHead className="w-[60px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTargets.map((target) => (
                <TableRow key={target.id} className={target.isExcluded ? "opacity-50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(target.id)}
                      onCheckedChange={() => toggleSelect(target.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{target.companyName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{target.industry}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatRevenue(target.estimatedRevenue)}
                  </TableCell>
                  <TableCell className="text-right">{target.employeeCount}名</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {target.contactEmail}
                  </TableCell>
                  <TableCell>{target.contactName}</TableCell>
                  <TableCell>
                    <Checkbox checked={target.isExcluded} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          編集
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          削除
                        </DropdownMenuItem>
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
            表示: 1-{filteredTargets.length} / {targets.length}件
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
