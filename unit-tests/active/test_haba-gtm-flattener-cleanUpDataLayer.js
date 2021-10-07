/* global describe, it */
'use strict'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/haba-gtm-flattener-cleanUpDataLayer.js')

let exported

const inputAnonymous = {
  'pageDataJson.user.userName': 'Anonymous',
  'pageDataJson.user.isLoggedIn': 'false',
  'pageDataJson.user.customerType': '0',
  'pageDataJson.user.isGuestCheckout': 'false',
  'pageDataJson.user.recentlyRegistered': 'false',
  'pageDataJson.user.loggedIn': 'false',
  'pageDataJson.user.guestCheckout': 'false',
  'pageDataJson.cart.cartID': '188893701',
  'pageDataJson.cart.priceWithTax': '0',
  'pageDataJson.cart.shippingPrice': '0',
  'pageDataJson.cart.cartTotal': '0',
  'pageDataJson.pageCategory.primaryCategory': '',
  'pageDataJson.pageCategory.subCategory1': '',
  'pageDataJson.pageCategory.productType': '',
  sitegroup: 'Normal',
  page_name: 'HABA - Inventive Playthings for Inquisitive Minds',
  breadcrumb: [
    'My customer account'
  ],
  user_firstName: 'Anonymous',
  user_fullname: 'Anonymous ',
  user_loggedIn: 'false',
  'search-term': '',
  country: 'DE',
  retmode: '',
  xid: '',
  campaign: '',
  language: 'en',
  currency: 'EUR',
  type: '',
  device: 'desktop',
  jspcache_enabled: 'false',
  url: '/myAccount',
  exactagEnabled: 'false',
  OnetrustActiveGroups: ',C0001,C0002,C0003,C0004,',
  OptanonActiveGroups: ',C0001,C0002,C0003,C0004,',
  event: 'c_page_view',
  'gtm.uniqueEventId': '7',
  'gtm.start': '1623824611856',
  'page.pageInfo.pageID': '/en_DE/myAccount',
  'page.pageInfo.pageName': 'HABA - Inventive Playthings for Inquisitive Minds',
  'page.pageInfo.destinationURL': 'https://www.haba.de/en_DE/myAccount',
  'page.pageInfo.referringURL': 'https://www.haba.de/en_DE/myAccount',
  'page.pageInfo.sysEnv': 'prod',
  'page.pageInfo.breadCrumbs': [
    'myAccount'
  ],
  'page.pageInfo.language': 'en',
  'page.pageInfo.market': 'DE',
  'page.pageInfo.category': '',
  'page.category.primaryCategory': '',
  'page.category.subCategory1': '',
  'page.category.productType': '',
  'page.attributes.applicationName': 'Haba Webshop',
  'page.attributes.applicationVersion': '5.27.2',
  'page.attributes.applicationBrand': 'haba',
  'cart.cartId': '188893701',
  'cart.price.basePrice': '0',
  'cart.price.currency': 'EUR',
  'cart.price.taxRate': '19',
  'cart.price.priceWithTax': '0',
  'cart.price.cartTotal': '0',
  'user.isGuestCheckout': 'false',
  'user.segment.isLoggedIn': 'false',
  'user.segment.customerType': '0',
  'user.profile.profileInfo.userName': [
    'Anonymous',
    'Anonymous'
  ]
}

