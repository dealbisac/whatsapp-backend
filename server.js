//importing
import express from 'express';
import mongoose from 'mongoose';
import dbMessages from './dbMessages';
import Messages from './dbMessages.js'

//app config
const app = express();
const port = process.env.PORT || 9000;

//middlewares
app.use(express.json());

//DB config
const connection_url = 'mongodb+srv://admin:Dealbisac@3790@cluster0.keogd.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//???

//api routes
app.get('/', (request, response) => response.status(200).send('hello world'));

app.post('/messages/new', (request, response) => {
    const dbMessage = request.body

    dbMessages.create(dbMessage, (error, data) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.status(201).send(data);
        }
    })
})

//listener
app.listen(port, () => console.log(`Listening in localhost:${port}`));