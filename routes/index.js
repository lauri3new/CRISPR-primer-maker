var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/output', function(req, res) {

//input variables from form
var protospacer = req.body.protospacer;
var homologyArm5 = req.body.homologyArm5;
var insert = req.body.Insert;
var homologyArm3 = req.body.homologyArm3;
var strand = req.body.strand;

// warnings array
var warnings = [];

// empty input
if (protospacer == "" && homologyArm3 == "" && homologyArm5 == "" ) { res.render('index',{output, warnings : warnings, input}) };

// input object stores input variables
var input = {
protospacer : protospacer,
homologyArm5 : homologyArm5,
insert : insert,
homologyArm3 : homologyArm3
}
    
// errors array
var errorsarr = ["<strong>Errors - </strong>"];

// detect errors: if protospacer contains C at space 19, if protospacer too long/short or if protospacer/homology template contains non standard charecters
if (protospacer.charAt(19).toUpperCase() == "C") { errorsarr.push(" C at position 19 in protospacer! ")};
if (protospacer == "" || protospacer == " ") {var noProtospacer = true; warnings.push(" Protospacer not  provided. ");}
else if (protospacer.length == 20 && protospacer.match(/[^actgACTG]/g) == null ) {}
else {errorsarr.push(" Protospacer sequence is not 20bp long or contains non standard charecters. ")};
if (homologyArm3.match(/[^actgACTG]/g) == null && homologyArm5.match(/[^actgACTG]/) == null && insert.match(/[^actgACTG]/) == null ) {}
else {errorsarr.push(" Non standard Charecters in Homology arm input. ")};

// reverse function reverse input string
function reverse(str) {
return str.split("").reverse().join("");
}

// revCom returns reverse complement of input string in matching Case
function revCom(str,reverse){
var input = str.split("").reverse();
var output = "";
for (i = 0 ; i < input.length; i++)
    {
        if (input[i] == "a" ) { output += "t"}
        if (input[i] == "A" ) { output += "T"}
        if (input[i] == "t" ) { output += "a"}
        if (input[i] == "T" ) { output += "A"}
        if (input[i] == "c" ) { output += "g"}
        if (input[i] == "C" ) { output += "G"}
        if (input[i] == "g" ) { output += "c"}
        if (input[i] == "G" ) { output += "C"}
    }
return output
}

// declare reverse complement of insert
var revComProtospacer = revCom(protospacer);
    
// Check if protospacer has (position-1) G, if not add G to beggining protospacer sequence and C to end of reverse complementary protospacer  
if (protospacer.charAt(0).toUpperCase() == "G") { 
    var temp = protospacer;
    var temp2 = revComProtospacer;
    protospacer = temp.substring(1,20);
    revComProtospacer = temp2.substring(0,19); }
else {
var temp = protospacer;
var temp2 = revCom(temp.substring(1,20));
protospacer = "G" + temp.substring(1,20);
revComProtospacer = temp2 + "C";
}

//output variables
var bsa15 = "TCTT" + protospacer;
var bsa13 = "AAAC" + revComProtospacer;
var homology53 = homologyArm5.toLowerCase() + insert.toUpperCase() + homologyArm3.toLowerCase();
var homologylength = homology53.length;

// warnings:  if inputs are not provided
if (homologyArm3 == ""){warnings.push(" No 3' homology arm provided. ")};
if (insert == ""){warnings.push(" No insert provided. ")};
if (homologyArm5 == ""){warnings.push(" No 5' homology arm provided. ")};

// if only protospacer input, return protospacer primers with bsa1 overhangs
if (homologyArm3 == "" && homologyArm5 == "" && noProtospacer !== true) {
var output = {
    bsa15 : bsa15, 
    bsa13 : bsa13
}
if (errorsarr.length > 1) {res.render('index',{errors : errorsarr, input});}
else { res.render('index',{output, input})}
}

