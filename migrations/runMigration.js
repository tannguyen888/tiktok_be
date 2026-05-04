/**
 * Migration Runner - Quản lý chạy migrations
 * Usage:
 *   node migrations/runMigration.js up              - Chạy tất cả migrations
 *   node migrations/runMigration.js up 001          - Chạy migration 001
 *   node migrations/runMigration.js down            - Rollback tất cả migrations
 *   node migrations/runMigration.js down 001        - Rollback migration 001
 *   node migrations/runMigration.js status          - Xem trạng thái migrations
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');

// Migration history collection
const MigrationSchema = new mongoose.Schema({
  name: String,
  executedAt: { type: Date, default: Date.now }
});

const Migration = mongoose.model('Migration', MigrationSchema);

// Get command line arguments
const command = process.argv[2] || 'status';
const migrationName = process.argv[3];

const migrationsDir = path.join(__dirname);

/**
 * Get all migration files
 */
function getMigrationFiles() {
  return fs.readdirSync(migrationsDir)
    .filter(file => file.match(/^\d+_.*\.js$/))
    .sort();
}

/**
 * Get executed migrations from database
 */
async function getExecutedMigrations() {
  try {
    const migrations = await Migration.find({});
    return migrations.map(m => m.name);
  } catch (error) {
    return [];
  }
}

/**
 * Run all pending migrations
 */
async function runUp(specificMigration = null) {
  try {
    console.log('\n📦 Running migrations...\n');
    
    const migrationFiles = getMigrationFiles();
    const executedMigrations = await getExecutedMigrations();
    
    let ranCount = 0;
    
    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const migration = require(migrationPath);
      
      // Skip if specific migration requested and this is not it
      if (specificMigration && !migration.name.includes(specificMigration)) {
        continue;
      }
      
      // Skip if already executed
      if (executedMigrations.includes(migration.name)) {
        console.log(`⏭️  ${migration.name} - Already executed`);
        continue;
      }
      
      try {
        await migration.up();
        
        // Record migration in database
        await Migration.create({ name: migration.name });
        
        console.log(`✅ ${migration.name} - Done\n`);
        ranCount++;
      } catch (error) {
        console.error(`❌ ${migration.name} - Error:`, error.message, '\n');
        throw error;
      }
    }
    
    if (ranCount === 0) {
      console.log('✅ All migrations are up to date!\n');
    } else {
      console.log(`✅ Successfully ran ${ranCount} migration(s)\n`);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Rollback migrations
 */
async function runDown(specificMigration = null) {
  try {
    console.log('\n📦 Rolling back migrations...\n');
    
    const migrationFiles = getMigrationFiles().reverse();
    const executedMigrations = await getExecutedMigrations();
    
    let rolledBackCount = 0;
    
    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const migration = require(migrationPath);
      
      // Skip if specific migration requested and this is not it
      if (specificMigration && !migration.name.includes(specificMigration)) {
        continue;
      }
      
      // Skip if not executed
      if (!executedMigrations.includes(migration.name)) {
        console.log(`⏭️  ${migration.name} - Not executed`);
        continue;
      }
      
      try {
        await migration.down();
        
        // Remove migration from database
        await Migration.deleteOne({ name: migration.name });
        
        console.log(`✅ ${migration.name} - Rolled back\n`);
        rolledBackCount++;
      } catch (error) {
        console.error(`❌ ${migration.name} - Error:`, error.message, '\n');
        throw error;
      }
    }
    
    if (rolledBackCount === 0) {
      console.log('✅ Nothing to rollback!\n');
    } else {
      console.log(`✅ Successfully rolled back ${rolledBackCount} migration(s)\n`);
    }
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
}

/**
 * Show migration status
 */
async function showStatus() {
  try {
    console.log('\n📋 Migration Status\n');
    console.log('─'.repeat(60));
    
    const migrationFiles = getMigrationFiles();
    const executedMigrations = await getExecutedMigrations();
    
    console.log('Migration Name                          Status');
    console.log('─'.repeat(60));
    
    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const migration = require(migrationPath);
      
      const status = executedMigrations.includes(migration.name) ? '✅ Executed' : '⏳ Pending';
      const name = migration.name.padEnd(35);
      console.log(`${name}  ${status}`);
    }
    
    console.log('─'.repeat(60));
    console.log(`Total: ${migrationFiles.length} | Executed: ${executedMigrations.length} | Pending: ${migrationFiles.length - executedMigrations.length}\n`);
  } catch (error) {
    console.error('Failed to get status:', error);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');
    
    // Run command
    if (command === 'up') {
      await runUp(migrationName);
    } else if (command === 'down') {
      await runDown(migrationName);
    } else if (command === 'status') {
      await showStatus();
    } else {
      console.log('❌ Invalid command. Use: up, down, or status');
      process.exit(1);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB\n');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
