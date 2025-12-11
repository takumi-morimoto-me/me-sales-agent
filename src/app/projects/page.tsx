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
import { Plus, MoreHorizontal, Search, Pencil, Archive, Trash2 } from "lucide-react";

// モックデータ
const projects = [
  {
    id: "1",
    name: "SaaS営業2024Q1",
    productDescription: "クラウドCRM",
    targetCount: 245,
    status: "active" as const,
  },
  {
    id: "2",
    name: "金融業界開拓",
    productDescription: "セキュリティソリューション",
    targetCount: 128,
    status: "active" as const,
  },
  {
    id: "3",
    name: "製造業DX推進",
    productDescription: "IoTセンサー",
    targetCount: 89,
    status: "archived" as const,
  },
];

export default function ProjectsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = projects.filter((project) => {
    if (statusFilter !== "all" && project.status !== statusFilter) {
      return false;
    }
    if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) {
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
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map((p) => p.id));
    }
  };

  return (
    <MainLayout
      title="プロジェクト管理"
      actions={
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            新規プロジェクト
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        {/* フィルター */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* テーブル */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      filteredProjects.length > 0 &&
                      selectedIds.length === filteredProjects.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>プロジェクト名</TableHead>
                <TableHead>商材</TableHead>
                <TableHead className="text-right">ターゲット数</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="w-[60px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(project.id)}
                      onCheckedChange={() => toggleSelect(project.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-medium hover:underline"
                    >
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.productDescription}
                  </TableCell>
                  <TableCell className="text-right">{project.targetCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={project.status === "active" ? "default" : "secondary"}
                    >
                      {project.status === "active" ? "Active" : "Archived"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            編集
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          アーカイブ
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
      </div>
    </MainLayout>
  );
}
