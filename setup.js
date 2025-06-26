const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Coupon Manager MERN Application...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm version: ${npmVersion.trim()}`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm first.');
  process.exit(1);
}

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('cd backend && npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create .env file for backend if it doesn't exist
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n🔧 Creating backend .env file...');
  const envContent = `MONGODB_URI=mongodb://localhost:27017/coupon-manager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Backend .env file created');
  console.log('⚠️  Please update the JWT_SECRET in backend/.env for production use');
} else {
  console.log('✅ Backend .env file already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Update the MONGODB_URI in backend/.env if needed');
console.log('3. Run "npm run dev" to start both frontend and backend servers');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n🔗 Useful commands:');
console.log('- npm run dev: Start both servers');
console.log('- npm run server: Start only backend server');
console.log('- npm run client: Start only frontend server');
console.log('- npm run build: Build frontend for production'); 