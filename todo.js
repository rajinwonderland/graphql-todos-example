const cuid = require('cuid');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-memory'));
const db = new PouchDB('todos', {
	auto_compaction: true,
	adapter: 'memory'
});

class TodosModel {
	constructor() {
		this.todos = db;
		this.todos
			.put({
				_id: cuid(),
				createdAt: '2019-02-05T00:10:13.828Z',
				updatedAt: '2019-02-05T00:10:13.828Z',
				name: 'Work on blog post',
				isComplete: false,
				completionDate: null
			})
			.then(res => console.log(res))
			.catch(err => console.error(err));
	}

	async create({ name, isComplete }) {
		const todo = await this.todos
			.post({
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				name,
				isComplete,
				completionDate: ''
			})
			.then(async res => await this.findOne(res.id))
			.catch(err => console.log(err));
		console.log(todo);
		return todo;
	}
	async findOne(id) {
		const todo = await this.todos
			.get(id)
			.then(res => ({
				id,
				...res
			}))
			.catch(err => console.error(err));
		return todo;
	}
	async findAll() {
		const allDocs = await this.todos.allDocs();
		const todos = await Promise.all(
			allDocs.rows.map(async obj => await this.findOne(obj.id))
		);
		console.log(todos);
		return todos;
	}
}

module.exports = TodosModel;
