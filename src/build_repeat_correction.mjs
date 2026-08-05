import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "/workspace/scratch/e5c7d9a5fab7";
const repeatPath = `${root}/upload/Fresh_Holdout_REPEAT_CODING_LABELED.xlsx`;
const holdoutPath = `${root}/upload/Fresh_Holdout_Validation_LABELLED.xlsx`;
const outDir = `${root}/outputs/repeat_coding_correction`;
await fs.mkdir(outDir, { recursive: true });

const repeatWb = await SpreadsheetFile.importXlsx(await FileBlob.load(repeatPath));
const repeatValues = repeatWb.worksheets.getItem("Label Here").getUsedRange().values;
const repeatHeaders = repeatValues[0];
const ri = Object.fromEntries(repeatHeaders.map((h, i) => [h, i]));
const invalidRows = repeatValues.slice(1).filter(r => ![0,1,2].includes(Number(r[ri.actionability_overall])));

const holdoutWb = await SpreadsheetFile.importXlsx(await FileBlob.load(holdoutPath));
const holdoutValues = holdoutWb.worksheets.getItem("Label Here").getUsedRange().values;
const holdHeaders = holdoutValues[0];
const hi = Object.fromEntries(holdHeaders.map((h, i) => [h, i]));
const repeatIds = new Set(repeatValues.slice(1).map(r => String(r[ri.sample_id])));
const replacement = holdoutValues.slice(1).find(r => String(r[hi.sample_id]) === "H003" && !repeatIds.has("H003"));
if (!replacement || invalidRows.length !== 35) throw new Error(`QA failed: replacement=${!!replacement}, invalidRows=${invalidRows.length}`);

const wb = Workbook.create();
const navy = "#17365D", paleBlue = "#D9EAF7", yellow = "#FFF2CC", grey = "#E7E6E6", green = "#E2F0D9";
function title(sh, text, subtitle, lastCol) {
  sh.mergeCells(`A1:${lastCol}1`); sh.getRange("A1").values=[[text]];
  sh.getRange(`A1:${lastCol}1`).format={fill:navy,font:{bold:true,color:"#FFFFFF",size:16},rowHeight:30,verticalAlignment:"center"};
  sh.mergeCells(`A2:${lastCol}2`); sh.getRange("A2").values=[[subtitle]];
  sh.getRange(`A2:${lastCol}2`).format={fill:paleBlue,font:{italic:true,color:"#334155"},wrapText:true,rowHeight:32};
  sh.showGridLines=false;
}
function header(r){r.format={fill:navy,font:{bold:true,color:"#FFFFFF"},wrapText:true,verticalAlignment:"center"};}

let sh=wb.worksheets.add("Instructions");
title(sh,"Repeat Coding — Final Corrections","Complete only the two task sheets. Do not open your original 160-label workbook.","F");
sh.getRange("A4:F11").values=[
  ["Step","What to do","Allowed values","Do not do","Rows","Status"],
  [1,"Open 'Correct Scores'. Read each response and enter actionability_overall only.","0, 1 or 2","Do not count the component labels.",35,"Required"],
  [2,"Use 0 when there is no practical action.","0","Do not use 3 or 4.",null,"Rule"],
  [3,"Use 1 when an action is suggested but vague or unclear.","1","Do not infer intended advice.",null,"Rule"],
  [4,"Use 2 when at least one action is clear, specific and followable.","2","Do not score the number of components.",null,"Rule"],
  [5,"Open 'Replacement Row' and complete every yellow field for the one readable replacement response.","Actionability 0–2; binary fields 0–1","Do not copy the hidden first-round labels.",1,"Required"],
  [6,"Save and return this workbook.","No blanks in yellow fields","Do not alter IDs or response text.",36,"Final"],
  ["Why","The original 160 labels remain the locked hold-out. This workbook repairs only invalid repeat-coding entries and replaces one corrupted response.",null,null,null,"Methodological record"]
];
header(sh.getRange("A4:F4")); sh.getRange("A5:F11").format={wrapText:true,borders:{preset:"inside",style:"thin",color:"#D8DEE8"},verticalAlignment:"top"};
sh.getRange("A5:F11").format.rowHeight=42;
for (const [c,w] of Object.entries({A:10,B:66,C:24,D:34,E:10,F:24})) sh.getRange(`${c}:${c}`).format.columnWidth=w;

