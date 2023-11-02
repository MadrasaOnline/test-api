const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000; // Choose any available port

app.use(express.json());

// Endpoint to get all data from the JSON file
app.get('/data', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the file');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint to add new data to the JSON file
app.post('/data', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the file');
      return;
    }

    const jsonData = JSON.parse(data);
    const newData = req.body; // Assuming the request body contains the new data to add

    // Add the new data to your JSON
    jsonData.push(newData);

    fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing to the file');
        return;
      }
      res.json(jsonData); // Return the updated data
    });
  });
});

// Endpoint to edit specific data in the JSON file
app.put('/data/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body; // Updated data

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the file');
      return;
    }

    const jsonData = JSON.parse(data);
    const dataIndex = jsonData.findIndex(item => item.id === parseInt(id));

    if (dataIndex !== -1) {
      jsonData[dataIndex] = { ...jsonData[dataIndex], ...updatedData };
    } else {
      res.status(404).send('Data not found');
      return;
    }

    fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing to the file');
        return;
      }
      res.json(jsonData); // Return the updated data
    });
  });
});

// Endpoint to delete specific data from the JSON file
app.delete('/data/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the file');
      return;
    }

    let jsonData = JSON.parse(data);
    jsonData = jsonData.filter(item => item.id !== parseInt(id));

    fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing to the file');
        return;
      }
      res.json(jsonData); // Return the updated data
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
