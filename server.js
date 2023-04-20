const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient


MongoClient.connect('mongodb+srv://elisabethgliddon:***********@cluster0.ecuvni1.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('schitts-creek-quotes')
    const quotesCollection = db.collection('quotes')
    
    //Middlewares 

    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))
    
    //Routes


    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(quotes => {
          res.render('index.ejs', { quotes: quotes })
        })
        .catch(/* ... */)
    })

    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    
    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'David' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Moira\'s quote')
        })
        .catch(error => console.error(error))
    })



    //Listen
    
    app.listen(3000, function () {
      console.log('listening on 3000')
    })

  })
  .catch(error => console.error(error))

