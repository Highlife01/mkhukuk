import { useMemo, useState, useEffect, type ChangeEvent, type ReactNode } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, updateDoc, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getAiAssistantReply } from "@/lib/ai";
import { Trash2, CheckCircle, XCircle, FileText, Scale as LucideScale, Briefcase, Users, Shield, Globe, Home as LucideHome } from "lucide-react";

type StatusTone = "gold" | "green" | "red" | "blue" | "slate" | "burgundy";

type FileRecord = {
  id: number;
  title: string;
  type: string;
  client: string;
  opponent: string;
  court: string;
  fileNo: string;
  decisionNo: string;
  subject: string;
  status: string;
  hearingDate: string;
  lastAction: string;
  powerOfAttorney: string;
  collection: string;
  importance: StatusTone;
};

type ClientRecord = {
  name: string;
  phone: string;
  email: string;
  address: string;
  tcVergi: string;
  files: string[];
  paymentStatus: string;
  notes: string;
  documents: number;
  appointments: string;
  risk: StatusTone;
};

type TaskRecord = {
  id: number;
  title: string;
  file: string;
  owner: string;
  due: string;
  status: "Yeni" | "Devam ediyor" | "Beklemede" | "Tamamlandı" | "Gecikti";
};

const brand = {
  name: "Av. Mahmut Kaya",
  product: "Mahmut Kaya Hukuk Bürosu Yönetim Paneli",
  subtitle: "Dosya, Duruşma, Müvekkil ve Tahsilat Yönetim Sistemi",
  slogan: "Hukuki süreçlerinizi güvenle yönetin.",
  barNo: "Adana Barosu 4321",
};

const menuItems = [
  "Dashboard",
  "Dosyalar",
  "Müvekkiller",
  "Duruşmalar",
  "Takvim",
  "İcra Takipleri",
  "Arabuluculuk",
  "Evraklar",
  "Dilekçe Şablonları",
  "Görevler",
  "Tahsilat / Muhasebe",
  "Raporlar",
  "Müvekkil Portalı",
  "AI Hukuk Asistanı",
  "Kullanıcılar",
  "Ayarlar",
];

const dashboardStats = [
  { label: "Duruşma", value: "3", detail: "bugün" },
  { label: "Bekleyen görev", value: "5", detail: "aksiyon" },
  { label: "Yaklaşan süre", value: "2", detail: "kritik" },
  { label: "Müvekkil talebi", value: "4", detail: "yanıt bekliyor" },
  { label: "Aktif dosya", value: "18", detail: "takipte" },
];

const todayHearings = [
  {
    time: "09:15",
    court: "Adana 2. İş Mahkemesi",
    fileNo: "2025/318 E.",
    client: "Mehmet Demir",
    subject: "İşçilik alacağı",
  },
  {
    time: "10:30",
    court: "Adana 3. Aile Mahkemesi",
    fileNo: "2026/145 E.",
    client: "Ahmet Yılmaz",
    subject: "Boşanma davası",
  },
  {
    time: "14:20",
    court: "Adana 7. Asliye Hukuk Mahkemesi",
    fileNo: "2024/692 E.",
    client: "Zeynep Arslan",
    subject: "Tapu iptal ve tescil",
  },
];

const deadlines = [
  { title: "Cevap dilekçesi son günü", file: "Yılmaz / Kaya", date: "18.05.2026", tone: "red" as StatusTone },
  { title: "İstinaf başvuru süresi", file: "Demir İşçilik", date: "21.05.2026", tone: "gold" as StatusTone },
  { title: "İtiraz süresi kontrolü", file: "İcra 2026/901", date: "24.05.2026", tone: "blue" as StatusTone },
];

const files: FileRecord[] = [
  {
    id: 1,
    title: "Ahmet Yılmaz - Boşanma Davası",
    type: "Aile hukuku",
    client: "Ahmet Yılmaz",
    opponent: "Elif Yılmaz",
    court: "Adana 3. Aile Mahkemesi",
    fileNo: "2026/145 E.",
    decisionNo: "-",
    subject: "Anlaşmalı boşanma protokolü ve velayet düzenlemesi",
    status: "Duruşma bekleniyor",
    hearingDate: "20.05.2026 10:30",
    lastAction: "14.05.2026",
    powerOfAttorney: "Tamamlandı",
    collection: "Kısmi tahsilat",
    importance: "gold",
  },
  {
    id: 2,
    title: "Mehmet Demir - İşçilik Alacağı",
    type: "İş hukuku",
    client: "Mehmet Demir",
    opponent: "Akdeniz Lojistik A.Ş.",
    court: "Adana 2. İş Mahkemesi",
    fileNo: "2025/318 E.",
    decisionNo: "-",
    subject: "Kıdem, ihbar ve fazla mesai alacağı",
    status: "Bilirkişi raporu bekleniyor",
    hearingDate: "20.05.2026 09:15",
    lastAction: "12.05.2026",
    powerOfAttorney: "Tamamlandı",
    collection: "25.000 TL bekliyor",
    importance: "red",
  },
  {
    id: 3,
    title: "Zeynep Arslan - Tapu İptal ve Tescil",
    type: "Gayrimenkul / tapu",
    client: "Zeynep Arslan",
    opponent: "Murat Arslan",
    court: "Adana 7. Asliye Hukuk Mahkemesi",
    fileNo: "2024/692 E.",
    decisionNo: "-",
    subject: "Muris muvazaası nedeniyle tapu iptal ve tescil",
    status: "Keşif bekleniyor",
    hearingDate: "20.05.2026 14:20",
    lastAction: "10.05.2026",
    powerOfAttorney: "Eksik belge bekleniyor",
    collection: "Tahsil edildi",
    importance: "green",
  },
  {
    id: 4,
    title: "Nova Ticaret - İcra Takibi",
    type: "İcra dosyası",
    client: "Nova Ticaret Ltd.",
    opponent: "Çukurova İnşaat",
    court: "Adana 5. İcra Dairesi",
    fileNo: "2026/901 E.",
    decisionNo: "-",
    subject: "Cari hesap alacağı için ilamsız takip",
    status: "Tebligat bekleniyor",
    hearingDate: "-",
    lastAction: "15.05.2026",
    powerOfAttorney: "Tamamlandı",
    collection: "Bekliyor",
    importance: "blue",
  },
];

const clients: ClientRecord[] = [
  {
    name: "Ahmet Yılmaz",
    phone: "+90 532 111 22 33",
    email: "ahmet.yilmaz@example.com",
    address: "Seyhan / Adana",
    tcVergi: "12345678910",
    files: ["Boşanma Davası"],
    paymentStatus: "Kısmi ödeme",
    notes: "Protokol maddeleri için ikinci görüşme yapılacak.",
    documents: 8,
    appointments: "2 randevu",
    risk: "gold",
  },
  {
    name: "Mehmet Demir",
    phone: "+90 542 444 55 66",
    email: "mehmet.demir@example.com",
    address: "Çukurova / Adana",
    tcVergi: "98765432100",
    files: ["İşçilik Alacağı"],
    paymentStatus: "25.000 TL kalan",
    notes: "Tanık listesi ve SGK dökümleri kontrol edilecek.",
    documents: 13,
    appointments: "4 görüşme",
    risk: "red",
  },
  {
    name: "Zeynep Arslan",
    phone: "+90 505 222 44 77",
    email: "zeynep.arslan@example.com",
    address: "Yüreğir / Adana",
    tcVergi: "45678912340",
    files: ["Tapu İptal", "Miras Paylaşımı"],
    paymentStatus: "Tamamlandı",
    notes: "Keşif günü için ulaşım planı paylaşılacak.",
    documents: 19,
    appointments: "3 randevu",
    risk: "green",
  },
];

