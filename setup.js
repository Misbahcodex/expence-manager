const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Expense Manager...\n');

// Create .env file for backend if it doesn't exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const backendEnvExamplePath = path.join(__dirname, 'backend', 'env.example');

if (!fs.existsSync(backendEnvPath)) {
  if (fs.existsSync(backendEnvExamplePath)) {
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
    console.log('✅ Created backend/.env file from template');
  } else {
    console.log('⚠️  Please create backend/.env file manually');
  }
} else {
  console.log('✅ backend/.env file already exists');
}

// Create .env.local file for frontend if it doesn't exist
const frontendEnvPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(frontendEnvPath)) {
  const frontendEnvContent = `NEXT_PUBLIC_API_URL=http://localhost:5000/api
`;
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created .env.local file for frontend');
} else {
  console.log('✅ .env.local file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Update backend/.env with your database credentials');
console.log('2. Update backend/.env with your email configuration (optional)');
console.log('3. Create a MySQL database named "expenses"');
console.log('4. Install backend dependencies: cd backend && npm install');
console.log('5. Install frontend dependencies: npm install');
console.log('6. Start backend: cd backend && npm run dev');
console.log('7. Start frontend: npm run dev');
console.log('\n🎉 Setup complete!');