sh=wb.worksheets.add("Correct Scores");
const scoreRows=[["repeat_id","sample_id","response_text","actionability_overall (ENTER 0–2)"]];
for(const r of invalidRows) scoreRows.push([r[ri.repeat_id],r[ri.sample_id],r[ri.response_text],null]);
sh.getRangeByIndexes(0,0,scoreRows.length,4).values=scoreRows; header(sh.getRange("A1:D1"));
sh.tables.add(`A1:D${scoreRows.length}`,true,"CorrectScoresTable").style="TableStyleMedium2";
sh.freezePanes.freezeRows(1); sh.freezePanes.freezeColumns(2); sh.showGridLines=false;
sh.getRange(`D2:D${scoreRows.length}`).format.fill=yellow;
sh.getRange(`D2:D${scoreRows.length}`).dataValidation={rule:{type:"whole",operator:"between",formula1:0,formula2:2}};
sh.getRange(`A2:C${scoreRows.length}`).format.fill=grey;
sh.getRange(`C2:D${scoreRows.length}`).format.wrapText=true;
sh.getRange(`A2:D${scoreRows.length}`).format.rowHeight=58;
for (const [c,w] of Object.entries({A:12,B:12,C:105,D:25})) sh.getRange(`${c}:${c}`).format.columnWidth=w;

sh=wb.worksheets.add("Replacement Row");
const replacementHeaders=["repeat_id","sample_id","response_text","actionability_overall","coping_step","professional_help","social_support","crisis_action","follow_up","surface_localisation","verified_localisation","verification_source_url","coder_notes"];
const replacementRow=["R001R",replacement[hi.sample_id],replacement[hi.response_text],null,null,null,null,null,null,null,null,null,null];
sh.getRangeByIndexes(0,0,2,13).values=[replacementHeaders,replacementRow]; header(sh.getRange("A1:M1"));
sh.tables.add("A1:M2",true,"ReplacementRowTable").style="TableStyleMedium2";
sh.freezePanes.freezeRows(1); sh.freezePanes.freezeColumns(3); sh.showGridLines=false;
sh.getRange("A2:C2").format.fill=grey; sh.getRange("D2:M2").format.fill=yellow;
sh.getRange("D2").dataValidation={rule:{type:"whole",operator:"between",formula1:0,formula2:2}};
sh.getRange("E2:K2").dataValidation={rule:{type:"whole",operator:"between",formula1:0,formula2:1}};
sh.getRange("C2:M2").format.wrapText=true; sh.getRange("A2:M2").format.rowHeight=240;
for (const [c,w] of Object.entries({A:12,B:12,C:105,D:18,E:14,F:18,G:16,H:14,I:14,J:20,K:20,L:42,M:42})) sh.getRange(`${c}:${c}`).format.columnWidth=w;

sh=wb.worksheets.add("Codebook");
title(sh,"Locked Coding Definitions","Apply these definitions exactly. Actionability is an ordinal judgement, not a count of components.","C");
sh.getRange("A4:C14").values=[
  ["Field","Value","Definition"],
  ["actionability_overall",0,"No practical action; only empathy, reassurance or general information."],
  ["actionability_overall",1,"An action is suggested, but it is vague or unclear."],
  ["actionability_overall",2,"At least one clear, specific and followable action is provided."],
  ["coping_step",1,"Concrete coping or self-management activity is present."],
  ["professional_help",1,"Contact with a doctor, therapist, counsellor or professional service is recommended."],
  ["social_support",1,"Contact with family, friends, peers or a community group is recommended."],
  ["crisis_action",1,"An immediate crisis, emergency or safety action is recommended."],
  ["follow_up",1,"A later check-in, monitoring step or follow-up plan is provided."],
  ["surface_localisation",1,"Guidance is presented as specific to the user's location; correctness is not assessed here."],
  ["verified_localisation",1,"At least one location-specific service/contact is confirmed by a credible source; add the URL."]
];
header(sh.getRange("A4:C4")); sh.getRange("A5:C14").format={wrapText:true,borders:{preset:"inside",style:"thin",color:"#D8DEE8"},verticalAlignment:"top"};
sh.getRange("A5:C14").format.rowHeight=38; for (const [c,w] of Object.entries({A:28,B:12,C:92})) sh.getRange(`${c}:${c}`).format.columnWidth=w;

for(const sheet of wb.worksheets.items){
  const png=await wb.render({sheetName:sheet.name,autoCrop:"all",scale:1,format:"png"});
  await fs.writeFile(`${outDir}/preview_${sheet.name.replaceAll(" ","_")}.png`,new Uint8Array(await png.arrayBuffer()));
}
console.log((await wb.inspect({kind:"table",range:"Correct Scores!A1:D8",include:"values,formulas",tableMaxRows:8,tableMaxCols:4,maxChars:7000})).ndjson);
console.log((await wb.inspect({kind:"table",range:"Replacement Row!A1:M2",include:"values,formulas",tableMaxRows:2,tableMaxCols:13,maxChars:7000})).ndjson);
console.log((await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",options:{useRegex:true,maxResults:100},summary:"formula errors"})).ndjson);
await (await SpreadsheetFile.exportXlsx(wb)).save(`${outDir}/Repeat_Coding_CORRECTION_REQUIRED.xlsx`);
console.log(JSON.stringify({invalid_scores:invalidRows.length,replacement_sample_id:replacement[hi.sample_id],output:`${outDir}/Repeat_Coding_CORRECTION_REQUIRED.xlsx`}));
