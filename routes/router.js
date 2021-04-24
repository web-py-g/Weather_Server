const express = require("express");
const apiRequesterClass = require("../init/apiReq.js");
const RepositoryClass = require("../init/dataBase.js");

const router = express.Router();
const apiRequester = new apiRequesterClass();
const repo = new RepositoryClass();

router.get("/weather/city", async (req, res) => {

  const jsonData = await apiRequester.getResponse(`q=${req.query.q}`);

  if (!req.query.q) {
  res.status(404);
  res.sendStatus(404);
  } else if (jsonData.error) {
  res.status(400);
  res.sendStatus(400);
  } else {
  res.json(jsonData);
  }
});

router.get("/weather/coordinates", async (req, res) => {

  let lat = req.query.lat;
  let long = req.query.long;

  const jsonData = await apiRequester.getResponse( `lat=${lat}&lon=${long}`);

  if (!req.query.q) {
      res.status(404).json();
      return;
  } else {
    res.json(jsonData)
  }
});

router.get("/weather/id", async (req, res) => {

  const jsonData = await apiRequester.getResponse(`id=${req.query.id}`);

  if (!req.query.q) {
      res.status(404).json();
      return;
    } else {
    res.json(jsonData)
  }
});

router.get("/favourites", async (req, res) => {
  const favList = await repo.findAll();

  let favResponses = await Promise.all(favList.map( item => {
    console.log(item);
    return apiRequester.getResponse(`q=${encodeURIComponent(item)}`);
  }));

  res.json(favResponses);
});

router.post("/favourites", async (req, res) => {
  
  if (!req.query.q) {
      res.status(404).json();
      return;
    }
  
  const jsonData = await apiRequester.getResponse(`q=${req.query.city}`);

  console.log(jsonData);

  if (await repo.isIncluded(jsonData.id)) {
    console.log("This city is already in db");
    res.sendStatus(409);
    return;
  }

  await repo.insert(jsonData.cityName, jsonData.id);
  
  res.sendStatus(201);
});

router.delete("/favourites", async (req, res) => {
  
  console.log(req.query)
  if (!req.query.q) {
      res.status(404).json();
      return;
    } 

  const jsonData = await apiRequester.getResponse(`q=${req.query.city}`);
  await repo.delete(jsonData.id);

  res.sendStatus(204);
});

module.exports = {router, repo};