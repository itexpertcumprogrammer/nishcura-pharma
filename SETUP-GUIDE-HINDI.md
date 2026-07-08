# Lifevision Healthcare - Setup Guide (हिंदी में)

## ✅ Website Successfully Configured!

Aapki website ab **local** aur **production server** dono pe same structure se chalegi!

## 🚀 Local Pe Chalane Ke Liye

### Option 1: Development Mode (Recommended for local testing)
```bash
npm run dev
```
Website khulegi: **http://localhost:3000**

### Option 2: XAMPP Apache Se
```bash
npm run build
```
Phir XAMPP me Apache start karo aur ye URL open karo:
**http://localhost/lifevision-healthcare/**

## 🌐 Live Server Pe Deploy Karne Ke Liye

### Step 1: Build Banao
```bash
npm run build
```
Ye command **dist** folder bana degi

### Step 2: Server Pe Upload Karo
**Option A:** Poori project folder upload karo (recommended)
**Option B:** Sirf `dist` folder ki files apne public_html me upload karo

### Step 3: Done!
`.htaccess` file already configured hai, koi extra settings nahi chahiye

## 📁 Important Files

- **dist/** - Production build (ise server pe upload karna hai)
- **server/db.json** - Database file (data yaha save hota hai)
- **.htaccess** - Server configuration (already set)
- **README.md** - English me complete guide

## 🔐 Admin Panel Access

- **URL:** `your-website-url/admin`
- **Email:** admin@lifevision.com
- **Password:** admin123

## ⚙️ Current Status

✅ Dependencies installed
✅ Production build ready (`dist` folder)
✅ .htaccess configured
✅ Development server running at http://localhost:3000
✅ Ready for deployment!

## 📝 Notes

- Koi extra configuration nahi chahiye
- Local aur live dono pe same code chalega
- Data automatically save hota hai `server/db.json` me
- Images `src/assets/images/` me store hote hain

---

**Support Contact:**
- Email: info@lifevisionhealthcare.com
- Phone: +91-9878845222
