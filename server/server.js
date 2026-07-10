const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {
   res.json({message:"Welcome to the EEU Systems Registry API! "});
});