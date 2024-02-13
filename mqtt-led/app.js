const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const ejs = require('ejs');

const app = express();
const port = 3000;

// MQTT Configuration
const mqttClient = mqtt.connect('mqtt://192.168.0.108');


app.set('view engine', 'ejs');

// Express Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve HTML page
app.get('/', (req, res) => {
    const message = req.query.message || '';  // Retrieve message from query parameter
    res.render('index', { message });  // Render the EJS template with the message
});

// Handle LED control
app.post('/control-led', (req, res) => {
    const { action } = req.body;
    const topic = 'led/control';

    console.log("req body ", req.body);
    // Publish the action to the MQTT topic
    mqttClient.publish(topic, action);

    // Set a message to be displayed on the page
    const message = `LED status is "${action}"`;

    // Redirect back to the root page with the message as a query parameter
    res.redirect(`/?message=${encodeURIComponent(message)}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
