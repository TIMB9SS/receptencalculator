/* Onafhankelijke regressietest van de online standalone index.html.
   Gebruik: node tests/test_model.js (Node.js 18+; geen pakketten nodig).
   Let op: dit test de softwarelogica, NIET de lesinterpretatie van PAC/POD. */
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const block=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(block,'Eerste scriptblok met het rekenmodel moet aanwezig zijn.');
const context={};
vm.runInNewContext(block[1],context,{timeout:15000});
const m=context.IceModel;
assert.ok(m && m.INGREDIENTS && m.optimize);
const near=(a,b,eps=.00001)=>assert.ok(Math.abs(a-b)<eps,`Verwacht ${b}, kreeg ${a}`);
assert.equal(m.INGREDIENTS.length,49);
m.INGREDIENTS.forEach((item,i)=>{
 assert.equal(item.row,i+2);
 near(item.sugar+item.fat+item.msnf+item.other,item.solids);
 near(item.solids+item.water,100);
});
// Handmatig uit de opgegeven bronkolommen afgeleid voorbeeld; niet uit een lesoplossing.
const amounts={'Water':5,'Volle melk (3,5%)':600,'Room (35% vet)':200,
 'Magere melkpoeder':50,'Suiker':140,'Stabilisator':5};
const grams=m.INGREDIENTS.map(i=>amounts[i.name]||0);
const target={sugar:14,fat:9.15,msnf:11.31,other:.5,pac:201.5195,pod:149.86232};
const direct=m.metricsFor(grams,1000);
for(const [key,v] of Object.entries(target))near(direct[key],v,.000001);
near(direct.totalSolids,34.96);
near(direct.water,65.04);
for(const batch of [100,500,1000,5000]){
 const out=m.optimize({...target,batch,preset:'melkijs'});
 near(out.quantities.reduce((sum,v)=>sum+v,0),batch,.0001);
 assert.equal(out.exact,true,'Het afgeleide voorbeeld moet haalbaar zijn.');
 for(const [key,value] of Object.entries(target))near(out.actual[key],value,.0005);
 for(const i of out.ingredients){
  assert.ok(i.grams>=-.0001 && i.grams<=i.max*batch/1000+.0001,
    'Ingrediëntlimiet / positieve massa: '+i.name);
 }
}
const sorbet=m.optimize({batch:1000,preset:'sorbet',sugar:20,fat:0,
 msnf:0,other:5,pac:260,pod:180});
near(sorbet.quantities.reduce((a,b)=>a+b,0),1000,.0001);
assert.ok(sorbet.ingredients.filter(i=>i.group==='fruit')
 .reduce((a,i)=>a+i.grams,0)>=199.999);
assert.throws(()=>m.optimize({...target,batch:0,preset:'melkijs'}),/batch/);
assert.throws(()=>m.optimize({...target,batch:1000,preset:'melkijs',sugar:90,fat:90}),/Som/);
assert.throws(()=>m.optimize({...target,batch:1000,preset:'melkijs',allowed:[]}),/ingrediënt/);
console.log('GESLAAGD: 49 ingrediënten, 6 waarden, massabalans, sorbet en foutafhandeling.');
console.log('Nog open: de PAC/POD-broninterpretatie moet met de les getoetst worden.');
