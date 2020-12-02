// enables console testing (but still works in Tealium iQ)
var b = b || (utag && utag.data) || {}

var legacyPrefix = 'legacy_'

// spoof some Ensighten functionality
var Bootstrapper = {}
Bootstrapper.ensightenOptions = {}
Bootstrapper.ensightenOptions.publishPath = b.tealium_environment === 'prod' ? 'hybrisprod' : 'hybrisdev';

Bootstrapper.getQueryParam = function (qp_name) {
  var b = b || {}
  return b['qp.' + qp_name] || ""
}

/*
// there were only three instances of this being called and the timing was tricky, so I modified the below code a touch
Bootstrapper.data = {}
Bootstrapper.data.resolve = function (name) {
  name = getCleanLegacyNameForLookup(name)
  console.log('RESOLVING ' + name + ' to ' + b[name] )
  return b[name]
}
*/

function getCleanLegacyNameForLookup (longEnsightenName) {
  var arr = longEnsightenName.split('.')
  var lastString = arr[arr.length - 1]
  var cleanWithLegacyPrefix = legacyPrefix + getSanitizedVariableName(lastString)
  return cleanWithLegacyPrefix
}

Bootstrapper.Cookies = {}
Bootstrapper.Cookies.get = function (cookieName) {
  var b = b || {}
  return b['cp.' + cookieName]
}

// make sure this object is defined to avoid errors
window.tui = window.tui || {}
window.tui.page = window.tui.page || {}
window.tui.page.analytics = window.tui.page.analytics || {}

// add the legacy ensighten variables
b = addEnsightenVariables(b)

function getSanitizedVariableName (oldName) {
  // sanitation regex, only allow letters, numbers, underscores, dollar signs,
  // array brackets, periods (same as TiQ Data Layer interface), remove others
  var blacklist = /[^0-9A-Z_$\[\]\.]/gi;
  var spacesAndHyphens = /[\s-]+/g;
  // replace groups of spaces and hyphens with underscores
  newName = oldName.replace(spacesAndHyphens, '_');
  // sanitize name
  newName = newName.replace(blacklist, '');
  return newName
}

function sanitizeAllVariableNames (b) {
  // Sanitize attribute names to remove any characters that 
  // Tealium doesn't allow (full list in comments):
  //    - first replace any groups of spaces/hyphens with a single underscore
  //    - then remove disallowed characters (no replacement character)


  // fallback in case scope is changed and to allow console-based testing
  b = b || {}

  // get the list of attributes
  var attributes = Object.keys(b);

  // initialize loop vars
  var i, len, oldName, newName;

  // get the value for each of the keys and add it to b if non-empty
  for (i = 0, len = attributes.length; i < len; i++) {
    oldName = attributes[i];
    newName = getSanitizedVariableName(oldName)
    if (oldName !== newName) {
      // copy value
      b[newName] = b[oldName];
      // remove old key
      delete b[oldName];
    }
  }
  return b
}

function logError (e) {
  console.log("UDO population function error: " + e)
}

function addEnsightenVariables (b) {
  b = b || {}
  b = addUnconditionalEnsightenVariables(b)
  b = addConditionalEnsightenVariables(b)
  b = sanitizeAllVariableNames(b)
  return b
}

