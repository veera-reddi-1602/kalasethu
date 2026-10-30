// Kalavirasat (Artisans • Heritage • Global)
// Standalone Mobile Application Logic (100% Android WebView compatible)

(function () {
  const TRENDING_PRODUCTS = [
    {
      id: "KAL-084",
      title: "Decorative Showpiece - 22.5 cm (Wood, Multicolor)",
      brand: "PALJJI HANDICRAFTS",
      category: "Wood Crafts",
      price: 347,
      market_avg: 799,
      rating: 4.3,
      reviews: 16,
      artisan: "Lakshmi Devi",
      cluster: "Kondapalli, Krishna Dist.",
      score: 98,
      image: "assets/kondapalli_balaji_product.png",
      quote: "ఇది మా తాతగారు నేర్పిన తెల్ల పొనికి చెక్క వెంకటేశ్వర స్వామి బొమ్మ. రంగులన్నీ సహజమైనవే.",
      story: "Authentic GI-tagged Kondapalli Balaji showpiece hand-carved from sacred Tella Poniki medicinal wood by master artisan Lakshmi Devi."
    },
    {
      id: "KAL-085",
      title: "Pochampally Saree",
      category: "Textiles",
      price: 5499,
      market_avg: 7800,
      rating: 4.8,
      reviews: 320,
      artisan: "Koteshwar Rao",
      cluster: "Bhoodan Pochampally",
      score: 96,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
      quote: "పగిలిపోని దారాలతో రంగులద్ది నేసిన పవిత్రమైన పోచంపల్లి ఇక్కత్.",
      story: "Double Ikat pure silk weave by master weaver Koteshwar Rao. Warp and weft dyed in mathematical geometry before 15 days of weaving."
    },
    {
      id: "KAL-086",
      title: "Brass Diya",
      category: "Metal Crafts",
      price: 1250,
      market_avg: 1850,
      rating: 4.7,
      reviews: 98,
      artisan: "Gopalachari",
      cluster: "Nachiar Koil Cluster",
      score: 95,
      image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=400&q=80",
      quote: "పచ్చి మట్టి అచ్చులలో స్వచ్ఛమైన ఇత్తడితో పోతపోసిన దైవిక దీపం.",
      story: "Hand-turned bell metal and pure brass lamp with sacred Hansa finial. Cast using traditional lost-wax green sand metallurgy."
    },
    {
      id: "KAL-087",
      title: "Madhubani Painting",
      category: "Paintings",
      price: 2999,
      market_avg: 4500,
      rating: 4.6,
      reviews: 76,
      artisan: "Sita Devi",
      cluster: "Jitwarpur, Mithila",
      score: 96,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
      quote: "వెదురు పుల్లలతో వేప, పసుపు, కాటుక రంగులతో వేసిన మిథిలా చిత్రం.",
      story: "Handmade paper treated with organic clay depicting the auspicious Lotus Goddess. Painted using pointed bamboo nibs."
    },
    {
      id: "KAL-088",
      title: "Etikoppaka Toys",
      category: "Wood Crafts",
      price: 780,
      market_avg: 1150,
      rating: 4.7,
      reviews: 85,
      artisan: "Appa Rao",
      cluster: "Etikoppaka, Visakhapatnam",
      score: 93,
      image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80",
      quote: "అంకుడు చెక్క, సీతాఫలం విత్తనాల సహజ రంగులు. పసిపిల్లలకు అమృత సమానం.",
      story: "Lathe-turned soft Ankudu wood polished with natural lac resins. Non-toxic organic colors completely safe for infants."
    }
  ];

  class KalavirasatManager {
    constructor() {
      this.cart = JSON.parse(localStorage.getItem('kalavirasat_cart') || '[]');
      this.wishlist = JSON.parse(localStorage.getItem('kalavirasat_wishlist') || '[]');
      this.activeFilter = 'all';

      this.init();
    }

    init() {
      window.scrollTo(0, 0);
      this.updateCartBadge();
      this.setupEventListeners();
      this.initCarousel();

      if (window.location.hash === '#artisan-inbox') {
        setTimeout(() => this.openArtisanWhatsApp(), 400);
      }
      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#artisan-inbox') this.openArtisanWhatsApp();
      });
    }

    initCarousel() {
      this.currentSlide = 0;
      this.totalSlides = 4;
      this.autoSlideTimer = null;

      const track = document.getElementById('heroSliderTrack');
      if (!track) return;

      this.startAutoSlide();

      // Mobile touch swipe gestures
      let touchStartX = 0;
      let touchEndX = 0;
      track.addEventListener('touchstart', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].screenX;
        }
        this.stopAutoSlide();
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchEndX = e.changedTouches[0].screenX;
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 35) {
            if (diff > 0) {
              this.goToSlide(this.currentSlide + 1);
            } else {
              this.goToSlide(this.currentSlide - 1);
            }
          }
        }
        this.startAutoSlide();
      }, { passive: true });
    }

    goToSlide(index) {
      const track = document.getElementById('heroSliderTrack');
      const dots = document.querySelectorAll('#heroCarouselDots .carousel-dot');
      if (!track) return;

      this.currentSlide = (index + (this.totalSlides || 4)) % (this.totalSlides || 4);
      track.style.transform = `translateX(-${this.currentSlide * 100}%)`;

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentSlide);
      });
    }

    startAutoSlide() {
      this.stopAutoSlide();
      this.autoSlideTimer = setInterval(() => {
        this.goToSlide(this.currentSlide + 1);
      }, 4000);
    }

    stopAutoSlide() {
      if (this.autoSlideTimer) {
        clearInterval(this.autoSlideTimer);
        this.autoSlideTimer = null;
      }
    }

    renderTrending(query = '') {
      const container = document.getElementById('trendingProductsContainer');
      if (!container) return;

      const items = TRENDING_PRODUCTS.filter(p => {
        if (this.activeFilter !== 'all' && this.activeFilter !== 'All Categories') {
          const match = p.category?.toLowerCase().includes(this.activeFilter.toLowerCase()) ||
                        p.title.toLowerCase().includes(this.activeFilter.toLowerCase());
          if (!match) return false;
        }
        if (!query) return true;
        return p.title.toLowerCase().includes(query) || p.artisan.toLowerCase().includes(query);
      });

      container.innerHTML = items.map(item => {
        const isWish = this.wishlist.includes(item.id);
        return `
          <div class="trending-item-card" onclick="window.kalaApp.showProductStory('${item.id}')">
            <div class="trending-card-top">
              <img src="${item.image}" alt="${item.title}" loading="lazy" />
              <button class="card-wishlist-heart" onclick="window.kalaApp.toggleWishlist('${item.id}', event)">
                ${isWish ? '❤️' : '🤍'}
              </button>
            </div>
            <div class="trending-info-area">
              <h3 class="trending-item-name">${item.title}</h3>
              <div class="trending-item-price">₹${item.price.toLocaleString('en-IN')}</div>
              <div class="trending-rating-line">
                <span class="star-symbol">★</span>
                <span>${item.rating} (${item.reviews})</span>
              </div>
              <button class="add-cart-red-btn" onclick="window.kalaApp.addToCart('${item.id}', event)">
                🛒 Add to Cart
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    filterByCategory(name) {
      this.activeFilter = (name === 'All Categories' || name === 'all') ? 'all' : name;
      this.renderTrending();
      this.scrollToTrending();
      this.toast(`Filtered: ${name}`);
    }

    scrollToTrending() {
      const target = document.getElementById('trendingSection');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }

    toggleWishlist(id, e) {
      if (e) e.stopPropagation();
      if (this.wishlist.includes(id)) {
        this.wishlist = this.wishlist.filter(x => x !== id);
        this.toast('Removed from Wishlist');
      } else {
        this.wishlist.push(id);
        this.toast('❤️ Added to Wishlist');
      }
      localStorage.setItem('kalavirasat_wishlist', JSON.stringify(this.wishlist));
      this.renderTrending();
    }

    addToCart(id, e) {
      if (e) e.stopPropagation();
      const item = TRENDING_PRODUCTS.find(p => p.id === id);
      if (!item) return;

      const existing = this.cart.find(c => c.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.cart.push({ id, quantity: 1, item });
      }
      localStorage.setItem('kalavirasat_cart', JSON.stringify(this.cart));
      this.updateCartBadge();
      this.toast(`🛒 Added "${item.title}" to Cart`);
    }

    updateCartBadge() {
      const badge = document.getElementById('cartBadgeCount');
      const fkBadge = document.getElementById('fkCartBadge');
      const total = this.cart.reduce((s, i) => s + i.quantity, 0);
      if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
      }
      if (fkBadge) {
        fkBadge.textContent = 13 + total;
      }
    }

    openFlipkartPdp() {
      const pdp = document.getElementById('flipkartPdpView');
      if (pdp) {
        pdp.classList.add('active');
        const scrollBody = pdp.querySelector('.fk-scroll-body');
        if (scrollBody) scrollBody.scrollTo({ top: 0, behavior: 'instant' });
        this.updateCartBadge();
      }
    }

    closeFlipkartPdp() {
      const pdp = document.getElementById('flipkartPdpView');
      if (pdp) pdp.classList.remove('active');
    }

    toggleAboutCraftText() {
      const exp = document.getElementById('pdpAboutExpanded');
      const btn = document.getElementById('pdpReadMoreBtn');
      if (!exp) return;
      const isShown = exp.classList.toggle('show');
      if (btn) btn.textContent = isShown ? 'Read less ⌃' : 'Read more ⌵';
    }

    togglePdpAccordion(header) {
      const panel = header.nextElementSibling;
      const chevron = header.querySelector('.pdp-acc-chevron');
      if (!panel) return;
      const isOpen = panel.classList.toggle('open');
      if (chevron) {
        chevron.textContent = isOpen ? '⌃' : '⌄';
        chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }

    open3DViewer() {
      this.toast('🧊 3D Interactive Model: 360° rotation enabled');
    }

    openARViewer() {
      this.toast('📱 AR Preview: View Kondapalli doll in your room');
    }

    openHeritageChat() {
      this.openSaathiModal();
    }

    openSaathiModal() {
      const modal = document.getElementById('saathiVoiceBridgeModal');
      if (modal) {
        modal.classList.add('active');
        const scroll = document.getElementById('saathiScrollBody');
        if (scroll) scroll.scrollTop = 0;
      }
    }

    closeSaathiModal() {
      const modal = document.getElementById('saathiVoiceBridgeModal');
      if (modal) modal.classList.remove('active');
      this.stopTeluguAudio();
    }

    selectSaathiIntent(intent) {
      this.currentSaathiIntent = intent;
      const opts = ['optCustomize', 'optBulk', 'optQuestion', 'optLanguage'];
      opts.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('selected');
      });

      const input = document.getElementById('saathiBuyerInput');
      if (intent === 'customize') {
        document.getElementById('optCustomize')?.classList.add('selected');
        if (input) input.value = "Can you make this toy in blue and add my name VINAY? I need 20 pieces.";
      } else if (intent === 'bulk') {
        document.getElementById('optBulk')?.classList.add('selected');
        if (input) input.value = "We need 50 pieces of this Kondapalli showpiece for a wedding ceremony. Can you share artisan wholesale pricing and delivery timeline to Hyderabad?";
      } else if (intent === 'question') {
        document.getElementById('optQuestion')?.classList.add('selected');
        if (input) input.value = "What is the wood used in this craft and how long will the natural organic lacquer colors last? Does it require special care?";
      } else if (intent === 'language') {
        document.getElementById('optLanguage')?.classList.add('selected');
        if (input) input.value = "Please tell the artisan I love their generational craft and would like to understand the story behind Lord Balaji carving in Telugu audio.";
      }
      this.sendBuyerChatMessage();
      this.toast(`Selected: ${intent.toUpperCase()} intent`);
    }

    sendBuyerChatMessage() {
      const input = document.getElementById('saathiBuyerInput');
      const text = input ? input.value.trim() : "";
      if (!text) {
        this.toast('⚠️ Please type a message to the artisan');
        return;
      }

      const analysis = this.extractSaathiRequirements(text);
      const teluguTrans = this.translateToTelugu(text, analysis);

      this.lastProcessedMessage = {
        id: 'MSG-' + Date.now(),
        original: text,
        analysis: analysis,
        translation: teluguTrans,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'ready'
      };

      // Update buyer text in chat bubble
      const buyerText = document.getElementById('saathiBuyerDisplayText');
      if (buyerText) buyerText.textContent = text;

      // Update chips
      const chipsWrap = document.querySelector('.saathi-bubble-chips');
      if (chipsWrap) {
        chipsWrap.innerHTML = `
          <span class="saathi-chip">🎨 ${analysis.color}</span>
          <span class="saathi-chip">🏷️ ${analysis.personalization}</span>
          <span class="saathi-chip">📦 ${analysis.quantity}</span>
          <span class="saathi-chip">📅 ${analysis.deliveryDate}</span>
        `;
      }

      // Determine seller response
      let sellerTelugu = "నమస్కారం! అవును, మీ అవసరాల ప్రకారం తయారు చేసి పంపించగలం. ధర ₹347 చొప్పున ఖరారు చేయండి.";
      let sellerEnglish = "Namaste! Yes, we can make it as per your requirements at ₹347 each. Please confirm order.";

      const lower = text.toLowerCase();
      if (lower.includes('blue') || lower.includes('vinay') || lower.includes('20')) {
        sellerTelugu = "నమస్కారం! అవును, నీలం రంగులో 'VINAY' పేరుతో 20 బొమ్మలు డిసెంబర్ 10లోపు చేసి పంపించగలం. ధర ₹347 చొప్పున మొత్తం ₹6,940.";
        sellerEnglish = "Namaste! Yes, we can make 20 blue showpieces with 'VINAY' name before Dec 10 at ₹347 each (Total ₹6,940).";
      } else if (lower.includes('bulk') || lower.includes('50') || lower.includes('wedding')) {
        sellerTelugu = "నమస్కారం! 50 బొమ్మల ఆర్డర్‌కు మేము 15% రాయితీతో ₹295 చొప్పున అందించగలము. 10 రోజుల్లో సురక్షితంగా డెలివరీ చేస్తాము.";
        sellerEnglish = "Namaste! For 50 pieces, we offer a 15% wholesale discount at ₹295 each (Total ₹14,750), delivered safely in 10 days.";
      } else if (lower.includes('wood') || lower.includes('dye') || lower.includes('care') || lower.includes('quality')) {
        sellerTelugu = "ఈ బొమ్మలు శతాబ్దాల సంప్రదాయ తెల్ల పొనికి ఔషధ చెక్క మరియు సహజ కూరగాయల రంగులతో మాత్రమే చేయబడతాయి. ఇవి 100% పర్యావరణ అనుకూలం.";
        sellerEnglish = "These toys are carved from sacred Tella Poniki medicinal wood and colored with 100% non-toxic natural vegetable lacquers.";
      } else if (lower.includes('story') || lower.includes('heritage') || lower.includes('balaji')) {
        sellerTelugu = "కొండపల్లి కళ 400 ఏళ్ల చరిత్ర కలిగినది. మా పూర్వీకులు రాజస్థాన్ నుండి వచ్చి కృష్ణా జిల్లా కొండపల్లిలో స్థిరపడి ఈ దైవిక బొమ్మల కళను సృష్టించారు.";
        sellerEnglish = "Kondapalli craft has 400 years of heritage. Our artisan ancestors migrated to Krishna district to preserve this divine wooden sculpting tradition.";
      }

      const sellerTelEl = document.getElementById('saathiSellerTeluguText');
      const sellerEngEl = document.getElementById('saathiSellerEnglishText');
      if (sellerTelEl) sellerTelEl.textContent = `"${sellerTelugu}"`;
      if (sellerEngEl) sellerEngEl.textContent = `"${sellerEnglish}"`;

      this.artisanMessages = this.artisanMessages || [];
      this.artisanMessages.push({
        type: 'incoming',
        id: this.lastProcessedMessage.id,
        product: 'Kondapalli Wooden Showpiece',
        price: '₹347',
        analysis: analysis,
        telugu: teluguTrans,
        original: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.artisanMessages.push({
        type: 'outgoing',
        text: sellerTelugu,
        english: sellerEnglish,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    toggleSpeechInput() {
      const btn = document.getElementById('saathiVoiceRecordBtn');
      const input = document.getElementById('saathiBuyerInput');
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.lang = 'en-US';
          rec.interimResults = false;
          btn?.classList.add('recording');
          this.toast('🎙️ Listening... Speak your requirements');
          rec.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            if (input) input.value = transcript;
            btn?.classList.remove('recording');
            this.toast(`Recorded: "${transcript.substring(0, 30)}..."`);
          };
          rec.onerror = () => {
            btn?.classList.remove('recording');
            this.toast('🎙️ Voice detected: "Can you make 20 pieces in blue?"');
          };
          rec.onend = () => {
            btn?.classList.remove('recording');
          };
          rec.start();
          return;
        } catch (err) {
          console.warn('SpeechRecognition error:', err);
        }
      }
      
      if (btn) btn.classList.toggle('recording');
      this.toast('🎙️ Voice input recorded: 20 pieces, blue color, name VINAY');
      if (input && !input.value.includes('VINAY')) {
        input.value = "Can you make this toy in blue and add my name VINAY? I need 20 pieces.";
      }
      setTimeout(() => btn?.classList.remove('recording'), 1800);
    }

    processSaathiVoiceBridge() {
      const input = document.getElementById('saathiBuyerInput');
      const rawText = input ? input.value.trim() : "";
      if (!rawText) {
        this.toast('⚠️ Please type or record your message first');
        return;
      }

      const output = document.getElementById('saathiWorkflowOutput');
      if (!output) return;

      // Intermediate loading state
      output.innerHTML = `
        <div class="saathi-workflow-card" style="text-align:center; padding:24px 16px;">
          <div style="font-size:32px; animation:saathiPulse 1s infinite;">🤖</div>
          <div style="font-weight:700; color:#38BDF8; font-size:15px; margin-top:8px;">
            Saathi is understanding your requirements...
          </div>
          <div style="font-size:12px; color:#9CA3AF; margin-top:4px;">
            Extracting parameters & synthesizing Telugu cultural translation
          </div>
        </div>
      `;

      setTimeout(() => {
        const analysis = this.extractSaathiRequirements(rawText);
        const teluguTranslation = this.translateToTelugu(rawText, analysis);

        this.lastProcessedMessage = {
          id: 'MSG-' + Date.now(),
          original: rawText,
          analysis: analysis,
          translation: teluguTranslation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'ready'
        };

        output.innerHTML = `
          <!-- Step 2: Extracted Requirements Card -->
          <div class="saathi-workflow-card">
            <div class="saathi-card-header">
              <span class="saathi-card-title">
                <span>📋</span>
                <span>Extracted Requirements (Saathi AI)</span>
              </span>
              <span class="saathi-badge-pill">✓ Structured</span>
            </div>
            <div class="saathi-req-grid">
              <div class="saathi-req-item">
                <strong>Intent:</strong>
                <span>${analysis.intent}</span>
              </div>
              <div class="saathi-req-item">
                <strong>Target Craft:</strong>
                <span>Kondapalli Wooden Showpiece</span>
              </div>
              <div class="saathi-req-item">
                <strong>Requested Colour:</strong>
                <span>${analysis.color}</span>
              </div>
              <div class="saathi-req-item">
                <strong>Personalization:</strong>
                <span>${analysis.personalization}</span>
              </div>
              <div class="saathi-req-item">
                <strong>Quantity:</strong>
                <span>${analysis.quantity}</span>
              </div>
              <div class="saathi-req-item">
                <strong>Delivery Date:</strong>
                <span>${analysis.deliveryDate}</span>
              </div>
            </div>
          </div>

          <!-- Step 3: Bhasha Telugu Translation Card -->
          <div class="saathi-workflow-card">
            <div class="saathi-card-header">
              <span class="saathi-card-title">
                <span>🔤</span>
                <span>Telugu Translation (Bhasha Agent)</span>
              </span>
              <span class="saathi-badge-pill" style="background:#1E3A8A; color:#93C5FD;">Telugu (తెలుగు)</span>
            </div>
            <div class="saathi-trans-box">
              <div class="saathi-trans-telugu" id="saathiTeluguTranscript">
                "${teluguTranslation}"
              </div>
              <div class="saathi-trans-orig">
                <strong>Original English:</strong> "${rawText}"
              </div>
            </div>
          </div>

          <!-- Step 4: Voice Saathi Audio Preview -->
          <div class="saathi-workflow-card">
            <div class="saathi-card-header">
              <span class="saathi-card-title">
                <span>🎙️</span>
                <span>Artisan Voice Note Preview</span>
              </span>
              <span class="saathi-badge-pill" style="background:#065F46; color:#6EE7B7;">Voice Note • 0:14</span>
            </div>
            <div class="saathi-audio-player" id="saathiAudioPlayerBox">
              <button class="saathi-play-circle-btn" id="saathiAudioPlayBtn" onclick="window.kalaApp.toggleTeluguAudio()">
                ▶
              </button>
              <div class="saathi-audio-info">
                <div class="saathi-wave-bars">
                  <div class="saathi-wave-bar"></div>
                  <div class="saathi-wave-bar"></div>
                  <div class="saathi-wave-bar"></div>
                  <div class="saathi-wave-bar"></div>
                  <div class="saathi-wave-bar"></div>
                  <div class="saathi-wave-bar"></div>
                  <div class="saathi-wave-bar"></div>
                  <div class="saathi-wave-bar"></div>
                </div>
                <div class="saathi-audio-meta">
                  <span id="saathiAudioStatusLabel">Spoken Telugu Audio (తెలుగు వాయిస్)</span>
                  <span id="saathiAudioTimer">0:14</span>
                </div>
              </div>
            </div>
            <div style="font-size:11.5px; color:#9CA3AF; line-height:1.4;">
              💡 <em>This voice note allows the rural artisan to listen directly in their mother tongue without reading English text.</em>
            </div>
          </div>

          <!-- Step 5 & 6: Review & WhatsApp Delivery CTA -->
          <div class="saathi-workflow-card" id="saathiSendSection">
            <div style="font-size:12px; color:#9CA3AF; display:flex; justify-content:space-between; margin-bottom:2px;">
              <span>Destination:</span>
              <strong style="color:#FFFFFF;">Paljji Handicrafts (+91 98480 32190)</strong>
            </div>
            <button class="saathi-send-btn" style="background:#25D366; color:#075E54; font-weight:800; font-size:14px; justify-content:center; padding:13px;" onclick="window.kalaApp.sendDemoWhatsAppMessage()">
              <span>⚡ Approve & Send Demo WhatsApp Message</span>
            </button>
            <div style="font-size:10.5px; color:#9CA3AF; text-align:center; margin-top:2px;">
              🔒 PROTOTYPE SIMULATION — Messages are securely routed to the demo artisan inbox.
            </div>
          </div>
        `;

        const scroll = document.getElementById('saathiScrollBody');
        if (scroll) scroll.scrollTo({ top: 380, behavior: 'smooth' });
      }, 650);
    }

    extractSaathiRequirements(text) {
      const lower = text.toLowerCase();
      let color = "Blue (Custom request)";
      if (lower.includes("yellow")) color = "Yellow";
      else if (lower.includes("green")) color = "Green";
      else if (lower.includes("white")) color = "Natural White";
      else if (lower.includes("black")) color = "Black";
      else if (lower.includes("blue")) color = "Blue (replaces red)";

      let personalization = "VINAY (on base)";
      const nameMatch = text.match(/name\s+([A-Z0-9]+)/i);
      if (nameMatch) personalization = `${nameMatch[1].toUpperCase()} (on base)`;

      let quantity = "20 pieces";
      const qtyMatch = text.match(/(\d+)\s*(pieces|pcs|bommalu|toys|items)?/i);
      if (qtyMatch) quantity = `${qtyMatch[1]} pieces`;

      let deliveryDate = "December 10";
      const dateMatch = text.match(/(before|by)?\s*(december|dec|nov|jan|feb|diwali|sankranti)\s*(\d{1,2})?/i);
      if (dateMatch) deliveryDate = dateMatch[0].trim();

      let intent = "Product Customization & Bulk Order";
      if (this.currentSaathiIntent === 'bulk') intent = "Wholesale Bulk Order";
      else if (this.currentSaathiIntent === 'question') intent = "Craft Materials Enquiry";
      else if (this.currentSaathiIntent === 'language') intent = "Artisan Heritage Story";

      return { intent, color, personalization, quantity, deliveryDate };
    }

    translateToTelugu(text, analysis) {
      if (text.includes("blue") && text.includes("VINAY")) {
        return "ఈ బొమ్మను ఎరుపు రంగుకు బదులుగా నీలం రంగులో తయారు చేయగలరా? బొమ్మ అడుగుభాగంలో VINAY అనే పేరు చేర్చండి. నాకు 20 బొమ్మలు కావాలి. డిసెంబర్ 10వ తేదీకి ముందుగా డెలివరీ చేయగలరా?";
      } else if (this.currentSaathiIntent === 'bulk') {
        return `నమస్కారం! నాకు ${analysis.quantity} కొండపల్లి బొమ్మలు వివాహ వేడుకకు కావాలి. హోల్‌సేల్ ధర మరియు డెలివరీ సమయం తెలియజేయగలరా?`;
      } else if (this.currentSaathiIntent === 'question') {
        return "నమస్కారం! ఈ కొండపల్లి బొమ్మ తయారీలో ఉపయోగించిన తెల్ల పొనికి చెక్క మరియు సహజ రంగుల వివరాలు తెలుపగలరా?";
      }
      return `ఈ కొండపల్లి బొమ్మను ${analysis.color} రంగులో ${analysis.personalization} తో ${analysis.quantity} తయారు చేసి ${analysis.deliveryDate} నాటికి పంపించగలరా? ధన్యవాదాలు.`;
    }

    toggleTeluguAudio() {
      if (this.isPlayingTeluguAudio) {
        this.stopTeluguAudio();
      } else {
        this.playTeluguAudio();
      }
    }

    playTeluguAudio() {
      this.isPlayingTeluguAudio = true;
      const box = document.getElementById('saathiAudioPlayerBox');
      const btn = document.getElementById('saathiAudioPlayBtn');
      const status = document.getElementById('saathiAudioStatusLabel');
      if (box) box.classList.add('playing');
      if (btn) btn.textContent = '⏸';
      if (status) status.textContent = '🔊 Playing Spoken Telugu Voice...';

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = this.lastProcessedMessage?.translation || "ఈ బొమ్మను ఎరుపు రంగుకు బదులుగా నీలం రంగులో తయారు చేయగలరా?";
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        utter.rate = 0.88;
        utter.pitch = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const teluguVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('ta') || v.lang.includes('hi') || v.lang.includes('en-IN'));
        if (teluguVoice) utter.voice = teluguVoice;

        utter.onend = () => this.stopTeluguAudio();
        utter.onerror = () => this.playSynthesizedFallbackAudio();
        window.speechSynthesis.speak(utter);
      } else {
        this.playSynthesizedFallbackAudio();
      }

      this.audioTimeout = setTimeout(() => {
        this.stopTeluguAudio();
      }, 14000);
    }

    playSynthesizedFallbackAudio() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } catch (e) {
        console.warn('Audio fallback error:', e);
      }
    }

    stopTeluguAudio() {
      this.isPlayingTeluguAudio = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearTimeout(this.audioTimeout);
      const box = document.getElementById('saathiAudioPlayerBox');
      const btn = document.getElementById('saathiAudioPlayBtn');
      const status = document.getElementById('saathiAudioStatusLabel');
      if (box) box.classList.remove('playing');
      if (btn) btn.textContent = '▶';
      if (status) status.textContent = 'Spoken Telugu Audio (తెలుగు వాయిస్)';
    }

    sendDemoWhatsAppMessage() {
      const sendSection = document.getElementById('saathiSendSection');
      if (!sendSection || !this.lastProcessedMessage) return;

      sendSection.innerHTML = `
        <div style="background:#0F172A; border:1px solid #007A87; border-radius:12px; padding:16px;">
          <div style="font-weight:700; color:#38BDF8; margin-bottom:10px; font-size:13px;">
            🚀 WhatsApp Delivery in Progress:
          </div>
          <div id="saathiStep1" style="font-size:12px; color:#A7F3D0; margin-bottom:6px;">
            ⏳ 1. Structuring order requirements...
          </div>
          <div id="saathiStep2" style="font-size:12px; color:#6B7280; margin-bottom:6px;">
            ⏳ 2. Packaging Telugu voice note attachment...
          </div>
          <div id="saathiStep3" style="font-size:12px; color:#6B7280; margin-bottom:6px;">
            ⏳ 3. Transmitting to +91 98480 32190 (Paljji Handicrafts)...
          </div>
          <div id="saathiStep4" style="font-size:12px; color:#6B7280;">
            ⏳ 4. Awaiting delivery receipt...
          </div>
        </div>
      `;

      setTimeout(() => {
        const s1 = document.getElementById('saathiStep1');
        const s2 = document.getElementById('saathiStep2');
        if (s1) s1.innerHTML = '✅ 1. Order parameters structured';
        if (s2) s2.style.color = '#A7F3D0';
      }, 500);

      setTimeout(() => {
        const s2 = document.getElementById('saathiStep2');
        const s3 = document.getElementById('saathiStep3');
        if (s2) s2.innerHTML = '✅ 2. Telugu voice note attached (0:14)';
        if (s3) s3.style.color = '#A7F3D0';
      }, 1000);

      setTimeout(() => {
        const s3 = document.getElementById('saathiStep3');
        const s4 = document.getElementById('saathiStep4');
        if (s3) s3.innerHTML = '✅ 3. Routing via Kalavirasat ONDC Gateway';
        if (s4) s4.style.color = '#A7F3D0';
      }, 1500);

      setTimeout(() => {
        this.artisanMessages = this.artisanMessages || [];
        this.artisanMessages.push({
          type: 'incoming',
          id: this.lastProcessedMessage.id,
          product: 'Kondapalli Wooden Showpiece',
          price: '₹347',
          analysis: this.lastProcessedMessage.analysis,
          telugu: this.lastProcessedMessage.translation,
          original: this.lastProcessedMessage.original,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        const defaultSellerTelugu = "నమస్కారం! అవును, నీలం రంగులో 'VINAY' పేరుతో 20 బొమ్మలు డిసెంబర్ 10లోపు చేసి పంపించగలం. ధర ₹347 చొప్పున మొత్తం ₹6,940.";
        const defaultSellerEnglish = "Namaste! Yes, we can make 20 blue showpieces with 'VINAY' name before Dec 10 at ₹347 each (Total ₹6,940).";

        sendSection.innerHTML = `
          <!-- 1. Delivery Confirmation to Artisan -->
          <div class="saathi-delivery-card">
            <div class="saathi-delivery-title">
              <span>✅</span>
              <span>Delivered to Artisan's WhatsApp (+91 98480 32190)</span>
            </div>
            <div class="saathi-delivery-sub">
              <strong>Artisan:</strong> Lakshmi Devi (Paljji Handicrafts) • Kondapalli Cluster<br>
              <strong>Status:</strong> Audio Voice Note & Requirements Delivered • Double Blue Ticks
            </div>
          </div>

          <!-- 2. Seller's Sent Message Visible in Chat Screen Under Buyer's Message -->
          <div class="saathi-seller-reply-card" id="saathiChatSellerResponse">
            <div class="saathi-seller-header">
              <div class="saathi-seller-avatar-wrap">
                <img src="assets/kondapalli_balaji_product.png" class="saathi-seller-avatar" alt="Lakshmi Devi" />
                <span class="saathi-online-indicator"></span>
              </div>
              <div class="saathi-seller-info">
                <div class="saathi-seller-name">
                  Lakshmi Devi (Paljji Handicrafts)
                  <span class="saathi-seller-badge">Seller / Master Artisan</span>
                </div>
                <div class="saathi-seller-status">Kondapalli, Krishna Dist • Verified GI Artisan</div>
              </div>
              <div class="saathi-reply-time">Just now</div>
            </div>

            <!-- Seller's Telugu Message -->
            <div class="saathi-seller-telugu-bubble">
              <div class="saathi-seller-telugu-text" id="saathiSellerTeluguText">
                "${defaultSellerTelugu}"
              </div>
              <!-- Spoken Audio for Seller's Voice Reply -->
              <div class="saathi-seller-audio-bar">
                <button class="saathi-seller-play-btn" id="saathiSellerPlayBtn" onclick="window.kalaApp.playSellerAudio(this)">
                  ▶
                </button>
                <div class="saathi-seller-audio-details">
                  <span style="font-weight:700;">Artisan Telugu Audio Voice Note</span>
                  <span>0:12</span>
                </div>
              </div>
            </div>

            <!-- Seller's Message Translated to English for Buyer -->
            <div class="saathi-seller-english-translation">
              <div class="saathi-trans-label">Translated to English:</div>
              <div class="saathi-trans-content" id="saathiSellerEnglishText">
                "${defaultSellerEnglish}"
              </div>
            </div>

            <!-- Direct Buyer Action Buttons -->
            <div class="saathi-seller-actions">
              <button class="saathi-checkout-btn" onclick="window.kalaApp.acceptCustomOffer()">
                ⚡ Accept & Order Custom Pieces (₹6,940)
              </button>
              <button class="saathi-open-wa-btn" onclick="window.kalaApp.openArtisanWhatsApp()">
                📱 WhatsApp View
              </button>
            </div>
          </div>
        `;

        const scroll = document.getElementById('saathiScrollBody');
        if (scroll) scroll.scrollTo({ top: scroll.scrollHeight, behavior: 'smooth' });

        this.toast('🎉 Seller reply received & translated in chat!');
      }, 2000);
    }

    playSellerAudio(btn) {
      if (btn.textContent.trim() === '▶') {
        btn.textContent = '⏸';
        const text = "నమస్కారం! అవును, నీలం రంగులో వినయ్ పేరుతో ఇరవై బొమ్మలు డిసెంబర్ పది లోపు చేసి పంపించగలం. ధర మూడు వందల నలభై ఏడు రూపాయల చొప్పున మొత్తం ఆరు వేల తొమ్మిది వందల నలభై రూపాయలు.";
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(text);
          utter.rate = 0.88;
          utter.pitch = 1.05;
          const voices = window.speechSynthesis.getVoices();
          const telVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('hi') || v.lang.includes('en-IN'));
          if (telVoice) utter.voice = telVoice;
          utter.onend = () => { btn.textContent = '▶'; };
          utter.onerror = () => { btn.textContent = '▶'; };
          window.speechSynthesis.speak(utter);
        } else {
          this.playSynthesizedFallbackAudio();
          setTimeout(() => { btn.textContent = '▶'; }, 3000);
        }
      } else {
        btn.textContent = '▶';
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }
    }

    acceptCustomOffer() {
      this.addToCart('KAL-084');
      this.closeSaathiModal();
      this.toast('🎉 Custom Order Accepted! Direct Artisan invoice generated on ONDC.');
      setTimeout(() => this.openCartSheet(), 400);
    }

    openArtisanWhatsApp() {
      const modal = document.getElementById('artisanWhatsAppModal');
      const stream = document.getElementById('waMessagesStream');
      if (!modal || !stream) return;

      this.artisanMessages = this.artisanMessages || [];
      const last = this.artisanMessages[this.artisanMessages.length - 1] || {
        product: 'Kondapalli Wooden Showpiece',
        price: '₹347',
        analysis: { color: 'Blue (Custom)', personalization: 'VINAY (on base)', quantity: '20 pieces', deliveryDate: 'Dec 10' },
        telugu: 'ఈ బొమ్మను ఎరుపు రంగుకు బదులుగా నీలం రంగులో తయారు చేయగలరా? బొమ్మ అడుగుభాగంలో VINAY అనే పేరు చేర్చండి. నాకు 20 బొమ్మలు కావాలి. డిసెంబర్ 10వ తేదీకి ముందుగా డెలివరీ చేయగలరా?',
        original: 'Can you make this toy in blue and add my name VINAY? I need 20 pieces.',
        time: '9:42 PM'
      };

      let html = `
        <!-- Incoming Buyer Message via Saathi Voice Bridge -->
        <div class="wa-bubble-incoming">
          <div style="font-size:10.5px; font-weight:700; color:#0284C7; margin-bottom:2px;">Incoming Order • Vinay (Buyer)</div>
          <div class="wa-bubble-product">
            <img src="assets/kondapalli_balaji_product.png" alt="Product" />
            <div>
              <div class="wa-bubble-prod-title">${last.product}</div>
              <div class="wa-bubble-prod-price">${last.price} • GI Tagged</div>
            </div>
          </div>

          <div class="wa-bubble-pill-tags">
            <span class="wa-pill-tag">🎨 ${last.analysis.color}</span>
            <span class="wa-pill-tag">🏷️ ${last.analysis.personalization}</span>
            <span class="wa-pill-tag">📦 ${last.analysis.quantity}</span>
            <span class="wa-pill-tag">📅 ${last.analysis.deliveryDate}</span>
          </div>

          <div class="wa-bubble-telugu-text">
            ${last.telugu}
          </div>

          <!-- WhatsApp Voice Note Bar -->
          <div class="wa-voice-widget">
            <button class="wa-vn-play-btn" onclick="window.kalaApp.playWhatsAppVoiceNote(this)">
              ▶
            </button>
            <div class="wa-vn-progress-bar">
              <div class="wa-vn-progress-fill"></div>
            </div>
            <div class="wa-vn-time">0:14</div>
          </div>

          <details style="font-size:11px; color:#6B7280; cursor:pointer;">
            <summary>Original Buyer Message (English)</summary>
            <div style="background:#F9FAFB; padding:6px; border-radius:6px; margin-top:4px;">
              "${last.original}"
            </div>
          </details>

          <div class="wa-bubble-meta">
            <span>${last.time}</span>
            <span class="wa-double-check">✓✓</span>
          </div>
        </div>
      `;

      if (!this.artisanReplies || this.artisanReplies.length === 0) {
        this.artisanReplies = [
          {
            telugu: "నమస్కారం! అవును, నీలం రంగులో 'VINAY' పేరుతో 20 బొమ్మలు డిసెంబర్ 10లోపు చేసి పంపించగలం. ధర ₹347 చొప్పున మొత్తం ₹6,940.",
            english: "Namaste! Yes, we can make 20 blue showpieces with 'VINAY' name before Dec 10 at ₹347 each (Total ₹6,940).",
            time: '9:43 PM'
          }
        ];
      }

      this.artisanReplies.forEach(rep => {
        html += `
          <!-- Outgoing Seller/Artisan Message -->
          <div class="wa-bubble-outgoing">
            <div style="font-size:10.5px; font-weight:700; color:#075E54; margin-bottom:2px;">You (Lakshmi Devi - Artisan)</div>
            <div class="wa-bubble-out-text">${rep.telugu}</div>
            
            <div class="wa-voice-widget" style="background:#E2F7CB; margin:4px 0;">
              <button class="wa-vn-play-btn" onclick="window.kalaApp.playWhatsAppVoiceNote(this)">
                ▶
              </button>
              <div class="wa-vn-progress-bar">
                <div class="wa-vn-progress-fill"></div>
              </div>
              <div class="wa-vn-time">0:12</div>
            </div>

            <div class="wa-bubble-out-trans">
              <strong>English Translation:</strong> "${rep.english}"
            </div>
            <div class="wa-bubble-meta" style="color:#65676B;">
              <span>${rep.time}</span>
              <span class="wa-double-check">✓✓</span>
            </div>
          </div>
        `;
      });

      stream.innerHTML = html;
      modal.style.display = 'flex';
      modal.classList.add('active');

      const chatBody = document.getElementById('waChatBody');
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    }

    closeArtisanWhatsApp() {
      const modal = document.getElementById('artisanWhatsAppModal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
      this.stopTeluguAudio();
    }

    playWhatsAppVoiceNote(btn) {
      if (btn.textContent.trim() === '▶') {
        btn.textContent = '⏸';
        this.playTeluguAudio();
        const fill = btn.parentElement.querySelector('.wa-vn-progress-fill');
        if (fill) {
          fill.style.width = '100%';
          fill.style.transition = 'width 14s linear';
        }
        setTimeout(() => {
          btn.textContent = '▶';
          if (fill) {
            fill.style.width = '0%';
            fill.style.transition = 'none';
          }
        }, 14000);
      } else {
        btn.textContent = '▶';
        this.stopTeluguAudio();
        const fill = btn.parentElement.querySelector('.wa-vn-progress-fill');
        if (fill) {
          fill.style.width = '0%';
          fill.style.transition = 'none';
        }
      }
    }

    sendArtisanReply(teluguText) {
      this.artisanReplies = this.artisanReplies || [];
      let english = "Namaste! Yes, we can make 20 blue showpieces with 'VINAY' name before Dec 10 at ₹347 each (Total ₹6,940).";
      if (teluguText.includes("ఖరారు")) {
        english = "Yes, we are ready to craft. Please confirm your order.";
      } else if (teluguText.includes("7 రోజుల్లో")) {
        english = "Crafted with sacred Tella Poniki natural wood. Delivery within 7 days.";
      }

      this.artisanReplies.push({
        telugu: teluguText,
        english: english,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      this.openArtisanWhatsApp();
      this.toast('💬 Artisan reply sent & translated back to Buyer!');
    }

    sendCustomArtisanReply() {
      const input = document.getElementById('waCustomReplyInput');
      const text = input ? input.value.trim() : "";
      if (!text) return;
      this.sendArtisanReply(text);
      if (input) input.value = "";
    }

    toggleDeliveryAccordion() {
      const content = document.getElementById('fkDeliveryContent');
      const chevron = document.getElementById('fkDeliveryChevron');
      if (!content) return;
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
      if (chevron) {
        chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    }

    toggleFkWishlist() {
      const heart = document.getElementById('fkWishlistHeart');
      if (!heart) return;
      const isWish = heart.textContent === '❤️';
      heart.textContent = isWish ? '🤍' : '❤️';
      this.toast(isWish ? 'Removed from Wishlist' : '❤️ Added to Wishlist');
    }

    addToCartFk() {
      this.addToCart('KAL-084');
      this.toast('🛒 Added to Cart (PALJJI HANDICRAFTS - ₹347)');
    }

    buyNowFk() {
      this.addToCart('KAL-084');
      this.openCartSheet();
    }

    shareProduct() {
      this.toast('🔗 Product link copied to clipboard!');
    }

    writeReview() {
      this.toast('⭐ Thank you! Your review has been submitted.');
    }

    changePincode() {
      this.toast('📍 Delivering to Eluru - 534001');
    }

    upvoteReview(btn) {
      if (btn.dataset.voted) return;
      btn.dataset.voted = "true";
      const parts = btn.textContent.split(' ');
      const count = parseInt(parts[1] || '0', 10) + 1;
      btn.textContent = `👍 ${count}`;
      btn.style.color = '#2874F0';
      btn.style.fontWeight = 'bold';
      this.toast('👍 Marked as helpful');
    }

    showProductStory(id) {
      const item = TRENDING_PRODUCTS.find(p => p.id === id);
      if (!item) return;

      const artisanShare = Math.round(item.price * 0.68);
      const content = document.getElementById('productSheetContent');
      const modal = document.getElementById('productModal');

      content.innerHTML = `
        <div class="sheet-handle-pill"></div>
        <div style="display:flex; gap:12px; margin-bottom:12px;">
          <img src="${item.image}" style="width:110px; height:110px; border-radius:12px; object-fit:cover;" />
          <div>
            <span style="background:#DCFCE7; color:#166534; font-size:10px; font-weight:800; padding:2px 8px; border-radius:99px;">
              🛡️ Faithfulness ${item.score}% PASS
            </span>
            <h2 style="font-family:var(--font-serif); font-size:19px; margin:4px 0;">${item.title}</h2>
            <div style="font-size:12px; color:var(--ink-secondary);">
              📍 ${item.artisan} • ${item.cluster}
            </div>
            <div style="font-size:17px; font-weight:800; color:var(--primary-red); margin-top:4px;">
              ₹${item.price.toLocaleString('en-IN')} <span style="font-size:12px; color:#A89B92; text-decoration:line-through;">₹${item.market_avg}</span>
            </div>
          </div>
        </div>

        <div style="font-size:14px; color:#8C2F19; background:#FFF5EA; padding:8px 10px; border-left:3px solid #8C2F19; border-radius:4px; margin-bottom:12px;">
          "${item.quote}"
        </div>

        <div style="font-size:12px; line-height:1.5; color:var(--ink-primary); margin-bottom:14px;">
          ${item.story}
        </div>

        <div style="background:#FBF6EE; border:1px solid #EBE2D4; border-radius:10px; padding:10px; margin-bottom:14px; font-size:11.5px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>🌱 <strong>Artisan Receives Directly (68%):</strong></span>
            <span style="color:#5B842F; font-weight:800;">₹${artisanShare}</span>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--ink-secondary);">
            <span>Traditional Middleman Cut:</span>
            <span>68% Eliminated</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <button class="add-cart-red-btn" style="padding:12px; font-size:13px;" onclick="window.kalaApp.addToCart('${item.id}'); window.kalaApp.openCartSheet();">
            🛒 Buy via ONDC
          </button>
          <button style="background:#FFF3E8; border:1.5px solid var(--primary-red); color:var(--primary-red); border-radius:6px; font-weight:700; font-size:12px; cursor:pointer;" onclick="window.kalaApp.toast('Bulk order WhatsApp query sent to ${item.artisan}!')">
            💬 Bulk Order
          </button>
        </div>
      `;

      modal.classList.add('active');
    }

    openCartSheet() {
      this.closeModals();
      const modal = document.getElementById('cartModal');
      const content = document.getElementById('cartSheetContent');

      if (this.cart.length === 0) {
        content.innerHTML = `
          <div class="sheet-handle-pill"></div>
          <div style="text-align:center; padding:30px 10px;">
            <div style="font-size:36px; margin-bottom:8px;">🛍️</div>
            <h3 style="font-family:var(--font-serif); font-size:18px;">Your Cart is Empty</h3>
            <p style="font-size:12px; color:var(--ink-secondary); margin-bottom:16px;">
              Explore handmade treasures and empower rural artisans.
            </p>
            <button class="add-cart-red-btn" onclick="window.kalaApp.closeModals()">
              Explore Crafts
            </button>
          </div>
        `;
      } else {
        let total = 0;
        let artisanCut = 0;
        const items = this.cart.map(c => {
          const line = c.item.price * c.quantity;
          const art = Math.round(line * 0.68);
          total += line;
          artisanCut += art;
          return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #EBE2D4;">
              <div style="display:flex; gap:10px; align-items:center;">
                <img src="${c.item.image}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;" />
                <div>
                  <div style="font-size:12.5px; font-weight:700;">${c.item.title}</div>
                  <div style="font-size:11px; color:#5B842F; font-weight:700;">Artisan: ₹${art} (68%)</div>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:13px; font-weight:800;">₹${line}</div>
                <button onclick="window.kalaApp.removeFromCart('${c.id}')" style="background:none; border:none; color:#EF4444; font-size:11px; cursor:pointer;">
                  Remove
                </button>
              </div>
            </div>
          `;
        }).join('');

        content.innerHTML = `
          <div class="sheet-handle-pill"></div>
          <h3 style="font-family:var(--font-serif); font-size:18px; margin-bottom:10px;">Shopping Cart</h3>
          <div>${items}</div>
          <div style="margin:14px 0; font-size:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Total:</span>
              <strong>₹${total}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; color:#5B842F; font-weight:700;">
              <span>Direct to Artisan Accounts (68%):</span>
              <span>₹${artisanCut}</span>
            </div>
          </div>
          <button class="add-cart-red-btn" style="padding:12px; font-size:13px;" onclick="window.kalaApp.pay()">
            ⚡ Pay ₹${total} via UPI / ONDC
          </button>
        `;
      }
      modal.classList.add('active');
    }

    removeFromCart(id) {
      this.cart = this.cart.filter(x => x.id !== id);
      localStorage.setItem('kalavirasat_cart', JSON.stringify(this.cart));
      this.updateCartBadge();
      this.openCartSheet();
    }

    pay() {
      this.cart = [];
      localStorage.setItem('kalavirasat_cart', JSON.stringify([]));
      this.updateCartBadge();
      this.closeModals();
      this.toast('🎉 Payment Confirmed! Order dispatched on ONDC.');
    }

    handleNavTab(name) {
      document.querySelectorAll('.bottom-nav-link').forEach(b => b.classList.remove('active'));
      if (window.event?.currentTarget) {
        window.event.currentTarget.classList.add('active');
      }
      if (name === 'home') {
        this.filterByCategory('all');
      } else if (name === 'explore') {
        this.scrollToTrending();
      } else if (name === 'sell') {
        this.toast('🏪 Artisan Onboarding Portal (Saathi AI)');
      } else if (name === 'orders') {
        this.toast('📋 Order #KAL-084: Direct with Artisan');
      } else if (name === 'account') {
        this.toast('👤 Account: Deliver to Eluru, AP');
      }
    }

    setupEventListeners() {
      const search = document.getElementById('searchInput');
      if (search) {
        search.addEventListener('input', (e) => {
          this.renderTrending(e.target.value.toLowerCase().trim());
        });
      }

      const cartBtn = document.getElementById('cartHeaderBtn');
      if (cartBtn) cartBtn.addEventListener('click', () => this.openCartSheet());

      const mic = document.getElementById('micBtn');
      if (mic) mic.addEventListener('click', () => this.toast('🎙️ Voice Search active...'));

      const qr = document.getElementById('scannerBtn');
      if (qr) qr.addEventListener('click', () => this.toast('🔲 QR Craft Passport Scanner ready'));

      const notif = document.getElementById('notifBtn');
      if (notif) notif.addEventListener('click', () => this.toast('🔔 New artisan crafts listed'));

      const lang = document.getElementById('langBtn');
      if (lang) lang.addEventListener('click', () => this.toast('🌐 Language: తెలుగు (Telugu)'));

      const loc = document.getElementById('locBtn');
      if (loc) loc.addEventListener('click', () => this.toast('📍 Delivery to Eluru, Andhra Pradesh'));

      document.querySelectorAll('.modal-backdrop').forEach(m => {
        m.addEventListener('click', (e) => {
          if (e.target === m) this.closeModals();
        });
      });
    }

    closeModals() {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    }

    toast(msg) {
      const el = document.getElementById('toastAlert');
      if (!el) return;
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 2600);
    }
  }

  // Reliable initialization in WebView and browser
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      window.kalaApp = new KalavirasatManager();
    });
  } else {
    window.kalaApp = new KalavirasatManager();
  }
})();
