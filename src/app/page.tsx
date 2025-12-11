import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Send, MessageSquare, Calendar, ChevronRight } from "lucide-react";

// モックデータ
const kpiData = {
  sentCount: 142,
  replyCount: 23,
  appointmentCount: 8,
};

const pendingTasks = [
  {
    type: "承認待ち",
    count: 15,
    description: "送信ドラフト",
    href: "/outbound?status=pending",
  },
  {
    type: "未対応",
    count: 3,
    description: "受信返信",
    href: "/inbox?status=unresponded",
  },
];

export default function Home() {
  return (
    <MainLayout title="ホーム">
      <div className="space-y-6">
        {/* KPI一覧 */}
        <div>
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            今月のKPI
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">送信数</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.sentCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">返信数</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.replyCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">アポ獲得</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {kpiData.appointmentCount}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 未処理タスク一覧 */}
        <div>
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            未処理タスク一覧
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>タイプ</TableHead>
                  <TableHead>件数</TableHead>
                  <TableHead>説明</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTasks.map((task) => (
                  <TableRow key={task.type}>
                    <TableCell>
                      <Badge variant="secondary">{task.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{task.count}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {task.description}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={task.href}>
                          確認
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
