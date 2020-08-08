import 'dotenv/config';
import Express from 'express';
import bodyParser from 'body-parser';

const app = Express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Welcome to Appointex'));
app.use('*', (req, res) => res.status(404).json({ error: 'You seem a bit lost' }));

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
