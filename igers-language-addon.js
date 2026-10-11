/* IGERS-BD-01 additive locale extension for the existing 8-language i18n.js runtime.
 * Adds Japanese, Urdu and Vietnamese without replacing old dictionary entries.
 * Load this file AFTER i18n.js. Curated exact-string UI only; dynamic/provider data is untouched.
 */
(() => {
  'use strict';
  const VERSION = '20261010-ja-ur-vi-3';
  const STORAGE_KEY = 'igers-language-addon-v1';
  const LANGS = {"ja":{"label":"日本語","name":"Japanese","dir":"ltr"},"ur":{"label":"اردو","name":"Urdu","dir":"rtl"},"vi":{"label":"Tiếng Việt","name":"Vietnamese","dir":"ltr"}};
  const DICT = {"INTEGRATED ENERGY RECOVERY & STORAGE":{"ja":"統合型エネルギー回収・蓄電システム","ur":"مربوط توانائی بازیافت اور ذخیرہ کرنے کا نظام","vi":"Hệ thống thu hồi và lưu trữ năng lượng tích hợp"},"Concept":{"ja":"コンセプト","ur":"تصور","vi":"Khái niệm"},"Energy":{"ja":"エネルギー","ur":"توانائی","vi":"Năng lượng"},"Journey":{"ja":"プロセス","ur":"مراحل","vi":"Quy trình"},"Environment":{"ja":"環境","ur":"ماحول","vi":"Môi trường"},"Applications":{"ja":"用途","ur":"استعمالات","vi":"Ứng dụng"},"Sentinel Grid":{"ja":"センチネル・グリッド","ur":"سینٹینل گرڈ","vi":"Lưới Sentinel"},"Deployment":{"ja":"導入計画","ur":"تعیناتی","vi":"Triển khai"},"Live Time":{"ja":"現在時刻","ur":"موجودہ وقت","vi":"Thời gian thực"},"Air Traffic":{"ja":"航空機追跡","ur":"فضائی ٹریفک","vi":"Theo dõi hàng không"},"Airspace Safety":{"ja":"空域の安全","ur":"فضائی حدود کی حفاظت","vi":"An toàn vùng trời"},"Satellite":{"ja":"衛星","ur":"سیٹلائٹ","vi":"Vệ tinh"},"BD Monitor":{"ja":"バングラデシュ監視","ur":"بنگلہ دیش مانیٹر","vi":"Giám sát Bangladesh"},"NASA Data":{"ja":"NASAデータ","ur":"NASA ڈیٹا","vi":"Dữ liệu NASA"},"Weather":{"ja":"気象","ur":"موسم","vi":"Thời tiết"},"Comments / Care":{"ja":"ご意見・サポート","ur":"تبصرے / مدد","vi":"Góp ý / Hỗ trợ"},"Inventor":{"ja":"発明者","ur":"موجد","vi":"Nhà sáng chế"},"Command Center":{"ja":"コマンドセンター","ur":"کنٹرول سینٹر","vi":"Trung tâm điều hành"},"Engineering Lab":{"ja":"エンジニアリング研究室","ur":"انجینئرنگ لیب","vi":"Phòng thí nghiệm kỹ thuật"},"Magazine":{"ja":"技術誌","ur":"تکنیکی رسالہ","vi":"Tạp chí kỹ thuật"},"Analytics":{"ja":"分析","ur":"تجزیات","vi":"Phân tích"},"Admin Control":{"ja":"管理者コントロール","ur":"ایڈمن کنٹرول","vi":"Điều khiển quản trị"},"Advanced Operations":{"ja":"高度な運用","ur":"اعلیٰ آپریشنز","vi":"Vận hành nâng cao"},"Tower Control":{"ja":"タワー制御","ur":"ٹاور کنٹرول","vi":"Điều khiển trạm tháp"},"3D Engineering":{"ja":"3Dエンジニアリング","ur":"3D انجینئرنگ","vi":"Kỹ thuật 3D"},"INSTALL APP":{"ja":"アプリをインストール","ur":"ایپ انسٹال کریں","vi":"Cài đặt ứng dụng"},"FORCE UPDATE":{"ja":"更新を強制","ur":"اپ ڈیٹ لازمی کریں","vi":"Buộc cập nhật"},"DOWNLOAD APP":{"ja":"アプリをダウンロード","ur":"ایپ ڈاؤن لوڈ کریں","vi":"Tải ứng dụng"},"DOWNLOAD APP PACKAGE":{"ja":"アプリパッケージをダウンロード","ur":"ایپ پیکیج ڈاؤن لوڈ کریں","vi":"Tải gói ứng dụng"},"Explore IGERS":{"ja":"IGERSを探る","ur":"IGERS کا جائزہ لیں","vi":"Khám phá IGERS"},"How it works":{"ja":"仕組みを見る","ur":"یہ کیسے کام کرتا ہے","vi":"Cách hệ thống hoạt động"},"Open live time":{"ja":"リアルタイム時刻を開く","ur":"براہِ راست وقت کھولیں","vi":"Mở thời gian thực"},"Energy is moving everywhere. IGERS asks what can be recovered.":{"ja":"エネルギーはあらゆる場所で動いています。IGERSは、そこから何を回収できるかを探ります。","ur":"توانائی ہر جگہ حرکت میں ہے۔ IGERS یہ جانچتا ہے کہ اس میں سے کیا بازیافت کیا جا سکتا ہے۔","vi":"Năng lượng đang chuyển động khắp nơi. IGERS tìm cách thu hồi phần năng lượng có thể khai thác."},"A distributed recovery framework.":{"ja":"分散型エネルギー回収フレームワーク。","ur":"ایک تقسیم شدہ توانائی بازیافت فریم ورک۔","vi":"Một khuôn khổ thu hồi năng lượng phân tán."},"Look where energy is already moving":{"ja":"エネルギーがすでに動いている場所に注目","ur":"ان مقامات پر توجہ دیں جہاں توانائی پہلے سے حرکت میں ہے","vi":"Tìm những nơi năng lượng vốn đang chuyển động"},"Recover → convert → store → use":{"ja":"回収 → 変換 → 貯蔵 → 利用","ur":"بازیافت → تبدیلی → ذخیرہ → استعمال","vi":"Thu hồi → chuyển đổi → lưu trữ → sử dụng"},"Engineering decides what is practical":{"ja":"実用性は工学的評価で判断","ur":"عملی امکان کا فیصلہ انجینئرنگ جانچ سے ہوگا","vi":"Đánh giá kỹ thuật quyết định tính khả thi"},"Where can energy come from?":{"ja":"エネルギーはどこから得られるか","ur":"توانائی کہاں سے حاصل ہو سکتی ہے؟","vi":"Có thể thu năng lượng từ đâu?"},"Vehicle movement":{"ja":"車両の運動","ur":"گاڑیوں کی حرکت","vi":"Chuyển động của phương tiện"},"Braking / deceleration":{"ja":"制動・減速","ur":"بریک لگانا / رفتار کم کرنا","vi":"Phanh / giảm tốc"},"Elevation change":{"ja":"高さの変化","ur":"بلندی میں تبدیلی","vi":"Thay đổi độ cao"},"Controlled water flow":{"ja":"制御された水流","ur":"کنٹرول شدہ پانی کا بہاؤ","vi":"Dòng nước được kiểm soát"},"Vibration":{"ja":"振動","ur":"ارتعاش","vi":"Rung động"},"Footstep / human movement":{"ja":"足踏み・人の動き","ur":"قدموں / انسانی حرکت","vi":"Bước chân / chuyển động của con người"},"Airflow":{"ja":"気流","ur":"ہوا کا بہاؤ","vi":"Luồng không khí"},"Solar support":{"ja":"太陽光による補助","ur":"شمسی توانائی سے معاونت","vi":"Hỗ trợ bằng năng lượng mặt trời"},"Infrastructure interaction":{"ja":"インフラとの相互作用","ur":"بنیادی ڈھانچے کے ساتھ تعامل","vi":"Tương tác với hạ tầng"},"The IGERS energy journey":{"ja":"IGERSのエネルギー・プロセス","ur":"IGERS توانائی کا عمل","vi":"Quy trình năng lượng IGERS"},"Control & monitoring":{"ja":"制御・監視","ur":"کنٹرول اور نگرانی","vi":"Điều khiển và giám sát"},"Suitable local loads":{"ja":"適切な地域内負荷","ur":"موزوں مقامی برقی بوجھ","vi":"Tải tiêu thụ tại chỗ phù hợp"},"Infrastructure becomes an energy canvas.":{"ja":"インフラをエネルギー回収の基盤に。","ur":"بنیادی ڈھانچا توانائی کے حصول کا ذریعہ بن سکتا ہے۔","vi":"Hạ tầng trở thành nền tảng thu hồi năng lượng."},"IGERS + Roads":{"ja":"IGERS＋道路","ur":"IGERS + سڑکیں","vi":"IGERS + Đường bộ"},"IGERS + Bridges / Flyovers":{"ja":"IGERS＋橋梁・高架道路","ur":"IGERS + پل / فلائی اوور","vi":"IGERS + Cầu / cầu vượt"},"Water & hydraulic recovery":{"ja":"水力・水流エネルギー回収","ur":"پانی اور ہائیڈرولک توانائی کی بازیافت","vi":"Thu hồi năng lượng nước và thủy lực"},"Hybrid nodes":{"ja":"ハイブリッドノード","ur":"ہائبرڈ نوڈز","vi":"Nút lai ghép"},"Recovery technologies":{"ja":"回収技術","ur":"بازیافت کی ٹیکنالوجیز","vi":"Công nghệ thu hồi"},"Energy + sensing + resilience.":{"ja":"エネルギー＋センシング＋レジリエンス。","ur":"توانائی + سینسنگ + مضبوطی۔","vi":"Năng lượng + cảm biến + khả năng chống chịu."},"Distributed nodes":{"ja":"分散配置ノード","ur":"تقسیم شدہ نوڈز","vi":"Các nút phân tán"},"NOC visibility":{"ja":"NOCによる可視化","ur":"NOC میں نگرانی","vi":"Khả năng quan sát tại NOC"},"Public information layer":{"ja":"一般向け情報レイヤー","ur":"عوامی معلومات کی تہہ","vi":"Lớp thông tin công cộng"},"Conceptual deployment zones.":{"ja":"導入を想定する区域。","ur":"مجوزہ تعیناتی کے علاقے۔","vi":"Các khu vực triển khai đề xuất."},"Nationwide":{"ja":"全国","ur":"ملک بھر میں","vi":"Toàn quốc"},"Radar-style monitoring, humidity, airflow and earthquake alerts.":{"ja":"レーダー風モニタリング、湿度、気流、地震アラート。","ur":"ریڈار طرز نگرانی، نمی، ہوا کے بہاؤ اور زلزلے کے انتباہات۔","vi":"Giám sát kiểu radar, độ ẩm, luồng khí và cảnh báo động đất."},"Enable alerts":{"ja":"アラートを有効にする","ur":"انتباہات فعال کریں","vi":"Bật cảnh báo"},"Test":{"ja":"テスト","ur":"آزمائیں","vi":"Kiểm tra"},"Aircraft movement, updated from ADS-B data.":{"ja":"ADS-Bデータに基づく航空機の動き。","ur":"ADS-B ڈیٹا سے تازہ کردہ طیاروں کی نقل و حرکت۔","vi":"Chuyển động máy bay được cập nhật từ dữ liệu ADS-B."},"No aircraft selected":{"ja":"航空機が選択されていません","ur":"کوئی طیارہ منتخب نہیں","vi":"Chưa chọn máy bay"},"Live-data note":{"ja":"ライブデータに関する注意","ur":"براہِ راست ڈیٹا سے متعلق نوٹ","vi":"Lưu ý về dữ liệu trực tiếp"},"Bangabandhu-1 orbital connection monitor":{"ja":"バンガバンドゥ衛星1号の軌道接続モニター","ur":"بنگابندھو-1 مداری رابطہ مانیٹر","vi":"Giám sát kết nối quỹ đạo Bangabandhu-1"},"Public orbital-data connection":{"ja":"公開軌道データ接続","ur":"عوامی مداری ڈیٹا کنکشن","vi":"Kết nối dữ liệu quỹ đạo công khai"},"Refresh data":{"ja":"データを更新","ur":"ڈیٹا تازہ کریں","vi":"Làm mới dữ liệu"},"Open live orbital tracker":{"ja":"軌道トラッカーを開く","ur":"براہِ راست مداری ٹریکر کھولیں","vi":"Mở công cụ theo dõi quỹ đạo trực tiếp"},"Bangladesh Airspace Anomaly Monitor":{"ja":"バングラデシュ空域異常モニター","ur":"بنگلہ دیش فضائی حدود کی غیر معمولی سرگرمی کا مانیٹر","vi":"Giám sát bất thường vùng trời Bangladesh"},"No current airspace anomaly":{"ja":"現在、空域の異常はありません","ur":"اس وقت فضائی حدود میں کوئی غیر معمولی صورتحال نہیں","vi":"Hiện không có bất thường vùng trời được ghi nhận"},"Enable notice":{"ja":"通知を有効にする","ur":"اطلاع فعال کریں","vi":"Bật thông báo"},"Test notice":{"ja":"通知をテスト","ur":"اطلاع کی جانچ کریں","vi":"Kiểm tra thông báo"},"Safe heuristic checks":{"ja":"安全なヒューリスティック検査","ur":"محفوظ اصولی جانچ","vi":"Kiểm tra heuristic an toàn"},"Time, wherever the visitor is.":{"ja":"訪問者のいる場所の時刻。","ur":"صارف جہاں بھی ہو، وہاں کا وقت۔","vi":"Thời gian tại nơi người dùng đang ở."},"NASA Worldview + GPM observation panel":{"ja":"NASA Worldview＋GPM観測パネル","ur":"NASA Worldview + GPM مشاہداتی پینل","vi":"Bảng quan sát NASA Worldview + GPM"},"Latitude":{"ja":"緯度","ur":"عرضِ بلد","vi":"Vĩ độ"},"Longitude":{"ja":"経度","ur":"طولِ بلد","vi":"Kinh độ"},"Update view":{"ja":"表示を更新","ur":"منظر تازہ کریں","vi":"Cập nhật chế độ xem"},"Use browser location":{"ja":"ブラウザーの位置情報を使用","ur":"براؤزر کا مقام استعمال کریں","vi":"Dùng vị trí của trình duyệt"},"Refresh precipitation":{"ja":"降水量データを更新","ur":"بارش کا ڈیٹا تازہ کریں","vi":"Làm mới dữ liệu mưa"},"NASA POWER atmospheric reading":{"ja":"NASA POWER大気観測値","ur":"NASA POWER فضائی پیمائش","vi":"Số liệu khí quyển NASA POWER"},"Refresh NASA data":{"ja":"NASAデータを更新","ur":"NASA ڈیٹا تازہ کریں","vi":"Làm mới dữ liệu NASA"},"Weather-ready information layer.":{"ja":"気象情報レイヤー。","ur":"موسمی معلومات کی تہہ۔","vi":"Lớp thông tin thời tiết."},"Use my location":{"ja":"現在地を使用","ur":"میرا موجودہ مقام استعمال کریں","vi":"Dùng vị trí của tôi"},"Open-Meteo":{"ja":"Open-Meteo","ur":"Open-Meteo","vi":"Open-Meteo"},"Satellite observation + verified navigation.":{"ja":"衛星観測＋確認済みナビゲーション。","ur":"سیٹلائٹ مشاہدہ + تصدیق شدہ نیویگیشن۔","vi":"Quan sát vệ tinh + điều hướng đã xác minh."},"Navigation & observation view":{"ja":"ナビゲーション・観測ビュー","ur":"نیویگیشن اور مشاہدے کا منظر","vi":"Giao diện điều hướng và quan sát"},"Official monitoring channels":{"ja":"公式監視チャンネル","ur":"سرکاری نگرانی کے ذرائع","vi":"Kênh giám sát chính thức"},"One control surface for the whole platform.":{"ja":"プラットフォーム全体を一元管理。","ur":"پورے پلیٹ فارم کے لیے ایک کنٹرول سطح۔","vi":"Một giao diện điều khiển cho toàn bộ nền tảng."},"Run integrity scan":{"ja":"整合性スキャンを実行","ur":"درستی کی جانچ چلائیں","vi":"Chạy quét tính toàn vẹn"},"Refresh application":{"ja":"アプリを更新","ur":"ایپ تازہ کریں","vi":"Làm mới ứng dụng"},"Export analysis snapshot":{"ja":"分析スナップショットをエクスポート","ur":"تجزیاتی اسنیپ شاٹ برآمد کریں","vi":"Xuất ảnh chụp nhanh phân tích"},"Interactive energy-recovery calculations.":{"ja":"対話型エネルギー回収計算。","ur":"انٹرایکٹو توانائی بازیافت کے حسابات۔","vi":"Tính toán thu hồi năng lượng tương tác."},"Potential electrical output":{"ja":"推定電力出力","ur":"ممکنہ برقی پیداوار","vi":"Công suất điện tiềm năng"},"Flow Q (m³/s)":{"ja":"流量 Q (m³/s)","ur":"بہاؤ Q (m³/s)","vi":"Lưu lượng Q (m³/s)"},"Head H (m)":{"ja":"有効落差 H (m)","ur":"ہیڈ H (m)","vi":"Cột áp H (m)"},"Efficiency η (%)":{"ja":"効率 η (%)","ur":"کارکردگی η (%)","vi":"Hiệu suất η (%)"},"Units":{"ja":"単位","ur":"اکائیاں","vi":"Đơn vị"},"Operating hours/day":{"ja":"1日あたりの運転時間","ur":"روزانہ آپریشن کے گھنٹے","vi":"Số giờ vận hành/ngày"},"Recalculate model":{"ja":"モデルを再計算","ur":"ماڈل دوبارہ حساب کریں","vi":"Tính lại mô hình"},"Distributed roadside estimate":{"ja":"道路沿い分散型の推定","ur":"سڑک کنارے تقسیم شدہ تخمینہ","vi":"Ước tính phân tán dọc đường"},"Road length (km)":{"ja":"道路延長 (km)","ur":"سڑک کی لمبائی (km)","vi":"Chiều dài đường (km)"},"Active panel width (m)":{"ja":"有効パネル幅 (m)","ur":"فعال پینل کی چوڑائی (m)","vi":"Chiều rộng tấm hoạt động (m)"},"PV efficiency (%)":{"ja":"太陽光発電効率 (%)","ur":"سولر پینل کی کارکردگی (%)","vi":"Hiệu suất quang điện (%)"},"Equivalent sun hours/day":{"ja":"等価日照時間/日","ur":"روزانہ مساوی دھوپ کے گھنٹے","vi":"Số giờ nắng tương đương/ngày"},"Usable coverage (%)":{"ja":"有効設置率 (%)","ur":"قابلِ استعمال کوریج (%)","vi":"Tỷ lệ diện tích sử dụng (%)"},"The project, assembled as a technical publication.":{"ja":"技術出版物としてまとめたプロジェクト。","ur":"یہ منصوبہ ایک تکنیکی اشاعت کی صورت میں مرتب کیا گیا ہے۔","vi":"Dự án được biên soạn thành một ấn phẩm kỹ thuật."},"Open full magazine":{"ja":"技術誌全体を開く","ur":"مکمل رسالہ کھولیں","vi":"Mở toàn bộ tạp chí"},"Download PDF":{"ja":"PDFをダウンロード","ur":"PDF ڈاؤن لوڈ کریں","vi":"Tải PDF"},"Fullscreen reader":{"ja":"全画面リーダー","ur":"فل اسکرین ریڈر","vi":"Trình đọc toàn màn hình"},"Contents":{"ja":"目次","ur":"فہرستِ مضامین","vi":"Mục lục"},"Project map & research philosophy":{"ja":"プロジェクトマップと研究方針","ur":"منصوبے کا نقشہ اور تحقیقی فلسفہ","vi":"Bản đồ dự án và triết lý nghiên cứu"},"Source → conditioning → BESS → loads":{"ja":"電源 → 電力調整 → 蓄電池システム → 負荷","ur":"ماخذ → کنڈیشننگ → BESS → لوڈز","vi":"Nguồn → điều hòa → BESS → tải tiêu thụ"},"Infrastructure Modules":{"ja":"インフラモジュール","ur":"بنیادی ڈھانچے کے ماڈیولز","vi":"Mô-đun hạ tầng"},"Road, PV, water, rail and airport concepts":{"ja":"道路、太陽光、水力、鉄道、空港の構想","ur":"سڑک، سولر، پانی، ریل اور ہوائی اڈے کے تصورات","vi":"Ý tưởng về đường bộ, PV, nước, đường sắt và sân bay"},"Energy Accounting":{"ja":"エネルギー会計","ur":"توانائی کا حساب","vi":"Hạch toán năng lượng"},"Planning benchmarks and scenario status":{"ja":"計画基準とシナリオの状態","ur":"منصوبہ بندی کے پیمانے اور منظرنامے کی حالت","vi":"Mốc lập kế hoạch và trạng thái kịch bản"},"Validation":{"ja":"検証","ur":"توثیق","vi":"Xác thực"},"Measurement-to-scale workflow":{"ja":"測定から実規模化までの手順","ur":"پیمائش سے عملی پیمانے تک کا عمل","vi":"Quy trình từ đo lường đến mở rộng quy mô"},"References":{"ja":"参考資料","ur":"حوالہ جات","vi":"Tài liệu tham khảo"},"Source integrity and attribution":{"ja":"情報源の完全性と帰属表示","ur":"ماخذ کی صحت اور نسبت","vi":"Tính toàn vẹn và ghi nguồn"},"Turn the website into a presentation-grade engineering workspace.":{"ja":"ウェブサイトを発表品質のエンジニアリング作業環境に。","ur":"ویب سائٹ کو پریزنٹیشن کے معیار کے انجینئرنگ ورک اسپیس میں تبدیل کریں۔","vi":"Biến website thành không gian kỹ thuật đạt chuẩn trình bày."},"Measured values stay separate from estimates.":{"ja":"実測値と推定値は明確に分けます。","ur":"پیمائش شدہ اقدار کو تخمینوں سے الگ رکھا جاتا ہے۔","vi":"Giá trị đo được luôn tách biệt với giá trị ước tính."},"IGERS Machine Control":{"ja":"IGERS機器制御","ur":"IGERS مشین کنٹرول","vi":"Điều khiển thiết bị IGERS"},"Unlock controls":{"ja":"制御を解除","ur":"کنٹرول اَن لاک کریں","vi":"Mở khóa điều khiển"},"Lock / Logout":{"ja":"ロック・ログアウト","ur":"لاک / لاگ آؤٹ","vi":"Khóa / Đăng xuất"},"MASTER ON":{"ja":"マスターON","ur":"ماسٹر آن","vi":"BẬT TỔNG"},"MASTER OFF":{"ja":"マスターOFF","ur":"ماسٹر آف","vi":"TẮT TỔNG"},"EMERGENCY STOP":{"ja":"緊急停止","ur":"ہنگامی بندش","vi":"DỪNG KHẨN CẤP"},"Solar Recovery Unit":{"ja":"太陽光回収ユニット","ur":"شمسی توانائی یونٹ","vi":"Cụm thu hồi năng lượng mặt trời"},"Airflow Recovery Unit":{"ja":"気流回収ユニット","ur":"ہوا کے بہاؤ سے توانائی یونٹ","vi":"Cụm thu hồi năng lượng luồng khí"},"Hydraulic Recovery Unit":{"ja":"水力回収ユニット","ur":"ہائیڈرولک توانائی یونٹ","vi":"Cụm thu hồi năng lượng thủy lực"},"Energy Storage System":{"ja":"エネルギー貯蔵システム","ur":"توانائی ذخیرہ کرنے کا نظام","vi":"Hệ thống lưu trữ năng lượng"},"Radar / Sensor Grid":{"ja":"レーダー・センサーネットワーク","ur":"ریڈار / سینسر گرڈ","vi":"Mạng radar / cảm biến"},"Weather Node":{"ja":"気象ノード","ur":"موسمی نوڈ","vi":"Nút thời tiết"},"Satellite Intelligence":{"ja":"衛星情報","ur":"سیٹلائٹ انٹیلیجنس","vi":"Thông tin tình báo vệ tinh"},"Infrastructure Sensor Network":{"ja":"インフラセンサーネットワーク","ur":"بنیادی ڈھانچے کا سینسر نیٹ ورک","vi":"Mạng cảm biến hạ tầng"},"ON":{"ja":"オン","ur":"آن","vi":"BẬT"},"OFF":{"ja":"オフ","ur":"آف","vi":"TẮT"},"AUTO":{"ja":"自動","ur":"خودکار","vi":"TỰ ĐỘNG"},"Integrated engineering intelligence.":{"ja":"統合エンジニアリング・インテリジェンス。","ur":"مربوط انجینئرنگ انٹیلیجنس۔","vi":"Trí tuệ kỹ thuật tích hợp."},"Refresh layer":{"ja":"レイヤーを更新","ur":"تہہ تازہ کریں","vi":"Làm mới lớp"},"Subsystem status":{"ja":"サブシステムの状態","ur":"ذیلی نظام کی حالت","vi":"Trạng thái hệ thống con"},"Source → recovery → conversion → storage":{"ja":"供給源 → 回収 → 変換 → 貯蔵","ur":"ماخذ → بازیافت → تبدیلی → ذخیرہ","vi":"Nguồn → thu hồi → chuyển đổi → lưu trữ"},"Impact accounting":{"ja":"効果の算定","ur":"اثرات کا حساب","vi":"Tính toán tác động"},"Conceptual infrastructure map":{"ja":"インフラ構想マップ","ur":"بنیادی ڈھانچے کا تصوری نقشہ","vi":"Bản đồ hạ tầng khái niệm"},"Operational state":{"ja":"稼働状態","ur":"آپریشنل حالت","vi":"Trạng thái vận hành"},"Engineering calculation framework":{"ja":"工学計算フレームワーク","ur":"انجینئرنگ حسابی فریم ورک","vi":"Khung tính toán kỹ thuật"},"System activity":{"ja":"システム活動","ur":"سسٹم کی سرگرمی","vi":"Hoạt động hệ thống"},"Ambition needs a measurement layer.":{"ja":"目標には測定の仕組みが必要です。","ur":"بلند مقصد کے لیے پیمائش کا نظام ضروری ہے۔","vi":"Mục tiêu lớn cần một lớp đo lường."},"Feasibility first":{"ja":"実現可能性を最優先","ur":"سب سے پہلے قابلِ عمل ہونے کی جانچ","vi":"Ưu tiên tính khả thi"},"Safety first":{"ja":"安全を最優先","ur":"حفاظت سب سے پہلے","vi":"An toàn là ưu tiên hàng đầu"},"Measure before claiming":{"ja":"主張する前に測定","ur":"دعویٰ کرنے سے پہلے پیمائش کریں","vi":"Đo lường trước khi đưa ra kết luận"},"Comments & Customer Care":{"ja":"ご意見・カスタマーサポート","ur":"تبصرے اور کسٹمر سپورٹ","vi":"Góp ý và chăm sóc khách hàng"},"Send a message to the IGERS interface":{"ja":"IGERSインターフェースにメッセージを送信","ur":"IGERS انٹرفیس کو پیغام بھیجیں","vi":"Gửi tin nhắn đến giao diện IGERS"},"Email address":{"ja":"メールアドレス","ur":"ای میل ایڈریس","vi":"Địa chỉ email"},"Comment / customer care message":{"ja":"コメント・サポートメッセージ","ur":"تبصرہ / کسٹمر سپورٹ پیغام","vi":"Ý kiến / tin nhắn hỗ trợ khách hàng"},"Submit message":{"ja":"メッセージを送信","ur":"پیغام بھیجیں","vi":"Gửi tin nhắn"},"Clear form":{"ja":"フォームをクリア","ur":"فارم صاف کریں","vi":"Xóa biểu mẫu"},"Recent local demo entries":{"ja":"最近のローカルデモ記録","ur":"حالیہ مقامی ڈیمو اندراجات","vi":"Mục demo cục bộ gần đây"},"Refresh danger monitor":{"ja":"危険監視を更新","ur":"خطرات کا مانیٹر تازہ کریں","vi":"Làm mới giám sát nguy cơ"},"Open air traffic":{"ja":"航空機追跡を開く","ur":"فضائی ٹریفک کھولیں","vi":"Mở theo dõi hàng không"},"Bangladesh mobile tower signal control.":{"ja":"バングラデシュの携帯通信タワー信号制御。","ur":"بنگلہ دیش میں موبائل ٹاور سگنل کنٹرول۔","vi":"Điều khiển tín hiệu trạm di động tại Bangladesh."},"Monitoring: ON":{"ja":"監視：オン","ur":"نگرانی: آن","vi":"Giám sát: BẬT"},"Run scan":{"ja":"スキャンを実行","ur":"اسکین چلائیں","vi":"Chạy quét"},"Reset":{"ja":"リセット","ur":"ری سیٹ","vi":"Đặt lại"},"Satellite · radar · air · tower · energy model.":{"ja":"衛星・レーダー・航空・タワー・エネルギーモデル。","ur":"سیٹلائٹ · ریڈار · ہوا · ٹاور · توانائی ماڈل۔","vi":"Mô hình vệ tinh · radar · hàng không · trạm tháp · năng lượng."},"ROTATE 45°":{"ja":"45°回転","ur":"45° گھمائیں","vi":"XOAY 45°"},"RESET":{"ja":"リセット","ur":"ری سیٹ","vi":"ĐẶT LẠI"},"Visualization layers":{"ja":"可視化レイヤー","ur":"تصویری تہیں","vi":"Các lớp trực quan hóa"},"SYSTEM":{"ja":"システム","ur":"سسٹم","vi":"HỆ THỐNG"},"SATELLITE":{"ja":"衛星","ur":"سیٹلائٹ","vi":"VỆ TINH"},"RADAR":{"ja":"レーダー","ur":"ریڈار","vi":"RADAR"},"AIR":{"ja":"航空","ur":"فضا","vi":"HÀNG KHÔNG"},"TOWER":{"ja":"タワー","ur":"ٹاور","vi":"TRẠM THÁP"},"ENERGY":{"ja":"エネルギー","ur":"توانائی","vi":"NĂNG LƯỢNG"},"Install / update":{"ja":"インストール・更新","ur":"انسٹال / اپ ڈیٹ","vi":"Cài đặt / cập nhật"},"Copyright & Attribution":{"ja":"著作権・出典表示","ur":"کاپی رائٹ اور نسبت","vi":"Bản quyền và ghi nhận nguồn"},"Privacy Policy":{"ja":"プライバシーポリシー","ur":"رازداری کی پالیسی","vi":"Chính sách quyền riêng tư"},"Terms & Disclaimer":{"ja":"شرائط اور دستبرداری","ur":"شرائط اور دستبرداری","vi":"Điều khoản và tuyên bố miễn trừ"},"Checking...":{"ja":"確認中...","ur":"جانچ جاری ہے...","vi":"Đang kiểm tra..."},"Checking public hazard feeds…":{"ja":"公開ハザード情報を確認中…","ur":"عوامی خطرے کے فیڈز کی جانچ جاری ہے…","vi":"Đang kiểm tra nguồn dữ liệu nguy cơ công khai…"},"Refresh":{"ja":"更新","ur":"تازہ کریں","vi":"Làm mới"},"Submit":{"ja":"送信","ur":"جمع کریں","vi":"Gửi"},"some technical details may remain in english if a reviewed translation is not available.":{"ja":"レビュー済みの翻訳がない技術的な詳細は、英語のまま表示される場合があります。","ur":"جن تکنیکی تفصیلات کا نظرثانی شدہ ترجمہ دستیاب نہیں، وہ انگریزی میں رہ سکتی ہیں۔","vi":"Một số chi tiết kỹ thuật chưa có bản dịch được rà soát có thể vẫn hiển thị bằng tiếng Anh."}};
  const norm = s => String(s ?? '').replace(/\s+/g, ' ').trim();
  const locale = raw => {
    const s = String(raw || '').trim().toLowerCase().replace('_','-');
    if (s === 'ja' || s.startsWith('ja-')) return 'ja';
    if (s === 'ur' || s.startsWith('ur-')) return 'ur';
    if (s === 'vi' || s.startsWith('vi-')) return 'vi';
    return null;
  };
  const sourceNodes = new WeakMap();
  const sourceRawNodes = new WeakMap();
  const trackedNodes = new Set();
  const markedParents = new Set();
  let activeLang = null;
  let selector = null;
  let baseApi = null;
  // Save the requested option before the legacy 8-language handler can fall back to English.
  let pendingSelection = null;

  function findExistingSelector() {
    return document.getElementById('igersLanguageSelect') || Array.from(document.querySelectorAll('select')).find(el => {
      const probe = [el.id, el.name, el.getAttribute('aria-label')].join(' ').toLowerCase();
      return /(^|[^a-z])(language|languages|locale|lang)([^a-z]|$)/.test(probe) || el.hasAttribute('data-language-selector');
    }) || null;
  }
  function ensureOptions(sel) {
    for (const [code, meta] of Object.entries(LANGS)) {
      const exists = Array.from(sel.options).some(o => locale(o.value) === code || norm(o.textContent) === meta.label);
      if (!exists) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = meta.label;
        opt.dataset.igersAddonLanguage = 'true';
        sel.appendChild(opt);
      }
    }
  }
  function markParent(el) {
    if (!el || el.hasAttribute('data-i18n-skip')) return;
    el.setAttribute('data-i18n-skip', '');
    markedParents.add(el);
  }
  function getEnglishSource(node) {
    if (sourceNodes.has(node)) return sourceNodes.get(node);
    const raw = node.nodeValue || '';
    const value = norm(raw);
    sourceNodes.set(node, value);
    sourceRawNodes.set(node, raw);
    trackedNodes.add(node);
    return value;
  }
  function eligibleText(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.parentElement) return false;
    if (!norm(node.nodeValue)) return false;
    if (node.parentElement.closest('script,style,noscript,textarea,select,option,code,pre,svg,[data-no-translate]')) return false;
    return true;
  }
  function translateText(node) {
    if (!activeLang || !eligibleText(node)) return;
    const source = getEnglishSource(node);
    const translated = DICT[source] && DICT[source][activeLang];
    if (!translated) return;
    const el = node.parentElement;
    markParent(el);
    const raw = sourceRawNodes.get(node) || node.nodeValue || '';
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    const next = leading + translated + trailing;
    if (node.nodeValue !== next) node.nodeValue = next;
  }
  function scan(root = document.body) {
    if (!activeLang || !root) return;
    if (root.nodeType === Node.TEXT_NODE) { translateText(root); return; }
    if (root.nodeType === Node.ELEMENT_NODE && root.closest && root.closest('script,style,noscript,textarea,select,option,code,pre,svg,[data-no-translate]')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateText(node);
  }
  function removeAddonStorage() { try { localStorage.removeItem(STORAGE_KEY); } catch (_) {} }
  function releaseOverlay({clearPreference = true} = {}) {
    activeLang = null;
    // Restore curated nodes to English before the existing i18n runtime handles the next locale.
    for (const node of trackedNodes) {
      if (!node.isConnected || !sourceRawNodes.has(node)) continue;
      const raw = sourceRawNodes.get(node);
      if (node.nodeValue !== raw) node.nodeValue = raw;
    }
    for (const el of markedParents) if (el.isConnected) el.removeAttribute('data-i18n-skip');
    markedParents.clear();
    if (clearPreference) removeAddonStorage();
  }
  function setBaseEnglish() {
    baseApi = window.IGERSLanguage || baseApi;
    if (baseApi && typeof baseApi.set === 'function') {
      baseApi.set('en', false);
    }
  }
  function applyAddon(code, {save = true} = {}) {
    const chosen = locale(code);
    if (!chosen) return false;
    if (activeLang) releaseOverlay({clearPreference:false});
    // Let the canonical eight-language runtime restore its original English text state
    // before we mark the exact nodes it must leave alone for the new locale.
    setBaseEnglish();
    if (selector) selector.value = chosen;
    activeLang = chosen;
    document.documentElement.lang = chosen;
    document.documentElement.dir = LANGS[chosen].dir;
    document.documentElement.dataset.igersLanguage = chosen;
    if (document.body) document.body.dataset.igersLanguage = chosen;
    if (save) { try { localStorage.setItem(STORAGE_KEY, chosen); } catch (_) {} }
    scan(document.body);
    window.dispatchEvent(new CustomEvent('igers:languagechange', {detail:{language:chosen, version:VERSION, extension:true}}));
    return true;
  }
  function handleLegacyChange() {
    // The capture-phase listener calls this BEFORE the existing i18n.js handler, so its
    // translator receives clean English text and can safely render any original locale.
    if (activeLang) releaseOverlay({clearPreference:true});
    else removeAddonStorage();
  }
  function onChange() {
    const raw = pendingSelection !== null ? pendingSelection : (selector && selector.value);
    pendingSelection = null;
    const chosen = locale(raw);
    if (chosen) {
      applyAddon(chosen, {save:true});
      return;
    }
    // Existing options (auto/en/bn/hi/ar/zh/es/fr/ru) remain owned by i18n.js.
    if (activeLang) releaseOverlay({clearPreference:true});
    else removeAddonStorage();
    if (String(raw).toLowerCase() === 'auto') {
      const browserCandidates = [...(navigator.languages || []), navigator.language || 'en'];
      const detected = browserCandidates.map(locale).find(Boolean);
      if (detected) applyAddon(detected, {save:true});
    }
  }
  function install() {
    baseApi = window.IGERSLanguage || null;
    selector = findExistingSelector();
    // Fail closed: never inject a separate selector into an app whose canonical
    // language control/runtime is absent. This prevents hiding the legacy locales.
    if (!selector) {
      console.warn('[IGERS Language Add-on] Not activated: existing language selector not found; application left unchanged.');
      window.IGERSLanguageAddon = Object.freeze({
        version:VERSION,
        active:false,
        reason:'existing-language-selector-not-found',
        supportedLanguages:Object.freeze(Object.keys(LANGS)),
        setLanguage:()=>false,
        getLanguage:()=>null,
        translateText:(text)=>text
      });
      return;
    }
    ensureOptions(selector); // Only append missing Japanese/Urdu/Vietnamese options.
    {
      // Restore our text before the legacy bubble listener changes it to its chosen language.
      selector.addEventListener('change', () => {
        // Capture the user's choice before i18n.js can rewrite unknown codes to 'en'.
        pendingSelection = selector.value;
        if (!locale(pendingSelection) && activeLang) handleLegacyChange();
      }, true);
      // Runs after i18n.js's original change handler, which safely falls back to English for new codes.
      selector.addEventListener('change', onChange);
    }
    let saved = null;
    let basePref = 'auto';
    try {
      saved = locale(localStorage.getItem(STORAGE_KEY));
      basePref = localStorage.getItem('igersLanguagePreferenceV1') || 'auto';
    } catch (_) {}
    const selected = selector ? locale(selector.value) : null;
    const browser = [...(navigator.languages || []), navigator.language || 'en'].map(locale).find(Boolean) || null;
    // Saved explicit add-on preference wins. Browser detection is only used when the existing
    // eight-language selector is in Auto mode (or when this add-on creates the fallback selector).
    const initial = saved || selected || ((basePref === 'auto' || basePref === '') ? browser : null);
    if (initial) applyAddon(initial, {save:!!saved});
    const observer = new MutationObserver(records => {
      if (!activeLang) return;
      for (const rec of records) {
        if (rec.type === 'characterData') translateText(rec.target);
        else for (const added of rec.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) translateText(added);
          else if (added.nodeType === Node.ELEMENT_NODE) scan(added);
        }
      }
      // Keep long-running live panels bounded: discard detached translated nodes/parents.
      if (trackedNodes.size > 1500) for (const node of trackedNodes) if (!node.isConnected) trackedNodes.delete(node);
      if (markedParents.size > 1500) for (const el of markedParents) if (!el.isConnected) markedParents.delete(el);
    });
    observer.observe(document.body || document.documentElement, {subtree:true, childList:true, characterData:true});
    window.IGERSLanguageAddon = Object.freeze({
      version:VERSION,
      supportedLanguages:Object.freeze(Object.keys(LANGS)),
      setLanguage:(code)=>applyAddon(code),
      getLanguage:()=>activeLang,
      translateText:(text)=>{
        const src = norm(text);
        return activeLang && DICT[src] && DICT[src][activeLang] ? DICT[src][activeLang] : text;
      }
    });
    document.documentElement.dataset.igersLanguageAddon = VERSION;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
