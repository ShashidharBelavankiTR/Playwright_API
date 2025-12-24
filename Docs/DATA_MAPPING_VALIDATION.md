# 📊 test-results.json → Email Report Mapping

## Quick Reference: Data Flow Validation

### 🔍 Source Data (test-results.json)
```json
{
  "stats": {
    "startTime": "2025-12-23T14:16:23.284Z",
    "duration": 14667.128,
    "expected": 0,
    "unexpected": 2,
    "skipped": 0,
    "flaky": 0
  },
  "suites": [
    {
      "title": "ui\\login-enhanced.spec.ts",
      "suites": [
        {
          "title": "Enhanced Login Tests with Assertions",
          "specs": [
            {
              "title": "Should successfully login with valid credentials - Enhanced",
              "tests": [
                {
                  "projectName": "firefox",
                  "results": [
                    {
                      "status": "failed",
                      "duration": 8854
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "title": "ui\\login.spec.ts",
      "suites": [
        {
          "specs": [
            {
              "title": "Should successfully login with valid credentials",
              "tests": [
                {
                  "projectName": "firefox",
                  "results": [
                    {
                      "status": "failed",
                      "duration": 4
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

### ✅ Extracted Metrics
| Metric | Value | Source |
|--------|-------|--------|
| Total Tests | `2` | Count all specs.tests |
| Passed | `0` | Count where status='passed' |
| Failed | `2` | Count where status='failed'/'unexpected' |
| Skipped | `0` | Count where status='skipped' |
| Flaky | `0` | Count where status='flaky' |
| Pass Rate | `0%` | (passed/total) * 100 |
| Total Duration | `14s 667ms` | stats.duration (14667.128ms) |
| Execution Time | `Dec 23, 2025, 19:46:23` | Formatted stats.startTime |
| Status Badge | `❌ Failed` | failed=2, passed=0 → Red |

---

### ✅ Extracted Test Details

#### Test 1
| Field | Raw Value | Formatted Value |
|-------|-----------|----------------|
| Title | "Should successfully login with valid credentials - Enhanced" | ✅ |
| File | "ui/login-enhanced.spec.ts" | `login-enhanced.spec.ts` |
| Status | "failed" | `FAILED` (Red pill) |
| Duration | 8854 | `8s 854ms` |
| Project | "firefox" | `firefox` |
| Error | "TestDataException: Key 'users.validUser' not found..." | Truncated + Stack |

#### Test 2
| Field | Raw Value | Formatted Value |
|-------|-----------|----------------|
| Title | "Should successfully login with valid credentials" | ✅ |
| File | "ui/login.spec.ts" | `login.spec.ts` |
| Status | "failed" | `FAILED` (Red pill) |
| Duration | 4 | `4ms` |
| Project | "firefox" | `firefox` |
| Error | "browserType.launch: Target page, context or browser..." | Truncated + Stack |

---

### 📧 HTML Email Sections Generated

#### 1. Header
```
🎭 Playwright Test Framework
Environment: QA
Execution Time: Dec 23, 2025, 19:46:23
Total Duration: 14s 667ms
[❌ Failed]  ← Red badge
```

#### 2. Metrics Cards
```
[Total: 2] [Passed: 0] [Failed: 2] [Skipped: 0] [Pass Rate: 0%]
```

#### 3. All Tests Table
```
| Test Name                                    | File                   | Project | Duration  | Status |
|----------------------------------------------|------------------------|---------|-----------|--------|
| Should successfully login... - Enhanced      | login-enhanced.spec.ts | firefox | 8s 854ms  | FAILED |
| Should successfully login...                 | login.spec.ts          | firefox | 4ms       | FAILED |
```

#### 4. Slowest Tests Table
```
| Test Name                                    | File                   | Duration  | Status |
|----------------------------------------------|------------------------|-----------|--------|
| Should successfully login... - Enhanced      | login-enhanced.spec.ts | 8s 854ms  | FAILED |
| Should successfully login...                 | login.spec.ts          | 4ms       | FAILED |
```

#### 5. Failing Tests Summary
```
📄 ui/login-enhanced.spec.ts
  Should successfully login with valid credentials - Enhanced
  Project: firefox | Duration: 8s 854ms
  ❌ TestDataException: Key 'users.validUser' not found in test data file: testData
  📍 TestDataManager.ts:111:13
  [Stack Trace]
  📸 Screenshot(s): 1 attached

📄 ui/login.spec.ts
  Should successfully login with valid credentials
  Project: firefox | Duration: 4ms
  ❌ browserType.launch: Target page, context or browser has been closed
  📍 Browser launch failed - Firefox process exited with code 2147483651
```

---

## 🎯 Validation Summary

### ✅ All Checks Passed
- [x] Nested suite structure correctly parsed (2 levels)
- [x] Both tests extracted from nested suites
- [x] Status "failed" correctly mapped to "FAILED"
- [x] Durations formatted: 8854ms → "8s 854ms", 4ms → "4ms"
- [x] Total duration: 14667.128ms → "14s 667ms"
- [x] Timestamp formatted: ISO → "Dec 23, 2025, 19:46:23"
- [x] Metrics calculated: 0 passed, 2 failed → 0% pass rate
- [x] Badge logic: 0 passed, 2 failed → "❌ Failed" (Red)
- [x] Error messages truncated and formatted
- [x] Screenshots detected (1 for test 1, 0 for test 2)
- [x] Files grouped in Failures section

### 🔒 Defensive Programming Applied
- Null/undefined checks for all optional fields
- Array length validation before iteration
- Default values for missing duration
- Safe error extraction with truncation
- Recursive suite processing for any nesting level

---

## 🚦 Status Legend

| Badge | Condition | Color |
|-------|-----------|-------|
| ✅ Passed | failed=0 | 🟢 Green |
| ⚠️ Partial | passed>0 AND failed>0 | 🟡 Yellow |
| ❌ Failed | passed=0 OR failed>0 | 🔴 Red |

**Current Result: ❌ Failed (0 passed, 2 failed)**
