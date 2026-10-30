"""
KalaSetu - Backend API Server & Static Host (:8000)
Implements all endpoints documented in KalaSetu Buyer App Guide:
- GET /api/listings?craft_type=...&status=PASS&lang=...
- GET /api/listings/{id}
- POST /api/orders/bulk
- GET /api/orders/{id}/status
- POST /ondc/on_search
- Serves static website (index.html, styles.css, app.js, mock_data.js)
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import sys

PORT = 8000

# In-memory listings matching 4-Agents output
LISTINGS = [
    {
        "id": "KAL-2026-084",
        "title": "Kondapalli Traditional Dancing Doll (Aata Bomma)",
        "artisan_name": "Lakshmi Devi",
        "cluster": "Kondapalli, Krishna District",
        "craft_type": "Kondapalli",
        "faithfulness_score": 94,
        "status": "PASS",
        "gi_tag": "GI-AP-002",
        "generation": "3rd Generation Artisan",
        "telugu_quote": "ఇది మా తాతగారు నేర్పిన వేప చెక్క బొమ్మ. రంగులన్నీ సహజమైనవే.",
        "quote_translation": "This is the sacred Tella Poniki wood doll taught by my grandfather. All colors are naturally extracted.",
        "price": 950,
        "market_avg": 1280,
        "fair_price_min": 950,
        "breakup": {"artisan": 68, "material": 15, "shipping": 12, "platform": 5},
        "trader_breakup": {"trader_margin": 68, "artisan_share": 15, "material_cost": 12, "misc": 5},
        "story": "Hand-carved from sacred Tella Poniki (soft medicinal white wood). Lakshmi's family has preserved the precise rhythmic balance calibration for 65 years, allowing the dancing doll's head to sway continuously with gentle air breeze.",
        "raw_image_url": "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80",
        "corrected_image_url": "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80",
        "has_coin_reference": True,
        "coin_size_mm": 23,
        "ai_metrics": {
            "wood_authenticity": 96,
            "natural_tamarind_glue": 94,
            "vegetable_pigments": 92,
            "traditional_geometry": 95
        },
        "reel": {
            "duration_sec": 30,
            "audio_lang": "te-IN",
            "transcription": "నమస్కారం, నా పేరు లక్ష్మి. కొండపల్లి గ్రామంలో మా కుటుంబం 60 ఏళ్లుగా ఈ బొమ్మలు చేస్తోంది...",
            "subtitles": "Namaskaram, my name is Lakshmi. Our family in Kondapalli village has carved these dancing dolls for 60 years...",
            "clip_preview": "Lakshmi shaping the soft wood using chisels, applying natural tamarind paste and organic earth colors."
        },
        "inventory": 24
    },
    {
        "id": "KAL-2026-085",
        "title": "Tree of Life - Hand-painted Srikalahasti Kalamkari Dupatta",
        "artisan_name": "Ravi Kumar",
        "cluster": "Srikalahasti, Tirupati District",
        "craft_type": "Kalamkari",
        "faithfulness_score": 96,
        "status": "PASS",
        "gi_tag": "GI-AP-019",
        "generation": "4th Generation Master Craftsman",
        "telugu_quote": "వెదురు కలంతో స్వచ్ఛమైన ఆవు పాలు, కరక్కాయ రసంతో గీసిన కళ.",
        "quote_translation": "Drawn with sharp bamboo pen using pure cow milk and Myrobalan seed extract.",
        "price": 2400,
        "market_avg": 3800,
        "fair_price_min": 2400,
        "breakup": {"artisan": 68, "material": 15, "shipping": 12, "platform": 5},
        "trader_breakup": {"trader_margin": 70, "artisan_share": 14, "material_cost": 11, "misc": 5},
        "story": "Every stroke is hand-drawn using a pointed bamboo reed (kalam) dipped in fermented iron-jaggery black dye. Treated in river Swarnamukhi water across 17 delicate stages to achieve indelible herbal hues.",
        "raw_image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "corrected_image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "has_coin_reference": True,
        "coin_size_mm": 23,
        "ai_metrics": {
            "wood_authenticity": 98,
            "natural_tamarind_glue": 95,
            "vegetable_pigments": 97,
            "traditional_geometry": 94
        },
        "reel": {
            "duration_sec": 30,
            "audio_lang": "te-IN",
            "transcription": "ఈ డిజైన్ పూర్తి కావడానికి 17 రోజులు పట్టింది...",
            "subtitles": "This pattern takes 17 days to finish. Washing in river Swarnamukhi bonds the organic colors permanently...",
            "clip_preview": "Ravi drawing intricate floral motifs with his bamboo pen on pure unbleached cotton."
        },
        "inventory": 12
    },
    {
        "id": "KAL-2026-086",
        "title": "Pure Cotton Nizam Border Handloom Saree",
        "artisan_name": "Venkat Rao",
        "cluster": "Mangalagiri, Guntur District",
        "craft_type": "Mangalagiri",
        "faithfulness_score": 95,
        "status": "PASS",
        "gi_tag": "GI-AP-008",
        "generation": "3rd Generation Weaver",
        "telugu_quote": "గుంటూరు పత్తితో పిట్ లూమ్ పై నేసిన అసలైన నిజాం అంచు.",
        "quote_translation": "Original Nizam border woven on pit-looms using combed high-count Guntur cotton.",
        "price": 1850,
        "market_avg": 2900,
        "fair_price_min": 1850,
        "breakup": {"artisan": 68, "material": 15, "shipping": 12, "platform": 5},
        "trader_breakup": {"trader_margin": 66, "artisan_share": 16, "material_cost": 13, "misc": 5},
        "story": "Woven meticulously on traditional pit looms without any gaps in the zari edge. The distinctive micro-ribbed Nizam temple border gives crisp drape, requiring 40,000 shuttle throws by master weaver Venkat Rao.",
        "raw_image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        "corrected_image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        "has_coin_reference": True,
        "coin_size_mm": 23,
        "ai_metrics": {
            "wood_authenticity": 95,
            "natural_tamarind_glue": 94,
            "vegetable_pigments": 96,
            "traditional_geometry": 95
        },
        "reel": {
            "duration_sec": 30,
            "audio_lang": "te-IN",
            "transcription": "ప్రతి చీరలో మంగళగిరి శ్రామిక చెమట...",
            "subtitles": "Each weave carries the artisanal rhythm of Mangalagiri and royal Nizam heritage...",
            "clip_preview": "Rhythmic movement of foot pedals on the pit loom while Venkat aligns the golden zari thread."
        },
        "inventory": 18
    }
]

ORDERS = {}

class KalaSetuHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # GET /api/listings
        if path == '/api/listings':
            craft_filter = query.get('craft_type', ['all'])[0].lower()
            status_filter = query.get('status', ['PASS'])[0]

            results = []
            for item in LISTINGS:
                if status_filter and item.get('status') != status_filter:
                    continue
                if craft_filter != 'all' and item.get('craft_type', '').lower() != craft_filter:
                    continue
                results.append(item)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(results).encode('utf-8'))
            return

        # GET /api/listings/{id}
        elif path.startswith('/api/listings/'):
            listing_id = path.replace('/api/listings/', '').strip()
            item = next((x for x in LISTINGS if x['id'] == listing_id), None)
            if item:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(item).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Listing not found"}).encode('utf-8'))
            return

        # GET /api/orders/{id}/status
        elif path.startswith('/api/orders/') and path.endswith('/status'):
            parts = path.split('/')
            order_id = parts[3]
            order = ORDERS.get(order_id, {
                "order_id": order_id,
                "status": "CONFIRMED",
                "milestone": "KAL-2026-084"
            })
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(order).encode('utf-8'))
            return

        # Serve static files for everything else
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        try:
            data = json.loads(body) if body else {}
        except Exception:
            data = {}

        # POST /api/orders/bulk
        if path == '/api/orders/bulk':
            listing_id = data.get('listing_id', 'KAL-2026-084')
            qty = int(data.get('quantity', 100))
            phone = data.get('buyer_phone', '')
            order_id = f"KAL-2026-BLK-{len(ORDERS) + 101}"
            
            # 68% direct profit calculation
            item = next((x for x in LISTINGS if x['id'] == listing_id), LISTINGS[0])
            profit = round(qty * item['price'] * 0.68)

            ORDERS[order_id] = {
                "order_id": order_id,
                "listing_id": listing_id,
                "quantity": qty,
                "buyer_phone": phone,
                "status": "PENDING_ARTISAN_APPROVAL",
                "profit": profit
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "order_id": order_id,
                "status": "PENDING_ARTISAN_APPROVAL",
                "profit": profit,
                "varta_ping": "WhatsApp prompt sent to artisan"
            }).encode('utf-8'))
            return

        # POST /ondc/on_search
        elif path == '/ondc/on_search':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "context": {"domain": "retail", "action": "on_search"},
                "message": {"catalog": LISTINGS}
            }).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), KalaSetuHandler) as httpd:
        print(f"KalaSetu Server & API running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
