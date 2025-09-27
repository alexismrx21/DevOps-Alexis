const { expect } = require("chai");
const userController = require("../src/controllers/user");
const db = require("../src/dbClient");

describe("User", () => {
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb();
  });

  describe("Create", () => {
    it("create a new user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.be.equal("OK");
        done();
      });
    });

    it("passing wrong user parameters", (done) => {
      const user = {
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });

    // it('avoid creating an existing user', (done)=> {
    //   // TODO create this test
    //   // Warning: the user already exists
    //   done()
    // })
  });

  // TODO Create test for the get method
  describe("Get", () => {
    it("get a user by username", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };

      // 1. First, create a user to make this unit test independent from the others

      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.be.equal("OK");
      });

      // 2. Then, check if the result of the get method is correct

      userController.get(user.username, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.deep.equal({
          firstname: user.firstname,
          lastname: user.lastname,
        });
      });

      done();
    });

    it("cannot get a user when it does not exist", (done) => {
      // Chech with any invalid user
      const username = "unknown_user";

      userController.create(username, (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });
  });
});
