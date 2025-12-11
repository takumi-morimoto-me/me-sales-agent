"use client";

import { useState, useCallback } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus,
  MoreHorizontal,
  Search,
  Mail,
  Eye,
  Pencil,
  Trash2,
  Upload,
  Wand2,
  Phone,
  Smartphone,
  MapPin,
} from "lucide-react";

// モックデータ
const businessCards = [
  {
    id: "1",
    name: "山田太郎",
    nameKana: "やまだ たろう",
    companyName: "株式会社ABC",
    department: "営業部",
    position: "営業部長",
    email: "yamada@abc.co.jp",
    phone: "03-1234-5678",
    mobile: "090-1234-5678",
    address: "東京都渋谷区〇〇1-2-3",
    exchangedAt: "2024/12/05",
    notes: "展示会で名刺交換。CRM導入に興味あり。",
    imageUrl: null,
  },
  {
    id: "2",
    name: "鈴木花子",
    nameKana: "すずき はなこ",
    companyName: "DEF商事",
    department: "経営企画室",
    position: "課長",
    email: "suzuki@def.co.jp",
    phone: "03-2345-6789",
    mobile: "080-2345-6789",
    address: "東京都新宿区△△2-3-4",
    exchangedAt: "2024/12/03",
    notes: "商談会でお会いした。次回アポ調整中。",
    imageUrl: null,
  },
  {
    id: "3",
    name: "佐藤一郎",
    nameKana: "さとう いちろう",
    companyName: "GHI工業",
    department: "情報システム部",
    position: "部長",
    email: "sato@ghi.co.jp",
    phone: "03-3456-7890",
    mobile: null,
    address: "神奈川県横浜市□□3-4-5",
    exchangedAt: "2024/11/28",
    notes: null,
    imageUrl: null,
  },
  {
    id: "4",
    name: "田中美咲",
    nameKana: "たなか みさき",
    companyName: "JKLテック",
    department: "マーケティング部",
    position: "マネージャー",
    email: "tanaka@jkl.co.jp",
    phone: "03-4567-8901",
    mobile: "070-4567-8901",
    address: "東京都港区◇◇4-5-6",
    exchangedAt: "2024/11/25",
    notes: "SaaS導入検討中との話。",
    imageUrl: null,
  },
];

