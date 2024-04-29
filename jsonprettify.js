var fs = require('fs');
let daten = [];
let suchkeys = ["probenahmestelle"]
let suchwerte = ["GEW_RHEIN_IWB","GEW_BIRS_BIRSK","GEW_ST_ALBANTEICH_MUEHLEGRABEN","GEW_BIRSIG_HEUW","GEW_WIESE_HOCHBERGER165_R_UFER"]
fs.readFile('100066pretty.json', (err, d) => {
    if (err) throw err;
    let data = JSON.parse(d);
    daten=data.filter(e=>{
        
        //console.log(Object.keys(e.fields))
        return Object.keys(e.fields.probenahmestelle).every(f=>{
           // console.log(e.fields["probenahmejahr"]>2017)
           // return Object.keys("probenahmejahr").some(g=>{
                return suchwerte.includes(e.fields.probenahmestelle)
            //})

        })
    })
  //  console.log(data);
//daten.push(data)
console.log(daten);
// probenahmejahr

fs.writeFile("100066verypretty.json", JSON.stringify(daten, null, "\t"), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + "100066verypretty.json");
    } }); 
})


 