const expectedAnonymous = {
  'pageDataJson.user.userName': 'Anonymous',
  'pageDataJson.user.isLoggedIn': 'false',
  'pageDataJson.user.customerType': '0',
  'pageDataJson.user.isGuestCheckout': 'false',
  'pageDataJson.user.recentlyRegistered': 'false',
  'pageDataJson.user.loggedIn': 'false',
  'pageDataJson.user.guestCheckout': 'false',
  'pageDataJson.cart.cartID': '188893701',
  'pageDataJson.cart.priceWithTax': '0',
  'pageDataJson.cart.shippingPrice': '0',
  'pageDataJson.cart.cartTotal': '0',
  'pageDataJson.pageCategory.primaryCategory': '',
  'pageDataJson.pageCategory.subCategory1': '',
  'pageDataJson.pageCategory.productType': '',
  sitegroup: 'Normal',
  page_name: 'HABA - Inventive Playthings for Inquisitive Minds',
  breadcrumb: [
    'My customer account'
  ],
  user_firstName: 'Anonymous',
  user_fullname: 'Anonymous ',
  user_loggedIn: 'false',
  'search-term': '',
  country: 'DE',
  retmode: '',
  xid: '',
  campaign: '',
  language: 'en',
  currency: 'EUR',
  type: '',
  device: 'desktop',
  jspcache_enabled: 'false',
  url: '/myAccount',
  exactagEnabled: 'false',
  OnetrustActiveGroups: ',C0001,C0002,C0003,C0004,',
  OptanonActiveGroups: ',C0001,C0002,C0003,C0004,',
  event: 'c_page_view',
  'gtm.uniqueEventId': '7',
  'gtm.start': '1623824611856',
  'page.pageInfo.pageID': '/en_DE/myAccount',
  'page.pageInfo.pageName': 'HABA - Inventive Playthings for Inquisitive Minds',
  'page.pageInfo.destinationURL': 'https://www.haba.de/en_DE/myAccount',
  'page.pageInfo.referringURL': 'https://www.haba.de/en_DE/myAccount',
  'page.pageInfo.sysEnv': 'prod',
  'page.pageInfo.breadCrumbs': [
    'myAccount'
  ],
  'page.pageInfo.language': 'en',
  'page.pageInfo.market': 'DE',
  'page.pageInfo.category': '',
  'page.category.primaryCategory': '',
  'page.category.subCategory1': '',
  'page.category.productType': '',
  'page.attributes.applicationName': 'Haba Webshop',
  'page.attributes.applicationVersion': '5.27.2',
  'page.attributes.applicationBrand': 'haba',
  'cart.cartId': '188893701',
  'cart.price.basePrice': '0',
  'cart.price.currency': 'EUR',
  'cart.price.taxRate': '19',
  'cart.price.priceWithTax': '0',
  'cart.price.cartTotal': '0',
  'user.isGuestCheckout': 'false',
  'user.segment.isLoggedIn': 'false',
  'user.segment.customerType': '0',
  'user.profile.profileInfo.userName': 'Anonymous'
}

