# Mehroz Taj-81 — ID Card (Protected) — Setup Guide

Yeh system aapki ID card file ko license se protect karta hai:
- **1 code = 1 device** (ek code sirf ek device par chalega)
- Server khud **random code** banata hai
- Aap **kabhi bhi** kisi ka code band kar sakte hain
- Aap file update karein to **sabke paas khud update** ho jata hai

Files:
- `index.html` ........ Customer ki ID card file (license-protected)
- `admin.html` ........ Aapka control panel (codes banane/band karne ke liye)
- `netlify/functions/license.js` ... Server ka code
- `netlify.toml`, `package.json` ... Settings (inhe haath na lagayein)

---

## STEP 1 — Netlify account banayein (free, ek dafa)

1. https://netlify.com par jayein → "Sign up" → email/Google se account banayein.

---

## STEP 2 — Site upload karein

Sabse aasaan tareeqa (drag & drop):

1. In saari files ko ek folder mein rakhein (jaise yeh `Taj81_ID_Protected` folder hai — poora).
2. Netlify dashboard par jayein → "Add new site" → "Deploy manually".
3. Poora folder drag karke chhod dein.
4. Netlify aapko ek URL dega, jaise: `https://random-name-1234.netlify.app`
   (Chahein to "Site settings → Change site name" se naam badal sakte hain, jaise `taj81-id`.)

> NOTE: Drag & drop se "Netlify Blobs" (jahan codes save hote hain) khud chalu ho jata hai. Kuch nahi karna.

---

## STEP 3 — Admin password set karein (zaroori!)

1. Netlify dashboard → aapki site → "Site configuration" → "Environment variables".
2. "Add a variable" dabayein:
   - Key:  `TAJ_ADMIN_PASSWORD`
   - Value: jo aap chahein (jaise `MeraSecret@786`)
3. Save. Phir "Deploys" → "Trigger deploy" → "Deploy site" (taake password lag jaye).

> Agar yeh na karein to default password `changeme123` hoga — zaroor badlein.

---

## STEP 4 — Admin panel kholein

1. Browser mein jayein: `https://aapki-site.netlify.app/admin.html`
2. Apna password daal kar Login karein.
3. "Generate New Code" dabayein → ek code milega (jaise `AB7K-9XQ2-MN4P`).
4. Yeh code customer ko dein.

Admin panel mein aap:
- **Naye codes** bana sakte hain
- **Band** (disable) / **Chalu** (enable) kar sakte hain
- **Reset Device** — agar customer ka phone/PC badal gaya to use dobara activate karne dein
- **✕** — code delete

---

## STEP 5 — Customer ko kaise dein

Customer ko sirf 2 cheezein dein:
1. **Link**: `https://aapki-site.netlify.app/`  (yani index.html)
2. **Code**: jo aapne generate kiya

Customer link kholega → code daalega → Activate → card chalega.
- Wahi code doosre device par nahi chalega.
- Agar woh kisi ko link+code de bhi de, to code already uske device par bind hai — naye device par "doosre device par activate ho chuka hai" error aayega.

---

## FILE UPDATE KAISE KAREIN (auto-update sabke paas)

Jab aap card ki design/fields update karna chahein:

1. Mujhe nayi `index.html` banwayein (ya khud edit karein — sirf `<!-- LICENSE GATE -->` wala hissa na chhuein).
2. Netlify par dobara wahi folder drag & drop karein (ya sirf nayi index.html).
3. Bas! Sab customers ko **agli baar link kholte hi** nayi file mil jayegi.
   (Kyunki sab ek hi file use kar rahe hain jo aapke server par hai.)

---

## ZAROORI BAATEIN

- Customer ko **link** dena hai, file download karke nahi. Tabhi auto-update chalega.
- Pehli baar activate karte waqt **internet zaroori** hai. Uske baad us device par offline bhi chalega.
- Admin password kisi ko na batayein.
- Yeh casual copying/reselling rok deta hai. (100% hacker-proof koi web file nahi hoti, lekin aam aadmi copy nahi kar sakta.)

---

## MUSHKIL AAYE TO

- "Code ghalat hai" → code sahi se daala? Admin panel mein woh code maujood hai?
- "Doosre device par activate ho chuka" → Admin → us code par "Reset Device" dabayein.
- Admin login nahi ho raha → Environment variable `TAJ_ADMIN_PASSWORD` set kiya? Deploy dobara kiya?
