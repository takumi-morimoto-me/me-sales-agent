"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  MoreHorizontal,
  Search,
  Mail,
  MailOpen,
  CheckCircle,
  Wand2,
  Calendar,
  Send,
} from "lucide-react";

// モックデータ
const inboxMessages = [
  {
    id: "1",
    fromName: "山田太郎",
    fromEmail: "info@abc.co.jp",
    subject: "Re: 業務効率化についてのご提案",
    receivedAt: "2024/12/10 15:30",
    isRead: false,
    responseStatus: "unresponded" as const,
  },
  {
    id: "2",
    fromName: "鈴木花子",
    fromEmail: "contact@def.co.jp",
    subject: "Re: ツール導入のご案内",
    receivedAt: "2024/12/10 14:00",
    isRead: true,
    responseStatus: "unresponded" as const,
  },
  {
    id: "3",
    fromName: "佐藤一郎",
    fromEmail: "sales@ghi.co.jp",
    subject: "Re: DX推進のご相談",
    receivedAt: "2024/12/09 18:00",
    isRead: true,
    responseStatus: "responded" as const,
  },
];

export default function InboxPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<typeof inboxMessages[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");

  const filteredMessages = inboxMessages.filter((msg) => {
    if (statusFilter !== "all" && msg.responseStatus !== statusFilter) {
      return false;
    }
    if (readFilter === "unread" && msg.isRead) {
      return false;
    }
    if (readFilter === "read" && !msg.isRead) {
      return false;
    }
    if (
      searchQuery &&
      !msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !msg.fromName.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id));
    }
  };

  const openDetail = (message: typeof inboxMessages[0]) => {
    setSelectedMessage(message);
    setReplySubject(`Re: ${message.subject.replace(/^Re: /, "")}`);
    setReplyBody("");
    setIsDetailOpen(true);
  };

  const generateAIReply = () => {
    // TODO: AI返信生成
    setReplyBody(`${selectedMessage?.fromName}様

お世話になっております。
ご連絡ありがとうございます。

ご興味をお持ちいただきありがとうございます。
ぜひ詳しくお話しさせていただければと存じます。

ご都合のよろしい日時をお知らせいただけますでしょうか。

よろしくお願いいたします。`);
  };

  const insertAvailableSlots = () => {
    const slots = `

下記の日程でご都合いかがでしょうか。

・12/16（月）14:00-15:00
・12/17（火）10:00-11:00
・12/18（水）13:00-14:00

ご都合の良い日時をお知らせください。`;
    setReplyBody((prev) => prev + slots);
  };

  return (
    <MainLayout
      title="受信トレイ"
      actions={
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              手動登録
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>メッセージを登録</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">送信者名</label>
                  <Input placeholder="山田太郎" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    メールアドレス <span className="text-destructive">*</span>
                  </label>
                  <Input placeholder="yamada@example.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">関連企業</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="企業を選択（任意）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">株式会社ABC</SelectItem>
                    <SelectItem value="2">DEF商事</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">受信日</label>
                  <Input type="date" defaultValue="2024-12-10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">受信時刻</label>
                  <Input type="time" defaultValue="15:30" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">件名</label>
                <Input placeholder="Re: お問い合わせについて" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  本文 <span className="text-destructive">*</span>
                </label>
                <Textarea rows={6} placeholder="メール本文を入力..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRegisterOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={() => setIsRegisterOpen(false)}>登録</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-4">
        {/* フィルター */}
        <div className="flex flex-wrap items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="対応状況" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="unresponded">未対応</SelectItem>
              <SelectItem value="responded">対応済み</SelectItem>
            </SelectContent>
          </Select>
          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="既読" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="unread">未読のみ</SelectItem>
              <SelectItem value="read">既読のみ</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* 一括操作 */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 py-2 px-4 bg-muted rounded-md">
            <span className="text-sm">選択中: {selectedIds.length}件</span>
            <Button variant="outline" size="sm">
              <MailOpen className="mr-2 h-4 w-4" />
              既読にする
            </Button>
            <Button variant="outline" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              対応済みにする
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
                      filteredMessages.length > 0 &&
                      selectedIds.length === filteredMessages.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[30px]">状態</TableHead>
                <TableHead>送信元</TableHead>
                <TableHead>件名</TableHead>
                <TableHead>受信日時</TableHead>
                <TableHead>対応</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow
                  key={message.id}
                  className={!message.isRead ? "bg-accent/30" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(message.id)}
                      onCheckedChange={() => toggleSelect(message.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {message.isRead ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{message.fromName}</div>
                      <div className="text-sm text-muted-foreground">
                        {message.fromEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-left hover:underline"
                      onClick={() => openDetail(message)}
                    >
                      {message.subject}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {message.receivedAt}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        message.responseStatus === "responded"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {message.responseStatus === "responded" ? "対応済" : "未対応"}
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
            表示: 1-{filteredMessages.length} / {inboxMessages.length}件
          </p>
        </div>
      </div>

      {/* メッセージ詳細モーダル */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>受信メッセージ</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 py-4">
              {/* 送信元情報 */}
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-medium">送信元情報</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">送信者:</span>
                    <span>{selectedMessage.fromName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">メール:</span>
                    <span>{selectedMessage.fromEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">企業:</span>
                    <span>株式会社ABC（関連付け済み）</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">受信日時:</span>
                    <span>{selectedMessage.receivedAt}</span>
                  </div>
                </div>
              </div>

              {/* 件名 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">件名</label>
                <p className="text-sm p-3 bg-muted rounded-md">
                  {selectedMessage.subject}
                </p>
              </div>

              {/* 本文 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">本文</label>
                <div className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap">
                  {`お世話になっております。
株式会社ABCの山田です。

ご連絡ありがとうございます。
ご提案いただいた内容について、詳しくお話を伺いたいと考えております。

来週のどこかでお時間いただけますでしょうか。

よろしくお願いいたします。`}
                </div>
              </div>

              {/* 返信作成 */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">返信を作成</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={generateAIReply}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      AI返信提案
                    </Button>
                    <Button variant="outline" size="sm" onClick={insertAvailableSlots}>
                      <Calendar className="mr-2 h-4 w-4" />
                      空き時間を挿入
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">件名</label>
                  <Input
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">本文</label>
                  <Textarea
                    rows={8}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="返信内容を入力..."
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              対応済みにする
            </Button>
            <Button disabled={!replyBody}>
              <Send className="mr-2 h-4 w-4" />
              返信を送信
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
