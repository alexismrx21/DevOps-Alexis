const app = require("../src/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require("../src/dbClient");

chai.use(chaiHttp);

describe("User REST API", () => {
  // Avant chaque test → on vide Redis pour repartir d'une base propre
  beforeEach(() => {
    db.flushdb();
  });

  // Après toute la suite de tests → on arrête proprement
  after(() => {
    app.close();
    db.quit();
  });

  // -------------------------------
  // TESTS POUR LA ROUTE POST /user
  // -------------------------------
  describe("POST /user", () => {
    it("create a new user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };

      // Envoie une requête HTTP POST avec l'utilisateur en body
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          // Vérifie que la réponse est bien un succès
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.status).to.equal("success");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });

    it("pass wrong parameters", (done) => {
      const user = {
        // Pas de username → invalide
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          // Vérifie que cela renvoie une erreur
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal("error");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });

    it("avoid creating an existing user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };

      // On crée un utilisateur en POST
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          // Vérifie que la réponse est bien un succès
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.status).to.equal("success");
          chai.expect(res).to.be.json;

          // Puis on crée le meme utilisateur une deuxieme fois
          return chai.request(app).post("/user").send(user);
        })
        .then((res) => {
          // Vérifie que cela renvoie une erreur
          chai.expect(res).to.have.status(409);
          chai.expect(res.body.status).to.equal("error");
          chai.expect(res).to.be.json;
          done();
        })

        .catch((err) => {
          throw err;
        });
    });
  });

  // -------------------------------
  // TESTS POUR LA ROUTE GET /user/:username
  // -------------------------------
  describe("GET /user", () => {
    it("get a user by username", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };

      // On crée un utilisateur en POST
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.status).to.equal("success");
          chai.expect(res).to.be.json;

          //Puis on tente de le récupérer avec GET
          return chai.request(app).get(`/user/${user.username}`);
        })
        .then((res) => {
          // Vérifie que la réponse contient bien l'utilisateur
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal({
            status: "success",
            user: {
              firstname: user.firstname,
              lastname: user.lastname,
            },
          });
          done();
        })
        .catch((err) => {
          throw err;
        });
    });

    it("cannot get a user when it does not exist", (done) => {
      const username = "unknown_user";
      // On tente de récupérer un utilisateur inexistant
      chai
        .request(app)
        .get(`/user/${username}`)
        .then((res) => {
          // Vérifie que cela renvoie une erreur
          chai.expect(res).to.have.status(404);
          chai.expect(res.body.status).to.equal("error");
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
