const Redis = require('ioredis');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

async function validateInfrastructure() {
    console.log('🔍 Validating Infrastructure...');
    console.log(`📂 Loaded .env from: ${envPath}`);

    let allPassed = true;

    // 1. Validate Redis
    try {
        console.log('Testing Redis (L2 Cache)...');
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        const redis = new Redis(redisUrl, { maxRetriesPerRequest: 1 });
        
        await redis.set('infra_test_key', 'ok', 'EX', 10);
        const result = await redis.get('infra_test_key');
        await redis.quit();

        if (result === 'ok') {
            console.log('✅ Redis is Connected and Writable');
        } else {
            console.error('❌ Redis Read/Write Failed');
            allPassed = false;
        }
    } catch (e) {
        console.error('❌ Redis Connection Error:', e);
        allPassed = false;
    }

    // 2. Validate Supabase
    try {
        console.log('Testing Supabase (L4 Storage)...');
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!url || !key) {
            console.error('❌ Supabase Credentials Missing in .env');
            allPassed = false;
        } else {
            const supabase = createClient(url, key);
            const { count, error } = await supabase
                .from('problems')
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.error('❌ Supabase Connection Failed:', error.message);
                allPassed = false;
            } else {
                console.log(`✅ Supabase Connected. Problem Count: ${count}`);
            }
        }
    } catch (e) {
        console.error('❌ Supabase Error:', e);
        allPassed = false;
    }

    // 3. Validate Ollama (AI Service)
    try {
        const aiProvider = process.env.AI_PROVIDER || 'ollama';
        if (aiProvider === 'ollama') {
            console.log('Testing Ollama (AI Service)...');
            const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
            const model = process.env.OLLAMA_MODEL || 'deepseek-coder';
            
            const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
            const url = normalizedBaseUrl.endsWith('/api') ? `${normalizedBaseUrl}/tags` : `${normalizedBaseUrl}/api/tags`;
            
            const headers = {};
            if (process.env.OLLAMA_API_KEY) {
                headers['Authorization'] = `Bearer ${process.env.OLLAMA_API_KEY}`;
            }

            const response = await axios.get(url, { headers, timeout: 5000 });
            
            if (response.status === 200) {
                console.log(`✅ Ollama is Connected. Base URL: ${baseUrl}`);
                const models = response.data.models || [];
                const modelExists = models.find((m) => m.name.includes(model));
                if (modelExists) {
                    console.log(`✅ Model "${model}" is available`);
                } else {
                    console.warn(`⚠️ Warning: Model "${model}" not found in local Ollama instance`);
                }
            } else {
                console.error('❌ Ollama Connection Failed with status:', response.status);
                allPassed = false;
            }
        } else if (aiProvider === 'openai') {
            console.log('Testing OpenAI (AI Service)...');
            if (!process.env.OPENAI_API_KEY) {
                console.error('❌ OPENAI_API_KEY is missing');
                allPassed = false;
            } else {
                console.log('✅ OpenAI Configured (API key present)');
            }
        }
    } catch (e) {
        console.error('❌ Ollama/AI Connection Error:', e.message);
        console.warn('⚠️  Proceeding with caution - AI features may not work.');
    }

    if (allPassed) {
        console.log('🚀 Infrastructure Validation Passed!');
        process.exit(0);
    } else {
        console.error('🛑 Infrastructure Validation Failed');
        process.exit(1);
    }
}

validateInfrastructure();
