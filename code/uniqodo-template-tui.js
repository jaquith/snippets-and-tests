//~~tv:21012.20161025
//~~tc: Adding tag Uniqodo

var UNIQODO = UNIQODO || {};

//tealium universal tag - utag.sender.template ut4.0.##UTVERSION##, Copyright ##UTYEAR## Tealium.com Inc. All Rights Reserved.
try {
  (function (id, loader) {
    var u = {"id" : id};
    utag.o[loader].sender[id] = u;
    // Please do not modify
    if (utag.ut === undefined) { utag.ut = {}; }
    // Start Tealium loader 4.41
    /* utag.js version 4.26 or above is required to avoid errors with this loader function */
    var match = /ut\d\.(\d*)\..*/.exec(utag.cfg.v);
    if (utag.ut.loader === undefined || !match || parseInt(match[1]) < 41) { u.loader = function(o, a, b, c, l, m) { utag.DB(o); a = document; if (o.type == "iframe") { m = a.getElementById(o.id); if (m && m.tagName == "IFRAME") { b = m; } else { b = a.createElement("iframe"); } o.attrs = o.attrs || {}; utag.ut.merge(o.attrs, { "height": "1", "width": "1", "style": "display:none" }, 0); } else if (o.type == "img") { utag.DB("Attach img: " + o.src); b = new Image(); } else { b = a.createElement("script"); b.language = "javascript"; b.type = "text/javascript"; b.async = 1; b.charset = "utf-8"; } if (o.id) { b.id = o.id; } for (l in utag.loader.GV(o.attrs)) { b.setAttribute(l, o.attrs[l]); } b.setAttribute("src", o.src); if (typeof o.cb == "function") { if (b.addEventListener) { b.addEventListener("load", function() { o.cb(); }, false); } else { b.onreadystatechange = function() { if (this.readyState == "complete" || this.readyState == "loaded") { this.onreadystatechange = null; o.cb(); } }; } } if (o.type != "img" && !m) { l = o.loc || "head"; c = a.getElementsByTagName(l)[0]; if (c) { utag.DB("Attach to " + l + ": " + o.src); if (l == "script") { c.parentNode.insertBefore(b, c); } else { c.appendChild(b); } } } }; } else { u.loader = utag.ut.loader; }
    // End Tealium loader
    // Start Tealium typeOf 4.35
    if (utag.ut.typeOf === undefined) { u.typeOf = function(e) {return ({}).toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();};} else { u.typeOf = utag.ut.typeOf; }
    // End Tealium typeOf

    u.ev = {"view" : 1, "link" : 1};

    ##UTGEN##

    u.send = function (a, b) {
      if (u.ev[a] || u.ev.all !== undefined) {
        utag.DB("send:##UTID##");
        utag.DB(b);

        var c, d, e, f;

        u.data = {
          //##UTVARconfig_<id from config>##
          "qsp_delim" : "&",
          "kvp_delim" : "=",
          "base_url" : "//track.uniqodo.com/",
          "trigger_code" : "",
          "account_id" : "##UTVARconfig_account_id##",
          // E-Commerce Vars
          "order_id" : "",
          "order_total" : "",
          "order_currency" : "",
          "customer_id" : "",
          // Additional custom param object
          "p" : {}
        };

        // Start tag-scoped extensions
        ##UTEXTEND##
        utag.DB("send:##UTID##:EXTENSIONS");
        utag.DB(b);
        // End tag-scoped extensions

        c = [];

        //  Modifications to add empty "p" values
        u.generateEmptyPValues = function() {
                  var pValues = [],
                      c = 0,
                      maxValue = 20;
                  for (pValues[i++] in u.data.p) {};
                  for (var i in pValues) {
                      var n = parseInt(pValues[i].substring(1));
                      if (n > maxValue)
                          maxValue = n;
                  }
                  for (var i = 1; i < maxValue; i++) {
                      if (!u.data.p["p" + i])
                          u.data.p["p" + i] = '';
                  }
              }


        // Start Mapping
        for (d in utag.loader.GV(u.map)) {
          if (b[d] !== undefined /* && b[d] !== ""*/ ) {
            e = u.map[d].split(",");
            for (f = 0; f < e.length; f++) {
              if (e[f].indexOf("p.") === 0) {
                //Warning for int
                if (!parseInt(e[f].substr(2))){
                  utag.DB("WARNING: Your custom data does not match Uniqodo's 'pN' format, where N is a number.");
                }
                u.data.p["p" + e[f].substr(2)] = b[d];
              } else {
                u.data[e[f]] = b[d];
              }
            }
          }
        }
        utag.DB("send:##UTID##:MAPPINGS");
        utag.DB(u.data);
        u.generateEmptyPValues(); // Modification to generate empty P values
        // End Mapping

        // Pull E-Commerce extension values
        // Mappings override E-Commerce extension values
        u.data.order_id = u.data.order_id || b._corder || "";
        u.data.order_total = u.data.order_total || b._ctotal || "";
        u.data.order_currency = u.data.order_currency || b._ccurrency || "";
        u.data.customer_id = u.data.customer_id || b._ccustid || "";
        // Report required config is missing, and stop tag from firing.

        if (!u.data.account_id){
          utag.DB(u.id + ": Tag not fired: Required attribute not populated");
          return;
        }

        u.data.base_url += u.data.account_id + ".js";

        if (u.data.order_id) {
          if (!u.data.order_total || !u.data.order_currency) {
            utag.DB(u.id + ": Tag not fired: Required attribute not populated for transaction confirmation.");
            return;
          }
          UNIQODO.orderConfirmation = true;
          UNIQODO.orderValue = u.data.order_total;
          UNIQODO.orderId = u.data.order_id;
          UNIQODO.currency = u.data.order_currency;
          
          if (u.data.trigger_code){
            UNIQODO.triggerCode = u.data.trigger_code;
          }
          if (u.data.customer_id){
            UNIQODO.user = u.data.customer_id;
          }

          //Copy custom p params to UNIQODO obj
          for (var key in u.data.p){
            UNIQODO[key] = u.data.p[key];
          }
        }

        u.loader({
          "type" : "script",
          "src" : u.data.base_url,
          "cb" : null,
          "loc" : "script",
          "id" : "utag_##UTID##",
          "attrs" : {}
        });
          
        utag.DB("send:##UTID##:COMPLETE");
      }
    };
    utag.o[loader].loader.LOAD(id);
  }("##UTID##", "##UTLOADERID##"));
} catch (error) {
  utag.DB(error);
}
//end tealium universal tag
