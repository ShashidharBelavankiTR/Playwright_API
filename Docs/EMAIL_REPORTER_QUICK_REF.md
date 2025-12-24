# 📧 Playwright Email Reporter - Quick Reference Card

## 🚀 Quick Commands

```bash
# Run tests and send email report
npm run test:email

# Send report from existing results
npm run report:email

# Direct execution
npx ts-node src/reporting/sendReportEmail.ts
```

## ⚙️ Essential Environment Variables

```env
# SMTP (Required)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email (Required)
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=recipient@example.com

# Report (Optional)
PROJECT_NAME=Playwright Tests
TEST_ENV=QA
REPORT_JSON_PATH=./reports/test-results.json
ATTACH_SCREENSHOTS=true
```

## 📊 What's Included in Email

✅ **Header**: Project, environment, timestamp, duration, status badge  
✅ **Metrics Dashboard**: Total/Passed/Failed/Skipped/Pass% cards  
✅ **Failures Summary**: Grouped by file with errors & stack traces  
✅ **Slowest Tests**: Top N performance bottlenecks  
✅ **All Tests Table**: Complete test inventory  
✅ **Attachments**: Screenshots + JSON report  

## 🎨 Subject Line Example

```
[Automation] [Playwright Test Framework][QA] ✅ SUCCESS — 118 passed, 0 failed — 2m 35s
```

## 🔧 Common Configurations

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
# Use App Password from https://myaccount.google.com/apppasswords
```

### Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
```

### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
```

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| SMTP connection failed | Check credentials, use app password, verify port |
| Report file not found | Check `REPORT_JSON_PATH`, run tests first |
| Screenshots missing | Verify `SCREENSHOT_BASE_DIR`, check file permissions |
| Email too large | Reduce `MAX_SCREENSHOT_ATTACHMENTS=5` or disable |

## 📁 Files Structure

```
src/reporting/
  └── sendReportEmail.ts     # Main script (900+ lines)
  
.env.example                 # Configuration template
.env                         # Your config (create this)

Docs/
  ├── EMAIL_REPORTER_README.md
  ├── EMAIL_REPORTER_COMPLETE_GUIDE.md
  └── SAMPLE_EMAIL_REPORT.html
```

## 🎯 Key Features

- ✅ Defensive parsing with error handling
- ✅ Modern gradient HTML with inline CSS
- ✅ Status normalization (passed/failed/skipped/flaky)
- ✅ Duration formatting (1h 2m 5s)
- ✅ Screenshot attachment with limits
- ✅ Failure grouping by file
- ✅ Top N slowest tests
- ✅ Exit codes for CI/CD
- ✅ Full TypeScript type safety

## 🔐 Security Checklist

- [ ] Never commit `.env` (add to `.gitignore`)
- [ ] Use app-specific passwords (not account passwords)
- [ ] Rotate SMTP credentials regularly
- [ ] Use CI/CD secrets for pipelines
- [ ] Review sensitive data in screenshots

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `EMAIL_REPORTER_README.md` | Complete usage guide |
| `EMAIL_REPORTER_COMPLETE_GUIDE.md` | Technical deep dive |
| `SAMPLE_EMAIL_REPORT.html` | Visual example |
| `EMAIL_REPORTER_QUICK_REF.md` | This quick reference |

## 🎨 HTML Styling Colors

- 🟢 **Green (#10b981)**: Passed tests
- 🔴 **Red (#ef4444)**: Failed tests
- 🟡 **Yellow (#f59e0b)**: Skipped tests
- 🟣 **Purple (#8b5cf6)**: Flaky tests, duration card
- 🔵 **Blue (#3b82f6)**: Total tests card
- 🎨 **Gradient**: Header (purple #667eea → #764ba2)

## ⚡ Performance Tips

1. Set `MAX_SCREENSHOT_ATTACHMENTS=10` to avoid large emails
2. Set `MAX_ERROR_LENGTH=500` to truncate long errors
3. Set `INCLUDE_STACK_TRACES=false` to reduce email size
4. Set `ATTACH_SCREENSHOTS=false` if screenshots not needed

## 🌐 CI/CD Integration

```yaml
# GitHub Actions
- name: Send Email Report
  run: npm run report:email
  env:
    SMTP_HOST: ${{ secrets.SMTP_HOST }}
    SMTP_USER: ${{ secrets.SMTP_USER }}
    SMTP_PASS: ${{ secrets.SMTP_PASS }}
    EMAIL_TO: ${{ secrets.EMAIL_TO }}
    FAIL_ON_TEST_FAILURE: true
```

## 📞 Support

- Check troubleshooting guide in README
- Review inline code comments
- Open `SAMPLE_EMAIL_REPORT.html` to see visual example
- Verify `.env` configuration against `.env.example`

---

**🎉 Ready to use! Run `npm run test:email` to get started.**
