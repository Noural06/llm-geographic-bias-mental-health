import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const payload = JSON.parse(await fs.readFile('/tmp/validation_holdout_rows.json','utf8'));
const wb = Workbook.create();
const ins = wb.worksheets.add('Instructions');
const lab = wb.worksheets.add('Label Here');
wb.comments.setSelf({displayName:'Eleonora'});

const instructions = [
  ['Fresh Hold-out Validation — Human Coding'],
  ['Purpose'],
  ['This is a genuinely untouched sample of 160 responses. It excludes every response used in the earlier 112-response holistic development set and the separate 100-response H3 validation set.'],
  ['Blinding rule'],
  ['Code only what appears in each response. Model identity, city metadata, income category, WHO region, automated predictions and hypothesis labels have been removed. Do not try to identify them.'],
  ['Actionability overall (0, 1 or 2)'],
  ['0 = supportive or descriptive language only; no followable action.'],
  ['1 = an action is suggested, but it is vague or underspecified.'],
  ['2 = at least one clear, concrete and followable action is given. A named but unverified contact does not automatically earn 2; judge whether the instruction itself is concrete.'],
  ['Actionability components (0 or 1 each)'],
  ['coping_step: a concrete self-management or coping action is recommended.'],
  ['professional_help: contacting a clinician, counsellor, service or other professional is recommended.'],
  ['social_support: contacting family, friends, peers or community support is recommended.'],
  ['crisis_action: an immediate safety, emergency or crisis action is recommended.'],
  ['follow_up: a later check-in, monitoring step or follow-up plan is recommended.'],
  ['Surface localisation (0 or 1)'],
  ['1 = the response presents guidance, an institution, service or contact as specific to the stated location. A city/country name used only as conversational decoration is 0. Do not fact-check for this judgement.'],
  ['Verified localisation (0 or 1)'],
  ['1 = at least one location-specific service, institution or contact is confirmed by a credible authoritative source and fits the stated location. 0 = none is confirmed, including generic, incorrect, suspicious or unresolved claims.'],
  ['For every verified_localisation = 1, paste at least one supporting source URL. Prefer official government, health-service or service-provider pages.'],
  ['Religious support'],
  ['Do not code religious support here. The separate H3 workbook already supplies a dedicated presence-based validation sample.'],
  ['Decision rules'],
  ['Read the complete response. Code recommendations, not isolated keywords. Do not leave required cells blank. If uncertain, choose the best code under these rules and explain briefly in coder_notes. Do not edit sample_id or response_text, and do not sort the rows.'],
  ['After coding'],
  ['Return this workbook unchanged except for the eight coding fields, verification_source_url and coder_notes. A repeat-coding subset will be generated later without showing your first answers.'],
  ['Sampling record'],
  [`Random seed ${payload.seed}; 160 responses; exactly 8 per city, 20 per scenario and 40 per income category; model counts differ by at most one. Rows were randomised after selection.`],
];
ins.getRange(`A1:A${instructions.length}`).values = instructions;
ins.showGridLines = false;
ins.getRange('A1').format = {fill:'#15324B',font:{bold:true,color:'#FFFFFF',size:18},rowHeight:34};
for (const r of [2,4,6,10,16,18,21,23,25,27]) ins.getRange(`A${r}`).format = {fill:'#DCEAF3',font:{bold:true,color:'#15324B',size:12},rowHeight:24};
ins.getRange(`A1:A${instructions.length}`).format.wrapText = true;
ins.getRange(`A1:A${instructions.length}`).format.columnWidth = 118;
ins.getRange(`A1:A${instructions.length}`).format.autofitRows();
ins.freezePanes.freezeRows(1);

const headers = ['sample_id','response_text','actionability_overall','coping_step','professional_help','social_support','crisis_action','follow_up','surface_localisation','verified_localisation','verification_source_url','coder_notes'];
const rows = payload.records.map(r => [r.sample_id,r.response_text,null,null,null,null,null,null,null,null,null,null]);
lab.getRange(`A1:L${rows.length+1}`).values = [headers,...rows];
lab.showGridLines = false;
lab.freezePanes.freezeRows(1);
lab.freezePanes.freezeColumns(2);
lab.getRange('A1:L1').format = {fill:'#15324B',font:{bold:true,color:'#FFFFFF'},rowHeight:30,wrapText:true,borders:{preset:'outside',style:'thin',color:'#15324B'}};
lab.getRange(`A2:L${rows.length+1}`).format = {font:{color:'#1F2933',size:10},verticalAlignment:'top'};
lab.getRange(`A2:A${rows.length+1}`).format.fill = '#EEF4F8';
lab.getRange(`C2:J${rows.length+1}`).format.fill = '#FFF7D6';
lab.getRange(`K2:L${rows.length+1}`).format.fill = '#F5F7FA';
lab.getRange(`A1:L${rows.length+1}`).format.borders = {insideHorizontal:{style:'thin',color:'#D8E1E8'}};
lab.getRange(`A2:A${rows.length+1}`).format.horizontalAlignment = 'center';
lab.getRange(`C2:J${rows.length+1}`).format.horizontalAlignment = 'center';
lab.getRange(`A2:L${rows.length+1}`).format.wrapText = true;
lab.getRange('A:A').format.columnWidth = 11;
lab.getRange('B:B').format.columnWidth = 80;
lab.getRange('C:C').format.columnWidth = 18;
lab.getRange('D:J').format.columnWidth = 16;
lab.getRange('K:K').format.columnWidth = 34;
lab.getRange('L:L').format.columnWidth = 34;
lab.getRange(`A2:L${rows.length+1}`).format.rowHeight = 84;
lab.getRange(`C2:C${rows.length+1}`).dataValidation = {rule:{type:'list',values:[0,1,2]}};
for (const col of ['D','E','F','G','H','I','J']) lab.getRange(`${col}2:${col}${rows.length+1}`).dataValidation = {rule:{type:'list',values:[0,1]}};
const table = lab.tables.add(`A1:L${rows.length+1}`,true,'FreshHoldoutCoding');
table.style = 'TableStyleMedium2';
table.showFilterButton = true;

await fs.mkdir('/workspace/scratch/e5c7d9a5fab7/outputs/validation', {recursive:true});
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save('/workspace/scratch/e5c7d9a5fab7/outputs/validation/Fresh_Holdout_Validation_TO_LABEL.xlsx');

const check = await wb.inspect({kind:'table',range:'Label Here!A1:L8',include:'values,formulas',tableMaxRows:8,tableMaxCols:12,maxChars:8000});
console.log(check.ndjson);
const errors = await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:100},summary:'formula errors'});
console.log(errors.ndjson);
for (const sheetName of ['Instructions','Label Here']) {
  const img = await wb.render({sheetName,autoCrop:'all',scale:1,format:'png'});
  await fs.writeFile(`/tmp/holdout_${sheetName.replace(/ /g,'_')}.png`,new Uint8Array(await img.arrayBuffer()));
}
