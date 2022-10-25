const express = require('express')
const app = express()

const PORT = 8080

const fs = require("fs");

const Contenedor = require("./main")

let contenedor = new Contenedor("productos.txt")

let productos
metodos = async () => {
    productos = await contenedor.getAll()
}

metodos();


const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo</h1>')
})

app.get('/productos', (req, res) => {
    res.send(`<div>${productos.map(item =>
        `<h2>
                    ${item.id}
                    ${item.title}
                    ${item.price}
                    ${item.thumbnail}
                </h2>`
    )
        }</div>`)
})

app.get('/productoRandom', (req, res) => {
    const random = Math.round(Math.random() * (productos.length-1))
    console.log(random)
    res.send(`<h2>
    ${productos[random].id}
    ${productos[random].title}
    ${productos[random].price}
    ${productos[random].thumbnail}
</h2>`)
})