const db = require("../dbClient");

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if (!user.username)
      return callback(new Error("Wrong user parameters"), null);
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    };
    // Save to DB
    // TODO check if user already exists
    db.hmset(user.username, userObj, (err, res) => {
      if (err) return callback(err, null);
      callback(null, res); // Return callback
    });
  },

  get: (username, callback) => {
    // Aller chercher l’utilisateur dans Redis
    db.hgetall(username, (err, obj) => {
      if (err) return callback(err, null);

      if (!obj) {
        // Si l’utilisateur n’existe pas
        return callback(null, null);
      }

      // Si trouvé, renvoyer l’objet utilisateur
      callback(null, obj);
    });
    //   // TODO create this method
  },
};
