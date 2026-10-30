# KalaSetu (कला सेतु • కళా సేతు) — Story-Trust ONDC Buyer App

> **"Story You Can Trust —  Faithfulness Verified • Artisan Gets "**

KalaSetu is a next-generation cultural preservation platform and ONDC Buyer Web Application that directly connects traditional Indian artisans and weavers to buyers, eliminating predatory middleman commissions.

---

## 🏛️ System Architecture

Per the KalaSetu Buyer App specification, the system cleanly separates the **Frontend Trust Layer** from the **4-Agents Intelligence Backend**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   KalaSetu Buyer Web Application                       │
│  (Story-Verified Feed • 94% Faithfulness Badge • 68% Donut Chart •     │
│   30s Reel Player • QR Passport • Varta WhatsApp Live Simulation)       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ REST API (port 8000)
┌────────────────────────────────────▼───────────────────────────────────┐
│              4-Agents Backend (FastAPI / LangGraph)                    │
│                                                                        │
│  1. Saathi Agent       : Bhashini Voice STT -> Indigenous JSON listing │
│  2. Kala-Drishti Agent : YOLO + CLIP Authenticity (>=90% PASS badge)   │
│  3. Bazaar-Bhav Agent  : ONDC Open Network Pricing Engine             │
│  4. Varta Agent        : Direct WhatsApp YES/NO Artisan Negotiation    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features Implemented

### 1. Multi-Craft Verified HomeFeed
- Interactive category filtering: **All**, **Kondapalli Toys**, **Srikalahasti Kalamkari**, **Mangalagiri Handloom**, **Etikoppaka Lacquer**, and **Banjara Needlecraft**.
- **Faithfulness Badge**: Highlights `94% PASS ✓` (or filters out knockoffs flagged below 90% by Kala-Drishti).
- **Physical Coin Scaling**: Scaled and calibrated against a ₹5 physical coin reference (23mm).
- **Handwritten Indigenous Accents**: Featuring authentic Telugu artisan quotes: `"ఇది మా తాతగారు నేర్పిన వేప చెక్క బొమ్మ"`.

### 2. Transparent Fair-Share Doughnut Chart
- Visual and interactive comparison:
  - **KalaSetu Model**: Artisan directly receives **68%** (#6A8E3C), Raw Materials **15%**, Safe Packaging **12%**, Open Platform **5%**.
  - **Traditional Trader System**: Middlemen extracted **68%**, leaving the artisan with barely **15%**.

### 3. 30-Second Story Reel
- Field-recorded artisan narration with real-time bilingual subtitles (native Telugu + English translation).
- Voice playback powered by regional speech synthesis and synced progress bar.

### 4. Varta WhatsApp Agent Bulk Negotiation
- Buyers can request customized bulk orders (e.g. 100 pcs in 20 days).
- Directly triggers the **Varta LangGraph Agent**, simulating live message arrival on the artisan's WhatsApp terminal.
- Interactive WhatsApp buttons: `[ ✅ YES - Accept ]`, `[ 💬 Counter-Offer ]`, `[ ❌ Decline ]`.
- Real-time status transitions: `PENDING_ARTISAN_APPROVAL` → `CONFIRMED (KAL-2026-084)`.

### 5. QR Craft Passport
- Cryptographic provenance and GI-tag validation for each handcrafted masterpiece.
- Downloadable/scannable QR certificate linked to `https://kalasetu.com/verify/KAL-2026-084`.

### 6. Multi-Lingual Support (12 Languages via Bhashini)
- Real-time language switching: **English**, **తెలుగు (Telugu)**, **हिन्दी (Hindi)**, **தமிழ் (Tamil)**, and **ಕನ್ನಡ (Kannada)**.

### 7. Dual Viewport Experience
- Toggle between **🖥️ Full Desktop Web View** and **📱 Mobile APK Emulator Frame** with one click.

---

## 🚀 How to Run Locally

### Option 1: Start the Server (Serves Web App + Backend API on :8000)
```powershell
python server.py
```
Then open [http://localhost:8000](http://localhost:8000) in your web browser.

### Option 2: Run Any Static Server
```powershell
python -m http.server 8000
```

---

## 📡 API Endpoints Implemented

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/listings` | `GET` | Returns verified listings where Kala-Drishti score >= 90% |
| `/api/listings/{id}` | `GET` | Returns detailed listing with faithfulness, breakup, reel, and QR data |
| `/api/orders/bulk` | `POST` | Triggers Varta Agent and dispatches WhatsApp notification to artisan |
| `/api/orders/{id}/status` | `GET` | Polls order status (`PENDING` → `CONFIRMED`) |
| `/ondc/on_search` | `POST` | ONDC Protocol craft discovery catalog |

---

## 🎨 Design Tokens

- **Primary**: `#D1562F` (Terracotta - Kondapalli)
- **Background**: `#FFE9E1` (Light Terracotta) / `#FFFBF8` (Cotton Canvas)
- **Artisan Green**: `#6A8E3C` (68% Fair Share)
- **Faithfulness Pass**: `#DCFCE7` (Text: `#166534`)
- **Ink**: `#371C12` (Earthy Deep Brown)
- **Display Font**: `Instrument Serif`
- **Body Font**: `DM Sans`
- **Handwritten Accent**: `Caveat`
