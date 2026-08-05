import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "/workspace/scratch/e5c7d9a5fab7";
const result = JSON.parse(await fs.readFile(`${root}/tmp/repeat_reliability/results.json`, "utf8"));
const outDir = `${root}/outputs/repeat_reliability_final`;
await fs.mkdir(outDir, { recursive: true });

const wb = Workbook.create();
const navy = "#17365D", blue = "#D9EAF7", green = "#E2F0D9", red = "#FCE4D6", grey = "#E7E6E6";
function header(range) { range.format = { fill: navy, font: { bold: true, color: "#FFFFFF" }, wrapText: true, verticalAlignment: "center" }; }
function title(sh, text, subtitle, lastCol) {
  sh.mergeCells(`A1:${lastCol}1`); sh.getRange("A1").values = [[text]];
  sh.getRange(`A1:${lastCol}1`).format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 16 }, rowHeight: 30, verticalAlignment: "center" };
  sh.mergeCells(`A2:${lastCol}2`); sh.getRange("A2").values = [[subtitle]];
  sh.getRange(`A2:${lastCol}2`).format = { fill: blue, font: { italic: true, color: "#334155" }, wrapText: true, rowHeight: 34 };
  sh.showGridLines = false;
}

let sh = wb.worksheets.add("Summary");
title(sh, "Repeat-Coding Reliability — Final Result", "The 40-row repeat sample measures intra-rater consistency only; the original 160-row hold-out remains the validity reference.", "G");
sh.getRange("A4:G12").values = [
  ["Measure", "N", "Raw agreement", "Kappa", "Threshold", "Decision", "Interpretation"],
  ...result.metrics.map(m => [m.measure, m.n, m.agreement, m.kappa, m.threshold, m.decision, m.decision === "PASS" ? "Meets criterion" : "Does not meet pre-specified criterion"]),
];
header(sh.getRange("A4:G4"));
sh.getRange("A5:G12").format = { wrapText: true, borders: { preset: "inside", style: "thin", color: "#D8DEE8" } };
sh.getRange("C5:E12").format.numberFormat = "0.000";
sh.getRange("F5:F12").format.fill = red;
sh.getRange("A14:G18").values = [
  ["Final methodological decision", null, null, null, null, null, null],
  ["Result", "No measure reached κ ≥ 0.70.", null, null, null, null, null],
  ["Meaning", "The single coder's repeat judgements were not sufficiently stable under the locked codebook. Raw agreement cannot rescue the result where prevalence is highly imbalanced.", null, null, null, null, null],
  ["Submission use", "Report intra-rater reliability transparently; retain the 160-row hold-out failures; treat H1/H2 automated outcomes as exploratory or replace them with fully human-coded outcomes.", null, null, null, null, null],
  ["Do not do", "Do not discard first-round labels, tune rules on the hold-out, or describe these measures as independently validated.", null, null, null, null, null],
];
sh.mergeCells("A14:G14"); sh.getRange("A14:G14").format = { fill: navy, font: { bold: true, color: "#FFFFFF" } };
for (let r = 15; r <= 18; r++) sh.mergeCells(`B${r}:G${r}`);
sh.getRange("A15:G18").format = { wrapText: true, verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: "#D8DEE8" } };
sh.getRange("A15:A18").format.font = { bold: true };
sh.getRange("A15:G18").format.rowHeight = 44;
for (const [c,w] of Object.entries({A:27,B:10,C:17,D:14,E:14,F:12,G:48})) sh.getRange(`${c}:${c}`).format.columnWidth = w;

