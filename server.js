const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = '3000';

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "";

app.use(bodyParser.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
    try {
        const userInput = req.body.userInput;
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const chat = model.startChat({
            generationConfig,
            history: [
            ],
        });

        const result = await chat.sendMessage(userInput);

        if (result && result.response) {
            const responseText = result.response.text();

            if (responseText) {
                res.json({text: responseText});
            } else {
                res.status(500).json({error: 'Respuesta vacía del modelo'});
            }
        } else {
            res.status(500).json({error: 'Respuesta vacía del modelo'});
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({error: 'Error en el servidor'});

    }
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})