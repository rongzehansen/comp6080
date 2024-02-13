describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    sessionStorage.clear()
  })
})
/*
describe('login', () => {
  it('click "Login" and fill in the info', () => {
    cy.visit('http://localhost:3000/listings/login')
    cy.get('#email').type('hello@gmail.com')
    cy.get('#password').type('123456')
    cy.get('button[type="submit"]').click()
    cy.wait(1000)
  })
})
*/
describe('register', () => {
  it('click "Sign up" and fill in the info', () => {
    cy.visit('http://localhost:3000/listings/register')
    cy.get('#email').type('hello@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#name').type('Rongze')
    cy.get('#confirmPassword').type('123456')
    cy.get('button[type="submit"]').click()
    cy.wait(1000)
  })
})

describe('create new listing', () => {
  it('visit "Switch to hosting" and create a new listing', () => {
    cy.visit('http://localhost:3000/hosting')
    cy.get('button[type="button"]').contains('Add New Listing').click()
    cy.get('#title').type('NMMDW')
    cy.get('#type').type('Apartment')
    cy.get('#description').type('Apartment Apartment Apartment Apartment')
    cy.get('#price').type('2500')
    cy.get('button[type="button"]').contains('Next Page').click()
    cy.get('#suburb').type('Pymble')
    cy.get('#detailAddress').type('34 Andrews Dr')
    cy.get('#territory').type('NSW')
    cy.get('#postcode').type(2032)
    cy.get('button[type="button"]').contains('Next Page').click()
    cy.get('#bathroomNumber').type(1)
    cy.get('button[type="button"]').contains('Add Bedroom').click()
    cy.get('input').each(($input, index) => {
      if (index === 1) cy.wrap($input).type('Text')
      else if (index === 2) cy.wrap($input).type(1)
    })
    cy.get('button[type="button"]').contains('Save').click()
    cy.get('button[type="button"]').contains('Next Page').click()
    cy.get('#youtube-link-ipt').type('https://www.youtube.com/watch?v=eyOmr_HYuSo')
    cy.get('button[type="button"]').contains('Add Video').click()
    cy.wait(1000)
    cy.get('button[type="submit"]').contains('Submit').click({ force: true })
    cy.wait(1000)
  })
})

describe('edit one listing', () => {
  it('', () => {
    cy.get('button[type="button"]').contains('Edit').click()
    cy.get('#title').type('changed')
    cy.get('button[type="button"]').contains('Next Page').click()
    cy.get('button[type="button"]').contains('Next Page').click()
    cy.get('button[type="button"]').contains('Next Page').click()
    cy.get('#youtube-link-ipt').type('https://www.youtube.com/watch?v=gDdolaUs2Us')
    cy.get('button[type="button"]').contains('Add Video').click()
    cy.get('button[type="submit"]').contains('Submit').click({ force: true })
  })
})

describe('publish one listing', () => {
  it('', () => {
    cy.visit('http://localhost:3000/hosting')
    cy.get('button[type="button"]').contains('Publish').click()
    cy.get('button[type="button"]').contains('Add New Picker').click()
    cy.get('input').each(($input, index) => {
      if (index === 0) cy.wrap($input).type('12/21/2023')
      else if (index === 1) cy.wrap($input).type('12/28/2024')
    })
    cy.get('button[type="button"]').contains('Publish Now').click()
    cy.wait(1000)
  })
})

describe('unpublish one listing', () => {
  it('', () => {
    cy.visit('http://localhost:3000/hosting')
    cy.get('button[type="button"]').contains('Unpublish').click()
    cy.wait(1000)
  })
})
