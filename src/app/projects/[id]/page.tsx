"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChevronLeft, Plus, Pencil, Trash2, Save } from "lucide-react";

// モックデータ
const projectData = {
  id: "1",
  name: "SaaS営業2024Q1",
  status: "active",
  productDescription:
    "クラウド型CRMシステム。月額5万円から導入可能。導入企業は平均30%の営業効率改善を実現。",
  targetPersona:
    "従業員50-500名の中堅企業。営業部門の責任者。既存のExcel管理に課題を感じている企業。",
  strategyThreshold: 1000000000, // 10億円
};

const templates = [
  {
    id: "1",
    type: "mass" as const,
    name: "LP誘導_標準",
  },
  {
    id: "2",
    type: "account" as const,
    name: "課題ヒアリング_標準",
  },
];

const thresholdOptions = [
  { value: "100000000", label: "1億円" },
  { value: "500000000", label: "5億円" },
  { value: "1000000000", label: "10億円" },
  { value: "5000000000", label: "50億円" },
  { value: "10000000000", label: "100億円" },
];

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState(projectData);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<{
    type: "mass" | "account";
    name: string;
    subjectTemplate: string;
    bodyTemplate: string;
  } | null>(null);

  const handleSave = () => {
    // TODO: 保存処理
    console.log("Saving project:", project);
  };

  return (
    <MainLayout
      title={project.name}
      actions={
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存
        </Button>
      }
    >
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">
            <ChevronLeft className="mr-1 h-4 w-4" />
            プロジェクト一覧
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">プロジェクト名</label>
                <Input
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ステータス</label>
                <Select
                  value={project.status}
                  onValueChange={(value) => setProject({ ...project, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 商材情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">商材情報</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={project.productDescription}
              onChange={(e) =>
                setProject({ ...project, productDescription: e.target.value })
              }
              rows={4}
              placeholder="商材の説明を入力してください..."
            />
          </CardContent>
        </Card>

        {/* ターゲットペルソナ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ターゲットペルソナ</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={project.targetPersona}
              onChange={(e) =>
                setProject({ ...project, targetPersona: e.target.value })
              }
              rows={4}
              placeholder="ターゲットペルソナを入力してください..."
            />
          </CardContent>
        </Card>

        {/* アプローチ分岐設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">アプローチ分岐設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">売上閾値</label>
              <Select
                value={project.strategyThreshold.toString()}
                onValueChange={(value) =>
                  setProject({ ...project, strategyThreshold: parseInt(value) })
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {thresholdOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • {thresholdOptions.find((o) => o.value === project.strategyThreshold.toString())?.label}未満 → Mass型（LP誘導）
              </p>
              <p>
                • {thresholdOptions.find((o) => o.value === project.strategyThreshold.toString())?.label}以上 → Account型（個別対応）
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 文面パターン */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">文面パターン</CardTitle>
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() =>
                    setEditingTemplate({
                      type: "mass",
                      name: "",
                      subjectTemplate: "",
                      bodyTemplate: "",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  新規テンプレート
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>文面テンプレート編集</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">テンプレート名</label>
                      <Input
                        value={editingTemplate?.name || ""}
                        onChange={(e) =>
                          setEditingTemplate((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">タイプ</label>
                      <Select
                        value={editingTemplate?.type || "mass"}
                        onValueChange={(value: "mass" | "account") =>
                          setEditingTemplate((prev) =>
                            prev ? { ...prev, type: value } : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mass">Mass</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">件名テンプレート</label>
                    <Input
                      value={editingTemplate?.subjectTemplate || ""}
                      onChange={(e) =>
                        setEditingTemplate((prev) =>
                          prev ? { ...prev, subjectTemplate: e.target.value } : null
                        )
                      }
                      placeholder="{{company_name}}様｜業務効率化のご提案"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">本文テンプレート</label>
                    <Textarea
                      value={editingTemplate?.bodyTemplate || ""}
                      onChange={(e) =>
                        setEditingTemplate((prev) =>
                          prev ? { ...prev, bodyTemplate: e.target.value } : null
                        )
                      }
                      rows={8}
                      placeholder="{{contact_name}}様&#10;&#10;突然のご連絡失礼いたします..."
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">使用可能な変数:</p>
                    <p>
                      {"{{company_name}}, {{contact_name}}, {{industry}}, {{product_description}}, {{lp_url}}"}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={() => setIsTemplateDialogOpen(false)}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>タイプ</TableHead>
                  <TableHead>テンプレート名</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <Badge variant={template.type === "mass" ? "secondary" : "default"}>
                        {template.type === "mass" ? "Mass" : "Account"}
                      </Badge>
                    </TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingTemplate({
                              type: template.type,
                              name: template.name,
                              subjectTemplate: "",
                              bodyTemplate: "",
                            });
                            setIsTemplateDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
