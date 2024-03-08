/**(
 * B"H
 * ) */
//addYearsAndMonthsToMaamarim


/**
 * logic
 */


for(var i = 0; i < g.docs.length; i++) {
    bb=g.docs[i].data();
    var m = bb.Maamar
    if(!m) continue;
    var ttl = m[0];
    if(!ttl) continue
    var h = ttl.heb;
    if(!h) continue
    var d = getYearAndMonthInfo(h)
    console.log("Doing",g.docs[i],d)
    await updateDoc(g.docs[i].ref, {
        Year: d.year || null,
        Month: d.month || null
    })
}
var years = {
    "תש\"י": "5710",
    "תשי\"א": "5711",
    "תשי\"ב": "5712",
    "תשי\"ג": "5713",
    "תשי\"ד": "5714",
    "תשט\"ו": "5715",
    "תשט\"ז": "5716",
    "תשי\"ז": "5717",
    "תשי\"ח": "5718",
    "תשי\"ט": "5719",
    "תש\"כ": "5720",
    "תשכ\"א": "5721",
    "תשכ\"ב": "5722",
    "תשכ\"ג": "5723",
    "תשכ\"ד": "5724",
    "תשכ\"ה": "5725",
    "תשכ\"ו": "5726",
    "תשכ\"ז": "5727",
    "תשכ\"ח": "5728",
    "תשכ\"ט": "5729",
    "תש\"ל": "5730",
    "תשל\"א": "5731",
    "תשל\"ב": "5732",
    "תשל\"ג": "5733",
    "תשל\"ד": "5734",
    "תשל\"ה": "5735",
    "תשל\"ו": "5736",
    "תשל\"ז": "5737",
    "תשל\"ח": "5738",
    "תשל\"ט": "5739",
    "תש\"מ": "5740",
    "תשמ\"א": "5741",
    "תשמ\"ב": "5742",
    "תשמ\"ג": "5743",
    "תשד\"מ": "5744",
    "תשמ\"ה": "5745",
    "תשמ\"ו": "5746",
    "תשמ\"ז": "5747",
    "תשמ\"ח": "5748",
    "תשמ\"ט": "5749",
    "תש\"נ": "5750",
    "תנש\"א": "5751",
    "תשנ\"ב": "5752"
    }

var monthsNumbers = {
    "בראשית": "1",

	"שבת שובה": "1",
	"ראש-השנה": "1",
	"דראש השנה": "1",
	"ראש השנה": "1",
    "שמחת תורה": "1",
    "סוכות": "1",
    "שבת תשובה": "1",
    "ש\"פ נח": "1",
    "לך לך": "1",


	"תשרי": "1",
	"חשון": "2",
	"כסלו": "3",
    "ערב חנוכה": "3",

	"טבת": "4",
	"זאת חנוכה": "4",
	"שבט": "5",
    "באתי לגני": "5",
	"פורים": "6",
	"אדר": "6",
	"אד\"ר": "6",
	"אד\"ש": "6",
	"פסח": "7",
    "החודש, ה'תשמ": "7",
	"ניסן": "7",
    
	"אייר": "8",
    "ל\"ג בעומר": "8",

	"סיון": "9",
    "חג השבועות": "9",

	"תמוז": "10",
	"מנחם-אב": "11",
	"תשעה באב": "11",
	"אב": "11",
    "ת\"ב": "11",

	"אלול": "12",
    "סליחות": "12"
};



async function getMaamarDocRefs() {
    var f = collection(db, "books", "Meluket", "Maamarim")

    var docs = await getDocs(f)
    return docs
}

function getYearAndMonthInfo(hdr, doYear=true, doMonth=true) {
        var yearsInp = {};
        if(doYear) {
            try {
                yearsInp = years;
            } catch(e){}
        }
        var months = monthsNumbers;
       
        var yearsK = Object.keys(yearsInp)
        var monthsK = Object.keys(months)
    
        var year = null
        var month = null
    
        yearsK.forEach(w=> {
            if(hdr.includes(w)) {
                year = w;
            }
            
        })
        monthsK.forEach(w=>{
            if(hdr.includes(w)) {
                month=w
            }
        })
    
        var ob = {};
        if(doYear) {
            ob.year = {
                heb: year,
                eng: yearsInp[year]
            }
        }
        if(doMonth) {
            ob.month = {
                heb: month,
                eng: months[month]
            }
        }
        return ob;
        
    }






/**month parsing */
function parseMonths() {
    /**B"H**/
    var m=`
    1	שבת שובה
    1	ראש-השנה
    1	דראש השנה
    1	ראש השנה
    1	תשרי
    2	חשון
    3	כסלו
    4	טבת
    4	זאת חנוכה
    5	שבט
    6	פורים
    6	אדר
    6	אד"ר
    6	אד"ר
    6	אד"ש
    6	אד"ש
    7	פסח
    7	ניסן
    8	אייר
    9	סיון
    10	תמוז
    11	מנחם-אב
    11	תשעה באב
    11	אב
    12	אלול
    `
    var p = m.split("\n")
        .filter(Boolean)
        .map(w=>w.split("\t").filter(Boolean))
        .filter(Boolean)
        .map(w=>[w[1],w[0]])
    b = Object.fromEntries(p)
}



var monthsOldEng = {
    "ראש-השנה": "Tishrei",
    "דראש השנה": "Tishrei",
    "ראש השנה": "Tishrei",
    "תשרי": "Tishrei",
    "חשון": "Cheshvan",
    "כסלו": "Kislev",
    "טבת": "Teves",
    "שבט": "Shevat",
    "פורים": "Adar",
    "אד\"ר": "Adar a",
    "אדר": "Adar",
    "פורים קטן": "Adar a",
    "אד\"ש": "Adar b",
    "פסח": "Nissan",
    "ניסן": "Nissan",
    "אייר": "Iyar",
    "סיון": "Sivan",
    "תמוז": "Tammuz",
    "אב": "Av",
    "אלול": "Elul"
    } 