/**
 * Environment Variable Checker
 * 
 * This script checks if all required environment variables are set
 * and validates their format where applicable.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file if it exists
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ Loaded environment variables from .env file');
  } else {
    console.log('⚠️ No .env file found, checking system environment variables only');
  }
} catch (error) {
  console.error('❌ Error loading .env file:', error.message);
}

// Define required environment variables and their validation rules
const requiredEnvVars = [
  {
    name: 'RESEND_API_KEY',
    required: true,
    format: /^re_[A-Za-z0-9]{24,}$/,
    description: 'Resend API key for sending emails',
    example: 're_123abc456def789ghi...',
  },
  {
    name: 'JWT_SECRET',
    required: true,
    minLength: 32,
    description: 'Secret key for JWT token generation',
    example: 'a-very-long-and-secure-random-string-here',
  },
  {
    name: 'DATABASE_URL',
    required: true,
    format: /^(mongodb|mysql|postgres):\/\/.+/,
    description: 'Database connection string',
    example: 'mongodb://username:password@host:port/database',
  },
  {
    name: 'FROM_EMAIL',
    required: true,
    format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    description: 'Email address used as sender for all emails',
    example: 'noreply@yourdomain.com',
  },
  {
    name: 'FRONTEND_URL',
    required: true,
    format: /^https?:\/\/.+/,
    description: 'URL of the frontend application',
    example: 'https://yourdomain.com',
  },
  {
    name: 'PORT',
    required: false,
    format: /^\d+$/,
    description: 'Port on which the server will run',
    example: '3000',
    default: '3000',
  },
  {
    name: 'NODE_ENV',
    required: false,
    validValues: ['development', 'production', 'test'],
    description: 'Node environment',
    example: 'production',
    default: 'development',
  },
];

// Check each environment variable
const missingVars = [];
const invalidVars = [];
const warnings = [];

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar.name];
  
  // Check if required variable is missing
  if (envVar.required && (!value || value.trim() === '')) {
    missingVars.push(envVar);
    return;
  }
  
  // Skip validation if value is not provided and not required
  if (!value && !envVar.required) {
    if (envVar.default) {
      warnings.push(`${envVar.name} is not set, will use default: ${envVar.default}`);
    }
    return;
  }
  
  // Validate format if specified
  if (value && envVar.format && !envVar.format.test(value)) {
    invalidVars.push({
      ...envVar,
      reason: `does not match required format: ${envVar.format}`,
    });
  }
  
  // Validate minimum length if specified
  if (value && envVar.minLength && value.length < envVar.minLength) {
    invalidVars.push({
      ...envVar,
      reason: `should be at least ${envVar.minLength} characters long`,
    });
  }
  
  // Validate against valid values if specified
  if (value && envVar.validValues && !envVar.validValues.includes(value)) {
    invalidVars.push({
      ...envVar,
      reason: `should be one of: ${envVar.validValues.join(', ')}`,
    });
  }
});

// Display results
console.log('\n🔍 Environment Variable Check Results:\n');

if (missingVars.length === 0 && invalidVars.length === 0) {
  console.log('✅ All required environment variables are set and valid!\n');
} else {
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:\n');
    missingVars.forEach((envVar) => {
      console.log(`  - ${envVar.name}: ${envVar.description}`);
      console.log(`    Example: ${envVar.example}\n`);
    });
  }
  
  if (invalidVars.length > 0) {
    console.log('❌ Invalid environment variables:\n');
    invalidVars.forEach((envVar) => {
      console.log(`  - ${envVar.name}: ${envVar.reason}`);
      console.log(`    Example: ${envVar.example}\n`);
    });
  }
  
  console.log('Please fix these issues to ensure proper application functionality.\n');
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('⚠️ Warnings:\n');
  warnings.forEach((warning) => {
    console.log(`  - ${warning}`);
  });
  console.log('');
}

// Check for sensitive data in environment variables
const sensitivePatterns = [
  { pattern: /password/i, name: 'Password' },
  { pattern: /secret/i, name: 'Secret' },
  { pattern: /key/i, name: 'API Key' },
  { pattern: /token/i, name: 'Token' },
];

const sensitiveVarsFound = [];

Object.keys(process.env).forEach((key) => {
  sensitivePatterns.forEach((pattern) => {
    if (pattern.pattern.test(key)) {
      const value = process.env[key];
      if (value && value.length > 0) {
        sensitiveVarsFound.push({
          name: key,
          type: pattern.name,
          masked: value.substring(0, 3) + '...' + value.substring(value.length - 3),
        });
      }
    }
  });
});

if (sensitiveVarsFound.length > 0) {
  console.log('🔒 Sensitive environment variables detected:\n');
  sensitiveVarsFound.forEach((sensitiveVar) => {
    console.log(`  - ${sensitiveVar.name} (${sensitiveVar.type}): ${sensitiveVar.masked}`);
  });
  console.log('\nEnsure these are properly secured and not hardcoded in your codebase.\n');
}

console.log('✨ Environment variable check completed!\n');