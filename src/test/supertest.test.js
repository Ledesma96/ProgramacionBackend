import chai from "chai";
import supertest from "supertest";
import { faker } from '@faker-js/faker';
import "dotenv/config.js";

const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')

describe('Testing de aplicaion e-commerce', () => {
    describe('Test de funcionamiento de api´s productos', () => {
     
          it('El endpoint POST /api/products debera agregar un producto a la basse de datos', async () => {
              const product = {
                  title: faker.commerce.productName(),
                  thumbnail: faker.image.url(),
                  description: faker.lorem.sentence(),
                  code: Math.floor(10000 + Math.random() * 90000),
                  price: faker.commerce.price(),
                  stock: 5,
                  status: true,
                  category: faker.lorem.word(),
                  owner: "admin"
              }
            
              const response = await requester.post('/api/products').send(product)
              const { _body } = response

              expect(_body.succes).to.be.deep.equal(true)
          })

          it('El endpoint GET /api/products debera obtener un arrglo con los productos de mi base de datos', async() => {
              const result = await requester.get('/api/products');
              const {status, ok, _body} = result
              expect(_body).to.be.an('array');
              expect(_body).to.not.be.empty;
              expect(ok).to.be.deep.equal(true)
              expect(status).to.be.equal(201)
          });

          it('El endpoint PUT /api/products/:pid debera modificar un campo del producto seleccionado', async() => {
             const id = '653f9583dc7e04ece3cacc73'

             const price = faker.commerce.price()

             const result = await requester.put(`/api/products/${id}`).send({price});
             const {_body, ok, status, error, badRequest} = result
             expect(_body).to.be.an('object')
             expect(_body.success).to.be.deep.equal(true)
             expect(ok).to.be.deep.equal(true)
             expect(status).to.be.deep.equal(201)
             expect(error).to.be.deep.equal(false)
             expect(badRequest).to.be.deep.equal(false)
          })
    });

    describe('test de funcionamiento de api´s de carts', async() => {
         it('El endpoint GET /api/cart/:cid debera obtener un carrito especificado', async() => {
             const id = '64ef6588417ac55937dd0c62'

             const result = await requester.get(`/api/carts/${id}`)
             const {_body, ok, status} = result

             expect(_body).to.be.an('object')
             expect(_body.products).to.be.an('array')
             expect(ok).to.be.deep.equal(true)
             expect(status).to.be.deep.equal(200)
         })

         it('El endpoint POST /api/carts/:cid/products/:pid debera agregar un producto existente al carrito', async() => {
             const cid = '64ef6588417ac55937dd0c62';
             const pid = '653f9583dc7e04ece3cacc73';

             const result = await requester.post(`/api/carts/${cid}/product/${pid}`)

             const {_body, ok, status} = result;
             expect(_body).to.be.an('object');
             expect(_body.success).to.be.deep.equal(true);
             expect(ok).to.be.deep.equal(true);
             expect(status).to.be.deep.equal(201);
           
         })

         it('El endpoint DELETE /api/carts/:cid/products/:pid debera eliminar un producto del carrito', async () => {
             const cid = '64ef6588417ac55937dd0c62';
             const pid = '653f9583dc7e04ece3cacc73';
             const result = await requester.delete(`/api/carts/${cid}/products/${pid}`)
        
             const {_body, ok, status} = result;
             expect(_body).to.be.an('object');
             expect(_body.success).to.be.deep.equal(true);
             expect(ok).to.be.deep.equal(true);
             expect(status).to.be.deep.equal(200);

         })
    })

    describe('Testing de los endpoint /api/sessions', () => {
         it('debería registrar un usuario y devolver un token de acceso', async () => {
             const user = {
                 password: 'Hola123',
                 first_name: faker.person.fullName(),
                 last_name: faker.person.fullName(),
                 email: faker.internet.email(),
                 age: 20
             };
         
    
             const response = await requester.post('/api/sessions/register').send(user);
           
             expect(response.status).to.equal(201); 
             expect(response.body.message).to.equal('Logueado');
             expect(response.header['set-cookie'][0]).to.include('coderCookie');
        });
    
          it('debería manejar errores y devolver un mensaje de error en caso de fallo', async () => {
          
              const user = {
                  password: 'Hola123',
                  first_name: faker.person.fullName(),
                  last_name: faker.person.fullName(),
                  email: 'gabriel.m.ledesma96@gmail.com', //email ya en uso
                  age: 20
              };
    
              const response = await requester.post('/api/sessions/register').send(user);
    
             
              expect(response.status).to.equal(302); 
              expect(response.header.location).to.equal('/register')
          });

         it('El endpoint POST /api/sessions/login debería logear y devolver un token de sesion en cookie', async () => {
             const user = {
                 email: 'gabriel.m.ledesma96@gmail.com',
                 password: 'hola123'
             }

             const response = await requester.post('/api/sessions/login').send(user)

             expect(response.header['set-cookie'][0]).to.include('coderCookie');
             expect(response.status).to.be.deep.equal(200)
             expect(response._body.message).to.be.deep.equal('Logueado')
         })

        // it('El endpoint POST /api/sessions/login debería errores de logeao y devolver un mensaje de error', async () => {
        //     const user = {
        //         email: 'gabriel.m.ledesma96@gmail.com',
        //         password: 'hola12'
        //     }

        //     const response = await requester.post('/api/sessions/login').send(user)
        //     console.log(response.body.message);

        //     expect(response.status).to.be.deep.equal(401)
        // })
    });
});