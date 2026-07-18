# تحديث السيرفر: يرجع رابط (URL) بدل صورة مباشرة

## المشكلة
انستقرام API يرفض استلام صورة كـ binary مباشرة، ويشترط رابط عام (public URL) يقدر يفتحه بنفسه.

## الحل: Vercel Blob (تخزين ملفات مجاني مدمج بحساب Vercel)

### 1. فعّل Blob Storage بمشروعك
- ادخل على مشروعك بلوحة تحكم Vercel
- من التبويبات فوق اختر **Storage**
- اضغط **Create Database** → اختر **Blob**
- سمّيه أي اسم وأنشئه (مجاني بالكامل ضمن حدود سخية جداً للاستخدام الشخصي)

### 2. اربط متغير البيئة تلقائياً
لما تنشئ الـ Blob store، Vercel يضيف تلقائياً متغير اسمه:
```
BLOB_READ_WRITE_TOKEN
```
لمشروعك — ما تحتاج تسوي شي يدوي، بس تأكد إنه ظاهر بـ Settings → Environment Variables.

### 3. استبدل ملف `api/generate.js`
حط بدله الملف الجديد المرفق (استعمل `@sparticuz/chromium` + `puppeteer-core` بدل `puppeteer` العادي، لأنه أخف ويشتغل صح جوا Vercel serverless).

### 4. حدّث package.json
انسخ المحتوى من `package-vercel.json` المرفق داخل ملف `package.json` الأساسي بمشروعك (أو ادمج الحزم الثلاث بالـ dependencies الموجودة).

### 5. انشر التحديث (Deploy)
```
git add .
git commit -m "return public url via vercel blob"
git push
```
Vercel راح يعيد النشر تلقائياً.

---

## الرد الجديد من السيرفر
بدل ما يرجع صورة binary، الحين يرجع JSON بسيط:
```json
{
  "url": "https://xxxxx.public.blob.vercel-storage.com/dua-1234567890.png"
}
```

## تحديث نود HTTP Request بـ n8n
- **Response Format:** رجّعه لـ **JSON** (مو File/binary مثل قبل)
- بنود **Publish (Instagram)**: بحقل رابط الصورة (image_url) حط:
```
{{ $json.url }}
```

كذا انستقرام يستلم رابط حقيقي دائم يقدر يفتحه، وتنحل المشكلة نهائياً.