export default function BusinessCardsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<typeof businessCards[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);

  // OCR登録用state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    name: string;
    nameKana: string;
    companyName: string;
    department: string;
    position: string;
    email: string;
    phone: string;
    mobile: string;
    address: string;
  } | null>(null);
  const [exchangedAt, setExchangedAt] = useState("");
  const [notes, setNotes] = useState("");

  // フォローメール用state
  const [emailType, setEmailType] = useState<"thanks" | "introduction" | "custom">("thanks");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const filteredCards = businessCards.filter((card) => {
    if (
      searchQuery &&
      !card.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !card.companyName.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (selectedIds.length === filteredCards.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCards.map((c) => c.id));
    }
  };

  const openDetail = (card: typeof businessCards[0]) => {
    setSelectedCard(card);
    setIsDetailOpen(true);
  };

  const openFollowUp = (card: typeof businessCards[0]) => {
    setSelectedCard(card);
    setEmailType("thanks");
    setEmailSubject("");
    setEmailBody("");
    setIsFollowUpOpen(true);
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        // 模擬的なOCR処理
        setIsProcessing(true);
        setTimeout(() => {
          setOcrResult({
            name: "山田 太郎",
            nameKana: "やまだ たろう",
            companyName: "株式会社ABC",
            department: "営業部",
            position: "部長",
            email: "yamada@abc.co.jp",
            phone: "03-1234-5678",
            mobile: "090-1234-5678",
            address: "東京都渋谷区〇〇1-2-3",
          });
          setIsProcessing(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setIsProcessing(true);
        setTimeout(() => {
          setOcrResult({
            name: "山田 太郎",
            nameKana: "やまだ たろう",
            companyName: "株式会社ABC",
            department: "営業部",
            position: "部長",
            email: "yamada@abc.co.jp",
            phone: "03-1234-5678",
            mobile: "090-1234-5678",
            address: "東京都渋谷区〇〇1-2-3",
          });
          setIsProcessing(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const resetRegisterModal = () => {
    setUploadedImage(null);
    setOcrResult(null);
    setExchangedAt("");
    setNotes("");
    setIsProcessing(false);
  };

  const generateFollowUpEmail = () => {
    if (!selectedCard) return;

    const templates = {
      thanks: {
        subject: "先日の展示会でのご挨拶のお礼",
        body: `${selectedCard.name}様

先日は展示会にて名刺交換をさせていただき、
誠にありがとうございました。

株式会社〇〇の△△と申します。

展示会でお話しさせていただいた弊社のクラウドCRMについて、
ご興味をお持ちいただけましたら、詳しい資料をお送り
させていただければと存じます。

ご検討のほど、よろしくお願いいたします。`,
      },
      introduction: {
        subject: "弊社サービスのご案内",
        body: `${selectedCard.name}様

お世話になっております。
株式会社〇〇の△△と申します。

先日の名刺交換の際にお話しさせていただいた
弊社サービスについて、改めてご案内させていただきます。

【サービス概要】
・クラウド型CRMシステム
・月額利用料からご利用可能
・導入サポート付き

ご興味がございましたら、デモのご案内も可能です。
ご検討のほど、よろしくお願いいたします。`,
      },
      custom: {
        subject: "",
        body: "",
      },
    };

    const template = templates[emailType];
    setEmailSubject(template.subject);
    setEmailBody(template.body);
  };

  return (
    <MainLayout
      title="名刺データ管理"
      actions={
        <Dialog
          open={isRegisterOpen}
          onOpenChange={(open) => {
            setIsRegisterOpen(open);
            if (!open) resetRegisterModal();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              名刺を登録
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>名刺を登録</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Step 1: 画像アップロード */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Step 1: 画像アップロード</h3>
                {!uploadedImage ? (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      名刺画像をドラッグ＆ドロップ
                    </p>
                    <p className="text-sm text-muted-foreground">
                      または クリックして選択
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      対応形式: JPG, PNG（最大5MB）
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">アップロード完了</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedImage(null);
                          setOcrResult(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {isProcessing && (
                      <p className="text-sm text-muted-foreground">OCR処理中...</p>
                    )}
                  </div>
                )}
              </div>

              {/* Step 2: OCR結果確認・編集 */}
              {ocrResult && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Step 2: OCR結果確認・編集</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      {uploadedImage && (
                        <div className="border rounded-lg p-2">
                          <p className="text-xs text-muted-foreground mb-2">画像プレビュー</p>
                          <div className="bg-muted rounded flex items-center justify-center h-40">
                            <span className="text-muted-foreground text-sm">[名刺画像]</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>
                          氏名 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          value={ocrResult.name}
                          onChange={(e) =>
                            setOcrResult({ ...ocrResult, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>会社名</Label>
                        <Input
                          value={ocrResult.companyName}
                          onChange={(e) =>
                            setOcrResult({ ...ocrResult, companyName: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>部署</Label>
                        <Input
                          value={ocrResult.department}
                          onChange={(e) =>
                            setOcrResult({ ...ocrResult, department: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>役職</Label>
                        <Input
                          value={ocrResult.position}
                          onChange={(e) =>
                            setOcrResult({ ...ocrResult, position: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>メール</Label>
                        <Input
                          type="email"
                          value={ocrResult.email}
                          onChange={(e) =>
                            setOcrResult({ ...ocrResult, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>電話</Label>
                        <Input
                          value={ocrResult.phone}
                          onChange={(e) =>
                            setOcrResult({ ...ocrResult, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>携帯</Label>
                        <Input
                          value={ocrResult.mobile}
                          onChange={(e) =>
                            setOcrResult({ ...ocrResult, mobile: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>住所</Label>
                        <Input
                          value={ocrResult.address}
                          onChange={(e) =>
                            setOcrResult({ ...ocrResult, address: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>交換日</Label>
                      <Input
                        type="date"
                        value={exchangedAt}
                        onChange={(e) => setExchangedAt(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>メモ</Label>
                    <Textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="展示会で名刺交換。CRM導入に興味あり。"
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRegisterOpen(false);
                  resetRegisterModal();
                }}
              >
                キャンセル
              </Button>
              <Button disabled={!ocrResult} onClick={() => setIsRegisterOpen(false)}>
                登録
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-4">
        {/* 検索 */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="氏名・会社名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* 一括操作 */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 py-2 px-4 bg-muted rounded-md">
            <span className="text-sm">選択中: {selectedIds.length}件</span>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              フォローメール作成
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
                      filteredCards.length > 0 &&
                      selectedIds.length === filteredCards.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>氏名</TableHead>
                <TableHead>会社名</TableHead>
                <TableHead>役職</TableHead>
                <TableHead>メール</TableHead>
                <TableHead>交換日</TableHead>
                <TableHead className="w-[60px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(card.id)}
                      onCheckedChange={() => toggleSelect(card.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{card.name}</TableCell>
                  <TableCell>{card.companyName}</TableCell>
                  <TableCell className="text-muted-foreground">{card.position}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {card.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{card.exchangedAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetail(card)}>
                          <Eye className="mr-2 h-4 w-4" />
                          詳細を見る
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          編集
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openFollowUp(card)}>
                          <Mail className="mr-2 h-4 w-4" />
                          フォローメール
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
            表示: 1-{filteredCards.length} / {businessCards.length}件
          </p>
        </div>
      </div>

      {/* 名刺詳細モーダル */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>名刺詳細</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4 py-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* 画像プレビュー */}
                <div className="border rounded-lg p-4 flex items-center justify-center h-48 bg-muted">
                  <span className="text-muted-foreground text-sm">[名刺画像]</span>
                </div>

                {/* 名刺情報 */}
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-semibold">{selectedCard.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCard.nameKana}</p>
                  </div>
                  <div>
                    <p className="font-medium">{selectedCard.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCard.department} {selectedCard.position}
                    </p>
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCard.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCard.phone}</span>
                    </div>
                    {selectedCard.mobile && (
                      <div className="flex items-center gap-2 text-sm">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCard.mobile}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCard.address}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    交換日: {selectedCard.exchangedAt}
                  </p>
                </div>
              </div>

              {/* メモ */}
              {selectedCard.notes && (
                <div className="space-y-2">
                  <Label>メモ</Label>
                  <div className="text-sm p-3 bg-muted rounded-md">
                    {selectedCard.notes}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              編集
            </Button>
            <Button
              onClick={() => {
                setIsDetailOpen(false);
                if (selectedCard) openFollowUp(selectedCard);
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              フォローメール作成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* フォローメール作成モーダル */}
      <Dialog open={isFollowUpOpen} onOpenChange={setIsFollowUpOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>フォローメール作成</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4 py-4">
              {/* 宛先 */}
              <div className="text-sm">
                <span className="text-muted-foreground">宛先: </span>
                <span>
                  {selectedCard.name}様 &lt;{selectedCard.email}&gt;
                </span>
              </div>

              {/* メールタイプ */}
              <div className="space-y-3">
                <Label>メールタイプ</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="thanks"
                      name="emailType"
                      checked={emailType === "thanks"}
                      onChange={() => setEmailType("thanks")}
                    />
                    <label htmlFor="thanks" className="text-sm">
                      名刺交換のお礼
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="introduction"
                      name="emailType"
                      checked={emailType === "introduction"}
                      onChange={() => setEmailType("introduction")}
                    />
                    <label htmlFor="introduction" className="text-sm">
                      商材のご案内
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="custom"
                      name="emailType"
                      checked={emailType === "custom"}
                      onChange={() => setEmailType("custom")}
                    />
                    <label htmlFor="custom" className="text-sm">
                      その他（自由入力）
                    </label>
                  </div>
                </div>
              </div>

              {/* AI生成ボタン */}
              <Button variant="outline" onClick={generateFollowUpEmail}>
                <Wand2 className="mr-2 h-4 w-4" />
                AI文面生成
              </Button>

              {/* 件名 */}
              <div className="space-y-2">
                <Label>件名</Label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="件名を入力..."
                />
              </div>

              {/* 本文 */}
              <div className="space-y-2">
                <Label>本文</Label>
                <Textarea
                  rows={12}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="本文を入力..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFollowUpOpen(false)}>
              キャンセル
            </Button>
            <Button disabled={!emailSubject || !emailBody}>送信</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
