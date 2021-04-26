const MongoClient = require('mongodb').MongoClient;

class Repository {

  async connect(){
   try {
      const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPWD}@${process.env.MONGOCLUSTER}/${process.env.MONGODB}?retryWrites=true&w=majority`;
      this.client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      this.client.db(process.env.MONGODB).collection(`${process.env.MONGOCOLLECTION}`); 

      console.log(`Connection to ${process.env.MONGOCOLLECTION} is successfully done`);
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