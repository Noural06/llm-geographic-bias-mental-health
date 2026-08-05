import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outDir="/workspace/scratch/e5c7d9a5fab7/outputs/holdout_validation_final";
await fs.mkdir(outDir,{recursive:true});

function parseCSV(text){
  const rows=[]; let row=[],field="",q=false;
  for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];
    if(q){if(c==='"'&&n==='"'){field+='"';i++;}else if(c==='"')q=false;else field+=c;}
    else if(c==='"')q=true;else if(c===','){row.push(field);field="";}else if(c==='\n'){row.push(field);rows.push(row);row=[];field="";}else if(c!=='\r')field+=c;
  } if(field.length||row.length){row.push(field);rows.push(row);} return rows;
}
const metrics=parseCSV(await fs.readFile('/tmp/holdout_results.csv','utf8'));
const errors=parseCSV(await fs.readFile('/tmp/holdout_errors.csv','utf8'));
const matched=parseCSV(await fs.readFile('/tmp/holdout_matched.csv','utf8'));
const repeat=parseCSV(await fs.readFile('/tmp/repeat_sample.csv','utf8'));
const audit=JSON.parse(await fs.readFile('/tmp/holdout_audit.json','utf8'));

const navy="#17365D", blue="#D9EAF7", pale="#F4F7FA", green="#E2F0D9", red="#FCE4D6", amber="#FFF2CC", grey="#667085";
function title(sheet,text,sub,cols=8){sheet.mergeCells(`A1:${String.fromCharCode(64+cols)}1`);sheet.getRange('A1').values=[[text]];sheet.getRange('A1').format={fill:navy,font:{bold:true,color:'#FFFFFF',size:16},rowHeight:30,verticalAlignment:'center'};sheet.mergeCells(`A2:${String.fromCharCode(64+cols)}2`);sheet.getRange('A2').values=[[sub]];sheet.getRange('A2').format={fill:blue,font:{color:'#334155',italic:true},wrapText:true,rowHeight:30};sheet.showGridLines=false;}
function header(r){r.format={fill:navy,font:{bold:true,color:'#FFFFFF'},wrapText:true,verticalAlignment:'center',borders:{preset:'inside',style:'thin',color:'#B8C7D9'}};}
function tableStyle(sheet,range){const t=sheet.tables.add(range,true,`T${Math.random().toString(36).slice(2,9)}`);t.style='TableStyleMedium2';t.showFilterButton=true;return t;}
function setWidths(sheet,widths){Object.entries(widths).forEach(([col,w])=>sheet.getRange(`${col}:${col}`).format.columnWidth=w);}

// Results workbook
const wb=Workbook.create();
let sh=wb.worksheets.add('Summary'); title(sh,'Fresh Hold-out Validation — Decision Summary','Untouched n=160 sample; frozen rules evaluated against blinded single-coder human labels.',10);
sh.getRange('A4:B9').values=[['Decision','Result'],['Actionability overall','FAIL — weighted κ 0.462 (<0.70)'],['High actionability','FAIL — sensitivity 0.624 and F1 0.757'],['Coping-step component','FAIL — specificity 0.561'],['Professional-help component','FAIL — sensitivity 0.701'],['Surface localisation','FAIL — specificity 0.038; rule predicts almost everything positive']];header(sh.getRange('A4:B4'));sh.getRange('A5:B9').format={wrapText:true,borders:{preset:'inside',style:'thin',color:'#D8DEE8'}};sh.getRange('B5:B9').format.fill=red;
sh.getRange('D4:H8').values=[['Interpretation','','','',''],['What passed','Workbook completeness and exact matching: 160/160 rows; no missing or invalid labels.','','',''],['What failed','No frozen automated measure met all pre-specified validity criteria.','','',''],['Scientific consequence','Do not describe H1/H2 automated outcomes as independently validated. Treat them as exploratory or replace with human-coded outcomes.','','',''],['Next step','After a washout period, complete the 40-row repeat-coding workbook; then calculate intra-rater reliability.','','','']];
for(let r=4;r<=8;r++){if(r>4)sh.mergeCells(`E${r}:H${r}`);} sh.getRange('D4:H4').merge(); sh.getRange('D4').format={fill:navy,font:{bold:true,color:'#FFFFFF'}}; sh.getRange('D5:H8').format={wrapText:true,borders:{preset:'inside',style:'thin',color:'#D8DEE8'}};
sh.getRange('A11:H14').values=[['Acceptance criteria','','','','','','',''],['Ordinal outcomes','Weighted κ ≥ 0.70','','','','','',''],['Binary outcomes','Sensitivity ≥ 0.80, specificity ≥ 0.80 and F1 ≥ 0.80','','','','','',''],['Important','A high F1 alone does not establish validity when classes are imbalanced. Surface localisation demonstrates this failure.','','','','','','']];for(let r=11;r<=14;r++)sh.mergeCells(`B${r}:H${r}`);header(sh.getRange('A11:H11'));sh.getRange('A12:H14').format={wrapText:true,borders:{preset:'inside',style:'thin',color:'#D8DEE8'}};sh.freezePanes.freezeRows(3);setWidths(sh,{A:25,B:54,D:22,E:22,F:16,G:16,H:16});

