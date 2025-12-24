# 📧 Playwright Email Reporter

A comprehensive email reporting solution for Playwright test results. Automatically parses JSON test reports and sends beautiful, modern HTML email reports with detailed metrics, failure analysis, and screenshots.

## ✨ Features

- 📊 **Rich Metrics Dashboard**: Visual cards showing passed/failed/skipped tests, pass percentage, and execution time
- 🎨 **Modern HTML Design**: Beautiful, responsive email layout with professional styling
- 🔴 **Failure Analysis**: Detailed error messages, stack traces, and grouped failures by file
- 🐌 **Performance Insights**: Top N slowest tests to identify bottlenecks
- 📸 **Screenshot Attachments**: Automatically attach failure screenshots
- 🔒 **Secure Configuration**: All credentials and settings via `.env` file
- 🎯 **Smart Status Detection**: Handles passed/failed/skipped/flaky/timedOut statuses
- 📦 **Multiple Attachments**: Screenshots + JSON report attached to email
- 🌍 **Timezone Support**: Configurable timezone for timestamps
- 🚀 **CI/CD Ready**: Exit codes for pipeline integration

## 📋 Requirements

- Node.js 16+ 
- TypeScript 4.5+
- Playwright test results in JSON format

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `nodemailer` - Email sending
- `dotenv` - Environment variable management
- `ts-node` - TypeScript execution
- `@types/nodemailer` - TypeScript definitions

### 2. Configure Environment

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit `.env` with your SMTP and email settings:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Email Recipients
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=recipient1@example.com,recipient2@example.com

# Report Settings
PROJECT_NAME=Playwright Test Framework
TEST_ENV=QA
REPORT_JSON_PATH=./reports/test-results.json
```

### 3. Run the Reporter

```bash
# Send email report from existing test results
npm run report:email

# Run tests and send report in one command
npm run test:email
```

Or run directly:

```bash
npx ts-node src/reporting/sendReportEmail.ts
```

## ⚙️ Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Use SSL (true) or TLS (false) | `false` |
| `SMTP_USER` | SMTP authentication username | `user@gmail.com` |
| `SMTP_PASS` | SMTP authentication password | `app-password` |
| `EMAIL_FROM` | Sender email address | `noreply@company.com` |
| `EMAIL_TO` | Recipient email(s), comma-separated | `dev@company.com` |

### Optional Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EMAIL_CC` | - | CC recipients (comma-separated) |
| `EMAIL_BCC` | - | BCC recipients (comma-separated) |
| `EMAIL_SUBJECT_PREFIX` | `[Test Report]` | Prefix for email subject |
| `PROJECT_NAME` | `Playwright Tests` | Project name in report |
| `TEST_ENV` | `QA` | Environment name (QA/UAT/PROD) |
| `REPORT_JSON_PATH` | `./reports/test-results.json` | Path to JSON report |
| `SCREENSHOT_BASE_DIR` | `./test-results` | Base directory for screenshots |
| `ATTACH_SCREENSHOTS` | `true` | Attach screenshots to email |
| `MAX_SCREENSHOT_ATTACHMENTS` | `10` | Max screenshots to attach |
| `FAIL_ON_PARSE_ERROR` | `true` | Exit with error on parse failure |
| `FAIL_ON_TEST_FAILURE` | `false` | Exit with error if tests failed |
| `INCLUDE_STACK_TRACES` | `true` | Include stack traces in report |
| `MAX_ERROR_LENGTH` | `500` | Max error message length (0=unlimited) |
| `TOP_SLOWEST_TESTS` | `5` | Number of slowest tests to show |
| `TIMEZONE` | `UTC` | Timezone for timestamps |

## 📧 SMTP Provider Setup

### Gmail

1. Enable 2-Step Verification in Google Account
2. Generate App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the 16-character app password in `.env`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd-efgh-ijkl-mnop
```

### Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@company.com
SMTP_PASS=your-password
```

### AWS SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-aws-smtp-username
SMTP_PASS=your-aws-smtp-password
```

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 📊 Email Report Contents

The generated HTML email includes:

### 1. Header Section
- Project name and environment
- Execution timestamp
- Total duration
- Build status badge (SUCCESS/FAILURE)

### 2. Metrics Dashboard
- Total tests count
- Passed tests (green card)
- Failed tests (red card)
- Skipped tests (yellow card)
- Flaky tests (purple card, if any)
- Pass percentage

### 3. Failures Summary (if failures exist)
- Grouped by test file
- Full error messages
- Error locations (file:line:column)
- Collapsible stack traces
- Screenshot indicators

### 4. Top N Slowest Tests
- Test name and file
- Duration
- Status
- Helps identify performance bottlenecks

### 5. All Tests Table
- Complete list of all tests
- File, project, duration, status
- Color-coded status badges

### 6. Attachments
- Failed test screenshots (up to configured limit)
- Complete test-results.json file

## 🎨 Email Styling

The email uses inline CSS for maximum compatibility with email clients:

- **Modern gradient header** with purple theme
- **Card-based metrics** with color-coded borders
- **Status badges** (pills) with semantic colors:
  - 🟢 Green: Passed
  - 🔴 Red: Failed
  - 🟡 Yellow: Skipped
  - 🟣 Purple: Flaky
- **Responsive tables** with alternating row colors
- **Error boxes** with red accent border
- **Professional typography** using system font stack

Sample HTML snippet:

```html
<div class="metric-card passed">
  <div class="metric-label">Passed</div>
  <div class="metric-value">120</div>
