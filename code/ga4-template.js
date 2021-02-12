//~~tv:7133.20201015
//~~tc: Update Advertising Features and Advertising Personalization logic
//~~tc: Set gtag_enable_tcf_support on window object
//~~tc: Set Tealium specific developer ID param
//~~tc: Support for App+Web events
//~~tc: Adding support for transport_type and outbound link

// CUSOMIZED to use a separate gtag namespace (window.gtagRenameGA4)

//tealium universal tag - utag.sender.7133 ut4.0.##UTVERSION##, Copyright ##UTYEAR## Tealium.com Inc. All Rights Reserved.
try {
  (function (id, loader) {
    var u = {"id" : id};
    utag.o[loader].sender[id] = u;
    // Please do not modify
    if (utag.ut === undefined) { utag.ut = {}; }
    // Start Tealium loader 4.41
    var match = /ut\d\.(\d*)\..*/.exec(utag.cfg.v);
    if (utag.ut.loader === undefined || !match || parseInt(match[1]) < 41) { u.loader = function(o, a, b, c, l, m) { utag.DB(o); a = document; if (o.type == "iframe") { m = a.getElementById(o.id); if (m && m.tagName == "IFRAME") { b = m; } else { b = a.createElement("iframe"); } o.attrs = o.attrs || {}; utag.ut.merge(o.attrs, { "height": "1", "width": "1", "style": "display:none" }, 0); } else if (o.type == "img") { utag.DB("Attach img: " + o.src); b = new Image(); } else { b = a.createElement("script"); b.language = "javascript"; b.type = "text/javascript"; b.async = 1; b.charset = "utf-8"; } if (o.id) { b.id = o.id; } for (l in utag.loader.GV(o.attrs)) { b.setAttribute(l, o.attrs[l]); } b.setAttribute("src", o.src); if (typeof o.cb == "function") { if (b.addEventListener) { b.addEventListener("load", function() { o.cb(); }, false); } else { b.onreadystatechange = function() { if (this.readyState == "complete" || this.readyState == "loaded") { this.onreadystatechange = null; o.cb(); } }; } } if (o.type != "img" && !m) { l = o.loc || "head"; c = a.getElementsByTagName(l)[0]; if (c) { utag.DB("Attach to " + l + ": " + o.src); if (l == "script") { c.parentNode.insertBefore(b, c); } else { c.appendChild(b); } } } }; } else { u.loader = utag.ut.loader; }
    // End Tealium loader
    // Start Tealium typeOf 4.35
    if (utag.ut.typeOf === undefined) { u.typeOf = function(e) {return ({}).toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();};} else { u.typeOf = utag.ut.typeOf; }
    // End Tealium typeOf

    u.ev = {"view" : 1, "link": 1};

    u.isEmptyObject = function(o, a) {
      for (a in o) {
        if (utag.ut.hasOwn(o, a)) return false;
      }
      return true;
    };

    u.toBoolean = function (val) {
      val = val || "";
      return val === true || val.toLowerCase() === "true" || val.toLowerCase() === "on";
    };

    u.shouldUpdateConfigOnLink = function () {
      // Check for config attributes requiring a config call on link events
      var key;
      if (!u.isEmptyObject(u.data.config.custom_map) || !u.isEmptyObject(u.data.set)) {
        return true;
      }
      for (key in u.data.config) {
        if (key.match("user_id|page_path|page_title|page_location")) {
          return true;
        }
      }
      return false;
    };

    // we want to use a different namespace for GA4, to stay flexible and avoid uneeded coupling
    /*
    u.hasgtagjs = function (){
      window.gtagRename = window.gtagRename || "##UTVARconfig_gaobject##" || "gtag";
      if (utag.ut.gtagScriptRequested) {
        return true;
      }
      var i, s = document.getElementsByTagName("script");
      for (i = 0; i < s.length; i++) {
        if (s[i].src && s[i].src.indexOf("gtag/js") >= 0 && (s[i].id && s[i].id.indexOf("utag") > -1)) {
          return true;
        }
      }
      var data_layer_name = "##UTVARconfig_data_layer_name##" || "dataLayer";
      window[data_layer_name] = window[data_layer_name] || [];
      if ( typeof window[window.gtagRename] !== "function" ) {
        window[window.gtagRename] = function() { window[data_layer_name].push(arguments); };

        //START CROSS DOMAIN TRACKING
        var cross_track = u.toBoolean("##UTVARconfig_cross_track##"),
          cross_track_domains = "##UTVARconfig_cross_track_domains##";

        if (cross_track && cross_track_domains !== "") {
          window[window.gtagRename]("set", "linker", {
            domains: cross_track_domains.split(","),
            accept_incoming: true
          });
        }
        //END CROSS DOMAIN TRACKING

        window[window.gtagRename]("js", new Date());
      }
      return false;
    };
    */

    u.hasgtagjsGA4 = function (){
      window.gtagRenameGA4 = window.gtagRenameGA4 || "##UTVARconfig_gaobject##" || "gtag";
      if (utag.ut.gtagScriptRequestedGA4) {
        return true;
      }
      var i, s = document.getElementsByTagName("script");
      for (i = 0; i < s.length; i++) {
        if (s[i].src && s[i].src.indexOf("gtag/js") >= 0 && (s[i].id && s[i].id.indexOf("utag") > -1)) {
          return true;
        }
      }
      var data_layer_name = "##UTVARconfig_data_layer_name##" || "dataLayer";
      window[data_layer_name] = window[data_layer_name] || [];
      if ( typeof window[window.gtagRenameGA4] !== "function" ) {
        window[window.gtagRenameGA4] = function() { window[data_layer_name].push(arguments); };
    
        //START CROSS DOMAIN TRACKING
        var cross_track = u.toBoolean("##UTVARconfig_cross_track##"),
          cross_track_domains = "##UTVARconfig_cross_track_domains##";
    
        if (cross_track && cross_track_domains !== "") {
          window[window.gtagRenameGA4]("set", "linker", {
            domains: cross_track_domains.split(","),
            accept_incoming: true
          });
        }
        //END CROSS DOMAIN TRACKING
    
        window[window.gtagRenameGA4]("js", new Date());
      }
      return false;
    };

    u.scriptrequested = u.hasgtagjsGA4();

    u.o = window[window.gtagRenameGA4];

    u.map_func = function (arr, obj, item) {
      var i = arr.shift();
      obj[i] = obj[i] || {};
      if (arr.length > 0) {
        u.map_func(arr,obj[i], item);
      } else {
        obj[i] = item;
      }
    };

    // loops through and sets all properties that have to be set using the "set" command
    u.setGlobalProperties = function (data, reset, custom_property) {
      // known params - this can be updated if more get introduced later
      // supports boolean (string or boolean) types also if "type" is set to "bool"
      var map = {
          "user_id" : {"name" :"user_id", "type" : "exists", "reset" : true},
          "page_path" : {"name" : "page_path", "type" : "exists", "reset" : true},
          "page_title" : {"name" : "page_title", "type" : "exists", "reset" : true},
          "page_location" : {"name" : "page_location", "type" : "exists", "reset" : false},
          "developer_id.dYmQxMT" : {"name" : "developer_id.dYmQxMT", "type" : "exists", "reset" : false}
        },
        prop,
        g = {};
      // allow one-off items to be reset if passed in
      if (custom_property && reset) {
        g[custom_property] = "";
      }
      // loop through the known parameters, and either reset them if reset is true, or set them if not
      for (prop in utag.loader.GV(map)) {

        if (reset && map[prop].reset) {
          g[map[prop].name] = "";
        } else {
          // handle "boolean" case
          if (map[prop].type === "bool") {
            if (data[prop] == true || data[prop] === "true") {
              g[map[prop].name] = true;
            }
          }
          // handle default case and just check if the parameter exists on u.data
          else if (map[prop].type === "exists") {
            if (data[prop]) {
              g[map[prop].name] = data[prop];
            }
          }
        }
      }
      if (!u.isEmptyObject(g)){
        u.o("set", g);
      }
    };

    // Returns an array of Product objects for use in impressions, clicks and detail views
    u.item = function (imp, len) {
      var g = {}, i, j, key, items = [];

      if (imp === true) {
        len = len || u.data.impression_id.length || u.data.impression_name.length;
        for (i = 0; i < len; i++) {
          g = {};
          if (u.data.impression_id[i]){g.id = u.data.impression_id[i];}
          if (u.data.impression_name[i]){g.name = u.data.impression_name[i];}
          if (u.data.impression_brand[i]){g.brand = u.data.impression_brand[i];}
          if (u.data.impression_variant[i]){g.variant = u.data.impression_variant[i];}
          if (u.data.impression_category[i]){g.category = u.data.impression_category[i];}
          if (u.data.impression_price[i]){g.price = u.data.impression_price[i];}
          if (u.data.impression_list_name){g.list_name = u.data.impression_list_name;}
          if (u.data.impression_list_id){g.list_id = u.data.impression_list_id;}
          if (u.data.impression_list_position[i]){g.list_position = u.data.impression_list_position[i];}
          for (key in u.data.cdm_product_scope) {
            if (Array.isArray(u.data.cdm_product_scope[key])) {
              g[key] = u.data.cdm_product_scope[key][i];
            } else {
              g[key] = u.data.cdm_product_scope[key];
            }
          }
          items.push(g);
        }
      } else {
        len = len || u.data.product_id.length || u.data.product_name.length;

        for (i = 0; i < len; i++) {
          g = {};
          if (u.data.autofill_params === "true") { //UI config & mapping to set default vals - default to true
            for (j = 0; j < u.data.product_id.length; j++) {
              u.data.product_name[j] = u.data.product_name[j] || u.data.product_id[j];
              u.data.product_unit_price[j] = u.data.product_unit_price[j] || "1.00";
              u.data.product_quantity[j] = u.data.product_quantity[j] || "1";
            }
          }
          g.id = u.data.product_id[i];
          if (u.data.product_name[i]){g.name = u.data.product_name[i];}
          if (u.data.product_brand[i]){g.brand = u.data.product_brand[i];}
          if (u.data.product_category[i]){g.category = u.data.product_category[i];}
          if (u.data.product_category2[i]){g.category2 = u.data.product_category2[i];}
          if (u.data.product_category3[i]){g.category3 = u.data.product_category3[i];}
          if (u.data.product_category4[i]){g.category4 = u.data.product_category4[i];}
          if (u.data.product_category5[i]){g.category5 = u.data.product_category5[i];}
          if (u.data.product_promo_code[i]){g.coupon = u.data.product_promo_code[i];}
          if (u.data.product_unit_price[i]){g.price = u.data.product_unit_price[i];}
          if (u.data.product_quantity[i]){g.quantity = u.data.product_quantity[i];}
          if (u.data.product_variant[i]){g.variant = u.data.product_variant[i];}
          if (u.data.product_list_position[i]){g.list_position = u.data.product_list_position[i];}
          if (u.data.product_list_name){g.list_name = u.data.product_list_name;}
          if (u.data.product_list_id){g.list_id = u.data.product_list_id;}
          // App+Web params
          if (u.data.product_location_id[i]){g.location_id = u.data.product_location_id[i];}
          if (u.data.start_date[i]){g.start_date = u.data.start_date[i];}
          if (u.data.end_date[i]){g.end_date = u.data.end_date[i];}
          if (u.data.origin[i]){g.origin = u.data.origin[i];}
          if (u.data.destination[i]){g.destination = u.data.destination[i];}
          if (u.data.flight_number[i]){ g.flight_number = u.data.flight_number[i];}
          if (u.data.travel_class[i]){g.travel_class = u.data.travel_class[i];}
          if (u.data.fare_product[i]){g.fare_product = u.data.fare_product[i];}
          if (u.data.booking_code[i]){g.booking_code = u.data.booking_code[i];}

          for (key in u.data.cdm_product_scope) {
            if (Array.isArray(u.data.cdm_product_scope[key])) {
              g[key] = u.data.cdm_product_scope[key][i];
            } else {
              g[key] = u.data.cdm_product_scope[key];
            }
          }
          items.push(g);
        }
      }
      return items;
    };

    // Returns an array of Promotion objects for use in impressions and clicks
    u.promotion = function (len) {
      var f, g, promo = [];
      len = len || u.data.promo_id.length;
      for (f = 0; f < len; f++) {
        g = {};
        g.id = u.data.promo_id[f];
        g.name = (u.data.promo_name[f] ? u.data.promo_name[f] : u.data.promo_id[f]);
        if (u.data.promo_creative_name[f]){g.creative_name = u.data.promo_creative_name[f];}
        if (u.data.promo_creative_slot[f]){g.creative_slot = u.data.promo_creative_slot[f];}
        if (u.data.promo_location_id[f]){g.location_id = u.data.promo_location_id[f];}
        promo.push(g);
      }
      return promo;
    };

    u.event_map = {
      "add_to_cart": [{ "name":"value" }, { "name":"currency" }, { "name":"items" } ],
      "add_to_wishlist": [{ "name":"value" }, { "name":"currency" }, { "name":"items" } ],
      "begin_checkout": [{ "name":"value" }, { "name":"currency" }, { "name":"items" }, { "name":"coupon" } ],
      "checkout_progress": [{ "name":"value" }, { "name":"currency" }, { "name":"items" }, { "name":"coupon" }, { "name":"checkout_step" } ],
      "exception": [{ "name":"description" }, { "name":"fatal" } ],
      "generate_lead": [{ "name":"value" }, { "name":"currency" }, { "name":"transaction_id" } ],
      "login": [{ "name":"method" } ],
      "purchase": [{ "name":"transaction_id", "required": true }, { "name":"value" }, { "name":"currency" }, { "name":"tax" }, { "name":"shipping" }, { "name":"affiliation" }, { "name":"coupon" }, { "name":"items" }, { "name":"trip_type" }, { "name":"passengers"} ],
      "refund": [{ "name":"transaction_id", "required": true }, { "name":"value" }, { "name":"currency" }, { "name":"tax" }, { "name":"shipping" }, { "name":"affiliation" }, { "name":"coupon" }, { "name":"items" } ],
      "remove_from_cart": [{ "name":"value" }, { "name":"currency" }, { "name":"items" } ],
      "screen_view": [{ "name":"screen_name" } ],
      "search": [{ "name":"search_term" }, {"name":"origin"}, {"name":"destination"}, {"name":"start_date"}, {"name":"end_date"} ],
      "select_content": [{ "name":"content_type" }, { "name":"items" }, { "name":"promotions" } ],
      "set_checkout_option": [{ "name":"checkout_step" }, { "name":"checkout_option" } ],
      "share": [{ "name":"method" }, { "name":"content_type" }, { "name":"content_id" } ],
      "sign_up": [{ "name":"method" } ],
      "timing_complete": [{ "name":"name", "required": true }, { "name":"value", "required": true }, { "name":"event_category" }, { "name":"event_label" } ],
      "view_item": [{ "name":"items" }],
      "view_item_list": [{ "name":"items" } ],
      "view_promotion": [{ "name":"promotions" } ],
      "view_search_results": [{ "name":"search_term" } ],
      "add_payment_info": [{ "name":"items"}, { "name":"value"}, { "name":"payment_type"}, { "name":"currency"}],
      "add_shipping_info": [{ "name":"items"}, { "name":"value"}, { "name":"shipping_tier"}, { "name":"currency"}],
      "present_offer": [{"name":"item_id"},{"name":"item_name"},{"name":"item_category"}],
      // Games
      "earn_virtual_currency": [{"name":"virtual_currency_name"}, {"name":"value"}],
      "join_group": [{"name":"group_id"}],
      "level_end": [{"name":"level_name"}, {"name":"success"}],
      "level_start": [{"name":"level_name"}],
      "level_up": [{"name":"character"}, {"name":"level"}],
      "post_score": [{"name":"level"}, {"name":"character"}, {"name":"score"}],
      "spend_virtual_currency": [{"name":"item_name"}, {"name":"virtual_currency_name"}, {"name":"value"}],
      "tutorial_begin": [],
      "tutorial_complete": [],
      "unlock_achievement": [{"name":"achievement_id"}]
    };

    u.std_params = {
      "transaction_id" : function() {
        return u.data.order_id;
      },
      "affiliation" : function() {
        return u.data.order_store;
      },
      "value" : function(event) {
        if (event.match(/timing_complete|virtual_currency/i)) {
          return u.data.event.value;
        }
        return u.data.order_total;
      },
      "currency" : function() {
        return u.data.order_currency;
      },
      "tax" : function() {
        return u.data.order_tax;
      },
      "shipping" : function() {
        return u.data.order_shipping;
      },
      "coupon": function () {
        return u.data.order_coupon_code;
      },
      "description": function () {
        return u.data.event.description;
      },
      "fatal": function () {
        return u.toBoolean(u.data.event.fatal);
      },
      "screen_name": function () {
        return u.data.event.screen_name;
      },
      "method": function () {
        return u.data.event.method;
      },
      "search_term": function () {
        return u.data.event.search_term;
      },
      "content_type": function () {
        return u.data.event.content_type;
      },
      "content_id": function () {
        return u.data.event.content_id;
      },
      "promotions": function (event) {
        if (event === "select_content" && u.data.event.content_type !== "product") {
          return u.promotion(1);
        } else if (event !== "select_content" ) {
          return u.promotion();
        }
      },
      "name": function () {
        return u.data.event.name;
      },
      "event_category": function () {
        return u.data.event.event_category;
      },
      "event_label": function () {
        return u.data.event.event_label;
      },
      "items" : function (event) {
        // view_item, add_to_cart, remove_from_cart Send a single product
        if ( event === "view_item" || event === "add_to_cart" || event === "remove_from_cart" ) {
          return u.item(false, 1);
        }
        if (event === "view_item_list") {
          return u.item(true);
        }
        // Product Click
        if (event === "select_content" && u.data.event.content_type) {
          return u.item(false, 1);
        }
        return u.item();
      },
      "item_category": function () {
          return u.data.product_category[0] ? u.data.product_category[0] : "";
      },
      "item_name": function () {
        return u.data.product_name[0] ? u.data.product_name[0] : "";
      },
      "item_id": function () {
        return u.data.product_id[0] ? u.data.product_id[0] : "";
      },
      "quantity": function () {
        return u.data.product_quantity[0] ? u.data.product_quantity[0] : "";
      },
      "price": function () {
        return u.data.product_unit_price[0] ? u.data.product_unit_price[0] : "";
      }
    };

##UTGEN##

    u.send = function (a, b) {
      if (u.ev[a] || u.ev.all !== undefined) {
        utag.DB("send:##UTID##");
        utag.DB(b);

        var c, d, e, f, h, i, cdm, cdm_event_flag, event_param, event_param_value, prop;

        u.data = {
          "qsp_delim" : "&",
          "kvp_delim" : "=",
          "base_url": "https://www.googletagmanager.com/gtag/js?id=##utag_tracking_id##",
          "tracking_id": "##UTVARconfig_tracking_id##",
          "cross_track": "##UTVARconfig_cross_track##",
          "cross_track_domains": "##UTVARconfig_cross_track_domains##",
          "transport_type": "##UTVARconfig_transport_type##" || "default",
          "allow_display_features": "##UTVARconfig_allow_display_features##",
          "screen_view": "##UTVARconfig_screen_view##",
          "anonymize_ip": "##UTVARconfig_anonymize_ip##",
          "clear_global_vars": "##UTVARconfig_clear_global_vars##",
          "optimize_id": "##UTVARconfig_optimize_id##",
          "use_amp_client_id": "##UTVARconfig_use_amp_client_id##",
          "allow_anchor": "##UTVARconfig_allow_anchor##",
          "data_layer_name": "##UTVARconfig_data_layer_name##",
          // Enhanced E-Commerce
          "checkout_step": "",
          "checkout_option": "",
          "product_action_list": "",
          "product_list_position":"",
          "product_variant": [],
          "impression_id": [],
          "impression_name": [],
          "impression_price": [],
          "impression_category": [],
          "impression_brand": [],
          "impression_variant": [],
          "impression_list_name": [],
          "impression_list_position": [],
          "promo_id": [],
          "promo_name": [],
          "promo_creative_name": [],
          "promo_creative_slot": [],
          "promo_location_id": [],
          // E-Commerce Vars
          "product_id" : [],
          "product_name" : [],
          "product_sku" : [],
          "product_brand" : [],
          "product_category" : [],
          "product_category2" : [],
          "product_category3" : [],
          "product_category4" : [],
          "product_category5" : [],
          "product_subcategory" : [],
          "product_quantity" : [],
          "product_unit_price" : [],
          "product_discount" : [],
          "product_promo_code": [],
          "product_location_id": [],
          "cdm_product_scope": {},
          "start_date": [],
          "end_date": [],
          "origin": [],
          "destination": [],
          "flight_number": [],
          "travel_class": [],
          "fare_product": [],
          "booking_code": [],
          "page_view_event_data": {},
          "set" : {"developer_id.dYmQxMT": true},
          "config" : {
            "custom_map":{}
          },
          "event" : {},
          "items" : []
        };

        // Start tag-scoped extensions
        /* eslint-disable-next-line */
        ##UTEXTEND##
        utag.DB("send:##UTID##:EXTENSIONS");
        utag.DB(b);
        // End tag-scoped extensions

        // Start Mapping
        for (d in utag.loader.GV(u.map)) {
          if (b[d] !== undefined && b[d] !== "") {
            e = u.map[d].split(",");
            for (f = 0; f < e.length; f++) {
              u.map_func(e[f].split("."), u.data, b[d]);
            }
          } else {
            h = d.split(":");
            if (h.length === 2 && b[h[0]] === h[1]) {
              if (u.map[d]) {
                u.data.event_name = u.map[d];
              }
            }
          }
        }
        utag.DB("send:##UTID##:MAPPINGS");
        utag.DB(u.data);
        // End Mapping

        // Pull E-Commerce extension values
        // Mappings override E-Commerce extension values
        u.data.order_id = u.data.order_id || b._corder || "";
        u.data.order_total = u.data.order_total || b._ctotal || "";
        u.data.order_subtotal = u.data.order_subtotal || b._csubtotal || "";
        u.data.order_shipping = u.data.order_shipping || b._cship || "";
        u.data.order_tax = u.data.order_tax || b._ctax || "";
        u.data.order_store = u.data.order_store || b._cstore || "";
        u.data.order_currency = u.data.order_currency || b._ccurrency || "";
        u.data.order_coupon_code = u.data.order_coupon_code || b._cpromo || "";
        u.data.customer_id = u.data.customer_id || b._ccustid || "";
        if (u.data.product_id.length === 0 && b._cprod !== undefined) { u.data.product_id = b._cprod.slice(0); }
        if (u.data.product_name.length === 0 && b._cprodname !== undefined) { u.data.product_name = b._cprodname.slice(0); }
        if (u.data.product_sku.length === 0 && b._csku !== undefined) { u.data.product_sku = b._csku.slice(0); }
        if (u.data.product_brand.length === 0 && b._cbrand !== undefined) { u.data.product_brand = b._cbrand.slice(0); }
        if (u.data.product_category.length === 0 && b._ccat !== undefined) { u.data.product_category = b._ccat.slice(0); }
        if (u.data.product_subcategory.length === 0 && b._ccat2 !== undefined) { u.data.product_subcategory = b._ccat2.slice(0); }
        if (u.data.product_quantity.length === 0 && b._cquan !== undefined) { u.data.product_quantity = b._cquan.slice(0); }
        if (u.data.product_unit_price.length === 0 && b._cprice !== undefined) { u.data.product_unit_price = b._cprice.slice(0); }
        if (u.typeOf(u.data.tracking_id) === "string" && u.data.tracking_id !== "") { u.data.tracking_id = u.data.tracking_id.replace(/\s/g, "").split(","); }

        // Report required config is missing, and stop tag from firing.
        if (!u.data.tracking_id) {
          utag.DB(u.id + ": Tag not fired: Required attribute not populated");
          return;
        }

        if (u.data.gtag_enable_tcf_support) {
          window["gtag_enable_tcf_support"] = u.toBoolean(u.data.gtag_enable_tcf_support);
        }

        // Prepend "UA-" Tracking ID prefix if not present
        for (i = 0; i < u.data.tracking_id.length; i++) {
          if (!/^[a-zA-Z]{1}-|^[a-zA-Z]{2}-/.test(u.data.tracking_id[i]) ) {
            u.data.tracking_id[i] = "UA-" + u.data.tracking_id[i];
          }
        }

        u.data.base_url = u.data.base_url.replace("##utag_tracking_id##", u.data.tracking_id[0]);

        // Support dataLayer renaming
        if (u.data.data_layer_name) {
          u.data.base_url = u.data.base_url + "&l=" + u.data.data_layer_name;
        }

        u.data.event.send_to = u.data.event.send_to || u.data.tracking_id;

        if (u.data.customer_id) {
          u.data.config.user_id = u.data.customer_id;
        }

        // clear globally set vars
        if ( u.toBoolean(u.data.clear_global_vars)) {
          u.setGlobalProperties(u.data.config, true);
          // clear custom vars set via "set.xxx"
          for ( prop in utag.loader.GV(u.data.set) ) {
            u.setGlobalProperties(u.data.set, true, prop);
          }
        }
        // now set the global properties with what's been passed into this utag.view/link hit
        u.setGlobalProperties(u.data.config, false);
        u.setGlobalProperties(u.data.set, false);

        if ( !u.data.event_name && u.data.order_id ) {
          u.data.event_name = "purchase";
        }

        // CUSTOM DIMENSIONS/METRICS/CONTENT GROUPS
        // -------------------------
        cdm = [];

        for (d in u.data.cdm) {
          cdm_event_flag = false;
          cdm = d.split("-");
          var cdm_name, cdm_event;
          // Custom Groups - 0 = Dimension/Metric/Group, 1 = name
          cdm[0] = cdm[0].replace("contentGroup", "content_group");
          if (cdm[0].indexOf("content_group") >= 0) {
            cdm_name = cdm[0];
            cdm_event = cdm[2] || cdm[1] || "all";
          } else {
            // Define custom dimension/metric - 0 = Dimension/Metric/Group, 1 = name, 2 = event
            // Default to dimension<num> or metric<num> if name not provided
            cdm_name = cdm[1] || cdm[0];
            cdm_event = cdm[2];
            u.data.config.custom_map[cdm[0]] = cdm_name;
          }

          if (cdm_event === "all") {
            u.data.config[cdm_name] = u.data.cdm[d];
          } else if (cdm_event === "link" && a === "link") {
            cdm_event_flag = true;
          } else if (cdm_event === "ecom" && u.data.event_name && u.data.event_name.match(/add_payment_info|add_to_cart|add_to_wishlist|begin_checkout|checkout_progress|purchase|refund|remove_from_cart|product_click|promotion_click|set_checkout_option|view_item|view_item_list|view_promotion/)) {
            cdm_event_flag = true;
          } else if (cdm_event === "prod") {
            u.data.cdm_product_scope[cdm_name] = u.data.cdm[d];
          } else if (cdm_event === "page_view") {
            u.data.page_view_event_data[cdm_name] = u.data.cdm[d];
          } else if (u.data.event_name === cdm_event) {
            cdm_event_flag = true;
          }
          if (cdm_event_flag) {
            u.data.event[cdm_name] = u.data.cdm[d];
          }
        }

        // CONFIG
        // -------------------------

        // Anonymize IP | https://developers.google.com/analytics/devguides/collection/gtagjs/ip-anonymization
        if ( u.toBoolean(u.data.anonymize_ip) && u.data.config.anonymize_ip === undefined ) {
          u.data.config.anonymize_ip = true;
        }

        // Cross Domain Tracking | https://developers.google.com/analytics/devguides/collection/gtagjs/cross-domain
        if ( u.toBoolean(u.data.cross_track) && u.data.config.linker === undefined ) {
          u.data.config.linker = {
            "accept_incoming": u.toBoolean(u.data.cross_track),
            "domains": u.data.cross_track_domains,
            "use_anchor": u.toBoolean(u.data.allow_anchor)
          };
        }

        // Advertising Features | https://developers.google.com/analytics/devguides/collection/gtagjs/display-features#disable_all_advertising_features
        u.data.config.allow_google_signals = u.data.config.allow_google_signals !== undefined ? u.toBoolean(u.data.config.allow_google_signals) : u.toBoolean(u.data.allow_display_features);

        // Advertising Personalization | https://developers.google.com/analytics/devguides/collection/gtagjs/display-features#disable_advertising_personalization
        if (u.data.config.allow_ad_personalization_signals !== undefined) {
          u.data.config.allowAdPersonalizationSignals = u.toBoolean(u.data.config.allow_ad_personalization_signals);
        }

        // Link Attribution | https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-link-attribution
        if ( u.toBoolean(u.data.enhanced_link_attribution) && !u.data.config.link_attribution ) {
          u.data.config.link_attribution = true;
        }

        // Optimize | https://support.google.com/360suite/optimize/answer/7513085
        if (u.data.optimize_id && u.data.config.optimize_id === undefined) {
          u.data.config.optimize_id = u.data.optimize_id;
        }

        // AMP Client ID https://support.google.com/analytics/answer/7486764
        if (u.data.use_amp_client_id && u.data.config.use_amp_client_id === undefined) {
          u.data.config.use_amp_client_id = u.data.use_amp_client_id;
        }

        // Transport Type | https://developers.google.com/analytics/devguides/collection/gtagjs/sending-data#specify_different_transport_mechanisms
        if (u.data.transport_type !== "default") {
          u.data.config.transport_type = u.data.transport_type;
        }

        // Disable default pageview on config call
        u.data.config.send_page_view = false;
        if (a === "view") {
          for (i = 0; i < u.data.tracking_id.length; i++) {
            u.o("config", u.data.tracking_id[i], u.data.config);
          }
          if (u.toBoolean(u.data.screen_view)) {
            u.o("event", "screen_view", u.data.event);
          } else {
            u.o("event", "page_view", u.data.page_view_event_data);
          }
        }

        // EVENT
        // -------------------------

        if (u.data.event_name) {
          // Click events are sent under the "select_content" event
          if ( u.data.event_name === "product_click" && a === "link" ) {
            u.data.event.content_type = "product";
            u.data.event_name = "select_content";
          } else if ( u.data.event_name === "promotion_click" && a === "link" ) {
            u.data.event_name = "select_content";
          }
          if (u.data.event.non_interaction) {u.data.event.non_interaction = true;}

          if (u.event_map[u.data.event_name]) {
            for (i = 0; i < u.event_map[u.data.event_name].length; i++) {
              event_param = u.event_map[u.data.event_name][i];
              // Use u.std_params for computed params, otherwise pull from u.data.
              event_param_value = u.std_params[event_param.name] ? u.std_params[event_param.name](u.data.event_name) : u.data[event_param.name] || "";
              if (event_param_value !== "") {u.data.event[event_param.name] = event_param_value;}
              if (u.data.event[event_param.name] === undefined && event_param.required) {
                utag.DB(u.id + ": Event: " + u.data.event_name + ": Required attribute not populated");
              }
            }
          }

          // Prevent  click events on view
          if (u.data.event_name !== "product_click" && u.data.event_name !== "promotion_click") {
            // Update config on link events
            if (a === "link" && u.shouldUpdateConfigOnLink()) {
              for (i = 0; i < u.data.tracking_id.length; i++) {
                u.o("config", u.data.tracking_id[i], u.data.config);
              }
            }
            u.o("event", u.data.event_name, u.data.event);
          }
        }

        if (!u.hasgtagjsGA4()) {
          u.scriptrequested = true;
          utag.ut.gtagScriptRequestedGA4 = true;
          u.loader({
            "type" : "script",
            "src" : u.data.base_url,
            "cb" : null,
            "loc" : "script",
            "id" : "utag_##UTID##",
            "attrs" : {}
          });
        }

        utag.DB("send:##UTID##:COMPLETE");
      }
    };
    utag.o[loader].loader.LOAD(id);
  }("##UTID##", "##UTLOADERID##"));
} catch (error) {
  utag.DB(error);
}
//end tealium universal tag
