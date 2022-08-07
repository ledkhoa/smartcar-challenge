import express from 'express';
import router from './routes/vehicles.routes';
import { PORT } from './config';

const port = PORT || 3000;

const app = express();
app.use(express.json());

app.use('/', router);

app.listen(port, () => {
    console.log(`Smartcar API running on port ${port}`);
});
