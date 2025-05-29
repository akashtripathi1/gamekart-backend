import app from './index.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚙️ Server is running at port: ${PORT}`);
  connectDB()
    .then(() => {
      console.log('✅ MONGO db connected successfully');
    })
    .catch((err) => {
      console.log('MONGO db connection failed !!! ', err);
    });
});
