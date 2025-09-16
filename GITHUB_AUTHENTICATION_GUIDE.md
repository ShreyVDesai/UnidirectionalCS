# GitHub Authentication Guide

This guide helps you set up GitHub authentication for deploying your Unidirectional Communication System.

## 🚨 **The Problem**

GitHub no longer supports password authentication for Git operations. You need to use a **Personal Access Token (PAT)** instead.

## 🔑 **Solution: Create Personal Access Token**

### **Step 1: Generate Token**

1. **Go to GitHub Token Settings:**

   - Visit: [github.com/settings/tokens](https://github.com/settings/tokens)
   - Or: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Create New Token:**

   - Click "Generate new token" → "Generate new token (classic)"
   - **Token name:** `UnidirectionalCS-Deployment`
   - **Expiration:** `90 days` (recommended)

3. **Select Required Scopes:**

   - ✅ **repo** (Full control of private repositories)
   - ✅ **workflow** (Update GitHub Action workflows)

4. **Generate Token:**
   - Click "Generate token"
   - **⚠️ IMPORTANT:** Copy the token immediately (you won't see it again!)

### **Step 2: Use Token for Authentication**

When Git asks for your password, use the **Personal Access Token**:

```bash
Username for 'https://github.com': ShreyVDesai
Password for 'https://ShreyVDesai@github.com': [PASTE_YOUR_TOKEN_HERE]
```

## 🔧 **Alternative Methods**

### **Method 1: SSH Keys (Recommended for Long-term)**

1. **Generate SSH Key:**

   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```

2. **Add to SSH Agent:**

   ```bash
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Add to GitHub:**

   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys
   - Add new SSH key

4. **Use SSH URL:**
   ```bash
   git clone git@github.com:ShreyVDesai/UnidirectionalCS.git
   ```

### **Method 2: GitHub CLI**

1. **Install GitHub CLI:**

   ```bash
   # On Ubuntu
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update
   sudo apt install gh
   ```

2. **Authenticate:**

   ```bash
   gh auth login
   ```

3. **Clone Repository:**
   ```bash
   gh repo clone ShreyVDesai/UnidirectionalCS
   ```

## 🚀 **Quick Fix for Your Current Issue**

### **Immediate Solution:**

1. **Create Personal Access Token** (follow Step 1 above)
2. **Use token as password:**
   ```bash
   Username for 'https://github.com': ShreyVDesai
   Password for 'https://ShreyVDesai@github.com': [YOUR_TOKEN]
   ```

### **Updated Clone Command:**

```bash
cd /home/ubuntu
git clone https://github.com/ShreyVDesai/UnidirectionalCS.git
cd UnidirectionalCS
```

## 🔒 **Security Best Practices**

### **Token Security:**

- **Never commit tokens** to your repository
- **Use environment variables** for tokens in scripts
- **Set expiration dates** on tokens
- **Revoke unused tokens** regularly

### **SSH Key Security:**

- **Use strong passphrases** for SSH keys
- **Don't share private keys**
- **Use different keys** for different purposes

## 🛠️ **Troubleshooting**

### **Issue: "Authentication failed"**

**Solutions:**

- Double-check your username: `ShreyVDesai`
- Ensure you're using the token, not your password
- Verify the token has the correct scopes

### **Issue: "Repository not found"**

**Solutions:**

- Check if the repository exists: [github.com/ShreyVDesai/UnidirectionalCS](https://github.com/ShreyVDesai/UnidirectionalCS)
- Verify the repository is public or you have access
- Check the repository name spelling

### **Issue: "Token expired"**

**Solutions:**

- Generate a new token
- Update your saved credentials
- Consider using SSH keys for long-term access

## 📋 **Quick Checklist**

- [ ] Create Personal Access Token on GitHub
- [ ] Copy token immediately (you won't see it again)
- [ ] Use token as password when Git asks
- [ ] Test clone: `git clone https://github.com/ShreyVDesai/UnidirectionalCS.git`
- [ ] Continue with deployment steps

## 🎯 **For Your Deployment**

Once you have the token:

1. **Clone repository:**

   ```bash
   git clone https://github.com/ShreyVDesai/UnidirectionalCS.git
   ```

2. **Continue with deployment:**
   - Set up environment variables
   - Build and start the application
   - Configure Nginx

---

**Ready to authenticate?** Create your Personal Access Token and continue with the deployment! 🚀
