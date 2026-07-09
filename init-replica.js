const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    console.log('Connected to MongoDB.');
    const adminDb = client.db('admin');
    
    // Check if already in replica set mode
    try {
      const status = await adminDb.command({ replSetGetStatus: 1 });
      console.log('Replica set is already initiated. Status:', status.set);
      return;
    } catch (e) {
      if (e.message.includes('no replset config') || e.message.includes('not running with --replSet')) {
        console.log('Replica set is not initiated. Checking error details:', e.message);
        
        if (e.message.includes('not running with --replSet')) {
          console.error('\nCRITICAL: The local MongoDB service is NOT running with the --replSet option configured.');
          console.error('To fix this, MongoDB must be configured to run as a single-node replica set.');
          console.error('Please configure your local MongoDB mongod.cfg with:');
          console.error('replication:\n  replSetName: rs0\n');
          return;
        }

        console.log('Initiating replica set rs0 now...');
        const initResult = await adminDb.command({
          replSetInitiate: {
            _id: 'rs0',
            members: [{ _id: 0, host: 'localhost:27017' }]
          }
        });
        console.log('Replica set initiated successfully:', initResult);
      } else {
        console.error('Error checking replica set status:', e.message);
        throw e;
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

main();
