/// <reference types="cypress" />

describe('Consulta de Status', () => {
  it('Consultar Status', () => {
    cy.request('GET', 'https://simple-books-api.glitch.me/status')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status', 'OK');
      });
  });

  it('Consultar Livro', () => {
    cy.request('GET', 'https://simple-books-api.glitch.me/books')
      .its('body')
      .then((books) => {
        expect(books).to.be.an('array').and.not.to.be.empty;

        books.forEach((book) => {
          expect(book).to.have.property('available');
          expect(book.available).to.be.a('boolean');
        });
      });
  });

  it('Consultar livro pelo ID', () => {
    cy.request('GET', 'https://simple-books-api.glitch.me/books/6')
      .then((response) => {

        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', 6);
        expect(response.body).to.have.property('name', 'Viscount Who Loved Me');
        expect(response.body).to.have.property('author', 'Julia Quinn');
        expect(response.body).to.have.property('type', 'fiction');
        expect(response.body).to.have.property('price', 15.6);
        expect(response.body).to.have.property('current-stock', 1021);
        expect(response.body).to.have.property('available', true);
      });
  });

  it('Retornar order', () => {
    const orderData = {
      bookId: 1,
      customerName: 'John',
    };

    const authToken = 'b28f351c1806cdd03f564a795ef515389bb3897cd1aa9340078e8eac18c8b9ee';

    cy.request({
      method: 'POST',
      url: 'https://simple-books-api.glitch.me/orders',
      body: orderData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('orderId').that.is.not.empty;


      expect(response.body).to.have.property('created');
      expect(response.body).to.not.have.property('bookId');
      expect(response.body).to.not.have.property('customerName');
    });
  });

  it('Criar, Exibir e Deletar order', () => {
    const orderData = {
      bookId: 1,
      customerName: 'John',
    };

    const authToken = 'b28f351c1806cdd03f564a795ef515389bb3897cd1aa9340078e8eac18c8b9ee';

    let orderId;


    cy.request({
      method: 'POST',
      url: 'https://simple-books-api.glitch.me/orders',
      body: orderData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('orderId').that.is.not.empty;

      orderId = response.body.orderId;


      cy.request({
        method: 'GET',
        url: `https://simple-books-api.glitch.me/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);


        expect(getResponse.body).to.have.property('id', orderId);
        expect(getResponse.body).to.have.property('bookId', 1);
        expect(getResponse.body).to.have.property('customerName', 'John');
        expect(getResponse.body).to.have.property('createdBy', '6d5cfeca23fcc0b36ff09e62f334e78b3f828a3d4c27fcc0a98090d9cfe94ca2');
        expect(getResponse.body).to.have.property('quantity', 1);
        expect(getResponse.body).to.have.property('timestamp').that.is.a('number');
      });


      cy.request({
        method: 'DELETE',
        url: `https://simple-books-api.glitch.me/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(204);

        expect(deleteResponse.body).to.be.empty;
      });
    });
  });



  describe('Consulta de Status', () => {


    it('Gera Token para API Clients', () => {

      const dynamicEmail = `user_${Date.now()}@example.com`;


      const requestBody = {
        clientName: 'Postman',
        clientEmail: dynamicEmail,
      };

      cy.request({
        method: 'POST',
        url: 'https://simple-books-api.glitch.me/api-clients/',
        body: requestBody,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);


        expect(response.body).to.have.property('accessToken').that.is.not.empty;
      });
    });
  });
})