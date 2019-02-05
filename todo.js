const cuid = require('cuid');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-memory'));
const db = new PouchDB('todos', {
	auto_compaction: true,
	adapter: 'memory'
});

class TodosService {
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

	newDate() {
		return new Date().toISOString();
	}

	async create({ name, isComplete }) {
		const todo = await this.todos
			.post({
				createdAt: this.newDate(),
				updatedAt: this.newDate(),
				name,
				isComplete,
				completionDate: ''
			})
			.then(async newTodo => await this.getOne(newTodo.id))
			.catch(err => console.log(err));
		console.log(todo);
		return todo;
	}
	async getOne(id) {
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
			allDocs.rows.map(async obj => await this.getOne(obj.id))
		);
		console.log(todos);
		return todos;
	}
	async update(id, updates) {
		const todo = await this.todos
			.put(id, {
				...updates
			})
			.then(updatedTodo => this.getOne(updatedTodo))
			.catch(err => console.error(err));
		return todo;
	}
}

module.exports = TodosService;
