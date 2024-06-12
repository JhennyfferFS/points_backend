const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

const entitySchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sigla: { type: String, required: true },
  estado: { type: String, required: true },
});

const sportSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true },
});

const Entity = mongoose.model('Entity', entitySchema);
const Sport = mongoose.model('Sport', sportSchema);

app.get('/entities', async (req, res) => {
  const entities = await Entity.find();
  res.json(entities);
});

app.post('/entities', async (req, res) => {
  try {
    const { nome, sigla, estado } = req.body;
    const newEntity = new Entity({ nome, sigla, estado });
    await newEntity.save();
    res.status(201).json(newEntity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/sports', async (req, res) => {
  const sports = await Sport.find();
  res.json(sports);
});

app.post('/sports', async (req, res) => {
  try {
    const { nome, tipo } = req.body;
    const newSport = new Sport({ nome, tipo });
    await newSport.save();
    res.status(201).json(newSport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});