
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ServiceCard, FAQItem } from './types';

// Constants
const SERVICES: ServiceCard[] = [
  {
    title: "Для Жизни",
    subtitle: "Villas & Condos",
    description: "Защита вашей семьи и детей. Создаем среду, где дышится легко. Удаляем аллергены и плесень.",
    icon: "fa-house-chimney-window",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Для Бизнеса",
    subtitle: "Managers & Airbnb",
    description: "Мгновенный чекин. Удаляем запах табака и сырости за 1 час. Гарантия 5⭐️ отзывов от гостей.",
    icon: "fa-briefcase",
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Для Транспорта",
    subtitle: "Auto & Marine",
    description: "Свежесть новой яхты или авто. Удаляем запахи солярки, еды и влаги из обивки и систем вентиляции.",
    icon: "fa-ship",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80"
  }
];

const FAQ: FAQItem[] = [
  {
    question: "Безопасно ли это для электроники?",
    answer: "Да, абсолютно. Мы используем высокоточные концентрации озона и соблюдаем строгий технологический регламент. В отличие от влажной уборки, молекулярная очистка не воздействует на микросхемы."
  },
  {
    question: "Нужно ли уезжать из дома?",
    answer: "Да, на время активной фазы процедуры (60 мин) и 15 минут после неё людям, животным и живым растениям находиться в помещении нельзя. Это стандарт безопасности Ozolux."
  },
  {
    question: "Поможет ли от запаха «старой мебели»?",
    answer: "Это наше любимое задание. Озон проникает в поры материалов на глубину до 5мм, разрушая саму причину запаха (бактерии и споры грибка), а не просто маскируя его."
  }
];

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          systemInstruction: `Вы — AI-инженер Ozolux. Вы помогаете клиентам на Пхукете рассчитать время и стоимость обработки виллы. 
          Наш стандарт: 60 минут на стерилизацию. Озонирование убивает плесень, вирусы и запахи.
          Отвечайте профессионально, вежливо и лаконично. Акцентируйте внимание на "Invisible Clean" и "Asset Protection".
          Если спрашивают цену — скажите, что она зависит от площади, но в среднем от 3500 THB.`,
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Извините, произошла ошибка. Пожалуйста, попробуйте позже." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Связь с базой данных Ozolux временно прервана. Пожалуйста, напишите нам в WhatsApp!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-blue-600 z-[100] transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect bg-white/70 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">O</div>
          <span className="text-2xl font-black tracking-tighter text-slate-800">OZOLUX</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition">О технологии</a>
          <a href="#services" className="hover:text-blue-600 transition">Услуги</a>
          <a href="#partners" className="hover:text-blue-600 transition">Партнерам</a>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold transition shadow-lg shadow-blue-200 text-sm md:text-base">
          Бесплатный аудит
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10"></div>
           <img 
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover animate-pulse" 
            alt="Phuket Luxury Villa"
           />
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-blue-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Standard 2026: Молекулярная стерилизация
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Ваша вилла — зона <br/><span className="gradient-text">абсолютной чистоты</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Профессиональная молекулярная стерилизация воздуха и поверхностей за 60 минут. Удаляем невидимую плесень, вирусы и запахи там, где бессилен обычный клининг.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-xl shadow-blue-500/20">
                Рассчитать стоимость по WhatsApp
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 px-8 py-4 rounded-xl text-lg font-bold transition">
                Бесплатный аудит воздуха
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-1">Проверенное качество</p>
              <h3 className="text-xl font-bold text-slate-800">Объекты под защитой Ozolux Air Safety Standard</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60">
              <div className="flex items-center gap-2 font-bold text-lg"><i className="fa-solid fa-hotel"></i> Laguna</div>
              <div className="flex items-center gap-2 font-bold text-lg"><i className="fa-solid fa-house-user"></i> CBRE</div>
              <div className="flex items-center gap-2 font-bold text-lg"><i className="fa-solid fa-building"></i> Knight Frank</div>
            </div>
            <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-center">
              <div className="text-2xl font-black text-blue-600">1,200+</div>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-tighter">Стерильных вилл</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden Threat Section */}
      <section id="about" className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-white p-4 rounded-3xl shadow-2xl border">
                <div className="relative aspect-video rounded-2xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" 
                    className="w-full h-full object-cover" 
                    alt="Мастер измеряет качество воздуха на вилле" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent flex flex-col items-start justify-end p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-lg">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                       </div>
                       <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-red-200">Текущий уровень</p>
                          <p className="text-2xl font-black">CRITICAL: RED ZONE</p>
                       </div>
                    </div>
                    <p className="text-sm font-medium opacity-90">Замер воздуха в спальне: обнаружена критическая концентрация спор плесени и летучих токсинов.</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-red-600 text-xs font-black shadow-md border border-red-100">
                    AIR AUDIT: 84% POLLUTED
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-slate-900">Почему «просто чисто» — <br/>недостаточно на Пхукете?</h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>Влажность 80%+ превращает кондиционеры и скрытые полости в инкубаторы плесени. Вы не видите спор в воздухе, но ваш организм их чувствует через аллергии, кашель и усталость.</p>
                <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-sm">
                  <p className="font-bold text-slate-900 italic">"Asset Protection": Озонация — это способ сэкономить миллионы бат на будущем ремонте и замене мебели, съеденной грибком.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><i className="fa-solid fa-virus"></i></div>
                    <span className="font-bold text-sm">Плесень</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><i className="fa-solid fa-bacteria"></i></div>
                    <span className="font-bold text-sm">Вирусы</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><i className="fa-solid fa-poo-storm"></i></div>
                    <span className="font-bold text-sm">Запахи</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><i className="fa-solid fa-wind"></i></div>
                    <span className="font-bold text-sm">VOC-газы</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Сегментированные решения</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Гипер-персонализация для любых типов активов на острове Пхукет.</p>
        </div>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {SERVICES.map((s, idx) => (
            <div key={idx} className="group bg-slate-50 rounded-3xl overflow-hidden border transition hover:shadow-2xl hover:-translate-y-2 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img src={s.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={s.title} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-blue-600 font-bold shadow-sm flex items-center gap-2">
                   <i className={`fa-solid ${s.icon}`}></i> {s.subtitle}
                </div>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{s.description}</p>
                <button className="w-full bg-white border border-slate-200 py-3 rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition">
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section with Certificate Preview */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black mb-6">Как это работает?</h2>
             <p className="text-slate-400">Научный подход к невидимой чистоте.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-12 relative mb-20">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500/20 hidden md:block -translate-y-1/2"></div>
            {[
              { title: "Smart Audit", desc: "Измеряем уровень летучих органических соединений и влажности.", icon: "fa-magnifying-glass-chart" },
              { title: "Molecular Attack", desc: "Насыщаем помещение озоном, разрушающим оболочки бактерий.", icon: "fa-atom" },
              { title: "Oxygen Transform", desc: "Озон распадается в чистый кислород. Никакой «химии».", icon: "fa-leaf" },
              { title: "Certification", desc: "Вы получаете цифровой паспорт чистоты объекта.", icon: "fa-certificate" }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl shadow-blue-500/30 group-hover:scale-110 transition">
                  <i className={`fa-solid ${step.icon}`}></i>
                </div>
                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Certificate Visualization Section */}
          <div className="flex justify-center">
            <div className="relative group max-w-2xl w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white text-slate-900 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden">
                {/* Certificate Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full -ml-16 -mb-16"></div>
                
                {/* Certificate Header */}
                <div className="flex justify-between items-start mb-10 relative">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm">O</div>
                       <span className="text-xl font-black tracking-tighter">OZOLUX</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Air Safety Passport</h5>
                  </div>
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white border-8 border-blue-50 shadow-inner">
                    <i className="fa-solid fa-shield-check text-3xl"></i>
                  </div>
                </div>

                {/* Certificate Content */}
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-black mb-2">CERTIFICATE OF PURITY</h3>
                  <p className="text-slate-500 italic">Настоящим подтверждается, что данный объект прошел полную молекулярную стерилизацию</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10 border-y border-slate-100 py-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset Address</p>
                    <p className="font-bold text-sm">Villa 42, Laguna Phuket</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Safety Standard</p>
                    <p className="font-bold text-sm text-blue-600">O3 MOLECULAR CLEAN</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                    <p className="font-bold text-sm">24 Oct 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Air Quality Index</p>
                    <p className="font-bold text-sm text-teal-500">EXCELLENT (99.9%)</p>
                  </div>
                </div>

                {/* Certificate Footer */}
                <div className="flex justify-between items-end">
                   <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <i className="fa-solid fa-qrcode text-xl"></i>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">Отсканируйте для<br/>проверки статуса онлайн</p>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-serif italic mb-1">Ozolux Engineering Dept.</div>
                      <div className="h-0.5 w-32 bg-slate-900 ml-auto"></div>
                      <p className="text-[10px] font-bold mt-1">AUTHORIZED SIGNATURE</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section id="partners" className="py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="bg-blue-700 p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 border border-blue-500 shadow-2xl">
            <div className="md:max-w-xl">
              <h2 className="text-4xl font-black mb-6">Станьте партнером <br/>Ozolux Air Standard</h2>
              <p className="text-xl text-blue-100 mb-8">Повысьте ценность ваших объектов. Виллы с нашим сертификатом сдаются на 12% быстрее и получают более высокие оценки от гостей.</p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-800/30 transition hover:-translate-y-1">
                  Получить партнерский прайс
                </button>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-blue-800/50 p-6 rounded-3xl border border-blue-400/30">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                      <div className="h-4 bg-blue-300/20 rounded-full flex-grow"></div>
                    </div>
                  ))}
                  <div className="h-4 bg-blue-300/20 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-black text-center mb-16">Проверка фактов</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details key={i} className="group bg-white rounded-2xl border p-6 transition-all duration-300 open:shadow-lg">
                <summary className="flex justify-between items-center font-bold text-xl cursor-pointer list-none">
                  {item.question}
                  <i className="fa-solid fa-chevron-down group-open:rotate-180 transition"></i>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed text-lg border-t pt-4">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">O</div>
                <span className="text-2xl font-black tracking-tighter text-slate-800">OZOLUX</span>
              </div>
              <p className="text-slate-500 max-w-md text-lg leading-relaxed">
                Лидер молекулярной очистки воздуха на Пхукете. Мы создаем стандарты безопасности для вашего жилья и бизнеса.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-sm text-slate-400">Контакты</h5>
              <div className="space-y-4 font-bold text-slate-700">
                <a href="#" className="flex items-center gap-3 hover:text-blue-600 transition"><i className="fa-brands fa-whatsapp text-xl"></i> WhatsApp</a>
                <a href="#" className="flex items-center gap-3 hover:text-blue-600 transition"><i className="fa-brands fa-telegram text-xl"></i> Telegram</a>
                <a href="#" className="flex items-center gap-3 hover:text-blue-600 transition"><i className="fa-solid fa-phone"></i> +66 (0) 99 999-9999</a>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-sm text-slate-400">Офис</h5>
              <p className="text-slate-700 leading-relaxed font-bold">
                Mueang Phuket District,<br/> Phuket 83100, Thailand
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t pt-8 gap-4">
            <p className="text-slate-400">© 2026 Ozolux Air Safety Standard. All rights reserved.</p>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition">
              Вызвать эксперта с датчиком
            </button>
          </div>
        </div>
      </footer>

      {/* AI Assistant Widget */}
      <div className={`fixed bottom-6 right-6 z-[200] flex flex-col items-end transition-all duration-500 ${isChatOpen ? 'scale-100' : 'scale-90'}`}>
        {isChatOpen && (
          <div className="w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-blue-600 p-6 text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h4 className="font-bold leading-tight text-lg">AI-инженер Игорь</h4>
                <p className="text-xs text-blue-200">Расчитает время обработки вашей виллы</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="ml-auto hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👋</div>
                  <p className="text-slate-500 font-medium">Привет! Я помогу рассчитать время стерилизации и отвечу на вопросы о технологии Ozolux.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-700 shadow-sm rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border p-3 rounded-2xl flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleAiConsultant} className="p-4 bg-white border-t flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Площадь вашей виллы?" 
                className="flex-grow bg-slate-100 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              />
              <button disabled={isTyping} className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 disabled:opacity-50 transition transform hover:scale-105">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition cursor-pointer border-4 border-white"
        >
          {isChatOpen ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-headset"></i>}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          )}
        </button>
      </div>

    </div>
  );
};

export default App;
