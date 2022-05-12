const express = require('express');
require('./db/mongoose');
const userRouter = require('../src/routers/user');
const taskRouter = require('../src/routers/task');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => console.log('Server started at port ' + PORT));
