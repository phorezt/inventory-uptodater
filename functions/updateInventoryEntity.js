// the inventory DB stuff
// exports a single updateInventory function taking the id and the entity content whatever format it may be.
var admin = require("firebase-admin");
var serviceAccount = require("../firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let db = admin.firestore();

module.exports = function updateInventoryEntity(id, entity) {
  return db.collection("entities").doc(id).set(entity);
};