const inputLoggedIn = {
  'pageDataJson.user.userName': 'Tester McTesterson',
  'pageDataJson.user.isLoggedIn': 'true',
  'pageDataJson.user.customerType': '2',
  'pageDataJson.user.isGuestCheckout': 'false',
  'pageDataJson.user.recentlyRegistered': 'false',
  'pageDataJson.user.loggedIn': 'true',
  'pageDataJson.user.guestCheckout': 'false',
  'pageDataJson.user.profileID': '100167589',
  'pageDataJson.cart.cartID': '188712599',
  'pageDataJson.cart.priceWithTax': '79.99',
  'pageDataJson.cart.shippingPrice': '4.95',
  'pageDataJson.cart.cartTotal': '84.94',
  'pageDataJson.cart.item.productInfo.productID': [
    '306018'
  ],
  'pageDataJson.cart.item.productInfo.productName': [
    'Kullerbü – Ball Track The Orchard'
  ],
  'pageDataJson.cart.item.productInfo.customizable': [
    'false'
  ],
  'pageDataJson.cart.item.price.priceWithTax': [
    '79.99'
  ],
  'pageDataJson.cart.item.price.currency': [
    'EUR'
  ],
  'pageDataJson.cart.item.quantity': [
    '1'
  ],
  'pageDataJson.pageCategory.primaryCategory': '',
  'pageDataJson.pageCategory.subCategory1': '',
  'pageDataJson.pageCategory.productType': '',
  sitegroup: 'Normal',
  page_name: 'HABA - Inventive Playthings for Inquisitive Minds',
  breadcrumb: [
    'My customer account'
  ],
  user_firstName: 'Tester',
  user_lastName: 'McTesterson',
  user_fullname: 'Tester McTesterson',
  user_uid: 'caleb.tealium@gmail.com',
  user_loggedIn: 'true',
  'search-term': '',
  country: 'DE',
  retmode: '',
  xid: 'c3hz24p7ME4RZaD2vzXrDQ0Lqfk0SyjKwT0kBXolI3I',
  campaign: '',
  language: 'en',
  currency: 'EUR',
  type: '',
  device: 'desktop',
  jspcache_enabled: 'false',
  url: '/myAccount',
  exactagEnabled: 'false',
  OnetrustActiveGroups: ',C0001,C0002,C0003,C0004,',
  OptanonActiveGroups: ',C0001,C0002,C0003,C0004,',
  event: 'c_login',
  'gtm.uniqueEventId': '12',
  'gtm.start': '1623754389151',
  'page.pageInfo.pageID': '/en_DE/myAccount',
  'page.pageInfo.pageName': 'HABA - Inventive Playthings for Inquisitive Minds',
  'page.pageInfo.destinationURL': 'https://www.haba.de/en_DE/myAccount',
  'page.pageInfo.referringURL': 'https://www.haba.de/en_DE/myAccount',
  'page.pageInfo.sysEnv': 'www',
  'page.pageInfo.breadCrumbs': [
    'myAccount'
  ],
  'page.pageInfo.language': 'en',
  'page.pageInfo.market': 'DE',
  'page.pageInfo.category': '',
  'page.category.primaryCategory': '',
  'page.category.subCategory1': '',
  'page.category.productType': '',
  'page.attributes.applicationName': 'Haba Webshop',
  'page.attributes.applicationVersion': '5.27.1',
  'page.attributes.applicationBrand': 'haba',
  'cart.cartId': '188712599',
  'cart.price.basePrice': '0',
  'cart.price.currency': 'EUR',
  'cart.price.taxRate': '19',
  'cart.price.priceWithTax': '79.99',
  'cart.price.cartTotal': '84.94',
  'cart.item.productInfo.productID': [
    '306018'
  ],
  'cart.item.productInfo.productName': [
    'Kullerbü – Ball Track The Orchard'
  ],
  'cart.item.productInfo.customizable': [
    'false'
  ],
  'cart.item.price.priceWithTax': [
    '79.99'
  ],
  'cart.item.price.currency': [
    'EUR'
  ],
  'cart.item.quantity': [
    '1'
  ],
  'user.isGuestCheckout': 'false',
  'user.segment.isLoggedIn': 'true',
  'user.segment.customerType': '2',
  'user.profile.profileInfo.profileID': ['100167589'],
  'user.profile.profileInfo.userName': ['Tester McTesterson']
}

