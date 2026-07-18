# سيرفر توليد صور الأدعية (مجاني بالكامل)

## شنو هذا؟
سيرفر بسيط يستقبل نص الدعاء (4 أسطر) ويرجعلك صورة PNG جاهزة 1080x1080 مبنية على نفس تصميم القالب، بدون أي اشتراك أو تكلفة.

## طريقة النشر المجاني على Render.com

1. سوي حساب مجاني على https://render.com (تقدر تسجل دخول بحساب GitHub مباشرة)
2. ارفع هذا المجلد كـ repository جديد على GitHub
3. بـ Render، اختر **New > Web Service**
4. اربطه بالـ repository اللي رفعتها
5. الإعدادات:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
6. اضغط Create Web Service وانتظر لين يخلص النشر (2-3 دقائق)
7. راح تحصل رابط شبيه بـ: `https://dua-image-server.onrender.com`

## كيف تربطه بـ n8n

بنود **HTTP Request** حط:

- **Method:** POST
- **URL:** `https://your-app-name.onrender.com/generate`
- **Body Content Type:** JSON
- **Body:**
```json
{
  "line1": "{{ $json.dua_line_1 }}",
  "line2": "{{ $json.dua_line_2 }}",
  "line3": "{{ $json.dua_line_3 }}",
  "line4": "{{ $json.dua_line_4 }}"
}
```
- **Response Format:** File (binary) — مهم جداً تحدد هذا الخيار عشان يستقبل الصورة مباشرة

بعدها وصل نفس الخرج (output) مباشرة لنود **Publish (Instagram)** لأن الرد يكون صورة PNG جاهزة، مو رابط JSON، فما تحتاج خطوة استخراج href زي RenderForm.

## ملاحظة مهمة
خطة Render المجانية "تنام" إذا ما فيها طلبات لمدة، وأول طلب بعد فترة راحة ياخذ حوالي 20-30 ثانية إضافية لين يصحى السيرفر. هذا طبيعي وما يأثر على النتيجة، بس لو حاب تتجنبه فيه خدمات مجانية تسوي "ping" دوري (مثل UptimeRobot) تخلي السيرفر صاحي دائماً.
