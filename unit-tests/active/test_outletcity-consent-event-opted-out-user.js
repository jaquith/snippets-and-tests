// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
const { option, opts } = require('commander')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
chai.use(require('deep-equal-in-any-order'))

const stringFunctions = require('../helpers/stringFunctions.js')

const getExport = function (loggedIn) {
  const code = stringFunctions.getVanillaJsFile('code/outletcity-consent-event-opted-out-user-v2.html')
  let cleanedCode = code.replace('<script type="text/javascript">', '')
  cleanedCode = cleanedCode.replace('</script>', '')

  if (loggedIn) {
    cleanedCode = cleanedCode.replace(new RegExp('{{DL - customer - customerID}}', 'g'), '123456789')
  } else {
    // this really seems to be how GTM does it in at least some cases
    cleanedCode = cleanedCode.replace(new RegExp('{{DL - customer - customerID}}', 'g'), 'undefined')
  }

  // simulate the case
  cleanedCode = cleanedCode.replace(new RegExp('{{Constant - Tealium - Account ID}}', 'g'), 'outletcity')
  cleanedCode = cleanedCode.replace(new RegExp('{{Lookup - Tealium - Profile}}', 'g'), 'main')

  const before = 'function fireConsentUpdate (document, window, dataLayer) {\nvar XMLHttpRequest = window.XMLHttpRequest\n\n'
  const after = '\nreturn [payload, !!shouldFire]\n}'
  return stringFunctions.exportNamedElements(cleanedCode, ['fireConsentUpdate'], before, after)
}

