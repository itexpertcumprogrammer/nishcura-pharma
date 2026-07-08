# GitHub Setup & Push Instructions

## ⚠️ Authentication Required

You need to authenticate with GitHub to push your code. Follow these steps:

## Option 1: GitHub Personal Access Token (Recommended)

### Step 1: Create Personal Access Token

1. Go to GitHub: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Lifevision Healthcare Deployment`
4. Set expiration: Choose as needed (90 days, 1 year, or no expiration)
5. Select scopes:
   - ✅ **repo** (all)
   - ✅ **workflow**
6. Click **"Generate token"**
7. **IMPORTANT**: Copy the token immediately (you won't see it again!)

### Step 2: Configure Git with Token

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/lifevision-healthcare

# Set remote URL with token
git remote set-url origin https://<YOUR_GITHUB_USERNAME>:<YOUR_TOKEN>@github.com/itexpertcumprogrammer/nishcura-pharma.git

# Example:
# git remote set-url origin https://itexpertcumprogrammer:ghp_xxxxxxxxxxxxxxxxxxxx@github.com/itexpertcumprogrammer/nishcura-pharma.git
```

### Step 3: Push to GitHub

```bash
git push -u origin main
```

## Option 2: GitHub CLI (Easiest)

### Install GitHub CLI

```bash
brew install gh
```

### Authenticate and Push

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/lifevision-healthcare

# Login to GitHub
gh auth login

# Follow the prompts:
# - Select: GitHub.com
# - Protocol: HTTPS
# - Authenticate via browser

# Push code
git push -u origin main
```

## Option 3: SSH Key (Advanced)

### Step 1: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter for default location
# Optionally add passphrase
```

### Step 2: Add SSH Key to SSH Agent

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Step 3: Add SSH Key to GitHub

```bash
# Copy public key
cat ~/.ssh/id_ed25519.pub | pbcopy

# Or manually copy from:
cat ~/.ssh/id_ed25519.pub
```

1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: `MacBook Pro - Lifevision`
4. Paste the copied key
5. Click **"Add SSH key"**

### Step 4: Update Remote and Push

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/lifevision-healthcare

git remote set-url origin git@github.com:itexpertcumprogrammer/nishcura-pharma.git
git push -u origin main
```

## Verify Repository Setup

After successful push:

```bash
git status
git remote -v
git log --oneline
```

## ✅ Next Steps After Successful Push

### 1. Configure GitHub Secrets

Go to: https://github.com/itexpertcumprogrammer/nishcura-pharma/settings/secrets/actions

Add these secrets (get values from Hostinger):

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SSH_HOST` | Hostinger server hostname | `your-site.com` or IP |
| `SSH_USERNAME` | Your SSH username | `u123456789` |
| `SSH_PASSWORD` | Your SSH password | Your hosting password |
| `SSH_PORT` | SSH port | `22` or `65002` |
| `DEPLOY_PATH` | Deployment directory | `~/public_html` |

### How to Get Hostinger SSH Details:

1. Login to **Hostinger hPanel**: https://hpanel.hostinger.com
2. Go to **Advanced** → **SSH Access**
3. Note down:
   - **Server/Hostname**: This is your `SSH_HOST`
   - **Port**: Usually `65002` (This is your `SSH_PORT`)
   - **Username**: Your hosting username (This is your `SSH_USERNAME`)
   - **Password**: Your hosting account password (This is your `SSH_PASSWORD`)
4. **Deploy Path**: Usually `~/public_html` or `~/domains/your-domain.com/public_html`

### 2. Enable GitHub Actions

1. Go to: https://github.com/itexpertcumprogrammer/nishcura-pharma/actions
2. Enable workflows if prompted
3. The deployment workflow will run automatically on every push to `main`

### 3. Trigger First Deployment

```bash
# Make any small change
echo "# Lifevision Healthcare" >> README.md

# Commit and push
git add .
git commit -m "Trigger first deployment"
git push origin main
```

### 4. Monitor Deployment

1. Go to GitHub **Actions** tab
2. Click on the running workflow
3. Watch the deployment progress
4. Check for any errors

## 🐛 Troubleshooting

### Error: "remote: Repository not found"

- Verify the repository exists: https://github.com/itexpertcumprogrammer/nishcura-pharma
- Check your GitHub username
- Ensure you have access to the repository

### Error: "Permission denied (publickey)"

- Use Option 1 (Personal Access Token) or Option 2 (GitHub CLI)
- Or properly configure SSH keys with Option 3

### Error: "HTTP 400" or "HTTP 403"

- Your token/credentials may be invalid
- Generate a new Personal Access Token
- Ensure token has `repo` and `workflow` permissions

### Large Files Warning

If you see warnings about large files:

```bash
# Check file sizes
find . -type f -size +50M -not -path "./.git/*"

# Add large files to .gitignore
echo "path/to/large/file" >> .gitignore
```

## 📞 Need Help?

1. **GitHub Token Issues**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
2. **SSH Setup**: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
3. **GitHub CLI**: https://cli.github.com/manual/

## ✅ Quick Command Reference

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub (triggers auto-deployment)
git push origin main

# View commit history
git log --oneline

# Check remote
git remote -v
```

---

**Repository**: https://github.com/itexpertcumprogrammer/nishcura-pharma
