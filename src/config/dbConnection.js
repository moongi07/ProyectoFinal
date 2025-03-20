// configuramos la conexión
const mysql = require('mysql');

// exportamos la conexión
module.exports = () =>
	{
		  return mysql.createConnection(
		  {
				host: 'mysql-nefelibata02.alwaysdata.net ',
				user: '396758_andrea',
				password: 'andreabase?',
				database: 'nefelibata02_cafe'
		  });
	}

// configuramos la conexión
// const mysql = require('mysql');

// // exportamos la conexión
// module.exports = () =>
// {
//   return mysql.createConnection(
//   {
// 		host: 'localhost',
// 		user: 'jorge',
// 		password: '666666.j',
// 		database: 'cafe'
//   });
  
// }