sh = wb.worksheets.add("Confusion Matrices");
title(sh, "Confusion Matrices", "Rows are first-round labels; columns are repeat labels. Counts reveal systematic directional shifts hidden by raw agreement.", "E");
let row = 4;
for (const m of result.metrics) {
  sh.getRange(`A${row}:E${row}`).merge(); sh.getRange(`A${row}`).values = [[m.measure]];
  sh.getRange(`A${row}:E${row}`).format = { fill: navy, font: { bold: true, color: "#FFFFFF" } };
  row++;
  const labels = m.labels;
  const grid = [["First \\ Repeat", ...labels.map(x => `Repeat ${x}`), "Row total"]];
  for (let i=0;i<labels.length;i++) grid.push([`First ${labels[i]}`, ...m.confusion_matrix[i], m.confusion_matrix[i].reduce((a,b)=>a+b,0)]);
  const cols = labels.length + 2;
  sh.getRangeByIndexes(row-1,0,grid.length,cols).values = grid;
  header(sh.getRangeByIndexes(row-1,0,1,cols));
  sh.getRangeByIndexes(row,0,grid.length-1,cols).format = { borders: { preset: "inside", style: "thin", color: "#D8DEE8" } };
  row += grid.length + 1;
}
for (const [c,w] of Object.entries({A:24,B:16,C:16,D:16,E:16})) sh.getRange(`${c}:${c}`).format.columnWidth = w;

sh = wb.worksheets.add("Row Comparisons");
const compHeaders = ["repeat_id","sample_id","measure","first_label","repeat_label","agreement"];
const compRows = result.comparisons.map(x => compHeaders.map(h => x[h]));
sh.getRangeByIndexes(0,0,compRows.length+1,compHeaders.length).values = [compHeaders,...compRows];
header(sh.getRange("A1:F1")); sh.tables.add(`A1:F${compRows.length+1}`,true,"RowComparisonsTable").style="TableStyleMedium2";
sh.freezePanes.freezeRows(1); sh.freezePanes.freezeColumns(2); sh.showGridLines=false;
sh.getRange(`F2:F${compRows.length+1}`).format.numberFormat="0";
sh.getRange(`A2:F${compRows.length+1}`).format.rowHeight=20;
for (const [c,w] of Object.entries({A:13,B:13,C:26,D:14,E:14,F:13})) sh.getRange(`${c}:${c}`).format.columnWidth=w;

sh = wb.worksheets.add("Method Record");
title(sh, "Locked Method Record", "This sheet records the decisions made before calculation and the repair of the corrupted repeat item.", "B");
sh.getRange("A4:B11").values = [
  ["Item","Record"],
  ["First-round reference","Fresh 160-response hold-out; labels were not discarded or altered."],
  ["Repeat sample","40 responses (25% of hold-out)."],
  ["Corrupted item","R001/H146 was uncodeable and excluded."],
  ["Replacement","R001R/H003 was coded in the correction workbook and included, preserving N=40."],
  ["Actionability statistic","Quadratic-weighted Cohen's kappa."],
  ["Binary statistics","Unweighted Cohen's kappa."],
  ["Acceptance rule","κ ≥ 0.70, pre-specified before viewing repeat results."],
];
header(sh.getRange("A4:B4")); sh.getRange("A5:B11").format={wrapText:true,borders:{preset:"inside",style:"thin",color:"#D8DEE8"},verticalAlignment:"top"};
sh.getRange("A5:B11").format.rowHeight=38; sh.getRange("A:A").format.columnWidth=28; sh.getRange("B:B").format.columnWidth=92;

const errorScan = await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",options:{useRegex:true,maxResults:100},summary:"formula errors"});
console.log(errorScan.ndjson);
for (const sheet of wb.worksheets.items) {
  const png = await wb.render({sheetName: sheet.name, autoCrop:"all", scale:1, format:"png"});
  await fs.writeFile(`${outDir}/preview_${sheet.name.replaceAll(" ","_")}.png`, new Uint8Array(await png.arrayBuffer()));
}
console.log((await wb.inspect({kind:"table",range:"Summary!A1:G18",include:"values,formulas",tableMaxRows:20,tableMaxCols:8,maxChars:12000})).ndjson);
await (await SpreadsheetFile.exportXlsx(wb)).save(`${outDir}/Repeat_Coding_RELIABILITY_RESULTS.xlsx`);
