const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const API_URL = 'https://tnnbvcentres-cmse.onrender.com/tnnBvCentres/';

//Helper function to read data for centres
async function readCentresData() {
  const data = await fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf8');
  return JSON.parse(data);
}

//Helper function to write data for centres
async function writeCentresData(data) {
  await fs.writeFile(
    path.join(__dirname, 'data', 'db.json'), 
    JSON.stringify(data, null, 2)
  )
}
//API URL = https://bv-locator-services.onrender.com 
// GET all centres
app.get('/api/centres', async (req, res) => {
  try {
    // const response = await fetch(API_URL);
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    // const data = await response.json();
    // res.json(data);
    const data = await readCentresData();
    res.json(data.tnnBvCentres);

    // await readAllCentres();
    // console.log(res.json(data.tnnBvCentres));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from external API' });
  }
});

// GET centre by ID
app.get('/api/centres/:id', async (req, res) => {
  try {
    // const response = await fetch(`${API_URL}${req.params.id}`);
    // if (!response.ok) {
    //   if (response.status === 404) {
    //     return res.status(404).json({ error: 'Centre not found' });
    //   }
    //   throw new Error('Network response was not ok');
    // }
    // const data = await response.json();
    // res.json(data);
    const data = await readCentresData();
    const centre = data.tnnBvCentres.find(u => u.id == parseInt(req.params.id));
    if (centre) {
      res.json(centre);
    } else {
      res.status(404).json({ error: 'Centre not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from external API' });
  }
});


// POST new centre
app.post('/api/centres', async (req, res) => {
  try {
    // const response = await fetch(API_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(req.body)
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to create centre');
    // }
    
    // const data = await response.json();
    // res.status(201).json(data);
    
    const data = await readCentresData();
    const newCentre = {
      id: data.tnnBvCentres.length > 0 ? Math.max(...data.tnnBvCentres.map(u => u.id)) + 1  : 1,
      ...req.body
    }
    data.tnnBvCentres.push(newCentre);
    await writeCentresData(data);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error creating centre in external API' });
  }
});

// PUT update centre
app.put('/api/centres/:id', async (req, res) => {
  try {
    // const response = await fetch(`${API_URL}${req.params.id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(req.body)
    // });
    
    // if (!response.ok) {
    //   if (response.status === 404) {
    //     return res.status(404).json({ error: 'Centre not found' });
    //   }
    //   throw new Error('Failed to update centre');
    // }
    
    const data = await readCentresData();
    const index = data.tnnBvCentres.findIndex(u => u.id == parseInt(req.params.id));
    if (index !== -1) {
      data.tnnBvCentres[index] = { ...data.tnnBvCentres[index], ...req.body };
      await writeCentresData(data);
      res.json(data.tnnBvCentres[index]);
    } else {
      res.status(404).json({ error: 'Centre not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating centre in external API' });
  }
});

//Delete Centre
app.delete('/api/centres/delete/:id', async (req, res) => {

  try {
    const data = await readCentresData();
    const index = data.tnnBvCentres.findIndex(u => u.id == req.params.id); 
    if (index != -1) {
      data.tnnBvCentres.splice(index, 1);
      await writeCentresData(data);
      res.status(204).send();
    }
  } catch {
    res.status(500).json({error: 'Error deleting the centre'})
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});