sh=wb.worksheets.add('Validity Metrics'); title(sh,'Validity Metrics','95% CIs: Wilson intervals for sensitivity/specificity/precision; percentile bootstrap (2,000 resamples) for F1.',16);
const mh=metrics[0], md=metrics.slice(1).map(r=>r.map((v,i)=>{if(i===0||i===1||i===4||i===8||i===mh.length-1)return v; const n=Number(v);return v===''?null:(Number.isNaN(n)?v:n);}));
sh.getRangeByIndexes(3,0,metrics.length,metrics[0].length).values=[mh,...md];header(sh.getRangeByIndexes(3,0,1,mh.length));tableStyle(sh,`A4:${String.fromCharCode(64+mh.length)}${3+metrics.length}`);sh.freezePanes.freezeRows(4);sh.getUsedRange().format.wrapText=true;sh.getRange('A:A').format.columnWidth=34;for(let c=2;c<=mh.length;c++)sh.getRangeByIndexes(0,c-1,1,1).format.columnWidth=14;

sh=wb.worksheets.add('Confusion Matrices'); title(sh,'Confusion Matrices','Counts are human reference labels × frozen automated predictions.',7);
const mi=Object.fromEntries(mh.map((h,i)=>[h,i]));let cr=[['Measure','True negative','False positive','False negative','True positive','Human positive n','Automated positive n']];
for(const r of md.filter(r=>r[mi.scale]==='binary')){const tn=r[mi.tn],fp=r[mi.fp],fn=r[mi.fn],tp=r[mi.tp];cr.push([r[mi.measure],tn,fp,fn,tp,fn+tp,fp+tp]);}
sh.getRangeByIndexes(3,0,cr.length,7).values=cr;header(sh.getRange('A4:G4'));tableStyle(sh,`A4:G${3+cr.length}`);sh.freezePanes.freezeRows(4);setWidths(sh,{A:36,B:16,C:16,D:16,E:16,F:18,G:20});

sh=wb.worksheets.add('Human Label Distribution'); title(sh,'Human Label Distribution','Distribution of the 160 fresh reference judgements.',4);
const labelNames=['actionability_overall','coping_step','professional_help','social_support','crisis_action','follow_up','surface_localisation','verified_localisation'];
const mhead=matched[0], idx=Object.fromEntries(mhead.map((h,i)=>[h,i]));let dist=[['Outcome','Value','Count','Percent']];
for(const name of labelNames){const counts={};for(const r of matched.slice(1)){const v=r[idx[name]];counts[v]=(counts[v]||0)+1;}for(const [v,c] of Object.entries(counts).sort())dist.push([name,Number(v),c,c/160]);}
sh.getRangeByIndexes(3,0,dist.length,4).values=dist;header(sh.getRange('A4:D4'));tableStyle(sh,`A4:D${3+dist.length}`);sh.getRange(`D5:D${3+dist.length}`).format.numberFormat='0.0%';sh.freezePanes.freezeRows(4);setWidths(sh,{A:30,B:12,C:12,D:14});

sh=wb.worksheets.add('Error Analysis'); title(sh,'Discordant Cases for Error Analysis','Rows where the human label and frozen automated value disagree. Review failure mechanisms; do not tune rules on this hold-out.',10);
const keep=['sample_id','city','country','scenario_id','model_name','outcome','error_type','automated_value'];const eh=errors[0],ei=Object.fromEntries(eh.map((h,i)=>[h,i]));const er=[keep,...errors.slice(1).map(r=>keep.map(h=>{const v=r[ei[h]];return ['automated_value'].includes(h)?Number(v):v;}))];
sh.getRangeByIndexes(3,0,er.length,keep.length).values=er;header(sh.getRangeByIndexes(3,0,1,keep.length));tableStyle(sh,`A4:H${3+er.length}`);sh.freezePanes.freezeRows(4);setWidths(sh,{A:12,B:18,C:20,D:12,E:30,F:24,G:30,H:16});

