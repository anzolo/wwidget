//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");

//Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
// let server = require('./server');
let should = chai.should();

chai.use(chaiHttp);
//Наш основной блок
describe('Weather widget', () => {

    before(function (done) {
        this.timeout(30000);
        setTimeout(done, 500);
    });


    // beforeEach((done) => { //Перед каждым тестом чистим базу
    //     // Book.remove({}, (err) => {
    //     done();
    //     // });
    // });
    /*
     * Тест для /GET
     */
    describe('/GET /', () => {
        it('it should GET 200 status', (done) => {
            // this.timeout(30000);
            chai.request('http://0.0.0.0:8080')
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    // res.body.should.be.a('array');
                    // res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

});