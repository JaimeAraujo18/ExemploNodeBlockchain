const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pserver = require('./p2p-server');

// get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

// create a new app
const app = express();

// using the body parser middleware
app.use(bodyParser.json());

// create a new blockchain instance
const blockchain = new Blockchain();

// create a p2p server instance with the blockchain // and the transaction pool
const p2pserver = new P2pserver(blockchain);

// EXPOSED APIs

// api to get the blocks
app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

// api to add blocks
app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    /**
     * use the synchain method to synchronise the
     * state of the blockchain
     */
    p2pserver.syncChain();

    res.redirect('/blocks');
});

// app server configurations
app.listen(HTTP_PORT, () => {
    console.log(`listening on port ${HTTP_PORT}`);
})

p2pserver.listen(); // starts the p2pserver