const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(DB_URL)
  .then(() => console.log('Database connection successful'))
  .catch(() => console.log('Database connection failed'));

const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://movies.isachenko.nomoredomainswork.ru',
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
