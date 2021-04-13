const { Pool } = require("pg")
const connectionString = 'postgres://rjwhexfu:YSZlC9WHdhX9k93T3gqWwSgFaz8QFYqz@ziggy.db.elephantsql.com:5432/rjwhexfu'
const pool = new Pool({
	connectionString
})

const fetchAll = async (SQL, ...params) => {

	const client = await pool.connect()

	try {

		const { rows } = await client.query(SQL, params)

		return rows
	}
	catch(err) {
		// console.error(err)
		throw err
	}
	finally {
		client.release()
	}
}

module.exports.fetchAll = fetchAll
