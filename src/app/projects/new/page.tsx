"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ChevronLeft, Save } from "lucide-react";

const thresholdOptions = [
  { value: "100000000", label: "1億円" },
  { value: "500000000", label: "5億円" },
  { value: "1000000000", label: "10億円" },
  { value: "5000000000", label: "50億円" },
  { value: "10000000000", label: "100億円" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [project, setProject] = useState({
    name: "",
    productDescription: "",
    targetPersona: "",
    strategyThreshold: "1000000000",
  });

  const handleSave = () => {
    // TODO: 保存処理
    console.log("Creating project:", project);
    router.push("/projects");
  };

  return (
    <MainLayout
      title="新規プロジェクト"
      actions={
        <Button onClick={handleSave} disabled={!project.name}>
          <Save className="mr-2 h-4 w-4" />
          作成
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

      <div className="space-y-6 max-w-2xl">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                プロジェクト名 <span className="text-destructive">*</span>
              </label>
              <Input
                value={project.name}
                onChange={(e) => setProject({ ...project, name: e.target.value })}
                placeholder="例: SaaS営業2024Q1"
              />
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
                value={project.strategyThreshold}
                onValueChange={(value) =>
                  setProject({ ...project, strategyThreshold: value })
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
                • {thresholdOptions.find((o) => o.value === project.strategyThreshold)?.label}未満 → Mass型（LP誘導）
              </p>
              <p>
                • {thresholdOptions.find((o) => o.value === project.strategyThreshold)?.label}以上 → Account型（個別対応）
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
