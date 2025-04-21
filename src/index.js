const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs').promises;
const path = require('path');
const helpers = require('./shared/helper')

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
const { Client } = require("pg");
const crudOpsDto = require('./sql-crud/crud');

const API_URL = 'https://tnnbvcentres-cmse.onrender.com/tnnBvCentres/';

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/centres', async (req, res) => {
  try {
    const data = await crudOpsDto.getCentres();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from external API' });
  }
});

app.post('/api/create-centre', async (req, res) => {
  const data = req.body;

  try {
    crudOpsDto.createCentre(data);
    res.status(201).json({ message: 'Centre created successfully'});
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.delete('/api/centre/:id', async (req, res) => {
  try {
    const deleted = await crudOpsDto.deleteCentre(req.params.id);
    if (deleted) {
      res.json({ message: 'Deleted successfully', data: deleted });
    } else {
      res.status(404).json({ message: 'Centre not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.put('/api/centre/:id', async (req, res) => {
  try {
    const dbModel = helpers.transformToDbModel(req.body);
    console.log('dbModel', dbModel);
    const updatedData = await crudOpsDto.updateCentre(req.params.id, dbModel);
    if (updatedData) {
      res.json({ message: 'Updated successfully', data: updatedData });
    } else {
      res.status(404).json({ message: 'Centre not found' });
    }
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});