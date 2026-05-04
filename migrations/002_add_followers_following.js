/**
 * Migration: Add followers and following fields to User collection
 * Run: node migrations/runMigration.js 002_add_followers_following
 */

const mongoose = require('mongoose');

module.exports = {
  name: '002_add_followers_following',
  description: 'Add followers and following fields to User collection',
  
  up: async () => {
    try {
      const User = mongoose.model('User');
      
      // Update all users to add followers and following arrays if not exist
      await User.updateMany(
        {},
        {
          $set: {
            followers: [],
            following: []
          }
        },
        { upsert: false }
      );
      
      console.log('✓ Migration 002: Added followers and following fields to users');
      return true;
    } catch (error) {
      console.error('✗ Migration 002 failed:', error);
      throw error;
    }
  },

  down: async () => {
    try {
      const User = mongoose.model('User');
      
      // Remove followers and following fields
      await User.updateMany(
        {},
        {
          $unset: {
            followers: '',
            following: ''
          }
        }
      );
      
      console.log('✓ Migration 002 rolled back');
      return true;
    } catch (error) {
      console.error('✗ Migration 002 rollback failed:', error);
      throw error;
    }
  }
};
