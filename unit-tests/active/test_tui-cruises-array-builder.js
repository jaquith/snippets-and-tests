/* global describe, it */
'use script'

const chai = require('chai')

const stringFunctions = require('../helpers/stringFunctions.js')

const code = stringFunctions.getVanillaJsFile('code/tui-cruises-array-builder.js')

const result = stringFunctions.runStringFunctions(code, ['buildProductArrays'])

const testObjectOneProduct = {
  shop_order_id : '1800009336',  // Bestellnummer
  shop_name: 'Mein Schiff ® Shop',  // Shopname
  shop_order_total : 11.7000,   // Bestellwert
  shop_order_tax : 1.6138,  // Steueranteil
  shop_order_shipping : 5.0862,  // Versandkosten
  shop_order_product_1_name : 'Testartikel Streichpreise',  // Artikelname
  shop_order_product_1_price : '5.0000', // Artikelpreis
  shop_order_product_1_quantity : '1.0000' // Artikelanzahl
}

const testObjectTwoProducts = Object.assign({
  shop_order_product_2_name : 'Testartikel Streichpreise 2',  // Artikelname 2
  shop_order_product_2_price : '7.0000', // Artikelpreis 2
  shop_order_product_2_quantity : '2.0000' // Artikelanzahl 2 
}, testObjectOneProduct)

const testObjectMissingEntries = Object.assign({
  shop_order_product_3_price : '9.0000', // Artikelpreis 2
  shop_order_product_3_name : 'Testartikel Streichpreise 3',  // Artikelname 2
  shop_order_product_3_quantity : '3.0000', // Artikelanzahl 2 
}, testObjectOneProduct)


describe('the tui-cruises array converter', () => {

  it('should correctly have a function that returns simple objects', () => {
    chai.expect(result.buildProductArrays).to.be.a('function')
    chai.expect(result.buildProductArrays({ test: 'test1'})).to.deep.equal({test: 'test1'})
  })

  it('should correctly generate the arrays for a single product', () => {
    chai.expect(result.buildProductArrays(testObjectOneProduct)).to.equal({
      shop_order_id : '1800009336',  // Bestellnummer
      shop_name: 'Mein Schiff ® Shop',  // Shopname
      shop_order_total : 11.7000,   // Bestellwert
      shop_order_tax : 1.6138,  // Steueranteil
      shop_order_shipping : 5.0862,  // Versandkosten
      shop_order_product_name : ['Testartikel Streichpreise'],  // Artikelname
      shop_order_product_price : ['5.0000'], // Artikelpreis
      shop_order_product_quantity : ['1.0000'] // Artikelanzahl
    })
  })

  it('should correctly generate the arrays for two products', () => {
    chai.expect(result.buildProductArrays(testObjectTwoProducts)).to.equal({
      shop_order_id : '1800009336',  // Bestellnummer
      shop_name: 'Mein Schiff ® Shop',  // Shopname
      shop_order_total : 11.7000,   // Bestellwert
      shop_order_tax : 1.6138,  // Steueranteil
      shop_order_shipping : 5.0862,  // Versandkosten
      shop_order_product_name : ['Testartikel Streichpreise', 'Testartikel Streichpreise 2'],  // Artikelname
      shop_order_product_price : ['5.0000', '7.0000'], // Artikelpreis
      shop_order_product_quantity : ['1.0000', '2.0000'] // Artikelanzahl
    })
  })

  it('should correctly handle missing entries', () => {
    chai.expect(result.buildProductArrays(testObjectTwoProducts)).to.equal({
      shop_order_id : '1800009336',  // Bestellnummer
      shop_name: 'Mein Schiff ® Shop',  // Shopname
      shop_order_total : 11.7000,   // Bestellwert
      shop_order_tax : 1.6138,  // Steueranteil
      shop_order_shipping : 5.0862,  // Versandkosten
      shop_order_product_name : ['Testartikel Streichpreise', '', 'Testartikel Streichpreise 3'],  // Artikelname
      shop_order_product_price : ['5.0000', '', '9.0000'], // Artikelpreis
      shop_order_product_quantity : ['1.0000', '', '3.0000'] // Artikelanzahl
    })
  })

})