const getTest = function (opts) {
  opts = typeof opts === 'object' ? opts : {}
  let finalTealiumConsentState = opts.finalTealiumConsentState
  let hasCookie = opts.hasCookie
  let loggedIn = opts.loggedIn
  let isConsentChangeEvent = opts.isConsentChangeEvent
  let shouldFire = opts.shouldFire

  // ensure a boolean
  finalTealiumConsentState = !!finalTealiumConsentState
  let initialTealiumState = finalTealiumConsentState
  if (isConsentChangeEvent) {
    initialTealiumState = !finalTealiumConsentState
  }
  return function () {
    const exported = getExport(loggedIn)
    let dl = [
      {
        "Recommendation": {
          "pageData": {
            "pageType": "LandingPage",
            "pageUid": "homepage",
            "pageName": "LandingPage - DefaultHome",
            "pagePath": "/de-de/shop/",
            "pageTitle": "OUTLETCITY.COM Deutschland | Homepage",
            "language": "de",
            "shopCountry": "de",
            "cmsSite": "ocm-de"
          },
          "serverNode": "prod-wapp8"
        }
      },
      {
        "gtmLocation": "https://www.outletcity.com/de-de/shop/"
      },
      {
        "gtm.start": 1618934165113,
        "event": "gtm.js",
        "gtm.uniqueEventId": 1
      },
      {
        "event": "gtm.dom",
        "gtm.uniqueEventId": 2
      },
      {
        "usc_origin": "from server setting",
        "event": "consents_initialized",
        "Optin": true,
        "42ads": true,
        "AWIN": true,
        "Bing Ads": true,
        "ChannelPilot": true,
        "cloudfront.net": true,
        "Criteo": true,
        "Emarsys": true,
        "epoq": true,
        "Facebook Pixel": true,
        "Facebook Connect": false,
        "Fastly": true,
        "Fitanalytics": true,
        "Google Ads": true,
        "Google Analytics": true,
        "Google Maps": false,
        "Google OAuth": false,
        "Google Tag Manager": true,
        "Google Optimize": true,
        "gstatic.com": true,
        "Instagram Content": true,
        "intelliAd Tracking": true,
        "Mouseflow": true,
        "Outbrain": true,
        "reCAPTCHA": true,
        "Sovendus": true,
        "Usabilla": true,
        "Usercentrics Consent Management Platform": true,
        "YouTube Video": false,
        "HI Share that": true,
        "8SELECT": true,
        "Outletcity classicPageViews": true,
        "Outletcity _ocmr": true,
        "Outletcity ocmAwP": true,
        "Outletcity de.ocm.app-smartbanner-closed": true,
        "Outletcity ocmAdP": true,
        "Outletcity _ocmLast_context": true,
        "Outletcity OCM_JSESSIONID": true,
        "Outletcity _ocmz": true,
        "Tealium Inc": initialTealiumState,
        "gtm.uniqueEventId": 3
      },
      {
        "event": "gtm.load",
        "gtm.uniqueEventId": 6
      },
      {
        "event": "gtm.scrollDepth",
        "gtm.scrollThreshold": 25,
        "gtm.scrollUnits": "percent",
        "gtm.scrollDirection": "vertical",
        "gtm.triggers": "1951618_598,1951618_681",
        "gtm.uniqueEventId": 7
      },
      {
        "event": "gtm.scrollDepth",
        "gtm.scrollThreshold": 50,
        "gtm.scrollUnits": "percent",
        "gtm.scrollDirection": "vertical",
        "gtm.triggers": "1951618_598,1951618_681",
        "gtm.uniqueEventId": 8
      },
      {
        "event": "gtm.scrollDepth",
        "gtm.scrollThreshold": 60,
        "gtm.scrollUnits": "percent",
        "gtm.scrollDirection": "vertical",
        "gtm.triggers": "1951618_678",
        "gtm.uniqueEventId": 9
      },
      {
        "event": "gtm.scrollDepth",
        "gtm.scrollThreshold": 75,
        "gtm.scrollUnits": "percent",
        "gtm.scrollDirection": "vertical",
        "gtm.triggers": "1951618_598,1951618_681",
        "gtm.uniqueEventId": 10
      },
      {
        "event": "gtm.scrollDepth",
        "gtm.scrollThreshold": 80,
        "gtm.scrollUnits": "percent",
        "gtm.scrollDirection": "vertical",
        "gtm.triggers": "1951618_678",
        "gtm.uniqueEventId": 11
      }
    ]
    if (hasCookie) {
      document.cookie = "TEAL=v:7178214980882450500161155686637798856717aaa$t:1615467968467$s:1615466168460%3Bexp-sess$sn:1$en:1"
    }
    if (isConsentChangeEvent) {
      dl.push(
        {
          "event": "consents_changed_finished",
          "Fitanalytics": false,
          "gtm.uniqueEventId": 26
        }
      )
      dl.push(
        {
          "event": "consents_changed_finished",
          "Tealium Inc": finalTealiumConsentState,
          "gtm.uniqueEventId": 27
        }
      )
    }
    const dlSnapshot = JSON.parse(JSON.stringify(dl))
    let output = exported.fireConsentUpdate(document, window, dl)
    let expectedConsentPayload = {
      "42ads": true,
      "8SELECT": true,
      "AWIN": true,
      "Bing_Ads": true,
      "ChannelPilot": true,
      "Criteo": true,
      "Emarsys": true,
      "Facebook_Connect": false,
      "Facebook_Pixel": true,
      "Fastly": true,
      "Fitanalytics": !isConsentChangeEvent,
      "Google_Ads": true,
      "Google_Analytics": true,
      "Google_Maps": false,
      "Google_OAuth": false,
      "Google_Optimize": true,
      "Google_Tag_Manager": true,
      "HI_Share_that": true,
      "Instagram_Content": true,
      "Mouseflow": true,
      "Optin": true,
      "Outbrain": true,
      "Outletcity_OCM_JSESSIONID": true,
      "Outletcity__ocmLast_context": true,
      "Outletcity__ocmr": true,
      "Outletcity__ocmz": true,
      "Outletcity_classicPageViews": true,
      "Outletcity_de.ocm.app-smartbanner-closed": true,
      "Outletcity_ocmAdP": true,
      "Outletcity_ocmAwP": true,
      "Sovendus": true,
      "Tealium_Inc": finalTealiumConsentState,
      "Usabilla": true,
      "Usercentrics_Consent_Management_Platform": true,
      "YouTube_Video": false,
      "cloudfront.net": true,
      "epoq": true,
      "gstatic.com": true,
      "intelliAd_Tracking": true,
      "reCAPTCHA": true,
      "tealium_account": "outletcity",
      "tealium_event": "consents_changed_finished",
      "tealium_profile": "main"
    }
    if (hasCookie) {
      expectedConsentPayload.tealium_visitor_id = "7178214980882450500161155686637798856717aaa"
    }
    if (loggedIn) {
      expectedConsentPayload.customer_id = "123456789"
    }
    chai.expect(output).to.deep.equal([expectedConsentPayload, shouldFire])
    chai.expect(dl).to.deep.equal(dlSnapshot)
  }
}

