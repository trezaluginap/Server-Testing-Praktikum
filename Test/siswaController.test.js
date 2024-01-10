const request = require('supertest');
const app = require('../index');
const { connect } = require('../config/connection');
const connection = require('../config/connection');

describe('siswaController', () => {
    describe('GET /siswa', () => {
        it('should get list of siswa', async () => {
            const response = await request(app).get('/siswa');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', true);
        });
    });

    describe('POST /siswa', () => {
        it('should insert new siswa', async () => {
            const response = await request(app)
                .post('/siswa')
                .send({
                    nama: 'Andri',
                    umur: 20,
                    alamat: 'Jl. Cibolang',
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', true);
        });
    });

    describe('Update Endpoint', () => {
        let insertId;

        beforeAll(async () => {
            const insertQuery =
                `INSERT INTO tbl_siswa (nama, umur, alamat)  VALUES ('Samsul', 30, 'Solo')`;
            const insertResult = await new Promise((resolve) => {
                connection.query(insertQuery, (err, result) => {
                    if (err) {
                        console.log('Insert Error', err);
                    }
                    insertId = result.insertId;
                    resolve(result);
                });
            });
        });

        it('should update a student', async () => {
            const updateData = {
                nama: 'Alun',
                umur: 20,
                alamat: 'Malang',
            };
            const response = await request(app)
                .put(`/siswa/${insertId}`)
                .send(updateData);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', true);
            expect(response.body).toHaveProperty('msg', 'Successfull Updated');

            const selectQuery = `SELECT * FROM tbl_siswa WHERE id = ${insertId}`;
            const selectResult = await new Promise((resolve) => {
                connection.query(selectQuery, (err, result) => {
                    resolve(result);
                });
            });

            expect(selectResult.length).toBe(1);
            expect(Array.isArray(selectResult)).toBe(true);
            expect(selectResult.length).toBeGreaterThan(0);
            expect(selectResult[0].nama).toBe(updateData.nama);
            expect(selectResult[0].umur).toBe(updateData.umur);
            expect(selectResult[0].alamat).toBe(updateData.alamat);
        });

        afterAll(async () => {
            const deleteQuery = `DELETE FROM tbl_siswa WHERE id = ${insertId}`;
            await new Promise((resolve) => {
                connection.query(deleteQuery, () => {
                    resolve();
                });
            });
        });
    });

    describe('SiswaController - Delete', () => {
        let insertId;

        beforeAll(async () => {
            const insertQuery = `INSERT INTO tbl_siswa (nama, umur, alamat) VALUES ('TEST', 25, 'Jl. Test')`;
            const insertResult = await new Promise((resolve) => {
                connection.query(insertQuery, (err, result) => {
                    if (err) {
                        console.log('Insert Error:', err);
                    }
                    insertId = result.insertId;
                    resolve();
                });
            });
        });

        it('Should delete a student', async () => {
            const response = await request(app).delete(`/siswa/${insertId}`);

            if (response.body.status) {
                expect(response.body).toHaveProperty('status', true);
                expect(response.body).toHaveProperty('msg', 'Delete Successfull');
            } else {
                expect(response.body).toHaveProperty('status', false);
                expect(response.body).toHaveProperty('msg', 'Delete Failed');
            }

            const selectQuery = `SELECT * FROM tbl_siswa WHERE id = ${insertId}`;
            const selectResult = await new Promise((resolve) => {
                connection.query(selectQuery, (err, result) => {
                    resolve(result);
                });
            });

            expect(selectResult.length).toBe(0);
        });

        afterAll(() => {
            connection.end();
        });
    });
});
