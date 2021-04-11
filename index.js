const express = require('express')
const app = express()
const port = 3000
const mongoClient = require('mongodb').MongoClient
const { ObjectId } = require('mongodb');
(async() => {
    const url = 'mongodb://localhost:27017'
    const dbNome = 'mensagenspessoais'
    const cliente = await mongoClient.connect(url, {useUnifiedTopology: true})
    const db = cliente.db(dbNome)

    const mensagens = db.collection('mensagens');

     app.use(express.json());

    //Read All (Ler Tudo)
    app.get('/mensagens', async (req, res) => {
        res.send(await mensagens.find().toArray())
    })

    //Read Single (Ler individual)
    app.get('/mensagens/:id',async(req,res)=>{
        const id= req.params.id;
        const mens = await mensagens.findOne({_id: ObjectId(id)})
        res.send(mens)
        
     })

    //Criar mensagem
    app.post('/mensagens',async(req,res)=>{
        const mensagem=req.body
        await mensagens.insertOne(mensagem)
        res.send('Mensagem criada com sucesso')
    })

    //Altera individual
    app.put('/mensagens/:id',async(req,res)=>{
        const id=req.params.id;
        const mensagem = req.body
        await mensagens.updateOne(
        {
            _id: ObjectId(id)},
            {
                $set: {...mensagem}
            }
        )
        res.send('Alteração individual por ID realizada com sucesso');
    });


    //Remover mensagem
    app.delete('/mensagens/:id',async(req,res) =>{
        //transforma o id em string
        const id = req.params.id;
        //deleteOne é 1 elemento, await faz rodar a proxima linha do código so dps da forma assincrona
        await mensagens.deleteOne({ _id: ObjectId(id)});
        res.send('Mensagem removida com sucesso');
    })  



app.listen(port, () => {
  console.info('Servidor rodando em localhost:' + port)
  console.log('Log Servidor')
  console.warn('Warn servidor')
})


})()