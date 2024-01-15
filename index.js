require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT
const mongoose = require("mongoose")
const Schema = mongoose.Schema

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Conexión exitosa con la BBDD!!!")
  })
  .catch((err) =>
    console.log("Hubo un error al conectarnos a la BBDD", { err })
  )

const taskSchema = new Schema({
  name: String,
  done: Boolean,
  // createdBy:
})

const Task = mongoose.model("Task", taskSchema, "Tasks")

// Middlewares
app.use(express.static("public"))
app.use(express.json())

// Configurar RUTAS
app.get("/api/tasks", function (req, res) {
  Task.find()
    .then((tasks) => {
      res.status(200).json({ ok: true, data: tasks })
    })
    .catch((err) => {
      res
        .status(400)
        .json({ ok: true, message: "Hubo un problema al obtener las tareas" })
    })
})

app.post("/api/tasks", function (req, res) {
  const body = req.body
  console.log({ body })
  Task.create({
    name: body.text,
    done: false,
    hello: "HOLA",
  })
    .then((createdTask) => {
      res.status(201).json({
        ok: true,
        message: "Tarea creada con éxito",
        data: createdTask,
      })
    })
    .catch((err) => {
      res.status(400).json({ ok: false, message: "Error al crear la tarea" })
    })
})

app.put("/api/tasks/:id", function (req, res) {
  const body = req.body
  const id = req.params.id

  Task.findByIdAndUpdate(id, {
    name: body.text,
  })
    .then((updatedTask) => {
      res.status(200).json({
        ok: true,
        message: "Tarea editada con éxito",
        data: updatedTask,
      })
    })
    .catch((err) => {
      res.status(400).json({ ok: false, message: "Error al editar la tarea" })
    })
})

app.delete("/api/tasks/:id", function (req, res) {
  const id = req.params.id
  Task.findByIdAndRemove(id)
    .then((deletedTask) => {
      res.status(200).json({ ok: true, data: deletedTask })
    })
    .catch(() => {
      res
        .status(400)
        .json({ ok: false, message: "Hubo un error al eliminar la tarea" })
    })
})

// Poner a escuchar la APP en un puerto
app.listen(port, function () {
  console.log(`App listening on port: ${port}`)
})
