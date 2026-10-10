import React, { useEffect, useState } from 'react';
import { Link2, Copy, Check, Share2, QrCode, Info } from 'lucide-react';
import { sounds } from '../utils/audio';

export const ShareCard: React.FC = () => {
  const [gameUrl, setGameUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isLocalFile, setIsLocalFile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    setGameUrl(url);
    // إذا تم فتح الملف مباشرة من الجهاز (file://) فلن يعمل الرابط على أجهزة أخرى
    setIsLocalFile(window.location.protocol === 'file:');
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl);
    } catch {
      // طريقة بديلة للمتصفحات القديمة
      const temp = document.createElement('textarea');
      temp.value = gameUrl;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    setCopied(true);
    sounds.playCorrect();
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNativeShare = async () => {
    sounds.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🌸 مملكة الرياضيات 🌸',
          text: 'لعبة الرياضيات للصف السادس - إعداد المعلمة: أ. فداء التميمي 🌸👑',
          url: gameUrl,
        });
      } catch {
        /* أُلغيت المشاركة */
      }
    } else {
      handleCopy();
    }
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(gameUrl)}`;

  return (
    <div className="bg-gradient-to-l from-emerald-50 via-teal-50/60 to-cyan-50 rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm">
      <div className="flex items-start gap-3 text-right">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
          <Share2 className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-black text-emerald-900 text-base sm:text-lg">
              🔗 رابط اللعبة للنشر على الطالبات
            </h3>
            <p className="text-[11px] sm:text-xs font-bold text-emerald-700 mt-0.5">
              انسخي الرابط وأرسليه عبر واتساب أو تطبيق المدرسة، أو اعرضي رمز QR لتسحبه الطالبات بأجهزتهن.
            </p>
          </div>

          {/* عرض الرابط */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-3 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <code
              dir="ltr"
              className="flex-1 text-[11px] sm:text-xs font-bold text-slate-700 truncate text-left"
            >
              {gameUrl || '...'}
            </code>
          </div>

          {/* أزرار النشر */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ بنجاح ✓' : 'نسخ الرابط'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm border-2 border-emerald-200 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowQr((v) => !v);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm border-2 border-emerald-200 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{showQr ? 'إخفاء رمز QR' : 'رمز QR للطالبات'}</span>
            </button>
          </div>

          {/* رمز QR */}
          {showQr && (
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 flex flex-col items-center gap-2 animate-fadeIn">
              {isLocalFile ? (
                <p className="text-xs font-bold text-rose-600 text-center">
                  لا يمكن إنشاء رمز QR لأن الملف مفتوح من جهازك مباشرة. ارفعي اللعبة على استضافة أولًا.
                </p>
              ) : (
                <>
                  <img
                    src={qrSrc}
                    alt="رمز QR للعبة مملكة الرياضيات"
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl border-2 border-emerald-100"
                  />
                  <p className="text-[11px] font-bold text-emerald-800 text-center">
                    📱 توجّهي الطالبات لمسح الرمز بكاميرا الجوال أو الآيباد للدخول مباشرة
                  </p>
                </>
              )}
            </div>
          )}

          {/* تنبيه مهم حول حفظ البيانات */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs font-bold text-amber-900 leading-relaxed">
              <span className="font-black">تنبيه مهم: </span>
              النتائج تُحفظ في ذاكرة الجهاز الذي تُلعب عليه اللعبة. لكي تظهر لكِ نتائج جميع الطالبات
              من جهازكِ، يجب رفع اللعبة على استضافة تربطها بقاعدة بيانات سحابية موحّدة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
