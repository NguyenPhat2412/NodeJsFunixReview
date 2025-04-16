const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  // kết nối đến mongodb bằng MongoClient
  MongoClient.connect(
    "mongodb+srv://nguyenphat2412:phatdeptrai123@nodejsudemy.hdztbvu.mongodb.net/shop?retryWrites=true&w=majority&appName=nodejsudemy"
  )
    .then((clients) => {
      console.log("Connected");

      // lưu truy cập đến db vào biến _db
      _db = clients.db();

      // gọi lại hàm callback và truyền và biến _db
      callback(clients);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
