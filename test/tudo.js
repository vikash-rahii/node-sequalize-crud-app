let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Tudos API', () => {

    /**
     * Test the GET route
     */
    describe("GET /api/v1/tudo", () => {
        it("It should GET all the tudos", (done) => {
            chai.request(server)
                .get("/api/v1/tudo")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eq(3);//will be dynamically
                    done();
                });
        });

        it("It should NOT GET all the tudos", (done) => {
            chai.request(server)
                .get("/api/v1/tudo")
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });

    });


    /**
     * Test the GET (by id) route
     */
    describe("GET /api/v1/tudo/:id", () => {
        it("It should GET a tudo by ID", (done) => {
            const taskId = 1;
            chai.request(server)
                .get("/api/v1/tudo" + taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('title');
                    response.body.should.have.property('description');
                    response.body.should.have.property('published');
                    response.body.should.have.property('updatedAt');
                    response.body.should.have.property('createdAt');
                    done();
                });
        });

        it("It should NOT GET a tudo by ID", (done) => {
            const taskId = 123;
            chai.request(server)
                .get("/api/tudo/" + taskId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq("The tudo with the provided ID does not exist.");
                    done();
                });
        });

    });


    /**
     * Test the POST route
     */
    describe("POST /api/v1/tudo", () => {
        it("It should POST a new task", (done) => {
            const task = {
                "title": "first title",
                "description": "this is brief description",
                "published": true
            };
            chai.request(server)
                .post("/api/v1/tudo")
                .send(task)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('title');
                    response.body.should.have.property('description');
                    response.body.should.have.property('published');
                    done();
                });
        });

        it("It should NOT POST a new tudo without the name property", (done) => {
            const task = {
                completed: false
            };
            chai.request(server)
                .post("/api/v1/tudo")
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("The name should be at least 3 chars long!");
                    done();
                });
        });

    });


    /**
     * Test the PUT route
     */
    describe("PUT /api/v1/tudo/:id", () => {
        it("It should PUT an existing tudo", (done) => {
            const taskId = 1;
            const task = {
                "title": "first title",
                "description": "this is brief description",
                "published": true
            };
            chai.request(server)
                .put("/api/v1/tudo/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('title');
                    response.body.should.have.property('description');
                    response.body.should.have.property('published');
                    done();
                });
        });

        it("It should NOT PUT an existing tudo with a name with less than 3 characters", (done) => {
            const taskId = 1;
            const task = {
                "title": "first title",
                "description": "this is brief description",
                "published": true
            };
            chai.request(server)
                .put("/api/v1/tudo" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("The name should be at least 3 chars long!");
                    done();
                });
        });
    });



    /**
     * Test the DELETE route
     */
    describe("DELETE /api/v1/tudo/:id", () => {
        it("It should DELETE an existing tudo", (done) => {
            const taskId = 1;
            chai.request(server)
                .delete("/api/v1/tudo" + taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                    done();
                });
        });

        it("It should NOT DELETE a tudo that is not in the database", (done) => {
            const taskId = 145;
            chai.request(server)
                .delete("/api/tudo/" + taskId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq("The tudo with the provided ID does not exist.");
                    done();
                });
        });

    });




});

