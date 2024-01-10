const express =  require('express')
const siswa = require('../controller/siswaController')
const route  = express.Router()
//GET SISWA /siswa
route.get('/',siswa.getSiswa)
route.post('/',siswa.insertSiswa)
route.put('/:id',siswa.updateSiswa)
route.delete('/:id',siswa.deleteSiswa)

module.exports = route
