const express = require('express');
require('./db/mongoose');
const userRouter = require('../src/routers/user');
const taskRouter = require('../src/routers/task');

const app = express();
const PORT = process.env.PORT;

// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   next();
// });

// app.use((req, res, next) => {
//   if (req.method === 'DELETE') {
//     res.status(503).send('Unavaliable!');
//   } else {
//     next();
//   }
// });

// const multer = require('multer');

// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000,
//   },
// });

// const errorMiddleware = (req, res, next) => {
//   throw new Error('error from middleware');
// };

// app.post(
//   '/upload',
//   errorMiddleware,
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

//alt
// app.post(
//   '/upload',
//   upload.single('upload'),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => console.log('Server started at port ' + PORT));
