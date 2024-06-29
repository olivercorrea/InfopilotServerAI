import { getDB } from '../models/messageModel.js';
import ollama from 'ollama';

export async function getBotGreeting(req, res) {
  const model = "mistral";
  const messages = [{ role: "system", content: "Cuando el usuario te haga preguntas, debes responder como si fueras un ingeniero experto en el uso de maquinaria de procesamiento de minerales." }];

  try {
    const output = await ollama.chat({ model: model, messages: messages });
    const response = output.message.content;

    const db = getDB();
    await db.collection('respuestas').insertOne({ role: "bot", content: response });

    res.status(200).json({ message: response });
  } catch (error) {
    console.error("Error obteniendo la respuesta del bot:", error);
    res.status(500).json({ error: "Error al obtener la respuesta del bot" });
  }
}

export async function saveUserMessage(req, res) {
  const { message } = req.body;
  const db = getDB();

  try {
    await db.collection('respuestas').insertOne({ role: "user", content: message });

    const model = "mistral";
    const messages = [{ role: "user", content: message }];

    const output = await ollama.chat({ model: model, messages: messages });
    const botResponse = output.message.content;

    await db.collection('respuestas').insertOne({ role: "bot", content: botResponse });

    res.status(200).json({ botMessage: botResponse });
  } catch (error) {
    console.error("Error guardando el mensaje del usuario:", error);
    res.status(500).json({ error: "Error al guardar el mensaje del usuario" });
  }
}
