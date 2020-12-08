s.events = (function ensightenAdobeEventLogic(existingEventString) {
  // just a shim
  var s = {}
  s.apl = function anonymous(l,v,d,u
    ) {
    var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a.length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCase()));}}if(!m)l=l?l+d+v:v;return l
    }
  s.events = existingEventString || ''
  s.split = function anonymous(l,d
    ) {
    var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x++]=l.substring(0,i);l=l.substring(i+d.length);}return a
    }
  
  var bookingReference = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Tracsref ? tui.analytics.page.Tracsref : window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.transactionId ? dataLayer[0].transactions.total.transactionId : ""),

    totalPrice = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Sum ? parseFloat(tui.analytics.page.Sum) : window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.totalPrice ? parseFloat(dataLayer[0].transactions.total.totalPrice) : 0),

    creditNoteDiscountValue = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.bookingLevelCreditNoteDiscount && tui.analytics.page.bookingLevelCreditNoteDiscount != 'null' ? parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount) : window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount ? parseFloat(dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount) : 0),

    creditNoteRefundValue = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.creditNoteRefundValue && tui.analytics.page.creditNoteRefundValue != 'null' ? parseFloat(tui.analytics.page.creditNoteRefundValue) : window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.creditNoteRefundValue ? parseFloat(dataLayer[0].transactions.total.creditNoteRefundValue) : 0),
    
    onlineDiscount = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page && tui.analytics.page.Disc && tui.analytics.page.Disc != 'null' ? parseFloat(tui.analytics.page.Disc) : window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.discount ? parseFloat(dataLayer[0].transactions.total.discount) : 0),

    bookingPax = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page && tui.analytics.page.Pax && tui.analytics.page.Pax != 'null' ? parseInt(tui.analytics.page.Pax) : window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.quantity && dataLayer[0].transactions.items.quantity.pax ? parseInt(dataLayer[0].transactions.items.quantity.pax) : 0),

    incentivePromoValue = incentivePromoDiscount();

  function incentivePromoDiscount() {

    if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCodes && dataLayer[0].transactions.total.bookingLevelPromoCodes.length > 0) {
      var rgx = new RegExp('/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i', 'i');
      var promoCodeArray = dataLayer[0].transactions.total.bookingLevelPromoCodes;
      var result = 0;
      for (i = 0; i < promoCodeArray.length; i++) {
        if (rgx.test(promoCodeArray[i].bookingLevelPromoCode)) {
          result = promoCodeArray[i].bookingLevelPromoDiscount;
        }
      }
      return result;
    } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.IncentivePromoValue && tui.analytics.page.IncentivePromoValue != 'null') {
      return parseFloat(tui.analytics.page.IncentivePromoValue);
    } else {
      return 0;
    }
  }

  //Normal Bookflow & LYP with same confirmation url
  if ((document.URL.indexOf('/book/confirmation') !== -1 || document.URL.indexOf('/book/mobile/confirmation') !== -1 || document.URL.indexOf('/book/bookingConfirmation') !== -1) && bookingReference && typeof bookingReference === "string" && bookingReference.length > 5) {
    if ((window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.isLockYourPrice == "Yes") || (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.pageID == "lockYourPriceConfirmationpage_react")) {
      s.events = "event78:" + bookingReference + "LYP" // event serialisation with event78 (LYP Unconfirmed Booking)
        +
        ",event80=" + window.dataLayer[0].transactions.total.lockYourPriceValue + ":" + bookingReference + "LYP" + ",event81=" + totalPrice + ":" + bookingReference + "LYP";
    } else {
      s.events = "purchase" + ",event4=" + (creditNoteDiscountValue > 0 ? totalPrice + creditNoteDiscountValue : totalPrice) + ",event5=" + onlineDiscount + ",event9=" + bookingPax + ",event150,event151,event152,event153,event154,event158,event159" //added 158&159 for PC Incentive 
        +
        ",event155=" + creditNoteDiscountValue // Added for credit note launch
        +
        ",event156=" + creditNoteRefundValue // Added for credit note launch
        +
        ",event157=" + (creditNoteDiscountValue > 0 ? totalPrice : 0) // Addded for credit note launch
        +
        ",event160=" + (creditNoteDiscountValue > 0 ? totalPrice + creditNoteDiscountValue + incentivePromoValue : totalPrice); // multiple promocode - maintaining redemption code reporting
    }
  }

  //LYP mmb Bookflow (managemybooking/paymentconfirmation is the MMB confirmation page)
  else if ((document.URL.indexOf('/managemybooking/paymentconfirmation') !== -1) && window.dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && bookingReference && typeof bookingReference === "string" && bookingReference.length > 5 && dataLayer[0].transactions.total.isLockYourPrice == "Yes") {
    s.events = "purchase" + ",event4=" + (creditNoteDiscountValue > 0 ? totalPrice + creditNoteDiscountValue : totalPrice) + ",event5=" + onlineDiscount + ",event9=" + bookingPax + ",event79" // Lock Your Price confirmed booking
      +
      ",event80=" + (window.dataLayer[0].transactions.total.lockYourPriceValue * -1) + ",event150,event151,event152,event153,event154,event158,event159"; //added 158&159 for PC Incentive
  }

  //MMB Unpaid
  else if (document.URL.indexOf('your-account/managemybooking/amendmentsuccess') !== -1 && typeof window.tui.analytics.events != 'undefined' && window.tui.analytics.events !== null) {
    for (var i = 0; i < window.tui.analytics.events.length; i++) {
      if (window.tui.analytics.events[i].eventAction == 'MMB Unpaid') {
        s.events = "event301:" + window.tui.analytics.events[i].eventSerialisationNumber;
        /*
        if(window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.bookingLevelPromoCode && tui.analytics.page.bookingLevelPromoDiscount){
           if(tui.analytics.page.bookingLevelPromoCode == 'CVRM'|| tui.analytics.page.bookingLevelPromoCode == 'CVRHC'){
            s.events = s.apl(s.events,'event154=' + tui.analytics.page.bookingLevelPromoDiscount ,',',1);
           }
        }*/

        // Start
        var dl = window.dataLayer
        if (dl && dl[0] && dl[0].transactions && dl[0].transactions.total) {
          // If old object is shown - can be removed at a later date
          if (dl[0].transactions.total.bookingLevelPromoDiscount && typeof dl[0].transactions.total.bookingLevelPromoDiscount !== 'undefined') {
            // Check for PC & MMB/Booking Incentive
            if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(dl[0].transactions.total.bookingLevelPromoCode)) {
              // Programme Change Incentive
              if (/CVRHC|CVRW20|CVRS21/i.test(dl[0].transactions.total.bookingLevelPromoCode)) {
                s.events = s.apl(s.events, 'event158=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount), ',', 1);
              }
              // MMB/Booking Incentive
              if (/CVRI|CVRM|CVRV/i.test(dl[0].transactions.total.bookingLevelPromoCode)) {
                s.events = s.apl(s.events, 'event159=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount), ',', 1);
              }
            } else {
              s.events = s.apl(s.events, 'event154=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount), ',', 1);
            }
            // Added to handle new promo code array
          } else if (dl[0].transactions.total.bookingLevelPromoCodes && dl[0].transactions.total.bookingLevelPromoCodes.length > 0) {
            var promoCodeArray = dl[0].transactions.total.bookingLevelPromoCodes;
            for (i = 0; i < promoCodeArray.length; i++) {

              if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                // Programme Change Incentive
                if (/CVRHC|CVRW20|CVRS21/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                  s.events = s.apl(s.events, 'event158=' + Math.abs(promoCodeArray[i].bookingLevelPromoDiscount), ',', 1);
                }
                // MMB/Booking Incentive
                if (/CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                  s.events = s.apl(s.events, 'event159=' + Math.abs(promoCodeArray[i].bookingLevelPromoDiscount), ',', 1);
                }
              } else {
                s.events = s.apl(s.events, 'event154=' + Math.abs(promoCodeArray[i].bookingLevelPromoDiscount), ',', 1);
              }
            }
          }
          // For legacy data layer (only single promo code & value)	
        } else if (window.tui && tui.analytics && tui.analytics.page) {
          if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
            if (/CVRHC|CVRW20|CVRS21/i.test(tui.analytics.page.PromoCode)) {
              s.events = s.apl(s.events, 'event158' + parseFloat(tui.analytics.page.PromoValue), ',', 1);
            } else if (/CVRI|CVRM|CVRV/i.test(tui.analytics.page.PromoCode)) {
              s.events = s.apl(s.events, 'event159' + parseFloat(tui.analytics.page.PromoValue), ',', 1);
            } else {
              s.events = s.apl(s.events, 'event154' + parseFloat(tui.analytics.page.PromoValue), ',', 1);
            }
          }
        } //End
      }
    }
  }

  //MMB Paid
  else if (document.URL.indexOf('your-account/managemybooking/managepaymentconfirmation') !== -1 && typeof window.tui.analytics.events != 'undefined' && window.tui.analytics.events !== null) {
    for (var i = 0; i < window.tui.analytics.events.length; i++) {
      if (window.tui.analytics.events[i].eventAction == 'MMB Paid') {
        s.events = "event302:" + window.tui.analytics.events[i].eventSerialisationNumber;
        /*
        if(window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.bookingLevelPromoCode && tui.analytics.page.bookingLevelPromoDiscount){
           if(tui.analytics.page.bookingLevelPromoCode == 'CVRM'|| tui.analytics.page.bookingLevelPromoCode == 'CVRHC'){
            s.events = s.apl(s.events,'event154=' + tui.analytics.page.bookingLevelPromoDiscount ,',',1);
           }
        }*/

        // Start
        var dl = window.dataLayer
        if (dl && dl[0] && dl[0].transactions && dl[0].transactions.total) {
          // If old object is shown - can be removed at a later date
          if (dl[0].transactions.total.bookingLevelPromoDiscount && typeof dl[0].transactions.total.bookingLevelPromoDiscount !== 'undefined') {
            // Check for PC & MMB/Booking Incentive
            if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(dl[0].transactions.total.bookingLevelPromoCode)) {
              // Programme Change Incentive
              if (/CVRHC|CVRW20|CVRS21/i.test(dl[0].transactions.total.bookingLevelPromoCode)) {
                s.events = s.apl(s.events, 'event158=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount), ',', 1);
              }
              // MMB/Booking Incentive
              if (/CVRI|CVRM|CVRV/i.test(dl[0].transactions.total.bookingLevelPromoCode)) {
                s.events = s.apl(s.events, 'event159=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount), ',', 1);
              }
            } else {
              s.events = s.apl(s.events, 'event154=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount), ',', 1);
            }
            // Added to handle new promo code array
          } else if (dl[0].transactions.total.bookingLevelPromoCodes && dl[0].transactions.total.bookingLevelPromoCodes.length > 0) {
            var promoCodeArray = dl[0].transactions.total.bookingLevelPromoCodes
            for (i = 0; i < promoCodeArray.length; i++) {

              if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                // Programme Change Incentive
                if (/CVRHC|CVRW20|CVRS21/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                  s.events = s.apl(s.events, 'event158=' + Math.abs(promoCodeArray[i].bookingLevelPromoDiscount), ',', 1);
                }
                // MMB/Booking Incentive
                if (/CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                  s.events = s.apl(s.events, 'event159=' + Math.abs(promoCodeArray[i].bookingLevelPromoDiscount), ',', 1);
                }
              } else {
                s.events = s.apl(s.events, 'event154=' + Math.abs(promoCodeArray[i].bookingLevelPromoDiscount), ',', 1);
              }
            }
          }
          // For legacy data layer (only single promo code & value)	
        } else if (window.tui && tui.analytics && tui.analytics.page) {
          if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
            if (/CVRHC|CVRW20|CVRS21/i.test(tui.analytics.page.PromoCode)) {
              s.events = s.apl(s.events, 'event158' + parseFloat(tui.analytics.page.PromoValue), ',', 1);
            } else if (/CVRI|CVRM|CVRV/i.test(tui.analytics.page.PromoCode)) {
              s.events = s.apl(s.events, 'event159' + parseFloat(tui.analytics.page.PromoValue), ',', 1);
            } else {
              s.events = s.apl(s.events, 'event154' + parseFloat(tui.analytics.page.PromoValue), ',', 1);
            }
          }
        } //End
      }
    }
  }

  //MMB Cancel
  else if (document.URL.indexOf('your-account/managemybooking/cancelbooking') !== -1 && typeof window.tui.analytics.events != 'undefined' && window.tui.analytics.events !== null) {
    for (var i = 0; i < window.tui.analytics.events.length; i++) {
      if (window.tui.analytics.events[i].eventAction == 'MMB Cancel') {
        s.events = "event303:" + window.tui.analytics.events[i].eventSerialisationNumber;
      }
    }
  }

  //Price Variation Alert
  else if (document.URL.indexOf('/book/flow/summary') !== -1 || document.URL.indexOf('/book/passengerdetails') !== -1 || document.URL.indexOf('/cps/pageRender') !== -1) {
    var priceStatus = document.querySelectorAll('.PriceVariationAlert__infoTextHeading');
    var price = document.querySelectorAll('.alertprice');
    if (priceStatus.length > 0 && priceStatus[0].innerText.includes("INCREASED")) {
      s.events = "event47,event48=" + price[0].innerText.replace(/[£€]/g, '');
    } else if (priceStatus.length > 0 && priceStatus[0].innerText.includes("DECREASED")) {
      s.events = "event47,event48=" + -price[0].innerText.replace(/[£€]/g, '');
    }
  }

  // Credit Note Booking
  if ((document.URL.indexOf('/book/confirmation') !== -1 || document.URL.indexOf('/book/mobile/confirmation') !== -1 || document.URL.indexOf('/book/bookingConfirmation') !== -1) && bookingReference && typeof bookingReference === "string" && bookingReference.length > 5) {
    var creditNoteBooking = Bootstrapper._SC.dataHandler(arguments, "62528");
    if (creditNoteBooking.toLowerCase() == "yes") {
      s.events = s.apl(s.events, 'event70', ',', 1);
    }
  }


  // Performance Timing Replacement
  /*
    var pt = (Bootstrapper.PTE && Bootstrapper.PTE.performanceTimings && Bootstrapper.PTE.performanceTimings.get ? Bootstrapper.PTE.performanceTimings.get() : '');

    if (pt) {
        pt = pt.split('|');
        s.events = s.apl(s.events,'event980=' + pt[0],',',1);
        s.events = s.apl(s.events,'event981=' + pt[1],',',1);
        s.events = s.apl(s.events,'event982=' + pt[2],',',1);
        s.events = s.apl(s.events,'event983=' + pt[3],',',1);
        s.events = s.apl(s.events,'event984=' + pt[4],',',1);
        s.events = s.apl(s.events,'event985=' + pt[5],',',1);
        s.events = s.apl(s.events,'event986=' + pt[6],',',1);
        s.events = s.apl(s.events,'event987=' + pt[7],',',1);
        s.events = s.apl(s.events,'event988=' + pt[8],',',1);
        
        if (pt[9] > 0) {
            s.events = s.apl(s.events,'event989=' + pt[9],',',1);
        }
        if (pt[10] > 0) {
        s.events = s.apl(s.events,'event990=' + pt[10],',',1);
        }
        s.events = s.apl(s.events,'event1000',',',1);
    }
    */

  // Bookflow Events
  // Search
  if (document.URL.indexOf('/destinations/packages') != -1 || document.URL.indexOf('/flight/search') != -1 || document.URL.indexOf('/cruise/packages') != -1 || document.URL.indexOf('/holiday/packages') != -1 || document.URL.indexOf('/f/packages') != -1 || document.URL.indexOf('/river-cruises/packages') != -1 || document.URL.indexOf('/retail/packages') != -1) {
    s.events = s.apl(s.events, "event1", ",", 1);
  }

  // Product View & Custom Product View
  if (document.URL.indexOf('/bookaccommodation') != -1 || document.URL.indexOf('/flight/book/flightoptions') != -1 || document.URL.indexOf('/flight/book/mobile/flightoptions') != -1 || document.URL.indexOf('/cruise/bookitineraries') != -1) {
    s.events = s.apl(s.events, "event11,prodView", ",", 1);
  }

  // Beach Bookflow Events
  if (document.URL.indexOf('bookaccommodation') != -1) {
    s.events = s.apl(s.events, "event15", ",", 1);
  } else if (document.URL.indexOf('/book/mobile/hubsummary') != -1) {
    s.events = s.apl(s.events, "event16", ",", 1);
  } else if (document.URL.indexOf('/destinations/book/flightoptions') != -1 || document.URL.indexOf('/destinations/book/mobile/flightoptions') != -1 || document.URL.indexOf('/destinations/book/flow/flightoptions') != -1 || document.URL.indexOf('/holiday/book/flightoptions') != -1 || document.URL.indexOf('/holiday/book/mobile/flightoptions') != -1 || document.URL.indexOf('/holiday/book/flow/flightoptions') != -1 || document.URL.indexOf('/f/book/flightoptions') != -1 || document.URL.indexOf('/f/book/flow/flightoptions') != -1 || document.URL.indexOf('/f/book/mobile/flightoptions') != -1 || document.URL.indexOf('/retail/book/flow/flightoptions') != -1) {
    s.events = s.apl(s.events, "event17,scView,scOpen,scAdd", ",", 1);
  } else if (document.URL.indexOf('/destinations/book/roomoptions') != -1 || document.URL.indexOf('/destinations/book/mobile/roomoptions') != -1 || document.URL.indexOf('/destinations/book/flow/roomoptions') != -1 || document.URL.indexOf('/holiday/book/roomoptions') != -1 || document.URL.indexOf('/holiday/book/mobile/roomoptions') != -1 || document.URL.indexOf('/holiday/book/flow/roomoptions') != -1 || document.URL.indexOf('/f/book/roomoptions') != -1 || document.URL.indexOf('/f/book/flow/roomoptions') != -1 || document.URL.indexOf('/f/book/mobile/roomoptions') != -1 || document.URL.indexOf('/retail/book/flow/roomoptions') != -1) {
    s.events = s.apl(s.events, "event18", ",", 1);
  } else if (document.URL.indexOf('/destinations/book/extraoptions') != -1 || document.URL.indexOf('/destinations/book/mobile/extraoptions') != -1 || document.URL.indexOf('/destinations/book/flow/extraoptions') != -1 || document.URL.indexOf('/holiday/book/extraoptions') != -1 || document.URL.indexOf('/holiday/book/mobile/extraoptions') != -1 || document.URL.indexOf('/holiday/book/flow/extraoptions') != -1 || document.URL.indexOf('/f/book/extraoptions') != -1 || document.URL.indexOf('/f/book/flow/extraoptions') != -1 || document.URL.indexOf('/f/book/mobile/extraoptions') != -1 || document.URL.indexOf('/retail/book/flow/extraoptions') != -1) {
    s.events = s.apl(s.events, "event19", ",", 1);
  } else if (document.URL.indexOf('/destinations/book/passengerdetails') != -1 || document.URL.indexOf('/destinations/book/mobile/passengerdetails') != -1 || document.URL.indexOf('/holiday/book/passengerdetails') != -1 || document.URL.indexOf('/holiday/book/mobile/passengerdetails') != -1 || document.URL.indexOf('/f/book/passengerdetails') != -1 || document.URL.indexOf('/f/book/mobile/passengerdetails') != -1 || document.URL.indexOf('/retail/book/passengerdetails') != -1) {
    s.events = s.apl(s.events, "event20,scCheckout", ",", 1);
  } else if (document.URL.indexOf('/cps/pageRender') != -1 && (s.Util.getQueryParam('b').indexOf('25000') != -1 || s.Util.getQueryParam('b').indexOf('32000') != -1 || s.Util.getQueryParam('b').indexOf('50000') != -1 || s.Util.getQueryParam('b').indexOf('19000') != -1 || s.Util.getQueryParam('b').indexOf('41000') != -1 || s.Util.getQueryParam('b').indexOf('31000') != -1 || s.Util.getQueryParam('b').indexOf('10000') != -1 || s.Util.getQueryParam('b').indexOf('20000') != -1 || s.Util.getQueryParam('b').indexOf('42000') != -1 || s.Util.getQueryParam('b').indexOf('51000') != -1 || s.Util.getQueryParam('b').indexOf('52000') != -1 || s.Util.getQueryParam('b').indexOf('53000') != -1 || s.Util.getQueryParam('b').indexOf('38000') != -1)) {
    s.events = s.apl(s.events, "event21", ",", 1);
  } else if (document.URL.indexOf('/destinations/book/confirmation') != -1 || document.URL.indexOf('/destinations/book/mobile/confirmation') != -1 || document.URL.indexOf('/holiday/book/confirmation') != -1 || document.URL.indexOf('/holiday/book/mobile/confirmation') != -1 || document.URL.indexOf('/f/book/confirmation') != -1 || document.URL.indexOf('/f/book/mobile/confirmation') != -1 || document.URL.indexOf('/managemybooking/paymentconfirmation') != -1 || document.URL.indexOf('/retail/book/bookingConfirmation') != -1 || document.URL.indexOf('/retail/f/book/bookingConfirmation') != -1) {
    if (window.tui.analytics.page.pageUid != 'lockYourPriceConfirmationpage_react' || dataLayer[0].page.pageID != 'lockYourPriceConfirmationpage_react') {
      s.events = s.apl(s.events, "event22", ",", 1);
    }
  }

  // Cruise Bookflow Events	
  else if (document.URL.indexOf('/cruise/bookitineraries') != -1) {
    s.events = s.apl(s.events, "event23", ",", 1);
  } else if (document.URL.indexOf('/cruise/packages/hotels') != -1) {
    s.events = s.apl(s.events, "event24", ",", 1);
  } else if (document.URL.indexOf('/cruise/bookHotelDetails') != -1) {
    s.events = s.apl(s.events, "event25", ",", 1);
  } else if (document.URL.indexOf('/cruise/book/cruiseoptions') != -1 || document.URL.indexOf('/cruise/book/flow/cruiseoptions') != -1) {
    s.events = s.apl(s.events, "event26,scView,scOpen,scAdd", ",", 1);
  } else if (document.URL.indexOf('/cruise/book/flightoptions') != -1 || document.URL.indexOf('/cruise/book/flow/flightoptions') != -1) {
    s.events = s.apl(s.events, "event27", ",", 1);
  } else if (document.URL.indexOf('/cruise/book/roomoptions') != -1 || document.URL.indexOf('/cruise/book/flow/roomoptions') != -1) {
    s.events = s.apl(s.events, "event28", ",", 1);
  } else if (document.URL.indexOf('/cruise/book/extraoptions') != -1 || document.URL.indexOf('/cruise/book/flow/extraoptions') != -1) {
    s.events = s.apl(s.events, "event29", ",", 1);
  } else if (document.URL.indexOf('/cruise/book/passengerdetails') != -1) {
    s.events = s.apl(s.events, "event30,scCheckout", ",", 1);
  } else if (document.URL.indexOf('/cps/pageRender') != -1 && (s.Util.getQueryParam('b').indexOf('37000') != -1 || s.Util.getQueryParam('b').indexOf('54000') != -1 || s.Util.getQueryParam('b').indexOf('49000') != -1)) {
    s.events = s.apl(s.events, "event31", ",", 1);
  } else if (document.URL.indexOf('/cruise/book/confirmation') != -1 || document.URL.indexOf('/retail/cruise/book/bookingConfirmation') != -1 || document.URL.indexOf('/retail/f/cruise/book/bookingConfirmation') != -1) {
    s.events = s.apl(s.events, "event32", ",", 1);
  }


  // Flight Only Bookflow Events		
  else if (document.URL.indexOf('/flight/book/flightoptions') != -1 || document.URL.indexOf('/flight/book/mobile/flightoptions') != -1) {
    s.events = s.apl(s.events, "event33,scView,scOpen,scAdd", ",", 1);
  } else if (document.URL.indexOf('/flight/book/extraoptions') != -1 || document.URL.indexOf('/flight/book/mobile/extraoptions') != -1) {
    s.events = s.apl(s.events, "event34", ",", 1);
  } else if (document.URL.indexOf('/flight/book/passengerdetails') != -1 || document.URL.indexOf('/flight/book/mobile/passengerdetails') != -1) {
    s.events = s.apl(s.events, "event35,scCheckout", ",", 1);
  } else if (document.URL.indexOf('/cps/pageRender') != -1 && (s.Util.getQueryParam('b').indexOf('39000') != -1 || s.Util.getQueryParam('b').indexOf('47000') != -1 || s.Util.getQueryParam('b').indexOf('40000') != -1 || s.Util.getQueryParam('b').indexOf('48000') != -1 || s.Util.getQueryParam('b').indexOf('59000') != -1 || s.Util.getQueryParam('b').indexOf('60000') != -1)) {
    s.events = s.apl(s.events, "event36", ",", 1);
  } else if (document.URL.indexOf('/flight/book/confirmation') != -1 || document.URL.indexOf('/flight/book/mobile/confirmation') != -1 || document.URL.indexOf('/retail/flight/book/bookingConfirmation') != -1 || document.URL.indexOf('/retail/f/flight/book/bookingConfirmation') != -1) {
    s.events = s.apl(s.events, "event37", ",", 1);
  }


  // This is for event 8 (Pax) (legacy_numberOfPax)

  if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Pax) {
    s.events = s.apl(s.events, "event8=" + tui.analytics.page.Pax, ",", 1);
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.paxDetails && dataLayer[0].transactions.total.paxDetails.total) {
    s.events = s.apl(s.events, "event8=" + dataLayer[0].transactions.total.paxDetails.total, ",", 1);
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.paxDetails && dataLayer[0].basket.price.paxDetails.total) {
    s.events = s.apl(s.events, "event8=" + dataLayer[0].basket.price.paxDetails.total, ",", 1);
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.noOfPax) {
    s.events = s.apl(s.events, "event8=" + dataLayer[0].product.noOfPax, ",", 1);
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.noOfPax) {
    s.events = s.apl(s.events, "event8=" + dataLayer[0].page.search.noOfPax, ",", 1);
  }

  // This is for event 10 (Discount) (legacy_onlineDiscount)

  if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Disc) {
    s.events = s.apl(s.events, "event10=" + tui.analytics.page.Disc, ",", 1);
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.discount) {
    s.events = s.apl(s.events, "event10=" + Math.round(dataLayer[0].transactions.total.discount).toString(), ",", 1);
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.discount) {
    s.events = s.apl(s.events, "event10=" + Math.round(dataLayer[0].basket.price.discount).toString(), ",", 1);
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.discount) {
    s.events = s.apl(s.events, "event10=" + Math.round(dataLayer[0].product.discount).toString(), ",", 1);
  } else if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.onlineDiscount) {
    s.events = s.apl(s.events, "event10=" + Math.round(jsonData.packageViewData.onlineDiscount).toString(), ",", 1);
  }


  // This is for event 38 (Revenue) (legacy_)

  if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Sum) {
    if (window.tui.analytics.page.bookingLevelCreditNoteDiscount && (parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount) > 0)) {
      s.events = s.apl(s.events, "event38=" + (parseFloat(tui.analytics.page.Sum) + parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount)), ",", 1);
    } else {
      s.events = s.events = s.apl(s.events, "event38=" + tui.analytics.page.Sum, ",", 1);
    }
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.totalPrice) {
    if (window.dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount && dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount > 0) {
      s.events = s.apl(s.events, "event38=" + (dataLayer[0].transactions.total.totalPrice + dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount), ",", 1);
    } else {
      s.events = s.apl(s.events, "event38=" + dataLayer[0].transactions.total.totalPrice, ",", 1);
    }
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.totalPrice) {
    if (window.dataLayer[0].basket.price.bookingLevelCreditNoteDiscount && dataLayer[0].basket.price.bookingLevelCreditNoteDiscount > 0) {
      s.events = s.apl(s.events, "event38=" + (dataLayer[0].basket.price.totalPrice + dataLayer[0].basket.price.bookingLevelCreditNoteDiscount), ",", 1);
    } else {
      s.events = s.apl(s.events, "event38=" + dataLayer[0].basket.price.totalPrice, ",", 1);
    }
  } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.currentPrice) {
    s.events = s.apl(s.events, "event38=" + dataLayer[0].product.currentPrice, ",", 1);
  }

  // For Privacy
  try {
    var privacyExperience = Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Experience');
    if (privacyExperience !== 'C') {
      if (window.gateway && window.gateway.isInitialized && String(Bootstrapper.gateway.getCookie('BANNER_VIEWED')) !== '1') {
        s.events = s.apl(s.events, 'event107', ',', 1);
      }
    }
  } catch (err) {
    console.log('Ensighten:event107 not set');
  }

  return s.events;
})(s.events)