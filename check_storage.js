import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://grehdbulpfgtphrvemup.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Checking storage buckets...');

if (!supabaseServiceKey) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in environment.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkStorage() {
    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error('❌ Error listing buckets:', error);
            return;
        }

        console.log('✅ Connected to Supabase Storage.');
        console.log('📋 Current Buckets:');

        if (buckets.length === 0) {
            console.log('   (No buckets found)');
        }

        buckets.forEach(b => {
            console.log(`   - [${b.name}] (public: ${b.public}, size_limit: ${b.file_size_limit})`);
        });

        const avatarsBucket = buckets.find(b => b.name === 'avatars');
        if (avatarsBucket) {
            console.log('\n✅ Bucket "avatars" exists!');
        } else {
            console.error('\n❌ Bucket "avatars" DOES NOT EXIST.');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

checkStorage();
