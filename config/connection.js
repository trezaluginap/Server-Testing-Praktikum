const mysql = require('mysql')

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password :'',
    database : 'sekolah'
})

module.exports = connection
