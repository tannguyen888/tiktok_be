/**
 * Migration Template - Copy and modify this for new migrations
 * Run: node migrations/runMigration.js up <migration_name>
 */

const mongoose = require('mongoose');

module.exports = {
  // Migration name (must be unique and start with number)
  name: '999_migration_template',
  
  // Description of what this migration does
  description: 'Migration description here',
  
  // Run when going UP
  up: async () => {
    try {
      // Example: Update User model
      // const User = mongoose.model('User');
      // await User.updateMany({}, { $set: { newField: 'value' } });
      
      console.log('✓ Migration executed successfully');
      return true;
    } catch (error) {
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  // Run when going DOWN (rollback)
  down: async () => {
    try {
      // Example: Remove added field
      // const User = mongoose.model('User');
      // await User.updateMany({}, { $unset: { newField: '' } });
      
      console.log('✓ Migration rolled back successfully');
      return true;
    } catch (error) {
      console.error('✗ Migration rollback failed:', error);
      throw error;
    }
  }
};
