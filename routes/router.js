const express = require("express");
const apiRequesterClass = require("../init/apiReq.js");
const RepositoryClass = require("../init/dataBase.js");

const router = express.Router();
const apiRequester = new apiRequesterClass();
const repo = new RepositoryClass();

router.get("/weather/city", async (req, res) => {

  const jsonData = await apiRequester.getResponse(`q=${req.query.q}`);

 if (!req.query.q) {
    res.status(404).send();
    return;
  } else if (jsonData.error) {
    res.status(400).send();
    return;
  }

  res.json(jsonData);
});

router.get("/weather/coordinates", async (req, res) => {

  let {lat, long} = req.query;

  const jsonData = await apiRequester.getResponse( `lat=${lat}&lon=${long}`);

  if (jsonData.error) {
    res.status(404).send();
    return;
  } 

  res.json(jsonData);
});

router.get("/favourites", async (req, res) => {
  const favList = await repo.findAll();

  let favResponses = await Promise.all(favList.map( item => {
    return apiRequester.getResponse(`q=${encodeURIComponent(item)}`);
  }));

  res.json(favResponses);
});

router.post("/favourites", async (req, res) => {
  
  const jsonData = await apiRequester.getResponse(`q=${req.query.city}`);

  if (jsonData === 400) {
    res.status(400).send();
    return;
  } 
  

  if (await repo.isIncluded(jsonData.id)) {
    console.log("This city is already in db");
    res.status(409).send();
    return;
  }

  await repo.insert(jsonData.cityName, jsonData.id);
  
  res.sendStatus(201).send();
});

router.delete("/favourites", async (req, res) => {
  const jsonData = await apiRequester.getResponse(`q=${req.query.city}`);
  await repo.delete(jsonData.id);

  res.sendStatus(204).send();
});

module.exports = {router, repo};