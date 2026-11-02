# 📒 NoteZ v2.1 — Pure Offline Super-App

<div align="center">

**Aplikasi produktivitas offline-first bergaya Neo-Brutalism.**
Catatan, tugas, keuangan, dan watchlist — semuanya tersimpan aman di perangkatmu.

![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.3.0-61DAFB?logo=react)
![Capacitor](https://img.shields.io/badge/Capacitor-8.6.0-119EFF?logo=capacitor)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-Private-red)

</div>

---

## ✨ Fitur Utama

### 📋 Manajemen Tugas & Habit Tracker
- CRUD lengkap untuk tugas harian dengan **prioritas** (Tinggi / Sedang / Rendah), **kategori** (Kuliah, Kerja, Pribadi, Project, Keluarga), **deadline**, dan **alarm pengingat**.
- Sub-tugas (checklist interaktif) di dalam setiap tugas.
- Pengulangan otomatis: Harian, Mingguan, Bulanan.
- **Pin ke Widget HP** — tugas penting muncul di home screen Android.
- **Habit Tracker** dengan streak harian, rekor terbaik, dan visualisasi 7 hari terakhir.
- **Pomodoro Timer** terintegrasi dengan durasi kerja/istirahat yang bisa dikustomisasi.

### 💰 Keuangan Multi-Dompet
- Kelola banyak dompet: **Tunai, E-Wallet, Bank, Tabungan**.
- Catat transaksi **pemasukan / pengeluaran / transfer** antar dompet (dengan opsi biaya admin).
- **Budget Tracker** — atur batas anggaran bulanan per kategori.
- **Bill Tracker** — lacak tagihan rutin (bulanan, mingguan, tahunan).
- **Manajemen Utang & Piutang** dengan riwayat cicilan dan status pelunasan.
- Format mata uang Rupiah Indonesia otomatis saat mengetik (pemisah titik ribuan real-time).

### 📝 Catatan Cerdas
- Buat catatan teks bebas atau mode **checklist**.
- Organisasi dengan **folder** (Ide, Kuliah, Jurnal, dll.), **tag**, dan **pin**.
- Kustomisasi warna kartu per catatan.
- Tampilkan catatan penting di widget home screen.
- **Soft-delete** dengan keranjang sampah (bisa dipulihkan).

### 🎯 Celengan Impian (Wishlist)
- Tentukan **target harga** dan prioritas bintang (1–5).
- Lacak progres menabung dengan riwayat **deposit & penarikan** yang terhubung ke dompet.
- Kategori: Gadget, Fashion, Edukasi, Hiburan, Lainnya.
- Pin ke widget home screen.

### 🎬 Tontonan & Watchlist
- Catat anime, film, serial, dan video.
- Status: Sedang Nonton, Tamat, Dropped, Rencana Tonton, On-Hold.
- Rating 1–10 dan sistem **tier** (S/A/B/C/D), review teks dengan flag spoiler.
- Tracking episode/season, hari tayang, poster URL & link tonton.
- Pengingat untuk acara yang sedang tayang.

### 🔔 Notifikasi Native Android
- Alarm pengingat tugas tepat waktu via `SCHEDULE_EXACT_ALARM`.
- Notifikasi evaluasi harian, pengingat habit, dan alert keuangan.
- **In-App Notification Drawer** real-time dengan kategori (todo, habit, finance, media, system).
- Custom ikon notifikasi monokrom dan aksen warna NoteZ `#FFE135`.
- Alarm bertahan setelah reboot perangkat (`BootReceiver`).

### 📱 Widget Layar Utama Android
- Widget native menampilkan tugas yang di-pin, catatan sticky, dan progres wishlist.
- Sinkronisasi data otomatis dari IndexedDB ke Android Widget via `WidgetBridgePlugin`.

### ⚙️ Pengaturan Lengkap
- Pilihan 5 preset tema resmi.
- Waktu pengingat harian, habit, dan keuangan yang bisa dikustomisasi.
- Durasi Pomodoro (kerja/istirahat).
- Toggle haptic feedback.
- PIN lock untuk keamanan.
- Backup & restore data offline.

---

## 🎨 5 Preset Tema Resmi

NoteZ v2.1 hadir dengan **Multi-Theme Engine** berbasis CSS custom properties dan atribut `data-theme`:

| # | Tema | Mode | Palet Utama | Karakter |
|---|------|------|-------------|----------|
| 1 | **Classic Brutal** | ☀️ Light | Gading `#FFFDF7` + Kuning `#FFE135` | Neo-Brutalism klasik, border hitam tebal, shadow keras |
| 2 | **Cyber Lime** | 🌙 Dark | Gelap `#0C0D10` + Lime `#CCFF00` | Neon hijau berenergi, border `#84A916` |
| 3 | **Cyber Blue** | 🌙 Dark | Navy `#0B0E14` + Cyan `#00F0FF` | Biru elektrik futuristik, aksen `#0284C7` |
| 4 | **Violet Dark** | 🌙 Dark | Charcoal `#0F0E17` + Ungu `#7C3AED` | Ungu mewah & elegan, hero border pink `#EC4899` |
| 5 | **OLED Black** | 🌙 Dark | True Black `#000000` + Emerald `#10B981` | Hitam pekat hemat baterai OLED, border hijau `#059669` |

Setiap tema mendefinisikan 12+ token: `--theme-bg`, `--theme-outer-bg`, `--theme-surface`, `--theme-surface-elevated`, `--theme-border`, `--theme-border-hero`, `--theme-border-subtle`, `--theme-shell-border`, `--theme-shadow`, `--theme-accent-primary`, `--theme-accent-secondary`, `--theme-accent-text`, `--theme-text-primary`, `--theme-text-muted`.

---

## 🏗️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 16.4.3 | Framework aplikasi (static export) |
| **React** | 19.3.0 | Library UI |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Dexie.js** | 4.4.7 | IndexedDB wrapper (database offline) |
| **dexie-react-hooks** | 4.4.0 | Live queries reaktif |
| **Capacitor** | 8.6.0 | Native Android bridge |
| **@capacitor/local-notifications** | 8.3.1 | Notifikasi native |
| **@capacitor/preferences** | 8.0.1 | Key-value storage native |
| **@capacitor/app** | 8.1.2 | App lifecycle events |
| **@tabler/icons-react** | 3.50.0 | Ikon SVG |
| **Zustand** | 5.0.16 | State management |
| **date-fns** | 4.4.0 | Utilitas tanggal |
| **clsx + tailwind-merge** | — | Class name utilities |

### Font
- **Space Grotesk** — font utama (bold, geometric)
- **JetBrains Mono** — font monospace (nominal keuangan, kode)

---

## 🗄️ Database Schema (Dexie IndexedDB)

Database: **`NoteZDatabase`** — versi 1, total **11 tabel**.

| Tabel | Deskripsi | Index |
|-------|-----------|-------|
| `wallets` | Dompet pengguna (tunai, e-wallet, bank, tabungan) | `id`, `type`, `name`, `createdAt` |
| `transactions` | Riwayat pemasukan / pengeluaran / transfer | `id`, `walletId`, `toWalletId`, `type`, `category`, `date` |
| `budgets_and_bills` | Anggaran bulanan & tagihan rutin | `id`, `type`, `category`, `monthYear`, `dueDayOfMonth`, `walletId` |
| `debts` | Utang & piutang dengan status pelunasan | `id`, `type`, `personName`, `dueDate`, `isSettled` |
| `todos` | Tugas & to-do list dengan subtask | `id`, `priority`, `category`, `dueDate`, `isCompleted`, `pinToHomeWidget`, `recurrence` |
| `habits` | Kebiasaan harian & streak | `id`, `title`, `currentStreak` |
| `notes` | Catatan teks & checklist (soft-delete) | `id`, `folder`, `isPinned`, `showOnHomeWidget`, `isTrashed`, `createdAt`, `updatedAt` |
| `media_watchlist` | Watchlist tontonan (anime, film, serial) | `id`, `type`, `status`, `score`, `tier`, `airingDay`, `reminderEnabled` |
| `wishlists` | Celengan impian & progres tabungan | `id`, `priorityStars`, `showOnHomeWidget`, `isAchieved`, `createdAt` |
| `notifications` | Notifikasi in-app | `id`, `category`, `isRead`, `createdAt` |
| `settings` | Pengaturan aplikasi (single row) | `id` |

> **100% Offline** — Seluruh data tersimpan di IndexedDB perangkat. Tidak ada server, tidak ada cloud, tidak ada tracking. Data sepenuhnya milikmu.

---

## 📱 Info Android Native

| Property | Value |
|----------|-------|
| **Application ID** | `com.moreyartea.notez` |
| **Min SDK** | 24 (Android 7.0 Nougat) |
| **Target SDK** | 36 |
| **Compile SDK** | 36 |
| **Version Code** | 21 |
| **Version Name** | 2.1 |

### Permissions
- `POST_NOTIFICATIONS` — Mengirim notifikasi
- `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` — Alarm tepat waktu
- `RECEIVE_BOOT_COMPLETED` — Jadwalkan ulang alarm setelah reboot
- `WAKE_LOCK` — Menjaga proses alarm
- `INTERNET` — Memuat webview

### Custom Native Components

| Class | Bahasa | Fungsi |
|-------|--------|--------|
| `MainActivity.java` | Java | Activity utama Capacitor |
| `WidgetBridgePlugin.java` | Java | Capacitor plugin sinkronisasi data web → widget native |
| `NoteZWidgetProvider.kt` | Kotlin | AppWidgetProvider untuk widget tugas di home screen |
| `BootReceiver.java` | Java | BroadcastReceiver untuk reschedule alarm setelah reboot |

### Notification Channel
- **ID**: `notez_channel`
- **Nama**: NoteZ Notifikasi
- **Small Icon**: `ic_stat_notez` (monochrome NoteZ silhouette)
- **Aksen Warna**: `#FFE135`

---

## 📂 Struktur Proyek

```
NoteZ 2.0/
├── app/                              # Next.js App Router
│   ├── globals.css                   # CSS global + 5 tema preset
│   ├── layout.tsx                    # Root layout, metadata, font, theme script
│   ├── page.tsx                      # Dashboard (halaman utama)
│   ├── finance/page.tsx              # Modul keuangan
│   ├── media/page.tsx                # Watchlist tontonan
│   ├── notes/page.tsx                # Catatan
│   ├── settings/page.tsx             # Pengaturan sistem
│   ├── todos/page.tsx                # Tugas, habit, & pomodoro
│   ├── wishlist/page.tsx             # Celengan impian
│   └── lib/
│       ├── db.ts                     # Dexie database schema (11 tabel)
│       ├── types.ts                  # TypeScript type definitions
│       ├── utils.ts                  # Utilitas (cn, formatCurrency, dll.)
│       └── services/                 # Business logic layer
│           ├── backupService.ts      # Ekspor / impor / reset database
│           ├── financeService.ts     # CRUD dompet, transaksi, anggaran, utang
│           ├── habitService.ts       # CRUD habit & logika streak
│           ├── mediaService.ts       # CRUD watchlist media
│           ├── noteService.ts        # CRUD catatan + soft delete
│           ├── notificationService.ts  # Penjadwalan notifikasi native
│           ├── settingsService.ts    # Manajemen tema & pengaturan
│           ├── todoService.ts        # CRUD tugas + subtask
│           ├── widgetSyncService.ts  # Sinkronisasi data → widget Android
│           └── wishlistService.ts    # CRUD wishlist & tabungan
├── components/
│   ├── ui/                           # Design system Neo-Brutalism
│   │   ├── NbCard.tsx                # Kartu dengan border tebal & shadow
│   │   ├── NbButton.tsx              # Tombol Neo-Brutalism
│   │   ├── NbModal.tsx               # Modal dialog
│   │   ├── NbConfirmModal.tsx        # Modal konfirmasi (danger/warning/primary)
│   │   ├── NbInput.tsx               # Input field
│   │   ├── NbSelect.tsx              # Dropdown select
│   │   ├── NbBadge.tsx               # Badge/label
│   │   ├── AppLogo.tsx               # Logo NoteZ (siluet adaptif)
│   │   └── index.ts                  # Barrel exports
│   ├── layout/
│   │   ├── AppShell.tsx              # Shell utama (header + konten + nav)
│   │   ├── BottomNav.tsx             # Navigasi bawah
│   │   └── LiveDeviceClock.tsx       # Jam perangkat real-time
│   ├── finance/                      # Komponen modul keuangan
│   │   ├── BudgetTrackerCard.tsx
│   │   ├── DebtManagementSection.tsx
│   │   ├── TransactionHistoryList.tsx
│   │   ├── TransactionModal.tsx
│   │   └── WalletCardList.tsx
│   ├── media/                        # Komponen modul tontonan
│   │   ├── MediaCard.tsx
│   │   └── MediaModal.tsx
│   ├── notes/                        # Komponen modul catatan
│   │   ├── NoteCard.tsx
│   │   ├── NoteModal.tsx
│   │   └── TrashModal.tsx
│   ├── notifications/                # Bell icon & notification drawer
│   │   ├── NotificationBell.tsx
│   │   └── NotificationDrawer.tsx
│   ├── todos/                        # Komponen modul tugas & habit
│   │   ├── TodoListSection.tsx
│   │   ├── TodoModal.tsx
│   │   ├── HabitTrackerSection.tsx
│   │   ├── HabitModal.tsx
│   │   └── PomodoroSection.tsx
│   └── wishlist/                     # Komponen modul celengan impian
│       ├── WishlistCard.tsx
│       ├── WishlistModal.tsx
│       └── DepositModal.tsx
├── android/                          # Capacitor Android native project
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/moreyartea/notez/
│       │   ├── MainActivity.java
│       │   ├── WidgetBridgePlugin.java
│       │   └── BootReceiver.java
│       ├── kotlin/com/moreyartea/notez/
│       │   └── NoteZWidgetProvider.kt
│       └── res/
│           ├── drawable/             # Ikon & background
│           ├── layout/               # Widget layout XML
│           ├── mipmap-*/             # Ikon launcher (semua densitas)
│           └── xml/                  # Widget provider info
├── public/                           # Aset statis (ikon, logo SVG)
├── capacitor.config.ts               # Konfigurasi Capacitor
├── next.config.ts                    # Konfigurasi Next.js (static export)
├── tsconfig.json                     # Konfigurasi TypeScript
└── package.json                      # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** atau **pnpm**
- **Android Studio** (untuk build APK)
- **JDK 21** (sudah termasuk di Android Studio)

### Instalasi & Development

```bash
# Clone repository
git clone <repo-url>
cd "NoteZ 2.0"

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build & Deploy ke Android

```bash
# Build static export
npm run build

# Sinkronkan ke proyek Android
npx cap sync android

# Buka di Android Studio
npx cap open android
```

Dari Android Studio, klik **Run ▶** atau **Build → Generate Signed APK** untuk menghasilkan file `.apk`.

### Scripts

| Script | Perintah | Fungsi |
|--------|----------|--------|
| `dev` | `npm run dev` | Menjalankan development server |
| `build` | `npm run build` | Build produksi (static export ke `out/`) |
| `start` | `npm start` | Serve build produksi |
| `lint` | `npm run lint` | Jalankan ESLint |

---

## 📦 Backup & Restore

NoteZ mendukung **ekspor dan impor data offline** dalam format JSON:

1. Buka **Pengaturan** → **Manajemen Data**
2. **Ekspor Full Backup** — mengunduh seluruh 11 tabel ke satu file `.json`
3. **Pulihkan dari File** — muat file backup untuk mengembalikan semua data
4. **Reset Pabrik** — hapus seluruh data (memerlukan ketik "HAPUS" sebagai konfirmasi)

> ⚠️ **Backup secara berkala!** Data tersimpan di IndexedDB browser/webview — menghapus data aplikasi atau uninstall akan menghapus seluruh catatan.

---

## 🏷️ Changelog

### v2.1.0 (November 2026)
- ✅ Format mata uang real-time saat mengetik (pemisah titik ribuan Indonesia)
- ✅ Logo frameless (siluet murni tanpa kotak buatan)
- ✅ Audit kontras dark mode pada seluruh modal & form
- ✅ Border kartu lebih tebal dan tegas (`border-[3px]` pada kartu utama)
- ✅ Semua `window.confirm` diganti dengan `NbConfirmModal` bertema Neo-Brutalism
- ✅ Version bump ke v2.1

### v2.0.x
- ✅ Multi-Theme Engine dengan 5 preset resmi (Classic Brutal, Cyber Lime, Cyber Blue, Violet Dark, OLED Black)
- ✅ Sistem notifikasi native Android (exact alarm dengan `allowWhileIdle`)
- ✅ Home screen widget Android dengan sinkronisasi data
- ✅ Alarm bertahan setelah reboot (`BootReceiver`)
- ✅ Custom launcher icon & notification icon NoteZ
- ✅ Fix kontras teks lintas tema (light & dark)
- ✅ Fix tab navigasi terpotong (shadow clipping)
- ✅ Fix hero card visibility di mode classic
- ✅ Harmonisasi sub-card metrik tontonan

---

## 🔧 Arsitektur

```
┌──────────────────────────────────────────┐
│              Android (Capacitor)          │
│  ┌─────────────────────────────────────┐ │
│  │       WebView (Next.js Static)      │ │
│  │  ┌──────────┐    ┌───────────────┐  │ │
│  │  │   React  │───▶│  Dexie.js     │  │ │
│  │  │   (UI)   │    │  (IndexedDB)  │  │ │
│  │  └──────────┘    └───────────────┘  │ │
│  │        │                             │ │
│  │        ▼                             │ │
│  │  ┌─────────────────────────────┐    │ │
│  │  │      Service Layer          │    │ │
│  │  │  (todo, finance, notes...)  │    │ │
│  │  └─────────────────────────────┘    │ │
│  └──────────────┬──────────────────────┘ │
│                 │ Capacitor Bridge        │
│  ┌──────────────▼──────────────────────┐ │
│  │        Native Android Layer         │ │
│  │  • LocalNotifications (Alarm)       │ │
│  │  • WidgetBridgePlugin (Widget Sync) │ │
│  │  • NoteZWidgetProvider (UI Widget)  │ │
│  │  • BootReceiver (Reboot Persist)    │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 📄 Lisensi

Proyek ini bersifat **private** dan tidak dipublikasikan secara open-source.

---

<div align="center">

**NoteZ v2.1** — Dibuat dengan ☕ dan Neo-Brutalism.
*100% Offline. 0% Tracking. Datamu milikmu.*

</div>
