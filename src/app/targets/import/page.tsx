"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, Upload, Download, FileSpreadsheet } from "lucide-react";

const projects = [
  { id: "1", name: "SaaS営業2024Q1" },
  { id: "2", name: "金融業界開拓" },
];

const systemColumns = [
  { value: "company_name", label: "企業名" },
  { value: "industry", label: "業界" },
  { value: "estimated_revenue", label: "推定売上" },
  { value: "employee_count", label: "従業員数" },
  { value: "website_url", label: "URL" },
  { value: "contact_email", label: "メール" },
  { value: "contact_name", label: "担当者" },
  { value: "phone", label: "電話番号" },
  { value: "skip", label: "（スキップ）" },
];

// モックのCSVデータ
const mockCsvData = {
  headers: ["会社名", "業種", "年商", "社員数", "メールアドレス", "担当者名"],
  rows: [
    ["株式会社ABC", "IT", "1500000000", "120", "info@abc.co.jp", "山田太郎"],
    ["DEF商事株式会社", "商社", "800000000", "80", "contact@def.co.jp", "鈴木花子"],
    ["GHI工業", "製造", "4500000000", "350", "sales@ghi.co.jp", "佐藤一郎"],
  ],
};

export default function ImportPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState("1");
  const [uploadedFile, setUploadedFile] = useState<boolean>(false);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    会社名: "company_name",
    業種: "industry",
    年商: "estimated_revenue",
    社員数: "employee_count",
    メールアドレス: "contact_email",
    担当者名: "contact_name",
  });

  const handleFileUpload = () => {
    // TODO: 実際のファイルアップロード処理
    setUploadedFile(true);
  };

  const handleImport = () => {
    // TODO: インポート処理
    console.log("Importing with mapping:", columnMapping);
    router.push("/targets");
  };

  return (
    <MainLayout title="CSVインポート">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/targets">
            <ChevronLeft className="mr-1 h-4 w-4" />
            ターゲット一覧
          </Link>
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Step 1: ファイル選択 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 1: ファイル選択</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={handleFileUpload}
            >
              {uploadedFile ? (
                <>
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">sample.csv</p>
                  <p className="text-xs text-muted-foreground">3件のデータ</p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">
                    CSVファイルをドラッグ＆ドロップ
                  </p>
                  <p className="text-xs text-muted-foreground">
                    または クリックして選択
                  </p>
                </>
              )}
            </div>
            <Button variant="link" className="text-sm">
              <Download className="mr-2 h-4 w-4" />
              サンプルCSVをダウンロード
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: プロジェクト選択 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 2: プロジェクト選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">インポート先</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[300px]">
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
          </CardContent>
        </Card>

        {/* Step 3: カラムマッピング */}
        {uploadedFile && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 3: カラムマッピング</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CSVカラム</TableHead>
                    <TableHead></TableHead>
                    <TableHead>システムカラム</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCsvData.headers.map((header) => (
                    <TableRow key={header}>
                      <TableCell className="font-medium">{header}</TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        →
                      </TableCell>
                      <TableCell>
                        <Select
                          value={columnMapping[header] || "skip"}
                          onValueChange={(value) =>
                            setColumnMapping((prev) => ({ ...prev, [header]: value }))
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {systemColumns.map((col) => (
                              <SelectItem key={col.value} value={col.value}>
                                {col.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Step 4: プレビュー */}
        {uploadedFile && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 4: プレビュー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                インポート件数: <span className="font-medium text-foreground">3件</span>{" "}
                (重複: 0件は除外)
              </p>
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>企業名</TableHead>
                      <TableHead>業界</TableHead>
                      <TableHead>推定売上</TableHead>
                      <TableHead>従業員数</TableHead>
                      <TableHead>メール</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCsvData.rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row[0]}</TableCell>
                        <TableCell>{row[1]}</TableCell>
                        <TableCell>
                          {(parseInt(row[2]) / 100000000).toFixed(0)}億円
                        </TableCell>
                        <TableCell>{row[3]}名</TableCell>
                        <TableCell className="text-sm">{row[4]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* アクション */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/targets">キャンセル</Link>
          </Button>
          <Button onClick={handleImport} disabled={!uploadedFile}>
            インポート実行
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
