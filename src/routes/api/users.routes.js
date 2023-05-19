import { Router } from "express";
import { UserFM} from "../../dao/Mongo/classes/DBmanager.js";

const routerUser = Router();

/*****************************************************************GET*************************************************************/
routerUser.get("/users", async (req, res) => {
  try {
    let users = await UserFM.getUsers();
    const limit = req.query.limit;
    if (limit && !isNaN(Number(limit))) {
      users = users.slice(0, limit);
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerUser.get("/users/:iud", async (req, res) => {
  try {
    const iud = req.params.iud;
    let user = await UserFM.getUserId(iud);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************POST*************************************************************/

routerUser.post("/users", async (req, res) => {
  try {
    const newUser = req.body;
    const response = await UserFM.addUser(newUser);
    console.log("RESPONSE SALIENDO: "+response);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************DELETE*************************************************************/

routerUser.delete("/users/:iud", async (req, res) => {
  try {
    const iud = req.params.iud;
    await UserFM.deleteUser(iud);
    res.status(200).json(iud);
  } catch (err) {
    res.status(500).json({error: err});
  }
});

export default routerUser;