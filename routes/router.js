const express = require("express");
const apiRequesterClass = require("../init/apiReq.js");
const RepositoryClass = require("../init/dataBase.js");

const router = express.Router();
const apiRequester = new apiRequesterClass();
const repo = new RepositoryClass();

let param = "q=";

router.get("/weather/city", async (req, res) => {

	const jsonData = await apiRequester.getResponse(param + req.query.q);

	res.status(200).json({
		jsonData
	})

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

	if (jsonData.error) {
	  res.status(404);
	  res.sendStatus(404)
	} else {
	  res.json(jsonData)
	}
});

router.get("/favourites", async (req, res) => {
  // await repo.connect();
  const favList = await repo.findAll();

  let favResponses = await Promise.all(favList.map( item => {
    console.log(item)
    return apiRequester.getResponse(item)
  }));

  res.json(favResponses);
});

router.post("/favourites", async (req, res) => {
  // await repo.connect();
  
  console.log(req.body)
  if(req.body === {}) { // НЕ ЗАХОДИТ
      console.log("ERROR")
      return res.sendStatus(400);
  } 
  
  const jsonData = await apiRequester.getResponse(req.body.cityName);

  console.log(jsonData);

  if (await repo.isIncluded(jsonData.coords)) {
    console.log("This city is already in db");
    res.sendStatus(409);
    return;
  }

  await repo.insert(jsonData.cityName, jsonData.coords, res);
  
  res.sendStatus(201);
});

router.delete("/favourites", async (req, res) => {
  // await repo.connect();

  console.log(req.body)
  if(req.body === null) { // НЕ ЗАХОДИТ
      console.log("ERROR")
      return res.sendStatus(400);
  } 

  const jsonData = await apiRequester.getResponse(req.body.cityName);
  await repo.delete(jsonData.coords);

  res.sendStatus(204);
});

module.exports = {router: router, repo: repo};