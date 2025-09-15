/**
 * Security Scanner for Expense Manager
 * 
 * This script scans the codebase for potential security issues:
 * - Hardcoded API keys and secrets
 * - Insecure configurations
 * - Missing environment variables
 * - Potential security vulnerabilities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Directories to scan
  scanDirs: ['./app', './backend'],
  
  // File extensions to scan
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.md', '.json', '.env.example'],
  
  // Files to ignore
  ignoreFiles: ['node_modules', 'dist', '.next', 'package-lock.json'],
  
  // Patterns to detect
  patterns: [
    {
      name: 'API Key Pattern',
      regex: /(['"](sk|pk|key|api[_-]?key|token|secret|password|credential)['"]:?\s*['"])[a-zA-Z0-9_=+\/\-]{8,}(['"])/gi,
      severity: 'HIGH',
      message: 'Potential hardcoded API key or secret found'
    },
    {
      name: 'Resend API Key',
      regex: /(['"](re_)[a-zA-Z0-9]{10,}['"])/g,
      severity: 'CRITICAL',
      message: 'Hardcoded Resend API key found'
    },
    {
      name: 'JWT Secret',
      regex: /(['"](jwt[_-]?secret)['"]:?\s*['"][a-zA-Z0-9_=+\/\-]{8,}['"])/gi,
      severity: 'HIGH',
      message: 'Hardcoded JWT secret found'
    },
    {
      name: 'Insecure JWT Configuration',
      regex: /expiresIn:\s*['"](100d|365d|1000d|999d)/g,
      severity: 'MEDIUM',
      message: 'JWT token with very long expiration time'
    },
    {
      name: 'Insecure Cookie',
      regex: /cookie\(.*secure:\s*false|httpOnly:\s*false/g,
      severity: 'MEDIUM',
      message: 'Insecure cookie configuration found'
    },
    {
      name: 'Weak Password Validation',
      regex: /password.{0,30}length.{0,10}[<>]=?\s*[0-6]\b/g,
      severity: 'MEDIUM',
      message: 'Weak password validation (less than 7 characters)'
    },
    {
      name: 'Email Logging',
      regex: /console\.log\([^)]*\bemail\b[^)]*\)/g,
      severity: 'LOW',
      message: 'Email address might be logged, potential privacy issue'
    },
    {
      name: 'Hardcoded URL',
      regex: /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?(\/[a-zA-Z0-9\-._~:\/\?#\[\]@!$&'\(\)\*\+,;=]*)?/g,
      severity: 'INFO',
      message: 'Hardcoded URL found, consider using environment variables'
    }
  ],
  
  // Required environment variables
  requiredEnvVars: [
    'MONGODB_URI',
    'JWT_SECRET',
    'RESEND_API_KEY',
    'FRONTEND_URL'
  ]
};

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bright: '\x1b[1m'
};

// Results storage
const results = {
  issues: [],
  filesScanned: 0,
  issuesFound: 0,
  criticalIssues: 0,
  highIssues: 0,
  mediumIssues: 0,
  lowIssues: 0,
  infoIssues: 0
};

/**
 * Check if a file should be scanned based on extension and ignore list
 */
function shouldScanFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath);
  
  // Check if file should be ignored
  if (config.ignoreFiles.some(ignore => filePath.includes(ignore))) {
    return false;
  }
  
  // Check if extension should be scanned
  return config.extensions.includes(ext);
}

/**
 * Scan a file for security issues
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativeFilePath = path.relative(process.cwd(), filePath);
    results.filesScanned++;
    
    // Check each pattern
    config.patterns.forEach(pattern => {
      const matches = content.matchAll(pattern.regex);
      for (const match of matches) {
        // Extract line number
        const lines = content.substring(0, match.index).split('\n');
        const lineNumber = lines.length;
        
        // Get context (the line where the issue was found)
        const lineContent = content.split('\n')[lineNumber - 1].trim();
        
        // Add issue to results
        results.issues.push({
          file: relativeFilePath,
          line: lineNumber,
          pattern: pattern.name,
          severity: pattern.severity,
          message: pattern.message,
          context: lineContent
        });
        
        // Update counters
        results.issuesFound++;
        switch (pattern.severity) {
          case 'CRITICAL': results.criticalIssues++; break;
          case 'HIGH': results.highIssues++; break;
          case 'MEDIUM': results.mediumIssues++; break;
          case 'LOW': results.lowIssues++; break;
          case 'INFO': results.infoIssues++; break;
        }
      }
    });
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error.message);
  }
}

/**
 * Recursively scan a directory for files
 */
function scanDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip ignored directories
        if (!config.ignoreFiles.some(ignore => entry.name.includes(ignore))) {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile() && shouldScanFile(fullPath)) {
        scanFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

/**
 * Check for required environment variables
 */
function checkEnvironmentVariables() {
  console.log(`\n${colors.bright}${colors.blue}Checking Environment Variables${colors.reset}`);
  
  // Check .env.example file
  const envExamplePath = path.join(process.cwd(), 'backend', 'env.example');
  if (fs.existsSync(envExamplePath)) {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    
    config.requiredEnvVars.forEach(envVar => {
      if (!envExample.includes(envVar)) {
        console.log(`${colors.yellow}⚠️ Required environment variable ${colors.bright}${envVar}${colors.reset}${colors.yellow} not found in env.example${colors.reset}`);
      }
    });
  } else {
    console.log(`${colors.yellow}⚠️ No env.example file found in backend directory${colors.reset}`);
  }
  
  // Check for .env files that might be committed
  const envFiles = [];
  config.scanDirs.forEach(dir => {
    try {
      const output = execSync(`find ${dir} -name ".env" -type f`, { encoding: 'utf8' });
      if (output.trim()) {
        envFiles.push(...output.trim().split('\n'));
      }
    } catch (error) {
      // Ignore errors (find command might not be available on all platforms)
    }
  });
  
  if (envFiles.length > 0) {
    console.log(`${colors.red}❌ Found ${envFiles.length} .env files that might contain secrets:${colors.reset}`);
    envFiles.forEach(file => {
      console.log(`   ${colors.red}${file}${colors.reset}`);
    });
  } else {
    console.log(`${colors.green}✅ No .env files found in scanned directories${colors.reset}`);
  }
}

/**
 * Print a summary of the scan results
 */
function printSummary() {
  console.log(`\n${colors.bright}${colors.blue}Security Scan Summary${colors.reset}`);
  console.log(`${colors.white}Files scanned: ${results.filesScanned}${colors.reset}`);
  console.log(`${colors.white}Issues found: ${results.issuesFound}${colors.reset}`);
  console.log(`  ${colors.red}Critical: ${results.criticalIssues}${colors.reset}`);
  console.log(`  ${colors.magenta}High: ${results.highIssues}${colors.reset}`);
  console.log(`  ${colors.yellow}Medium: ${results.mediumIssues}${colors.reset}`);
  console.log(`  ${colors.cyan}Low: ${results.lowIssues}${colors.reset}`);
  console.log(`  ${colors.blue}Info: ${results.infoIssues}${colors.reset}`);
}

/**
 * Print detailed results of the scan
 */
function printDetailedResults() {
  if (results.issues.length === 0) {
    console.log(`\n${colors.green}${colors.bright}No security issues found!${colors.reset}`);
    return;
  }
  
  console.log(`\n${colors.bright}${colors.blue}Detailed Security Issues${colors.reset}`);
  
  // Group issues by severity
  const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
  
  severities.forEach(severity => {
    const severityIssues = results.issues.filter(issue => issue.severity === severity);
    if (severityIssues.length === 0) return;
    
    let severityColor;
    switch (severity) {
      case 'CRITICAL': severityColor = colors.red; break;
      case 'HIGH': severityColor = colors.magenta; break;
      case 'MEDIUM': severityColor = colors.yellow; break;
      case 'LOW': severityColor = colors.cyan; break;
      case 'INFO': severityColor = colors.blue; break;
      default: severityColor = colors.white;
    }
    
    console.log(`\n${severityColor}${colors.bright}${severity} Issues (${severityIssues.length})${colors.reset}`);
    
    severityIssues.forEach(issue => {
      console.log(`\n${severityColor}${issue.file}:${issue.line} - ${issue.pattern}${colors.reset}`);
      console.log(`  ${colors.white}${issue.message}${colors.reset}`);
      console.log(`  ${colors.bright}${colors.white}Context:${colors.reset} ${issue.context}`);
    });
  });
}

/**
 * Main function to run the security scan
 */
function runSecurityScan() {
  console.log(`\n${colors.bright}${colors.green}Starting Security Scan for Expense Manager${colors.reset}`);
  console.log(`${colors.white}Scanning directories: ${config.scanDirs.join(', ')}${colors.reset}`);
  
  // Scan each directory
  config.scanDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      scanDirectory(fullPath);
    } else {
      console.error(`Directory not found: ${fullPath}`);
    }
  });
  
  // Check environment variables
  checkEnvironmentVariables();
  
  // Print results
  printSummary();
  printDetailedResults();
  
  // Exit with error code if critical or high issues found
  if (results.criticalIssues > 0 || results.highIssues > 0) {
    console.log(`\n${colors.red}${colors.bright}❌ Security scan failed due to critical or high severity issues${colors.reset}`);
    console.log(`${colors.red}Please fix these issues before deploying to production${colors.reset}`);
    process.exit(1);
  } else if (results.mediumIssues > 0) {
    console.log(`\n${colors.yellow}${colors.bright}⚠️ Security scan completed with warnings${colors.reset}`);
    console.log(`${colors.yellow}Consider fixing medium severity issues${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.green}${colors.bright}✅ Security scan completed successfully${colors.reset}`);
    process.exit(0);
  }
}

// Run the security scan
runSecurityScan();