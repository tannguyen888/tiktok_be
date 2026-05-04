/**
 * Migration: Add avatar and bio fields to User collection
 * Run: node migrations/runMigration.js 001_add_avatar_bio_fields
 */

const mongoose = require('mongoose');

module.exports = {
  name: '001_add_avatar_bio_fields',
  description: 'Add avatar and bio fields to User collection',
  
  up: async () => {
    try {
      const User = mongoose.model('User');
      
      // Update all users to add avatar and bio if not exist
      await User.updateMany(
        {},
        {
          $set: {
            avatar: '',
            bio: ''
          }
        },
        { upsert: false }
      );
      
      console.log('✓ Migration 001: Added avatar and bio fields to users');
      return true;
    } catch (error) {
      console.error('✗ Migration 001 failed:', error);
      throw error;
    }
  },

  down: async () => {
    try {
      const User = mongoose.model('User');
      
      // Remove avatar and bio fields
      await User.updateMany(
        {},
        {
          $unset: {
            avatar: '',
            bio: ''
          }
        }
      );
      
      console.log('✓ Migration 001 rolled back');
      return true;
    } catch (error) {
      console.error('✗ Migration 001 rollback failed:', error);
      throw error;
    }
  }
};
