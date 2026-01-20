
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ServiceCard, FAQItem } from './types';

type Language = 'RU' | 'EN' | 'TH';
type Page = 'HOME' | 'SERVICES' | 'PARTNERS';

const Logo = () => (
  <div className="flex items-center gap-3 group">
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="absolute inset-0 logo-gradient rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-blue-500/30"></div>
      <div className="absolute -inset-1 logo-ring rounded-full opacity-30"></div>
      <div className="relative text-white font-black text-xl italic tracking-tighter">O3</div>
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">OZOLUX</span>
      <span className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">Air Standard</span>
    </div>
  </div>
);

const translations = {
  RU: {
    heroTag: "Standard 2026: Молекулярная стерилизация",
    heroTitle: "Ваша вилла — зона абсолютной чистоты",
    heroSub: "Профессиональная молекулярная стерилизация воздуха и поверхностей за 60 минут. Удаляем невидимую плесень, вирусы и запахи там, где бессилен обычный клининг.",
    heroCTA1: "Рассчитать стоимость по WhatsApp",
    heroCTA2: "Бесплатный аудит воздуха",
    trustBar: "Объекты под защитой Ozolux Air Safety Standard",
    trustCounter: "Стерильных вилл",
    whyTitle: "Почему «просто чисто» — недостаточно на Пхукете?",
    whyText: "Влажность 80%+ превращает кондиционеры и скрытые полости в инкубаторы плесени. Вы не видите спор в воздухе, но ваш организм их чувствует через аллергии, кашель и усталость.",
    assetProtection: "Asset Protection: Озонация — это способ сэкономить миллионы бат на будущем ремонте и замене мебели, съеденной грибком.",
    threats: ["Плесень", "Вирусы", "Запахи", "VOC-газы"],
    threatTitle: "Невидимая чистота vs Скрытая угроза",
    threatSub: "Слева: Стерильная среда после Ozolux. Справа: Воздух, насыщенный спорами и аллергенами.",
    mythTitle: "Уборка очищает поверхности. Проблема — глубже.",
    mythText: "Химия и ароматизаторы маскируют запахи, но не уничтожают бактерии и грибок. Они остаются внутри материалов и возвращаются при первой влажности.",
    mythConclusion: "Для решения проблемы требуется обработка, которая воздействует на причину, а не на симптом.",
    trustLayerTitle: "Почему Ozolux:",
    trustLayerItems: [
      { title: "Работаем с объектами на Пхукете", desc: "Глубокое знание локального рынка недвижимости и застройщиков.", icon: "fa-map-location-dot" },
      { title: "Понимаем особенности климата", desc: "Знаем, как бороться с тропической плесенью при влажности 80%+", icon: "fa-cloud-sun-rain" },
      { title: "Используем профессиональное оборудование", desc: "Промышленные генераторы озона, а не бытовые очистители.", icon: "fa-microchip" },
      { title: "Работаем по стандарту, а не «по ощущениям»", desc: "Строгие протоколы дозировки и времени экспозиции.", icon: "fa-shield-halved" }
    ],
    locationsTitle: "География чистоты Ozolux",
    locationsSub: "Мы ежедневно работаем в самых престижных локациях Пхукета",
    locationList: ["Laguna Phuket", "Bang Tao", "Layan", "Cape Yamu", "Kamala", "Rawai", "Chalong", "Royal Phuket Marina"],
    finalCTATitle: "Готовы дышать полной грудью?",
    finalCTASub: "Запишитесь на бесплатный замер качества воздуха уже сегодня. Мы покажем то, что скрыто от глаз.",
    finalCTAButton: "Связаться с экспертом",
    serviceTitle: "Сегментированные решения",
    serviceSub: "Гипер-персонализация для любых типов активов на Пхукете.",
    serviceMore: "Подробнее",
    howTitle: "Как это работает?",
    howSub: "Научный подход к невидимой чистоте в 4 этапа.",
    steps: [
      { title: "Smart Audit", desc: "Измеряем уровень летучих органических соединений и влажности высокоточными датчиками." },
      { title: "Molecular Attack", desc: "Насыщаем помещение активным озоном, который разрушает оболочки бактерий и молекулы запаха." },
      { title: "Oxygen Transform", desc: "Озон естественным образом распадается в чистый кислород. Никакой химии." },
      { title: "Certification", desc: "Вы получаете цифровой паспорт чистоты объекта и гарантию свежести." }
    ],
    aiName: "AI-инженер Игорь",
    aiSub: "Рассчитает время обработки вашей виллы",
    aiPlaceholder: "Площадь вашей виллы?",
    navAbout: "О технологии",
    navServices: "Услуги",
    navPartners: "Партнерам",
    auditBtn: "Бесплатный аудит",
    pricesTitle: "Стоимость услуг",
    pricesSub: "Прозрачное ценообразование для вашего спокойствия",
    unitSqm: "м²",
    from: "от",
    bookNow: "Заказать обработку",
    priceCategories: [
      { name: "Кондо / Студия", price: "3,500 THB", detail: "До 45 м²" },
      { name: "Вилла (2-3 спальни)", price: "7,500 THB", detail: "До 150 м²" },
      { name: "Премиум Вилла", price: "15,000 THB", detail: "От 300 м²" },
      { name: "Яхта / Авто", price: "2,500 THB", detail: "Полная дезинфекция салона" }
    ],
    faqTitle: "Проверка фактов",
    faqItems: [
      { question: "Безопасно ли это для электроники?", answer: "Да, абсолютно. Мы соблюдаем строгий регламент концентрации озона и времени экспозиции, который безопасен для компонентов техники." },
      { question: "Нужно ли уезжать из дома?", answer: "Да, на время процедуры (около 60 мин) и 15-20 минут после для полного распада озона в кислород." },
      { question: "Поможет ли от запаха «старой мебели»?", answer: "Это наше любимое задание. Молекулярная атака разрушает сам источник запаха, а не маскирует его." }
    ],
    footerCTA: "Вызвать эксперта с датчиком качества воздуха",
    partnersTitle: "Станьте партнером Ozolux Air Standard",
    partnersSub: "Повысьте ценность ваших объектов. Виллы с нашим сертификатом сдаются на 12% быстрее.",
    partnersCTA: "Получить партнерский прайс-лист",
    certTitle: "Сертификат Ozolux",
    certSub: "Ваше преимущество перед конкурентами",
    partnerBenefits: [
      { title: "Заполнение объектов на 12% быстрее", desc: "Сертификат повышает доверие гостей" },
      { title: "White Label", desc: "Выдавайте наши сертификаты от своего бренда" },
      { title: "API Integration", desc: "Автоматический заказ стерилизации при выезде гостя" },
      { title: "Volume Discount", desc: "Специальные цены для портфеля от 10 объектов" }
    ],
    partnerHeaderTitle: "Выгода для управляющих",
    certExampleLabel: "Пример сертификата, который получают ваши клиенты"
  },
  EN: {
    heroTag: "Standard 2026: Molecular Sterilization",
    heroTitle: "Your Villa — A Zone of Absolute Purity",
    heroSub: "Professional molecular air and surface sterilization in 60 minutes. We remove invisible mold, viruses, and odors where regular cleaning fails.",
    heroCTA1: "Calculate Price via WhatsApp",
    heroCTA2: "Free Air Quality Audit",
    trustBar: "Assets Protected by Ozolux Air Safety Standard",
    trustCounter: "Sterile Villas",
    whyTitle: "Why 'Just Clean' is Not Enough in Phuket?",
    whyText: "80%+ humidity turns air conditioners and hidden cavities into mold incubators. You don't see the spores, but your body feels them through allergies, cough, and fatigue.",
    assetProtection: "Asset Protection: Ozonation is a way to save millions of THB on future repairs and furniture replacement eaten by fungus.",
    threats: ["Mold", "Viruses", "Odors", "VOC Gases"],
    threatTitle: "Invisible Clean vs Hidden Threat",
    threatSub: "Left: Sterile environment after Ozolux. Right: Air saturated with spores and allergens.",
    mythTitle: "Cleaning cleans surfaces. The problem is deeper.",
    mythText: "Chemicals and fragrances mask odors, but don't destroy bacteria and mold. They remain inside materials and return at the first sign of humidity.",
    mythConclusion: "Solving the problem requires treatment that targets the cause, not the symptom.",
    trustLayerTitle: "Why Ozolux:",
    trustLayerItems: [
      { title: "Phuket Asset Specialists", desc: "Deep knowledge of the local real estate market and developers.", icon: "fa-map-location-dot" },
      { title: "Climate Specificity", desc: "Understanding extreme humidity and tropical flora.", icon: "fa-cloud-sun-rain" },
      { title: "Pro Equipment", desc: "High-power industrial ozone generators, not household purifiers.", icon: "fa-microchip" },
      { title: "Standardized Operations", desc: "Strict protocols for dosage and exposure time.", icon: "fa-shield-halved" }
    ],
    locationsTitle: "Ozolux Clean Geography",
    locationsSub: "Operating daily in Phuket's most prestigious locations",
    locationList: ["Laguna Phuket", "Bang Tao", "Layan", "Cape Yamu", "Kamala", "Rawai", "Chalong", "Royal Phuket Marina"],
    finalCTATitle: "Ready to breathe freely?",
    finalCTASub: "Book a free air quality audit today. We'll show you what's hidden from plain sight.",
    finalCTAButton: "Contact an Expert",
    serviceTitle: "Segmented Solutions",
    serviceSub: "Hyper-personalization for any type of asset in Phuket.",
    serviceMore: "Details",
    howTitle: "How It Works?",
    howSub: "Scientific approach to invisible cleanliness in 4 steps.",
    steps: [
      { title: "Smart Audit", desc: "We measure volatile organic compounds and humidity with high-precision sensors." },
      { title: "Molecular Attack", desc: "We saturate the space with active ozone, destroying bacterial shells and odor molecules." },
      { title: "Oxygen Transform", desc: "Ozone naturally decomposes into pure oxygen. Zero chemicals." },
      { title: "Certification", desc: "You receive a digital purity passport and a freshness guarantee." }
    ],
    aiName: "AI Engineer Igor",
    aiSub: "Calculates the treatment time for your villa",
    aiPlaceholder: "Villa area in sqm?",
    navAbout: "Technology",
    navServices: "Services",
    navPartners: "Partners",
    auditBtn: "Free Audit",
    pricesTitle: "Service Pricing",
    pricesSub: "Transparent pricing for your peace of mind",
    unitSqm: "sqm",
    from: "from",
    bookNow: "Book Service",
    priceCategories: [
      { name: "Condo / Studio", price: "3,500 THB", detail: "Up to 45 sqm" },
      { name: "Villa (2-3 BR)", price: "7,500 THB", detail: "Up to 150 sqm" },
      { name: "Premium Villa", price: "15,000 THB", detail: "From 300 sqm" },
      { name: "Yacht / Auto", price: "2,500 THB", detail: "Full interior disinfection" }
    ],
    faqTitle: "Fact Check",
    faqItems: [
      { question: "Is it safe for electronics?", answer: "Yes, absolutely. We follow strict ozone concentration protocols that are safe for technical components." },
      { question: "Do I need to leave the house?", answer: "Yes, during the procedure (about 60 min) and for 15-20 minutes after for ozone to decay into oxygen." },
      { question: "Does it help with 'old furniture' smell?", answer: "This is our favorite task. Molecular attack destroys the source of the smell rather than masking it." }
    ],
    footerCTA: "Call expert with Air Quality Sensor",
    partnersTitle: "Become an Ozolux Air Standard Partner",
    partnersSub: "Increase property value. Villas with our certificate rent 12% faster.",
    partnersCTA: "Get Partner Price List",
    certTitle: "Ozolux Certificate",
    certSub: "Your edge over the competition",
    partnerBenefits: [
      { title: "12% faster occupancy", desc: "Certificate boosts guest trust" },
      { title: "White Label", desc: "Issue certificates under your own brand" },
      { title: "API Integration", desc: "Auto-book sterilization upon guest check-out" },
      { title: "Volume Discount", desc: "Special pricing for portfolios of 10+ properties" }
    ],
    partnerHeaderTitle: "Benefits for Managers",
    certExampleLabel: "Sample certificate your clients receive"
  },
  TH: {
    heroTag: "มาตรฐาน 2026: การฆ่าเชื้อระดับโมเลกุล",
    heroTitle: "วิลล่าของคุณ — เขตสะอาดหมดจด",
    heroSub: "การฆ่าเชื้ออากาศและพื้นผิวระดับโมเลกุลอย่างมืออาชีพใน 60 นาที กำจัดเชื้อรา ไวรัส และกลิ่นที่มองไม่เห็นซึ่งการทำความสะอาดทั่วไปทำไม่ได้",
    heroCTA1: "คำนวณราคาผ่าน WhatsApp",
    heroCTA2: "ตรวจสอบคุณภาพอากาศฟรี",
    trustBar: "ทรัพย์สินที่ได้รับการคุ้มครองโดย Ozolux Air Safety Standard",
    trustCounter: "วิลล่าปลอดเชื้อ",
    whyTitle: "ทำไม 'แค่สะอาด' ถึงไม่เพียงพอในภูเก็ต?",
    whyText: "ความชื้นมากกว่า 80% เปลี่ยนเครื่องปรับอากาศและซอกมุมที่มองไม่เห็นให้เป็นที่เพาะเชื้อรา คุณอาจมองไม่เห็นสปอร์ แต่ร่างกายจะรู้สึกได้จากอาการแพ้ ไอ และเหนื่อยล้า",
    assetProtection: "Asset Protection: การอบโอโซนคือวิธีประหยัดเงินหลายล้านบาทจากการซ่อมแซมและการเปลี่ยนเฟอร์นิเจอร์ที่ถูกเชื้อรากัดกินในอนาคต",
    threats: ["เชื้อรา", "ไวรัส", "กลิ่น", "ก๊าซ VOC"],
    threatTitle: "Invisible Clean vs Hidden Threat",
    threatSub: "ซ้าย: หลังการฆ่าเชื้อระดับโมเลกุล ขวา: เชื้อราสะสมในเครื่องปรับอากาศของคุณ",
    mythTitle: "การทำความสะอาดทั่วไปทำได้เพียงแค่พื้นผิว แต่ปัญหาจริงๆ ซ่อนอยู่ลึกกว่านั้น",
    mythText: "สารเคมีและน้ำหอมช่วยกลบกลิ่น แต่ไม่ได้กำจัดแบคทีเรียและเชื้อรา พวกมันยังคงอยู่ภายในวัสดุและจะกลับมาทันทีเมื่อมีความชื้น",
    mythConclusion: "การแก้ปัญหาต้องอาศัยการจัดการที่ต้นเหตุ ไม่ใช่แค่การจัดการที่ปลายเหตุ",
    trustLayerTitle: "ทำไมต้อง Ozolux:",
    trustLayerItems: [
      { title: "เชี่ยวชาญทรัพย์สินในภูเก็ต", desc: "ความเข้าใจอย่างลึกซึ้งในตลาดอสังหาริมทรัพย์และผู้พัฒนาในท้องถิ่น", icon: "fa-map-location-dot" },
      { title: "เข้าใจลักษณะภูมิอากาศ", desc: "เรารู้วิธีจัดการกับเชื้อราในเขตร้อนที่มีความชื้นมากกว่า 80%", icon: "fa-cloud-sun-rain" },
      { title: "อุปกรณ์มาตรฐานมืออาชีพ", desc: "เครื่องกำเนิดโอโซนเกรดอุตสาหกรรม ไม่ใช่เครื่องฟอกอากาศทั่วไป", icon: "fa-microchip" },
      { title: "ทำงานตามมาตรฐาน ไม่ใช่ความรู้สึก", desc: "มีระเบียบขั้นตอนที่เข้มงวดสำหรับปริมาณและเวลาที่ใช้", icon: "fa-shield-halved" }
    ],
    locationsTitle: "พื้นที่ให้บริการของ Ozolux",
    locationsSub: "เราให้บริการทุกวันในพื้นที่ระดับพรีเมียมทั่วภูเก็ต",
    locationList: ["Laguna Phuket", "Bang Tao", "Layan", "Cape Yamu", "Kamala", "Rawai", "Chalong", "Royal Phuket Marina"],
    finalCTATitle: "พร้อมที่จะหายใจได้อย่างเต็มปอดหรือยัง?",
    finalCTASub: "จองบริการตรวจสอบคุณภาพอากาศฟรีวันนี้ เราจะแสดงให้คุณเห็นสิ่งที่ซ่อนอยู่",
    finalCTAButton: "ติดต่อผู้เชี่ยวชาญ",
    serviceTitle: "โซลูชั่นที่ตอบโจทย์เฉพาะด้าน",
    serviceSub: "การดูแลที่เป็นส่วนตัวสูงสำหรับทรัพย์สินทุกประเภทในภูเก็ต",
    serviceMore: "รายละเอียด",
    howTitle: "มันทำงานอย่างไร?",
    howSub: "แนวทางทางวิทยาศาสตร์เพื่อความสะอาดที่มองไม่เห็นใน 4 ขั้นตอน",
    steps: [
      { title: "Smart Audit", desc: "เราวัดระดับสารอินทรีย์ระเหยง่ายและความชื้นด้วยเซ็นเซอร์ความแม่นยำสูง" },
      { title: "Molecular Attack", desc: "เราเติมโอโซนเข้มข้นเพื่อทำลายผนังเซลล์ของแบคทีเรียและโมเลกุลของกลิ่น" },
      { title: "Oxygen Transform", desc: "โอโซนสลายตัวเป็นออกซิเจนบริสุทธิ์ตามธรรมชาติ ไม่ทิ้งสารเคมีตกค้าง" },
      { title: "Certification", desc: "คุณจะได้รับหนังสือรับรองความสะอาดดิจิทัลและการรับประกันความสดชื่น" }
    ],
    aiName: "AI วิศวกร อิกอร์",
    aiSub: "คำนวณเวลาในการจัดการวิลล่าของคุณ",
    aiPlaceholder: "ขนาดวิลล่าของคุณ?",
    navAbout: "เทคโนโลยี",
    navServices: "บริการ",
    navPartners: "พาร์ทเนอร์",
    auditBtn: "ตรวจสอบฟรี",
    pricesTitle: "ราคาค่าบริการ",
    pricesSub: "ราคาที่โปร่งใสเพื่อความสบายใจของคุณ",
    unitSqm: "ตร.ม.",
    from: "เริ่มที่",
    bookNow: "จองบริการ",
    priceCategories: [
      { name: "คอนโด / สตูดิโอ", price: "3,500 THB", detail: "ไม่เกิน 45 ตร.ม." },
      { name: "วิลล่า (2-3 ห้องนอน)", price: "7,500 THB", detail: "ไม่เกิน 150 ตร.ม." },
      { name: "วิลล่าพรีเมียม", price: "15,000 THB", detail: "300 ตร.ม. ขึ้นไป" },
      { name: "เรือยอทช์ / รถยนต์", price: "2,500 THB", detail: "ฆ่าเชื้อภายในทั้งหมด" }
    ],
    faqTitle: "ตรวจสอบข้อเท็จจริง",
    faqItems: [
      { question: "ปลอดภัยต่อเครื่องใช้ไฟฟ้าหรือไม่?", answer: "ปลอดภัยแน่นอน เราปฏิบัติตามมาตรฐานความเข้มข้นของโอโซนที่ปลอดภัยต่ออุปกรณ์อิเล็กทรอนิกส์" },
      { question: "จำเป็นต้องออกจากบ้านหรือไม่?", answer: "ใช่ ในระหว่างขั้นตอน (ประมาณ 60 นาที) และรออีก 15-20 นาทีเพื่อให้โอโซนสลายตัวเป็นออกซิเจน" },
      { question: "ช่วยกำจัดกลิ่น 'เฟอร์นิเจอร์เก่า' ได้ไหม?", answer: "นี่คืองานถนัดของเรา การจัดการระดับโมлеกุลจะทำลายแหล่งกำเนิดกลิ่นโดยตรง ไม่ใช่แค่การกลบกลิ่น" }
    ],
    footerCTA: "เรียกผู้เชี่ยวชาญพร้อมเซ็นเซอร์วัดคุณภาพอากาศ",
    partnersTitle: "เข้าร่วมเป็นพาร์ทเนอร์ Ozolux Air Standard",
    partnersSub: "เพิ่มมูลค่าทรัพย์สินของคุณ วิลล่าที่ได้รับใบรับรองของเราถูกเช่าเร็วขึ้น 12%",
    partnersCTA: "ขอรับรายการราคาพาร์ทเนอร์",
    certTitle: "ตัวอย่างใบรับรอง",
    certSub: "ข้อได้เปรียบของคุณเหนือคู่แข่ง",
    partnerBenefits: [
      { title: "เช่าได้เร็วขึ้น 12%", desc: "ใบรับรองช่วยเพิ่มความมั่นใจให้กับแขก" },
      { title: "White Label", desc: "ออกใบรับรองภายใต้แบรนด์ของคุณเอง" },
      { title: "API Integration", desc: "จองบริการฆ่าเชื้ออัตโนมัติเมื่อแขกเช็คเอาท์" },
      { title: "Volume Discount", desc: "ราคาพิเศษสำหรับพอร์ตโฟลิโอมากกว่า 10 ทรัพย์สิน" }
    ],
    partnerHeaderTitle: "ประโยชน์สำหรับผู้จัดการ",
    certExampleLabel: "ตัวอย่างใบรับรองที่ลูกค้าของคุณจะได้รับ"
  }
};

