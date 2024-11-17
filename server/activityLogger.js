const firestore = require('./firebaseAdmin'); // Firebase Admin SDK instance

const logUserActivity = async ({ username, type, details }) => {
  try {
    const activity = {
      username,
      type,
      details,
      datetime: new Date().toISOString(),
    };

    await firestore.collection('userActivity').add(activity);
    console.log(`Activity logged: ${username}, ${type}`);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logUserActivity;
