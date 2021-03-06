const expect = require('expect');
const request = require('request');

const app = require('./../server.js');
const Todo = require('./../models/todo.js');

 beforeEach((done)=>{
     Todo.remove({}).then(()=>done())
 })

describe('Post /todo', () => {
    it('should create a new to do', (done) => {
        var text = "test todo text"
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            }).end((err, res) => {
                if (err)
                    return done(err)

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1)
                        .expect(todos[0].text).toBe(text)
                        .done();
                }).catch((err) => done(e));
            });
    });
});