const SERVICES: Record<Language, ServiceCard[]> = {
  RU: [
    { title: "Для Жизни", subtitle: "Villas & Condos", description: "Защита вашей семьи и детей. Создаем среду, где дышится легко.", icon: "fa-house-chimney-window", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80" },
    { title: "Для Бизнеса", subtitle: "Managers & Airbnb", description: "Мгновенный чекин. Удаляем запах табака и сырости за 1 час. Гарантия 5⭐️ отзывов.", icon: "fa-briefcase", image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=600&q=80" },
    { title: "Для Транспорта", subtitle: "Auto & Marine", description: "Свежесть новой яхты или авто. Удаляем запахи солярки, еды и влаги из обивки.", icon: "fa-ship", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80" }
  ],
  EN: [
    { title: "For Life", subtitle: "Villas & Condos", description: "Protection for your family and children. Create an environment where it's easy to breathe.", icon: "fa-house-chimney-window", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80" },
    { title: "For Business", subtitle: "Managers & Airbnb", description: "Instant check-in. Remove tobacco and damp odors in 1 hour. 5⭐️ reviews guaranteed.", icon: "fa-briefcase", image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=600&q=80" },
    { title: "For Assets", subtitle: "Auto & Marine", description: "Freshness of a new yacht or car. Remove diesel, food, and moisture odors from upholstery.", icon: "fa-ship", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80" }
  ],
  TH: [
    { title: "สำหรับการใช้ชีวิต", subtitle: "วิลล่าและคอนโด", description: "การปกป้องครอบครัวและลูกหลานของคุณ สร้างสภาพแวดล้อมที่หายใจได้สะดวก", icon: "fa-house-chimney-window", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80" },
    { title: "สำหรับธุรกิจ", subtitle: "ผู้จัดการและ Airbnb", description: "เช็คอินได้ทันที กำจัดกลิ่นบุหรี่และความอับชื้นภายใน 1 ชั่วโมง รับประกันรีวิว 5⭐️", icon: "fa-briefcase", image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=600&q=80" },
    { title: "สำหรับยานพาหนะ", subtitle: "รถยนต์และเรือ", description: "ความสดชื่นของเรือยอทช์หรือรถยนต์ใหม่ กำจัดกลิ่นดีเซล อาหาร และความชื้นจากเบาะ", icon: "fa-ship", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80" }
  ]
};

const PurityCertificate = () => {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-white rounded-xl shadow-2xl p-6 border-[12px] border-slate-100 flex flex-col items-center text-center overflow-hidden transition-transform hover:scale-[1.02] cursor-default">
      <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
      <div className="mt-4 mb-2">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border-2 border-blue-600/20">
          <i className="fa-solid fa-certificate text-3xl"></i>
        </div>
      </div>
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">CERTIFICATE OF PURITY</h3>
      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-4">OZOLUX AIR SAFETY STANDARD</p>
      
      <div className="w-full h-px bg-slate-100 mb-4"></div>
      
      <div className="space-y-3 w-full text-left">
        <div>
          <label className="text-[8px] uppercase text-slate-400 font-bold tracking-widest">Location</label>
          <p className="text-xs font-bold text-slate-800">Villa Azure, Laguna Phuket</p>
        </div>
        <div>
          <label className="text-[8px] uppercase text-slate-400 font-bold tracking-widest">Treatment Date</label>
          <p className="text-xs font-bold text-slate-800">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex justify-between">
           <div>
             <label className="text-[8px] uppercase text-slate-400 font-bold tracking-widest">Status</label>
             <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
               <i className="fa-solid fa-circle-check"></i> MOLECULAR CLEAN
             </p>
           </div>
           <div className="text-right">
             <label className="text-[8px] uppercase text-slate-400 font-bold tracking-widest">Expiry</label>
             <p className="text-xs font-bold text-slate-800">30 Days</p>
           </div>
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col items-center gap-2">
         <div className="w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
           <i className="fa-solid fa-qrcode text-3xl opacity-20"></i>
         </div>
         <p className="text-[7px] text-slate-400 uppercase tracking-widest">Verify authenticity via QR Code</p>
      </div>
      
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-600/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-2 right-2 opacity-10 flex flex-col items-end">
         <span className="text-[8px] font-black italic tracking-tighter">OZOLUX</span>
         <span className="text-[6px] font-bold tracking-widest">SAFE SPACE</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('RU');
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleAiConsultant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userText,
        config: {
          systemInstruction: `You are Igor, Ozolux AI Engineer. CURRENT LANGUAGE: ${lang}. 
          Respond ONLY in ${lang}. Help clients calculate sterilization time (standard is 60 min). 
          Ozonation kills mold, viruses and odors. Prices start from 3500 THB. 
          Focus on "Invisible Clean" and "Asset Protection". Professional and concise tone.`,
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Error processing request." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Service temporarily unavailable. Please use WhatsApp." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderHome = () => (
    <>
      <header className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-50">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10"></div>
           <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt="Luxury Villa by the Sea" />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-blue-500/30">
              {t.heroTag}
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              {t.heroTitle.split(' — ')[0]} — <br/><span className="gradient-text">{t.heroTitle.split(' — ')[1]}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              {t.heroSub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition shadow-lg shadow-blue-500/20">
                {t.heroCTA1}
              </button>
              <button onClick={() => setCurrentPage('SERVICES')} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 px-8 py-4 rounded-xl text-lg font-bold transition">
                {t.heroCTA2}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-slate-800 text-center md:text-left">{t.trustBar}</h3>
            <div className="flex gap-4 items-center justify-center md:justify-start opacity-50 grayscale">
               <i className="fa-solid fa-hotel text-2xl"></i>
               <i className="fa-solid fa-building text-2xl"></i>
               <i className="fa-solid fa-city text-2xl"></i>
            </div>
          </div>
          <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-center">
            <div className="text-2xl font-black text-blue-600">1,200+</div>
            <div className="text-xs text-blue-400 font-bold uppercase tracking-tighter">{t.trustCounter}</div>
          </div>
        </div>
      </section>

      {/* Why Section with Slider */}
      <section id="about" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border group cursor-ew-resize select-none bg-slate-200">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover brightness-[0.7] contrast-[1.2] sepia-[0.3] blur-[2px]" alt="Dirty Interior" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-orange-900/20 to-slate-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pollen.png')] opacity-60 scale-150"></div>
                <div className="absolute inset-0 opacity-40 animate-pulse pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ef4444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>

              <div className="absolute inset-0 z-10" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover brightness-[1.1] contrast-[0.95]" alt="Clean Interior" />
                <div className="absolute inset-0 bg-blue-400/10 pointer-events-none"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-3 py-1 rounded-full text-[12px] font-black shadow-lg uppercase tracking-wider z-30">После: Стерильный воздух</div>
              </div>

              <div className="absolute inset-0 z-20 pointer-events-none" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
                <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-[12px] font-black shadow-lg uppercase tracking-wider">До: Скрытые угрозы</div>
              </div>

              <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-40" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl border-4 border-blue-600/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-arrows-left-right text-sm"></i>
                </div>
              </div>
              <input 
                type="range" min="0" max="100" value={sliderPos} 
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize z-50"
              />
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-black text-2xl mb-2 text-slate-800">{t.threatTitle}</h4>
              <p className="text-slate-500 font-medium">{t.threatSub}</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{t.whyTitle}</h2>
            <div className="space-y-6 text-lg text-slate-600">
              <p>{t.whyText}</p>
              <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-sm font-bold text-slate-900 italic text-sm md:text-base">{t.assetProtection}</div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {t.threats.map((threat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs"><i className="fa-solid fa-check"></i></div>
                    <span className="font-bold text-sm">{threat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Myth Busting Section */}
      <section className="py-24 bg-white text-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-slate-50 rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
                <i className="fa-solid fa-triangle-exclamation"></i> Myth Busting
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                {t.mythTitle}
              </h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                {t.mythText}
              </p>
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl shrink-0 shadow-lg shadow-blue-500/20">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <p className="font-bold text-slate-900 text-lg">
                  {t.mythConclusion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Layer Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200 text-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{t.trustLayerTitle}</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.trustLayerItems.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 leading-snug">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-24 bg-white text-slate-900 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{t.locationsTitle}</h2>
            <p className="text-slate-500 font-medium">{t.locationsSub}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             {t.locationList.map((loc, i) => (
               <div key={i} className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-default shadow-sm">
                 <i className="fa-solid fa-location-dot mr-2 text-blue-500 opacity-50"></i> {loc}
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Partner Focus Section on Home Page */}
      <section className="py-24 bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div>
                  <div className="inline-block bg-blue-600 text-[10px] font-black px-4 py-1 rounded-full mb-6 uppercase tracking-[0.2em] text-white">B2B FOCUS</div>
                  <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">{t.partnersTitle}</h2>
                  <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                    {t.partnersSub}
                  </p>
                  <button onClick={() => setCurrentPage('PARTNERS')} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-lg font-bold transition shadow-2xl shadow-blue-500/20 w-fit">
                    {t.partnersCTA}
                  </button>
              </div>
              <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-white/10 backdrop-blur">
                  <h3 className="text-xl font-bold mb-4 text-white">{t.partnerHeaderTitle}</h3>
                  <ul className="space-y-4">
                    {t.partnerBenefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-4 text-slate-300">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 shrink-0">
                          <i className="fa-solid fa-check text-xs"></i>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{b.title}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-black">{b.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
              </div>
            </div>
            <div className="relative flex flex-col items-center">
               <div className="absolute -inset-20 bg-blue-600/10 blur-[120px] rounded-full"></div>
               <div className="relative w-full transform lg:-rotate-3 hover:rotate-0 transition-transform duration-500">
                  <PurityCertificate />
               </div>
               <div className="mt-8 text-center text-slate-500 text-sm font-bold uppercase tracking-widest">
                  {t.certExampleLabel}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white text-center text-slate-900">
        <h2 className="text-4xl font-black mb-4">{t.serviceTitle}</h2>
        <p className="text-slate-500 mb-16">{t.serviceSub}</p>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-left">
          {SERVICES[lang].map((s, idx) => (
            <div key={idx} className="group bg-slate-50 rounded-3xl overflow-hidden border transition hover:shadow-2xl flex flex-col">
              <img src={s.image} className="h-64 object-cover" alt={s.title} />
              <div className="p-8">
                <div className="text-blue-600 font-bold text-xs uppercase mb-2">{s.subtitle}</div>
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-slate-600 mb-6">{s.description}</p>
                <button onClick={() => setCurrentPage('SERVICES')} className="w-full bg-white border py-3 rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition">{t.serviceMore}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works Detailed */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.howTitle}</h2>
            <p className="text-slate-400">{t.howSub}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-blue-500/20 z-0"></div>
            {t.steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-blue-500 transition-all duration-500 shadow-2xl group-hover:scale-110">
                   <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl">
                     <i className={`fa-solid ${['fa-chart-line', 'fa-wind', 'fa-leaf', 'fa-award'][i]}`}></i>
                   </div>
                   <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 rounded-full border border-white/10 flex items-center justify-center font-black text-blue-500">{i+1}</div>
                </div>
                <h4 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition">{step.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-slate-50 text-slate-900 border-t">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black mb-8">{t.finalCTATitle}</h2>
               <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                 {t.finalCTASub}
               </p>
               <button className="bg-white text-blue-600 px-12 py-5 rounded-2xl text-xl font-black hover:scale-105 transition shadow-2xl animate-pulse">
                 {t.finalCTAButton} <i className="fa-brands fa-whatsapp ml-2"></i>
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white text-slate-900">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-black mb-4 tracking-tight">{t.faqTitle}</h2>
           </div>
           <div className="space-y-4">
              {t.faqItems.map((item, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition"
                  >
                    <span className="font-bold text-lg text-slate-800">{item.question}</span>
                    <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}></i>
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed animate-fadeIn">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>
      </section>
    </>
  );

  const renderServices = () => (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen text-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4">{t.serviceTitle}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t.serviceSub}</p>
        </div>
        <div className="grid gap-12 mb-24">
          {SERVICES[lang].map((s, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border flex flex-col lg:flex-row transition hover:border-blue-200">
              <div className="lg:w-1/2 h-[300px] lg:h-auto overflow-hidden">
                <img src={s.image} className="w-full h-full object-cover" alt={s.title} />
              </div>
              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">{s.subtitle}</div>
                <h2 className="text-3xl md:text-4xl font-black mb-6">{s.title}</h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">{s.description}</p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-fit">{t.bookNow}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPartners = () => (
    <div className="pt-32 pb-24 bg-slate-900 min-h-screen text-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="flex flex-col gap-8">
            <div>
                <div className="inline-block bg-blue-600 text-[10px] font-black px-4 py-1 rounded-full mb-6 uppercase tracking-[0.2em]">B2B PROGRAM</div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{t.partnersTitle}</h1>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">{t.partnersSub}</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-lg font-bold transition shadow-2xl shadow-blue-500/20 w-fit">{t.partnersCTA}</button>
            </div>
            <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-white/10 backdrop-blur">
                <h3 className="text-xl font-bold mb-4">{t.certTitle}</h3>
                <p className="text-sm text-slate-400 mb-6">{t.certSub}</p>
                <ul className="grid grid-cols-2 gap-4">
                    <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-qrcode text-blue-500"></i> QR-верификация</li>
                    <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-earth-asia text-blue-500"></i> На 3 языках</li>
                    <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-mobile-screen text-blue-500"></i> Цифровой формат</li>
                    <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-shield-virus text-blue-500"></i> Asset Protection</li>
                </ul>
            </div>
          </div>
          <div className="relative group flex flex-col items-center gap-12">
             <div className="absolute -inset-10 bg-blue-600/10 blur-[120px] rounded-full"></div>
             
             <div className="relative w-full bg-slate-800/60 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] border border-white/20 shadow-2xl ring-1 ring-white/10 transition-all hover:bg-slate-800/80">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="text-5xl font-black text-blue-500 mb-2">12%</div>
                        <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Increase in rental speed</div>
                    </div>
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
                        <i className="fa-solid fa-chart-line text-3xl"></i>
                    </div>
                </div>
                
                <div className="space-y-6">
                  {t.partnerBenefits.map((b, i) => (
                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default group/item">
                      <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center text-blue-400 shrink-0 group-hover/item:scale-110 transition-transform"><i className="fa-solid fa-check"></i></div>
                      <div>
                        <div className="font-bold text-lg text-white mb-1 group-hover/item:text-blue-400 transition-colors">{b.title}</div>
                        <div className="text-sm text-slate-400 leading-relaxed">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-slate-900">
      <div className="fixed top-0 left-0 h-1 bg-blue-600 z-[100] transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect bg-white/70 shadow-sm px-6 py-4 flex justify-between items-center transition-all">
        <button onClick={() => setCurrentPage('HOME')}>
          <Logo />
        </button>
        <div className="hidden lg:flex gap-10 font-bold text-slate-500">
          <button onClick={() => setCurrentPage('HOME')} className={`hover:text-blue-600 transition ${currentPage === 'HOME' ? 'text-blue-600 underline decoration-2 underline-offset-8' : ''}`}>{t.navAbout}</button>
          <button onClick={() => setCurrentPage('SERVICES')} className={`hover:text-blue-600 transition ${currentPage === 'SERVICES' ? 'text-blue-600 underline decoration-2 underline-offset-8' : ''}`}>{t.navServices}</button>
          <button onClick={() => setCurrentPage('PARTNERS')} className={`hover:text-blue-600 transition ${currentPage === 'PARTNERS' ? 'text-blue-600 underline decoration-2 underline-offset-8' : ''}`}>{t.navPartners}</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['RU', 'EN', 'TH'] as Language[]).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-lg text-xs font-black transition ${lang === l ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>{l}</button>
            ))}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold transition shadow-lg shadow-blue-500/10 text-sm hidden md:block">{t.auditBtn}</button>
        </div>
      </nav>
      <main>
        {currentPage === 'HOME' && renderHome()}
        {currentPage === 'SERVICES' && renderServices()}
        {currentPage === 'PARTNERS' && renderPartners()}
      </main>

      <footer className="bg-slate-50 border-t pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 text-slate-900">
              <Logo />
              <p className="mt-6 text-slate-500 max-w-sm">
                Ozolux — стандарт воздушной безопасности на Пхукете с 2026 года. Мы защищаем ваше здоровье и активы с помощью передовых молекулярных технологий.
              </p>
              <div className="flex gap-4 mt-8">
                <a href="#" className="w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:bg-blue-600 hover:text-white transition text-slate-600"><i className="fa-brands fa-whatsapp"></i></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:bg-blue-600 hover:text-white transition text-slate-600"><i className="fa-brands fa-telegram"></i></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:bg-blue-600 hover:text-white transition text-slate-600"><i className="fa-brands fa-line"></i></a>
              </div>
            </div>
            <div className="text-slate-900">
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Меню</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><button onClick={() => setCurrentPage('HOME')} className="hover:text-blue-600">{t.navAbout}</button></li>
                <li><button onClick={() => setCurrentPage('SERVICES')} className="hover:text-blue-600">{t.navServices}</button></li>
                <li><button onClick={() => setCurrentPage('PARTNERS')} className="hover:text-blue-600">{t.navPartners}</button></li>
              </ul>
            </div>
            <div className="text-slate-900">
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Контакты</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li>Phuket, Rawai / Bang Tao</li>
                <li>+66 (0) 9X-XXX-XXXX</li>
                <li>ozolux.safe@gmail.com</li>
              </ul>
              <button className="mt-6 text-blue-600 font-bold text-sm border-b-2 border-blue-600 pb-1">{t.footerCTA}</button>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span>© 2026 Ozolux Air Safety Standard</span>
            <div className="flex gap-6">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <div className={`fixed bottom-6 right-6 z-[200] flex flex-col items-end transition-all ${isChatOpen ? 'scale-100' : 'scale-90'}`}>
        {isChatOpen && (
          <div className="w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border flex flex-col mb-4 overflow-hidden">
            <div className="bg-blue-600 p-6 text-white flex items-center gap-3">
              <i className="fa-solid fa-robot text-2xl"></i>
              <div><h4 className="font-bold">{t.aiName}</h4><p className="text-xs opacity-80">{t.aiSub}</p></div>
              <button onClick={() => setIsChatOpen(false)} className="ml-auto opacity-70 hover:opacity-100"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.length === 0 && <div className="text-slate-400 text-center mt-10 p-6 italic text-sm">"Здравствуйте! Я Игорь. Напишите площадь вашей виллы, и я рассчитаю время озонации."</div>}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'}`}>{m.text}</div>
                </div>
              ))}
              {isTyping && <div className="text-slate-400 text-xs animate-pulse p-4">Typing...</div>}
            </div>
            <form onSubmit={handleAiConsultant} className="p-4 bg-white border-t flex gap-2">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={t.aiPlaceholder} className="flex-grow bg-slate-100 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="bg-blue-600 text-white w-10 h-10 rounded-xl shadow-lg flex items-center justify-center"><i className="fa-solid fa-paper-plane"></i></button>
            </form>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl border-4 border-white active:scale-90 transition">
          {isChatOpen ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-headset"></i>}
        </button>
      </div>
    </div>
  );
};

export default App;
