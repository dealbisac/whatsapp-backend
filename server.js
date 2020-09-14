//importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: '1072653',
    key: 'b4f37ba92f296894cc01',
    secret: 'c7d52ccb884d23e0f9d4',
    cluster: 'ap2',
    encrypted: true
});

//middlewares
app.use(express.json());
app.use(cors());


//DB config
const connection_url = 'mongodb+srv://admin:Dealbisac@3790@cluster0.keogd.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//???
const db = mongoose.connection;
db.once("open", () => {
    console.log("DB COnnected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log(change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            });
        } else {
            console.log("Error trigerring Pusher");
        }
    });
});

//api routes
app.get('/', (request, response) => response.status(200).send('hello world'));

app.post('/messages/new', (request, response) => {
    const dbMessage = request.body

    Messages.create(dbMessage, (error, data) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.status(201).send(data);
        }
    })
})

app.get('/messages/sync', (request, response) => {
    const dbMessage = request.body

    Messages.find(dbMessage, (error, data) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.status(200).send(data);
        }
    })
})

//listener
app.listen(port, () => console.log(`Listening in localhost:${port}`));