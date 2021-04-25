const expect = require("chai").expect;
import app from "./whattodo";
const request = require("supertest")(app);
import nock from "nock";

describe("What to do endpoint", function () {
  this.retries(10);
  before(async function () {
    //Load chai assertions
    const chai = require('chai');
    const chaiAsPromised = require('chai-as-promised');

    //Load chai-as-promised support
    chai.use(chaiAsPromised);

    //Initialise should API (attaches as a property on Object)
    chai.should();
  })

  it("Should eventually provide 'drink a single beer'", async function () {
    this.retries(10);
    const response = await request.get("/whattodo")
    expect(response.body.activity).to.be.equal("drink a single beer");
    //expect(response.body.activity).to.eventually.equal("drink a single beer");
  })
})