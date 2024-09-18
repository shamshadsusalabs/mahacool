const admin = require('firebase-admin');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // For generating unique file names

// Initialize Firebase Admin SDK
const serviceAccount = require('./mahacool-872ff-firebase-adminsdk-ky9vd-848f5874ce.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'mahacool-872ff.appspot.com' // Updated to 'appspot.com'
});

// Cloud Storage
const bucket = admin.storage().bucket();

// Upload a file to Firebase Storage
const uploadFile = async (file) => {
  const { originalname, buffer } = file;
  const uniqueFilename = `${uuidv4()}-${originalname}`;
  const fileUpload = bucket.file(uniqueFilename);

  await fileUpload.save(buffer, {
    metadata: {
      contentType: file.mimetype,
    },
    public: true, // Make the file public
  });

  // Get the public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
  return publicUrl;
};

module.exports = {
  uploadFile,
};
