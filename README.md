# Portofolio Profesional — Muhammad Ravael Chessario Ramdoni

Situs portofolio profesional dua bahasa (**Bahasa Indonesia & Bahasa Inggris**) untuk **Muhammad Ravael Chessario Ramdoni** (*Data Analyst & Data Science Enthusiast*), dibangun dengan stack modern:
- **Framework**: Astro 7 + React 19 Islands + TypeScript Strict
- **Styling & Primitif UI**: Tailwind CSS v4 (CSS Design Tokens) + Radix UI Accessible Dialog
- **Validasi Konten**: Zod Schema Validation (`src/lib/schema.ts` & `src/content/*.json`)
- **CMS Web Berbasis Git**: Decap CMS (`/admin`)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) siap tayang otomatis di **GitHub Pages**, **Cloudflare Pages**, atau **Vercel** tanpa perlu menggunakan *command line* (terminal).

---

## Panduan Langkah demi Langkah (100% Lewat Web GitHub, Tanpa Command Line)

### Bagian 1: Membuat Repositori dan Mengunggah Proyek di Web GitHub

1. Buka [https://github.com](https://github.com) di browser lalu **Sign in** ke akun GitHub Anda (misalnya `ravaelchessario24`).
2. Klik tombol **`+`** di pojok kanan atas halaman GitHub, lalu pilih **New repository**.
3. Isi pengaturan repositori:
   - **Repository name**:
     - Ketik `ravaelchessario24.github.io` jika Anda ingin alamat situs utama bersih (`https://ravaelchessario24.github.io`), **ATAU**
     - Ketik `portofolio` jika ingin alamat `https://ravaelchessario24.github.io/portofolio`.
   - Pilih **Public** (agar GitHub Pages gratis dapat diakses oleh HRD/recruiter).
   - Centang **Add a README file**, lalu klik tombol hijau **Create repository**.
4. Setelah halaman repositori terbuka, klik tombol **Add file** → **Upload files**.
5. Buka folder proyek `portofolio-ravael` di komputer Anda (pastikan Anda memilih isi di dalam folder proyek: folder `src`, `public`, `.github`, serta berkas `package.json`, `astro.config.mjs`, dan `tsconfig.json` — *jangan* mengunggah folder `node_modules` atau `dist`).
6. Tarik dan lepas (*drag and drop*) seluruh folder dan berkas tersebut ke kotak unggah di halaman GitHub.
7. Tunggu proses unggah selesai, lalu pada bagian bawah (**Commit changes**), ketik judul `"Rilis awal portofolio Ravael"` dan klik tombol hijau **Commit changes**.

---

### Bagian 2: Mengaktifkan GitHub Pages (Otomatis Tayang)

1. Di halaman repositori GitHub Anda, klik tab **Settings** (ikon roda gigi di bagian atas).
2. Di menu sebelah kiri, gulir ke bawah lalu klik **Pages** (di bawah bagian *Code and automation*).
3. Pada bagian **Build and deployment** → **Source**, ubah pilihan dari *Deploy from a branch* menjadi **GitHub Actions**.
4. Selesai! Sekarang klik tab **Actions** di bagian atas repositori. Anda akan melihat alur kerja **Deploy Portofolio Ravael to GitHub Pages** berjalan otomatis.
5. Tunggu sekitar **1–2 menit** sampai ikon berubah menjadi centang hijau. Alamat website portofolio Anda akan muncul dan langsung bisa dibuka oleh HRD/recruiter!

*(Alternatif Cloudflare Pages / Vercel)*:
- Jika ingin memakai **Vercel** ([vercel.com](https://vercel.com)) atau **Cloudflare Pages** ([pages.cloudflare.com](https://pages.cloudflare.com)), cukup login menggunakan akun GitHub Anda, klik **Add New Project / Connect to Git**, pilih repositori ini, lalu klik **Deploy**. Framework **Astro** akan terdeteksi otomatis tanpa pengaturan tambahan.

---

### Bagian 3: Cara Mengganti Foto Pribadi, Logo Kampus, CV PDF, dan Gambar Sertifikat Lewat Web GitHub

Semua gambar dan dokumen tersimpan rapi di dalam folder `public/`. Untuk mengganti berkas tanpa menyentuh kode:

1. **Mengganti Berkas CV PDF**:
   - Buka repositori Anda di GitHub → klik folder `public` → klik folder `files`.
   - Klik tombol **Add file** → **Upload files**.
   - Unggah berkas CV terbaru Anda dengan nama **`CV_Muhammad_Ravael_Chessario_Ramdoni.pdf`**, lalu klik **Commit changes**.
2. **Mengganti Logo Kampus**:
   - Buka folder `public/images/`.
   - Unggah logo kampus Anda dengan nama **`itb-ad-logo.svg`** (atau jika berformat `.png`, unggah lalu sesuaikan nama berkasnya di `src/content/education.json`).
3. **Mengganti Gambar Sertifikat Asli**:
   - Buka folder `public/images/certs/` di web GitHub.
   - Klik **Add file** → **Upload files**, lalu unggah gambar sertifikat Anda (misalnya `sertifikat-dsarea.jpg`).
   - Buka berkas `src/content/certificates.json`, klik ikon pensil (**Edit this file**), lalu ubah nilai `"image": "images/certs/sertifikat-dsarea.jpg"` dan klik **Commit changes**.

---

### Bagian 4: Cara Menambah Proyek, Pengalaman, atau Foto Galeri (Lewat CMS Web atau Editor Web GitHub)

Anda memiliki **dua cara mudah** tanpa *command line*:

#### Cara A — Langsung lewat Editor Formulir Web GitHub (Paling Cepat & Tanpa Setup OAuth)
Seluruh teks dan data situs dipisahkan dari kode di dalam folder **`src/content/`**:
- `src/content/profile.json` — Nama, sapaan, kutipan hero, dan foto profil.
- `src/content/about.json` — Paragraf Tentang Saya (Indonesia & Inggris).
- `src/content/gallery.json` — Daftar foto dokumentasi kegiatan, kategori, tanggal, dan deskripsi.
- `src/content/education.json` — Kampus, IPK (`3.77`), prestasi peringkat, dan mata kuliah favorit.
- `src/content/experience.json` — Pengalaman KKN dan Magang beserta detail tugas, hasil, dan daftar foto dokumentasi.
- `src/content/projects.json` — Daftar proyek serta isi lengkap halaman **Case Study** (mendukung `"template": "ml"` untuk *Machine Learning/Data Science* dan `"template": "da"` untuk *Data Analyst/Dashboard*).
- `src/content/skills.json` — Daftar keterampilan dan logo tool beserta keterangan `"usedIn"`.
- `src/content/certificates.json` — Daftar sertifikasi dan pelatihan.
- `src/content/contact.json` — Status `"availableFrom"`, tautan LinkedIn, dan tautan Google Maps.

**Langkah menambah proyek atau foto baru di GitHub Web**:
1. Untuk menambah foto terlebih dahulu: buka `public/images/gallery/` (atau `public/images/projects/`), klik **Add file** → **Upload files**, unggah foto Anda, lalu klik **Commit changes**.
2. Buka folder `src/content/` lalu klik berkas yang ingin diubah (misalnya `projects.json` atau `gallery.json`).
3. Klik ikon pensil (**Edit this file**) di kanan atas.
4. Salin salah satu blok `{ ... }` yang sudah ada, tempel di bawahnya (pisahkan dengan tanda koma `,`), lalu ganti teks Bahasa Indonesia (`"id"`) dan Bahasa Inggris (`"en"`).
5. Klik tombol hijau **Commit changes** di kanan atas. GitHub Actions akan otomatis membangun ulang situs Anda dalam ~1 menit!

#### Cara B — Menggunakan Antarmuka Web CMS (`/admin`)
Proyek ini sudah dilengkapi konfigurasi **Decap CMS** di `public/admin/index.html` dan `public/admin/config.yml`:
1. Jika Anda menghubungkan repositori ini ke **Netlify** atau **Cloudflare Pages / Vercel dengan OAuth GitHub**, Anda cukup membuka alamat `https://alamat-situs-anda/admin`.
2. Login dengan akun GitHub Anda, lalu tambah atau ubah isi Profil, Tentang, Pendidikan, dan Kontak langsung melalui formulir visual dan klik **Publish**.
