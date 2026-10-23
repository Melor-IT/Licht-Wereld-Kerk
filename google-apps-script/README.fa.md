# ارسال فرم تماس با Google Apps Script

فرم سایت → `/api/contact` روی سرور سایت → Google Apps Script → `lichtwereldkerk2022@gmail.com`

## ۱. ساخت اسکریپت

با حساب گوگلی که می‌خواهید ارسال‌کننده باشد وارد [Google Apps Script](https://script.google.com/) شوید و یک پروژهٔ جدید بسازید. اگر با حساب کلیسا وارد شوید، پیام‌ها از همان حساب ارسال می‌شوند. تمام محتوای فایل `Code.gs` این پوشه را در فایل `Code.gs` پروژه کپی کنید.

در صورت تنظیم دستی فایل manifest، از Project Settings گزینهٔ نمایش `appsscript.json` را فعال و محتوای فایل هم‌نام این پوشه را جایگزین کنید. این اسکریپت فقط مجوز ارسال ایمیل را می‌خواهد.

## ۲. تنظیم کلید اتصال

یک کلید تصادفی با دستور زیر بسازید:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

در Apps Script، وارد **Project Settings → Script properties → Add script property** شوید. نام ویژگی را `CONTACT_APPS_SCRIPT_SECRET` و مقدار آن را کلید تولیدشده قرار دهید. همین مقدار در محیط سرور سایت هم تنظیم می‌شود؛ در فایل‌های عمومی یا متغیرهای `NEXT_PUBLIC_` قرار نمی‌گیرد.

## ۳. انتشار به‌صورت Web app

از **Deploy → New deployment** نوع **Web app** را انتخاب کنید:

- **Execute as:** Me
- **Who has access:** Anyone، با امکان دسترسی بدون ورود به گوگل

روی **Deploy** بزنید و مجوز ارسال ایمیل را برای حساب خود تأیید کنید. نشانی **Web app URL** را بردارید؛ باید شکل زیر و پسوند `/exec` داشته باشد:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

نشانی آزمایشی با پسوند `/dev` برای سایت مناسب نیست. باز کردن نشانی در مرورگر فقط پاسخ `method-not-allowed` می‌دهد، چون ارسال فرم با درخواست POST انجام می‌شود. اجرای دستی `doPost` در ویرایشگر نیز پیام نمی‌فرستد؛ آن تابع داده‌های درخواست سایت را لازم دارد.

## ۴. اتصال سایت

این دو متغیر را در تنظیمات محیط سرور یا برای اجرای محلی در `.env.local` قرار دهید:

```dotenv
CONTACT_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
CONTACT_APPS_SCRIPT_SECRET=YOUR_RANDOM_SECRET
```

کلید دقیقاً باید با Script property مرحلهٔ دوم یکسان باشد و حداقل ۳۲ نویسه داشته باشد. سپس سایت را دوباره build و deploy کنید. فرم تماس به `EMAIL_USER`، `EMAIL_PASS` یا فعال‌بودن ثبت‌نام رویدادها نیاز ندارد.

## ۵. بررسی اتصال

پس از انتشار و تنظیم متغیرها، از صفحهٔ «ارتباط با ما» یک پیام آزمایشی ارسال کنید و صندوق کلیسا را بررسی کنید. پیام موفقیت فقط پس از تأیید ارسال از طرف اسکریپت نمایش داده می‌شود. پاسخ‌دادن به ایمیل، پاسخ را به نشانی بازدیدکننده می‌فرستد.

اگر کد Apps Script را تغییر دادید، از **Deploy → Manage deployments → Edit → New version** نسخهٔ تازه را منتشر کنید. اگر نشانی `/exec` عوض شد، متغیر نشانی را در سرور هم به‌روز کنید.

گیرنده در `Code.gs` ثابت است. اگر ایمیل کلیسا تغییر کرد، علاوه بر آن، `src/data/contact.js` سایت را هم به‌روز کنید. سهمیهٔ ارسال روزانهٔ گوگل بررسی می‌شود و پایان سهمیه یا خطای اتصال، پیام موفقیت کاذب تولید نمی‌کند. اتصال سرور ۲۰ ثانیه مهلت دارد و خودکار تکرار نمی‌شود تا در پاسخ‌های نامطمئن ایمیل تکراری نفرستد.

راهنمای رسمی: [Web apps](https://developers.google.com/apps-script/guides/web)، [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app)، [Script properties](https://developers.google.com/apps-script/guides/properties)، [Content service و هدایت پاسخ‌ها](https://developers.google.com/apps-script/guides/content).
