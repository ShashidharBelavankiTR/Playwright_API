/**
 * Playwright Test Report Email Sender
 * 
 * This script parses Playwright JSON test results and sends a beautiful
 * HTML email report with comprehensive test execution details.
 * 
 * @author Senior Test Automation Engineer
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ============================================
// TYPES & INTERFACES
// ============================================

interface EnvConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  emailFrom: string;
  emailTo: string[];
  emailCc?: string[];
  emailBcc?: string[];
  emailSubjectPrefix: string;
  projectName: string;
  testEnv: string;
  reportJsonPath: string;
  screenshotBaseDir: string;
  attachScreenshots: boolean;
  maxScreenshotAttachments: number;
  failOnParseError: boolean;
  failOnTestFailure: boolean;
  includeStackTraces: boolean;
  maxErrorLength: number;
  topSlowestTests: number;
  timezone: string;
}

interface TestResult {
  workerIndex: number;
  parallelIndex: number;
  status: string;
  duration: number;
  error?: {
    message: string;
    stack: string;
    location?: {
      file: string;
      column: number;
      line: number;
    };
  };
  errors?: Array<{
    message: string;
    location?: {
      file: string;
      column: number;
      line: number;
    };
  }>;
  attachments?: Array<{
    name: string;
    contentType: string;
    path: string;
  }>;
  startTime: string;
}

interface Test {
  timeout: number;
  annotations: any[];
  expectedStatus: string;
  projectId: string;
  projectName: string;
  results: TestResult[];
  status: string;
}

interface Spec {
  title: string;
  ok: boolean;
  tags: string[];
  tests: Test[];
  id: string;
  file: string;
  line: number;
  column: number;
}

interface Suite {
  title: string;
  file: string;
  line?: number;
  column?: number;
  specs: Spec[];
  suites?: Suite[];
}

interface PlaywrightReport {
  config: any;
  suites: Suite[];
  errors: any[];
  stats: {
    startTime: string;
    duration: number;
    expected: number;
    skipped: number;
    unexpected: number;
    flaky: number;
  };
}

interface TestMetrics {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  passPercentage: number;
  totalDuration: number;
  avgDuration: number;
  executionStatus: 'SUCCESS' | 'FAILURE';
}

interface TestDetail {
  title: string;
  file: string;
  status: string;
  duration: number;
  projectName: string;
  error?: {
    message: string;
    stack: string;
    location?: {
      file: string;
      line: number;
      column: number;
    };
  };
  screenshots: string[];
}

interface FailureGroup {
  file: string;
  tests: TestDetail[];
}

// ============================================
// CONFIGURATION LOADER
// ============================================

function loadConfig(): EnvConfig {
  const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value && !defaultValue) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue!;
  };

  const getBooleanEnv = (key: string, defaultValue: boolean): boolean => {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  };

  const getNumberEnv = (key: string, defaultValue: number): number => {
    const value = process.env[key];
    if (!value) return defaultValue;
    return parseInt(value, 10);
  };

  const getArrayEnv = (key: string, defaultValue: string[] = []): string[] => {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.split(',').map(v => v.trim()).filter(v => v.length > 0);
  };

  return {
    smtpHost: getEnv('SMTP_HOST'),
    smtpPort: getNumberEnv('SMTP_PORT', 587),
    smtpSecure: getBooleanEnv('SMTP_SECURE', false),
    smtpUser: getEnv('SMTP_USER'),
    smtpPass: getEnv('SMTP_PASS'),
    emailFrom: getEnv('EMAIL_FROM'),
    emailTo: getArrayEnv('EMAIL_TO'),
    emailCc: getArrayEnv('EMAIL_CC'),
    emailBcc: getArrayEnv('EMAIL_BCC'),
    emailSubjectPrefix: getEnv('EMAIL_SUBJECT_PREFIX', '[Test Report]'),
    projectName: getEnv('PROJECT_NAME', 'Playwright Tests'),
    testEnv: getEnv('TEST_ENV', 'QA'),
    reportJsonPath: getEnv('REPORT_JSON_PATH', './reports/test-results.json'),
    screenshotBaseDir: getEnv('SCREENSHOT_BASE_DIR', './test-results'),
    attachScreenshots: getBooleanEnv('ATTACH_SCREENSHOTS', true),
    maxScreenshotAttachments: getNumberEnv('MAX_SCREENSHOT_ATTACHMENTS', 10),
    failOnParseError: getBooleanEnv('FAIL_ON_PARSE_ERROR', true),
    failOnTestFailure: getBooleanEnv('FAIL_ON_TEST_FAILURE', false),
    includeStackTraces: getBooleanEnv('INCLUDE_STACK_TRACES', true),
    maxErrorLength: getNumberEnv('MAX_ERROR_LENGTH', 500),
    topSlowestTests: getNumberEnv('TOP_SLOWEST_TESTS', 5),
    timezone: getEnv('TIMEZONE', 'UTC'),
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format duration in milliseconds to human-readable format
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s ${ms % 1000}ms`;
  }
}

/**
 * Format timestamp to readable date/time
 */
