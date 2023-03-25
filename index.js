const { default: axios } = require('axios');
const express = require('express');
const { CoolController } = require('./controllers/cool.controller');
const { KittyController } = require('./controllers/kitty.controller');
const app = express();
const port = 3000;

const coolController = new CoolController();
let flag_s = false;

// Define your routes here
app.get('/', (req, res) => {
  res.send('Hello World! Try /cat to receive a cool kitty image');
});

app.get('/cat', async (req, res) => {
    const catUrl = await new KittyController().getCoolCat();
    try {
        const imageResponse = await axios.get(catUrl, { responseType: 'arraybuffer' });
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': imageResponse.data.length
        });
        res.end(imageResponse.data, 'binary');
        //run funny part
        if (!flag_s) {
            flag_s = true;
            coolController.doFunnyThings();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching image ' + catUrl);
    }
});

app.get('/enough', async (req, res) => {
    let out = coolController.cleanTheMess();
    if (out){
        res.status(200).send('Cleaned!');
    }else {
        res.status(500).send('Oops!');
    }
    flag_s = false;
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
