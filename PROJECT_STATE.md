# PROJECT_STATE — vplus

## סטטוס כללי
פרויקט חדש, בבנייה מאפס. הריפו `vplus` עדיין ריק (רק `CLAUDE.md`, `README.md`, וקובץ זה). הבנייה תתבסס על הריפו הקיים `ronmailx-boop/shopping-list` (פרטי), שצורף לסשן ושוכפל מקומית ל-`/workspace/shopping-list` לצורך עיון.

## תובנות ראשוניות מ-Shopping-list (מקור ההשראה)
- אפליקציית PWA וניל-JS (ללא build step, אין `package.json` בשורש) עם Firebase Web SDK בצד לקוח.
- מבנה עיקרי: `index.html`, `script.js`, `style.css`, `sw.js`, `manifest.json` — קבצים גדולים מאוד (500K+), כנראה לא מפוצלים למודולים בפועל בשורש.
- יש גם תיקיית `js/` עם פיצול חלקי: `js/core` (constants, firebase-config, store, utils), `js/features` (import-export, notifications), `js/ui` (charts, lists, modals, wizard) — כנראה קוד ישן/חדש יותר או ניסיון מודולריזציה.
- `functions/` — Firebase Cloud Functions (יש לו `package.json` נפרד).
- `firestore.rules`, `.firebaserc`, `firebase.json` — תשתית Firebase Hosting + Firestore.
- יש התחלת תמיכה ב-Push Notifications (`push-notifications.js`, `notification-handler.js`) ו-PWA (ikonים, manifest, `.well-known/assetlinks.json` ל-TWA).

## Current Focus
ממתינים להנחיית המשתמש לגבי הצעד הראשון הקונקרטי בבניית vplus (למשל: הקמת שלד הפרויקט, בחירת סטאק/ארכיטקטורה, או ייבוא/עיבוד רכיב ספציפי מ-Shopping-list). לא בוצע שום שינוי קוד ב-vplus מעבר לקובץ זה.

## משימות
- [x] אימות מצב ריפו vplus (ריק, ברנץ' מעודכן)
- [x] איתור וצירוף ריפו shopping-list כמקור השראה
- [x] יצירת PROJECT_STATE.md
- [ ] קבלת הנחיית המשתמש לצעד הבא בבנייה
