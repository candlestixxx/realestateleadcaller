import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Initializing Jules AI Real Estate Concierge...\n");

function run(command, successMessage) {
    try {
        console.log(`Executing: ${command}`);
        execSync(command, { stdio: 'inherit' });
        if (successMessage) console.log(`✅ ${successMessage}\n`);
    } catch (error) {
        console.error(`❌ Failed to execute: ${command}`);
        process.exit(1);
    }
}

// 1. Check for Environment Configuration
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log("⚠️ No .env file found. Copying from .env.example...");
    run('cp .env.example .env', "Created .env file.");
} else {
    console.log("✅ .env file exists.\n");
}

// 2. Install Dependencies
console.log("📦 Installing npm packages...");
run('npm install', "Dependencies installed.");

// 3. Database Initialization
console.log("🗄️ Initializing SQLite Database...");
run('npx prisma db push', "Database schema pushed.");
run('npx prisma generate', "Prisma client generated.");

// 4. Seed Database
console.log("🌱 Seeding Mock Data & Admin Account...");
run('npx ts-node --compiler-options \'{"module":"CommonJS"}\' prisma/seed.ts', "Database seeded.");

console.log(`
🎉 Initialization Complete!

You can now start the application:
1. Run the dev server: npm run dev
2. In a separate terminal, run Inngest: npx inngest-cli@latest dev

Login at http://localhost:3000 with:
Email: admin@example.com
Password: password123
`);