function formatTimestamp(isoString: string, timezone: string = 'UTC'): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch (error) {
    return isoString;
  }
}

/**
 * Truncate long error messages
 */
function truncateError(message: string, maxLength: number): string {
  if (maxLength === 0 || message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength) + '... (truncated)';
}

/**
 * Get status color for styling
 */
function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === 'passed') return '#10b981'; // Green
  if (statusLower === 'failed' || statusLower === 'timedout' || statusLower === 'interrupted') return '#ef4444'; // Red
  if (statusLower === 'skipped') return '#f59e0b'; // Yellow/Orange
  if (statusLower === 'flaky') return '#8b5cf6'; // Purple
  return '#6b7280'; // Gray
}

/**
 * Normalize test status
 */
function normalizeStatus(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === 'passed') return 'passed';
  if (statusLower === 'failed' || statusLower === 'timedout' || statusLower === 'interrupted' || statusLower === 'unexpected') return 'failed';
  if (statusLower === 'skipped') return 'skipped';
  if (statusLower === 'flaky') return 'flaky';
  return 'unknown';
}

// ============================================
// REPORT PARSER
// ============================================

/**
 * Parse Playwright JSON report and extract test details
 */
function parseReport(reportPath: string, config: EnvConfig): {
  metrics: TestMetrics;
  tests: TestDetail[];
  reportData: PlaywrightReport;
} {
  console.log(`📖 Reading report from: ${reportPath}`);
  
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Report file not found: ${reportPath}`);
  }

  const reportContent = fs.readFileSync(reportPath, 'utf-8');
  const reportData: PlaywrightReport = JSON.parse(reportContent);

  const tests: TestDetail[] = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  let flakyTests = 0;
  let totalDuration = 0;

  /**
   * Recursively process suites to extract test details
   */
  function processSuite(suite: Suite) {
    // Process specs in current suite
    if (suite.specs && suite.specs.length > 0) {
      for (const spec of suite.specs) {
        for (const test of spec.tests) {
          totalTests++;
          
          // Get the latest result (last retry)
          const latestResult = test.results[test.results.length - 1];
          const status = normalizeStatus(latestResult.status);
          const duration = latestResult.duration || 0;
          
          totalDuration += duration;

          // Count by status
          if (status === 'passed') passedTests++;
          else if (status === 'failed') failedTests++;
          else if (status === 'skipped') skippedTests++;
          else if (status === 'flaky') flakyTests++;

          // Extract screenshots
          const screenshots: string[] = [];
          if (latestResult.attachments) {
            for (const attachment of latestResult.attachments) {
              if (attachment.contentType === 'image/png' || attachment.name === 'screenshot') {
                screenshots.push(attachment.path);
              }
            }
          }

          // Extract error information
          let errorInfo: TestDetail['error'] | undefined;
          if (status === 'failed' && latestResult.error) {
            errorInfo = {
              message: truncateError(latestResult.error.message, config.maxErrorLength),
              stack: config.includeStackTraces ? latestResult.error.stack : '',
              location: latestResult.error.location,
            };
          }

          tests.push({
            title: spec.title,
            file: spec.file,
            status,
            duration,
            projectName: test.projectName,
            error: errorInfo,
            screenshots,
          });
        }
      }
    }

    // Recursively process nested suites
    if (suite.suites && suite.suites.length > 0) {
      for (const nestedSuite of suite.suites) {
        processSuite(nestedSuite);
      }
    }
  }

  // Process all top-level suites
  for (const suite of reportData.suites) {
    processSuite(suite);
  }

  const metrics: TestMetrics = {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    skipped: skippedTests,
    flaky: flakyTests,
    passPercentage: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
    totalDuration,
    avgDuration: totalTests > 0 ? Math.round(totalDuration / totalTests) : 0,
    executionStatus: failedTests === 0 ? 'SUCCESS' : 'FAILURE',
  };

  console.log(`✅ Parsed ${totalTests} tests: ${passedTests} passed, ${failedTests} failed, ${skippedTests} skipped`);

  return { metrics, tests, reportData };
}

// ============================================
// HTML GENERATOR
// ============================================

/**
 * Generate beautiful HTML email report
 */
function generateHTMLReport(
  metrics: TestMetrics,
  tests: TestDetail[],
  reportData: PlaywrightReport,
  config: EnvConfig
): string {
  const executionTime = formatTimestamp(reportData.stats.startTime, config.timezone);
  const duration = formatDuration(reportData.stats.duration);

  // Group failures by file
  const failureGroups: FailureGroup[] = [];
  const failedTests = tests.filter(t => t.status === 'failed');
  const fileMap = new Map<string, TestDetail[]>();
  
  for (const test of failedTests) {
    if (!fileMap.has(test.file)) {
      fileMap.set(test.file, []);
    }
    fileMap.get(test.file)!.push(test);
  }
  
  fileMap.forEach((tests, file) => {
    failureGroups.push({ file, tests });
  });

  // Get slowest tests
  const slowestTests = [...tests]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, config.topSlowestTests);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.projectName} - Test Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 30px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      padding: 40px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    }
    .header h1 {
      margin: 0 0 15px 0;
      font-size: 32px;
      font-weight: 700;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      position: relative;
      z-index: 1;
    }
    .header p {
      margin: 8px 0;
      font-size: 15px;
      opacity: 0.95;
      position: relative;
      z-index: 1;
    }
    .status-badge {
      display: inline-block;
      padding: 12px 30px;
      border-radius: 25px;
      font-weight: 700;
      font-size: 16px;
      margin-top: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      position: relative;
      z-index: 1;
    }
    .status-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    }
    .status-failure {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
    }
    .status-partial {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 25px;
      padding: 40px;
      background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%);
    }
    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 25px 20px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border: none;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
    }
    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    .metric-card.passed::before { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
    .metric-card.failed::before { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }
    .metric-card.skipped::before { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
    .metric-card.total::before { background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); }
    .metric-card.duration::before { background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%); }
    .metric-card.passed { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); }
    .metric-card.failed { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); }
    .metric-card.skipped { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }
    .metric-card.total { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); }
    .metric-card.duration { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); }
    .metric-value {
      font-size: 42px;
      font-weight: 800;
      margin: 15px 0;
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .metric-label {
      font-size: 12px;
      color: #4b5563;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
    }
    .section {
      padding: 35px 40px;
      border-bottom: 2px solid #e5e7eb;
      background: linear-gradient(to right, #ffffff 0%, #fafafa 100%);
    }
    .section:nth-child(even) {
      background: linear-gradient(to left, #ffffff 0%, #f9fafb 100%);
    }
    .section-title {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 25px 0;
      color: #111827;
      display: flex;
      align-items: center;
    }
    .section-title::before {
      content: '';
      width: 5px;
      height: 28px;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      margin-right: 15px;
      border-radius: 3px;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 14px 12px;
      text-align: left;
      font-weight: 700;
      font-size: 13px;
      color: white;
      border-bottom: none;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 14px 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
      background: white;
    }
    tr:hover td {
      background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%);
      transition: background 0.3s ease;
    }
    .status-pill {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 15px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .status-passed { 
      background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
      color: white;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
    }
    .status-failed { 
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
      color: white;
      box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
    }
    .status-skipped { 
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
      color: white;
      box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
    }
    .status-flaky { 
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); 
      color: white;
      box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
    }
    .error-box {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      border-left: 5px solid #ef4444;
      padding: 18px;
      margin: 12px 0;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #991b1b;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }
    .error-message {
      font-weight: 600;
      margin-bottom: 10px;
    }
    .error-stack {
      white-space: pre-wrap;
      word-break: break-word;
      color: #7f1d1d;
      font-size: 12px;
      max-height: 200px;
      overflow-y: auto;
    }
    .file-path {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #374151;
      background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .footer {
      padding: 25px 40px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      opacity: 0.95;
    }
    .footer p {
      margin: 5px 0;
    }
    .no-data {
      text-align: center;
      padding: 40px;
      color: #9ca3af;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🎭 ${config.projectName}</h1>
      <p><strong>Environment:</strong> ${config.testEnv}</p>
      <p><strong>Execution Time:</strong> ${executionTime}</p>
      <p><strong>Total Duration:</strong> ${duration}</p>
      <div class="status-badge ${
        metrics.failed === 0 ? 'status-success' : 
        (metrics.passed > 0 && metrics.failed > 0) ? 'status-partial' : 
        'status-failure'
      }">
        ${
          metrics.failed === 0 ? '✅ Passed' : 
          (metrics.passed > 0 && metrics.failed > 0) ? '⚠️ Partial' : 
          '❌ Failed'
        }
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="metrics">
      <div class="metric-card total">
        <div class="metric-label">Total Tests</div>
        <div class="metric-value">${metrics.total}</div>
      </div>
      <div class="metric-card passed">
        <div class="metric-label">Passed</div>
        <div class="metric-value">${metrics.passed}</div>
      </div>
      <div class="metric-card failed">
        <div class="metric-label">Failed</div>
        <div class="metric-value">${metrics.failed}</div>
      </div>
      <div class="metric-card skipped">
        <div class="metric-label">Skipped</div>
        <div class="metric-value">${metrics.skipped}</div>
      </div>
      ${metrics.flaky > 0 ? `
      <div class="metric-card" style="border-top-color: #8b5cf6;">
        <div class="metric-label">Flaky</div>
        <div class="metric-value">${metrics.flaky}</div>
      </div>
      ` : ''}
      <div class="metric-card duration">
        <div class="metric-label">Pass Rate</div>
        <div class="metric-value">${metrics.passPercentage}%</div>
      </div>
    </div>

    <!-- All Tests Detailed -->
    <div class="section">
      <h2 class="section-title">📋 All Tests</h2>
      ${tests.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>File</th>
              <th>Project</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tests.map(test => `
              <tr>
                <td><strong>${test.title}</strong></td>
                <td><span class="file-path">${path.basename(test.file)}</span></td>
                <td>${test.projectName}</td>
                <td>${formatDuration(test.duration)}</td>
                <td>
                  <span class="status-pill status-${test.status}">
                    ${test.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="no-data">No test data available</div>'}
    </div>

    ${slowestTests.length > 0 ? `
    <!-- Slowest Tests -->
    <div class="section">
      <h2 class="section-title">🐌 Top ${config.topSlowestTests} Slowest Tests</h2>
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>File</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${slowestTests.map(test => `
            <tr>
              <td><strong>${test.title}</strong></td>
              <td><span class="file-path">${test.file}</span></td>
              <td>${formatDuration(test.duration)}</td>
              <td>
                <span class="status-pill status-${test.status}">
                  ${test.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${failureGroups.length > 0 ? `
    <!-- Failures Summary -->
    <div class="section">
      <h2 class="section-title">🔴 Failing Tests Summary</h2>
      ${failureGroups.map(group => `
        <div style="margin-bottom: 30px;">
          <div class="file-path" style="display: inline-block; margin-bottom: 10px; font-size: 14px;">
            📄 ${group.file}
          </div>
          ${group.tests.map(test => `
            <div style="margin-left: 20px; margin-bottom: 20px;">
              <strong style="color: #111827;">${test.title}</strong>
              <div style="font-size: 13px; color: #6b7280; margin: 5px 0;">
                Project: ${test.projectName} | Duration: ${formatDuration(test.duration)}
              </div>
              ${test.error ? `
                <div class="error-box">
                  <div class="error-message">❌ ${test.error.message}</div>
                  ${test.error.location ? `
                    <div style="font-size: 12px; margin: 5px 0;">
                      📍 ${test.error.location.file}:${test.error.location.line}:${test.error.location.column}
                    </div>
                  ` : ''}
                  ${config.includeStackTraces && test.error.stack ? `
                    <details style="margin-top: 10px;">
                      <summary style="cursor: pointer; font-weight: 600;">View Stack Trace</summary>
                      <div class="error-stack">${test.error.stack}</div>
                    </details>
                  ` : ''}
                </div>
              ` : ''}
              ${test.screenshots.length > 0 ? `
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">
                  📸 Screenshot(s): ${test.screenshots.length} attached
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p>Generated by Playwright Email Reporter | ${new Date().toLocaleString()}</p>
      <p>This is an automated test report. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ============================================
// EMAIL SENDER
// ============================================

/**
 * Send email with HTML report
 */
async function sendEmail(
  htmlContent: string,
  metrics: TestMetrics,
  tests: TestDetail[],
  config: EnvConfig
): Promise<void> {
  console.log('📧 Preparing to send email...');

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    throw error;
  }

  // Generate subject line
  const statusEmoji = metrics.executionStatus === 'SUCCESS' ? '✅' : '❌';
  const subject = `${config.emailSubjectPrefix} [${config.projectName}][${config.testEnv}] ${statusEmoji} ${metrics.executionStatus} — ${metrics.passed} passed, ${metrics.failed} failed — ${formatDuration(metrics.totalDuration)}`;

  // Collect screenshot attachments
  const attachments: any[] = [];
  
  if (config.attachScreenshots) {
    const failedTests = tests.filter(t => t.status === 'failed' && t.screenshots.length > 0);
    let attachmentCount = 0;

    for (const test of failedTests) {
      if (attachmentCount >= config.maxScreenshotAttachments) {
        console.log(`⚠️  Reached maximum screenshot attachment limit (${config.maxScreenshotAttachments})`);
        break;
      }

      for (const screenshotPath of test.screenshots) {
        if (attachmentCount >= config.maxScreenshotAttachments) break;

        // Resolve absolute path
        const fullPath = path.isAbsolute(screenshotPath)
          ? screenshotPath
          : path.join(config.screenshotBaseDir, screenshotPath);

        if (fs.existsSync(fullPath)) {
          attachments.push({
            filename: path.basename(fullPath),
            path: fullPath,
            contentType: 'image/png',
          });
          attachmentCount++;
          console.log(`📎 Attaching screenshot: ${path.basename(fullPath)}`);
        } else {
          console.warn(`⚠️  Screenshot not found: ${fullPath}`);
        }
      }
    }

    console.log(`✅ ${attachmentCount} screenshot(s) will be attached`);
  }

  // Attach JSON report
  if (fs.existsSync(config.reportJsonPath)) {
    attachments.push({
      filename: 'test-results.json',
      path: config.reportJsonPath,
      contentType: 'application/json',
    });
    console.log('📎 Attaching JSON report');
  }

  // Send email
  const mailOptions = {
    from: config.emailFrom,
    to: config.emailTo.join(', '),
    cc: config.emailCc && config.emailCc.length > 0 ? config.emailCc.join(', ') : undefined,
    bcc: config.emailBcc && config.emailBcc.length > 0 ? config.emailBcc.join(', ') : undefined,
    subject,
    html: htmlContent,
    attachments,
  };

  console.log(`📤 Sending email to: ${config.emailTo.join(', ')}`);
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('🚀 Starting Playwright Email Reporter...\n');

  let exitCode = 0;

  try {
    // Load configuration
    console.log('⚙️  Loading configuration...');
    const config = loadConfig();
    console.log(`✅ Configuration loaded successfully`);
    console.log(`   Project: ${config.projectName}`);
    console.log(`   Environment: ${config.testEnv}`);
    console.log(`   Report Path: ${config.reportJsonPath}\n`);

    // Parse report
    const { metrics, tests, reportData } = parseReport(config.reportJsonPath, config);
    console.log('');

    // Generate HTML
    console.log('🎨 Generating HTML report...');
    const htmlContent = generateHTMLReport(metrics, tests, reportData, config);
    console.log('✅ HTML report generated\n');

    // Send email
    await sendEmail(htmlContent, metrics, tests, config);
    console.log('');

    // Summary
    console.log('📊 EXECUTION SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Status:       ${metrics.executionStatus}`);
    console.log(`Total Tests:  ${metrics.total}`);
    console.log(`Passed:       ${metrics.passed}`);
    console.log(`Failed:       ${metrics.failed}`);
    console.log(`Skipped:      ${metrics.skipped}`);
    console.log(`Pass Rate:    ${metrics.passPercentage}%`);
    console.log(`Duration:     ${formatDuration(metrics.totalDuration)}`);
    console.log('═'.repeat(50));

    // Set exit code based on configuration
    if (config.failOnTestFailure && metrics.failed > 0) {
      console.log('\n⚠️  Tests failed. Exiting with code 1 (FAIL_ON_TEST_FAILURE=true)');
      exitCode = 1;
    } else {
      console.log('\n✅ Email report sent successfully!');
    }

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.stack) {
      console.error('\n📚 Stack Trace:');
      console.error(error.stack);
    }

    const config = loadConfig();
    if (config.failOnParseError) {
      exitCode = 1;
    }
  }

  process.exit(exitCode);
}

// Run the script
if (require.main === module) {
  main();
}

export { parseReport, generateHTMLReport, sendEmail, loadConfig };