</div>

<span class="status-pill status-passed">PASSED</span>

<div class="error-box">
  <div class="error-message">❌ Assertion failed: Expected true, received false</div>
  <details>
    <summary>View Stack Trace</summary>
    <div class="error-stack">...</div>
  </details>
</div>
```

## 🔧 Usage Examples

### Basic Usage

```bash
# Run tests and send email
npm run test:email
```

### Custom Report Path

```bash
REPORT_JSON_PATH=./custom-reports/results.json npm run report:email
```

### Different Environment

```bash
TEST_ENV=PROD PROJECT_NAME="Production Tests" npm run report:email
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Run Playwright Tests
  run: npm run test
  continue-on-error: true

- name: Send Email Report
  run: npm run report:email
  env:
    SMTP_HOST: ${{ secrets.SMTP_HOST }}
    SMTP_USER: ${{ secrets.SMTP_USER }}
    SMTP_PASS: ${{ secrets.SMTP_PASS }}
    EMAIL_TO: ${{ secrets.EMAIL_TO }}
    FAIL_ON_TEST_FAILURE: true
```

## 📝 Subject Line Format

The email subject is auto-generated with comprehensive information:

```
[Automation] [Playwright Test Framework][QA] ✅ SUCCESS — 120 passed, 0 failed — 2m 10s
```

Format: `[PREFIX] [PROJECT][ENV] [STATUS] — [PASSED] passed, [FAILED] failed — [DURATION]`

## 🐛 Troubleshooting

### Email Not Sending

1. **Check SMTP credentials**: Verify username/password in `.env`
2. **Firewall/Port issues**: Ensure port 587 or 465 is not blocked
3. **App-specific passwords**: Gmail/Outlook require app passwords, not account passwords
4. **TLS/SSL settings**: Try toggling `SMTP_SECURE` between `true` and `false`

### Report Parsing Errors

1. **Check JSON file exists**: Verify `REPORT_JSON_PATH` is correct
2. **Validate JSON format**: Ensure Playwright generated valid JSON
3. **Check permissions**: Script needs read access to report file

### Missing Screenshots

1. **Verify paths**: Check `SCREENSHOT_BASE_DIR` points to correct directory
2. **Check file existence**: Ensure screenshots were actually captured
3. **Path format**: Screenshots can be relative or absolute

### Large Email Size

1. **Reduce attachments**: Set `MAX_SCREENSHOT_ATTACHMENTS` to lower value
2. **Disable screenshots**: Set `ATTACH_SCREENSHOTS=false`
3. **Truncate errors**: Reduce `MAX_ERROR_LENGTH` value

## 📚 API Reference

### Functions

#### `loadConfig(): EnvConfig`
Loads and validates environment configuration.

#### `parseReport(reportPath: string, config: EnvConfig)`
Parses Playwright JSON report and extracts metrics and test details.

Returns:
- `metrics`: Test execution metrics
- `tests`: Array of test details
- `reportData`: Raw report data

#### `generateHTMLReport(metrics, tests, reportData, config): string`
Generates beautiful HTML email content.

#### `sendEmail(htmlContent, metrics, tests, config): Promise<void>`
Sends email via NodeMailer with HTML content and attachments.

## 🔐 Security Best Practices

1. **Never commit `.env`**: Add `.env` to `.gitignore`
2. **Use app-specific passwords**: Don't use account passwords
3. **Rotate credentials regularly**: Update SMTP passwords periodically
4. **Limit email recipients**: Use specific email addresses, not public lists
5. **Secure CI/CD secrets**: Use encrypted secrets in pipelines

## 🧪 Testing

To test the email reporter without running tests:

1. Ensure you have a valid `test-results.json` file
2. Configure `.env` with valid SMTP settings
3. Run: `npm run report:email`
4. Check recipient inbox (including spam folder)

## 📄 License

ISC

## 👥 Contributing

Contributions welcome! Please ensure:
- Code follows TypeScript best practices
- Environment variables are documented
- Email HTML is tested across clients (Gmail, Outlook, Apple Mail)

## 🆘 Support

For issues or questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Verify environment configuration
3. Review NodeMailer documentation
4. Check SMTP provider documentation

---

**Generated with ❤️ for Playwright Test Automation**