const initialTasks: TaskRecord[] = [
  { id: 1, title: "Dilekçe hazırla", file: "Ahmet Yılmaz", owner: "Mahmut Kaya", due: "18.05.2026", status: "Devam ediyor" },
  { id: 2, title: "Müvekkilden belge iste", file: "Mehmet Demir", owner: "Ayşe K.", due: "17.05.2026", status: "Yeni" },
  { id: 3, title: "Duruşma sonrası tutanak yükle", file: "Zeynep Arslan", owner: "Mahmut Kaya", due: "20.05.2026", status: "Beklemede" },
  { id: 4, title: "İcra takibi başlat", file: "Nova Ticaret", owner: "Selin A.", due: "16.05.2026", status: "Gecikti" },
  { id: 5, title: "Arabuluculuk başvurusu yap", file: "Kaya İş Uyuşmazlığı", owner: "Mahmut Kaya", due: "22.05.2026", status: "Yeni" },
];

const payments = [
  { client: "Mehmet Demir", file: "İşçilik Alacağı", total: 40000, paid: 15000, due: "25.05.2026" },
  { client: "Ahmet Yılmaz", file: "Boşanma Davası", total: 30000, paid: 18000, due: "20.05.2026" },
  { client: "Nova Ticaret Ltd.", file: "İcra Takibi", total: 52000, paid: 0, due: "30.05.2026" },
];

const templates = [
  "Dava dilekçesi",
  "Cevap dilekçesi",
  "İtiraz dilekçesi",
  "İstinaf dilekçesi",
  "Temyiz dilekçesi",
  "İhtarname",
  "Sözleşme",
  "Vekaletname bilgi formu",
  "Arabuluculuk başvuru formu",
  "İcra takip talebi",
];

const timeline = [
  { date: "12.05.2026", text: "Dilekçe hazırlandı" },
  { date: "14.05.2026", text: "Evrak yüklendi" },
  { date: "20.05.2026", text: "Duruşma var" },
  { date: "25.05.2026", text: "Bilirkişi raporu bekleniyor" },
];

const enforcementRows = [
  {
    creditor: "Nova Ticaret Ltd.",
    debtor: "Çukurova İnşaat",
    office: "Adana 5. İcra Dairesi",
    fileNo: "2026/901",
    principal: 185000,
    interest: 12800,
    costs: 4200,
    fee: 19500,
    collected: 0,
    notice: "15.05.2026",
    objection: "22.05.2026",
    status: "Tebligat bekleniyor",
  },
  {
    creditor: "Selim Aksoy",
    debtor: "Mavi Grup A.Ş.",
    office: "Adana 2. İcra Dairesi",
    fileNo: "2025/774",
    principal: 92000,
    interest: 8700,
    costs: 3100,
    fee: 11200,
    collected: 42000,
    notice: "02.05.2026",
    objection: "09.05.2026",
    status: "Kesinleşti",
  },
];

const aiPrompts = [
  "Bu dosyanın kısa özetini çıkar.",
  "Bu bilirkişi raporuna itiraz noktalarını listele.",
  "Boşanma davası için anlaşmalı protokol taslağı hazırla.",
  "Riskli süreleri ve yaklaşan duruşmaları özetle.",
];

const toneClasses: Record<StatusTone, string> = {
  gold: "border-[#c7a157]/40 bg-[#fff8e7] text-[#7a5a12]",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  burgundy: "border-[#5b1826]/20 bg-[#fff5f6] text-[#5b1826]",
};

const statusClasses: Record<TaskRecord["status"], string> = {
  Yeni: "border-sky-200 bg-sky-50 text-sky-700",
  "Devam ediyor": "border-[#c7a157]/40 bg-[#fff8e7] text-[#7a5a12]",
  Beklemede: "border-slate-200 bg-slate-50 text-slate-700",
  Tamamlandı: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Gecikti: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);
}

function SectionTitle({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold tracking-tight text-[#0b1f3a]">{title}</h2>
      {text ? <p className="mt-1 text-sm text-slate-500">{text}</p> : null}
    </div>
  );
}

function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: StatusTone }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>{children}</span>;
}

function ShellCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function TopSearchIcon() {
  return (
    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

import { useAuth } from "@/hooks/useAuth";

export default function App() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [activeModule, setActiveModule] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<number | string>(files[0].id);
  const [fileTab, setFileTab] = useState("Genel Bilgiler");
  const [calendarView, setCalendarView] = useState("Günlük görünüm");
  const [courtFilter, setCourtFilter] = useState("Tümü");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [toast, setToast] = useState("Panel hazır");
  const [uploadedDocs, setUploadedDocs] = useState(["Vekaletname.pdf", "Bilirkişi raporu.pdf", "Tanık listesi.docx"]);
  const [samplePrompts, setSamplePrompts] = useState<string[]>(aiPrompts);
  const [aiInput, setAiInput] = useState(aiPrompts[0]);
  const [aiAnswer, setAiAnswer] = useState("Seçili dosya için özet, riskli süreler ve önerilen aksiyonlar burada görüntülenir.");
  const [realMessages, setRealMessages] = useState<any[]>([]);
  const [realFiles, setRealFiles] = useState<any[]>(files);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Real-time Data Fetching
  useEffect(() => {
    if (!user) return;
    const unsubMsgs = onSnapshot(query(collection(db, "contactMessages"), orderBy("createdAt", "desc")), (snap) => {
      setRealMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubFiles = onSnapshot(query(collection(db, "files"), orderBy("createdAt", "desc")), (snap) => {
      if (!snap.empty) {
        const fireFiles = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setRealFiles([...fireFiles, ...files.filter(f => !fireFiles.find((ff:any) => ff.id === f.id))]);
      }
    });
    return () => { unsubMsgs(); unsubFiles(); };
  }, [user]);

  // If AuthProvider is still loading, it handles it. 
  // But if we reach here and user is null, ProtectedRoute will handle it.
  if (!user && !authLoading) return null;

  const selectedFile = useMemo(() => {
    return realFiles.find((file) => file.id === selectedFileId) || realFiles[0] || files[0];
  }, [realFiles, selectedFileId]);

  const searchResults = useMemo(() => {
    const normalized = searchQuery.trim().toLocaleLowerCase("tr-TR");
    if (!normalized) return [];

    return (realFiles || []).filter((file) =>
      [file?.title, file?.client, file?.opponent, file?.court, file?.fileNo, file?.type, file?.subject]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalized),
    );
  }, [searchQuery, realFiles]);

  const realClients = useMemo(() => {
    const map = new Map();
    realFiles.forEach(f => {
      if (!f.client) return;
      if (!map.has(f.client)) {
        map.set(f.client, { name: f.client, phone: "05xx xxx xx xx", email: "müvekkil@mail.com", files: [f.title], status: f.status });
      } else {
        map.get(f.client).files.push(f.title);
      }
    });
    return Array.from(map.values());
  }, [realFiles]);

  const allHearings = useMemo(() => {
    return realFiles
      .filter(f => f.hearingDate)
      .map(f => ({ date: f.hearingDate, time: "09:00", court: f.court, fileNo: f.fileNo, client: f.client, subject: f.subject }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [realFiles]);

  const dashboardStats = useMemo(() => [
    { label: "Bugünkü Duruşma", value: allHearings.filter(h => h.date === new Date().toISOString().split('T')[0]).length.toString(), detail: "güncel" },
    { label: "Bekleyen Görev", value: tasks.filter(t => t.status !== "Tamamlandı").length.toString(), detail: "aksiyon" },
    { label: "Müvekkil Talebi", value: realMessages.filter(m => m.status === 'Yeni').length.toString(), detail: "yanıt bekliyor" },
    { label: "Aktif Dosya", value: realFiles.length.toString(), detail: "takipte" },
  ], [allHearings, tasks, realMessages, realFiles]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast("Hazır"), 5000);
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.target.files ?? []).map((file) => file.name);
    if (incoming.length) {
      setUploadedDocs((current) => [...incoming, ...current]);
      showToast(`${incoming.length} evrak yüklendi`);
    }
  }

  function nextTaskStatus(task: TaskRecord) {
    const flow: TaskRecord["status"][] = ["Yeni", "Devam ediyor", "Beklemede", "Tamamlandı"];
    const next = flow[(flow.indexOf(task.status) + 1) % flow.length] ?? "Yeni";
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, status: next } : item)));
    showToast(`Görev durumu güncellendi: ${next}`);
  }

  async function runAiAssistant(prompt = aiInput) {
    if (!selectedFile) {
      showToast("Lütfen bir dosya seçin");
      return;
    }
    setIsAiLoading(true);
    setAiInput(prompt);
    try {
      const context = `Dosya: ${selectedFile.title || 'İsimsiz'}, Durum: ${selectedFile.status || 'Belirsiz'}, Özet: ${selectedFile.summary || selectedFile.subject || 'Detay yok'}`;
      const response = await getAiAssistantReply([{ role: 'user', content: `${context}. Soru: ${prompt}` }]);
      setAiAnswer(response);
      showToast("AI asistan yanıtı oluşturuldu");
    } catch (err: any) {
      showToast(err.message || "AI yanıtı alınamadı");
    } finally {
      setIsAiLoading(false);
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, "contactMessages", id));
      showToast("Mesaj silindi");
    } catch (err) {
      showToast("Silme hatası");
    }
  }

  async function handleDeleteFile(id: string | number) {
    if (typeof id === 'number') {
      showToast("Statik dosyalar silinemez, sadece yeni kayıtlar silinebilir");
      return;
    }
    if (!window.confirm("Bu dosyayı kalıcı olarak silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, "files", id));
      showToast("Dosya silindi");
      setSelectedFileId(files[0].id);
    } catch (err) {
      showToast("Hata: Silme yetkiniz olmayabilir");
    }
  }

  async function handleDeleteTask(id: string | number) {
    if (!window.confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    setTasks(current => current.filter(t => t.id !== id));
    showToast("Görev listeden kaldırıldı");
  }

  async function handleDeleteClient(clientName: string) {
    if (!window.confirm(`${clientName} isimli müvekkili ve ona bağlı TÜM dosyaları silmek istediğinize emin misiniz?`)) return;
    const filesToDelete = realFiles.filter(f => f.client === clientName && typeof f.id === 'string');
    try {
      for (const f of filesToDelete) {
        await deleteDoc(doc(db, "files", f.id));
      }
      showToast(`${clientName} ve bağlı dosyaları silindi`);
    } catch (err) {
      showToast("Bazı dosyalar silinemedi");
    }
  }

  function removeSamplePrompt(prompt: string) {
    setSamplePrompts((current) => current.filter((item) => item !== prompt));
  }

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-800">
      <div className="grid min-h-screen lg:grid-cols-[292px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-[#071a33] text-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col p-6">
            <button onClick={() => setActiveModule("Dashboard")} className="text-left">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b36c]">{brand.name}</div>
              <div className="mt-3 text-2xl font-semibold leading-tight">Hukuk Paneli</div>
              <div className="mt-2 text-sm text-slate-300">{brand.slogan}</div>
            </button>

            <nav className="mt-8 flex-1 space-y-1 overflow-y-auto pr-1">
              {menuItems.map((item) => {
                const active = activeModule === item;
                return (
                  <button
                    key={item}
                    onClick={() => setActiveModule(item)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition duration-200 ${
                      active ? "bg-white text-[#071a33] shadow-lg shadow-black/10" : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span>{item}</span>
                    {active ? <span className="h-2 w-2 rounded-full bg-[#c7a157]" /> : null}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-[#c7a157]/25 bg-white/7 p-4">
              <div className="text-sm font-medium text-[#f5dfaa]">Kurumsal Kimlik</div>
              <p className="mt-2 text-sm leading-6 text-slate-300">Lacivert, altın ve beyaz çizgide sade, güven veren hukuk bürosu yönetimi.</p>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/92 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[#a57d2c]">{brand.product}</div>
                <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-[#0b1f3a]">{activeModule}</h1>
              </div>

              <label className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-[#faf8f3] px-4 transition focus-within:border-[#c7a157] focus-within:ring-4 focus-within:ring-[#c7a157]/15 xl:max-w-2xl">
                <TopSearchIcon />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Müvekkil adı, dosya no, mahkeme, telefon veya karşı taraf ara..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="flex items-center gap-3">
                <button onClick={() => showToast("Bildirimler kontrol edildi")} className="relative rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#c7a157]">
                  Bildirimler
                  <span className="live-dot absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#c7a157]" />
                </button>
                <button onClick={() => setActiveModule("Ayarlar")} className="rounded-xl bg-[#071a33] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#102a50]">
                  Profil
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
              {menuItems.slice(0, 10).map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveModule(item)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${activeModule === item ? "border-[#c7a157] bg-[#071a33] text-white" : "border-slate-200 bg-white text-slate-600"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </header>

          <main key={activeModule} className="motion-enter px-4 py-6 md:px-8">
            {searchQuery.trim() ? <SearchResults results={searchResults} onOpen={(id) => { setSelectedFileId(id); setActiveModule("Dosyalar"); }} /> : null}
            {renderModule()}
          </main>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-30 max-w-sm rounded-2xl border border-[#c7a157]/30 bg-[#071a33] px-4 py-3 text-sm text-white shadow-2xl shadow-slate-900/20">
        <span className="text-[#f5dfaa]">Durum:</span> {toast}
      </div>
    </div>
  );

  function renderModule() {
    switch (activeModule) {
      case "Dashboard":
        return <Dashboard />;
      case "Dosyalar":
        return <FilesModule />;
      case "Müvekkiller":
        return <ClientsModule />;
      case "Duruşmalar":
      case "Takvim":
        return <CalendarModule />;
      case "Mesajlar":
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-4">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0b1f3a]">Mesaj Merkezi</h3>
            <p className="mt-2 max-w-sm text-slate-500">Gelen mesajlar ana sayfada listelenmektedir. Tüm mesaj arşivi için yönetici onayı bekleniyor.</p>
          </div>
        );
      case "İcra Takipleri":
        return <EnforcementModule />;
      case "Arabuluculuk":
        return <MediationModule />;
      case "Evraklar":
        return <DocumentsModule />;
      case "Dilekçe Şablonları":
        return <TemplatesModule />;
      case "Görevler":
        return <TasksModule />;
      case "Tahsilat / Muhasebe":
      case "Finans":
        return <FinanceModule />;
      case "Raporlar":
        return <ReportsModule />;
      case "Müvekkil Portalı":
        return <PortalModule />;
      case "AI Hukuk Asistanı":
        return <AIModule />;
      case "Kullanıcılar":
        return <UsersModule />;
      case "Ayarlar":
        return <SettingsModule />;
      default:
        return <Dashboard />;
    }
  }

  function FinanceModule() {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
          <Shield size={32} />
        </div>
        <h3 className="text-xl font-bold text-[#0b1f3a]">Yetki Sınırı</h3>
        <p className="mt-2 max-w-sm text-slate-500">Finansal verilere erişmek için yönetici yetkisi gereklidir. Lütfen sistem yöneticinizle iletişime geçin.</p>
      </div>
    );
  }

  function Dashboard() {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl bg-[#071a33] p-6 text-white shadow-xl shadow-slate-900/10 md:p-8">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-end">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b36c]">{brand.name}</div>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">Hoş geldiniz, Av. Mahmut Kaya</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Hukuki süreçlerinizi güvenle, düzenli ve profesyonel şekilde yönetin.</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-5">
                <div className="text-sm font-medium text-[#f5dfaa]">Bugün sizi bekleyen işlemler</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {dashboardStats.map((stat, index) => (
                    <div key={stat.label} className={`motion-enter motion-delay-${Math.min(index + 1, 3)} border-l border-[#d4b36c]/50 pl-3`}>
                      <div className="text-2xl font-semibold text-white">{stat.value}</div>
                      <div className="text-xs text-slate-300">{stat.detail} {stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <ShellCard>
              <SectionTitle title="Bugünkü Duruşmalar" text="Saat, mahkeme ve dosya numarası tek listede." />
              <div className="space-y-4">
                {allHearings.length > 0 ? allHearings.slice(0, 5).map((hearing, idx) => (
                  <button key={idx} onClick={() => setActiveModule("Duruşmalar")} className="flex w-full gap-4 rounded-xl border border-transparent p-3 text-left transition hover:border-[#c7a157]/40 hover:bg-[#fffaf0]">
                    <div className="min-w-16 rounded-xl bg-[#071a33] px-3 py-2 text-center text-sm font-semibold text-white">{hearing.time}</div>
                    <div className="min-w-0">
                      <div className="font-medium text-[#0b1f3a]">{hearing.court}</div>
                      <div className="mt-1 text-sm text-slate-500">Dosya No: {hearing.fileNo} - {hearing.client}</div>
                      <div className="mt-1 text-sm text-slate-600">{hearing.subject}</div>
                    </div>
                  </button>
                )) : (
                  <div className="text-sm text-slate-400 text-center py-8">Bugün duruşma bulunmuyor.</div>
                )}
              </div>
            </ShellCard>

            <ShellCard>
              <SectionTitle title="Yaklaşan Süreler" text="İtiraz, cevap, istinaf ve temyiz son günleri." />
              <div className="space-y-3">
                {deadlines.map((deadline) => (
                  <div key={deadline.title} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-[#fbfaf7] p-3">
                    <div>
                      <div className="font-medium text-[#0b1f3a]">{deadline.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{deadline.file}</div>
                    </div>
                    <Badge tone={deadline.tone}>{deadline.date}</Badge>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard>
              <SectionTitle title="Aktif Dosyalar" text="Devam eden dava, icra ve arabuluculuk dosyaları." />
              <div className="space-y-3">
                {realFiles.slice(0, 5).map((file) => (
                  <button key={file.id} onClick={() => { setSelectedFileId(file.id); setActiveModule("Dosyalar"); }} className="group flex w-full items-center justify-between gap-4 rounded-xl p-3 text-left transition hover:bg-[#f7f4ee]">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-[#0b1f3a]">{file.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{file.court} - {file.fileNo}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={file.importance || 'slate'}>{file.status}</Badge>
                      {isAdmin && typeof file.id === 'string' ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-full transition"
                          aria-label="Dosyayı sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </ShellCard>

            <ShellCard>
              <SectionTitle title="Bekleyen Görevler" text="Yapılacak işler ve sorumlu kişiler." />
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <button key={task.id} onClick={() => nextTaskStatus(task)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 text-left transition hover:border-[#c7a157]/40">
                    <div>
                      <div className="font-medium text-[#0b1f3a]">{task.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{task.file} - {task.owner} - {task.due}</div>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[task.status]}`}>{task.status}</span>
                  </button>
                ))}
              </div>
            </ShellCard>

            <ShellCard>
              <SectionTitle title="Müvekkil Talepleri" text="Siteden gelen son iletişim mesajları." />
              <div className="space-y-3">
                {realMessages.length > 0 ? realMessages.slice(0, 5).map((msg) => (
                  <div key={msg.id} className="group rounded-xl border border-slate-100 bg-[#fbfaf7] p-3 hover:border-rose-200 transition-all">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-[#0b1f3a]">{msg.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge tone={msg.status === 'Yeni' ? 'red' : 'green'}>{msg.subject || 'Mesaj'}</Badge>
                        {isAdmin ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded transition-all"
                            title="Mesajı sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{msg.message}</p>
                    <div className="mt-2 text-[10px] text-slate-400">
                      {msg.createdAt?.seconds 
                        ? new Date(msg.createdAt.seconds * 1000).toLocaleString('tr-TR') 
                        : 'Az önce'}
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-slate-400 text-center py-8">Henüz talep bulunmuyor.</div>
                )}
              </div>
            </ShellCard>

            <ShellCard>
              <SectionTitle title="Tahsilatlar" text="Bekleyen ve alınan ödemeler." />
              <div className="space-y-4">
                {payments.slice(0, 2).map((payment) => {
                  const percent = Math.round((payment.paid / payment.total) * 100);
                  return (
                    <div key={payment.client}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#0b1f3a]">{payment.client}</span>
                        <span className="text-slate-500">{formatCurrency(payment.paid)} / {formatCurrency(payment.total)}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="timeline-line h-full rounded-full bg-[#c7a157]" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Son ödeme: {payment.due}</div>
                    </div>
                  );
                })}
              </div>
            </ShellCard>

            <ShellCard>
              <SectionTitle title="Son Güncellenen Dosyalar" text="En son işlem yapılan dosyalar." />
              <div className="space-y-3">
                {files
                  .slice()
                  .sort((first, second) => second.lastAction.localeCompare(first.lastAction))
                  .map((file) => (
                    <button key={file.id} onClick={() => { setSelectedFileId(file.id); setActiveModule("Dosyalar"); }} className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-100 bg-[#fbfaf7] p-3 text-left transition hover:border-[#c7a157]">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-[#0b1f3a]">{file.title}</div>
                        <div className="mt-1 text-sm text-slate-500">Son işlem: {file.lastAction}</div>
                      </div>
                      <Badge tone={file.importance}>{file.fileNo}</Badge>
                    </button>
                  ))}
              </div>
            </ShellCard>
          </div>
        </div>

        <aside className="space-y-5">
          <ShellCard>
            <SectionTitle title="Yaklaşan Uyarılar" text="Kritik işlemler öne çıkarıldı." />
            <div className="space-y-3">
              {deadlines.map((deadline) => (
                <div key={deadline.title} className="border-l-2 border-[#c7a157] pl-3">
                  <div className="text-sm font-medium text-[#0b1f3a]">{deadline.title}</div>
                  <div className="text-xs text-slate-500">{deadline.file} - {deadline.date}</div>
                </div>
              ))}
            </div>
          </ShellCard>

          <ShellCard>
            <SectionTitle title="Hızlı İşlemler" text="Günlük akış için kısa yollar." />
            <div className="grid gap-2">
              {[
                ["Yeni Dosya", "Dosyalar"],
                ["Yeni Müvekkil", "Müvekkiller"],
                ["Duruşma Ekle", "Duruşmalar"],
                ["Evrak Yükle", "Evraklar"],
                ["Dilekçe Oluştur", "Dilekçe Şablonları"],
                ["Tahsilat Gir", "Tahsilat / Muhasebe"],
              ].map(([label, module]) => (
                <button key={label} onClick={() => { setActiveModule(module); showToast(`${label} ekranı açıldı`); }} className="rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-[#0b1f3a] transition hover:border-[#c7a157] hover:bg-[#fffaf0]">
                  {label}
                </button>
              ))}
            </div>
          </ShellCard>

          <ShellCard>
            <SectionTitle title="AI Hukuk Asistanı" text="Taslak, özet ve süre uyarıları." />
            <div className="space-y-2">
              {samplePrompts.slice(0, 3).map((prompt) => (
              <div key={prompt} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-[#f7f4ee] px-3 py-2 transition hover:bg-[#fff3ce]">
                <button onClick={() => runAiAssistant(prompt)} className="text-left text-sm text-slate-700 hover:text-slate-900 focus:outline-none">
                  {prompt}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeSamplePrompt(prompt); }}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-full transition"
                  aria-label="Örnek ifadeyi kaldır"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            </div>
          </ShellCard>
        </aside>
      </div>
    );
  }

  function FilesModule() {
    const tabs = ["Genel Bilgiler", "Taraflar", "Duruşmalar", "Evraklar", "Dilekçeler", "Notlar", "Görevler", "Masraflar", "Tahsilatlar", "Zaman Çizelgesi", "UYAP Bilgileri"];
    return (
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <ShellCard>
          <SectionTitle title="Dosya Yönetimi" text="Dava, icra ve arabuluculuk dosyaları." />
          <div className="space-y-3">
            {realFiles.map((file) => (
              <button key={file.id} onClick={() => { setSelectedFileId(file.id); setFileTab("Genel Bilgiler"); }} className={`group w-full rounded-2xl border p-4 text-left transition ${selectedFile.id === file.id ? "border-[#c7a157] bg-[#fffaf0]" : "border-slate-200 bg-white hover:border-[#c7a157]/60"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[#0b1f3a] truncate">{file.title}</div>
                    <div className="mt-1 text-sm text-slate-500 truncate">{file.court}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge tone={file.importance || 'slate'}>{file.type}</Badge>
                    {isAdmin && typeof file.id === 'string' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Dosyayı Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <span>Esas: {file.fileNo}</span>
                  <span>Son işlem: {file.lastAction}</span>
                </div>
              </button>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a57d2c]">Dosya Detayı</div>
              <h2 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">{selectedFile?.title || 'Seçili Dosya Yok'}</h2>
              <p className="mt-2 text-sm text-slate-500">{selectedFile?.subject || selectedFile?.summary || 'Detay bulunamadı'}</p>
            </div>
            <Badge tone={selectedFile?.importance || 'slate'}>{selectedFile?.status || 'Durum Belirsiz'}</Badge>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setFileTab(tab)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${fileTab === tab ? "border-[#c7a157] bg-[#071a33] text-white" : "border-slate-200 bg-white text-slate-600"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6">{renderFileTab()}</div>
        </ShellCard>
      </div>
    );
  }

  function renderFileTab() {
    if (fileTab === "Zaman Çizelgesi") {
      return (
        <div className="relative space-y-5 pl-5">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-[#c7a157]/40" />
          {timeline.map((item) => (
            <div key={`${item.date}-${item.text}`} className="relative">
              <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#c7a157] shadow" />
              <div className="rounded-xl border border-slate-200 bg-[#fbfaf7] p-4">
                <div className="text-sm font-semibold text-[#0b1f3a]">{item.date}</div>
                <div className="mt-1 text-sm text-slate-600">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (fileTab === "Tahsilatlar") {
      const payment = payments.find((item) => selectedFile.title.includes(item.client.split(" ")[0])) ?? payments[0];
      const remaining = payment.total - payment.paid;
      return (
        <div className="grid gap-4 md:grid-cols-3">
          <InfoBlock label="Toplam Ücret" value={formatCurrency(payment.total)} />
          <InfoBlock label="Ödenen" value={formatCurrency(payment.paid)} />
          <InfoBlock label="Kalan" value={formatCurrency(remaining)} />
        </div>
      );
    }

    if (fileTab === "UYAP Bilgileri") {
      return <InfoGrid items={["UYAP dosya eşleştirme: Hazır", "Mahkeme: " + selectedFile.court, "Esas no: " + selectedFile.fileNo, "Karar no: " + selectedFile.decisionNo, "Son sorgu: 15.05.2026 16:45", "Not: Entegrasyon alanları için uyum hazırlandı"]} />;
    }

    if (fileTab === "Taraflar") {
      return <InfoGrid items={["Müvekkil: " + selectedFile.client, "Karşı taraf: " + selectedFile.opponent, "Vekil: " + brand.name, "Vekalet durumu: " + selectedFile.powerOfAttorney]} />;
    }

    if (fileTab === "Duruşmalar") {
      return <CalendarModule compact />;
    }

    if (fileTab === "Evraklar" || fileTab === "Dilekçeler") {
      return <DocumentsModule compact />;
    }

    if (fileTab === "Görevler") {
      return <TasksModule compact />;
    }

    if (fileTab === "Masraflar") {
      return <InfoGrid items={["Harç: 3.250 TL", "Tebligat: 720 TL", "Bilirkişi ücreti: 5.500 TL", "İcra masrafı: 1.850 TL"]} />;
    }

    if (fileTab === "Notlar") {
      return <div className="rounded-xl border border-[#c7a157]/30 bg-[#fffaf0] p-4 text-sm leading-6 text-slate-700">Avukat özel notları sadece ofis kullanıcıları tarafından görüntülenir. Müvekkil portalında bu alan paylaşılmaz.</div>;
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoBlock label="Dosya türü" value={selectedFile.type} />
        <InfoBlock label="Müvekkil" value={selectedFile.client} />
        <InfoBlock label="Karşı taraf" value={selectedFile.opponent} />
        <InfoBlock label="Mahkeme / İcra dairesi" value={selectedFile.court} />
        <InfoBlock label="Esas no" value={selectedFile.fileNo} />
        <InfoBlock label="Karar no" value={selectedFile.decisionNo} />
        <InfoBlock label="Duruşma tarihi" value={selectedFile.hearingDate} />
        <InfoBlock label="Son işlem tarihi" value={selectedFile.lastAction} />
        <InfoBlock label="Tahsilat durumu" value={selectedFile.collection} />
      </div>
    );
  }

  function ClientsModule() {
    return (
      <div>
        <SectionTitle title="Müvekkil Yönetimi" text="Müvekkil bilgileri, dosyalar, ödemeler ve hızlı işlemler." />
        <div className="grid gap-5 xl:grid-cols-3">
          {realClients.map((client) => (
            <ShellCard key={client.name} className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#071a33] flex items-center justify-center text-white font-bold">{client.name[0]}</div>
                  <h3 className="text-lg font-semibold text-[#0b1f3a]">{client.name}</h3>
                </div>
                <Badge tone="gold">{client.status}</Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Telefon: {client.phone}</p>
                <p>E-posta: {client.email}</p>
                <div className="mt-2">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Bağlı Dosyalar</div>
                  <div className="flex flex-wrap gap-1">
                    {client.files.map((f:string) => <Badge key={f} tone="slate">{f}</Badge>)}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {["Ara", "WhatsApp", "E-posta", "Dosya Aç", "Belge Yükle", "Tahsilat"].map((action) => (
                  <button key={action} onClick={() => showToast(`${client.name}: ${action}`)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-[#0b1f3a] transition hover:border-[#c7a157] hover:bg-[#fffaf0]">
                    {action}
                  </button>
                ))}
                <button 
                  onClick={() => handleDeleteClient(client.name)}
                  className="col-span-2 mt-2 rounded-xl bg-rose-50 py-2 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Müvekkili ve Dosyaları Sil
                </button>
              </div>
            </ShellCard>
          ))}
        </div>
      </div>
    );
  }

  function CalendarModule({ compact = false }: { compact?: boolean }) {
    return (
      <div className={compact ? "" : "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"}>
        <ShellCard className={compact ? "border-0 p-0 shadow-none" : ""}>
          {!compact ? <SectionTitle title="Duruşma Takvimi" text="Günlük, haftalık ve aylık görünüm ile mahkeme bazlı takip." /> : null}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {["Günlük görünüm", "Haftalık görünüm", "Aylık görünüm"].map((view) => (
                <button key={view} onClick={() => setCalendarView(view)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${calendarView === view ? "border-[#c7a157] bg-[#071a33] text-white" : "border-slate-200 bg-white text-slate-600"}`}>
                  {view}
                </button>
              ))}
            </div>
            <select value={courtFilter} onChange={(event) => setCourtFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#c7a157]">
              {["Tümü", ...Array.from(new Set(allHearings.map(h => h.court)))].map((court) => <option key={court}>{court}</option>)}
            </select>
          </div>
          <div className="mt-5 space-y-3">
            {allHearings.length > 0 ? allHearings.map((hearing, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a57d2c]">
                      {new Date(hearing.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-[#0b1f3a]">{hearing.court}</h3>
                    <div className="mt-2 grid gap-1 text-sm text-slate-600 md:grid-cols-2">
                      <span>Dosya No: {hearing.fileNo}</span>
                      <span>Saat: {hearing.time}</span>
                      <span>Müvekkil: {hearing.client}</span>
                      <span>Konu: {hearing.subject}</span>
                    </div>
                  </div>
                  <Badge tone="gold">Duruşma Bekleniyor</Badge>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400">Kayıtlı duruşma bulunamadı.</div>
            )}
          </div>
        </ShellCard>

        {!compact ? (
          <ShellCard>
            <SectionTitle title="Hatırlatma Sistemi" text="Kritik duruşmalar için otomatik uyarılar." />
            <div className="space-y-3 text-sm text-slate-600">
              <p>24 saat önce e-posta ve panel bildirimi.</p>
              <p>2 saat önce mobil uyumlu hızlı uyarı.</p>
              <p>Mahkeme ve dosya bazlı filtreleme aktif.</p>
            </div>
          </ShellCard>
        ) : null}
      </div>
    );
  }

  function DocumentsModule({ compact = false }: { compact?: boolean }) {
    return (
      <div className={compact ? "" : "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"}>
        <ShellCard className={compact ? "border-0 p-0 shadow-none" : ""}>
          {!compact ? <SectionTitle title="Evrak ve Belge Yönetimi" text="PDF, Word ve görsel evraklar dosya bazında takip edilir." /> : null}
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c7a157]/50 bg-[#fffaf0] px-6 py-10 text-center transition hover:bg-[#fff4d6]">
            <input type="file" multiple className="hidden" onChange={handleUpload} />
            <span className="text-lg font-semibold text-[#0b1f3a]">Evrak Yükle</span>
            <span className="mt-2 text-sm text-slate-500">Vekaletname, dilekçe, rapor ve tutanak belgelerini buraya ekleyin.</span>
          </label>
          <div className="mt-5 space-y-2">
            {uploadedDocs.map((doc) => (
              <div key={doc} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                <span className="text-sm font-medium text-[#0b1f3a]">{doc}</span>
                <button onClick={() => showToast(`${doc} görüntülendi`)} className="text-sm font-medium text-[#a57d2c]">Görüntüle</button>
              </div>
            ))}
          </div>
        </ShellCard>

        {!compact ? (
          <ShellCard>
            <SectionTitle title="Otomatik Doldurma" text="Şablon alanları büro kimliğiyle hazırlanır." />
            <InfoGrid items={[brand.name, "Müvekkil adı", "Karşı taraf", "Mahkeme", "Dosya no", "Tarih", "Adres", brand.barNo]} />
          </ShellCard>
        ) : null}
      </div>
    );
  }

  function TemplatesModule() {
    return (
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <ShellCard>
          <SectionTitle title="Dilekçe Şablonları" text="Mahmut Kaya hukuk bürosu için hazır şablonlar." />
          <div className="space-y-2">
            {templates.map((template) => (
              <button key={template} onClick={() => setSelectedTemplate(template)} className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${selectedTemplate === template ? "border-[#c7a157] bg-[#fffaf0] text-[#0b1f3a]" : "border-slate-200 bg-white text-slate-600 hover:border-[#c7a157]"}`}>
                {template}
              </button>
            ))}
          </div>
        </ShellCard>
        <ShellCard>
          <SectionTitle title={`${selectedTemplate} Önizlemesi`} text="Sistem ilgili alanları otomatik doldurur." />
          <div className="rounded-2xl border border-slate-200 bg-[#fbfaf7] p-6 font-serif text-sm leading-7 text-slate-700">
            <p className="text-center font-semibold text-[#0b1f3a]">{selectedTemplate.toLocaleUpperCase("tr-TR")}</p>
            <p className="mt-6">Hazırlayan: {brand.name} - {brand.barNo}</p>
            <p>Müvekkil: {selectedFile.client}</p>
            <p>Karşı taraf: {selectedFile.opponent}</p>
            <p>Mahkeme: {selectedFile.court}</p>
            <p>Dosya No: {selectedFile.fileNo}</p>
            <p>Tarih: 15.05.2026</p>
            <p className="mt-6">Açıklamalar ve hukuki değerlendirme alanı seçili dosya bilgilerine göre taslak olarak hazırlanır.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => showToast("PDF çıktı hazırlandı")} className="rounded-xl bg-[#071a33] px-4 py-2 text-sm font-medium text-white">PDF Çıktı</button>
            <button onClick={() => showToast("Word taslağı hazırlandı")} className="rounded-xl border border-[#c7a157] px-4 py-2 text-sm font-medium text-[#0b1f3a]">Word Çıktı</button>
          </div>
        </ShellCard>
      </div>
    );
  }

  function EnforcementModule() {
    const realEnforcements = realFiles.filter(f => f.type === "İcra" || f.type === "İcra Takibi");
    return (
      <div>
        <SectionTitle title="İcra Takip Modülü" text="Aktif icra dosyalarınızın takibi ve tahsilat durumları." />
        <div className="grid gap-5 xl:grid-cols-2">
          {realEnforcements.length > 0 ? realEnforcements.map((row) => (
            <ShellCard key={row.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#0b1f3a]">{row.client}</h3>
                  <p className="mt-1 text-sm text-slate-500">Borçlu: {row.opponent}</p>
                </div>
                <Badge tone="blue">{row.status}</Badge>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>İcra dairesi: {row.court}</p>
                <p>Dosya no: {row.fileNo}</p>
                <p>Ana para: {formatCurrency(15000)} (Örnek)</p>
                <p>Kalan borç: {formatCurrency(row.collection === "Tamamlandı" ? 0 : 15000)}</p>
                <p>Son işlem: {row.lastAction}</p>
                <p>Tür: {row.type}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => showToast("İcra detayları açıldı")} className="flex-1 rounded-xl bg-[#f7f4ee] py-2 text-xs font-bold text-[#071a33]">Dosyayı Aç</button>
                <button onClick={() => handleDeleteFile(row.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </ShellCard>
          )) : (
            <div className="xl:col-span-2 text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
              Henüz kayıtlı icra takibi bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
    );
  }

  function FinanceModule() {
    const expenseItems = ["Vekalet ücreti", "Danışmanlık ücreti", "Dosya masrafı", "Harç", "Tebligat", "Bilirkişi ücreti", "İcra masrafı", "Taksitli ödeme"];
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5 xl:grid-cols-2">
          {payments.map((payment) => {
            const percent = Math.round((payment.paid / payment.total) * 100);
            return (
              <ShellCard key={payment.client}>
                <SectionTitle title={payment.client} text={payment.file} />
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Toplam Ücret: {formatCurrency(payment.total)}</p>
                  <p>Ödenen: {formatCurrency(payment.paid)}</p>
                  <p>Kalan: {formatCurrency(payment.total - payment.paid)}</p>
                  <p>Son ödeme: {payment.due}</p>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="timeline-line h-full rounded-full bg-[#c7a157]" style={{ width: `${percent}%` }} />
                </div>
                <button onClick={() => showToast(`${payment.client} için tahsilat girişi açıldı`)} className="mt-5 rounded-xl bg-[#071a33] px-4 py-2 text-sm font-medium text-white">Tahsilat Gir</button>
              </ShellCard>
            );
          })}
        </div>
        <ShellCard>
          <SectionTitle title="Masraf Kalemleri" text="Sade ama güçlü finans takibi." />
          <div className="flex flex-wrap gap-2">
            {expenseItems.map((item) => <Badge key={item} tone="slate">{item}</Badge>)}
          </div>
        </ShellCard>
      </div>
    );
  }

  function TasksModule({ compact = false }: { compact?: boolean }) {
    const statuses: TaskRecord["status"][] = ["Yeni", "Devam ediyor", "Beklemede", "Tamamlandı", "Gecikti"];
    return (
      <div>
        {!compact ? <SectionTitle title="Görev Yönetimi" text="Dilekçe, belge, duruşma ve icra aksiyonları ekip akışında izlenir." /> : null}
        <div className="grid gap-4 xl:grid-cols-5">
          {statuses.map((status) => (
            <div key={status} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className={`mb-3 rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>{status}</div>
              <div className="space-y-3">
                {tasks.filter((task) => task.status === status).map((task) => (
                  <div key={task.id} className="group relative w-full rounded-xl border border-slate-100 bg-[#fbfaf7] p-3 text-left transition hover:border-[#c7a157]">
                    <button onClick={() => nextTaskStatus(task)} className="text-left w-full">
                      <div className="font-medium text-[#0b1f3a]">{task.title}</div>
                      <div className="mt-2 text-xs leading-5 text-slate-500">{task.file}<br />{task.owner} - {task.due}</div>
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function PortalModule() {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-3xl bg-[#071a33] p-8 text-white">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b36c]">Av. Mahmut Kaya Hukuk Paneli</div>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">Dava, duruşma, müvekkil ve evrak yönetiminizi tek ekrandan kontrol edin.</h2>
          <p className="mt-4 max-w-2xl text-slate-300">Müvekkil portalı sınırlı erişimle yalnızca dosya özeti, duruşma tarihi, paylaşılan belgeler, ödeme durumu ve mesajları gösterir.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Giriş Yap", "Müvekkil Portalı", "Randevu Talep Et"].map((button) => (
              <button key={button} onClick={() => showToast(`${button} seçildi`)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#071a33] transition hover:bg-[#f5dfaa]">
                {button}
              </button>
            ))}
          </div>
        </section>
        <ShellCard>
          <SectionTitle title="Portal Yetkileri" text="Müvekkilin gördüğü ve görmediği alanlar." />
          <div className="space-y-4 text-sm text-slate-600">
            <div><strong className="text-[#0b1f3a]">Görebilir:</strong> Dosya özeti, duruşma tarihi, paylaşılan belgeler, ödeme durumu, mesajlar, belge yükleme.</div>
            <div><strong className="text-[#0b1f3a]">Göremez:</strong> Avukat özel notları, diğer müvekkiller, iç yazışmalar, genel finansal raporlar.</div>
          </div>
        </ShellCard>
      </div>
    );
  }

  function AIModule() {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ShellCard>
          <SectionTitle title="Mahmut Kaya AI Hukuk Asistanı" text="Dilekçe taslağı, karar özeti, riskli süre ve benzer dosya analizi." />
          <textarea 
            value={aiInput} 
            onChange={(event) => setAiInput(event.target.value)} 
            placeholder="Dosya hakkında ne sormak istersiniz?"
            className="min-h-36 w-full rounded-2xl border border-slate-200 bg-[#fbfaf7] p-4 text-sm outline-none focus:border-[#c7a157] transition-all" 
          />
          <button 
            onClick={() => runAiAssistant()} 
            disabled={isAiLoading}
            className={`mt-4 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all ${isAiLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#071a33] hover:bg-amber hover:text-nav gold-glow'}`}
          >
            {isAiLoading ? "Analiz Ediliyor..." : "Yanıt Oluştur"}
          </button>
          
          <div className="mt-8 space-y-4">
            <div className="text-xs font-black uppercase tracking-widest text-amber-dark">AI Analiz Sonucu</div>
            <div className={`rounded-2xl border border-[#c7a157]/30 bg-[#fffaf0] p-6 text-sm leading-relaxed text-slate-700 shadow-sm transition-opacity ${isAiLoading ? 'opacity-50' : 'opacity-100'}`}>
              {isAiLoading ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-amber rounded-full"></div>
                  <span>Hukuki veritabanı taranıyor...</span>
                </div>
              ) : (
                <div className="prose max-w-none whitespace-pre-wrap">{aiAnswer}</div>
              )}
            </div>
          </div>
        </ShellCard>
        <ShellCard>
          <SectionTitle title="Örnek Kullanımlar" />
          <div className="space-y-3">
            {samplePrompts.map((prompt) => (
              <div key={prompt} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-[#c7a157] hover:bg-[#fffaf0] font-medium">
                <button
                  onClick={() => runAiAssistant(prompt)}
                  disabled={isAiLoading}
                  className="text-left w-full text-slate-700 text-sm text-left focus:outline-none"
                >
                  {prompt}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeSamplePrompt(prompt); }}
                  className="ml-3 p-2 text-rose-500 hover:bg-rose-50 rounded-full transition"
                  aria-label="Örnek ifadeyi kaldır"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {!samplePrompts.length ? (
              <div className="rounded-xl border border-slate-200 bg-[#faf8f3] p-4 text-sm text-slate-500">Tüm örnek ifadeler kaldırıldı.</div>
            ) : null}
          </div>
        </ShellCard>
      </div>
    );
  }

  function ReportsModule() {
    return (
      <div className="grid gap-5 xl:grid-cols-4">
        <InfoBlock label="Aktif dosya" value={realFiles.length.toString()} />
        <InfoBlock label="Aylık duruşma" value={allHearings.length.toString()} />
        <InfoBlock label="Bekleyen mesaj" value={realMessages.filter(m => m.status === 'Yeni').length.toString()} />
        <InfoBlock label="Tamamlanan görev" value={tasks.filter(t => t.status === "Tamamlandı").length.toString()} />
        <ShellCard className="xl:col-span-4">
          <SectionTitle title="Hukuk Bürosu Performansı" text="Anlık veritabanı verilerine göre raporlanmıştır." />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-[#fbfaf7] p-6">
              <div className="text-xs font-black uppercase text-[#a57d2c]">Dosya Tür Dağılımı</div>
              <div className="mt-4 space-y-2">
                {["Dava", "İcra", "Arabuluculuk"].map(type => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{type}</span>
                    <span className="font-bold text-[#0b1f3a]">{realFiles.filter(f => f.type.includes(type)).length}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-[#fbfaf7] p-6">
              <div className="text-xs font-black uppercase text-[#a57d2c]">En Yoğun Mahkeme</div>
              <div className="mt-4 text-lg font-bold text-[#0b1f3a]">
                {realFiles[0]?.court || "Veri yok"}
              </div>
              <p className="mt-1 text-xs text-slate-500">Bu mahkemede {realFiles.filter(f => f.court === realFiles[0]?.court).length} dosyanız bulunmaktadır.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-[#fbfaf7] p-6">
              <div className="text-xs font-black uppercase text-[#a57d2c]">Dosya Özetleri</div>
              <p className="mt-4 text-sm text-slate-600">Toplam {realFiles.length} aktif dosyanın {realFiles.filter(f => f.importance === 'red').length} tanesi kritik öneme sahip olarak işaretlendi.</p>
            </div>
          </div>
        </ShellCard>
      </div>
    );
  }

  function MediationModule() {
    const mediationFiles = realFiles.filter(f => f.type === "Arabuluculuk");
    return (
      <div className="grid gap-6">
        <SectionTitle title="Arabuluculuk Yönetimi" text="Başvuru, toplantı ve anlaşma süreçlerinin takibi." />
        <div className="grid gap-5 xl:grid-cols-3">
          {mediationFiles.length > 0 ? mediationFiles.map(f => (
            <ShellCard key={f.id}>
              <div className="flex justify-between items-center mb-4">
                <Badge tone="gold">Arabuluculuk</Badge>
                <span className="text-xs text-slate-400">{f.fileNo}</span>
              </div>
              <h4 className="font-bold text-[#0b1f3a]">{f.client} vs {f.opponent}</h4>
              <p className="mt-1 text-sm text-slate-500">{f.subject}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Durum:</span>
                  <span className="font-bold text-amber-dark">{f.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Toplantı:</span>
                  <span className="font-bold text-[#0b1f3a]">{f.hearingDate || "Belirlenmedi"}</span>
                </div>
              </div>
              <button onClick={() => showToast("Arabuluculuk tutanağı hazırlandı")} className="mt-4 w-full rounded-xl bg-[#071a33] py-2 text-xs font-bold text-white">Tutanak Hazırla</button>
            </ShellCard>
          )) : (
            <div className="xl:col-span-3 text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
              Aktif arabuluculuk dosyası bulunmuyor.
            </div>
          )}
        </div>
      </div>
    );
  }

  function UsersModule() {
    return (
      <div className="grid gap-5 xl:grid-cols-3">
        {["Mahmut Kaya - Yönetici Avukat", "Ayşe K. - Asistan", "Selin A. - Muhasebe"].map((user) => (
          <ShellCard key={user}>
            <h3 className="text-lg font-semibold text-[#0b1f3a]">{user}</h3>
            <p className="mt-2 text-sm text-slate-500">Rol bazlı yetki, evrak erişimi ve bildirim tercihleri tanımlı.</p>
            <button onClick={() => showToast(`${user} yetkileri açıldı`)} className="mt-5 rounded-xl border border-[#c7a157] px-4 py-2 text-sm font-medium text-[#0b1f3a]">Yetkileri Düzenle</button>
          </ShellCard>
        ))}
      </div>
    );
  }

  function SettingsModule() {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <ShellCard>
          <SectionTitle title="Büro Ayarları" text="Kurumsal kimlik ve panel tercihleri." />
          <InfoGrid items={[brand.product, brand.subtitle, "Tema: Lacivert + Altın + Beyaz", "Slogan: " + brand.slogan, "Baro sicil: " + brand.barNo]} />
        </ShellCard>
        <ShellCard>
          <SectionTitle title="Sonra Eklenebilir" text="İleri seviye modüller için teknik yol haritası." />
          <InfoGrid items={["SMS / WhatsApp bildirim", "E-imza", "UYAP uyum alanları", "Mobil uygulama", "PDF / Word çıktı sistemi", "Supabase veya Firebase veritabanı"]} />
        </ShellCard>
      </div>
    );
  }
}

function SearchResults({ results, onOpen }: { results: FileRecord[]; onOpen: (id: number) => void }) {
  return (
    <ShellCard className="mb-6 border-[#c7a157]/40 bg-[#fffaf0]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#0b1f3a]">Arama Sonuçları</h2>
          <p className="mt-1 text-sm text-slate-500">Dosya no, müvekkil, mahkeme ve karşı taraf alanlarında arama yapıldı.</p>
        </div>
        <Badge tone="gold">{results.length} sonuç</Badge>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {results.length ? results.map((file) => (
          <button key={file.id} onClick={() => onOpen(file.id)} className="rounded-xl border border-[#c7a157]/30 bg-white p-3 text-left transition hover:border-[#c7a157]">
            <div className="font-medium text-[#0b1f3a]">{file.title}</div>
            <div className="mt-1 text-sm text-slate-500">{file.court} - {file.fileNo}</div>
          </button>
        )) : <p className="text-sm text-slate-500">Eşleşen kayıt bulunamadı.</p>}
      </div>
    </ShellCard>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a57d2c]">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-[#0b1f3a]">{value}</div>
    </div>
  );
}

function InfoGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="rounded-xl border border-slate-200 bg-[#fbfaf7] p-3 text-sm text-slate-700">
          {item}
        </div>
      ))}
    </div>
  );
}