describe('the outletcity consent event for opted out users GTM tag', function () {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')() // add globals like window, document, etc., as if in a browser
  })

  it('should export without error', function () {
    // convert the Custom HTML Tag to JS, quick and dirty
    const exported = getExport(false)
    chai.expect(exported).to.be.an('object').with.key('fireConsentUpdate')
  })

  it('CONSENT UPDATE - should NOT fire in an opt-out case without cookie without login', getTest({
    finalTealiumConsentState: false,
    hasCookie: false, 
    loggedIn: false, 
    isConsentChangeEvent: true, 
    shouldFire: false
  }))

  it('CONSENT UPDATE - should fire in an opt-out case without cookie WITH login', getTest({
    finalTealiumConsentState: false,
    hasCookie: false, 
    loggedIn: true, 
    isConsentChangeEvent: true, 
    shouldFire: true
  }))

  it('CONSENT UPDATE - should fire in an opt-out case WITH cookie without login', getTest({
    finalTealiumConsentState: false,
    hasCookie: true, 
    loggedIn: false, 
    isConsentChangeEvent: true, 
    shouldFire: true
  }))

  it('CONSENT UPDATE - should fire in an opt-out case WITH cookie WITH login', getTest({
    finalTealiumConsentState: false,
    hasCookie: true, 
    loggedIn: true, 
    isConsentChangeEvent: true, 
    shouldFire: true
  }))

  it('CONSENT UPDATE - should NOT fire in an opt-in case without cookie without login', getTest({
    finalTealiumConsentState: true,
    hasCookie: false, 
    loggedIn: false, 
    isConsentChangeEvent: true, 
    shouldFire: false
  }))

  it('CONSENT UPDATE - should NOT fire in an opt-in case without cookie WITH login', getTest({
    finalTealiumConsentState: true,
    hasCookie: true, 
    loggedIn: true, 
    isConsentChangeEvent: true, 
    shouldFire: false
  }))

  it('CONSENT UPDATE - should NOT fire in an opt-in case WITH cookie without login', getTest({
    finalTealiumConsentState: true,
    hasCookie: true, 
    loggedIn: false, 
    isConsentChangeEvent: true, 
    shouldFire: false
  }))

  it('CONSENT UPDATE - should NOT fire in an opt-in case WITH cookie WITH login', getTest({
    finalTealiumConsentState: true,
    hasCookie: true, 
    loggedIn: true, 
    isConsentChangeEvent: true, 
    shouldFire: false
  }))

  it('LOGIN - should NOT fire in an opt-in case without cookie WITH login', getTest({
    finalTealiumConsentState: true,
    hasCookie: false, 
    loggedIn: true, 
    isConsentChangeEvent: false, 
    shouldFire: false
  }))

  it('LOGIN - should NOT fire in an opt-in case WITH cookie WITH login', getTest({
    finalTealiumConsentState: true,
    hasCookie: true, 
    loggedIn: true, 
    isConsentChangeEvent: false, 
    shouldFire: false
  }))

  it('LOGIN - should fire in an opt-out case without cookie WITH login', getTest({
    finalTealiumConsentState: false,
    hasCookie: false, 
    loggedIn: true, 
    isConsentChangeEvent: false, 
    shouldFire: true
  }))

  it('LOGIN - should fire in an opt-out case WITH cookie WITH login', getTest({
    finalTealiumConsentState: false,
    hasCookie: true, 
    loggedIn: true, 
    isConsentChangeEvent: false, 
    shouldFire: true
  }))
})



