# Network Configuration Guide

This guide explains how to configure network settings for your Unidirectional Communication System on AWS EC2.

## 🌐 Understanding Your Network Setup

### What You Need to Know

- **Public IP**: Your application's live URL
- **Security Groups**: Firewall rules for your EC2 instance
- **Ports**: Different services use different ports
- **Domain**: Optional custom domain name

## 🔧 Security Group Configuration

### Required Ports

| Port | Service     | Protocol | Source    | Purpose            |
| ---- | ----------- | -------- | --------- | ------------------ |
| 22   | SSH         | TCP      | Your IP   | Server access      |
| 80   | HTTP        | TCP      | 0.0.0.0/0 | Web traffic        |
| 443  | HTTPS       | TCP      | 0.0.0.0/0 | Secure web traffic |
| 3000 | Backend API | TCP      | 0.0.0.0/0 | API requests       |

### Security Group Rules

#### 1. SSH Access (Port 22)

```
Type: SSH
Protocol: TCP
Port: 22
Source: Your IP address only
```

**Why:** Only you should be able to SSH into your server

#### 2. HTTP Access (Port 80)

```
Type: HTTP
Protocol: TCP
Port: 80
Source: 0.0.0.0/0 (All traffic)
```

**Why:** Anyone should be able to access your website

#### 3. HTTPS Access (Port 443)

```
Type: HTTPS
Protocol: TCP
Port: 443
Source: 0.0.0.0/0 (All traffic)
```

**Why:** For SSL/HTTPS connections

#### 4. Backend API (Port 3000)

```
Type: Custom TCP
Protocol: TCP
Port: 3000
Source: 0.0.0.0/0 (All traffic)
```

**Why:** Your React app needs to call your backend API

## 🚀 How to Configure Security Groups

### Step 1: Create Security Group

1. **Go to EC2 Console**
2. **Click "Security Groups"** in the left sidebar
3. **Click "Create Security Group"**
4. **Fill in details:**
   - Name: `unidirectional-comm-sg`
   - Description: `Security group for Unidirectional Communication System`

### Step 2: Add Inbound Rules

1. **Click "Add Rule"** for each port:

   **SSH Rule:**

   - Type: SSH
   - Source: My IP (or your specific IP)

   **HTTP Rule:**

   - Type: HTTP
   - Source: Anywhere (0.0.0.0/0)

   **HTTPS Rule:**

   - Type: HTTPS
   - Source: Anywhere (0.0.0.0/0)

   **Custom TCP Rule:**

   - Type: Custom TCP
   - Port: 3000
   - Source: Anywhere (0.0.0.0/0)

### Step 3: Launch Instance

1. **When launching EC2 instance**
2. **Select your security group**
3. **Continue with instance creation**

## 🌍 Finding Your Public IP

### Method 1: EC2 Console

1. **Go to EC2 Console**
2. **Click "Instances"**
3. **Select your instance**
4. **Look for "Public IPv4 address"**
5. **This is your live URL:** `http://your-public-ip`

### Method 2: Command Line

```bash
# On your EC2 instance
curl ifconfig.me

# Or
curl ipinfo.io/ip
```

### Method 3: AWS CLI

```bash
aws ec2 describe-instances --instance-ids i-1234567890abcdef0 --query 'Reservations[0].Instances[0].PublicIpAddress'
```

## 🔗 Accessing Your Application

### Primary Access Methods

#### 1. Using Public IP (Easiest)

- **URL:** `http://your-public-ip`
- **Example:** `http://54.123.45.67`
- **Works immediately** after deployment

#### 2. Using Domain Name (Optional)

- **URL:** `http://your-domain.com`
- **Requires:** Domain purchase and DNS configuration
- **More professional** for demos

#### 3. Using HTTPS (Recommended)

- **URL:** `https://your-domain.com`
- **Requires:** SSL certificate setup
- **More secure** and professional

### Testing Access

#### From Your Computer

1. **Open browser**
2. **Go to:** `http://your-public-ip`
3. **Should see:** Your React application

#### From Mobile Device

1. **Connect to different network** (mobile data)
2. **Go to:** `http://your-public-ip`
3. **Should work:** Same as desktop

#### From Different Location

1. **Ask friend to test**
2. **Send them:** `http://your-public-ip`
3. **Should work:** From anywhere in the world