const expectedLoggedIn = {
  'pageDataJson.user.userName': 'Tester McTesterson',
  'pageDataJson.user.isLoggedIn': 'true',
  'pageDataJson.user.customerType': '2',
  'pageDataJson.user.isGuestCheckout': 'false',
  'pageDataJson.user.recentlyRegistered': 'false',
  'pageDataJson.user.loggedIn': 'true',
  'pageDataJson.user.guestCheckout': 'false',
  'pageDataJson.user.profileID': '100167589',
  'pageDataJson.cart.cartID': '188712599',
  'pageDataJson.cart.priceWithTax': '79.99',
  'pageDataJson.cart.shippingPrice': '4.95',
  'pageDataJson.cart.cartTotal': '84.94',
  'pageDataJson.cart.item.productInfo.productID': [
    '306018'
  ],
  'pageDataJson.cart.item.productInfo.productName': [
    'Kullerbü – Ball Track The Orchard'
  ],
  'pageDataJson.cart.item.productInfo.customizable': [
    'false'
  ],
  'pageDataJson.cart.item.price.priceWithTax': [
    '79.99'
  ],
  'pageDataJson.cart.item.price.currency': [
    'EUR'
  ],
  'pageDataJson.cart.item.quantity': [
    '1'
  ],
  'pageDataJson.pageCategory.primaryCategory': '',
  'pageDataJson.pageCategory.subCategory1': '',
  'pageDataJson.pageCategory.productType': '',
  sitegroup: 'Normal',
  page_name: 'HABA - Inventive Playthings for Inquisitive Minds',
  breadcrumb: [
    'My customer account'
  ],
  user_firstName: 'Tester',
  user_lastName: 'McTesterson',
  user_fullname: 'Tester McTesterson',
  user_uid: 'caleb.tealium@gmail.com',
  user_loggedIn: 'true',
  'search-term': '',
  country: 'DE',
  retmode: '',
  xid: 'c3hz24p7ME4RZaD2vzXrDQ0Lqfk0SyjKwT0kBXolI3I',
  campaign: '',
  language: 'en',
  currency: 'EUR',
  type: '',
  device: 'desktop',
  jspcache_enabled: 'false',
  url: '/myAccount',
  exactagEnabled: 'false',
  OnetrustActiveGroups: ',C0001,C0002,C0003,C0004,',
  OptanonActiveGroups: ',C0001,C0002,C0003,C0004,',
  event: 'c_login',
  'gtm.uniqueEventId': '12',
  'gtm.start': '1623754389151',
  'page.pageInfo.pageID': '/en_DE/myAccount',
  'page.pageInfo.pageName': 'HABA - Inventive Playthings for Inquisitive Minds',
  'page.pageInfo.destinationURL': 'https://www.haba.de/en_DE/myAccount',
  'page.pageInfo.referringURL': 'https://www.haba.de/en_DE/myAccount',
  'page.pageInfo.sysEnv': 'www',
  'page.pageInfo.breadCrumbs': [
    'myAccount'
  ],
  'page.pageInfo.language': 'en',
  'page.pageInfo.market': 'DE',
  'page.pageInfo.category': '',
  'page.category.primaryCategory': '',
  'page.category.subCategory1': '',
  'page.category.productType': '',
  'page.attributes.applicationName': 'Haba Webshop',
  'page.attributes.applicationVersion': '5.27.1',
  'page.attributes.applicationBrand': 'haba',
  'cart.cartId': '188712599',
  'cart.price.basePrice': '0',
  'cart.price.currency': 'EUR',
  'cart.price.taxRate': '19',
  'cart.price.priceWithTax': '79.99',
  'cart.price.cartTotal': '84.94',
  'cart.item.productInfo.productID': [
    '306018'
  ],
  'cart.item.productInfo.productName': [
    'Kullerbü – Ball Track The Orchard'
  ],
  'cart.item.productInfo.customizable': [
    'false'
  ],
  'cart.item.price.priceWithTax': [
    '79.99'
  ],
  'cart.item.price.currency': [
    'EUR'
  ],
  'cart.item.quantity': [
    '1'
  ],
  'user.isGuestCheckout': 'false',
  'user.segment.isLoggedIn': 'true',
  'user.segment.customerType': '2',
  'user.profile.profileInfo.profileID': '100167589',
  'user.profile.profileInfo.userName': 'Tester McTesterson'
}

describe('the eval solution itself, when exporting simple functions', function () {
  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(code, ['cleanUpDataLayer'])
  })

  it('should fix the anonymous example objects', function () {
    chai.expect(exported.cleanUpDataLayer(inputAnonymous)).to.deep.equal(expectedAnonymous)
  })

  it('should fix the logged in example object', function () {
    chai.expect(exported.cleanUpDataLayer(inputLoggedIn)).to.deep.equal(expectedLoggedIn)
  })
})
