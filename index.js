const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const morgan = require('morgan')
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

const uri = "mongodb+srv://faizulhaque2021:sJs6A4PDUX6gUBGx@portfolio.boq7zry.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 10,
});

async function run() {
    try {
        const resumeCollection = client.db("portfolio").collection("resume");
        //resume count
  app.get('/resume', async (req, res) => {
    try {
      const visitData = await resumeCollection.findOne();
      res.json({ count: visitData ? visitData.count : 0 });
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving visit count', details: error.message });
    }
  });

  app.put('/resume', async (req, res) => {
    console.log(req.body);
    try {
      let visitData = await resumeCollection.findOne();
      console.log(visitData);
      if (!visitData) {
        visitData = { count: 1 };
        await resumeCollection.insertOne(visitData);
      } else {
        visitData.count++;
        await resumeCollection.updateOne({}, { $set: { count: visitData.count } });
      }
      res.json({ count: visitData.count });
    } catch (error) {
      console.log("server");
      res.status(500).json({ error: 'Error updating visit count', details: error.message });
     }
      });
    }

    finally {
    }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
