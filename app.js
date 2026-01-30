import express from 'express'

const app = express();

const PORT = 3000;
app.get('/', (req,res) => {
    res.send("lorem Ipsum");
});

app.listen(PORT, () =>{
console.log(`Server Running at
    http://localhost:${PORT}`)
});