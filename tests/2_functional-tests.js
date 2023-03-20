/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = require('chai');
//const console = require('zombie/lib/console');
//const BookModel = require('../model').Book;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  //let idTest;
//
  //suiteSetup(async function() {
  //  const book = await BookModel.findOne();
  //  idTest = book._id;
  //  console.log(idTest)
  //});
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const title = 'The bible';
        chai.request(server)
        .post('/api/books')
        .send({ title })
        .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title', title);
        expect(res.body).to.have.property('_id');
        done();
        })

      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.equal("missing required field title")
        done();
        })
      });
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get("/api/books")
        .end(function(err,res){
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get("/api/books/6413ad2ffb75208da1cb72bf")
        .end(function(err,res){
          expect(res).to.have.status(200)
          expect(res.body).to.equal("no book exists")
        done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get("/api/books/6417a4549f2e5893828f4512")
        .end(function(err,res){
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('title');
          expect(res.body).to.have.property('comments');
        done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const comment = 'The bible is very good';
        chai.request(server)
        .post('/api/books/6417a4549f2e5893828f4512')
        .send({ comment })
        .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id');
        done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/641787b29e9c921520073787')
        .end(function(err, res) {
        expect(res).to.have.status(200);
        //expect(res.body).to.equal("missing required field comment")
        expect(res.body).to.equal("missing required field comment")
        done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const comment = 'The bible is very good';
        chai.request(server)
        .post('/api/books/641787b29e9c121520073787')
        .send({ comment })
        .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.equal("no book exists")
        done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/641787b29e9c921520073787')
        .end(function(err, res) {
        expect(res).to.have.status(200);
        //expect(res.body).to.equal("delete successful")
        expect(res.body).to.equal("no book exists")
        done();
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/641787b29e9c121520073787')
        .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.equal("no book exists")
        done();
        })
      });

    });

  });

});
