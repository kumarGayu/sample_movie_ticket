const app = require("./app");
const supertest = require("supertest");

describe('test block', () => {
  afterEach(async () => {
    await app.close();
  });

  it("GET /searc for 1", async done => {

    const res = await supertest(app).get("/api/search/1");
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.seats[0][0].id).toEqual("a6");
    done();
  });
  it("GET /searc for 2", async done => {

    const res = await supertest(app).get("/api/search/2");
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.seats[0][0].id).toEqual("a6");
    expect(res.body.seats[0][1].id).toEqual("a5");
    done();
  });
  it("GET /searc for 5", async done => {

    const res = await supertest(app).get("/api/search/5");
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.seats[0][0].id).toEqual("a6");
    expect(res.body.seats[0][1].id).toEqual("a5");
    expect(res.body.seats[0][2].id).toEqual("a7");
    expect(res.body.seats[0][3].id).toEqual("a4");
    expect(res.body.seats[0][4].id).toEqual("a3");
    done();
  });
  it("GET /searc for coma separated values", async done => {

    const res = await supertest(app).get("/api/search/2,1,1,1,3");
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.seats[0][0].id).toEqual("a6");
    expect(res.body.seats[1][0].id).toEqual("a5");
    expect(res.body.seats[2][0].id).toEqual("a7");
    expect(res.body.seats[3][0].id).toEqual("a4");
    expect(res.body.seats[3][1].id).toEqual("a3");
    expect(res.body.seats[4][0].id).toEqual("b5");
    expect(res.body.seats[4][1].id).toEqual("b4");
    expect(res.body.seats[4][2].id).toEqual("b3");
    done();
  });
});