sh=wb.worksheets.add('Label Audit'); title(sh,'Label and Matching Audit','Mechanical QA of the submitted workbook before any validity statistics were calculated.',4);
const ar=[['Check','Observed','Expected','Status'],['Rows',audit.n_rows,160,audit.n_rows===160?'PASS':'FAIL'],['Duplicate sample IDs',audit.duplicate_ids,0,audit.duplicate_ids===0?'PASS':'FAIL'],['Matched to source dataset',audit.matched,160,audit.matched===160?'PASS':'FAIL'],['Unmatched rows',audit.unmatched,0,audit.unmatched===0?'PASS':'FAIL'],['Verified positives without URL',audit.verified_without_url,0,audit.verified_without_url===0?'PASS':'FAIL'],['Missing required labels',Object.values(audit.missing).reduce((a,b)=>a+b,0),0,Object.values(audit.missing).every(v=>v===0)?'PASS':'FAIL'],['Invalid label values',Object.values(audit.invalid).flat().length,0,Object.values(audit.invalid).flat().length===0?'PASS':'FAIL']];
sh.getRangeByIndexes(3,0,ar.length,4).values=ar;header(sh.getRange('A4:D4'));tableStyle(sh,`A4:D${3+ar.length}`);sh.getRange(`D5:D${3+ar.length}`).conditionalFormats.add('containsText',{text:'PASS',format:{fill:green,font:{color:'#375623',bold:true}}});sh.getRange(`D5:D${3+ar.length}`).conditionalFormats.add('containsText',{text:'FAIL',format:{fill:red,font:{color:'#9C0006',bold:true}}});setWidths(sh,{A:34,B:18,C:18,D:14});

// Compact verification and previews
for(const s of wb.worksheets.items){const used=s.getUsedRange();if(used)used.format.verticalAlignment='top';const png=await wb.render({sheetName:s.name,autoCrop:'all',scale:1,format:'png'});await fs.writeFile(`${outDir}/preview_${s.name.replaceAll(' ','_')}.png`,new Uint8Array(await png.arrayBuffer()));}
console.log((await wb.inspect({kind:'table',range:'Summary!A1:H14',include:'values,formulas',tableMaxRows:20,tableMaxCols:10,maxChars:8000})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:100},summary:'formula errors'})).ndjson);
await (await SpreadsheetFile.exportXlsx(wb)).save(`${outDir}/Fresh_Holdout_Validation_RESULTS.xlsx`);

// Repeat-coding workbook
const rw=Workbook.create();
sh=rw.worksheets.add('Instructions');title(sh,'Repeat Coding — Intra-rater Reliability','Open only after the planned washout period. Code independently without viewing your first-round workbook.',8);
const instr=[['Rule','Instruction'],['Timing','Complete after a 1–2 week washout from the first coding round.'],['Blinding','Do not open or compare the first-round labelled workbook while coding.'],['Scope','Code all 40 rows using exactly the same definitions as the fresh hold-out.'],['Editable fields','Complete the yellow columns only. Do not edit repeat_id, sample_id or response_text.'],['After coding','Return this workbook; intra-rater weighted κ / Cohen κ will be calculated against your first labels.'],['Critical rule','Do not revise the frozen automated measures using either validation workbook.']];sh.getRangeByIndexes(3,0,instr.length,2).values=instr;header(sh.getRange('A4:B4'));sh.getRange('A5:B10').format={wrapText:true,borders:{preset:'inside',style:'thin',color:'#D8DEE8'}};setWidths(sh,{A:22,B:90});
sh=rw.worksheets.add('Label Here');
const rh=repeat[0], rd=repeat.slice(1).map(r=>r.map((v,i)=>['repeat_id','sample_id','response_text'].includes(rh[i])?v:null));sh.getRangeByIndexes(0,0,repeat.length,rh.length).values=[rh,...rd];header(sh.getRangeByIndexes(0,0,1,rh.length));tableStyle(sh,`A1:${String.fromCharCode(64+rh.length)}${repeat.length}`);sh.freezePanes.freezeRows(1);sh.freezePanes.freezeColumns(3);sh.getRange(`D2:M${repeat.length}`).format.fill=amber;sh.getRange(`D2:D${repeat.length}`).dataValidation={rule:{type:'whole',operator:'between',formula1:0,formula2:2}};sh.getRange(`E2:K${repeat.length}`).dataValidation={rule:{type:'whole',operator:'between',formula1:0,formula2:1}};setWidths(sh,{A:12,B:12,C:90,D:18,E:14,F:18,G:16,H:14,I:14,J:20,K:20,L:42,M:42});sh.getRange(`C2:M${repeat.length}`).format.wrapText=true;sh.getRange(`A2:M${repeat.length}`).format.rowHeight=48;
for(const s of rw.worksheets.items){const png=await rw.render({sheetName:s.name,autoCrop:'all',scale:1,format:'png'});await fs.writeFile(`${outDir}/preview_repeat_${s.name.replaceAll(' ','_')}.png`,new Uint8Array(await png.arrayBuffer()));}
console.log((await rw.inspect({kind:'table',range:'Label Here!A1:M8',include:'values,formulas',tableMaxRows:8,tableMaxCols:13,maxChars:6000})).ndjson);
await (await SpreadsheetFile.exportXlsx(rw)).save(`${outDir}/Fresh_Holdout_REPEAT_CODING.xlsx`);
