const express = require('express')
const app = express()

const PORT = 8080

const fs = require("fs");

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo
    }

    save = async (producto) => {
        try {
            if (fs.existsSync(this.archivo)) {
                let info = await fs.promises.readFile(this.archivo, "utf8");
                let result = JSON.parse(info)
                if (result.length > 0) {
                    let lastId = result[result.length - 1].id + 1
                    let newProduct = {
                        id: lastId,
                        ...producto
                    }
                    result.push(newProduct)
                    await fs.promises.writeFile(this.archivo, JSON.stringify(result, null, 2));
                    return lastId
                } else {
                    let lastId = 1
                    let newProduct = {
                        id: lastId,
                        ...producto
                    }
                    result.push(newProduct)
                    await fs.promises.writeFile(this.archivo, JSON.stringify(result, null, 2));
                    return lastId
                }
            } else {
                let newProduct = {
                    id: 1,
                    title: producto.title,
                    price: producto.price,
                    thumbnail: producto.thumbnail
                }
                await fs.promises.writeFile(this.archivo, JSON.stringify([newProduct], null, 2));
                return 1
            }
        } catch (error) {
            console.log(error)
        }
    }

    getById = async (number) => {
        try {
            if (fs.existsSync(this.archivo)) {
                let info = await fs.promises.readFile(this.archivo, "utf8");
                let result = JSON.parse(info)
                let encontrado = result.find(element => element.id === number)
                return encontrado
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async () => {
        try {
            if (fs.existsSync(this.archivo)) {
                let info = await fs.promises.readFile(this.archivo, "utf8");
                let result = JSON.parse(info)
                return result
            }
        } catch (error) {
            console.log(error)
        }
    }

    deleteById = async (number) => {
        try {
            let array = await this.getAll()
            let eliminar = await this.getById(number)
            let newArray = await array.filter(item => item.id !== eliminar.id)
            await fs.promises.writeFile(this.archivo, JSON.stringify(newArray, null, 2));
        } catch (error) {
            console.log(error)
        }
    }

    deleteAll = async () => {
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify([]))
        } catch (error) {
            console.log(error)
        }
    }
}

let contenedor = new Contenedor("productos.txt");

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