# PROJECT_STATE — vplus

## סטטוס כללי
פרויקט חדש, בבנייה מאפס. הבנייה מתבססת על הריפו הקיים `ronmailx-boop/shopping-list` (פרטי), שצורף לסשן ושוכפל מקומית ל-`/workspace/shopping-list` לצורך עיון.

**החלטה ארכיטקטונית (עודכן):** כרגע האפליקציה נבנית **ללא שרת Firebase** — אין Firestore, אין Auth, אין Cloud Functions. אין עדיין מנגנון חלופי לאחסון נתונים; ייקבע כשיתבקש.

## החלטות היקף (Out of Scope כרגע)
- ללא שרת Firebase (ראה מעלה).
- **ללא כפתור/מודול "פיננסי"** — לא ייבנה חיבור לחשבונות בנק או כרטיסי אשראי ולא שליפת נתונים משם (בניגוד ל-`scripts/bank-sync` שקיים ב-shopping-list). אין להעתיק את הפיצ'ר הזה מהריפו המקורי.
- **ללא שורת כפתורי הפעולות מ-shopping-list**: מיון, תרגום, שיתוף, סיווג מחדש, מדריך, תבנית — כל שורת הכפתורים הזו לא תיכלל ב-vplus.
- **ללא כפתור "הגדרות" וכל מה שבתוכו** — לא ייכלל ב-vplus, כולל כל תת-המסכים/אפשרויות שהיו מתחתיו ב-shopping-list.
- **ללא התראות Push** — לא ייכלל מנגנון push notifications (בניגוד ל-`push-notifications.js` ו-`notification-handler.js` שקיימים ב-shopping-list).
- **ללא התחברות עם חשבון Google** — לא ייכלל Google Sign-In / OAuth (בניגוד ל-`login.html` שקיים ב-shopping-list).

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
│   │   ├── constants.js
│   │   ├── store.js
│   │   └── utils.js     # כולל sanitize() למניעת XSS
│   ├── features/        # ריק, ל-features עתידיים
│   └── ui/               # ריק, לרכיבי UI עתידיים
├── assets/icons/         # ריק, לאייקוני PWA עתידיים
└── docs/legal/           # ריק, למסמכי משפט (privacy-policy וכו' לפי CLAUDE.md)
```
אין `functions/` (Firebase Cloud Functions) ואין תלות ב-Firebase כלל בשלב זה.

## תוכנית בנייה מלאה
המשתמש אישר בנייה מלאה של אפליקציית רשימת קניות, זהה גרפית ותפעולית ל-shopping-list (חוץ מההחרגות למעלה), עם מיזוג ל-main בסיום. תוכנית מפורטת (10 שלבים) נשמרה גם ב-`/root/.claude/plans/frolicking-dreaming-bonbon.md`. הוחלט גם: בלי פאנל התראות פנימי/תזכורות תאריך יעד, בלי סריקת קבלה (OCR).

### התקדמות
- [x] שלב 1: Data layer — `js/core/constants.js` (CATEGORIES, CATEGORY_KEYWORDS ללא פיננסי, detectCategory), `js/core/store.js` (db schema, load/save ל-localStorage, CRUD רשימות/פריטים, history, stats). נבדק ידנית ב-Node.
- [x] שלבים 2-4: מעטפת UI ראשית + CRUD + מודלים — `index.html`/`style.css` (פלטה מ-shopping-list), `js/ui/render.js` (Lists/Summary/Stats + קיבוץ קטגוריות), `js/ui/modals.js` (מודלים גנריים + toast/undo), `js/features/item-crud.js`, `js/features/list-crud.js`. **נבדק end-to-end ב-Playwright**: הוספה/עריכה/מחיקה+undo/toggle של פריט, יצירה/מחיקה/מעבר בין רשימות, טאבים Lists/Summary/Stats, שמירה ב-localStorage בין רענוני דף — הכל עובד בלי שגיאות קונסולה.
- [x] שלב 5: היסטוריה וסטטיסטיקה — `js/features/history.js` (סיום רשימה→היסטוריה, מודל היסטוריה, שחזור/מחיקה), `js/features/stats.js` (גרפים חודשי/קטגוריה/פריטים פופולריים עם Chart.js דרך CDN). נבדק ב-Playwright: סיום רשימה, מודל היסטוריה, שחזור עובדים תקין. **הערה**: Chart.js נטען מ-CDN חיצוני (jsdelivr) — בסביבת הבדיקה הנוכחית (sandbox) ה-CDN חסום ע"י מדיניות הפרוקסי, כך שלא ניתן היה לאמת ויזואלית את הגרפים כאן; הקוד מוגן (`if (window.Chart)`) כך שהאפליקציה לא קורסת בלעדיו. אצל משתמשי קצה אמיתיים (דפדפן רגיל) ה-CDN אמור לעבוד כרגיל.
- [x] שלב 6: Autocomplete/מחירון/חיפוש — `js/features/autocomplete.js` (הצעות אוטומטיות בעת הוספת פריט לפי היסטוריית מחירים, מודל מחירון עם חיפוש/עריכת מחיר/הסתרה), חיפוש בין רשימות ב-Summary. נבדק ב-Playwright — עובד תקין, ללא שגיאות.
- [ ] שלב 7: ייבוא (טקסט/לוח/Excel/קול)
- [ ] שלב 8: גרירה, מצב קומפקטי, תקציב, הדפסה
- [ ] שלב 9: ליטוש PWA
- [ ] שלב 10: QA מקצה לקצה + מיזוג ל-main

## Current Focus
בעיצומה של הבנייה המלאה (ראו התקדמות למעלה). ממשיכים לשלב 7 (ייבוא: טקסט/לוח/Excel/קול).

## משימות
- [x] אימות מצב ריפו vplus (ריק, ברנץ' מעודכן)
- [x] איתור וצירוף ריפו shopping-list כמקור השראה
- [x] יצירת PROJECT_STATE.md
- [x] יצירת שלד פרויקט — מבנה תיקיות בסיסי
- [x] הסרת תלות ב-Firebase מהשלד (החלטה: ללא שרת בשלב זה)
- [x] תיעוד החלטת היקף: ללא מודול פיננסי/חיבור לבנק
- [x] תיעוד החלטת היקף: ללא שורת כפתורי מיון/תרגום/שיתוף/סיווג מחדש/מדריך/תבנית
- [x] תיעוד החלטת היקף: ללא כפתור הגדרות ותוכנו
- [x] תיעוד החלטת היקף: ללא התראות Push
- [x] תיעוד החלטת היקף: ללא התחברות עם חשבון Google
- [ ] קבלת הנחיית המשתמש לצעד הבא בבנייה
