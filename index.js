const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const cors = require('cors');
const app= express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fm5yk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
  try{
      await client.connect();
      const database = client.db('flip_flop');
      const productCollection = database.collection('products');
      const orderCollection = database.collection('orders')

    //   get products api 
    app.get('/products', async(req,res)=>{
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    })

    // add orders api 
    
    app.post('/orders', async(req,res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
    }) 

    // get orders api 

     app.get('/orders', async(req,res)=>{
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
    })

    // delete api 

    app.delete('/orders/:key',async(req,res)=>{
        const key =req.params.key;
        const query = {_id:ObjectId(key)};
        const result = await orderCollection.deleteOne(query);
        res.json(result)

    })

  }
  finally{
    //   await client.close();
  }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Hello from server')
});

app.listen(port,()=>{
    console.log('hitting the port',port)
})