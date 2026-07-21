const { execSync } = require('child_process');
const command = 'npx ts-node --compiler-options "{\\\"module\\\":\\\"CommonJS\\\"}" scripts/make_all_leads_due.ts';
try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log("✅ Leads updated.");
} catch (error) {
    console.error("❌ Failed to update leads.");
    process.exit(1);
}
