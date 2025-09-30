const { expect } = require("chai");
const userController = require("../src/controllers/user");
const db = require("../src/dbClient");

describe("User", () => {
  beforeEach(() => {
    db.flushdb();
  });

  // ------------------------------------------------------------
  // TESTS DE LA MÉTHODE CREATE
  // ------------------------------------------------------------
  describe("Create", () => {
    it("create a new user", (done) => {
      // On prépare un objet utilisateur valide
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };

      // On appelle la fonction create du controller
      userController.create(user, (err, result) => {
        // Vérifie que la réponse est bien un succès
        expect(err).to.be.equal(null);
        expect(result).to.be.equal("OK");
        done();
      });
    });

    it("passing wrong user parameters", (done) => {
      // Pas de username → invalide
      const user = {
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      userController.create(user, (err, result) => {
        // Vérifie que cela renvoie une erreur
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });

    it("avoid creating an existing user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };

      //  Crée un utilisateur
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.be.equal("OK");

        //  Tente de recréer le même utilisateur
        userController.create(user, (err, result) => {
          // On attend une erreur car l'utilisateur existe déjà
          expect(err).to.not.be.equal(null);
          expect(result).to.be.equal(null);
          done();
        });
      });
    });
  });

  // -------------------------------
  // TESTS POUR LA ROUTE GET /user/:username
  // -------------------------------
  describe("Get", () => {
    it("get a user by username", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };

      // On crée un utilisateur en POST
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.be.equal("OK");

        //Puis on tente de le récupérer avec GET
        userController.get(user.username, (err, result) => {
          // Vérifie que la réponse contient bien l'utilisateur
          expect(err).to.be.equal(null);
          expect(result).to.deep.equal({
            firstname: user.firstname,
            lastname: user.lastname,
          });
          done();
        });
      });
    });

    it("cannot get a user when it does not exist", (done) => {
      // On tente de récupérer un utilisateur inexistant
      const username = "unknown_user";

      userController.get(username, (err, result) => {
        // Vérifie que cela renvoie une erreur
        expect(err).to.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });
  });
});
