#!/usr/bin/env node

/**
 * Set up org-level GitHub Actions secrets
 * Usage: node scripts/setup-org-secrets.js
 */

const secrets = [
  { name: 'TELEGRAM_BOT_TOKEN', value: process.env.TELEGRAM_BOT_TOKEN },
  { name: 'TELEGRAM_CHAT_ID', value: process.env.TELEGRAM_CHAT_ID },
  { name: 'STRIPE_KEY', value: process.env.STRIPE_KEY },
  { name: 'SUPABASE_URL', value: process.env.SUPABASE_URL },
  { name: 'SUPABASE_KEY', value: process.env.SUPABASE_KEY },
  { name: 'GMAIL_USER', value: process.env.GMAIL_USER },
  { name: 'GMAIL_APP_PASS', value: process.env.GMAIL_APP_PASS },
  { name: 'POSTHOG_KEY', value: process.env.POSTHOG_KEY },
  { name: 'POSTHOG_API_KEY', value: process.env.POSTHOG_API_KEY },
  { name: 'GH_TOKEN', value: process.env.GH_TOKEN }
];

const org = 'thatwonguy-agent';
const token = process.env.GITHUB_PAT;

async function createSecret(secret) {
  if (!secret.value) {
    console.log(`⏭️  Skipping ${secret.name} (not set in environment)`);
    return;
  }

  const encryptedValue = Buffer.from(secret.value).toString('base64');

  const response = await fetch(
    `https://api.github.com/orgs/${org}/actions/secrets/${secret.name}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        encrypted_value: encryptedValue
      })
    }
  );

  if (response.status === 201 || response.status === 204) {
    console.log(`✅ Created secret: ${secret.name}`);
  } else if (response.status === 403) {
    console.log(`❌ Permission denied for ${secret.name} - PAT may lack admin:org scope`);
  } else {
    const error = await response.text();
    console.log(`❌ Failed to create ${secret.name}: ${response.status} - ${error}`);
  }
}

async function main() {
  console.log(`🔐 Setting up org-level secrets for @${org}\n`);

  for (const secret of secrets) {
    await createSecret(secret);
  }

  console.log('\n📝 Note: If secrets failed to create, you may need to:');
  console.log('   1. Ensure PAT has admin:org scope');
  console.log('   2. Set secrets manually at:');
  console.log(`   https://github.com/organizations/${org}/settings/secrets/actions`);
}

main();
