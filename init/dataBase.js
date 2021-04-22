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


  async isIncluded(id) {
    let res = await this.collection.findOne({cityId: id});
    return res !== null;
  }

  async insert(city, id, res) {
    let obj = {cityName : city, cityId : id}

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

  async delete(id) {
    let filter = {cityId: id}

    if (!await this.isIncluded(id)) {
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