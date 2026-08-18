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

## מבנה התיקיות שנוצר (שלד ראשוני)
```
vplus/
├── index.html          # דף כניסה, RTL, טוען js/app.js כמודול
├── style.css
├── manifest.json       # PWA manifest (עברית, RTL)
├── sw.js               # Service Worker בסיסי (install/activate)
├── .gitignore
├── js/
│   ├── app.js          # נקודת כניסה
│   ├── core/
│   │   ├── firebase-config.js  # placeholder — ללא ערכים אמיתיים עדיין
│   │   ├── constants.js
│   │   ├── store.js
│   │   └── utils.js     # כולל sanitize() למניעת XSS
│   ├── features/        # ריק, ל-features עתידיים
│   └── ui/               # ריק, לרכיבי UI עתידיים
├── assets/icons/         # ריק, לאייקוני PWA עתידיים
└── docs/legal/           # ריק, למסמכי משפט (privacy-policy וכו' לפי CLAUDE.md)
```
אין עדיין `functions/` (Firebase Cloud Functions) — ייווצר כשיידרש backend בפועל.

## Current Focus
שלד הפרויקט הבסיסי נוצר. ממתינים להנחיית המשתמש לצעד הבא (למשל: הגדרת פרויקט Firebase אמיתי, מסך התחברות/login, או מבנה הנתונים הראשי).

## משימות
- [x] אימות מצב ריפו vplus (ריק, ברנץ' מעודכן)
- [x] איתור וצירוף ריפו shopping-list כמקור השראה
- [x] יצירת PROJECT_STATE.md
- [x] יצירת שלד פרויקט — מבנה תיקיות בסיסי
- [ ] קבלת הנחיית המשתמש לצעד הבא בבנייה
