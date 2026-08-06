/** يبني PDF بسيط (نص) بدون dependencies */
function escapePdfText(s) {
  return String(s || "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export default function buildCertificatePdf({ studentName, courseTitle, dateStr, certId }) {
  const lines = [
    "Certificate of Completion",
    `Student: ${studentName}`,
    `Course: ${courseTitle}`,
    `Date: ${dateStr}`,
    `ID: ${certId}`,
  ];
  const content = [
    "BT",
    "/F1 24 Tf",
    "50 750 Td",
    `(${escapePdfText(lines[0])}) Tj`,
    "/F1 14 Tf",
    "0 -40 Td",
    `(${escapePdfText(lines[1])}) Tj`,
    "0 -24 Td",
    `(${escapePdfText(lines[2])}) Tj`,
    "0 -24 Td",
    `(${escapePdfText(lines[3])}) Tj`,
    "0 -24 Td",
    `(${escapePdfText(lines[4])}) Tj`,
    "ET",
  ].join("\n");

  const objects = [];
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  objects.push(
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
  );
  objects.push(`4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
  objects.push("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  }
  const xrefPos = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}
