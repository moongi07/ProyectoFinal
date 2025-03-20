// configuramos la conexión
const mysql = require('mysql');

// exportamos la conexión
module.exports = () =>
	{
		  return mysql.createConnection(
		  {
				host: 'iasanz.synology.me',
				user: 'alumno',
				password: 'AlumnoSanz$1',
				database: 'amartinezm396_cafe'
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