## 🏠 Domain Configuration (Optional)

### Why Use a Domain?

- **Professional:** Looks more polished
- **Easy to remember:** Instead of IP address
- **SSL support:** Easier HTTPS setup
- **Branding:** Custom domain name

### Domain Setup Steps

#### 1. Purchase Domain

- **Popular providers:** GoDaddy, Namecheap, Route 53
- **Cost:** ~$10-15/year
- **Choose:** Short, memorable name

#### 2. Configure DNS

- **A Record:** Point domain to your EC2 public IP
- **Example:** `your-domain.com` → `54.123.45.67`
- **TTL:** 300 seconds (5 minutes)

#### 3. Update Security Group

- **Add rule:** Allow traffic from your domain
- **Or keep:** 0.0.0.0/0 (allows all traffic)

#### 4. Test Domain

- **Wait:** 5-10 minutes for DNS propagation
- **Test:** `http://your-domain.com`
- **Should work:** Same as IP address

## 🔒 SSL/HTTPS Setup

### Why Use HTTPS?

- **Security:** Encrypted communication
- **Trust:** Users trust HTTPS sites
- **Required:** For production applications
- **Free:** Using Let's Encrypt

### SSL Setup Steps

#### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Get SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com
```

#### 3. Test SSL

```bash
sudo certbot renew --dry-run
```

#### 4. Access HTTPS

- **URL:** `https://your-domain.com`
- **Should show:** Lock icon in browser
- **Redirects:** HTTP to HTTPS automatically

## 🚨 Common Network Issues

### Issue: "This site can't be reached"

**Causes:**

- Security group not configured
- Instance not running
- Wrong public IP

**Solutions:**

- Check security group rules
- Verify instance is running
- Double-check public IP

### Issue: "Connection timeout"

**Causes:**

- Port not open in security group
- Instance stopped
- Network connectivity issues

**Solutions:**

- Check security group configuration
- Restart instance if needed
- Test from different network

### Issue: "SSL certificate errors"

**Causes:**

- Certificate not properly configured
- Domain not pointing to instance
- Certbot configuration issues

**Solutions:**

- Re-run certbot setup
- Check domain DNS settings
- Verify certificate status

## 📱 Mobile Network Testing

### Test from Mobile

1. **Use mobile data** (not WiFi)
2. **Go to:** `http://your-public-ip`
3. **Should work:** Same as desktop

### Test from Different Networks

1. **Ask friends** to test
2. **Use public WiFi** (coffee shop, library)
3. **Test from work** network

### Mobile-Specific Issues

- **Some networks block** certain ports
- **Corporate networks** may have restrictions
- **Mobile carriers** may throttle traffic

## 🔍 Network Troubleshooting

### Check Security Group

```bash
# List security groups
aws ec2 describe-security-groups --group-names unidirectional-comm-sg

# Check specific rules
aws ec2 describe-security-groups --group-ids sg-12345678
```

### Check Instance Status

```bash
# Check if instance is running
aws ec2 describe-instances --instance-ids i-1234567890abcdef0

# Check public IP
aws ec2 describe-instances --instance-ids i-1234567890abcdef0 --query 'Reservations[0].Instances[0].PublicIpAddress'
```

### Test Connectivity

```bash
# Test HTTP access
curl -I http://your-public-ip

# Test API access
curl http://your-public-ip/api/test

# Test from different location
curl -I http://your-public-ip
```

## 📊 Network Monitoring

### Monitor Traffic

- **CloudWatch:** AWS monitoring service
- **Nginx logs:** Web server access logs
- **PM2 logs:** Application logs

### Check Performance

- **Response times:** How fast your app loads
- **Bandwidth usage:** Data transfer costs
- **Error rates:** Failed requests

## 🎯 Best Practices

### Security

- **Limit SSH access** to your IP only
- **Use HTTPS** for production
- **Regular updates** for security patches
- **Monitor logs** for suspicious activity

### Performance

- **Use CDN** for static assets (optional)
- **Enable compression** in Nginx
- **Monitor resource usage**
- **Set up alerts** for high usage

### Cost Optimization

- **Use t3.micro** for demos
- **Monitor data transfer** costs
- **Set up billing alerts**
- **Clean up** resources after demo

---

**Ready to go live?** Configure your security groups and your application will be accessible from anywhere in the world! 🌍
