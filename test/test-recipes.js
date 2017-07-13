const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('RECIPES: should list recipes on GET', function() {
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);

				const expectedKeys = ['name', 'id', 'ingredients'];
				res.body.forEach(function(recipe) {
					recipe.should.be.a('object');
					recipe.should.include.keys(expectedKeys);
				});
			});
	});

	it('RECIPES: should add recipe on POST', function() {
		const newRecipe = {name: 'fro-yo', ingredients: ['yogurt', 'ice']};
		return chai.request(app)
			.post('/recipes')
			.send(newRecipe)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('id', 'name', 'ingredients');
				res.body.id.should.not.be.null;
				res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
			});
	});

	it('RECIPES: should update recipe on PUT', function() {
		const updateRecipe = {name: 'ice cream', ingredients: ['cream', 'ice']};
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				updateRecipe.id = res.body[0].id;
				return chai.request(app)
					.put(`/recipes/${updateRecipe.id}`)
					.send(updateRecipe);
			})
			.then(function(res) {
				res.should.have.status('200');
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.deep.equal(updateRecipe);
			});
	});

	it('RECIPES: should delete recipe on DELETE', function() {
		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			return chai.request(app)
			.delete(`/recipes/${res.body[0].id}`);
		})
		.then(function(res) {
			res.should.have.status(204);
		})
	})
})




