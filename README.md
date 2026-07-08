# Lifevision Healthcare Website

## Local Development (XAMPP)

### Prerequisites
- XAMPP installed and running (Apache server)
- Node.js and npm installed

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Website will be available at: `http://localhost:3000`

3. **Access via XAMPP** (Alternative)
   - Make sure Apache is running in XAMPP
   - Build the project: `npm run build`
   - Access via: `http://localhost/lifevision-healthcare/`

## Production Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist` folder with all compiled files.

### Deploy to Live Server

1. **Upload Files**
   - Upload the entire project folder to your server
   - Or upload only the `dist` folder contents to your public_html

2. **Server Configuration**
   - The `.htaccess` file is already configured for Apache servers
   - For Node.js hosting: `npm run start`

3. **Database**
   - JSON database is in `server/db.json`
   - Data persists automatically

### Admin Access
- URL: Your website URL + `/admin`
- Email: `admin@lifevision.com`
- Password: `admin123`

## Project Structure
```
lifevision-healthcare/
├── dist/              # Production build (auto-generated)
├── src/              # Source code
│   ├── components/   # React components
│   ├── assets/       # Images, media
│   └── data/         # Static data
├── server/           # Backend data
│   └── db.json      # Database file
├── .htaccess        # Apache configuration
└── server.ts        # Express server
```

## Important Notes

- The website works both on local XAMPP and live servers without any changes
- All paths are relative (`.htaccess` handles routing)
- Data is stored in `server/db.json`
- No additional configuration needed for deployment
