const db = require("../dbClient");

module.exports = {
  //créer un utilisateur dans Redis
  create: (user, callback) => {
    // Vérifier que le paramètre obligatoire "username" est présent
    if (!user.username)
      return callback(new Error("Wrong user parameters"), null);

    //Construire un objet utilisateur (stocké comme Hash dans Redis)
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    };

    // Vérifier si l'utilisateur existe déjà
    db.exists(user.username, (err, exists) => {
      if (err) return callback(err, null);

      if (exists) {
        // Si déjà présent → erreur
        return callback(new Error("User already exists"), null);
      }

      //Sauvegarder l'utilisateur dans Redis avec HMSET
      // - clé    = username
      // - valeur = Hash contenant firstname et lastname

      db.hmset(user.username, userObj, (err, res) => {
        // Si Redis renvoie une erreur, on la propage
        if (err) return callback(err, null);

        // Sinon, on renvoie la réponse
        callback(null, res);
      });
    });
  },

  //récupérer un utilisateur depuis Redis
  get: (username, callback) => {
    //Chercher l'utilisateur dans Redis avec HGETALL
    db.hgetall(username, (err, obj) => {
      // Si Redis renvoie une erreur, on la propage
      if (err) return callback(err, null);

      // Si aucun objet n'est trouvé (l'utilisateur n'existe pas dans Redis)
      if (!obj) {
        return callback(null, null);
      }

      // Si l'utilisateur existe, on renvoie l'objet récupéré
      callback(null, obj);
    });
  },
};
