import { Router } from "express";
import { MessageFM} from "../../dao/Mongo/classes/DBmanager.js";

const routerMessage = Router();
/*****************************************************************GET*************************************************************/
  routerMessage.get("/messages", async (req, res) => {
    try {
      let messages = await MessageFM.getMessages();
      const limit = req.query.limit;
      if (limit && !isNaN(Number(limit))) {
        messages = messages.slice(0, limit);
      }
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
  
  routerMessage.get("/messages/:mid", async (req, res) => {
    try {
      const mid = req.params.mid;
      let message = await MessageFM.getMessageId(mid);
      res.status(200).send(message);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
  /*****************************************************************POST*************************************************************/
  routerMessage.post("/messages", async (req, res) => {
    try {
        const newMessage = req.body;
        const response = await MessageFM.addMessage(newMessage);
        res.status(200).send(response);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
  /*****************************************************************DELETE*************************************************************/
  routerMessage.delete("/messages/:mid", async (req, res) => {
    try {
      const mid = req.params.mid;
      await MessageFM.deleteMessage(mid);
      res.status(200).json(mid);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

 export default routerMessage;