/**
 * Migration: Add indexes to Video collection
 * Run: node migrations/runMigration.js 003_add_video_indexes
 */

const mongoose = require('mongoose');

module.exports = {
  name: '003_add_video_indexes',
  description: 'Add indexes to Video collection for better query performance',
  
  up: async () => {
    try {
      const Video = mongoose.model('Video');
      
      // Create indexes
      await Video.collection.createIndex({ user: 1, createdAt: -1 });
      await Video.collection.createIndex({ createdAt: -1 });
      await Video.collection.createIndex({ views: -1 });
      
      console.log('✓ Migration 003: Added indexes to videos collection');
      return true;
    } catch (error) {
      console.error('✗ Migration 003 failed:', error);
      throw error;
    }
  },

  down: async () => {
    try {
      const Video = mongoose.model('Video');
      
      // Drop indexes
      await Video.collection.dropIndex('user_1_createdAt_-1');
      await Video.collection.dropIndex('createdAt_-1');
      await Video.collection.dropIndex('views_-1');
      
      console.log('✓ Migration 003 rolled back');
      return true;
    } catch (error) {
      console.error('✗ Migration 003 rollback failed:', error);
      throw error;
    }
  }
};
