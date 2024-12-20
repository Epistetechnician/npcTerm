import { DataIngestionService } from '../services/dataIngestion';
import { supabaseAdmin } from '../lib/supabaseClient';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testPerpIngestion() {
  try {
    console.log('Starting perpetuals data ingestion test...');
    
    const ingestionService = new DataIngestionService();
    
    // Test Supabase connection first
    console.log('Testing Supabase connection...');
    const isConnected = await ingestionService.testSupabaseConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }
    
    // Step 1: Run Python ingestion script
    console.log('Running Python perpetuals ingestion...');
    const { exec } = require('child_process');
    await new Promise((resolve, reject) => {
      exec('python3 scripts/ingest_perp_data.py', (error: any, stdout: string, stderr: string) => {
        if (error) {
          console.error('Python script error:', error);
          reject(error);
          return;
        }
        console.log('Python output:', stdout);
        if (stderr) console.error('Python stderr:', stderr);
        resolve(stdout);
      });
    });
    
    // Step 2: Sync to Supabase
    console.log('Syncing perpetuals data to Supabase...');
    const result = await ingestionService.syncPerpMetricsToSupabase();
    console.log('Sync result:', result);
    
    // Step 3: Verify data
    const { data, error } = await supabaseAdmin
      .from('perpetual_metrics')
      .select('*')
      .limit(5);
      
    if (error) throw error;
    
    console.log('Sample data:', data);
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testPerpIngestion(); 