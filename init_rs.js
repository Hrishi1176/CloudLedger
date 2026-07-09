const { MongoClient } = require('mongodb');

async function run() {
  const client = new MongoClient('mongodb://127.0.0.1:27018/?directConnection=true');
  try {
    await client.connect();
    console.log('Connected to MongoDB on port 27018.');
    const adminDb = client.db('admin');
    
    // Check if already initiated
    try {
      const status = await adminDb.command({ replSetGetStatus: 1 });
      console.log('Replica set status:', status.set);
      console.log('Replica set already initialized!');
      return;
    } catch (e) {
      console.log('Replica set not initialized yet. Initiating...');
    }

    const result = await adminDb.command({
      replSetInitiate: {
        _id: 'rs0',
        members: [{ _id: 0, host: 'localhost:27018' }]
      }
    });
    console.log('Replica set initiated successfully:', result);
  } catch (err) {
    console.error('Failed to initiate replica set:', err);
  } finally {
    await client.close();
  }
}

run();