//codon lookup object
var codons = {
 TTC:' F&nbsp;' ,TTT:' F&nbsp;' ,
 TTA:' L&nbsp;' ,TTG:' L&nbsp;' , CTT:' L&nbsp;' , CTC:' L&nbsp;' ,CTA:' L&nbsp;' ,CTG:' L&nbsp;' , 
  ATT:' I&nbsp;' , ATC:' I&nbsp;' , ATA:' I&nbsp;' , 
  ATG:' M&nbsp;' , 
  GTT:' V&nbsp;' , GTC:' V&nbsp;' , GTA:' V&nbsp;' , GTG:' V&nbsp;' , 
 TCT:' S&nbsp;' ,TCC:' S&nbsp;' ,TCA:' S&nbsp;' ,TCG:' S&nbsp;' , AGT:' S&nbsp;' , AGC:' S&nbsp;' , 
  CCT:' P&nbsp;' , CCC:' P&nbsp;' , CCA:' P&nbsp;' , CCG:' P&nbsp;' , 
  ACT:' T&nbsp;' , ACC:' T&nbsp;' , ACA:' T&nbsp;' , ACG:' T&nbsp;' ,
  GCT:' A&nbsp;' , GCC:' A&nbsp;' , GCA:' A&nbsp;' , GCG:' A&nbsp;' , 
 TAT:' Y&nbsp;' ,TAC:' Y&nbsp;' , 
  CAT:' H&nbsp;' , CAC:' H&nbsp;' ,
  CAA:' Q&nbsp;' , CAG:' Q&nbsp;' , 
  AAT:' N&nbsp;' , AAC:' N&nbsp;' , 
  AAA:' K&nbsp;' , AAG:' K&nbsp;' ,
  GAT:' D&nbsp;' , GAC:' D&nbsp;' , 
  GAA:' E&nbsp;' , GAG:' E&nbsp;' ,
 TGT:' C&nbsp;' ,TGC:' C&nbsp;' ,
 TGG:' W&nbsp;' , 
  CGT:' R&nbsp;' , CGC:' R&nbsp;' , CGA:' R&nbsp;' , CGG:' R&nbsp;' , AGA:' R&nbsp;' , AGG:' R&nbsp;' , 
  GGT:' G&nbsp;' , GGC:' G&nbsp;' , GGA:' G&nbsp;' , GGG:' G&nbsp;' , 
 TAA:' *&nbsp;' ,TGA:' *&nbsp;' ,TAG:' *&nbsp;' ,
}

//declare sense and anti-sense variables for output
var sense = homology53;
var antiSense = revCom(homology53);
if (strand == "Anti-Sense") { 
antiSense = homology53;
sense = revCom(antiSense);
}

//translation to protein, different frames
var frame1 = sense.substring(0,sense.length - (sense.length % 3)).toUpperCase().replace(/.{3}/g, function(a) { return codons[a] || " "});
var frame2 = sense.substring(1,sense.length - ((sense.length - 1) % 3)).toUpperCase().replace(/.{3}/g, function(a) { return codons[a] || " "});
var frame3 = sense.substring(2,sense.length - ((sense.length - 2) % 3)).toUpperCase().replace(/.{3}/g, function(a) { return codons[a] || " "});

// output variables
if (noProtospacer == true) {
var output = {
    homology53 : homology53,
    homologylength : homologylength,
    frame1 : frame1.substring(1,frame1.length),
    frame2 : frame2.substring(1,frame2.length),
    frame3 : frame3,
    sense : sense,
    antiSense : antiSense
}
}
else {
var output = {
    bsa15 : bsa15, 
    bsa13 : bsa13,
    homology53 : homology53,
    homologylength : homologylength,
    frame1 : frame1.substring(1,frame1.length),
    frame2 : frame2.substring(1,frame2.length),
    frame3 : frame3,
    sense : sense,
    antiSense : antiSense
}
}

// render output screen with errors or if no errors found, output screen with any warnings
if (errorsarr.length > 1) {res.render('index',{errors : errorsarr, input});}
else { res.render('index',{output, warnings : warnings, input})}

});

module.exports = router;
