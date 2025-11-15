# Portfolio Monitoring & Uptime Guide

## Overview
Your portfolio now includes comprehensive uptime monitoring and automated release management. This guide explains how to set up and use these enterprise-grade features.

## 🔄 Release Automation

### Automatic Releases
The release workflow automatically creates GitHub releases with:
- **Changelog generation** based on conventional commits
- **Deployment packages** ready for hosting
- **Version tracking** and build metadata
- **Asset management** with complete portfolio bundles

### Creating a Release

#### Option 1: Git Tags (Recommended)
```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

#### Option 2: Manual Trigger
1. Go to **Actions** tab in your GitHub repository
2. Select **Create Release** workflow
3. Click **Run workflow**
4. Enter version number (e.g., `v1.0.1`)

### Release Assets
Each release includes:
- `portfolio-v1.0.0.tar.gz` - Complete deployment package
- Automated changelog with commit history
- Build metadata and version information

## 📊 Uptime Monitoring

### Monitoring Features
- **Multi-endpoint checking** (home, privacy, terms, feeds)
- **Browser-based testing** with Puppeteer
- **Performance metrics** and load time analysis
- **Critical element validation** (header, nav, content)
- **Automated notifications** for issues

### Monitoring Schedule
- Runs every **15 minutes** automatically
- Can be triggered manually from Actions tab
- Stores reports for **30 days**

### Setting Up Notifications

#### Discord Webhook (Optional)
1. Create a Discord webhook in your server
2. Add webhook URL to repository secrets:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add secret: `DISCORD_WEBHOOK_URL`
   - Value: Your Discord webhook URL

#### GitHub Issues (Built-in)
- Failed checks automatically comment on recent commits
- Issues are visible in the Actions tab
- Reports uploaded as artifacts

### Monitoring Endpoints
The system checks these URLs:
- **Home Page** (Critical) - Main portfolio
- **Privacy Page** - Legal compliance
- **Terms Page** - Terms of service  
- **Sitemap** - SEO sitemap
- **RSS Feed** - Content syndication
- **Manifest** - PWA configuration

### Performance Thresholds
- **Response Time**: < 3 seconds (flagged if slower)
- **Status Codes**: 200-399 considered healthy
- **Critical Elements**: Header, navigation, main content must be present

## 🚀 Deployment Integration

### Netlify Integration
If using Netlify, the monitoring will check your live site at:
```
https://bibhudendu-behera.netlify.app
```

Update the `SITE_URL` in the workflow file if using a different URL.

### Other Hosting Providers
1. Edit `.github/workflows/uptime-monitoring.yml`
2. Update `SITE_URL` environment variable:
   ```yaml
   env:
     SITE_URL: https://your-domain.com
   ```

## 📈 Monitoring Reports

### Reading Reports
Each monitoring run generates:
- **JSON Report** - Machine-readable data
- **Markdown Report** - Human-readable summary
- **GitHub Artifacts** - Downloadable reports

### Report Structure
```json
{
  "summary": {
    "uptime": "100.00%",
    "healthy": 6,
    "total": 6,
    "errors": 0
  },
  "results": [...],
  "errors": [...]
}
```

### Status Indicators
- ✅ **Healthy** - Endpoint responding correctly
- ❌ **Unhealthy** - Error or bad status code  
- 🚀 **Fast** - Response under 3 seconds
- 🐌 **Slow** - Response over 3 seconds
- 🚨 **Critical** - Main site issues

## 🔧 Troubleshooting

### Common Issues

#### Monitoring Fails
1. Check if your site URL is correct in the workflow
2. Verify your site is publicly accessible
3. Check GitHub Actions logs for specific errors

#### No Notifications
1. Verify Discord webhook URL is correct
2. Check repository secrets are properly set
3. Ensure webhook has proper permissions

#### False Positives
1. Review performance thresholds in the workflow
2. Check if your hosting provider has known issues
3. Adjust timeout values if needed

### Manual Testing
You can test your site manually:
```bash
# Check if site is accessible
curl -I https://your-site.com

# Check response time
curl -w "@curl-format.txt" -o /dev/null -s https://your-site.com
```

## 📋 Best Practices

### Release Management
1. Use semantic versioning (v1.0.0, v1.1.0, v2.0.0)
2. Write descriptive commit messages
3. Test changes before creating releases
4. Review generated changelogs

### Monitoring
1. Set up Discord notifications for critical alerts
2. Review monitoring reports weekly
3. Address performance issues promptly
4. Update monitoring URLs when changing domains

### Maintenance
1. Monitor GitHub Actions quota usage
2. Clean up old artifacts periodically
3. Update dependencies in workflows annually
4. Review and update monitoring thresholds

## 🎯 Next Steps

### Enhanced Monitoring
- Add more specific endpoint tests
- Integrate with external monitoring services
- Set up email notifications
- Add performance regression detection

### Release Improvements  
- Add automated testing before releases
- Integrate with deployment webhooks
- Add rollback capabilities
- Include security scanning

Your portfolio now has enterprise-grade monitoring and release management! 🎉