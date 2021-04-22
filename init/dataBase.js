const MongoClient = require('mongodb').MongoClient;

class Repository {

  async connect(){
   try {
      const uri = `mongodb+srv://Web_py:pS6a02PCy86FzuNt@cluster0.fwhnm.mongodb.net/Weather?retryWrites=true&w=majority`;
      this.client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      this.collection = await this.client.db("Weather").collection("city");

      console.log(`Connection to ${this.collection.collectionName} is successfully done`);
    } catch (err) {
      console.error(err);
    }

  }


  

  async isIncluded(coords) {
    let res = await this.collection.findOne({lat : coords.lat, lon : coords.lon});
    return res !== null;
  }

  async insert(city, coords, res) {
    let obj = {cityName : city, lat : coords.lat, lon : coords.lon}

    console.log("LAT:", obj.lat, "LON", obj.lon)

    this.collection.insertOne(obj, (err, res) => {
      console.log(res);
    });
  }
  
  async findAll() {
    const output = []

    await this.collection.find().forEach(elem => {
      output.push(elem.cityName);
    });
    
    return output;
  }

  async delete(coords) {
    let filter = {lat : coords.lat, lon : coords.lon}

    if (!await this.isIncluded(coords)) {
      console.log("There is on such city in DB");
      return;
    }

    this.collection.deleteOne(filter, (err, res) => {
      console.log(res);
    });
  }

  disconnect() {
    this.client.close()
  }
}

module.exports = Repository;