function addConditionalEnsightenVariables (originalB) {
  // a little confusing, but this is the 'new' b and the standard one is called originalB in this function
  var b = {}
  // a map of relevant Ensightten condition IDs to Load Rule UIDs
  var conditionMap = {
    "205270": "893",
    "205366": "892",
    "205384": "891",
    "205444": "890",
    "231659": "889",
    "275650": "888",
    "292050": "887",
    "306764": "886",
    "317190": "885",
    "318035": "884",
    "319261": "883",
    "321929": "882",
    "321966": "881",
    "322010": "880",
    "323412": "879",
    "326082": "878",
    "330432": "877",
    "334450": "876",
    "338073": "875",
    "338075": "874",
    "342693": "873",
    "356822": "872",
    "381988": "871",
    "381989": "870",
    "381990": "869",
    "381991": "868",
    "386001": "867",
    "386052": "866",
    "386059": "865",
    "386105": "864",
    "386268": "863",
    "386269": "862",
    "386721": "861",
    "392738": "860",
    "392739": "859",
    "392856": "858",
    "393317": "857",
    "398051": "856",
    "413257": "855",
    "413766": "854",
    "415650": "853",
    "416216": "852",
    "420785": "851",
    "420787": "850",
    "421343": "849",
    "423206": "848",
    "441328": "847",
    "455789": "846",
    "461304": "845",
    "461309": "844",
    "463175": "843",
    "470245": "842",
    "470253": "841",
    "470312": "840",
    "470318": "839",
    "473997": "838",
    "476525": "837",
    "476526": "836",
    "476527": "835",
    "476528": "834",
    "480498": "833",
    "480964": "832",
    "481202": "831",
    "483445": "830",
    "491253": "829",
    "493179": "828",
    "493721": "827",
    "496357": "826",
    "501484": "825",
    "501601": "824",
    "510366": "823",
    "513827": "822",
    "635858": "821",
    "635859": "820",
    "635860": "819",
    "635861": "818",
    "635862": "817",
    "635863": "816",
    "636023": "815",
    "636029": "814",
    "636046": "813",
    "648421": "812",
    "649595": "811",
    "649596": "810",
    "649969": "809",
    "650179": "808",
    "650416": "807",
    "650480": "806",
    "650484": "805",
    "650680": "804",
    "650692": "803",
    "650702": "802",
    "650703": "801",
    "650766": "800",
    "650778": "799",
    "650782": "798",
    "650787": "797",
    "650789": "796",
    "650792": "795",
    "651200": "794",
    "653983": "793",
    "664297": "792",
    "664415": "791",
    "664554": "790",
    "664567": "789",
    "664568": "788",
    "664569": "787",
    "664582": "786",
    "664583": "785",
    "664585": "784",
    "664594": "783",
    "664595": "782",
    "664597": "781",
    "664598": "780",
    "664604": "779",
    "664609": "778",
    "664610": "777",
    "664611": "776",
    "664619": "775",
    "664620": "774",
    "664621": "773",
    "664623": "772",
    "664624": "771",
    "664631": "770",
    "671183": "769",
    "671185": "768",
    "671190": "767",
    "671227": "766",
    "671238": "765",
    "671240": "764",
    "671252": "763",
    "671355": "762",
    "682688": "761",
    "686121": "760",
    "686122": "759",
    "686123": "758",
    "686171": "757",
    "686172": "756",
    "686176": "755",
    "686177": "754",
    "686178": "753",
    "686222": "752",
    "686224": "751",
    "686225": "750",
    "686278": "749",
    "696836": "748",
    "696873": "747",
    "696915": "746",
    "698739": "745",
    "698824": "744",
    "701720": "743",
    "701770": "742",
    "701995": "741",
    "702164": "740",
    "717653": "739",
    "717654": "738",
    "717953": "737",
    "717954": "736",
    "718305": "735",
    "718376": "734",
    "758676": "733",
    "763283": "732",
    "767006": "731",
    "794187": "730",
    "821088": "729",
    "835611": "728",
    "836311": "727",
    "840126": "726",
    "840127": "725",
    "840747": "724",
    "840748": "723",
    "840749": "722",
    "853791": "721",
    "853792": "720",
    "882958": "719",
    "887343": "718",
    "899054": "717",
    "899844": "716",
    "901069": "715",
    "901080": "714",
    "901330": "713",
    "901338": "712",
    "901352": "711",
    "962796": "710",
    "1042978": "709",
    "1043130": "708",
    "1081657": "707",
    "1081697": "706",
    "1187972": "705",
    "1187977": "704",
    "1187985": "703",
    "1187989": "702",
    "1187995": "701",
    "1188366": "700",
    "1207206": "699",
    "1207254": "698",
    "1210674": "697",
    "1211596": "696",
    "1211720": "695",
    "1211741": "694",
    "1211742": "693",
    "1211743": "692",
    "1216621": "691",
    "1217836": "690",
    "1217852": "689",
    "1218080": "688",
    "1218101": "687",
    "1219690": "686",
    "1249258": "685",
    "1417083": "684",
    "1417130": "683",
    "1495684": "682",
    "1512996": "681",
    "1512997": "680",
    "1513092": "679",
    "1513465": "678",
    "1513466": "677",
    "1514697": "676",
    "1514864": "675",
    "1514958": "674",
    "1515424": "673",
    "1531045": "672",
    "1531096": "671",
    "1531141": "670",
    "1531422": "669",
    "1532177": "668",
    "1668141": "667",
    "1769738": "666",
    "1778256": "665",
    "2081444": "664",
    "2081446": "663",
    "2082484": "662",
    "2279242": "661",
    "2279323": "660",
    "2503734": "659",
    "2503735": "658",
    "2503818": "657",
    "2518567": "656",
    "2518982": "655",
    "2662663": "654",
    "2662758": "653",
    "2664033": "652",
    "2664082": "651",
    "2665581": "650",
    "2665582": "649",
    "2708240": "648",
    "2712769": "647",
    "2712827": "646",
    "2733381": "645",
    "2733382": "644",
    "2910769": "643",
    "2917920": "642",
    "3565541": "641",
    "3584019": "640",
    "3600994": "639",
    "3834892": "638",
    "4143702": "637",
    "4151405": "636",
    "4151407": "635",
    "4151409": "634",
    "4190389": "633",
    "4821493": "632",
    "4821495": "631",
    "4821610": "630",
    "4821659": "629",
    "4821660": "628",
    "4821661": "627",
    "4821662": "626",
    "4823353": "625",
    "4823354": "624",
    "4823597": "623",
    "4823969": "622",
    "4823970": "621",
    "4824954": "620",
    "4824955": "619",
    "4825150": "618",
    "4825427": "617",
    "4825428": "616",
    "4825462": "615",
    "4825463": "614",
    "4825556": "613",
    "4825566": "612",
    "4825579": "611",
    "4825887": "610",
    "4828711": "609",
    "4828847": "608",
    "4829563": "607",
    "4834079": "606",
    "4834101": "605",
    "4834967": "604",
    "4834971": "603",
    "4835548": "602",
    "4835555": "601",
    "4836637": "600",
    "4836638": "599",
    "4836899": "598",
    "4836986": "597",
    "4836987": "596",
    "4836995": "595",
    "4837297": "594",
    "4837976": "593",
    "4837985": "592",
    "4837986": "591",
    "4837987": "590",
    "4837989": "589",
    "4838170": "588",
    "4838540": "587",
    "4838547": "586",
    "4838593": "585",
    "4840815": "584",
    "4841313": "583",
    "4841758": "582",
    "4842201": "581",
    "4843069": "580",
    "4843070": "579",
    "4843071": "578",
    "4844445": "577",
    "4844447": "576",
    "4844577": "575",
    "4844916": "574",
    "4845253": "573",
    "4845255": "572",
    "4845258": "571",
    "4845356": "570",
    "4845366": "569",
    "4845617": "568",
    "4847129": "567",
    "4847477": "566",
    "4847478": "565",
    "4848441": "564",
    "4848815": "563",
    "4851962": "562",
    "4851964": "561",
    "4852083": "560",
    "4852084": "559",
    "4852282": "558",
    "4852283": "557",
    "4852362": "556",
    "4852363": "555",
    "4852658": "554",
    "4852659": "553",
    "4852660": "552",
    "4853590": "551",
    "4854987": "550",
    "4857995": "549",
    "4858047": "548",
    "4858048": "547",
    "4858051": "546",
    "4858052": "545",
    "4859198": "544",
    "4859386": "543",
    "4860037": "542",
    "4860043": "541",
    "4860384": "540",
    "4860389": "539",
    "4860392": "538",
    "4860393": "537",
    "4860396": "536",
    "4860489": "535",
    "4860666": "534",
    "4861558": "533",
    "4861560": "532",
    "4861724": "531",
    "4861979": "530",
    "4862577": "529",
    "4862583": "528",
    "4862586": "527",
    "4862928": "526",
    "4863228": "525",
    "4863575": "524",
    "4863765": "523",
    "4863775": "522",
    "4863805": "521",
    "4863806": "520",
    "4863807": "519",
    "4863888": "518",
    "4863889": "517",
    "4864153": "516",
    "4864565": "515",
    "4865543": "514",
    "4868062": "513",
    "4868261": "512",
    "4868262": "511",
    "4868283": "510",
    "4868358": "509",
    "4868359": "508",
    "4868360": "507",
    "4868361": "506",
    "4868362": "505",
    "4868392": "504",
    "4868449": "503",
    "4868450": "502",
    "4868451": "501",
    "4868452": "500",
    "4868453": "499",
    "4868454": "498",
    "4868455": "497",
    "4868457": "496",
    "4868458": "495",
    "4869584": "494",
    "4869945": "493",
    "4869951": "492",
    "4869954": "491",
    "4870035": "490",
    "4870036": "489",
    "4870216": "488",
    "4870973": "487",
    "4871232": "486",
    "4871233": "485",
    "4871234": "484",
    "4871236": "483",
    "4871237": "482",
    "4871243": "481",
    "4871370": "480",
    "4871371": "479",
    "4871372": "478",
    "4872478": "477",
    "4872479": "476",
    "4873112": "475",
    "4873113": "474",
    "4873115": "473",
    "4873116": "472",
    "4873541": "471",
    "4873810": "470",
    "4874021": "469",
    "4874022": "468",
    "4874023": "467",
    "4874054": "466",
    "4874525": "465",
    "4874978": "464",
    "4878074": "463",
    "4878311": "462",
    "4878451": "461",
    "4878452": "460",
    "4878453": "459",
    "4878454": "458",
    "4878457": "457",
    "4878459": "456",
    "4878460": "455",
    "4878461": "454",
    "4878462": "453",
    "4878475": "452",
    "4878884": "451",
    "4879254": "450",
    "4879515": "449",
    "4879516": "448",
    "4879518": "447",
    "4879521": "446",
    "4879526": "445",
    "4879546": "444",
    "4879565": "443",
    "4879595": "442",
    "4879598": "441",
    "4879602": "440",
    "4879676": "439",
    "4879678": "438",
    "4879679": "437",
    "4879685": "436",
    "4879704": "435",
    "4879714": "434",
    "4879716": "433",
    "4879808": "432",
    "4879809": "431",
    "4879813": "430",
    "4879814": "429",
    "4879815": "428",
    "4880004": "427",
    "4880008": "426",
    "4880055": "425",
    "4880056": "424",
    "4880058": "423",
    "4880059": "422",
    "4880060": "421",
    "4880061": "420",
    "4880062": "419",
    "4880063": "418",
    "4880064": "417",
    "4880065": "416",
    "4880066": "415",
    "4880598": "414",
    "4880599": "413",
    "4880600": "412",
    "4880601": "411",
    "4880840": "410",
    "4881012": "409",
    "4882458": "408",
    "4885030": "407",
    "4885031": "406",
    "4885035": "405",
    "4885036": "404",
    "4885040": "403",
    "4885041": "402",
    "4885054": "401",
    "4885055": "400",
    "4885056": "399",
    "4885057": "398",
    "4885058": "397",
    "4885059": "396",
    "4885060": "395",
    "4885061": "394",
    "4885406": "393",
    "4885411": "392",
    "4885412": "391",
    "4885470": "390",
    "4886176": "389",
    "4890965": "388",
    "4890966": "387",
    "4890967": "386"
  }
  // expects a space-delimited string of Ensighten condition IDs, returns a boolean that says if ANY were true
  function checkConditions (condString) {
    try {
      condString = condString || ""
      var condList = condString.trim().split(/\s+/)
      var conditions = {}
      var translatedId
      condList.forEach((ensightenCondId) => {
        // populate the object with 'false' to start
        translatedId = conditionMap[ensightenCondId]
        if (typeof translatedId === 'string') {
          conditions[translatedId] = false
        }
      })
      window.utag.loader.loadrules(originalB, conditions)
      // console.log(conditions)
      var conditionMet = false
      var finalConditions = Object.keys(conditions)
      finalConditions.forEach((id) => {
        if (conditions[id]) {
          conditionMet = true
        }
      })
      return conditionMet
    } catch (e) {
      console.log('checkConditions error', e)
      return false
    }
  }

  if (checkConditions(" 4874978 ")) {
    try {
      b["content_id"] = (function() {
        return window.location.search.replace("?", "&")
          .split("&units[]=").pop()
          .split("&").shift();
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4825462  2518567  4836987 ")) {
    try {
      b["Crystal - Affiliate Order Detail"] = (function() {
        var boughtCat = dataLayer[0].ecommerce.purchase.products[0].category;
        var partDetail = boughtCat.split('/');
        var ref = dataLayer[0].ecommerce.purchase.actionField.id;
        return ref + "_" + partDetail[1] + "_" + partDetail[2] + "_" + partDetail[3] + "_" + dataLayer[0].departureAirport + "_" + dataLayer[0].ecommerce.purchase.products[0].name + "_" + dataLayer[0].ecommerce.purchase.products[0].quantity + "_" + dataLayer[0].departureDate;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4836987  4825427 ")) {
    try {
      b["Crystal - BookingRef"] = (function() {
        if (dataLayer[0].eCommerce !== undefined) {
          return dataLayer[0].eCommerce.purchase ? dataLayer[0].eCommerce.purchase.actionField.id : "";
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4836987  4825427 ")) {
    try {
      b["Crystal - boughtAdults"] = (function boughtAdults() {
        if (dataLayer[0] !== undefined) {
          var par = dataLayer[0].partyCombination;
          var parts = par.split(':');
          var firstlevel = parts[0];
          return parts[0];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4825427  4836987 ")) {
    try {
      b["Crystal - boughtCategory4"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          var cat = dataLayer[0].ecommerce.purchase ? dataLayer[0].ecommerce.purchase.products[0].category : dataLayer[0].ecommerce.checkout.products[0].category;
          var parts = cat.split('/');
          return parts[3];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4836987  4825427 ")) {
    try {
      b["Crystal - boughtChildren"] = (function boughtChildren() {
        if (dataLayer[0] !== undefined) {
          var par = dataLayer[0].partyCombination;
          var parts = par.split(':');
          var firstlevel = parts[0];
          return parts[1];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4836899  4836987  4151406  4825427 ")) {
    try {
      b["Crystal - boughtCountry"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          var cat = (dataLayer[0].ecommerce.purchase ? dataLayer[0].ecommerce.purchase.products[0].category : "");
          var parts = cat.split('/');
          return parts[1];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4825427  4836987 ")) {
    try {
      b["Crystal - boughtPax"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          return dataLayer[0].ecommerce.purchase ? dataLayer[0].ecommerce.purchase.products[0].quantity : dataLayer[0].ecommerce.checkout.products[0].quantity;
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4836987 ")) {
    try {
      b["Crystal - boughtPeriod"] = (function anon() {
        var boughtFrom = dataLayer[0].departureDate;
        var boughtTo = dataLayer[0].returnDate;

        if (boughtFrom !== undefined) {
          return (boughtFrom + " - " + boughtTo);
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4825427  4836987 ")) {
    try {
      b["Crystal - boughtPrice"] = (function() {
        if (dataLayer[0].ecommerce !== undefined && dataLayer[0].ecommerce.purchase !== undefined) {
          return dataLayer[0].ecommerce.purchase.actionField.revenue;
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4825427  4836987 ")) {
    try {
      b["Crystal - boughtResort"] = (function() {
        if (dataLayer[0].ecommerce !== undefined && dataLayer[0].ecommerce.purchase !== undefined) {
          var cat = dataLayer[0].ecommerce.purchase.products[0].category;
          var parts = cat.split('/');
          return parts[2];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151406  4836987 ")) {
    try {
      b["Crystal - departureDate"] = (function() {
        return dataLayer[0].departureDate;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151409  2503818  4844447  4844445 ")) {
    try {
      b["Crystal - productBrand"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          return dataLayer[0].ecommerce.checkout ? dataLayer[0].ecommerce.checkout.products[0].brand : dataLayer[0].ecommerce.detail.products[0].brand;
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 2503818  4151409  4834971  4834967  4844577 ")) {
    try {
      b["Crystal - productCategory"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          return dataLayer[0].ecommerce.detail ? dataLayer[0].ecommerce.detail.products[0].category : dataLayer[0].ecommerce.checkout.products[0].category;
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151409  2503818  4834971  4834967 ")) {
    try {
      b["Crystal - productCategory1"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          var cat = dataLayer[0].ecommerce.detail ? dataLayer[0].ecommerce.detail.products[0].category : (dataLayer[0].ecommerce.checkout.products[0].category || "");
          var parts = cat.split('/');
          return parts[0];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151409  2503818  4834971  4834967  4844577 ")) {
    try {
      b["Crystal - productCategory2"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          var cat = dataLayer[0].ecommerce.checkout ? dataLayer[0].ecommerce.checkout.products[0].category : (dataLayer[0].ecommerce.detail.products[0].category || "");
          var parts = cat.split('/');
          return parts[1];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151409  4834971  2503818  4834967  4844577  4825428 ")) {
    try {
      b["Crystal - productCategory3 - Resort"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          var cat = dataLayer[0].ecommerce.checkout ? dataLayer[0].ecommerce.checkout.products[0].category : (dataLayer[0].ecommerce.detail.products[0].category || "");
          var parts = cat.split('/');
          return parts[2];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4834971  4834967  4151409  2503818 ")) {
    try {
      b["Crystal - productCategory4"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          var cat = dataLayer[0].ecommerce.checkout ? dataLayer[0].ecommerce.checkout.products[0].category : dataLayer[0].ecommerce.detail.products[0].category;
          var parts = cat.split('/');
          return parts[3];
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4834971  4834967  4151407 ")) {
    try {
      b["Crystal - productID"] = (function anon() {
        if (dataLayer[0].ecommerce !== undefined) {
          return dataLayer[0].ecommerce.checkout ? dataLayer[0].ecommerce.checkout.products[0].id : dataLayer[0].ecommerce.detail.products[0].id;
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151407  4834971  4834967 ")) {
    try {
      b["Crystal - productID - Facebook"] = (function anon() {
        var accomID = dataLayer[0].ecommerce && dataLayer[0].ecommerce.checkout ? dataLayer[0].ecommerce.checkout.products[0].id : dataLayer[0].ecommerce.detail.products[0].id;
        return accomID.substring(2);
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151407  4151406 ")) {
    try {
      b["Crystal - productPax"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          return dataLayer[0].ecommerce.checkout ? dataLayer[0].ecommerce.checkout.products[0].quantity : (dataLayer[0].ecommerce.purchase ? dataLayer[0].ecommerce.purchase.products[0].quantity : "");
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 2503818  4151409  4834971  4834967 ")) {
    try {
      b["Crystal - productPrice"] = (function() {
        if (dataLayer[0].ecommerce !== undefined) {
          return dataLayer[0].ecommerce.checkout ? dataLayer[0].ecommerce.checkout.products[0].price : dataLayer[0].ecommerce.detail.products[0].price;
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4151407  4844577 ")) {
    try {
      b["Crystal - Selected Flight Position"] = (function() {
        if (dataLayer[0].flightposition !== undefined) {
          return parseInt(dataLayer[0].flightPosition) + 1;
        } else return ""
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4836987  2518567 ")) {
    try {
      b["Crystal - TravelType"] = (function() {
        if (dataLayer[0].departureAirport === "ASH" || dataLayer[0].departureAirport === "STP") {
          return "Train";
        }
        return "Flight";
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 2518567  4836987 ")) {
    try {
      b["Crystal Ski - Affiliate Cookie"] = (function() {
        var value = "; " + document.cookie;
        var parts = value.split("; AffiliateCJcookie=");
        if (parts.length == 2) {
          return decodeURIComponent(parts.pop().split(";").shift());
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 2518567  4836987 ")) {
    try {
      b["Crystal Ski - cjCookie"] = (function() {
        var value = "; " + document.cookie;
        var parts = value.split("; cjevent=");
        if (parts.length == 2) {
          return decodeURIComponent(parts.pop().split(";").shift());
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 386105 ")) {
    try {
      b["geoCountry"] = (function() {
        try {
          if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.countryName) {
            return dataLayer[0].transactions.items.geo.countryName;
          } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.countryName) {
            return dataLayer[0].basket.items.geo.countryName;
          } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.countryName) {
            return dataLayer[0].product.geo.countryName;
          }
        } catch (err) {
          return "";
        }
      })()
    } catch (e) {
      logError(e)
    }
  }

  // not sure why this is defined once conditional and once unconditional
  try {
    b["productType"] = (function() {
      try {
        if (document.location.href.indexOf('flight/book') > -1) {
          return "Flight";
        } else if (document.location.href.indexOf('river-cruises/book') > -1) {
          return "River Cruise";
        } else if (document.location.href.indexOf('cruise/book') > -1) {
          return "Cruise";
        } else if (document.location.href.indexOf('multi-centre/book') > -1) {
          return "Multi-Centre";
        } else {
          if (tui.analytics.page.AOType == "Yes") {
            return "Hotel Only";
          } else {
            return "Package";
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }
  
  /*
  if (checkConditions(" 696873  4845366  470318  4845258  4845255  4845356  4845253  4878884  4873541 ")) {
    try {
      b["productType"] = (function() {
        try {
          if (document.location.href.indexOf('flight/book') > -1) {
            return "";
          } else if (document.location.href.indexOf('river-cruises/book') > -1) {
            return "River Cruise";
          } else if (document.location.href.indexOf('cruise/book') > -1) {
            return "Cruise";
          } else if (document.location.href.indexOf('multi-centre/book') > -1) {
            return "Multi-Centre";
          } else {
            if (tui.analytics.page.AOType == "Yes") {
              return "Hotel Only";
            } else {
              return "Package";
            }
          }
        } catch (err) {
          return "";
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  */

  
  // depends on "legacy_productType"
  if (checkConditions(" 4845255  4845356  4845253  4878884  696873  4845366  4873541  4859386  4845258 ")) {
    try {
      b["productList"] = (function() {

        var productObj = {},
          product = '',
          dl = '',
          returnVal = [];

        function mapProductObj(id, name, brand, price, quantity, productType, numPax) {
          var tempObj = {};
          tempObj.id = id;
          tempObj.name = name;
          tempObj.brand = brand || '';
          tempObj.price = price ? (String(parseFloat(price) / parseInt(quantity, 10))) : price;
          tempObj.quantity = String(quantity);
          tempObj.productType = productType || masterProductType;
          tempObj.metric1 = String(numPax);
          return tempObj;
        };

        try {
          // var masterProductType = Bootstrapper.data.resolve('Manage.TUI UK - Google Analytics.productType');
          var masterProductType = b.productType
          if (window.dataLayer && dataLayer[0] && dataLayer[0].page) {
            dl = dataLayer[0];
            if (dl.product && dl.product.productID) {
              // Individual Product Impression
              product = dl.product;
              productObj = mapProductObj(product.productID, product.productName, product.productCollectionCode, product.currentPrice, 1, '', product.noOfPax);
              returnVal.push(productObj);
            } else if (dl.page.search) {
              // Search Term
              product = dl.page.search;
              var noOfPax = dl.page.search.noOfPax.toString();
              if (product.destinationId || product.destinationName) {
                // Splits the searched destinations up
                var delimiter = '|',
                  destinationIds = product.destinationId ? product.destinationId.split(delimiter) : [],
                  destinationNames = product.destinationName ? product.destinationName.split(delimiter) : [],
                  maxLength = destinationIds.length >= destinationNames.length ? destinationIds.length : destinationNames.length;

                for (var i = 0; i < maxLength; i++) {
                  var searchedObj = {
                    'list': 'Search Term',
                    'metric1': noOfPax
                  };

                  if (destinationIds[i]) {
                    searchedObj.productID = destinationIds[i];
                  }
                  if (destinationNames[i]) {
                    searchedObj.productName = destinationNames[i];
                  }
                  returnVal.push(searchedObj);
                }
              }

              // Search Results
              if (product && product.resultsList) {
                for (var j = 0; j < product.resultsList.length; j++) {
                  var currentResult = product.resultsList[j];
                  currentResult.position = currentResult.position || (j + 1);
                  currentResult.list = dl.page.pageSubCategory;
                  currentResult.metric1 = noOfPax;
                  returnVal.push(currentResult);
                }
              }
            } else if (dl.basket || dl.transactions) {
              // main item
              product = dl.basket ? dl.basket.items : (dl.transactions ? dl.transactions.items : {});

              var numPax = dl.basket ? dl.basket.price.paxDetails.total : dl.transactions.total.paxDetails.total,
                promoDiscount = (function() {
                  try {
                    //Added for new array
                    if (dl.transactions.total && dl.transactions.total.bookingLevelPromoCodes && dl.transactions.total.bookingLevelPromoCodes.length > 0) {
                      var promoCodeArray = dl.transactions.total.bookingLevelPromoCodes;
                      var promoTotalValue = 0;
                      for (i = 0; i < promoCodeArray.length; i++) {
                        promoTotalValue = promoTotalValue + promoCodeArray[i].bookingLevelPromoDiscount;
                      }
                      return promoTotalValue;
                    } else if (typeof dl.transactions.total.bookingLevelPromoDiscount !== 'undefined') {
                      return Math.abs(dl.transactions.total.bookingLevelPromoDiscount); // convert it to positive if its ever negative
                    } else if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
                      return parseFloat(tui.analytics.page.PromoValue); // Credit note change - changed parseInt to parseFloat
                    }
                    return 0;
                  } catch (err) {
                    return 0;
                  }
                })(),
                price = product.price.currentPrice - promoDiscount;

              productObj = mapProductObj(product.productID, product.productName, product.productCollectionCode, price, product.quantity.quantity, '', numPax.toString());
              returnVal.push(productObj);

              // ancillaries
              var subItems = product.subItems || [];
              for (var s = 0; s < subItems.length; s++) {
                var currentSubItem = subItems[s];
                if (currentSubItem.productSubType.toLowerCase() == "room upgrade") {
                  subItemObj = mapProductObj(currentSubItem.productID, currentSubItem.productName, currentSubItem.productCollectionCode, currentSubItem.price.currentPrice, currentSubItem.quantity.quantity, 'Room Upgrade', currentSubItem.quantity.pax.toString());
                } else if (currentSubItem.productSubType.toLowerCase() == "room downgrade") {
                  subItemObj = mapProductObj(currentSubItem.productID, currentSubItem.productName, currentSubItem.productCollectionCode, currentSubItem.price.currentPrice, currentSubItem.quantity.quantity, 'Room Downgrade', currentSubItem.quantity.pax.toString());
                } else if (currentSubItem.productSubType.toLowerCase() == "board upgrade") {
                  subItemObj = mapProductObj(currentSubItem.productID, currentSubItem.productName, currentSubItem.productCollectionCode, currentSubItem.price.currentPrice, currentSubItem.quantity.quantity, 'Board Upgrade', currentSubItem.quantity.pax.toString());
                } else if (currentSubItem.productSubType.toLowerCase() == "board downgrade") {
                  subItemObj = mapProductObj(currentSubItem.productID, currentSubItem.productName, currentSubItem.productCollectionCode, currentSubItem.price.currentPrice, currentSubItem.quantity.quantity, 'Board Downgrade', currentSubItem.quantity.pax.toString());
                } else {
                  subItemObj = mapProductObj(currentSubItem.productID, currentSubItem.productName, currentSubItem.productCollectionCode, currentSubItem.price.currentPrice, currentSubItem.quantity.quantity, 'Ancillary', currentSubItem.quantity.pax.toString());
                }

                returnVal.push(subItemObj);
              }
            }
          }
          // For old data layer
          else if (window.tui && tui.analytics && tui.analytics.page) {
            product = tui.analytics.page;

            var productSum = product.Sum || 0,
              promoDiscount = (function() {
                try {
                  if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
                    return parseFloat(tui.analytics.page.PromoValue); // Credit note change - changed parseInt to parseFloat
                  }
                  return 0
                } catch (err) {
                  return 0;
                }
              })(),
              price = product.bookingLevelCreditNoteDiscount && (parseFloat(product.bookingLevelCreditNoteDiscount) > 0) ? (parseFloat(product.bookingLevelCreditNoteDiscount) + parseFloat(productSum)) : productSum,
              id = product.CRWhereTo || product.WhereTo;

            price = price ? price : '';
            productObj = mapProductObj(id, id, '', price, 1, masterProductType, product.Pax.toString()); // Credit note change - add credit note value if present
            returnVal.push(productObj);
          }
          return returnVal;
        } catch (err) {
          return returnVal;
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
 
  
  if (checkConditions(" 1207254  1211720 ")) {
    try {
      b["STOCKTON - CD - Cabin"] = (function() {
        return tui.analytics.page.CRCabin;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207206  1211741 ")) {
    try {
      b["STOCKTON - DD - BoardFilter"] = (function() {
        return tui.analytics.page.BoardF;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207206  1211741 ")) {
    try {
      b["STOCKTON - DD - BudgetFilter"] = (function() {
        return tui.analytics.page.BudgetF;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207206  1211741 ")) {
    try {
      b["STOCKTON - DD - CabinFilter"] = (function() {
        return tui.analytics.page.CabinF;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207254  1211720 ")) {
    try {
      b["STOCKTON - DD - Confirmation - Itinerary Name"] = (function() {
        var itineraryName = document.getElementsByClassName('title tui-bold')[0].innerHTML;

        if (itineraryName.indexOf("|") > -1) {
          itineraryName = itineraryName.replace("|", "followed by")
        }

        if (itineraryName == null || itineraryName == '') {
          itineraryName = tui.analytics.page.CRWhereTo;
        }

        return itineraryName;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1211741  1207206 ")) {
    try {
      b["STOCKTON - DD - Cruise Details - Itinerary Name"] = (function() {
        var itineraryName = document.getElementsByClassName('inline-title')[0].innerText.replace(/(\r\n|\n|\r)/gm, " ");
        if (itineraryName == null || itineraryName == '') {
          itineraryName = tui.analytics.page.CRWhereTo;
        }
        return itineraryName;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1210674  1211742 ")) {
    try {
      b["STOCKTON - DD - Cruise Options - Itinerary Name"] = (function() {
        var itineraryName = jsonData.packageViewData.accomViewData[0].accomName;

        if (itineraryName.indexOf("|") > -1) {
          itineraryName = itineraryName.replace("|", "followed by")
        }

        if (itineraryName == null || itineraryName == '') {
          itineraryName = tui.analytics.page.CRWhereTo;
        }

        return itineraryName;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1211742  1211743  1211741  1207254  1207206  1210674  1211596  1211720 ")) {
    try {
      b["STOCKTON - DD - DaysUntilDeparture"] = (function() {
        //Build raw date
        var rawDate = tui.analytics.page.DepDate + '/' + tui.analytics.page.MonthYear;
        //Change to american formatting
        var depDate = new Date(rawDate.split("/")[1] + "/" + rawDate.split("/")[0] + "/" + rawDate.split("/")[2]);
        var today = new Date();
        return parseInt((depDate - today) / (1000 * 60 * 60 * 24)) + 1;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207254  1207206  1210674  1211596  1211741  1211720  1211742  1211743 ")) {
    try {
      b["STOCKTON - DD - DepartureAirport"] = (function() {
        return tui.analytics.page.DepAir;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207206  1211741 ")) {
    try {
      b["STOCKTON - DD - DepartureAirportFilter"] = (function() {
        return tui.analytics.page.DepAirF;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207206  1211741 ")) {
    try {
      b["STOCKTON - DD - DestinationFilter"] = (function() {
        return tui.analytics.page.CRGeoF;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1211743  1207254  1210674  1211596  1211720  1211742 ")) {
    try {
      b["STOCKTON - DD - Hotel"] = (function() {
        return tui.analytics.page.CRHotel;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207254  1207206  1210674  1211596  1211742  1211743  1211720  1211741 ")) {
    try {
      b["STOCKTON - DD - Party"] = (function() {
        return tui.analytics.page.Party;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1211596  1211743 ")) {
    try {
      b["Stockton - DD - Passenger Details - Itinerary Name"] = (function() {
        try {
          var itineraryName = jsonData.packageViewData.accomViewData[0].accomName;

          if (itineraryName.indexOf("|") > -1) {
            itineraryName = itineraryName.replace("|", "followed by")
          }

          if (itineraryName == null || itineraryName == '') {
            itineraryName = tui.analytics.page.CRWhereTo;
          }

          return itineraryName;
        } catch (err) {
          return "";
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207254  1211720 ")) {
    try {
      b["STOCKTON - DD - PaymentType"] = (function() {
        return tui.analytics.page.PayType;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207254  1211720 ")) {
    try {
      b["STOCKTON - DD - PromoCode"] = (function() {
        return tui.analytics.page.PromoCode;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207206  1211741 ")) {
    try {
      b["STOCKTON - DD - ShipFilter"] = (function() {
        return tui.analytics.page.CRShip;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 1207254  1211720 ")) {
    try {
      b["STOCKTON - DD - TransactionId"] = (function() {
        return tui.analytics.page.Tracsref;
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  if (checkConditions(" 4879518  4880063  4880064  4880065  4880066 ")) {
    try {
      b["uniqodoBookingReference"] = (function() {
        try {
          if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.transactionId) {
            return dataLayer[0].transactions.total.transactionId.toString().split('-')[0];
          } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Tracsref) {
            return tui.analytics.page.Tracsref.toString().split('-')[0];
          }
        } catch (err) {
          return '';
        }
      })()
    } catch (e) {
      logError(e)
    }
  }
  
  // add a prefix to mark these variables as legacy
  var legacyVariables = Object.keys(b)
  legacyVariables.forEach(function(key) {
    originalB[legacyPrefix + key] = b[key]
  })

  return originalB;
}

function addUnconditionalEnsightenVariables (originalB) {
  var b = {}
  try {
    b["abtaNumber"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.ShopID) {
          return tui.analytics.page.ShopID;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["abTest"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.abtestV2) {
          return tui.analytics.page.abtestV2;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.abTestV2) {
          return dataLayer[0].page.abTestV2;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["adobeCookieDomainPeriods"] = (function() {
      try {
        if (document.location.host.indexOf(".co.uk") > 0) {
          return 3;
        } else if (document.location.hostname.match(/(\.thomsonuk\.dnsroot\.biz)/g)) {
          return 3;
        } else {
          return 2;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["adobeDownloadFileTypes"] = (function() {
      try {
        return "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["adobeLinkInternalFilters"] = (function() {
      try {
        return "javascript:," +
          "firstchoice.co.uk," +
          "firstchoiceprjuat.co.uk," +
          "thomson.co.uk," +
          "thomsonprjuat.co.uk," +
          "falconholidays.ie," +
          "falconholidaysprjuat.ie," +
          "tui.co.uk," +
          "tuiprjuat.co.uk," +
          "tuiholidays.ie," +
          "tuiholidaysprjuat.ie," +
          "i.4see.mobi," +
          "survey.foreseeresults.com," +
          "tuiretailagents.thomson.co.uk," +
          "retailagents.tui.co.uk," +
          "falconretailagents.falconholidays.ie," +
          "retailagents.tuiholidays.ie," +
          "retailagents.tuiholidaysprjuat.ie," +
          "tuiretailhish-live.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st1.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st2.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st3.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st4.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st5.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st6.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st7.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st8.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st9.thomsonuk.dnsroot.biz," +
          "tuiretailhish-st10.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd1.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd2.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd3.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd4.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd5.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd6.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd7.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd8.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd9.thomsonuk.dnsroot.biz," +
          "tuiretailhish-hybd10.thomsonuk.dnsroot.biz," +
          "falconretailhish-live.thomsonuk.dnsroot.biz," +
          "falconretailhish-st1.thomsonuk.dnsroot.biz," +
          "falconretailhish-st2.thomsonuk.dnsroot.biz," +
          "falconretailhish-st3.thomsonuk.dnsroot.biz," +
          "falconretailhish-st4.thomsonuk.dnsroot.biz," +
          "falconretailhish-st5.thomsonuk.dnsroot.biz," +
          "falconretailhish-st6.thomsonuk.dnsroot.biz," +
          "falconretailhish-st7.thomsonuk.dnsroot.biz," +
          "falconretailhish-st8.thomsonuk.dnsroot.biz," +
          "falconretailhish-st9.thomsonuk.dnsroot.biz," +
          "falconretailhish-st10.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd1.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd2.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd3.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd4.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd5.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd6.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd7.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd8.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd9.thomsonuk.dnsroot.biz," +
          "falconretailhish-hybd10.thomsonuk.dnsroot.biz," +
          "money4travel.com," +
          "inbro.net," +
          "tuitickets.com," +
          "amazonaws.com";
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["adobeMarketingCloudVisitorID"] = (function() {
      try {
        return visitor.getMarketingCloudVisitorID();
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["adobeProductString"] = (function anon() {
      /////////////////////////////////////////////////
      // ADOBE ANALYTICS - PRODUCT STRING DATA ELEMENT
      /////////////////////////////////////////////////

      // enables console logging if the environment is hybrisdev
      debugLogging = function(msg) {
        if (Bootstrapper.ensightenOptions.publishPath === 'hybrisdev' || Bootstrapper.ensightenOptions.publishPath === 'paymentpagedev' || Bootstrapper.ensightenOptions.publishPath === 'hybrisprod' || Bootstrapper.ensightenOptions.publishPath === 'paymentpage')
          console.log('DEBUG - ' + msg)
      }


      // create inital product_string object
      product_string = ''
      product_string_old = ''

      //////////////////////////////////////
      // SEARCH PAGE - NEW DATA LAYER
      //////////////////////////////////////

      if (typeof dataLayer != 'undefined') {
        if (typeof dataLayer[0] != 'undefined') {
          if (dataLayer[0].page) {

            if (dataLayer[0].page.pageSubCategory === 'Search Results') {

              debugLogging('new datalayer: search page product string rule met')

              // split destination ids into an arrays
              var destinationIdArray = dataLayer[0].page.search.destinationId.split('|')

              // loop through the array
              var arrayLeng = destinationIdArray.length;
              for (var i = 0; i < arrayLeng; i++) {

                // add a comma to seperate each product
                if (product_string != '') {
                  product_string += ','
                }

                product_string +=
                  /*category*/
                  /*id*/
                  ';' + destinationIdArray[i]
                  /*quantity*/
                  +
                  ';'
                  /*total price*/
                  +
                  ';'
                  /*events*/
                  +
                  ';'
                  /*evars*/
                  +
                  // Changed from searchType to siteSection
                  ';' + 'eVar153=' + dataLayer[0].page.siteSection

              }
              debugLogging('product_string: ' + product_string)
            }


            //////////////////////////////////////
            // UNIT DETAILS PAGE - NEW DATA LAYER
            //////////////////////////////////////

            if (dataLayer[0].page.pageSubCategory === 'Unit Details') {

              debugLogging('new datalayer: unit details page product string rule met')

              product_string +=
                /*category*/
                /*id*/
                ';' + dataLayer[0].product.productID
                /*quantity*/
                +
                ';'
                /*total price*/
                +
                ';'
                /*events*/
                +
                ';'
                /*evars*/
                +
                ';' + 'eVar153=' + dataLayer[0].product.productType

              debugLogging('product_string: ' + product_string)
            }


            //////////////////////////////////////
            // BOOKFLOW PAGES - NEW DATA LAYER
            //////////////////////////////////////

            if (dataLayer[0].page.pageSubCategory === 'Room Options' ||
              dataLayer[0].page.pageSubCategory === 'Flight Options' ||
              dataLayer[0].page.pageSubCategory === 'Extra Options' ||
              dataLayer[0].page.pageSubCategory === 'Summary' ||
              dataLayer[0].page.pageSubCategory === 'Passenger Details' ||
              dataLayer[0].page.pageSubCategory === 'Payment' ||
              dataLayer[0].page.pageSubCategory === 'Payment Details' ||
              dataLayer[0].page.pageSubCategory === 'Customise Holiday' ||
              dataLayer[0].page.pageID === 'lockYourPriceConfirmationpage_react') { //Added for LYP

              debugLogging('new datalayer: bookflow product string rule met')

              // add bookflow object as part of LYP
              var bookflowPage = (dataLayer[0].page.pageID === 'lockYourPriceConfirmationpage_react' ? dataLayer[0].transactions : dataLayer[0].basket)
              // add main product first
              product_string +=
                /*category*/
                /*id*/
                ';' + bookflowPage.items.productID
                /*quantity*/
                +
                ';'
                /*total price*/
                +
                ';'
                /*events*/
                +
                ';'
                /*evars*/
                + //added check for productType
                ((typeof bookflowPage.items.productType !== 'undefined') ? (';' + 'eVar153=' + bookflowPage.items.productType) : '')

              // loop through the ancilliary items array
              var arrayLeng = bookflowPage.items.subItems.length;
              for (var i = 0; i < arrayLeng; i++) {

                // add a comma to seperate each ancilliary product
                if (product_string != '') {
                  product_string += ','
                }

                // function to get recommended merch evars
                function getRecommendedMerchEvars() {

                  return ((bookflowPage.items.subItems[i].isRecommendedItem) ? ('|' + 'eVar205=' + bookflowPage.items.subItems[i].isRecommendedItem) : '')

                }

                // add the ancilliaries to the product string
                product_string +=
                  /*category*/
                  /*id*/
                  ';' + bookflowPage.items.subItems[i].productID
                  /*quantity*/
                  +
                  ';'
                  /*total price*/
                  +
                  ';'
                  /*events*/
                  +
                  ';'
                  /*evars*/
                  +
                  ';' + 'eVar153=' + bookflowPage.items.productType +
                  getRecommendedMerchEvars()
              }
              debugLogging('product_string: ' + product_string)
            }


            //////////////////////////////////////
            // CONFIRMATION PAGE - NEW DATA LAYER
            //////////////////////////////////////

            if (dataLayer[0].page.pageSubCategory === 'Confirmation' && dataLayer[0].transactions.total.transactionId && typeof dataLayer[0].transactions.items !== 'undefined' && dataLayer[0].page.pageID != 'lockYourPriceConfirmationpage_react') { //Added for LYP

              debugLogging('new datalayer: confirmation page product string rule met')

              // function to remove booking level discount (i.e. voucher code discounts) from the main product revenue, if applicable. Added backup reference to old data layer due to defect with bookingLevelPromoDiscount
              function getMainProductRevenue() {
                try {
                  if (typeof dataLayer[0].transactions.total.bookingLevelPromoDiscount !== 'undefined') {
                    return dataLayer[0].transactions.items.price.currentPrice - Math.abs(dataLayer[0].transactions.total.bookingLevelPromoDiscount);
                  } else if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
                    return dataLayer[0].transactions.items.price.currentPrice - parseFloat(tui.analytics.page.PromoValue); // Credit note change - changed parseInt to parseFloat
                  } else if ((typeof dataLayer[0].transactions.total.bookingLevelPromoDiscount === 'undefined') && (typeof tui.analytics.page.PromoValue === 'undefined' || tui.analytics.page.PromoValue === 'null')) {
                    return dataLayer[0].transactions.items.price.currentPrice
                  } else {
                    return ''
                  }
                } catch (err) {
                  return '';
                }
              }

              // function to get discount code
              function getPromoDiscount() {
                try {
                  if (typeof dataLayer[0].transactions.total.bookingLevelPromoDiscount !== 'undefined') {
                    return '|event154=' + Math.abs(dataLayer[0].transactions.total.bookingLevelPromoDiscount); // convert it to positive if its ever negative
                  } else if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
                    return '|event154=' + parseFloat(tui.analytics.page.PromoValue); // Credit note change - changed parseInt to parseFloat
                  } else {
                    return ''
                  }
                } catch (err) {
                  return '';
                }
              }

              // add main product first
              product_string +=
                /*category*/
                /*id*/
                ';' + dataLayer[0].transactions.items.productID
                /*quantity*/
                +
                ';' + dataLayer[0].transactions.items.quantity.quantity
                /*total price*/
                +
                ';' + getMainProductRevenue()
                /*events*/
                +
                ';' + 'event150=' + (dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount && dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount > 0 ? dataLayer[0].transactions.total.totalPrice + dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount : dataLayer[0].transactions.total.totalPrice) + '|' + // Credit note change - Adding credit note value back on if present
                'event151=' + dataLayer[0].transactions.total.discount + '|' +
                'event152=' + dataLayer[0].transactions.items.quantity.pax + '|' +
                'event153=' + dataLayer[0].transactions.items.quantity.pax + getPromoDiscount()

                /*evars*/
                + //Added a check for product type
                ((typeof dataLayer[0].transactions.items.productType !== 'undefined') ? (';' + 'eVar153=' + dataLayer[0].transactions.items.productType) : '')


              // loop through the ancilliary items array
              var arrayLeng = dataLayer[0].transactions.items.subItems.length;
              for (var i = 0; i < arrayLeng; i++) {

                // add a comma to seperate each ancilliary product
                if (product_string != '') {
                  product_string += ','
                }

                // function to get recommended merch evars
                function getRecommendedMerchEvars() {

                  return ((dataLayer[0].transactions.items.subItems[i].isRecommendedItem) ? ('|' + 'eVar205=' + dataLayer[0].transactions.items.subItems[i].isRecommendedItem) : '')
                }

                // add the ancilliaries to the product string
                product_string +=
                  /*category*/
                  /*id*/
                  ';' + dataLayer[0].transactions.items.subItems[i].productID
                  /*quantity*/
                  +
                  ';' + dataLayer[0].transactions.items.subItems[i].quantity.quantity
                  /*total price*/
                  +
                  ';' + ((dataLayer[0].transactions.items.subItems[i] && dataLayer[0].transactions.items.subItems[i].price && dataLayer[0].transactions.items.subItems[i].price.currentPrice) ? (dataLayer[0].transactions.items.subItems[i].price.currentPrice) : 0)
                  /*events*/
                  +
                  ';' + 'event152=' + dataLayer[0].transactions.items.subItems[i].quantity.pax
                  /*evars*/
                  +
                  ';' + 'eVar153=' + dataLayer[0].transactions.items.productType +
                  getRecommendedMerchEvars();

              }
              debugLogging('product_string: ' + product_string)
            }

          }
        }
      }

      /////////////////////////////////////////////
      // OLD DATA LAYER HANDLER FOR WHERETO VALUES
      /////////////////////////////////////////////

      if (window.tui && tui.analytics) {

        // functiom to get the right WhereTo values and type
        function getWhereTo() {

          // create some separators
          var separators = ['-', '\\|'];

          try {

            // WhereTo for Beach holidays, which don't have a '-' and aren't on the multicentre or flight page urls
            if (typeof tui.analytics.page.WhereTo !== 'undefined' &&
              tui.analytics.page.WhereTo !== 'null' &&
              tui.analytics.page.WhereTo.indexOf('-') === -1 &&
              document.location.pathname.indexOf('/multi-centre/') === -1 &&
              document.location.pathname.indexOf('/flight/') === -1) {
              var products_array = []
              var products = tui.analytics.page.WhereTo.split(new RegExp(separators.join('|'), 'g'))
              for (var i = 0; i < products.length; i++) {
                products_array.push({
                  product: products[i],
                  type: 'Beach'
                });
              }
              return products_array;
            }

            // WhereTo for Flight-only holidays, which are on flight page urls
            if (typeof tui.analytics.page.WhereTo !== 'undefined' &&
              tui.analytics.page.WhereTo !== 'null' &&
              document.location.pathname.indexOf('/flight/') != -1) {
              var products_array = []
              var products = tui.analytics.page.WhereTo.split(new RegExp(separators.join('|'), 'g'))
              for (var i = 0; i < products.length; i++) {
                products_array.push({
                  product: products[i],
                  type: 'Flight-Only'
                });
              }
              return products_array;
            }

            // WhereTo for multicentre search page, which are on multicentre urls but don't have a '-' in the WhereTo
            if (typeof tui.analytics.page.WhereTo !== 'undefined' &&
              tui.analytics.page.WhereTo !== 'null' &&
              document.location.pathname.indexOf('/multi-centre/') != -1 &&
              tui.analytics.page.WhereTo.indexOf('-') === -1) {
              var products_array = []
              var products = tui.analytics.page.WhereTo.split(new RegExp(separators.join('|'), 'g'))
              for (var i = 0; i < products.length; i++) {
                products_array.push({
                  product: products[i],
                  type: 'Multicentre'
                });
              }
              return products_array;
            }

            // WhereTo for multicentres with ONE L-epic code, which are on multicentre URLs or have a '-' in the WhereTo
            if (typeof tui.analytics.page.WhereTo !== 'undefined' && tui.analytics.page.WhereTo !== 'null') {
              if (document.location.pathname.indexOf('/multi-centre/') || tui.analytics.page.WhereTo.indexOf('-') != -1) {
                if (tui.analytics.page.WhereTo.match(/L/g).length === 1) {
                  var products_array = []
                  var products = tui.analytics.page.WhereTo.split(new RegExp(separators.join('|'), 'g'))
                  for (var i = 0; i < products.length; i++) {
                    products_array.push({
                      product: products[i],
                      type: 'Multicentre'
                    });
                  }
                  return products_array;
                }
              }
            }

            // WhereTo for multicentres with TWO L-epic codes, which are on multicentre URLs or have a '-' in the WhereTo
            if (typeof tui.analytics.page.WhereTo !== 'undefined' && tui.analytics.page.WhereTo !== 'null') {
              if (document.location.pathname.indexOf('/multi-centre/') || tui.analytics.page.WhereTo.indexOf('-') != -1) {
                if (tui.analytics.page.WhereTo.match(/L/g).length === 2) {
                  var products_array = []
                  var products = tui.analytics.page.WhereTo.replace('-', '?').split(new RegExp(separators.join('|'), 'g'))
                  for (var i = 0; i < products.length; i++) {
                    products_array.push({
                      product: products[i].replace('?', '-'),
                      type: 'Multicentre'
                    });
                  }
                  return products_array;
                }
              }
            }

            // WhereTo for cruises, which are in a separate 'CRWhereTo' variable
            if (typeof tui.analytics.page.CRWhereTo !== 'undefined' && tui.analytics.page.CRWhereTo !== 'null') {
              var products_array = []
              var products = tui.analytics.page.CRWhereTo.split(new RegExp(separators.join('|'), 'g'))
              for (var i = 0; i < products.length; i++) {
                products_array.push({
                  product: products[i],
                  type: 'Cruise'
                });
              }
              return products_array;
            } else {
              return ''
            }

          } catch (err) {
            return '';
          }
        }

        // function to get discount values
        function getDiscount() {
          try {
            if (typeof tui.analytics.page.Disc !== 'undefined') {
              return 'event151=' + tui.analytics.page.Disc
            } else {
              return ''
            }
          } catch (err) {
            return '';
          }
        }

        // function to get cruise hotels
        function getCruiseHotel() {
          try {
            if (typeof tui.analytics.page.CRHotel !== 'undefined' && tui.analytics.page.CRHotel !== 'null') {
              var products_array = []
              products_array.push({
                product: tui.analytics.page.CRHotel,
                type: 'Cruise'
              });
              return products_array

            } else {
              return ''
            }
          } catch (err) {
            return '';
          }
        }

        /*
          // function to get multicentre hotels
          function getMulticentreHotel() {
            try {
              if (typeof typeof(tui.analytics.page.WhereTo) !== 'undefined' && tui.analytics.page.WhereTo.indexOf('-') !== -1) {
                return 'evarMulticentreHotel=' + tui.analytics.page.WhereTo.substr(tui.analytics.page.WhereTo.indexOf('H'), tui.analytics.page.WhereTo.length - tui.analytics.page.WhereTo.indexOf('H'))
              } else {
                return ''
              }
            } catch (err) {
              return '';
            }
          }
        */
        // function to get legacy merch events and filter out any that are blank or empty strings
        function getLegacyMerchEvents() {
          legacyMerchEvents = ['event150=' + (tui.analytics.page && tui.analytics.page.bookingLevelCreditNoteDiscount && tui.analytics.page.bookingLevelCreditNoteDiscount != 'null' ? parseFloat(tui.analytics.page.Sum) + parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount) : tui.analytics.page.Sum), getDiscount(), 'event152=' + tui.analytics.page.Pax, 'event153=' + tui.analytics.page.Pax].filter(Boolean).join('|')
          return legacyMerchEvents
        }

        /*
          // function to get legacy merch evars and filter out any that are blank or empty strings
          function getLegacyMerchEvars() {
                legacyMerchEvars = [getCruiseHotel(), getMulticentreHotel()].filter(Boolean).join('|')
                return legacyMerchEvars
          }
        */

        // set up regex rules for pages
        var searchRegexCheck = new RegExp('^(\/(destinations(\/multi-centre)?|cruise|river-cruises|flight|holiday|f)\/(packages?|search)\/?)$') // this currently fires on the search pages itself but returns no products
        var bookflowRegexCheck = new RegExp('^(\/(holiday|f|flight|cruise|river-cruises|destinations|destinations\/multi-centre)\/?)')
        //var confirmationRegexCheck = new RegExp('^(\/(holiday|f|flight|cruise|river-cruises|destinations|destinations\/multi-centre|holiday\/multi-centre)\/book\/(mobile\/confirmation|confirmation)\/?)$') //changed for LYP (MMB confirmation)
        var confirmationRegexCheck = new RegExp('^(\/(holiday|f|flight|cruise|river-cruises|destinations|destinations\/multi-centre|holiday\/multi-centre|destinations\/your-account)\/(book|managemybooking)\/(mobile\/confirmation|confirmation|paymentconfirmation)\/?)$')
        var paymentRegexCheck = new RegExp('^(\/cps\/pageRender\/?)')

        //////////////////////////////////////
        // SEARCH PAGE - OLD DATA LAYER
        //////////////////////////////////////

        // regex test for search page
        if (searchRegexCheck.test(document.location.pathname)) {

          debugLogging('old datalayer: search page product string rule met')

          // get all WhereTos and hotels
          var destinationIdArray = getWhereTo()

          // loop through the array
          var arrayLeng = destinationIdArray.length;
          for (var i = 0; i < arrayLeng; i++) {

            // add a comma to seperate each product
            if (product_string_old != '') {
              product_string_old += ','
            }

            product_string_old +=
              /*category*/
              /*id*/
              ';' + destinationIdArray[i].product
              /*quantity*/
              +
              ';'
              /*total price*/
              +
              ';'
              /*events*/
              +
              ';'
              /*evars*/
              +
              'eVar153=' + destinationIdArray[i].type
          }
          debugLogging('product_string_old: ' + product_string_old)
        }


        //////////////////////////////////////
        // UNIT DETAILS PAGE - OLD DATA LAYER
        //////////////////////////////////////

        // not required, can be covered by bookflow rule as the data layer objects are the same


        //////////////////////////////////////
        // BOOKFLOW PAGES - OLD DATA LAYER
        //////////////////////////////////////

        // regex test for bookflow, excluding search and confirmation page
        if (bookflowRegexCheck.test(document.location.pathname) === true ||
          paymentRegexCheck.test(document.location.pathname) === true) {

          if (searchRegexCheck.test(document.location.pathname) === false &&
            confirmationRegexCheck.test(document.location.pathname) === false) {

            debugLogging('old datalayer: bookflow product string rule met')

            // get the WhereTo array
            if (typeof tui.analytics.page.CRHotel === 'undefined' || tui.analytics.page.CRHotel === 'null') {
              var destinationIdArray = getWhereTo()
            }
            // get the WhereTo array, if it has a cruise hotel
            if (typeof tui.analytics.page.CRHotel !== 'undefined' && tui.analytics.page.CRHotel !== 'null') {
              var destinationIdArray = getWhereTo().concat(getCruiseHotel())
            }

            // loop through the array
            var arrayLeng = destinationIdArray.length;
            for (var i = 0; i < arrayLeng; i++) {

              // add a comma to seperate each product
              if (product_string_old != '') {
                product_string_old += ','
              }

              product_string_old +=
                /*category*/
                /*id*/
                ';' + destinationIdArray[i].product
                /*quantity*/
                +
                ';'
                /*total price*/
                +
                ';'
                /*events*/
                +
                ';'
                /*evars*/
                +
                ';' + 'eVar153=' + destinationIdArray[i].type

            }
            debugLogging('product_string_old: ' + product_string_old)
          }
        }


        //////////////////////////////////////
        // CONFIRMATION PAGE - OLD DATA LAYER
        //////////////////////////////////////

        if (confirmationRegexCheck.test(document.location.pathname) &&
          typeof tui.analytics.page.Tracsref != 'undefined' &&
          tui.analytics.page.pageUid != 'lockYourPriceConfirmationpage_react' //added as per LYP
        ) {

          debugLogging('old datalayer: confirmation product string rule met')

          // get the WhereTo array
          if (typeof tui.analytics.page.CRHotel === 'undefined' || tui.analytics.page.CRHotel === 'null') {
            var destinationIdArray = getWhereTo()
          }
          // get the WhereTo array, if it has a cruise hotel
          if (typeof tui.analytics.page.CRHotel !== 'undefined' && tui.analytics.page.CRHotel !== 'null') {
            var destinationIdArray = getWhereTo().concat(getCruiseHotel())
          }

          // add main product
          product_string_old +=
            /*category*/
            /*id*/
            ';' + destinationIdArray[0].product
            /*quantity*/
            +
            ';' + '1'
            /*total price*/
            +
            ';' + (tui.analytics.page && tui.analytics.page.bookingLevelCreditNoteDiscount && tui.analytics.page.bookingLevelCreditNoteDiscount != 'null' ? parseFloat(tui.analytics.page.Sum) + parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount) : tui.analytics.page.Sum) // Credit note change - added credit note value back on
            /*events*/
            +
            ';' + getLegacyMerchEvents()
            /*evars*/
            +
            ';' + 'eVar153=' + destinationIdArray[0].type

          // loop through the array to add the remaining products
          var arrayLeng = destinationIdArray.length;
          for (var i = 1; i < arrayLeng; i++) {

            // add a comma to seperate each product
            if (product_string_old != '') {
              product_string_old += ','
            }

            product_string_old +=
              /*category*/
              /*id*/
              ';' + destinationIdArray[i].product
              /*quantity*/
              +
              ';' + '1'
              /*total price*/
              +
              ';'
              /*events*/
              +
              ';'
              /*evars*/
              +
              ';' + 'eVar153=' + destinationIdArray[i].type
          }
          debugLogging('product_string_old: ' + product_string_old)
        }
      }


      // return correct product string to Ensighten


      if (product_string) {
        return product_string
      } else if (product_string_old) {
        return product_string_old
      }


    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["adobeProductStringLYP"] = (function anon() {
      /////////////////////////////////////////////////
      // ADOBE ANALYTICS - PRODUCT STRING DATA ELEMENT
      /////////////////////////////////////////////////

      // enables console logging if the environment is hybrisdev
      debugLogging = function(msg) {
        if (Bootstrapper.ensightenOptions.publishPath === 'hybrisdev' || Bootstrapper.ensightenOptions.publishPath === 'paymentpagedev' || Bootstrapper.ensightenOptions.publishPath === 'hybrisprod' || Bootstrapper.ensightenOptions.publishPath === 'paymentpage')
          console.log('DEBUG - ' + msg)
      }


      // create inital product_string object
      product_string = ''
      product_string_old = ''

      //////////////////////////////////////
      // SEARCH PAGE - NEW DATA LAYER
      //////////////////////////////////////

      if (typeof dataLayer != 'undefined') {
        if (typeof dataLayer[0] != 'undefined') {
          if (dataLayer[0].page) {

            if (dataLayer[0].page.pageSubCategory === 'Search Results') {

              debugLogging('new datalayer: search page product string rule met')

              // split destination ids into an arrays
              var destinationIdArray = dataLayer[0].page.search.destinationId.split('|')

              // loop through the array
              var arrayLeng = destinationIdArray.length;
              for (var i = 0; i < arrayLeng; i++) {

                // add a comma to seperate each product
                if (product_string != '') {
                  product_string += ','
                }

                product_string +=
                  /*category*/
                  /*id*/
                  ';' + destinationIdArray[i]
                  /*quantity*/
                  +
                  ';'
                  /*total price*/
                  +
                  ';'
                  /*events*/
                  +
                  ';'
                  /*evars*/
                  +
                  // Changed from searchType to siteSection
                  ';' + 'eVar153=' + dataLayer[0].page.siteSection

              }
              debugLogging('product_string: ' + product_string)
            }


            //////////////////////////////////////
            // UNIT DETAILS PAGE - NEW DATA LAYER
            //////////////////////////////////////

            if (dataLayer[0].page.pageSubCategory === 'Unit Details') {

              debugLogging('new datalayer: unit details page product string rule met')

              product_string +=
                /*category*/
                /*id*/
                ';' + dataLayer[0].product.productID
                /*quantity*/
                +
                ';'
                /*total price*/
                +
                ';'
                /*events*/
                +
                ';'
                /*evars*/
                +
                ';' + 'eVar153=' + dataLayer[0].product.productType

              debugLogging('product_string: ' + product_string)
            }


            //////////////////////////////////////
            // BOOKFLOW PAGES - NEW DATA LAYER
            //////////////////////////////////////

            if (dataLayer[0].page.pageSubCategory === 'Room Options' ||
              dataLayer[0].page.pageSubCategory === 'Flight Options' ||
              dataLayer[0].page.pageSubCategory === 'Extra Options' ||
              dataLayer[0].page.pageSubCategory === 'Summary' ||
              dataLayer[0].page.pageSubCategory === 'Passenger Details' ||
              dataLayer[0].page.pageSubCategory === 'Payment' ||
              dataLayer[0].page.pageSubCategory === 'Payment Details' ||
              dataLayer[0].page.pageSubCategory === 'Customise Holiday' ||
              dataLayer[0].page.pageID === 'lockYourPriceConfirmationpage_react') { //Added for LYP

              debugLogging('new datalayer: bookflow product string rule met')

              // add bookflow object as part of LYP
              var bookflowPage = (dataLayer[0].page.pageID === 'lockYourPriceConfirmationpage_react' ? dataLayer[0].transactions : dataLayer[0].basket)
              // add main product first
              product_string +=
                /*category*/
                /*id*/
                ';' + bookflowPage.items.productID
                /*quantity*/
                +
                ';'
                /*total price*/
                +
                ';'
                /*events*/
                +
                ';'
                /*evars*/
                + //added check for productType
                ((typeof bookflowPage.items.productType !== 'undefined') ? (';' + 'eVar153=' + bookflowPage.items.productType) : '')

              // loop through the ancilliary items array
              var arrayLeng = bookflowPage.items.subItems.length;
              for (var i = 0; i < arrayLeng; i++) {

                // add a comma to seperate each ancilliary product
                if (product_string != '') {
                  product_string += ','
                }

                // function to get recommended merch evars
                function getRecommendedMerchEvars() {

                  return ((bookflowPage.items.subItems[i].isRecommendedItem) ? ('|' + 'eVar205=' + bookflowPage.items.subItems[i].isRecommendedItem) : '')

                }

                // add the ancilliaries to the product string
                product_string +=
                  /*category*/
                  /*id*/
                  ';' + bookflowPage.items.subItems[i].productID
                  /*quantity*/
                  +
                  ';'
                  /*total price*/
                  +
                  ';'
                  /*events*/
                  +
                  ';'
                  /*evars*/
                  +
                  ';' + 'eVar153=' + bookflowPage.items.productType +
                  getRecommendedMerchEvars()
              }
              debugLogging('product_string: ' + product_string)
            }


            //////////////////////////////////////
            // CONFIRMATION PAGE - NEW DATA LAYER
            //////////////////////////////////////

            if (dataLayer[0].page.pageSubCategory === 'Confirmation' && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.transactionId && typeof dataLayer[0].transactions.items !== 'undefined' && dataLayer[0].page.pageID != 'lockYourPriceConfirmationpage_react') { //Added for LYP

              debugLogging('new datalayer: confirmation page product string rule met');

              // function to remove booking level discount (i.e. voucher code discounts) from the main product revenue, if applicable. Added backup reference to old data layer due to defect with bookingLevelPromoDiscount
              function getMainProductRevenue() {
                try {
                  // New data layer, promo code array
                  if (dataLayer[0].transactions.total.bookingLevelPromoCodes != 'undefined' && dataLayer[0].transactions.total.bookingLevelPromoCodes.length > 0) {
                    var promoCodeArray = dataLayer[0].transactions.total.bookingLevelPromoCodes;
                    var promoTotalValue = 0;
                    for (i = 0; i < promoCodeArray.length; i++) {
                      promoTotalValue = promoTotalValue + promoCodeArray[i].bookingLevelPromoDiscount;
                    }
                    return dataLayer[0].transactions.items.price.currentPrice - Math.abs(promoTotalValue);
                  }
                  // New data layer, pre-release location of promo code
                  else if (typeof dataLayer[0].transactions.total.bookingLevelPromoDiscount !== 'undefined') {
                    return dataLayer[0].transactions.items.price.currentPrice - Math.abs(dataLayer[0].transactions.total.bookingLevelPromoDiscount);
                  }
                  // New data layer, old data layer for promo code
                  else if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
                    return dataLayer[0].transactions.items.price.currentPrice - parseFloat(tui.analytics.page.PromoValue); // Credit note change - changed parseInt to parseFloat
                  }
                  // New data layer, no promo code present
                  else if (dataLayer[0].transactions.items && dataLayer[0].transactions.items.price) {
                    return dataLayer[0].transactions.items.price.currentPrice;
                  } else {
                    return '';
                  }
                } catch (err) {
                  return '';
                }
              }

              // function to get discount code - had to add checks for dataLayer presence due to FO defect
              function getPromoDiscount() {
                try {
                  var dl = window.dataLayer;
                  var discountString = '';
                  if (dl && dl[0] && dl[0].transactions && dl[0].transactions.total) {
                    if (dl[0].transactions.total.bookingLevelPromoCodes && dl[0].transactions.total.bookingLevelPromoCodes.length > 0) {
                      var promoCodeArray = dl[0].transactions.total.bookingLevelPromoCodes;
                      for (i = 0; i < promoCodeArray.length; i++) {
                        if (/CVHRC/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                          discountString += '|event158=' + promoCodeArray[i].bookingLevelPromoDiscount;
                        } else if (/CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                          discountString += '|event159=' + promoCodeArray[i].bookingLevelPromoDiscount;
                        } else {
                          discountString += '|event154=' + promoCodeArray[i].bookingLevelPromoDiscount;
                        }
                      }
                    }
                    // If old object is shown - can be removed at a later date
                    else if (dl[0].transactions.total.bookingLevelPromoDiscount && typeof dl[0].transactions.total.bookingLevelPromoDiscount !== 'undefined') {
                      // Programme Change Incentive
                      if (/CVRHC/i.test(dl[0].transactions.total.bookingLevelPromoCode)) {
                        discountString += '|event158=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount);
                      } else if (/CVRI|CVRM|CVRV/i.test(dl[0].transactions.total.bookingLevelPromoCode)) {
                        discountString += '|event159=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount);
                      } else {
                        return '|event154=' + Math.abs(dl[0].transactions.total.bookingLevelPromoDiscount); // convert it to positive if its ever negative
                      }
                    }
                  }
                  // For legacy data layer
                  else if (window.tui && tui.analytics && tui.analytics.page) {
                    if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
                      if (/CVRHC/i.test(tui.analytics.page.PromoCode)) {
                        discountString += '|event158=' + parseFloat(tui.analytics.page.PromoValue);
                      } else if (/CVRI|CVRM|CVRV/i.test(tui.analytics.page.PromoCode)) {
                        discountString += '|event159=' + parseFloat(tui.analytics.page.PromoValue);
                      } else {
                        discountString += '|event154=' + parseFloat(tui.analytics.page.PromoValue);
                      }
                    }
                  }
                  return discountString;
                } catch (err) {
                  return '';
                }
              }
              // add main product first
              product_string +=
                /*category*/
                /*id*/
                ';' + dataLayer[0].transactions.items.productID
                /*quantity*/
                +
                ';' + dataLayer[0].transactions.items.quantity.quantity
                /*total price*/
                +
                ';' + getMainProductRevenue()
                /*events*/
                +
                ';' + 'event150=' + (dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount && dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount > 0 ? dataLayer[0].transactions.total.totalPrice + dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount : dataLayer[0].transactions.total.totalPrice) + '|' + // Credit note change - Adding credit note value back on if present
                'event151=' + dataLayer[0].transactions.total.discount + '|' +
                'event152=' + dataLayer[0].transactions.items.quantity.pax + '|' +
                'event153=' + dataLayer[0].transactions.items.quantity.pax + getPromoDiscount()

                /*evars*/
                + //Added a check for product type
                ((typeof dataLayer[0].transactions.items.productType !== 'undefined') ? (';' + 'eVar153=' + dataLayer[0].transactions.items.productType) : '')


              // loop through the ancilliary items array
              var arrayLeng = dataLayer[0].transactions.items.subItems.length;
              for (var i = 0; i < arrayLeng; i++) {

                // add a comma to seperate each ancilliary product
                if (product_string != '') {
                  product_string += ','
                }

                // function to get recommended merch evars
                function getRecommendedMerchEvars() {

                  return ((dataLayer[0].transactions.items.subItems[i].isRecommendedItem) ? ('|' + 'eVar205=' + dataLayer[0].transactions.items.subItems[i].isRecommendedItem) : '')
                }

                // add the ancilliaries to the product string
                product_string +=
                  /*category*/
                  /*id*/
                  ';' + dataLayer[0].transactions.items.subItems[i].productID
                  /*quantity*/
                  +
                  ';' + dataLayer[0].transactions.items.subItems[i].quantity.quantity
                  /*total price*/
                  +
                  ';' + ((dataLayer[0].transactions.items.subItems[i] && dataLayer[0].transactions.items.subItems[i].price && dataLayer[0].transactions.items.subItems[i].price.currentPrice) ? (dataLayer[0].transactions.items.subItems[i].price.currentPrice) : 0)
                  /*events*/
                  +
                  ';' + 'event152=' + dataLayer[0].transactions.items.subItems[i].quantity.pax
                  /*evars*/
                  +
                  ';' + 'eVar153=' + dataLayer[0].transactions.items.productType +
                  getRecommendedMerchEvars();

              }
              debugLogging('product_string: ' + product_string)
            }

          }
        }
      }

      /////////////////////////////////////////////
      // OLD DATA LAYER HANDLER FOR WHERETO VALUES
      /////////////////////////////////////////////

      if (window.tui && tui.analytics) {

        // functiom to get the right WhereTo values and type
        function getWhereTo() {

          // create some separators
          var separators = ['-', '\\|'];

          try {

            // WhereTo for Beach holidays, which don't have a '-' and aren't on the multicentre or flight page urls
            if (typeof tui.analytics.page.WhereTo !== 'undefined' &&
              tui.analytics.page.WhereTo !== 'null' &&
              tui.analytics.page.WhereTo.indexOf('-') === -1 &&
              document.location.pathname.indexOf('/multi-centre/') === -1 &&
              document.location.pathname.indexOf('/flight/') === -1) {
              var products_array = []
              var products = tui.analytics.page.WhereTo.split(new RegExp(separators.join('|'), 'g'))
              for (var i = 0; i < products.length; i++) {
                products_array.push({
                  product: products[i],
                  type: 'Beach'
                });
              }
              return products_array;
            }

            // WhereTo for Flight-only holidays, which are on flight page urls
            if (typeof tui.analytics.page.WhereTo !== 'undefined' &&
              tui.analytics.page.WhereTo !== 'null' &&
              document.location.pathname.indexOf('/flight/') != -1) {
              var products_array = []
              var products = tui.analytics.page.WhereTo.split(new RegExp(separators.join('|'), 'g'))
              for (var i = 0; i < products.length; i++) {
                products_array.push({
                  product: products[i],
                  type: 'Flight-Only'
                });
              }
              return products_array;
            }

            // WhereTo for multicentre search page, which are on multicentre urls but don't have a '-' in the WhereTo
            if (typeof tui.analytics.page.WhereTo !== 'undefined' &&
              tui.analytics.page.WhereTo !== 'null' &&
              document.location.pathname.indexOf('/multi-centre/') != -1 &&
              tui.analytics.page.WhereTo.indexOf('-') === -1) {
              var products_array = []
              var products = tui.analytics.page.WhereTo.split(new RegExp(separators.join('|'), 'g'))
              for (var i = 0; i < products.length; i++) {
                products_array.push({
                  product: products[i],
                  type: 'Multicentre'
                });
              }
              return products_array;
            }

            // WhereTo for multicentres with ONE L-epic code, which are on multicentre URLs or have a '-' in the WhereTo
            if (typeof tui.analytics.page.WhereTo !== 'undefined' && tui.analytics.page.WhereTo !== 'null') {
              if (document.location.pathname.indexOf('/multi-centre/') || tui.analytics.page.WhereTo.indexOf('-') != -1) {
                if (tui.analytics.page.WhereTo.match(/L/g).length === 1) {
                  var products_array = []
                  var products = tui.analytics.page.WhereTo.split(new RegExp(separators.join('|'), 'g'))
                  for (var i = 0; i < products.length; i++) {
                    products_array.push({
                      product: products[i],
                      type: 'Multicentre'
                    });
                  }
                  return products_array;
                }
              }
            }

            // WhereTo for multicentres with TWO L-epic codes, which are on multicentre URLs or have a '-' in the WhereTo
            if (typeof tui.analytics.page.WhereTo !== 'undefined' && tui.analytics.page.WhereTo !== 'null') {
              if (document.location.pathname.indexOf('/multi-centre/') || tui.analytics.page.WhereTo.indexOf('-') != -1) {
                if (tui.analytics.page.WhereTo.match(/L/g).length === 2) {
                  var products_array = []
                  var products = tui.analytics.page.WhereTo.replace('-', '?').split(new RegExp(separators.join('|'), 'g'))
                  for (var i = 0; i < products.length; i++) {
                    products_array.push({
                      product: products[i].replace('?', '-'),
                      type: 'Multicentre'
                    });
                  }
                  return products_array;
                }
              }
            }

            // WhereTo for cruises, which are in a separate 'CRWhereTo' variable
            if (typeof tui.analytics.page.CRWhereTo !== 'undefined' && tui.analytics.page.CRWhereTo !== 'null') {
              var products_array = []
              var products = tui.analytics.page.CRWhereTo.split(new RegExp(separators.join('|'), 'g'))
              for (var i = 0; i < products.length; i++) {
                products_array.push({
                  product: products[i],
                  type: 'Cruise'
                });
              }
              return products_array;
            } else {
              return ''
            }

          } catch (err) {
            return '';
          }
        }

        // function to get discount values
        function getDiscount() {
          try {
            if (typeof tui.analytics.page.Disc !== 'undefined') {
              return 'event151=' + tui.analytics.page.Disc
            } else {
              return ''
            }
          } catch (err) {
            return '';
          }
        }

        // function to get the promo discount value
        function getLegacyPromoDiscount() {
          try {
            if (window.tui && tui.analytics && tui.analytics.page) {
              var legacyPromoDiscount = '';
              if (typeof tui.analytics.page.PromoValue !== 'undefined' && tui.analytics.page.PromoValue !== 'null') {
                if (/CVRHC/i.test(tui.analytics.page.PromoCode)) {
                  legacyPromoDiscount += '|event158=' + parseFloat(tui.analytics.page.PromoValue);
                } else if (/CVRI|CVRM|CVRV/i.test(tui.analytics.page.PromoCode)) {
                  legacyPromoDiscount += '|event159=' + parseFloat(tui.analytics.page.PromoValue);
                } else {
                  legacyPromoDiscount += '|event154=' + parseFloat(tui.analytics.page.PromoValue);
                }
              }
              return legacyPromoDiscount
            }
          } catch (err) {
            return '';
          }
        }

        // function to get cruise hotels
        function getCruiseHotel() {
          try {
            if (typeof tui.analytics.page.CRHotel !== 'undefined' && tui.analytics.page.CRHotel !== 'null') {
              var products_array = []
              products_array.push({
                product: tui.analytics.page.CRHotel,
                type: 'Cruise'
              });
              return products_array

            } else {
              return ''
            }
          } catch (err) {
            return '';
          }
        }

        /*
          // function to get multicentre hotels
          function getMulticentreHotel() {
            try {
              if (typeof typeof(tui.analytics.page.WhereTo) !== 'undefined' && tui.analytics.page.WhereTo.indexOf('-') !== -1) {
                return 'evarMulticentreHotel=' + tui.analytics.page.WhereTo.substr(tui.analytics.page.WhereTo.indexOf('H'), tui.analytics.page.WhereTo.length - tui.analytics.page.WhereTo.indexOf('H'))
              } else {
                return ''
              }
            } catch (err) {
              return '';
            }
          }
        */
        // function to get legacy merch events and filter out any that are blank or empty strings
        function getLegacyMerchEvents() {
          legacyMerchEvents = ['event150=' + (tui.analytics.page && tui.analytics.page.bookingLevelCreditNoteDiscount && tui.analytics.page.bookingLevelCreditNoteDiscount != 'null' ? parseFloat(tui.analytics.page.Sum) + parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount) : tui.analytics.page.Sum), getDiscount(), 'event152=' + tui.analytics.page.Pax, 'event153=' + tui.analytics.page.Pax + getLegacyPromoDiscount()].filter(Boolean).join('|')
          return legacyMerchEvents
        }

        /*
          // function to get legacy merch evars and filter out any that are blank or empty strings
          function getLegacyMerchEvars() {
                legacyMerchEvars = [getCruiseHotel(), getMulticentreHotel()].filter(Boolean).join('|')
                return legacyMerchEvars
          }
        */

        // set up regex rules for pages
        var searchRegexCheck = new RegExp('^(\/(retail\/)?(retail|destinations(\/multi-centre)?|cruise|river-cruises|flight|holiday|f)\/(packages?|search)\/?)$') // this currently fires on the search pages itself but returns no products
        var bookflowRegexCheck = new RegExp('^(\/(retail\/)?(retail|holiday|f|flight|cruise|river-cruises|destinations|destinations\/multi-centre)\/?)')
        //var confirmationRegexCheck = new RegExp('^(\/(holiday|f|flight|cruise|river-cruises|destinations|destinations\/multi-centre|holiday\/multi-centre)\/book\/(mobile\/confirmation|confirmation)\/?)$') //changed for LYP (MMB confirmation)
        var confirmationRegexCheck = new RegExp('^(\/(retail\/)?(retail|holiday|f|flight|cruise|river-cruises|destinations|destinations\/multi-centre|holiday\/multi-centre|destinations\/your-account)\/(book|managemybooking)\/(mobile\/confirmation|confirmation|bookingConfirmation|paymentconfirmation)\/?)$')
        var paymentRegexCheck = new RegExp('^(\/cps\/pageRender\/?)')

        //////////////////////////////////////
        // SEARCH PAGE - OLD DATA LAYER
        //////////////////////////////////////

        // regex test for search page
        if (searchRegexCheck.test(document.location.pathname)) {

          debugLogging('old datalayer: search page product string rule met')

          // get all WhereTos and hotels
          var destinationIdArray = getWhereTo()

          // loop through the array
          var arrayLeng = destinationIdArray.length;
          for (var i = 0; i < arrayLeng; i++) {

            // add a comma to seperate each product
            if (product_string_old != '') {
              product_string_old += ','
            }

            product_string_old +=
              /*category*/
              /*id*/
              ';' + destinationIdArray[i].product
              /*quantity*/
              +
              ';'
              /*total price*/
              +
              ';'
              /*events*/
              +
              ';'
              /*evars*/
              +
              'eVar153=' + destinationIdArray[i].type
          }
          debugLogging('product_string_old: ' + product_string_old)
        }


        //////////////////////////////////////
        // UNIT DETAILS PAGE - OLD DATA LAYER
        //////////////////////////////////////

        // not required, can be covered by bookflow rule as the data layer objects are the same


        //////////////////////////////////////
        // BOOKFLOW PAGES - OLD DATA LAYER
        //////////////////////////////////////

        // regex test for bookflow, excluding search and confirmation page
        if (bookflowRegexCheck.test(document.location.pathname) === true ||
          paymentRegexCheck.test(document.location.pathname) === true) {

          if (searchRegexCheck.test(document.location.pathname) === false &&
            confirmationRegexCheck.test(document.location.pathname) === false) {

            debugLogging('old datalayer: bookflow product string rule met')

            // get the WhereTo array
            if (typeof tui.analytics.page.CRHotel === 'undefined' || tui.analytics.page.CRHotel === 'null') {
              var destinationIdArray = getWhereTo()
            }
            // get the WhereTo array, if it has a cruise hotel
            if (typeof tui.analytics.page.CRHotel !== 'undefined' && tui.analytics.page.CRHotel !== 'null') {
              var destinationIdArray = getWhereTo().concat(getCruiseHotel())
            }

            // loop through the array
            var arrayLeng = destinationIdArray.length;
            for (var i = 0; i < arrayLeng; i++) {

              // add a comma to seperate each product
              if (product_string_old != '') {
                product_string_old += ','
              }

              product_string_old +=
                /*category*/
                /*id*/
                ';' + destinationIdArray[i].product
                /*quantity*/
                +
                ';'
                /*total price*/
                +
                ';'
                /*events*/
                +
                ';'
                /*evars*/
                +
                ';' + 'eVar153=' + destinationIdArray[i].type

            }
            debugLogging('product_string_old: ' + product_string_old)
          }
        }


        //////////////////////////////////////
        // CONFIRMATION PAGE - OLD DATA LAYER
        //////////////////////////////////////

        if (confirmationRegexCheck.test(document.location.pathname) &&
          typeof tui.analytics.page.Tracsref != 'undefined' &&
          tui.analytics.page.pageUid != 'lockYourPriceConfirmationpage_react' //added as per LYP
        ) {

          debugLogging('old datalayer: confirmation product string rule met')

          // get the WhereTo array
          if (typeof tui.analytics.page.CRHotel === 'undefined' || tui.analytics.page.CRHotel === 'null') {
            var destinationIdArray = getWhereTo()
          }
          // get the WhereTo array, if it has a cruise hotel
          if (typeof tui.analytics.page.CRHotel !== 'undefined' && tui.analytics.page.CRHotel !== 'null') {
            var destinationIdArray = getWhereTo().concat(getCruiseHotel())
          }

          // add main product
          product_string_old +=
            /*category*/
            /*id*/
            ';' + destinationIdArray[0].product
            /*quantity*/
            +
            ';' + '1'
            /*total price*/
            +
            ';' + (tui.analytics.page && tui.analytics.page.bookingLevelCreditNoteDiscount && tui.analytics.page.bookingLevelCreditNoteDiscount != 'null' ? parseFloat(tui.analytics.page.Sum) + parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount) : tui.analytics.page.Sum) // Credit note change - added credit note value back on
            /*events*/
            +
            ';' + getLegacyMerchEvents()
            /*evars*/
            +
            ';' + 'eVar153=' + destinationIdArray[0].type

          // loop through the array to add the remaining products
          var arrayLeng = destinationIdArray.length;
          for (var i = 1; i < arrayLeng; i++) {

            // add a comma to seperate each product
            if (product_string_old != '') {
              product_string_old += ','
            }

            product_string_old +=
              /*category*/
              /*id*/
              ';' + destinationIdArray[i].product
              /*quantity*/
              +
              ';' + '1'
              /*total price*/
              +
              ';'
              /*events*/
              +
              ';'
              /*evars*/
              +
              ';' + 'eVar153=' + destinationIdArray[i].type
          }
          debugLogging('product_string_old: ' + product_string_old)
        }
      }


      // return correct product string to Ensighten


      if (product_string) {
        return product_string
      } else if (product_string_old) {
        return product_string_old
      }


    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["adobeReportSuite"] = (function() {
      try {
        if (/^(hybrisdev|paymentpagedev)$/i.test(Bootstrapper.ensightenOptions.publishPath) || /^(prjuat|staging|st[0-9]|hybd[0-9]|admin|prdsupport|localhost|webcache|cloud|rategain|absolutesurveyors|anite|cms|qa|ceros)$/i.test(window.location.host)) {

          if (navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit(.*CriOS).*/) ||
            navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit(.*FxiOS).*/) ||
            navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit(.*Mercury).*/) ||
            navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit(.*Version).*/)
          ) {
            return "tuiukdev";
          } else if (navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit.*/) ||
            navigator.userAgent.match(/.*(Android).*AppleWebKit(.*Version).*/)
          ) {
            return "tuiukapppdev,tuiukdev";
          } else {
            return "tuiukdev";
          }
        } else if (/^(hybrisprod|paymentpage|prod)$/i.test(Bootstrapper.ensightenOptions.publishPath)) {

          if (navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit(.*CriOS).*/) ||
            navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit(.*FxiOS).*/) ||
            navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit(.*Mercury).*/) ||
            navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit(.*Version).*/)
          ) {
            return "tuiukprod";
          } else if (navigator.userAgent.match(/.*(iPhone|iPod|iPad).*AppleWebKit.*/) ||
            navigator.userAgent.match(/.*(Android).*AppleWebKit(.*Version).*/)
          ) {
            return "tuiukappprod,tuiukprod";
          } else {
            return "tuiukprod";
          }

        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["agentID"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.AgentID) {
          return tui.analytics.page.AgentID;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["airportExtras"] = (function() {
      try {
        return window.tui.analytics.page.HXAnc;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["alternativeFlightOptions"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.AltFlt) {
          return tui.analytics.page.AltFlt;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["appVisitor"] = (function() {
      try {
        var paramArray = [];
        if (s.Util.getQueryParam('utm_medium') === "TDA" || s.Util.getQueryParam('utm_medium') === "ios-tui_uk" || s.Util.getQueryParam('utm_medium') === "ios-myfirstchoice_uk" || s.Util.getQueryParam('utm_medium') === "android-tui_uk" || s.Util.getQueryParam('utm_medium') === "android-myfirstchoice_uk") {
          paramArray.push(s.Util.getQueryParam('utm_source'));
          paramArray.push(s.Util.getQueryParam('utm_campaign'));

          if (s.Util.getQueryParam('utm_content')) {
            paramArray.push(s.Util.getQueryParam('utm_content'));
          } else if (s.Util.getQueryParam('utm_term')) {
            paramArray.push('No content set');
          }

          if (s.Util.getQueryParam('utm_term')) {
            paramArray.push(s.Util.getQueryParam("utm_term"));
          }

          return 'Native App Visitor' + '|' + paramArray.join('|');

        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["arrivalAirportCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.arrivalAirportCode) {
          return dataLayer[0].transactions.items.arrivalAirportCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.arrivalAirportCode) {
          return dataLayer[0].basket.items.arrivalAirportCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.arrivalAirportCode) {
          return dataLayer[0].product.arrivalAirportCode;
        } else if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.flightViewData != null && jsonData.packageViewData.flightViewData[0] && jsonData.packageViewData.flightViewData[0].outboundSectors != null && jsonData.packageViewData.flightViewData[0].outboundSectors[0] && jsonData.packageViewData.flightViewData[0].outboundSectors[0].arrivalAirport.code) {
          return jsonData.packageViewData.flightViewData[0].outboundSectors[0].arrivalAirport.code;
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["arrivalAirportName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.arrivalAirportName) {
          return dataLayer[0].transactions.items.arrivalAirportName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.arrivalAirportName) {
          return dataLayer[0].basket.items.arrivalAirportName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.arrivalAirportName) {
          return dataLayer[0].product.arrivalAirportName;
        } else if (window.jsonData && jsonData.package && jsonData.packageViewData && jsonData.packageViewData.flightViewData[0] && jsonData.packageViewData.flightViewData[0].outboundSectors[0] && jsonData.packageViewData.flightViewData[0].outboundSectors[0].arrivalAirport.name) {
          return jsonData.packageViewData.flightViewData[0].outboundSectors[0].arrivalAirport.name;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["boardBasisCode"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Board) {
          return tui.analytics.page.Board.trim();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.boardBasisCode) {
          return dataLayer[0].transactions.items.boardBasisCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.boardBasisCode) {
          return dataLayer[0].basket.items.boardBasisCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.boardBasisCode) {
          return dataLayer[0].product.boardBasisCode;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["boardBasisName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.boardBasisName) {
          return dataLayer[0].transactions.items.boardBasisName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.boardBasisName) {
          return dataLayer[0].basket.items.boardBasisName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.boardBasisName) {
          return dataLayer[0].product.boardBasisName;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["bookingDate YYYY-MM-DD"] = (function() {
      try {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0
        var yyyy = today.getFullYear();

        if (dd < 10) {
          dd = '0' + dd;
        }

        if (mm < 10) {
          mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        return today;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["bookingOrMmbIncentiveCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0]) {

          if (dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCodes && dataLayer[0].transactions.total.bookingLevelPromoCodes.length > 0) {
            var promoCodeArray = dataLayer[0].transactions.total.bookingLevelPromoCodes;
            for (i = 0; i < promoCodeArray.length; i++) {
              if (/CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                return promoCodeArray[i].bookingLevelPromoCode;
              }
            }
          } else if (dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCode && typeof dataLayer[0].transactions.total.bookingLevelPromoCode !== 'undefined') {
            if (/CVRI|CVRM|CVRV/i.test(dataLayer[0].transactions.total.bookingLevelPromoCode)) {
              return dataLayer[0].transactions.total.bookingLevelPromoCode;
            }
          } else if (dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelPromoCodes && dataLayer[0].basket.price.bookingLevelPromoCodes.length > 0) {
            var promoCodeArray = dataLayer[0].basket.price.bookingLevelPromoCodes;
            for (i = 0; i < promoCodeArray.length; i++) {
              if (/CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                return promoCodeArray[i].bookingLevelPromoCode;
              }
            }
          } else if (dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelPromoCode && typeof dataLayer[0].basket.price.bookingLevelPromoCode !== 'undefined') {
            if (/CVRI|CVRM|CVRV/i.test(dataLayer[0].basket.price.bookingLevelPromoCode)) {
              return dataLayer[0].basket.price.bookingLevelPromoCode;
            }
          }
        } else if (window.tui && tui.analytics && tui.analytics.page) {
          if (typeof tui.analytics.page.PromoCode !== 'undefined' && tui.analytics.page.PromoCode !== 'null') {
            if (/CVRI|CVRM|CVRV/i.test(tui.analytics.page.PromoCode)) {
              return tui.analytics.page.PromoCode;
            }
          }
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["bookingReference"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Tracsref) {
          return tui.analytics.page.Tracsref;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.transactionId) {
          return dataLayer[0].transactions.total.transactionId;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["bookingReferenceMoney4Travel"] = (function() {
      try {
        var element = document.querySelector(".overall-summary p:nth-child(4)");
        return element ? element.textContent : "";
      } catch (e) {
        return ''
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["brand"] = (function() {
      try {
        if ((document.location.host.indexOf('tuiretailagents.thomson.co.uk') != -1) || (document.location.host.indexOf('tuiretailagents.thomsonprjuat.co.uk') != -1)) {
          return "tui retail third party";
        } else if ((document.location.host.indexOf('retailagents.tui.co.uk') != -1) || (document.location.host.indexOf('retailagents.tuiprjuat.co.uk') != -1)) {
          return "tui retail third party";
        } else if ((document.location.host.indexOf('falconretailagents.falconholidays.ie') != -1) || (document.location.host.indexOf('falconretailagents.falconholidaysprjuat.ie') != -1)) {
          return "tui ie retail third party";
        } else if ((document.location.host.indexOf('retailagents.tuiholidays.ie') != -1) || (document.location.host.indexOf('retailagents.tuiholidaysprjuat.ie') != -1)) {
          return "tui ie retail third party";
        } else if ((document.location.host.indexOf('thomson.co.uk') != -1) || (document.location.host.indexOf('thomsonprjuat.co.uk') != -1)) {
          return "thomson";
        } else if ((document.location.host.indexOf('firstchoice.co.uk') != -1) || (document.location.host.indexOf('firstchoiceprjuat.co.uk') != -1)) {
          return "firstchoice";
        } else if ((document.location.host.indexOf('firstchoice.inbro.net') != -1) || (document.location.host.indexOf('firstchoiceprjuat.inbro.net') != -1)) {
          return "firstchoice";
        } else if ((document.location.host.indexOf('falconholidays.ie') != -1) || (document.location.host.indexOf('falconholidaysprjuat.ie') != -1)) {
          return "falconholidays";
        } else if ((document.location.host.indexOf('tui.co.uk') != -1) || (document.location.host.indexOf('tuiprjuat.co.uk') != -1)) {
          return "tui";
        } else if ((document.location.host.indexOf('tui.inbro.net') != -1) || (document.location.host.indexOf('tuiprjuat.inbro.net') != -1)) {
          return "tui";
        } else if ((document.location.host.indexOf('tuiholidays.ie') != -1) || (document.location.host.indexOf('tuiholidaysprjuat.ie') != -1)) {
          return "tui ie";
        } else if ((document.location.host.indexOf('tuiretailhish-live.thomsonuk.dnsroot.biz') != -1) || (document.location.hostname.match(/(tuiretailhish\-(st.*|hybd.*)\.thomsonuk\.dnsroot\.biz)/g))) {
          return "tui retail";
        } else if ((document.location.host.indexOf('falconretailhish-live.thomsonuk.dnsroot.biz') != -1) || (document.location.hostname.match(/(falconretailhish\-(st.*|hybd.*)\.thomsonuk\.dnsroot\.biz)/g))) {
          return "tui ie retail";
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["campaign"] = (function() {
      try {
        if (/tuiholidays/.test(document.location.host)) {
          return undefined;
        } else {
          var im_id = Bootstrapper.getQueryParam('im_id');
          if (im_id) {
            im_id = (im_id.toLowerCase() === 'ppc' || im_id.toLowerCase() === 'paidsocial') ? undefined : im_id; // return undefined for PPC and paid social and let autotagging handle setting of campaign
            return im_id;
          } else if (~location.href.toLowerCase().indexOf('cmid=')) {
            return 'email';
          }
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["campaignSource"] = (function() {
      try {
        if (/tuiholidays/.test(document.location.host)) {
          return undefined;
        } else {
          if (Bootstrapper.getQueryParam('im_id')) {
            if (Bootstrapper.getQueryParam('im_id') === 'affiliate') {
              if (~location.href.toLowerCase().indexOf('ia_id=')) {
                return Bootstrapper.getQueryParam('ia_id');
              } else {
                return Bootstrapper.getQueryParam('im_id');
              }
            } else if (~location.href.toLowerCase().indexOf('if_id=')) {
              return Bootstrapper.getQueryParam('if_id');
            } else if (Bootstrapper.getQueryParam('im_id') && Bootstrapper.getQueryParam('im_id') != 'affiliate') {
              var im_id = Bootstrapper.getQueryParam('im_id');
              im_id = (im_id.toLowerCase() === 'ppc' || im_id.toLowerCase() === 'paidsocial') ? undefined : im_id; // Let autotagging or utms handle ppc and paid social so returning undefined
              return im_id;
            } else if (document.referrer) {
              var parts = document.referrer.split('://')[1].split('/'),
                host = parts[0];
              if (~host.indexOf('.google.')) {
                return 'google';
              }
              return host;
            }
          } else if (~location.href.toLowerCase().indexOf('cmid=')) {
            return Bootstrapper.getQueryParam('ito');
          }
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cancelReason"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.cancelReason) {
          return dataLayer[0].transactions.total.cancelReason;
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["carrierCode"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.carrier) {
          return tui.analytics.page.carrier;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.carrierCode) {
          return dataLayer[0].transactions.items.carrierCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.carrierCode) {
          return dataLayer[0].basket.items.carrierCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.carrierCode) {
          return dataLayer[0].product.carrierCode;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["carrierInbound"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.carrier) {
          return tui.analytics.page.carrier.split("|")[1];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.carrierCode) {
          return dataLayer[0].transactions.items.carrierCode.split("|")[1];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.carrierCode) {
          return dataLayer[0].basket.items.carrierCode.split("|")[1];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.carrierCode) {
          return dataLayer[0].product.carrierCode.split("|")[1];
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["carrierOutbound"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.carrier) {
          return tui.analytics.page.carrier.split("|")[0];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.carrierCode) {
          return dataLayer[0].transactions.items.carrierCode.split("|")[0];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.carrierCode) {
          return dataLayer[0].basket.items.carrierCode.split("|")[0];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.carrierCode) {
          return dataLayer[0].product.carrierCode.split("|")[0];
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Channel"] = (function() {
      if (dataLayer[0].pageName === 'Booking Confirmation') {
        return 'Sale Ski';
      } else {
        return dataLayer[0].sectionName || ""
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["childAges"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.ChildAges) {
          return tui.analytics.page.ChildAges;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.childAges) {
          return dataLayer[0].product.childAges;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].search && dataLayer[0].search.childAges) {
          return dataLayer[0].search.childAges;
        } else if (window.jsonData && jsonData.searchRequest && jsonData.searchRequest.childrenAge) {
          return jsonData.searchRequest.childrenAge.toString().replace(/,/g, "|");
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["commercialSortPriority"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CSPScore) {
          return tui.analytics.page.CSPScore;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["commercialValueScore"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CVScore) {
          return tui.analytics.page.CVScore;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["commercialValueScoreType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CVScoreType) {
          return tui.analytics.page.CVScoreType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["componentClicked"] = (function() {
      try {
        return s.Util.cookieRead('s_comp_click');
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["continentCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.continentCode) {
          return dataLayer[0].transactions.items.geo.continentCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.continentCode) {
          return dataLayer[0].basket.items.geo.continentCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.continentCode) {
          return dataLayer[0].product.geo.continentCode;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["continentName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.continentName) {
          return dataLayer[0].transactions.items.geo.continentName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.continentName) {
          return dataLayer[0].basket.items.geo.continentName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.continentName) {
          return dataLayer[0].product.geo.continentName;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cookieLength"] = (function() {
      try {
        var cookieSize = document.cookie.length;
        var cLength = 'unknown';
        if (!isNaN(cookieSize)) {
          if (cookieSize < 500)
            cLength = '< 500';
          else if (cookieSize < 1024)
            cLength = '500b-1k';
          else if (cookieSize < 2048)
            cLength = '1k-2k';
          else if (cookieSize < 4096)
            cLength = '2k-4k';
          else if (cookieSize < 8192)
            cLength = '4k-8k';
          else
            cLength = 'more than 8k';
        }
        return cLength;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["countryCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.countryCode) {
          return dataLayer[0].transactions.items.geo.countryCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.countryCode) {
          return dataLayer[0].basket.items.geo.countryCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.countryCode) {
          return dataLayer[0].product.geo.countryCode;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["countryName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.countryName) {
          return dataLayer[0].transactions.items.geo.countryName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.countryName) {
          return dataLayer[0].basket.items.geo.countryName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.countryName) {
          return dataLayer[0].product.geo.countryName;
        } else if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.accomViewData[0] && jsonData.packageViewData.accomViewData[0].countryName) {
          return jsonData.packageViewData.accomViewData[0].countryName;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["coupon"] = (function() {
      var returnVal = 'none';
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total) {
          if (dataLayer[0].transactions.total.bookingLevelPromoCodes && dataLayer[0].transactions.total.bookingLevelPromoCodes.length > 0) {
            return dataLayer[0].transactions.total.bookingLevelPromoCodes[0].bookingLevelPromoCode;
          } else if (dataLayer[0].transactions.total.bookingLevelPromoCode) {
            return dataLayer[0].transactions.total.bookingLevelPromoCode;
          }
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.PromoCode && tui.analytics.page.PromoCode.toLowerCase() != 'null') {
          return tui.analytics.page.PromoCode;
        } else {
          return returnVal;
        }
      } catch (err) {
        return returnVal;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["creditNoteBooking"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.isCreditNoteBooking && tui.analytics.page.isCreditNoteBooking.toLowerCase() == "yes") {
          return 1;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.isCreditNoteBooking && dataLayer[0].transactions.total.isCreditNoteBooking.toLowerCase() == "yes") {
          return 1;
        } else {
          return "";
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["creditNoteCode"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.bookingLevelCreditNoteCode && tui.analytics.page.bookingLevelCreditNoteCode != 'null') {
          return tui.analytics.page.bookingLevelCreditNoteCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelCreditNoteCode) {
          return dataLayer[0].transactions.total.bookingLevelCreditNoteCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelCreditNoteCode) {
          return dataLayer[0].basket.price.bookingLevelCreditNoteCode;
        }
      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["creditNoteDiscount"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.bookingLevelCreditNoteDiscount && tui.analytics.page.bookingLevelCreditNoteDiscount != 'null') {
          return parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount) {
          return dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelCreditNoteDiscount) {
          return dataLayer[0].basket.price.bookingLevelCreditNoteDiscount;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["creditNoteOriginalBookingID"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.originalTransactionId && tui.analytics.page.originalTransactionId != 'null') {
          return tui.analytics.page.originalTransactionId;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.orignalTransactionId) {
          return dataLayer[0].transactions.total.originalTransactionId;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.originalTransactionId) {
          return dataLayer[0].basket.price.totalPrice.originalTransactionId;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["creditNoteRefundValue"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.creditNoteRefundValue && tui.analytics.page.creditNoteRefundValue != 'null') {
          return parseFloat(tui.analytics.page.creditNoteRefundValue);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.creditNoteRefundValue) {
          return dataLayer[0].transactions.total.creditNoteRefundValue;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["creditNoteTotalValue"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.creditNoteTotalValue && tui.analytics.page.creditNoteTotalValue != 'null') {
          return parseFloat(tui.analytics.page.creditNoteTotalValue);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.creditNoteTotalValue) {
          return dataLayer[0].transactions.total.creditNoteTotalValue;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.creditNoteTotalValue) {
          return dataLayer[0].basket.price.creditNoteTotalValue;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cruiseCabinType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRCabin) {
          return tui.analytics.page.CRCabin;
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CrCabin) {
          return tui.analytics.page.CrCabin;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cruiseEpicCode"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRWhereTo) {
          return tui.analytics.page.CRWhereTo;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cruiseHotel"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRHotel) {
          return tui.analytics.page.CRHotel;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cruiseShip"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRShip) {
          return tui.analytics.page.CRShip;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cruiseStay"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRStay) {
          return tui.analytics.page.CRStay;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cruiseStayDuration"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.STDur) {
          return tui.analytics.page.STDur;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cruiseStayRoomType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.STRmSlt) {
          return tui.analytics.page.STRmSlt;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["cruiseType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRType) {
          return tui.analytics.page.CRType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - BkngStep"] = (function() {
      if (dataLayer[0].ecommerce !== undefined && dataLayer[0].ecommerce.checkout !== undefined) {
        return dataLayer[0].ecommerce.checkout.actionField.step;
      } else if (dataLayer[0].ecommerce !== undefined && dataLayer[0].ecommerce.purchase !== undefined) {
        return dataLayer[0].ecommerce.purchase.actionField.step;
      } else return "";
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - bookingPace"] = (function() {
      return dataLayer[0].bookingPace || dataLayer[0].searchPace || "";
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - cjevent"] = (function() {
      return window.location.search.replace("?", "&")
        .split("&cjevent=").pop()
        .split("&").shift();
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentArrivalAirport"] = (function arrivalAirport() {
      // returns the arrival airport taken from the route
      if (dataLayer[0].defaultRoute !== undefined) {
        var defaultRoute = dataLayer[0].defaultRoute;
        var defaultRouteArray = defaultRoute.split("-");
        return defaultRouteArray[1];
      } else if (dataLayer[0].selectedRoute !== undefined) {
        var selectedRoute = dataLayer[0].defaultRoute;
        var selectedRouteArray = defaultRoute.split("-");
        return selectedRouteArray[1];
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentCountry"] = (function() {
      if (dataLayer[0].ecommerce !== undefined) {
        if (dataLayer[0].ecommerce.purchase !== undefined) {
          var cat = dataLayer[0].ecommerce.purchase.products[0].category;
          var parts = cat.split('/');
          return parts[1];
        } else if (dataLayer[0].ecommerce.checkout !== undefined) {
          var cat = dataLayer[0].ecommerce.checkout.products[0].category;
          var parts = cat.split('/');
          return parts[1];
        } else if (dataLayer[0].ecommerce.detail !== undefined) {
          var cat = dataLayer[0].ecommerce.detail.products[0].category;
          var parts = cat.split('/');
          return parts[1];
        }
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentDepartureAirportArray"] = (function depAirport() {
      // returns the departure airport
      if (dataLayer[0].d_airport !== undefined) {
        return dataLayer[0].d_airport.join("-");
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentDepartureDate"] = (function currentDepDate() {
      // returns the current departure date
      if (dataLayer[0].dout !== undefined) {
        return dataLayer[0].dout;
      }
      if (dataLayer[0].departureDate !== undefined) {
        return dataLayer[0].departureDate;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentDuration"] = (function currentDestination() {
      // returns the current holiday duration
      if (dataLayer[0].duration !== undefined) {
        return dataLayer[0].duration;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentHotelId"] = (function accomId() {
      // returns the accom id, without the initial letters, where ever it is located
      if (dataLayer[0].ecommerce !== undefined) {
        if (dataLayer[0].ecommerce.purchase !== undefined) {
          return dataLayer[0].ecommerce.purchase.products[0].id.substring(2);
        } else if (dataLayer[0].ecommerce.checkout !== undefined) {
          return dataLayer[0].ecommerce.checkout.products[0].id.substring(2);
        } else if (dataLayer[0].ecommerce.detail !== undefined) {
          return dataLayer[0].ecommerce.detail.products[0].id.substring(2);
        }
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentPartyType"] = (function currentDepDate() {
      // returns the current party type
      if (dataLayer[0].partyType !== undefined) {
        return dataLayer[0].partyType;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentPax"] = (function anyPax() {
      // returns the sum of adults and children from the partyCombination (i.e. excluding infants)
      if (dataLayer[0].partyCombination !== undefined) {
        var party = dataLayer[0].partyCombination;
        var partyArray = party.split(":");
        return parseInt(partyArray[0], 10) + parseInt(partyArray[1], 10);
      } else if (dataLayer[0].ecommerce !== undefined) {
        // uses quantity as a fallback if partyCombination is undefined, but will include infants in pax
        if (dataLayer[0].ecommerce.purchase !== undefined) {
          return dataLayer[0].ecommerce.purchase.products[0].quantity;
        } else if (dataLayer[0].ecommerce.checkout !== undefined) {
          return dataLayer[0].ecommerce.checkout.products[0].quantity;
        } else if (dataLayer[0].ecommerce.detail !== undefined) {
          return dataLayer[0].ecommerce.detail.products[0].quantity;
        }
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentPax inc infants"] = (function anyPax() {
      // returns the pax where ever it is located
      if (dataLayer[0].ecommerce !== undefined) {
        if (dataLayer[0].ecommerce.purchase !== undefined) {
          return dataLayer[0].ecommerce.purchase.products[0].quantity;
        } else if (dataLayer[0].ecommerce.checkout !== undefined) {
          return dataLayer[0].ecommerce.checkout.products[0].quantity;
        } else if (dataLayer[0].ecommerce.detail !== undefined) {
          return dataLayer[0].ecommerce.detail.products[0].quantity;
        }
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentResort"] = (function productCat() {
      if (dataLayer[0].ecommerce !== undefined) {
        if (dataLayer[0].ecommerce.purchase !== undefined) {
          var cat = dataLayer[0].ecommerce.purchase.products[0].category;
          var parts = cat.split('/');
          return parts[2]
        } else if (dataLayer[0].ecommerce.checkout !== undefined) {
          var cat = dataLayer[0].ecommerce.checkout.products[0].category;
          var parts = cat.split('/');
          return parts[2];
        } else if (dataLayer[0].ecommerce.detail !== undefined) {
          var cat = dataLayer[0].ecommerce.detail.products[0].category;
          var parts = cat.split('/');
          return parts[2];
        }
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - currentRoute"] = (function route() {
      // returns the current route
      if (dataLayer[0].defaultRoute !== undefined) {
        return dataLayer[0].defaultRoute;
      }
      if (dataLayer[0].selectedRoute !== undefined) {
        return dataLayer[0].selectedRoute;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - Hit Timestamp"] = (function() {
      //Get local time as ISO string with offset at the end
      var now = new Date();
      var tzo = -now.getTimezoneOffset();
      var dif = tzo >= 0 ? '+' : '-';
      var pad = function(num) {
        var norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      };
      return now.getFullYear() +
        '-' + pad(now.getMonth() + 1) +
        '-' + pad(now.getDate()) +
        'T' + pad(now.getHours()) +
        ':' + pad(now.getMinutes());
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - Internal Campaign"] = (function() {
      return window.location.search.replace("?", "&")
        .split("&icid=").pop()
        .split("&").shift();
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - NumberOfRooms"] = (function() {
      return dataLayer[0].numberOfRooms;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - pageName"] = (function() {
      return dataLayer[0].pageName || "";
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - productName"] = (function() {
      if (dataLayer[0].ecommerce !== undefined) {
        if (dataLayer[0].ecommerce.detail !== undefined) {
          return dataLayer[0].ecommerce.detail.products[0].name;
        } else if (dataLayer[0].ecommerce.checkout !== undefined) {
          return dataLayer[0].ecommerce.checkout.products[0].name;
        } else if (dataLayer[0].ecommerce.purchase !== undefined) {
          return dataLayer[0].ecommerce.purchase.products[0].name;
        }
      } else return ""
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - sectionName"] = (function() {
      return dataLayer[0].sectionName;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - Server"] = (function() {
      return dataLayer[0].server;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal - transactionID"] = (function() {
      return dataLayer[0].transactionID;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal Ski - Flashtalking Departure Date"] = (function() {
      if (dataLayer[0].dout !== undefined) {
        return dataLayer[0].dout.split("/").reverse().join("-");
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal Ski - Products Array"] = (function() {
      if (dataLayer[0].ecommerce !== undefined) {
        if (dataLayer[0].ecommerce.purchase !== undefined) {
          return dataLayer[0].ecommerce.purchase.products;
        } else if (dataLayer[0].ecommerce.checkout !== undefined) {
          return dataLayer[0].ecommerce.checkout.products;
        } else if (dataLayer[0].ecommerce.detail !== undefined) {
          return dataLayer[0].ecommerce.detail.products;
        }
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Crystal Ski - Products Array Search"] = (function() {
      if (dataLayer[0].sectionName === "Search Results" || dataLayer[0].sectionName === "Deals") {

        const ids = dataLayer[0].destinationCode || [];
        const names = dataLayer[0].destinationName || [];

        return ids.map(function(val, i) {
          return {
            id: val,
            name: names[i],
            list: dataLayer[0].pageName
          }
        });
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Currency"] = (function() {
      if (document.location.host === 'www.crystalski.co.uk' || document.location.host === 'crystalski.co.uk') {
        return 'GBP';
      } else if (document.location.host.indexOf('stage.www.crystalski.co.uk.crystaldev.io', 'qa1.www.crystalski.co.uk.crystaldev.io', 'dev2.www.crystalski.co.uk.crystaldev.io', 'dev1.www.crystalski.co.uk.crystaldev.io') != -1) {
        return 'GBP';
      } else if (document.location.host === 'agent.crystalski.co.uk') {
        return 'GBP';
      } else if (document.location.host.indexOf('stage.agent.crystalski.co.uk.crystaldev.io', 'qa1.agent.crystalski.co.uk.crystaldev.io', 'dev2.agent.crystalski.co.uk.crystaldev.io', 'dev2.agent.crystalski.co.uk.crystaldev.io') != -1) {
        return 'GBP';
      } else if (document.location.host === 'www.crystalski.ie') {
        return 'EUR';
      } else if (document.location.host.indexOf('stage.www.crystalski.ie.crystaldev.io', 'qa1.www.crystalski.ie.crystaldev.io', 'dev2.www.crystalski.ie.crystaldev.io', 'dev1.www.crystalski.ie.crystaldev.io') != -1) {
        return 'EUR';
      }
      return '';
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["currencyCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].page) {
          var dl = dataLayer[0];
          if (dl.transactions && dl.transactions.total && dl.transactions.total.currency) {
            return dl.transactions.total.currency;
          } else if (dl.basket && dl.basket.price && dl.basket.price.currency) {
            return dl.basket.price.currency;
          } else if (dl.product && dl.product.currency) {
            return dl.product.currency;
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["customerAccountNumberOfBookings"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CABookings) {
          return tui.analytics.page.CABookings;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["customerID"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CustID) {
          return tui.analytics.page.CustID;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].user && dataLayer[0].user.customerID) {
          return dataLayer[0].user.customerID;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["date"] = (function() {
      try {
        var ddd = new Date();
        var fyfyfy = ddd.getFullYear();
        var mmm = ddd.getMonth() + 1;
        var zero = "0"
        if (mmm < 10) {
          mmm = zero + mmm;
        } else {
          mmm = mmm;
        }
        var daydayday = ddd.getDate();
        var zero = "0"
        if (daydayday < 10) {
          daydayday = zero + daydayday;
        } else {
          daydayday = daydayday;
        }
        var slash = "/"
        var date = daydayday + slash + mmm + slash + fyfyfy
        return date;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["daysToDeparture"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DepDate) {
          var depMonthYear = tui.analytics.page.MonthYear.split('/')
          var departureDate = new Date(depMonthYear[1], depMonthYear[0] - 1, tui.analytics.page.DepDate);
          var today = new Date();

          Days = departureDate - today;

          var daysToDep = Math.ceil(Days / (1000 * 60 * 60 * 24));

          return daysToDep;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.daysToDeparture) {
          return String(dataLayer[0].transactions.items.daysToDeparture);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.daysToDeparture) {
          return String(dataLayer[0].basket.items.daysToDeparture);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.daysToDeparture) {
          return String(dataLayer[0].product.daysToDeparture);
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["decibelID"] = (function() {
      try {
        var host = location.hostname,
          returnVal = '';

        if (~host.indexOf('tuiprjuat.co.uk')) {
          returnVal = '116782';
        } else if (~host.indexOf('firstchoiceprjuat.co.uk')) {
          returnVal = '116869';
        } else if (~host.indexOf('tuiholidaysprjuat.ie')) {
          returnVal = '116782';
        } else if (~host.indexOf('tui.co.uk')) {
          returnVal = '93210';
        } else if (~host.indexOf('firstchoice.co.uk')) {
          returnVal = '95707';
        } else if (~host.indexOf('tuiholidays.ie')) {
          returnVal = '95715';
        }
        return returnVal;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["departureAirportCode"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DepAir) {
          return tui.analytics.page.DepAir;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.departureAirportCode) {
          return dataLayer[0].transactions.items.departureAirportCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.departureAirportCode) {
          return dataLayer[0].basket.items.departureAirportCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.departureAirportCode) {
          return dataLayer[0].product.departureAirportCode;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["departureDate"] = (function() {
      //date format dd/mm/yyyy
      try {
        if (window.tui && tui.analytics && tui.analytics.page && (tui.analytics.page.DepDate || (tui.analytics.page.MonthYear && tui.analytics.page.MonthYear.indexOf('Dates') === -1))) {
          var day = tui.analytics.page.DepDate;
          var month = tui.analytics.page.MonthYear.substring(0, 2);
          var year = tui.analytics.page.MonthYear.substring(3, 7);
          return (day == undefined ? "" : day == "" ? "" : day) + '/' + month + '/' + year;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.departureDate) {
          return dataLayer[0].transactions.items.departureDate.split("-").reverse().join("/");
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.departureDate) {
          return dataLayer[0].basket.items.departureDate.split("-").reverse().join("/");
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.departureDate) {
          return dataLayer[0].product.departureDate.split("-").reverse().join("/");
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page && dataLayer[0].page.search.departureDate) {
          return dataLayer[0].page.search.departureDate.split("-").reverse().join("/");
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  b["departureDate YYYYMMDD"] = (function() {
    try {
      var returnVal = 'none';
      // function for returning Departure Date, used in Adobe Departure Date (evar14). Copied from Tag "WA - SiteCat Page Code" on 28/09/17
      if (typeof b.departureDate === 'string') {
        var splitDate = b.departureDate.split('/')
        var year = splitDate[2] && splitDate[2].length === 4 && splitDate[2]
        var month = splitDate[1] && splitDate[1].length === 2 && splitDate[1]
        var day = splitDate[0] && splitDate[0].length === 2 && splitDate[0]
        if (year && month && day) {
          return year + month + day
        }
        // sometimes the day isn't selected (like cruises)
        if (year && month) {
          return year + month
        }
      }
      return returnVal
    } catch (err) {
      return returnVal;
    }
  })()

  /*
  Doesn't seem to work correctly on https://www.tui.co.uk/cruise/bookitineraries/Mediterranean-Medley-101129?itineraryCodeOne=101129&itineraryCodeTwo=&shipCode=150012&mc=false&isMCTracs=false&isStayBefore=false&stayDuration=0&cruiseDuration=7&duration=1-7&noOfAdults=2&noOfChildren=0&childrenAge=&from[]=BOH:Airport&to[]=101129:Itinerary&flexibility=false&noOfSeniors=0&when=12-10-2021&sailingDate=12Oct21&to[]=&packageId=16340190000001634030400000TOM620416346388000001634643300000TOM62051181672602/3/650/7ZI01&index=3&brandType=null&addAStay=0&cabin[]=1,2&dp=BOH&bb=AI&cabinOnly=false&mcId=101129|T&searchVariant=FLY_CRUISE_ATCOM

  Attempting to replace it

  try {
    b["departureDate YYYYMMDD"] = (function() {
      try {
        var returnVal = 'none';
        // function for returning Departure Date, used in Adobe Departure Date (evar14). Copied from Tag "WA - SiteCat Page Code" on 28/09/17
        if (window.dataLayer && dataLayer[0]) {
          var dl = dataLayer[0];

          if (dl.page && dl.page.search && dl.page.search.departureDate) {
            returnVal = dl.page.search.departureDate;
          } else if (dl.product && dl.product.departureDate) {
            returnVal = dl.product.departureDate;
          } else if (dl.basket && dl.basket.items && dl.basket.items.departureDate) {
            returnVal = dl.basket.items.departureDate;
          } else if (dl.transactions && dl.transactions.items && dl.transactions.items.departureDate) {
            returnVal = dl.transactions.items.departureDate;
          }
          return returnVal.replace(/-/g, '');
        } else if (tui.analytics.page.MonthYear) {
          var year = tui.analytics.page.MonthYear && tui.analytics.page.MonthYear.split('/').length > 0 ? tui.analytics.page.MonthYear.split('/')[1] : '';
          month = tui.analytics.page.MonthYear ? tui.analytics.page.MonthYear.split('/')[0] : '';
          day = tui.analytics.page.DepDate;

          return [year, month, day].join('');
        }
        return returnVal;
      } catch (err) {
        return returnVal;
      }
    })()
  } catch (e) {
    logError(e)
  }

  */

  try {
    b["departureDateDifference"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DepDateDiff) {
          return tui.analytics.page.DepDateDiff;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.departureDateDifference) {
          return dataLayer[0].product.departureDateDifference;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.departureDateDifference) {
          return dataLayer[0].basket.items.departureDateDifference;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.departureDateDifference) {
          return dataLayer[0].transactions.items.departureDateDifference;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["depositOptionsAvailable"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DepOpt) {
          return tui.analytics.page.DepOpt;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.availableDepositOptions) {
          return dataLayer[0].basket.price.availableDepositOptions;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["depositOptionSelected"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DepOptSel) {
          return tui.analytics.page.DepOptSel;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.depositValue) {
          return dataLayer[0].transactions.total.depositValue;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["depositValueBookflow"] = (function() {
      try {
        if (document.URL.indexOf('your-account') == -1) {
          return (window.tui.analytics.page.Amount || '');
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["destinationBrowse"] = (function() {
      //to be updated later
      try {
        var pageType = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.contextType) ? tui.analytics.page.contextType : '';
        var destination = (function() {
          switch (pageType) {
            case 'COUNTRY':
            case 'Destination_Country':
            case 'Destination_Country_TTD':
            case 'REGION':
            case 'Destination_Region':
              return document.getElementsByClassName('pg-heading')[0].innerText.split(" Holidays")[0];
            case 'DESTINATION':
            case 'Destination_Destination':
            case 'RESORT':
            case 'Destination_Resort':
              return document.getElementsByClassName('page-title')[0].innerHTML.split(" Holidays")[0];
            case 'ACCOMMODATION':
            case 'Destination_Accommodation':
              return document.querySelector(".bread-viewport").childNodes[1].childNodes[3].innerText.slice(0, -1);
            default:
              return '';
          }
        })()
        return destination.replace(/^\s+|\s+$/g, "");
      } catch (e) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["destinationCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.destinationCode) {
          return dataLayer[0].transactions.items.geo.destinationCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.destinationCode) {
          return dataLayer[0].basket.items.geo.destinationCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.destinationCode) {
          return dataLayer[0].product.geo.destinationCode;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["destinationFC"] = (function() {
      try {
        function titleCase(str) {
          str = str ? str.toLowerCase().split(' ') : [];
          for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
          }
          return str.join(' ').replace(/Tui/g, "TUI");
        }

        if (tui.analytics.page.contextType == "ACCOMMODATION") {
          return titleCase(document.getElementsByClassName('pg-heading')[0].childNodes[1].outerText.replace(/PPPPP/g, ""));
        } else {
          return titleCase(document.getElementsByClassName('uppercase tui-dark-blue destinations-name')[0].outerText.replace("DESTINATIONS IN ", ""));
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["destinationIMG"] = (function() {
      try {
        var url = document.getElementsByClassName('hero-img')[0].children[0].currentSrc;
        var widthreplace = url.replace(/width:1080/g, "width:364");
        var heightreplace = widthreplace.replace(/height:608/g, "height:180");
        return heightreplace;
      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["destinationName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.destinationName) {
          return dataLayer[0].transactions.items.geo.destinationName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.destinationName) {
          return dataLayer[0].basket.items.geo.destinationName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.destinationName) {
          return dataLayer[0].product.geo.destinationName;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["destinationPrice"] = (function() {
      try {
        var price;

        if (tui.analytics.page.contextType == "ACCOMMODATION") {
          price = document.getElementsByClassName('actual-price')[0].outerText;
        } else {
          price = document.getElementsByClassName('amount')[0].outerText;
        }
        return price;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["destinationPush"] = (function() {
      var pageType = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.contextType) ? tui.analytics.page.contextType : '';
      var destination = (function() {
        switch (pageType) {
          case 'CONTINENT':
            return document.getElementsByClassName('page-title')[0].innerHTML.replace(" Holidays", "").trim();
          case 'COUNTRY':
          case 'Destination_Country':
            return document.getElementsByClassName('page-title')[0].innerHTML.replace(" Holidays", "").trim();
          case 'Destination_Country_TTD':
          case 'REGION':
          case 'Destination_Region':
            return document.getElementsByClassName('page-title')[0].innerHTML.replace(" Holidays", "").trim();
          case 'DESTINATION':
          case 'Destination_Destination':
          case 'RESORT':
          case 'Destination_Resort':
            return document.getElementsByClassName('page-title')[0].innerHTML.replace(" Holidays", "").trim();
          case 'ACCOMMODATION':
          case 'Destination_Accommodation':
            function titleCase(str) {
              str = str ? str.toLowerCase().split(' ') : [];
              for (var i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
              }
              return str.join(' ').replace(/Tui/g, "TUI");
            }
            return titleCase(document.getElementsByClassName('pg-heading')[0].childNodes[1].outerText.replace(/OOOOO/g, ""));
          default:
            return 'null';
        }
      })()
      return destination.replace(/^\s+|\s+$/g, "");
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["device"] = (function() {
      try {
        var deviceDetector = (function() {
          var ua = navigator.userAgent.toLowerCase();
          var detect = (function(s) {
            if (s === undefined) s = ua;
            else ua = s.toLowerCase();
            if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua))
              return 'Tablet';
            else
            if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua))
              return 'Mobile';
            else return 'Desktop';
          });
          return {
            device: detect(),
            detect: detect,
            isMobile: ((detect() != 'desktop') ? true : false),
            userAgent: ua
          };
        }());

        return deviceDetector.device;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["directDebit"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DirectDebit) {
          return tui.analytics.page.DirectDebit;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["directOrIndirectFlight"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.InDir) {
          return tui.analytics.page.InDir;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.directOrIndirectFlight) {
          return dataLayer[0].transactions.items.directOrIndirectFlight;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.directOrIndirectFlight) {
          return dataLayer[0].basket.items.directOrIndirectFlight;
        }

      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["dreamlinerFlight"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DreamFl) {
          return tui.analytics.page.DreamFl;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["duration"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Dur) {
          return tui.analytics.page.Dur;
        } else if (tui.analytics.page.STDur && tui.analytics.page.STDur.toLowerCase() == "null") {
          return tui.analytics.page.CRDur;
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.STDur && tui.analytics.page.CRDur) {
          return parseInt(tui.analytics.page.CRDur) + parseInt(tui.analytics.page.STDur);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.duration) {
          return dataLayer[0].transactions.items.duration;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.duration) {
          return dataLayer[0].basket.items.duration;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.duration) {
          return dataLayer[0].product.duration;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["durationCode"] = (function() {
      try {
        var dur = "";
        var durCode;
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Dur) {
          dur = parseInt(tui.analytics.page.Dur);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.duration) {
          dur = dataLayer[0].transactions.items.duration;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.duration) {
          dur = dataLayer[0].basket.items.duration;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.duration) {
          dur = dataLayer[0].product.duration;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.duration) {
          dur = dataLayer[0].page.search.duration;
        }


        switch (dur) {
          case 1:
            durCode = '1245';
            break;
          case 2:
          case 3:
          case 4:
            durCode = '4321';
            break;
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
            durCode = '7114';
            break;
          case 10:
            durCode = '1014';
            break;
          case 11:
            durCode = '1114';
            break;
          case 12, 13, 14, 15, 16:
            durCode = '1413';
            break;
          default:
            durCode = '2118';
        }

        return durCode;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["durationSearched"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DurationSearched) {
          return tui.analytics.page.DurationSearched;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.durationSearched) {
          return dataLayer[0].page.search.durationSearched;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["emailHash"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Eml) {
          return tui.analytics.page.Eml;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].user && dataLayer[0].user.hashedEmail) {
          return dataLayer[0].user.hashedEmail;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["epicCode"] = (function() {
      try {
        if (document.location.href.indexOf('cruise') == -1) {
          if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.WhereTo) {
            return tui.analytics.page.WhereTo;
          } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.productID) {
            return dataLayer[0].transactions.items.productID;
          } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.productID) {
            return dataLayer[0].basket.items.productID;
          } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.productID) {
            return dataLayer[0].product.productID;
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["facebookPixelFire"] = (function() {
      try {
        //let days = Bootstrapper.data.resolve('Manage.TUI UK - Generic.daysToDeparture');
        let days = b.daysToDeparture
        //let carrier = Bootstrapper.data.resolve('Manage.TUI UK - Generic.carrierCode');
        let carrier = b.carrierCode
        //Fire FB Pixel Logic
        if (days < 180 && carrier === "TOM|TOM") {
          return 'YES';
        } else {
          return 'NO';
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterAccommodationType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.AccomTypeF) {
          return tui.analytics.page.AccomTypeF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "accommodationType") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterBackTime"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.BackTimeF) {
          return tui.analytics.page.BackTimeF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "inslots") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterBestFor"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.BestForF) {
          return tui.analytics.page.BestForF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "bestfor") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterBoard"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.BoardF) {
          return tui.analytics.page.BoardF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters;
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "boardBasis") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterBudget"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.BudgetF) {
          return tui.analytics.page.BudgetF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "budgettotal") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterCruiseCabin"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CabinF) {
          return tui.analytics.page.CabinF;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterCruiseDestination"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRGeoF) {
          return tui.analytics.page.CRGeoF;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterCruiseShip"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRShipF) {
          return tui.analytics.page.CRShipF;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterCruiseStayDestination"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CRStayF) {
          return tui.analytics.page.CRStayF;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterDepartureAirport"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DepAirF) {
          return tui.analytics.page.DepAirF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "departurePoints") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterDestination"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.GeoF) {
          return tui.analytics.page.GeoF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "destinations") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterFeatures"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.FeaturesF) {
          return tui.analytics.page.FeaturesF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "features") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterFreeChildPlaces"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.FreeKidsF) {
          return tui.analytics.page.FreeKidsF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters;
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "isFCP") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterHolidayType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.HolTypeF) {
          return tui.analytics.page.HolTypeF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "holidayType") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterOutTime"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.OutTimeF) {
          return tui.analytics.page.OutTimeF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "outslots") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterSingleAccommodationEndState"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.filters) {
          return window.tui.analytics.page.filters.reduce(function(a, c, i) {
            i === 0 ? c.filterValue : a + ',' + c.filterValue;
          }, '')
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }


  try {
    b["filterSortBy"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.SortByF) {
          return tui.analytics.page.SortByF;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterTourOperator"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TourOperatorF) {
          return tui.analytics.page.TourOperatorF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters;
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "holidayOperator") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterTripAdvisorRating"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TARatingF) {
          return tui.analytics.page.TARatingF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "taRatingF") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["filterTuiRating"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.RatingF) {
          return tui.analytics.page.RatingF;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.filters) {
          var filters = dataLayer[0].product.filters
          var i;
          for (i = 0; i < filters.length; i++) {
            if (dataLayer[0].product.filters[i].filterName == "fcRating") {
              return (dataLayer[0].product.filters[i].filterValue);
            }
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["firstPartyAncillaries"] = (function() {
      try {

        var arrayItems = "";
        var itemValue = "";


        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TuiAnc) {
          return tui.analytics.page.TuiAnc;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.subItems) {
          arrayItems = dataLayer[0].transactions.items.subItems;
          for (i = 0; i < arrayItems.length; i++) {
            itemValue += arrayItems[i].productID + "|" + arrayItems[i].quantity.pax + "|" + arrayItems[i].price.currentPrice +
              (i == arrayItems.length - 1 ? "" : "-")
          }
          return itemValue;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.subItems) {
          arrayItems = dataLayer[0].basket.items.subItems;
          for (i = 0; i < arrayItems.length; i++) {
            itemValue += arrayItems[i].productID + "|" + arrayItems[i].quantity.pax + "|" + arrayItems[i].price.currentPrice +
              (i == arrayItems.length - 1 ? "" : "-")
          }
          return itemValue;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["flexibleDates"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.FlexDate) {
          return tui.analytics.page.FlexDate;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.flexibleDates) {
          return dataLayer[0].page.search.flexibleDates;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["flightExtrasBookingReference"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.ACSSRef) {
          return tui.analytics.page.ACSSRef;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["flightExtrasCheckedInState"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CheckIn) {
          return tui.analytics.page.CheckIn;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["flightExtrasInboundDays"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.InboundDays) {
          return tui.analytics.page.InboundDays;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["flightInventory"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.FltInv) {
          return tui.analytics.page.FltInv;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.flightInventory) {
          return dataLayer[0].transactions.items.flightInventory;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.flightInventory) {
          return dataLayer[0].basket.items.flightInventory;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.flightInventory) {
          return dataLayer[0].product.flightInventory;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["flightOnlyDeparturePeriod"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DepPeriod) {
          return tui.analytics.page.DepPeriod;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["flightType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.FltType) {
          return tui.analytics.page.FltType;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.productSubType && (dataLayer[0].transactions.items.productSubType == "Inbound" || dataLayer[0].transactions.items.productSubType == "Outbound" || dataLayer[0].transactions.items.productSubType == "Return")) {
          return dataLayer[0].transactions.items.productSubType;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.productSubType && (dataLayer[0].basket.items.productSubType == "Inbound" || dataLayer[0].basket.items.productSubType == "Outbound" || dataLayer[0].basket.items.productSubType == "Return")) {
          return dataLayer[0].basket.items.productSubType;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.flightType) {
          dataLayer[0].page.search.flightType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["freeChildPlacePartySize"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.PartySize) {
          return tui.analytics.page.PartySize;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["freeChildPlaces"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.SelectScope) {
          return tui.analytics.page.SelectScope;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.freeKidsAvailable) {
          return dataLayer[0].product.freeKidsAvailable;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.freeKidsAvailable) {
          return dataLayer[0].basket.items.freeKidsAvailable;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.freeKidsAvailable) {
          return dataLayer[0].transactions.items.freeKidsAvailable;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["geoLevel"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.contextType) {
          return tui.analytics.page.contextType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["gmpCustomerID"] = (function() {
      try {
        if (window.location.search.indexOf('qcmk') != -1) {
          return window.location.search.replace("?", "&")
            .split("&qcmk=").pop()
            .split("&").shift();
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Google Analytics Property ID"] = (function() {
      if (document.location.host === 'www.crystalski.co.uk' || document.location.host === 'crystalski.co.uk') {
        return 'UA-64722569-1';
      } else if (["dev1.www.crystalski.co.uk.crystaldev.io", "dev2.www.crystalski.co.uk.crystaldev.io", "qa1.www.crystalski.co.uk.crystaldev.io", "stage.www.crystalski.co.uk.crystaldev.io"
        ].indexOf(document.location.host) != -1) {
        return 'UA-64722569-8';
      } else if (document.location.host === 'agent.crystalski.co.uk') {
        return 'UA-64996454-1';
      } else if (["dev1.agent.crystalski.co.uk.crystaldev.io", "dev2.agent.crystalski.co.uk.crystaldev.io", "qa1.agent.crystalski.co.uk.crystaldev.io", "stage.agent.crystalski.co.uk.crystaldev.io"
        ].indexOf(document.location.host) != -1) {
        return 'UA-64996454-2';
      } else if (document.location.host === 'www.crystalski.ie') {
        return 'UA-65009155-1';
      } else if (["dev1.www.crystalski.ie.crystaldev.io", "dev2.www.crystalski.ie.crystaldev.io", "qa1.www.crystalski.ie.crystaldev.io", "stage.www.crystalski.ie.crystaldev.io"
        ].indexOf(document.location.host) != -1) {
        return 'UA-65009155-2';
      } else return '';
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Google Analytics - New Property ID"] = (function() {

      var tui_new_prod = 'UA-107596466-5';
      var tui_new_dev = 'UA-107596466-6';
      var fc_new_prod = 'UA-107596466-7';
      var fc_new_dev = 'UA-107596466-8';
      var tui_ie_new_prod = 'UA-39088453-1';
      var tui_ie_new_dev = 'UA-39088453-3';

      try {
        // Check if it is prod bootstrap
        if (/^(hybrisprod|paymentpage|prod)$/i.test(Bootstrapper.ensightenOptions.publishPath)) {
          // FC Production
          if (document.location.hostname.indexOf('firstchoice') !== -1) {
            console.log('GA Property:FC UK - New:' + fc_new_prod);
            return fc_new_prod;
          }
          // TUI IE Production
          else if (document.location.hostname.indexOf('tuiholidays') !== -1) {
            console.log('GA Property:TUI IE:' + tui_ie_new_prod);
            return tui_ie_new_prod;
          }
          // TUI UK Production
          else if (document.location.hostname.indexOf('tui') !== -1) {
            console.log('GA Property:TUI UK - New:' + tui_new_prod);
            return tui_new_prod;
          } else {
            return tui_new_dev;
          }
        }
        // Check if it is dev bootstrap
        else if (/^(hybrisdev|paymentpagedev|dev)$/i.test(Bootstrapper.ensightenOptions.publishPath)) {
          // FC Development
          if (document.location.hostname.indexOf('firstchoice') !== -1) {
            console.log('GA Property:FC UK Dev - New:' + fc_new_dev);
            return fc_new_dev;
          }
          // TUI IE Development
          else if (document.location.hostname.indexOf('tuiholidays') !== -1) {
            console.log('GA Property:TUI IE - Dev:' + tui_ie_new_dev);
            return tui_ie_new_dev;
          } else if (document.location.hostname.indexOf('tui') !== -1) {
            console.log('GA Property:TUI UK - Dev New:' + tui_new_dev);
            return tui_new_dev;
          }
        }
        // Fallback to dev
        else {
          console.log('GA Property:TUI UK - Dev New FALLBACK:' + tui_new_dev);
          return tui_new_dev;
        }
      } catch (err) {
        return "";
      }

    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["googleAnalyticsClientID"] = (function() {
      try {
        if (Bootstrapper.Cookies.get('_ga2')) {
          return Bootstrapper.Cookies.get('_ga2').slice(6);
        } else if (Bootstrapper.Cookies.get('_ga')) {
          return Bootstrapper.Cookies.get('_ga').slice(6);
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["googleAnalyticsPropertyID"] = (function() {
      try {
        if (/^(hybrisprod|paymentpage|prod)$/i.test(Bootstrapper.ensightenOptions.publishPath)) {
          return 'UA-107596466-1';
        }
        return 'UA-107596466-3';
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["handLuggageOnly"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Hlo) {
          return tui.analytics.page.Hlo;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.handLuggageOnly) {
          return dataLayer[0].transactions.items.handLuggageOnly;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.handLuggageOnly) {
          return dataLayer[0].basket.items.handLuggageOnly;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.handLuggageOnly) {
          return dataLayer[0].product.handLuggageOnly;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["haulTypeSearch"] = (function() {

      //Iterates through search results list and counts SH/LH destinations. Returns haul type with higher count.
      //Used for audience building/retargeting purposes.

      //Beach Search Results
      try {
        if (window.dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.resultsList) {
          var results = dataLayer[0].page.search.resultsList;
          var haulList = [],
            countSH = 0,
            countLH = 0;

          results.forEach(function(item) {
            if (item.haulCode === 'SH') {
              countSH++;
            } else if (item.haulCode === 'LH') {
              countLH++;
            }
          });

          if (countLH > countSH) {
            return 'LH';
          } else {
            return 'SH';
          }
        }
      } catch (e) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["hostname"] = (function() {
      try {
        return document.location.host;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["hotelName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.productName && dataLayer[0].transactions.items.productType && (dataLayer[0].transactions.items.productType == "Beach")) {
          return dataLayer[0].transactions.items.productName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.productName && dataLayer[0].basket.items.productType && (dataLayer[0].basket.items.productType == "Beach")) {
          return dataLayer[0].basket.items.productName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.productName && dataLayer[0].product.productType && (dataLayer[0].product.productType == "Beach")) {
          return dataLayer[0].product.productName;
        } else if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.accomViewData[0] && jsonData.packageViewData.accomViewData[0].accomName) {
          return jsonData.packageViewData.accomViewData[0].accomName;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["irClickID"] = (function() {
      var value = "; " + document.cookie;
      var parts = value.split("; irclickid=");
      if (parts.length == 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isAccommodationOnly"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.AOType) {
          return tui.analytics.page.AOType;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.isAccommodationOnly) {
          return dataLayer[0].transactions.items.isAccommodationOnly;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.isAccommodationOnly) {
          return dataLayer[0].basket.items.isAccommodationOnly;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.isAccommodationOnly) {
          return dataLayer[0].product.isAccommodationOnly;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].search && dataLayer[0].search.isAccommodationOnly) {
          return dataLayer[0].search.isAccommodationOnly;
        }
      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isChoiceSearch"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.IsChoiceSearch && tui.analytics.page.IsChoiceSearch != 'null') {
          return tui.analytics.page.IsChoiceSearch;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.isChoiceSearch) {
          return dataLayer[0].page.search.isChoiceSearch;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isCreditNoteBooking"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.isCreditNoteBooking && tui.analytics.page.isCreditNoteBooking != 'null') {
          return tui.analytics.page.isCreditNoteBooking;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.isCreditNoteBooking) {
          return dataLayer[0].transactions.total.isCreditNoteBooking;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isCreditNoteIncentiveEligible"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.isCreditNoteIncentiveEligible && tui.analytics.page.isCreditNoteIncentiveEligible != 'null') {
          return tui.analytics.page.isCreditNoteIncentiveEligible.toLowerCase();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.isCreditNoteIncentiveEligible) {
          return dataLayer[0].transactions.total.isCreditNoteIncentiveEligible.toLowerCase();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.isCreditNoteIncentiveEligible) {
          return dataLayer[0].basket.price.isCreditNoteIncentiveEligible.toLowerCase();
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isCRM"] = (function() {
      try {
        if (window.location.search.indexOf("cmid") > -1) {
          return "YES";
        } else {
          return "NO";
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isLowDeposit"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.LowDep) {
          return tui.analytics.page.LowDep;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.limitedAvailabilitySeats) {
          return dataLayer[0].basket.price.isLowDeposit;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.limitedAvailabilitySeats) {
          return dataLayer[0].transactions.total.isLowDeposit;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isPush"] = (function() {
      try {
        if (window.location.search.indexOf("im_id=Push") > -1) {
          return "YES";
        } else {
          return "NO";
        }
      } catch (err) {

        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isSearch"] = (function() {

      try {

        if (document.referrer.indexOf("aol.") > -1) {

          return "YES";
        } else if (document.referrer.indexOf("ask.") > -1) {

          return "YES";
        } else if (document.referrer.indexOf("yahoo.") > -1) {

          return "YES";
        } else if (document.referrer.indexOf("bing.") > -1) {

          return "YES";
        } else if (document.referrer.indexOf("google.") > -1) {

          return "YES";
        } else if (document.referrer.indexOf("msn.") > -1) {

          return "YES";
        } else if (document.referrer.indexOf("yandex.") > -1) {

          return "YES";
        } else if (document.referrer.indexOf("live.") > -1) {

          return "YES";
        } else {

          return "NO";
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["isSEO"] = (function() {
      try {
        var isSearch;
        var isSEO;

        if (document.referrer.indexOf("aol.") > -1) {

          isSearch = "YES";
        } else if (document.referrer.indexOf("ask.") > -1) {

          isSearch = "YES";
        } else if (document.referrer.indexOf("yahoo.") > -1) {

          isSearch = "YES";
        } else if (document.referrer.indexOf("bing.") > -1) {

          isSearch = "YES";
        } else if (document.referrer.indexOf("google.") > -1) {

          isSearch = "YES";
        } else if (document.referrer.indexOf("msn.") > -1) {

          isSearch = "YES";
        } else if (document.referrer.indexOf("yandex.") > -1) {

          isSearch = "YES";
        } else if (document.referrer.indexOf("live.") > -1) {

          isSearch = "YES";
        } else {

          isSearch = "NO";
        }

        if (isSearch === "YES") {

          if (window.location.search.indexOf("im_id") > -1) {

            isSEO = "NO";
          } else {

            isSEO = "YES";
          }
        } else {
          isSEO = "NO";
        }
        return isSEO;

      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["limitedAvailabilityBeds"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.LimAvB) {
          return tui.analytics.page.LimAvB;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.limitedAvailabilityBeds) {
          return dataLayer[0].product.limitedAvailabilityBeds;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.limitedAvailabilityBeds) {
          return dataLayer[0].basket.items.limitedAvailabilityBeds;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.limitedAvailabilityBeds) {
          return dataLayer[0].transactions.items.limitedAvailabilityBeds;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["limitedAvailabilityCabins"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.LimAvC) {
          return tui.analytics.page.LimAvC;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["limitedAvailabilitySeats"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.LimAvS) {
          return tui.analytics.page.LimAvS;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.limitedAvailabilitySeats) {
          return dataLayer[0].product.limitedAvailabilitySeats;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.limitedAvailabilitySeats) {
          return dataLayer[0].basket.items.limitedAvailabilitySeats;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.limitedAvailabilitySeats) {
          return dataLayer[0].transactions.items.limitedAvailabilitySeats;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Lock Your Price - Booking Check"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.pageUid && tui.analytics.page.pageUid == "lockYourPriceConfirmationpage_react") {
          return "LYPUnconfirmed";
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page.pageID && dataLayer[0].page.pageID == "lockYourPriceConfirmationpage_react") {
          return "LYPUnconfirmed";
        } else {
          return "FireBooking";
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Lock Your Price Available"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.isLockYourPriceAvailable && (dataLayer[0].basket.price.lockYourPriceCost >= 0)) {
          return (dataLayer[0].basket.price.isLockYourPriceAvailable + "|" + (dataLayer[0].basket.price.lockYourPriceCost == 0 ? 'zero' : dataLayer[0].basket.price.lockYourPriceCost));
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Lock Your Price Confirmed Booking"] = (function() {
      try {
        if (document.URL.indexOf('/managemybooking/paymentconfirmation') !== -1) {
          return 1;
        }

      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Lock Your Price Revenue"] = (function() {
      try {
        if (document.URL.indexOf('/book/confirmation') !== -1) {
          if (window.dataLayer[0].transactions.total.isLockYourPrice == "Yes" || window.dataLayer[0].page.pageID == "lockYourPriceConfirmationpage_react") {
            return window.dataLayer[0].transactions.total.lockYourPriceValue;
          }
        } else if (document.URL.indexOf('/managemybooking/paymentconfirmation') !== -1) {
          return (window.dataLayer[0].transactions.total.lockYourPriceValue * -1);
        }

      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Lock Your Price Unconfirmed Booking"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.pageID == "lockYourPriceConfirmationpage_react") {
          return 1;
        } else {
          return "";
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Lock Your Price Unconfirmed Booking Revenue"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.pageID == "lockYourPriceConfirmationpage_react") {
          return dataLayer[0].transactions.total.totalPrice;
        } else {
          return "";
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["loginDetail"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.CLogin) {
          return tui.analytics.page.CLogin;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].user && dataLayer[0].user.loggedInStatus) {
          return dataLayer[0].user.loggedInStatus;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["minimumPaymentAmount"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.MinPay) {
          return tui.analytics.page.MinPay;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.minPaymentAmount) {
          return dataLayer[0].transactions.items.minPaymentAmount;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.minPaymentAmount) {
          return dataLayer[0].basket.items.minPaymentAmount;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbAmendmentDate"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.RPRef) {
          return tui.analytics.page.RPRef;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbAmendmentDetail"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.MMBPayments) {
          return tui.analytics.page.MMBPayments;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbAmendmentType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.AandCType) {
          return tui.analytics.page.AandCType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbAmountOutstanding"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.AmountOutstanding) {
          return tui.analytics.page.AmountOutstanding;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].user && dataLayer[0].user.currentBookings && dataLayer[0].user.currentBookings.amountOustanding) {
          return dataLayer[0].user.currentBookings.amountOustanding;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbAncillaries"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.AcAnc) {
          return tui.analytics.page.AcAnc;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbBookingAmount"] = (function() {
      try {
        if (document.URL.indexOf('your-account') != -1) {
          return (window.tui.analytics.page.Amount || '');
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbBookingType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.BookingType) {
          return tui.analytics.page.BookingType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbExistingBookingDepartureDate"] = (function() {
      try {
        // returns in yyyymmdd format
        if (window.dataLayer && dataLayer[0] && dataLayer[0].user && dataLayer[0].user.currentBookings && dataLayer[0].user.currentBookings.items && dataLayer[0].user.currentBookings.items.departureDate) {
          return dataLayer[0].user.currentBookings.items.departureDate.replace(/-/gi, '');
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbPaymentType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.PayType) {
          return tui.analytics.page.PayType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["mmbTransactionValue"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TransactionValue) {
          return tui.analytics.page.TransactionValue;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["month"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.MonthYear) {
          return tui.analytics.page.MonthYear.substring(0, 2);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.departureMonth && dataLayer[0].transactions.items.departureMonth.split('-')[0] && dataLayer[0].transactions.items.departureMonth.split('-')[1]) {
          return dataLayer[0].transactions.items.departureMonth.split('-')[1];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.departureMonth && dataLayer[0].basket.items.departureMonth.split('-')[0] && dataLayer[0].basket.items.departureMonth.split('-')[1]) {
          return dataLayer[0].basket.items.departureMonth.split('-')[1];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.departureMonth && dataLayer[0].product.departureMonth.split('-')[0] && dataLayer[0].product.departureMonth.split('-')[1]) {
          return dataLayer[0].product.departureMonth.split('-')[1]
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["monthYear"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.MonthYear) {
          return tui.analytics.page.MonthYear;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.departureMonth && dataLayer[0].transactions.items.departureMonth.split('-')[0] && dataLayer[0].transactions.items.departureMonth.split('-')[1]) {
          return dataLayer[0].transactions.items.departureMonth.split('-')[1] + "/" + dataLayer[0].transactions.items.departureMonth.split('-')[0];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.departureMonth && dataLayer[0].basket.items.departureMonth.split('-')[0] && dataLayer[0].basket.items.departureMonth.split('-')[1]) {
          return dataLayer[0].basket.items.departureMonth.split('-')[1] + "/" + dataLayer[0].basket.items.departureMonth.split('-')[0];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.departureMonth && dataLayer[0].product.departureMonth.split('-')[0] && dataLayer[0].product.departureMonth.split('-')[1]) {
          return dataLayer[0].product.departureMonth.split('-')[1] + "/" + dataLayer[0].product.departureMonth.split('-')[0]
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["navigationTracking"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.navigation) {
          return tui.analytics.page.navigation;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["newDataLayer"] = (function() {
      try {
        return dataLayer[0].page ? 'true' : 'false';
      } catch (err) {
        return 'false';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["newSEOdata"] = (function() {
      //Variable Declarations
      var refOrigin = document.createElement('a');
      refOrigin.href = document.referrer;
      var lpurl = window.location.href;
      var urlLength = lpurl.length;
      var siteSection;
      var destination;
      var pageName = (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.pageID) ? dataLayer[0].page.pageID : (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.pageUid) ? tui.analytics.page.pageUid : '';
      var pageType = (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.contextType) ? tui.analytics.page.contextType : '';
      var pageHead = (function() {
        try {
          var a = document.getElementsByClassName('pg-heading')[0].innerText;
          return a
        } catch (err) {
          var a = "null";
          return a
        }
      })()
      var pageTitle = (function() {
        try {
          var a = document.getElementsByClassName('page-title')[0].innerText;
          return a
        } catch (err) {
          var a = "null";
          return a
        }
      })()

      if (document.domain === 'www.tui.co.uk') {
        //TUI SiteSection
        switch (true) {
          //Sections
          case (lpurl.indexOf("cruise") > -1):
            siteSection = 'Cruise';
            break;
          case (lpurl.indexOf("flight") > -1):
            siteSection = 'Flight';
            break;
          case (lpurl.indexOf("city-breaks") > -1):
            siteSection = 'Cities';
            break;
          case (lpurl.indexOf("multi-centre") > -1):
            siteSection = 'Multi-Centre';
            break;
          case (lpurl.indexOf("lakes-and-mountains") > -1):
            siteSection = 'Lakes-and-Mountains';
            break;
          case (lpurl.indexOf("holiday-extras") > -1):
            siteSection = 'Extras';
            break;
          case (lpurl.indexOf("your-account") > -1):
            siteSection = 'Customer-Account';
            break;
          case (lpurl.indexOf("my-thomson-app") > -1):
            siteSection = 'App';
            break;
          case (lpurl.indexOf("travel-information") > -1):
            siteSection = 'Travel-Information';
            break;
          case (lpurl.indexOf("/info/") > -1):
            siteSection = 'Info';
            break;
          case (lpurl.indexOf("blog") > -1):
            siteSection = 'Blog';
            break;
          case (lpurl.indexOf("/hotels/") > -1):
            siteSection = 'Hotels'
            break;
            //Discover
          case (lpurl.indexOf("discover") > -1):
          case (lpurl.indexOf("articles") > -1):
            siteSection = 'Discover';
            break;
            //Destinations
          case (lpurl.indexOf("europe") > -1):
          case (lpurl.indexOf("asia") > -1):
          case (lpurl.indexOf("africa") > -1):
          case (lpurl.indexOf("caribbean") > -1):
          case (lpurl.indexOf("the-americas") > -1):
          case (lpurl.indexOf("indian-ocean") > -1):
          case (lpurl.indexOf("holiday-destinations") > -1):
            siteSection = 'Destinations';
            break;
            //Deals
          case (lpurl.indexOf("deals") > -1):
          case (lpurl.indexOf("free-child-places") > -1):
          case (lpurl.indexOf("last-minute") > -1):
            siteSection = 'Deals';
            break;
            //Collections
          case (lpurl.indexOf("sensatori") > -1):
          case (lpurl.indexOf("sensimar") > -1):
          case (lpurl.indexOf("small-and-friendly") > -1):
          case (lpurl.indexOf("family-life") > -1):
          case (lpurl.indexOf("robinson") > -1):
          case (lpurl.indexOf("villas") > -1):
          case (lpurl.indexOf("gold") > -1):
          case (lpurl.indexOf("platinum") > -1):
          case (lpurl.indexOf("scene") > -1):
          case (lpurl.indexOf("a-la-carte") > -1):
          case (lpurl.indexOf("3t-favourites") > -1):
          case (lpurl.indexOf("skytours") > -1):
          case (lpurl.indexOf("simply") > -1):
          case (lpurl.indexOf("local-flavour") > -1):
          case (lpurl.indexOf("riu") > -1):
          case (lpurl.indexOf("tui-blue") > -1):
          case (lpurl.indexOf("magic-life") > -1):
            siteSection = 'Collections';
            break;
            //Best For
          case (lpurl.indexOf("family") > -1):
          case (lpurl.indexOf("long-haul") > -1):
          case (lpurl.indexOf("luxury") > -1):
          case (lpurl.indexOf("couples") > -1):
          case (lpurl.indexOf("adult") > -1):
          case (lpurl.indexOf("all-inclusive") > -1):
          case (lpurl.indexOf("beach") > -1):
          case (lpurl.indexOf("activity") > -1):
          case (lpurl.indexOf("weddings") > -1):
          case (lpurl.indexOf("nightlife") > -1):
          case (lpurl.indexOf("award-winners") > -1):
          case (lpurl.indexOf("collection") > -1):
          case (lpurl.indexOf("spa") > -1):
          case (lpurl.indexOf("sensatori") > -1):
            siteSection = 'Best-For';
            break;
            //Homepage
          case (window.location.pathname.length == 1):
          case (lpurl.substring(urlLength - 13, urlLength) == 'destinations/'):
            siteSection = 'Homepage'
            break;
            //Other
          case (pageName === "technicaldifficultiespage" || pageName === "pagenotfounderrorpage" || pageName === "sessiontimeoutpage"):
            siteSection = 'Error-Page';
            break;
          default:
            siteSection = 'Other';
            break;
        }
        //TUI Destination
        switch (true) {
          case (siteSection == 'Hotels'):
            destination = document.querySelector("#breadcrumbs").childNodes[3].text;
            break;
          case (siteSection == 'Destinations'):
            if (pageType === "COUNTRY" || pageType === "REGION") {
              destination = pageHead.substring(0, pageHead.length - 10);
            } else if (pageType === "RESORT" || pageType === "DESTINATION") {
              destination = pageTitle;
            }
            break;
          default:
            destination = 'null';
        }
      } else if (document.domain === 'www.firstchoice.co.uk') {
        //FirstChoice SiteSection
        switch (true) {
          //Sections
          case (lpurl.indexOf("holiday-extras") > -1):
            siteSection = 'Extras';
            break;
          case (lpurl.indexOf("your-account") > -1):
            siteSection = 'Customer-Account'
            break;
          case (lpurl.indexOf("my-first-choice-app") > -1):
            siteSection = 'App';
            break;
          case (lpurl.indexOf("travel-information") > -1):
            siteSection = 'Travel-Information';
            break;
          case (lpurl.indexOf("/info/") > -1):
            siteSection = 'Info';
            break;
          case (lpurl.indexOf("blog") > -1):
            siteSection = 'Blog';
            break;
          case (lpurl.indexOf("/accommodation") > -1):
            siteSection = 'Hotels';
            break;
            //Destinations
          case (lpurl.indexOf("location") > -1):
          case (lpurl.substring(urlLength - 12, urlLength) == 'destinations'):
            siteSection = 'Destinations';
            break;
            //Collections
          case (lpurl.indexOf("Holiday-Village") > -1):
          case (lpurl.indexOf("SplashWorld") > -1):
          case (lpurl.indexOf("Magic-Life") > -1):
          case (lpurl.indexOf("SuneoClub") > -1):
          case (lpurl.indexOf("premier-holidays") > -1):
            siteSection = 'Collections';
            break;
            //Best For
          case (lpurl.indexOf("luxury") > -1):
          case (lpurl.indexOf("family") > -1):
          case (lpurl.indexOf("adult") > -1):
          case (lpurl.indexOf("beach") > -1):
          case (lpurl.indexOf("long-haul") > -1):
          case (lpurl.indexOf("award-winners") > -1):
          case (lpurl.indexOf("all-inclusive") > -1):
          case (lpurl.indexOf("activity") > -1):
          case (lpurl.substring(urlLength - 3, urlLength) == 'spa'):
          case (lpurl.substring(urlLength - 9, urlLength) == 'holidays/'):
            siteSection = 'Best-For';
            break;
            //Deals
          case (lpurl.indexOf("deals") > -1):
          case (lpurl.indexOf("last-minute") > -1):
          case (lpurl.indexOf("free-child-places") > -1):
            siteSection = 'Deals';
            break;
            //Homepage
          case (lpurl.substring(urlLength - 10, urlLength) == 'holiday/'):
          case (window.location.pathname.length == 1):
            siteSection = 'Homepage';
            break;
          case (pageName == "technicaldifficultiespage" || pageName === "pagenotfounderrorpage" || pageName === "sessiontimeoutpage"):
            siteSection = 'Error-Page';
            break;
          default:
            siteSection = 'Other';
        }
        //FirstChoice Destination
        switch (true) {
          case (siteSection == 'Hotels'):
            var cutone = lpurl.substring(61, lpurl.length);
            destination = cutone.substring(0, cutone.indexOf("/"));
            break;
          case (siteSection == 'Destinations'):
            destination = pageTitle;
            break;
          default:
            destination = 'null';
        }
      }
      //Output

      //return refOrigin.host + '|' + siteSection + '.' + pageName + '.' + destination + '.' + encodeURIComponent(lpurl);

      if (lpurl.indexOf("utm_medium=TDA") > -1) {
        return "";
      } else {
        return refOrigin.host + '|' + siteSection + '.' + pageName + '.' + destination + '.' + lpurl;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["noOfRooms"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.numberOfRooms) {
          return dataLayer[0].transactions.items.numberOfRooms;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.noOfRooms) {
          return dataLayer[0].basket.items.noOfRooms;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.numberOfRooms) {
          return dataLayer[0].basket.items.numberOfRooms;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.noOfRooms) {
          return dataLayer[0].basket.items.noOfRooms;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.numberOfRooms) {
          return dataLayer[0].product.numberOfRooms;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.noOfRooms) {
          return dataLayer[0].product.noOfRooms;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["numberOfAdults"] = (function() {
      try {
        if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.paxViewData && jsonData.packageViewData.paxViewData.noOfAdults) {
          return jsonData.packageViewData.paxViewData.noOfAdults;
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Adults) {
          return parseInt(tui.analytics.page.Adults);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.paxDetails && dataLayer[0].transactions.total.paxDetails.adults) {
          return dataLayer[0].transactions.total.paxDetails.adults
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.paxDetails && dataLayer[0].basket.price.paxDetails.adults) {
          return dataLayer[0].basket.price.paxDetails.adults;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.noOfAdults) {
          return dataLayer[0].product.noOfAdults;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.noOfAdults) {
          return dataLayer[0].page.search.noOfAdults;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["numberOfChildren"] = (function() {
      try {
        if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.paxViewData && (typeof(jsonData.packageViewData.paxViewData.noOfChildren) != "undefined" && jsonData.packageViewData.paxViewData.noOfChildren >= 0)) {
          return jsonData.packageViewData.paxViewData.noOfChildren;
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Children) {
          return parseInt(tui.analytics.page.Children);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.paxDetails && (typeof(dataLayer[0].transactions.total.paxDetails.children) != "undefined" && dataLayer[0].transactions.total.paxDetails.children >= 0)) {
          return dataLayer[0].transactions.total.paxDetails.children
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.paxDetails && (typeof(dataLayer[0].basket.price.paxDetails.children) != "undefined" && dataLayer[0].basket.price.paxDetails.children >= 0)) {
          return dataLayer[0].basket.price.paxDetails.children;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && (typeof(dataLayer[0].product.noOfChildren) != "undefined" && dataLayer[0].product.noOfChildren >= 0)) {
          return dataLayer[0].product.noOfChildren;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && (typeof(dataLayer[0].page.search.noOfChildren) != "undefined" && dataLayer[0].page.search.noOfChildren >= 0)) {
          return dataLayer[0].page.search.noOfChildren;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["numberOfInfants"] = (function() {
      try {
        if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.paxViewData && (typeof(jsonData.packageViewData.paxViewData.noOfInfants) != "undefined" && jsonData.packageViewData.paxViewData.noOfInfants >= 0)) {
          return jsonData.packageViewData.paxViewData.noOfInfants;
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Infants) {
          return parseInt(tui.analytics.page.Infants);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.paxDetails && (typeof(dataLayer[0].transactions.total.paxDetails.infants) != "undefined" && dataLayer[0].transactions.total.paxDetails.infants >= 0)) {
          return dataLayer[0].transactions.total.paxDetails.infants
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.paxDetails && (typeof(dataLayer[0].basket.price.paxDetails.infants) != "undefined" && dataLayer[0].basket.price.paxDetails.infants >= 0)) {
          return dataLayer[0].basket.price.paxDetails.infants;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && (typeof(dataLayer[0].product.noOfInfants) != "undefined" && dataLayer[0].product.noOfInfants >= 0)) {
          return dataLayer[0].product.noOfInfants;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && (typeof(dataLayer[0].page.search.noOfInfants) != "undefined" && dataLayer[0].page.search.noOfInfants >= 0)) {
          return dataLayer[0].page.search.noOfInfants;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["numberOfPax"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Pax) {
          return tui.analytics.page.Pax;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.paxDetails && dataLayer[0].transactions.total.paxDetails.total) {
          return dataLayer[0].transactions.total.paxDetails.total.toString();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.paxDetails && dataLayer[0].basket.price.paxDetails.total) {
          return dataLayer[0].basket.price.paxDetails.total.toString();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.noOfPax) {
          return dataLayer[0].product.noOfPax.toString();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.noOfPax) {
          return dataLayer[0].page.search.noOfPax.toString();
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["numberOfResults"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Results) {
          return tui.analytics.page.Results;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.noOfResults) {
          return dataLayer[0].page.search.noOfResults;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["onlineDiscount"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Disc) {
          return tui.analytics.page.Disc;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.discount) {
          return Math.round(dataLayer[0].transactions.total.discount).toString();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.discount) {
          return Math.round(dataLayer[0].basket.price.discount).toString();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.discount) {
          return Math.round(dataLayer[0].product.discount).toString();
        } else if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.onlineDiscount) {
          return Math.round(jsonData.packageViewData.onlineDiscount).toString();
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pageID"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.pageUid) {
          return tui.analytics.page.pageUid;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.pageID) {
          return dataLayer[0].page.pageID;
        }
      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pageLoadTimeCount"] = (function() {
      try {
        if (window.performance && performance.timing) {
          return '1';
        }
        return undefined;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pageLoadTimeFullyLoaded"] = (function() {
      try {
        if (window.performance && performance.timing) {
          var returnVal = performance.timing.loadEventEnd - performance.timing.navigationStart;
          return parseInt(returnVal, 10) > 0 ? (parseFloat(returnVal) / 1000).toString() : undefined;
        }
        return undefined;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pageLoadTimeInteractive"] = (function() {
      try {
        if (window.performance && performance.timing) {
          var returnVal = performance.timing.domInteractive - performance.timing.navigationStart;
          return parseInt(returnVal, 10) > 0 ? (parseFloat(returnVal) / 1000).toString() : undefined;
        }
        return undefined;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pageNameTemporary"] = (function() {

      try {

        var path = document.location.href;
        var pathArray = path.split('/');


        if (document.location.hostname.indexOf('thomson.co.uk') != -1 || document.location.hostname.indexOf('thomsonprjuat.co.uk') != -1 || document.location.hostname.indexOf('tui.co.uk') != -1 || document.location.hostname.indexOf('tuiprjuat.co.uk') != -1) {
          // TUI Homepage
          if (document.location.pathname === "/") {
            return "tui:homepage";
          }
          // TUI Cruise
          if (document.location.pathname.match(/^\/$|^\/cruise/) !== null) {
            return "tui:cruises";
          }
          // TUI Flights
          if (document.location.pathname.match(/^\/$|^\/flight/) !== null) {
            return "tui:flights";
          }
          // TUI Deals
          if (document.location.pathname.match(/^\/$|^\/destinations\/deals\/|^\/destinations\/deals/) !== null) {
            return "tui:deals:" + (pathArray[5]);
          }
          // CR Deals - this needs updating
          if (document.location.pathname.match(/^\/$|^\/destinations\/info\/summer-2016-cruises/) !== null) {
            return "tui:cruises:deals:" + (pathArray[5]);
          }
          // Flight Deals
          if (document.location.pathname.match(/^\/$|^\/flight\/deals/) !== null) {
            return "tui:flights:deals";
          }
          // Deals Landing Page
          if (document.location.pathname.match(/^\/$|^\/destinations\/holiday-destinations/) !== null) {
            return "tui:hol:destinations";
          }
          // TUI Country Browse
          if (document.location.pathname.match(/^\/$|^\/destinations\/africa\/|^\/destinations\/asia\/|^\/destinations\/indian-ocean\/|^\/destinations\/middle-east\/|^\/destinations\/caribbean\/|^\/destinations\/europe\/|^\/destinations\/the-americas\/|^\/destinations\/africa\//) !== null) {
            return "tui:hol:destinations:" + (pathArray[5]);
          }
          // TUI Region/Destination Browse
          if (document.location.pathname.match(/^\/$|^\/destinations\/africa\/|^\/destinations\/asia\/|^\/destinations\/indian-ocean\/|^\/destinations\/middle-east\/|^\/destinations\/caribbean\/|^\/destinations\/europe\/|^\/destinations\/the-americas\//) !== null) {
            return "tui:hol:destinations:" + (pathArray[5]) + ":" + (pathArray[6]);
          }
          // TUI Resort Browse
          if (document.location.pathname.match(/^\/$|^\/destinations\/africa\/.*\/.*\/.*\/|^\/destinations\/asia\/.*\/.*\/.*\/|^\/destinations\/indian-ocean\/.*\/.*\/.*\/|^\/destinations\/middle-east\/.*\/.*\/.*\/|^\/destinations\/caribbean\/.*\/.*\/.*\/|^\/destinations\/europe\/.*\/.*\/.*\/|^\/destinations\/the-americas\/.*\/.*\/.*\//) !== null) {
            return "tui:hol:destinations:" + (pathArray[5]) + ":" + (pathArray[7]);
          }
          // TUI Hotel Browse
          if (document.location.pathname.match(/^\/$|^\/destinations\/africa\/.*\/.*\/.*\/.*\/.*|^\/destinations\/asia\/.*\/.*\/.*\/.*\/.*|^\/destinations\/indian-ocean\/.*\/.*\/.*\/.*\/.*|^\/destinations\/middle-east\/.*\/.*\/.*\/.*\/.*|^\/destinations\/caribbean\/.*\/.*\/.*\/.*\/.*|^\/destinations\/europe\/.*\/.*\/.*\/.*\/.*|^\/destinations\/the-americas\/.*\/.*\/.*\/.*\/.*/) !== null) {
            return "tui:hol:destinations:" + (pathArray[5]) + ":" + (pathArray[7]);
          }
        } else if (document.location.hostname.indexOf('firstchoice.co.uk') != -1 || document.location.hostname.indexOf('firstchoiceprjuat.co.uk') != -1) {
          // FC Homepage
          if (document.location.pathname === "/") {
            return "fc:homepage";
          }
          // FC Deals
          if (document.location.pathname.match(/^\/$|^\/holiday\/deals\/|^\/holiday\/deals/) !== null) {
            return "fc:deals:" + (pathArray[5]);
          }
          // FC Deals Landing
          if (document.location.pathname.match(/^\/$|^\/holiday\/destinations/) !== null) {
            return "fc:hol:destinations";
          }
        } else if (document.location.hostname.indexOf('falconholidays.ie') != -1 || document.location.hostname.indexOf('falconholidaysprjuat.ie') != -1 || document.location.hostname.indexOf('tuiholidays.ie') != -1 || document.location.hostname.indexOf('tuiholidaysprjuat.ie') != -1) {
          // TUI IE Homepage
          if (document.location.pathname === "/") {
            return "fal:homepage";
          }
          // TUI IE Deals
          if (document.location.pathname.match(/^\/$|^\/f\/deals\/|^\/f\/deals/) !== null) {
            return "fal:deals:" + (pathArray[5]);
          }
          //TUI IE Deals
          if (document.location.pathname.match(/^\/$|^\/f\/holiday-destinations/) !== null) {
            return "fal:hol:destinations";
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pagePath"] = (function() {
      try {
        if (window.location.pathname) {
          var pagePath = window.location.pathname + window.location.search;
          return pagePath;
        } else {
          return "error";
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pageSubCategory"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.pageID && dataLayer[0].page.pageID == 'lockYourPriceConfirmationpage_react') {
          return 'Lock Your Price ' + dataLayer[0].page.pageSubCategory;
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.pageUid && tui.analytics.pageUid == 'lockYourPriceConfirmationpage_react') {
          return 'Lock Your Price ' + dataLayer[0].page.pageSubCategory;
        } else {
          return dataLayer[0].page.pageSubCategory;
        }
      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pageURL"] = (function() {
      try {
        var url = [location.protocol, '//', location.host, location.pathname].join('');
        return url;
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["paymentType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.PayType) {
          return tui.analytics.page.PayType;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.paymentType) {
          return dataLayer[0].transactions.total.paymentType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["ppcVariant"] = (function() {
      try {
        if (window.location.search.indexOf('ppcvariant') != -1) {
          return window.location.search.replace("?", "&")
            .split("&ppcvariant=").pop()
            .split("&").shift();
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["preferredSearchAvailable"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.isPreferredSearchAvailable) {
          return dataLayer[0].page.search.isPreferredSearchAvailable;
        }

      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["price"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Sum) {
          if (tui.analytics.page.bookingLevelCreditNoteDiscount && parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount) > 0) {
            return (parseFloat(tui.analytics.page.bookingLevelCreditNoteDiscount) + parseFloat(tui.analytics.page.Sum)).toString();
          } else {
            return tui.analytics.page.Sum;
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.totalPrice) {
          if (dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount && dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount > 0) {
            return (dataLayer[0].transactions.total.bookingLevelCreditNoteDiscount + dataLayer[0].transactions.total.totalPrice).toString();
          } else {
            return dataLayer[0].transactions.total.totalPrice.toString();
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.totalPrice) {
          if (dataLayer[0].basket.price.bookingLevelCreditNoteDiscount && dataLayer[0].basket.price.bookingLevelCreditNoteDiscount > 0) {
            return (dataLayer[0].basket.items.bookingLevelCreditNoteDiscount + dataLayer[0].basket.price.totalPrice).toString();
          } else {
            return dataLayer[0].basket.price.totalPrice.toString();
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.currentPrice) {
          return dataLayer[0].product.currentPrice.toString();
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["priceVariationAlert"] = (function() {
      try {
        if (document.URL.indexOf('/book/flow/summary') !== -1 || document.URL.indexOf('/book/passengerdetails') !== -1 || document.URL.indexOf('/cps/pageRender') !== -1) {
          var priceStatus = document.querySelectorAll('.PriceVariationAlert__infoTextHeading');
          var price = document.querySelectorAll('.alertprice');

          if (priceStatus.length > 0 && priceStatus[0].innerText.includes("INCREASED")) {
            return "Price Increased|" + price[0].innerText.replace(/[£€]/g, '');
          } else if (priceStatus.length > 0 && priceStatus[0].innerText.includes("DECREASED")) {
            return "Price Decreased|" + -price[0].innerText.replace(/[£€]/g, '');
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Privacy - Analytics Experience"] = (function() {
      try {
        var experience = Bootstrapper.gateway && Bootstrapper.gateway.getCookie ? Bootstrapper.gateway.getCookie('Experience') : Bootstrapper.Cookies.get ? Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Experience') : '';
        switch (experience) {
          case 'A':
            return 'cookie consent - modal experience A';
          case 'B':
            return 'cookie consent - banner experience B';
          case 'C':
            return 'cookie consent - control experience C';
          case 'Av2':
            return 'cookie consent - modal experience A v2';
          case 'Bv2':
            return 'cookie consent - modal experience B v2';
          case 'Cv2':
            return 'cookie consent - modal experience C v2 - control';
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Privacy - Experience"] = (function() {
      try {
        return Bootstrapper.gateway ? Bootstrapper.gateway.getCookie('Experience') : undefined;
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Privacy - Opted-out Categories"] = (function() {
      try {
        var types = Bootstrapper.gateway.getCookieTypes(),
          cookiesNotSet = [],
          returnVal = [];

        for (var i = 0; i < types.length; i++) {
          var currentType = types[i];
          if (Bootstrapper.gateway.getCookie(currentType) === '0') {
            returnVal.push(currentType);
          } else if (!Bootstrapper.gateway.getCookie(currentType)) {
            cookiesNotSet.push(currentType);
          }
        }

        if (cookiesNotSet.length === types.length) {
          // cookies have not been set
          return undefined;
        } else if (returnVal.length === 0) {
          return 'all categories accepted';
        }
        return returnVal.join(',').toLowerCase();
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["Privacy - Opted-out Categories Page Load"] = (function() {
      try {
        if (Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Experience') == 'C') {
          return 'not applicable';
        } else if (Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Personalisation') == '0' && Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Targeting_and_Advertising') == '0') {
          return 'personalisation,targeting and advertising';
        } else if (Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Personalisation') == '1' && Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Targeting_and_Advertising') == '1') {
          return 'all categories accepted';
        } else if (Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Personalisation') == '1' && Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Targeting_and_Advertising') == '0') {
          return 'targeting and advertising';
        } else if (Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Personalisation') == '0' && Bootstrapper.Cookies.get('TUI_ENSIGHTEN_PRIVACY_Targeting_and_Advertising') == '1') {
          return 'personalisation';
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }

    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["productCollectionCode"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.SubProd) {
          return tui.analytics.page.SubProd;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.productCollectionCode) {
          return dataLayer[0].transactions.items.productCollectionCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.productCollectionCode) {
          return dataLayer[0].basket.items.productCollectionCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.productCollectionCode) {
          return dataLayer[0].product.productCollectionCode;
        }


      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["productCollectionName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.productCollectionName) {
          return dataLayer[0].transactions.items.productCollectionName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.productCollectionName) {
          return dataLayer[0].basket.items.productCollectionName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.productCollectionName) {
          return dataLayer[0].product.productCollectionName;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["productID"] = (function() {
      try {
        // WhereTo for both regular holidays and cruises
        if (window.dataLayer && dataLayer[0] && dataLayer[0].page) {
          var dl = dataLayer[0];
          if (dl.transactions && dl.transactions.items && dl.transactions.items.productID) {
            return dl.transactions.items.productID;
          } else if (dl.basket && dl.basket.items && dl.basket.items.productID) {
            return dl.basket.items.productID;
          } else if (dl.product && dl.product.productID) {
            return dl.product.productID;
          } else if (dl.page.search && dl.page.search.destinationId) {
            return dataLayer[0].page.search.destinationId;
          }




        } else {
          if (String(typeof tui.analytics.page.CRWhereTo) !== 'undefined') {
            return tui.analytics.page.CRWhereTo;
          } else if (String(typeof tui.analytics.page.WhereTo) !== 'undefined') {
            return tui.analytics.page.WhereTo;
          }
        }
        return 'none';
      } catch (err) {
        return 'none';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["productTypeMoney4Travel"] = (function() {
      var element = document.querySelector("#content > div > div.summary.review > div.basket.payment-summary > div > div:nth-child(1) > h3:nth-child(1) > span");
      return element ? element.textContent : "";
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["programmeChangeFreeAmends"] = (function() {
      try {
        var freeDaysOriginal = '',
          freeDaysLeft = '';
        if (window.dataLayer && dataLayer[0] && dataLayer[0].user && dataLayer[0].user.currentBookings && dataLayer[0].user.currentBookings.freeAmendDaysOriginal != undefined && dataLayer[0].user.currentBookings.freeAmendDaysLeft != undefined) {
          if (dataLayer[0].user.currentBookings.freeAmendDaysOriginal == 0) {
            freeDaysOriginal = 'Zero';
          } else {
            freeDaysOriginal = dataLayer[0].user.currentBookings.freeAmendDaysOriginal.toString();
          }
          if (dataLayer[0].user.currentBookings.freeAmendDaysLeft == 0) {
            freeDaysLeft = 'Zero';
          } else {
            freeDaysLeft = dataLayer[0].user.currentBookings.freeAmendDaysLeft.toString();
          }
          return freeDaysOriginal + '|' + freeDaysLeft;
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["programmeChangeIncentiveCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0]) {

          if (dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCodes && dataLayer[0].transactions.total.bookingLevelPromoCodes.length > 0) {
            var promoCodeArray = dataLayer[0].transactions.total.bookingLevelPromoCodes;
            for (i = 0; i < promoCodeArray.length; i++) {
              if (/CVRHC|CVRW20|CVRS21/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                return promoCodeArray[i].bookingLevelPromoCode;
              }
            }
          } else if (dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCode && typeof dataLayer[0].transactions.total.bookingLevelPromoCode !== 'undefined') {
            if (/CVRHC|CVRW20|CVRS21/i.test(dataLayer[0].transactions.total.bookingLevelPromoCode)) {
              return dataLayer[0].transactions.total.bookingLevelPromoCode;
            }
          } else if (dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelPromoCodes && dataLayer[0].basket.price.bookingLevelPromoCodes.length > 0) {
            var promoCodeArray = dataLayer[0].basket.price.bookingLevelPromoCodes;
            for (i = 0; i < promoCodeArray.length; i++) {
              if (/CVRHC|CVRW20|CVRS21/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
                return promoCodeArray[i].bookingLevelPromoCode;
              }
            }
          } else if (dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelPromoCode && typeof dataLayer[0].basket.price.bookingLevelPromoCode !== 'undefined') {
            if (/CVRHC|CVRW20|CVRS21/i.test(dataLayer[0].basket.price.bookingLevelPromoCode)) {
              return dataLayer[0].basket.price.bookingLevelPromoCode;
            }
          }
        } else if (window.tui && tui.analytics && tui.analytics.page) {
          if (typeof tui.analytics.page.PromoCode !== 'undefined' && tui.analytics.page.PromoCode !== 'null') {
            if (/CVRHC|CVRW20|CVRS21/i.test(tui.analytics.page.PromoCode)) {
              return tui.analytics.page.PromoCode;
            }
          }
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["programmeChangeMemoNotes"] = (function() {
      // Returns a comma separated list of memo notes from the memoNotes array
      try {
        if (window.dataLayer[0] && dataLayer[0].user && dataLayer[0].user.currentBookings && dataLayer[0].user.currentBookings.memoNotes) {
          var results = [];
          var memoArray = dataLayer[0].user.currentBookings.memoNotes;

          for (i = 0; i < memoArray.length; i++) {
            results.push(memoArray[i].memoNoteCode);
          }

          if (results.length > 0) {
            return results.join(",")
          } else {
            return undefined;
          }
        }
      } catch (err) {
        return undefined;
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["promoCodeName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCodes && dataLayer[0].transactions.total.bookingLevelPromoCodes.length > 0) {
          var promoCodeArray = dataLayer[0].transactions.total.bookingLevelPromoCodes;
          for (i = 0; i < promoCodeArray.length; i++) {
            if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
              return '';
            } else {
              return promoCodeArray[i].bookingLevelPromoCode;
            }
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelPromoCodes && dataLayer[0].basket.price.bookingLevelPromoCodes.length > 0) {
          var promoCodeArray = dataLayer[0].basket.price.bookingLevelPromoCodes;
          for (i = 0; i < promoCodeArray.length; i++) {
            if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
              return '';
            } else {
              return promoCodeArray[i].bookingLevelPromoCode;
            }
          }
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.PromoCode) {
          if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(tui.analytics.page.PromoCode)) {
            return '';
          } else {
            return tui.analytics.page.PromoCode;
          }
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.bookingLevelPromoCode) {
          if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(tui.analytics.page.bookingLevelPromoCode)) {
            return '';
          } else {
            return tui.analytics.page.bookingLevelPromoCode;
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCode) {
          if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(dataLayer[0].transactions.total.bookingLevelPromoCode)) {
            return '';
          } else {
            return dataLayer[0].transactions.total.bookingLevelPromoCode;
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelPromoCode) {
          if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(dataLayer[0].basket.price.bookingLevelPromoCode)) {
            return '';
          } else {
            return dataLayer[0].basket.price.bookingLevelPromoCode;
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["promoCodeValue"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCodes && dataLayer[0].transactions.total.bookingLevelPromoCodes.length > 0) {
          var promoCodeArray = dataLayer[0].transactions.total.bookingLevelPromoCodes;
          for (i = 0; i < promoCodeArray.length; i++) {
            if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
              return '';
            } else {
              return promoCodeArray[i].bookingLevelPromoDiscount;
            }
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelPromoCodes && dataLayer[0].basket.price.bookingLevelPromoCodes.length > 0) {
          var promoCodeArray = dataLayer[0].basket.price.bookingLevelPromoCodes;
          for (i = 0; i < promoCodeArray.length; i++) {
            if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(promoCodeArray[i].bookingLevelPromoCode)) {
              return '';
            } else {
              return promoCodeArray[i].bookingLevelPromoDiscount;
            }
          }
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.PromoCode) {
          if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(tui.analytics.page.PromoCode)) {
            return '';
          } else {
            return tui.analytics.page.PromoValue;
          }
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.bookingLevelPromoCode) {
          if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(tui.analytics.page.bookingLevelPromoCode)) {
            return '';
          } else {
            return tui.analytics.page.bookingLevelPromoDiscount;
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCode) {
          if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(dataLayer[0].transactions.total.bookingLevelPromoCode)) {
            return '';
          } else {
            return dataLayer[0].transactions.total.bookingLevelPromoDiscount;
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.bookingLevelPromoCode) {
          if (/CVRHC|CVRW20|CVRS21|CVRI|CVRM|CVRV/i.test(dataLayer[0].basket.price.bookingLevelPromoCode)) {
            return '';
          } else {
            return dataLayer[0].basket.price.bookingLevelPromoDiscount;
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["protocol"] = (function() {
      try {
        if (window.location && window.location.protocol) {
          return window.location.protocol;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["purchaseID"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Tracsref && tui.analytics.page.pageUid != 'lockYourPriceConfirmationpage_react') {
          return tui.analytics.page.Tracsref;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.transactionId && dataLayer[0].page.pageID != 'lockYourPriceConfirmationpage_react') {
          return dataLayer[0].transactions.total.transactionId;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["pushData"] = (function() {

      function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }

      try {
        var host = window.location.host,
          imid = getParameterByName('im_id'),
          ipid = getParameterByName('ip_id');

        if (host && ipid && imid === 'Push') {
          return host + '|' + 'PushNotification' + '.' + ipid + '.' + ipid + '.' + ipid
        } else {
          return ''
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["queryString"] = (function() {
      try {
        return document.URL.split('?')[1];
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["queryStringParamCmid"] = (function() {
      return window.location.search.replace("?", "&")
        .split("&cmid=").pop()
        .split("&").shift();
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["queryStringParamGclid"] = (function() {
      return window.location.search.replace("?", "&")
        .split("&gclid=").pop()
        .split("&").shift();
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["queryStringParamIkid"] = (function() {
      return window.location.search.replace("?", "&")
        .split("&ik_id=").pop()
        .split("&").shift();
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["queryStringParamIto"] = (function() {
      return window.location.search.replace("?", "&")
        .split("&ito=").pop()
        .split("&").shift();
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["queryStringParamQ"] = (function() {
      return window.location.search.replace("?", "&")
        .split("&q=").pop()
        .split("&").shift();
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["queryStringParamVlid"] = (function() {
      try {
        return Bootstrapper.getQueryParam('vlid') || Bootstrapper.getQueryParam('vlids') || Bootstrapper.getQueryParam('VLID');
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["regionCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.regionCode) {
          return dataLayer[0].transactions.items.geo.regionCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.regionCode) {
          return dataLayer[0].basket.items.geo.regionCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.regionCode) {
          return dataLayer[0].product.geo.regionCode;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["regionName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.regionName) {
          return dataLayer[0].transactions.items.geo.regionName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.regionName) {
          return dataLayer[0].basket.items.geo.regionName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.regionName) {
          return dataLayer[0].product.geo.regionName;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["resortCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.resortID) {
          return dataLayer[0].transactions.items.geo.resortID;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.resortID) {
          return dataLayer[0].basket.items.geo.resortID;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.resortID) {
          return dataLayer[0].product.geo.resortID;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["resortName"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.geo && dataLayer[0].transactions.items.geo.resortName) {
          return dataLayer[0].transactions.items.geo.resortName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.geo && dataLayer[0].basket.items.geo.resortName) {
          return dataLayer[0].basket.items.geo.resortName;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.geo && dataLayer[0].product.geo.resortName) {
          return dataLayer[0].product.geo.resortName;
        } else if (window.jsonData && jsonData.packageViewData && jsonData.packageViewData.accomViewData[0] && jsonData.packageViewData.accomViewData[0].resortName) {
          return jsonData.packageViewData.accomViewData[0] && jsonData.packageViewData.accomViewData[0].resortName;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["retailVisitorIDValueChange"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.RetVisID) {
          return tui.analytics.page.RetVisID;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["returnDate"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.DepDate && tui.analytics.page.MonthYear) {
          var date1 = tui.analytics.page.DepDate;
          var month1 = tui.analytics.page.MonthYear.substring(0, 2);
          var year1 = tui.analytics.page.MonthYear.substring(3, 7);
          var duration = (window.location.href.indexOf('/cruise/book/') > -1) ? tui.analytics.page.CRDur : tui.analytics.page.Dur;
          var addition = parseInt(date1, 10) + parseInt(duration, 10);
          var depDate = new Date(year1, month1, date1);
          var outDate = new Date(depDate);
          outDate.setDate(addition);
          var date2 = String(outDate.getDate());
          var date3;
          var d = date2.length;
          if (d == 2) {
            date3 = date2;
          }
          if (d == 1) {
            date3 = '0' + date2;
          }
          var month2 = String(outDate.getMonth());
          var month3;
          var m = month2.length;
          if (m == 2) {
            month3 = month2;
          }
          if (m == 1) {
            month3 = '0' + month2;
          }

          var year2 = outDate.getFullYear();
          var lastDate = year2 + '-' + month3 + '-' + date3;
          return lastDate;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.returnDate) {
          return dataLayer[0].transactions.items.returnDate;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.returnDate) {
          return dataLayer[0].basket.items.returnDate;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.returnDate) {
          return dataLayer[0].product.returnDate;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["revenueMoney4Travel"] = (function() {
      var element = document.querySelector(".grand-total.align-right");
      return element ? element.textContent : "";
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["roomAllocation"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.RmAlloc) {
          return tui.analytics.page.RmAlloc;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["roomComposition"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Adults && tui.analytics.page.Children && tui.analytics.page.Infants) {
          return tui.analytics.page.Adults + '/' + window.tui.analytics.page.Children + '/' + window.tui.analytics.page.Infants;
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Party) {
          return tui.analytics.page.Party;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.roomComposition) {
          return dataLayer[0].transactions.items.roomComposition;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.roomComposition) {
          return dataLayer[0].basket.items.roomComposition;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.roomComposition) {
          return dataLayer[0].product.roomComposition;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.resultsList[0] && dataLayer[0].page.search.resultsList[0].roomComposition) {
          return dataLayer[0].page.search.resultsList[0].roomComposition;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["roomOrCabinType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.RmSlt) {
          return tui.analytics.page.RmSlt;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["screenSizeIncludingIPhones"] = (function() {
      try {
        if (typeof screen.width === "number" && typeof screen.height === "number") {
          return (screen.width + "x" + screen.height);
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["searchedDepartureDate"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.OrigDepDate) {
          return tui.analytics.page.OrigDepDate;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["searchedDestinationIDs"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.searchedDestinationId) {
          return dataLayer[0].page.search.searchedDestinationId;
        }

      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["searchedDestinationNames"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.searchedDestinationName) {
          return dataLayer[0].page.search.searchedDestinationName;
        }

      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["searchResultsFinalPosition"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.FinPos) {
          return tui.analytics.page.FinPos;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.finalPosition) {
          return dataLayer[0].product.finalPosition;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["searchType"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.SearchType && tui.analytics.page.SearchType != 'null') {
          return tui.analytics.page.SearchType;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.searchType) {
          return dataLayer[0].page.search.searchType;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["season"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.MonthYear) {
          var season = '';
          var d = tui.analytics.page.MonthYear.split('/');
          var m = d[0];
          var y = d[1].slice(-2);

          if (m >= 1 && m <= 4) {
            season = 'W' + (y - 1);
          } else if (m >= 5 && m <= 10) {
            season = 'S' + y;
          } else if (m >= 11) {
            season = 'W' + y;
          }
          return season;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.departureSeason) {
          return dataLayer[0].transactions.items.departureSeason;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.departureSeason) {
          return dataLayer[0].basket.items.departureSeason;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.departureSeason) {
          return dataLayer[0].product.departureSeason;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.search && dataLayer[0].page.search.resultsList[0] && dataLayer[0].page.search.resultsList[0].departureSeason) {
          return dataLayer[0].page.search.resultsList[0].departureSeason;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["sellingCode"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.sellingCode) {
          return String(dataLayer[0].transactions.items.sellingCode);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.sellingCode) {
          return String(dataLayer[0].basket.items.sellingCode);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.sellingCode) {
          return String(dataLayer[0].product.sellingCode);
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["sessionID"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.sessionID) {
          return tui.analytics.sessionID;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["sessionState"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.sessionState) {
          return tui.analytics.page.sessionState;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page && dataLayer[0].page.sessionState) {
          return dataLayer[0].page.sessionState;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["shortlist"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Shortlist) {
          return tui.analytics.page.Shortlist;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["siteSection"] = (function() {
      try {
        // function for returning Site Section, used in Adobe Site Section (s.channel). Copied from Tag "WA - SiteCat Page Code" on 28/04/19
        var b = Bootstrapper.getQueryParam('b'),
          host = location.host,
          path = location.pathname;

        if (~host.indexOf('thomson.co.uk') || ~host.indexOf('thomsonprjuat.co.uk')) {
          if (~b.indexOf('25000') || ~b.indexOf('32000') || ~b.indexOf('19000') || ~b.indexOf('41000') || ~b.indexOf('50000') || (location.pathname.match(/^\/$|^\/destinations\/?|^\/holidays\/?|^\/editorial\/?|^\/late-deals\/?|^\/brochures\/?|^\/blog\/?|^\/deals\/?|^\/villas\/?|^\/thomson\/page\/byo/) !== null) && (location.pathname.match(/cruise(s?)/) === null)) {
            return 'TH Beach';
          } else if (~host.indexOf('flights.thomson.co.uk') || ~host.indexOf('flights.thomsonprjuat.co.uk') || ~b.indexOf('15000') || ~b.indexOf('39000') || ~b.indexOf('40000') || path.match(/^\/$|^\/flight\/|^\/flights\//)) {
            return 'TH Flight-Only';
          } else if (~b.indexOf('18000') || ~b.indexOf('37000') || ~b.indexOf('49000') || ~b.indexOf('54000') || path.match(/^\/$|^\/cruise\/|^\/cruise-deals\/|cruise(s?)/)) {
            return 'TH Cruise';
          } else if (~b.indexOf('6000') || path.match(/^\/$|^\/accom\/page\/|^\/hotels\//)) {
            return 'TH Accomm Only';
          }
        } else if (~host.indexOf('firstchoice.co.uk') || ~host.indexOf('firstchoiceprjuat.co.uk')) {
          if (~b.indexOf('31000') || ~b.indexOf('10000') || ~b.indexOf('52000') || ~b.indexOf('20000') || ~b.indexOf('42000') || path.match(/^\/$|^\/holiday\/?|^\/holidays\/?|^\/sun-holidays\/?|^\/last-minute-holidays\/?|^\/destinations\/?|^\/departure-airports\/?|^\/last-minute-deals\/?|^\/2wentys|^\/myholidayalerts/)) {
            return 'FC Beach';
          } else if (~b.indexOf('12000') || path.match(/^\/$|^\/hotels\/|^\/accom\//)) {
            return 'FC Accomm Only';
          } else if (path === '/') {
            return 'FC Beach';
          }
        } else if (~host.indexOf('falconholidays.ie') || ~host.indexOf('falconholidaysprjuat.ie')) {
          if (~b.indexOf('38000') || path.match(/^\/$|^\/f\//)) {
            return 'Falcon';
          } else if (~b.indexOf('47000') || ~b.indexOf('48000') || path.match(/^\/$|^\/flight\/|^\/flights\//)) {
            return 'Falcon FO';
          }
        } else if (~host.indexOf('retailagents.tui.co.uk') || ~host.indexOf('retailagents.tuiprjuat.co.uk')) {
          if (path.match(/^\/$|^\/retail\/flight\/|^\/retail\/flights\//)) {
            return 'TUI UK Flight-Only (Retail)';
          } else if (path.match(/^\/$|^\/retail\/river-cruise(s?)\/|river-cruise(s?)/)) {
            return 'TUI UK River Cruise (Retail)';
          } else if (path.match(/^\/$|^\/retail\/cruise\//)) {
            return 'TUI UK Cruise (Retail)';
          } else if (path.match(/^\/$|^\/retail\/|^\/holidays\//)) {
            return 'TUI UK Beach (Retail)';
          }
        } else if (~host.indexOf('retailagents.tuiholidays.ie') || ~host.indexOf('retailagents.tuiholidaysprjuat.ie')) {
          if (path.match(/^\/$|^\/retail\/flight\//)) {
            return 'TUI IE Flight-Only (Retail)';
          } else if (path.match(/^\/$|^\/retail\/river-cruise(s?)\/|river-cruise(s?)/)) {
            return 'TUI IE River Cruise (Retail)';
          } else if (path.match(/^\/$|^\/retail\/cruise\//)) {
            return 'TUI IE Cruise (Retail)';
          } else if (path.match(/^\/$|^\/retail\/f\//)) {
            return 'TUI IE Beach (Retail)';
          }
        } else if (~host.indexOf('tui.co.uk') || ~host.indexOf('tuiprjuat.co.uk')) {
          if (~b.indexOf('25000') || ~b.indexOf('32000') || ~b.indexOf('19000') || ~b.indexOf('41000') || ~b.indexOf('50000') || ~b.indexOf('51000') || path.match(/^\/$|^\/destinations\/?|^\/holidays\/?|^\/editorial\/?|^\/late-deals\/?|^\/brochures\/?|^\/blog\/?|^\/deals\/?|^\/villas\/?|^\/thomson\/page\/byo/) && !path.match(/cruise(s?)/)) {
            return 'TUI UK Beach';
          } else if (~host.indexOf('flights.tui.co.uk') || ~host.indexOf('flights.tuiprjuat.co.uk') || ~b.indexOf('15000') || ~b.indexOf('39000') || ~b.indexOf('40000') || ~b.indexOf('59000') || path.match(/^\/$|^\/flight\/|^\/flights\//)) {
            return 'TUI UK Flight-Only';
          } else if (~b.indexOf('58000') || path.match(/^\/$|^\/river-cruise(s?)\/|^\/river-cruise-deals\/|river-cruise(s?)/)) {
            return 'TUI UK River Cruise';
          } else if (~b.indexOf('18000') || ~b.indexOf('37000') || ~b.indexOf('49000') || ~b.indexOf('54000') || path.match(/^\/$|^\/cruise\/|^\/cruise-deals\/|cruise(s?)/)) {
            return 'TUI UK Cruise';
          } else if (~b.indexOf('6000') || path.match(/^\/$|^\/accom\/page\/|^\/hotels\//)) {
            return 'TUI UK Accomm Only';
          }
        }
        if (~host.indexOf('tuiholidays.ie') || ~host.indexOf('tuiholidaysprjuat.ie')) {
          if (~b.indexOf('38000') || ~b.indexOf('53000') || path.match(/^\/$|^\/f\//)) {
            return 'TUI IE Beach';
          } else if (~b.indexOf('47000') || ~b.indexOf('48000') || ~b.indexOf('60000') || path.match(/^\/$|^\/flight\/|^\/flights\//)) {
            return 'TUI IE Flight-Only';
          }
        } else if (host.match(/(tuiretailhish\-(live|st.*|hybd.*)\.thomsonuk\.dnsroot\.biz)/g)) {
          if (path.match(/^\/$|^\/retail\/flight\/|^\/retail\/flights\//)) {
            return 'TUI UK Flight-Only (Retail)';
          } else if (path.match(/^\/$|^\/retail\/river-cruise(s?)\/|river-cruise(s?)/)) {
            return 'TUI UK River Cruise (Retail)';
          } else if (path.match(/^\/$|^\/retail\/cruise\//)) {
            return 'TUI UK Cruise (Retail)';
          } else if (path.match(/^\/$|^\/retail\/|^\/holidays\//)) {
            return 'TUI UK Beach (Retail)';
          }
        } else if (host.match(/(falconretailhish\-(live|st.*|hyd.*)\.thomsonuk\.dnsroot\.biz)/g)) {
          if (path.match(/^\/$|^\/retail\/flight\//)) {
            return 'TUI IE Flight-Only (Retail)';
          } else if (path.match(/^\/$|^\/retail\/river-cruise(s?)\/|river-cruise(s?)/)) {
            return 'TUI IE River Cruise (Retail)';
          } else if (path.match(/^\/$|^\/retail\/cruise\//)) {
            return 'TUI IE Cruise (Retail)';
          } else if (path.match(/^\/$|^\/retail\/f\//)) {
            return 'TUI IE Beach (Retail)';
          }
        }
        return '';
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["siteSubSection"] = (function() {
      try {
        // function for returning Site SubSection (evar1). Copied from Tag "WA - SiteCat Page Code" on 24/10/17
        var pageUid = '',
          geoLevel = '',
          host = location.host,
          path = location.pathname;

        if (window.tui && tui.analytics && tui.analytics.page) {
          pageUid = tui.analytics.page.pageUid || '';
          geoLevel = tui.analytics.page.contextType || '';
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].page) {
          pageUid = dataLayer[0].page.pageID || '';
          geoLevel = dataLayer[0].page.pageCategory || '';
        }

        if (~host.indexOf('thomson.co.uk') ||
          ~host.indexOf('thomsonprjuat.co.uk') ||
          ~host.indexOf('flights.thomson.co.uk') ||
          ~host.indexOf('flights.thomsonprjuat.co.uk') ||
          ~host.indexOf('firstchoice.co.uk') ||
          ~host.indexOf('firstchoiceprjuat.co.uk') ||
          ~host.indexOf('falconholidays.ie') ||
          ~host.indexOf('falconholidaysprjuat.ie') ||
          ~host.indexOf('tui.co.uk') ||
          ~host.indexOf('tuiprjuat.co.uk') ||
          ~host.indexOf('flights.tui.co.uk') ||
          ~host.indexOf('flights.tuiprjuat.co.uk') ||
          ~host.indexOf('tuiholidays.ie') ||
          ~host.indexOf('tuiholidaysprjuat.ie')) {
          if (path === '/') {
            return 'Home Page/Landing Page';
          } else if (path.match(/^\/$|^\/blog|^\/blog\//)) {
            return 'Blog';
          } else if (path.match(/^\/$|^\/holidays\/lakes-and-mountains|^\/destinations\/info\/why-lakes-and-mountains|^\/destinations\/deals\/italian-lakes-deals|^\/destinations\/deals\/lakes-mountains-platinum|^\/destinations\/deals\/austria-deals|^\/destinations\/deals\/lake-garda-deals|^\/destinations\/deals\/lakes-mountains-summer-holidays/)) {
            return 'Lakes & Mountains';
          } else if ((pageUid === 'lastMinuteHolidayFinderPage') || (pageUid == 'page_00000IIZ') || path.match(/^\/$|^\/destinations\/deals\/|^\/destinations\/deals|^\/deals\/summer-2016-cruises|^\/holiday\/deals\/|^\/holiday\/deals|^\/f\/deals\/|^\/f\/deals|^\/flight\/deals|^\/flight\/deals\//)) {
            return 'Deals';
          } else if (path.match(/^\/$|^\/destinations\/multi-centre\/|^\/holidays\/multi-centre/)) {
            return 'MultiCentres';
          } else if (/^(ACCOMMODATION|RESORT|DESTINATION|REGION|COUNTRY|destinationlanding|ATTRACTION|ITINERARY|PORTS OF CALL|CRUISE REGION LANDING|CRUISE DESTINATION LANDING|SHIPS LANDING|SHIP|CRUISE & STAY LANDING|cruise-calender|ONBOARD-EXPERIENCE|PORTS OF CALL LANDING)$/.test(geoLevel) || path.match(/^\/$|^\/thomson\/en-GB\/timetable\/default|^\/flight\/arrivals-and-departures|^\/destinations\/product\/|^\/holidays\/|^\/holiday\/product\/|^\/holiday\/inventory\/|^\/holiday\/collections\/|^\/f\/products\/|^\/f\/holidays\/|^\/sun-holidays\/|^\/destinations\/viewAnonymousShortlist\/|^\/holiday\/viewAnonymousShortlist\/|^\/en\/destination\/|^\/flights\//)) {
            return 'Browse';
          } else if ((pageUid === 'travel-information') || path.match(/^\/$|^\/holiday-extras.html|^\/editorial\/|^\/gsa\/|^\/affiliates.html|^\/information\/|^\/our-policies\/|^\/contact-us\/|^\/myapp\/|^\/destinations\/shop-finder\/|^\/holiday\/shop-finder\/|^\/holiday\/faqCategories\/|^\/f\/faqCategories\/|^\/f\/travel-information\/|^\/all-inclusive-calculator\/|^\/about-us\/|^\/destinations\/info\/|^\/destinations\/faqCategories|^\/myapp\//)) {
            return 'Editorial';
          } else if (path.match(/^\/$|^\/destinations\/book\/|^\/holiday\/book\/|^\/f\/book\/|^\/cruise\/book\/|^\/flight\/book\/|^\/cruise\/bookitineraries\/|^\/cruise\/packages\/hotels|^\/cruise\/bookHotelDetails|^\/destinations\/bookaccommodation|^\/holiday\/bookaccommodation|^\/cps\/pageRender|^\/f\/bookaccommodation/)) {
            return 'Bookflow';
          } else if (path.match(/^\/$|^\/destinations\/packages|^\/holiday\/packages|^\/f\/packages|^\/cruise\/packages|^\/flight\/search/)) {
            return 'Search';
          } else if (path.match(/^\/$|^\/destinations\/manage\/|^\/t\//)) {
            return 'Customer Account';
          } else if (path.match(/^\/$|^\/cruise|^\/flight/)) {
            return 'Home Page/Landing Page';
          }
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["sourceBookingReference"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.SrcBkgRef) {
          return tui.analytics.page.SrcBkgRef;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].user && dataLayer[0].user.currentBookings && dataLayer[0].user.currentBookings.bookingReference) {
          return dataLayer[0].user.currentBookings.bookingReference;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["sourceBookingSystem"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.SrcBkgSys) {
          return tui.analytics.page.SrcBkgSys;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - CD - BOARD"] = (function() {
      return tui.analytics.page.Board;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - Affiliation"] = (function() {
      return "CruiseDeals.co.uk"
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - BrandName"] = (function() {
      return "Marella Cruises";
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - Category"] = (function() {
      return "Cruise";
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - CRType"] = (function() {
      return tui.analytics.page.CRType;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - CruiseId"] = (function() {
      //Ship name, destination(s), depDate and Duration
      return tui.analytics.page.CRShip + '-' + tui.analytics.page.CRWhereTo + '-' + tui.analytics.page.DepDate + '/' + tui.analytics.page.MonthYear + '-' + tui.analytics.page.CRDur;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - CRWhereTo"] = (function() {
      return tui.analytics.page.CRWhereTo;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - DepartureDate"] = (function() {
      return tui.analytics.page.DepDate + '/' + tui.analytics.page.MonthYear;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - Discount"] = (function() {
      return tui.analytics.page.Disc;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - Duration"] = (function() {
      return tui.analytics.page.CRDur;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - Duration - New"] = (function() {
      return tui.analytics.page.CRDur;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - ShipName"] = (function() {
      return tui.analytics.page.CRShip;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - Sum"] = (function() {
      return tui.analytics.page.Sum;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["STOCKTON - DD - Variant"] = (function() {
      return tui.analytics.page.CRType;
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["thirdPartyAncillaries"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TPAnc) {
          return tui.analytics.page.TPAnc;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["thirdPartyBeds"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TPB) {
          return tui.analytics.page.TPB;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["thirdPartyBedsSupplier"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TPBSupp) {
          return tui.analytics.page.TPBSupp;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["thirdPartyFlightDetail"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TPFU) {
          return tui.analytics.page.TPFU;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["top5SearchResults"] = (function() {
      try {
        var FBdata;
        var arr = [];
        var sr = jsonData.searchResult.holidays;

        sr.forEach(function(e) {
          FBData = e.itinerary.outbounds[0].departureAirportCode + '|' + e.accommodation.code;
          arr.push(FBData);
        });

        return arr.slice(0, 5).join();
      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["tradingCycle"] = (function() {
      // Function for returning Trading Cycle, based on Days To Departure. The UK trading team uses Early and Late classification, so any bookings 
      // made within 84 days (12 weeks) to departure are defined as late and greater than 84 days to dept are early .
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items.daysToDeparture) {
          if (dataLayer[0].transactions.items.daysToDeparture <= 84) {
            return "late";
          }
          if (dataLayer[0].transactions.items.daysToDeparture > 84) {
            return "early";
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items.daysToDeparture) {
          if (dataLayer[0].basket.items.daysToDeparture <= 84) {
            return "late";
          }
          if (dataLayer[0].basket.items.daysToDeparture > 84) {
            return "early";
          }
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.daysToDeparture) {
          if (dataLayer[0].product.daysToDeparture <= 84) {
            return "late";
          }
          if (dataLayer[0].product.daysToDeparture > 84) {
            return "early";
          }
        } else if (typeof tui != "undefined" && typeof tui.analytics != "undefined" && typeof tui.analytics.page != "undefined" && typeof tui.analytics.page.DepDate != "undefined") {
          // todays date
          var date1 = new Date();
          // dep  date
          var depdate = ((typeof window.tui.analytics.page.MonthYear !== 'undefined') ? ((window.tui.analytics.page.DepDate || '') + '/' + window.tui.analytics.page.MonthYear) : '');
          var splitDate = depdate.split('/');

          day = splitDate[0];
          daystring = day.toString();
          month = splitDate[1];
          monthstring = month.toString();
          year = splitDate[2];
          yearstring = year.toString();

          var slash = "/";

          daterage = monthstring + slash + daystring + slash + yearstring;
          date3 = new Date(daterage);

          var timeDiff = Math.abs(date3.getTime() - date1.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          var tradingCycle = '';
          if (diffDays <= 84) {
            tradingCycle = "late";
          }
          if (diffDays > 84) {
            tradingCycle = "early";
          }

          return tradingCycle;
        }
      } catch (err) {
        return "";
      }

    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["tripAdvisorEventID"] = (function() {
      var value = "; " + document.cookie;
      var parts = value.split("; taeventid=");
      if (parts.length == 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["tripAdvisorRating"] = (function() {
      try {
        if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && typeof dataLayer[0].transactions.items.tripAdvisorProductRating != 'undefined') {
          return String(dataLayer[0].transactions.items.tripAdvisorProductRating);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && typeof dataLayer[0].basket.items.tripAdvisorProductRating != 'undefined') {
          return String(dataLayer[0].basket.items.tripAdvisorProductRating);
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && typeof dataLayer[0].product.tripAdvisorProductRating != 'undefined') {
          return String(dataLayer[0].product.tripAdvisorProductRating);
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TARating && typeof tui.analytics.page.TARating != 'undefined') {
          return tui.analytics.page.TARating;
        }
      } catch (err) {
        return '';
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["tripType"] = (function() {
      try {
        var url = location.href;

        if (url.indexOf("flight/book") > -1) {
          return tui.analytics.page.FltType;
        } else if (url.indexOf("cruise/book") > -1) {
          if (typeof(tui.analytics.page.CRType) == "undefined") {
            return "null";
          } else {
            return tui.analytics.page.CRType;
          }
        } else {
          return '';
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["trv_reference"] = (function() {
      var value = "; " + document.cookie;
      var parts = value.split("; trv_reference=");
      if (parts.length == 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["tuiProductRating"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.TUIRating) {
          return tui.analytics.page.TUIRating;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.tuiProductRating) {
          return dataLayer[0].product.tuiProductRating;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.items && dataLayer[0].basket.items.tuiProductRating) {
          return dataLayer[0].basket.items.tuiProductRating;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.items && dataLayer[0].transactions.items.tuiProductRating) {
          return dataLayer[0].transactions.items.tuiProductRating;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["uniqodoPrice"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.Sum) {
          return tui.analytics.page.Sum;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.totalPrice) {
          return dataLayer[0].transactions.total.totalPrice.toString();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].basket && dataLayer[0].basket.price && dataLayer[0].basket.price.totalPrice) {
          return dataLayer[0].basket.price.totalPrice.toString();
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].product && dataLayer[0].product.currentPrice) {
          return dataLayer[0].product.currentPrice.toString();
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    logError(e)
  }

  try {
    b["uniqodoPromoCodeName"] = (function() {
      try {
        if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.bookingLevelCreditNoteCode && tui.analytics.page.bookingLevelCreditNoteCode.length > 0 && tui.analytics.page.bookingLevelCreditNoteCode != 'null') {
          return tui.analytics.page.bookingLevelCreditNoteCode.split(':')[0];
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelCreditNoteCode && dataLayer[0].transactions.total.bookingLevelCreditNoteCode.length > 0) {
          return dataLayer[0].transactions.total.bookingLevelCreditNoteCode.split(':')[0];
        } else if (window.tui && tui.analytics && tui.analytics.page && tui.analytics.page.PromoCode && tui.analytics.page.PromoCode.length > 0) {
          return tui.analytics.page.PromoCode;
        } else if (window.dataLayer && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCode && dataLayer[0].transactions.total.bookingLevelPromoCode > 0) {
          return dataLayer[0].transactions.total.bookingLevelPromoCode;
        } else if (window.dataLayer[0] && dataLayer[0] && dataLayer[0].transactions && dataLayer[0].transactions.total && dataLayer[0].transactions.total.bookingLevelPromoCodes && dataLayer[0].transactions.total.bookingLevelPromoCodes.length > 0) {
          return dataLayer[0].transactions.total.bookingLevelPromoCodes[0].bookingLevelPromoCode;
        }
      } catch (err) {
        return "";
      }
    })()
  } catch (e) {
    if (utag && utag.DB) {}
  }

  try {
    b["userAgent"] = (function() {
      try {
        return navigator.userAgent
      } catch (e) {
        return 'error'
      }
    })()
  } catch (e) {
    if (utag && utag.DB) {
      utag.DB(e)
    } else {}
  }

  // add a prefix to mark these variables as legacy
  var legacyVariables = Object.keys(b)
  legacyVariables.forEach(function(key) {
    originalB[legacyPrefix + key] = b[key]
  })

  return originalB;
}