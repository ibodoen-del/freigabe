import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      success: false,
      message: "Nur POST erlaubt"
    });

  }

  try {

    const {
      vorname,
      nachname,
      strasse,
      hausnummer,
      plz,
      stadt,
      geburtsdatum,
      email,
      unterschrift
    } = req.body;
    const pdfPath = "/tmp/einverstaendnis.pdf";

const doc = new PDFDocument();

doc.pipe(fs.createWriteStream(pdfPath));

doc.fontSize(22).text("Einverständniserklärung", {
align: "center"
});

doc.moveDown();

doc.fontSize(12);

doc.text(`Vorname: ${vorname}`);
doc.text(`Nachname: ${nachname}`);
doc.text(`Straße: ${strasse}`);
doc.text(`Hausnummer: ${hausnummer}`);
doc.text(`PLZ: ${plz}`);
doc.text(`Stadt: ${stadt}`);
doc.text(`Geburtsdatum: ${geburtsdatum}`);
doc.text(`E-Mail: ${email}`);

doc.moveDown();

doc.text(`
Hiermit berechtige ich Ibrahim Doenmez,
in meinem Namen Energie- und Versicherungsangebote
einzuholen und abschließen sowie mit Energieversorgern und
Versicherungen zu kommunizieren.
`);
doc.moveDown();

doc.fontSize(16).text("Unterschrift:");

const base64Data = unterschrift.replace(
/^data:image\/png;base64,/,
""
);

const imageBuffer = Buffer.from(base64Data, "base64");

doc.image(imageBuffer, {
fit: [250, 120],
align: "left"
});

doc.moveDown();

doc.text(`Datum: ${new Date().toLocaleDateString("de-DE")}`);
doc.end();

    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 465,

      secure: true,

      auth: {

        user: "diipeag@gmail.com",

        pass: "bxmg irdw hgzs bkun"

      },

      tls: {
        rejectUnauthorized: false
      }

    });

    const html = `

    <div style="
    font-family:Arial;
    padding:20px;
    max-width:700px;
    margin:auto;
    color:#222;
    ">

    <h1 style="
    color:green;
    ">
    Einverständniserklärung
    </h1>

    <p><b>Vorname:</b> ${vorname}</p>

    <p><b>Nachname:</b> ${nachname}</p>

    <p><b>Straße:</b> ${strasse}</p>
    
    <p><b>Hausnummer:</b> ${hausnummer}</p>

    <p><b>PLZ:</b> ${plz}</p>

    <p><b>Stadt:</b> ${stadt}</p>

    <p><b>Geburtsdatum:</b> ${geburtsdatum}</p>

    <p><b>E-Mail:</b> ${email}</p>

    <hr>

    <p style="
    line-height:1.7;
    font-size:16px;
    ">

    Hiermit berechtige ich
    Ibrahim Doenmez, in meinem Namen
    Energie- und Versicherungsangebote
    einzuholen, Tarifvergleiche durchzuführen
    und abzuschließen sowie mit
    Energieversorgern und Versicherungen
    zu kommunizieren.

    </p>
    <h2>Unterschrift</h2>

<img
src="cid:unterschrift"
style="
max-width:320px;
max-height:120px;
display:block;
margin-bottom:30px;
border:1px solid #ccc;
border-radius:10px;
background:white;
padding:10px;
">
<br>
<p><b>Datum:</b> ${new Date().toLocaleDateString("de-DE")}</p>

 
    </div>

    `;

    await transporter.sendMail({

      from: '"Ibrahim Doenmez" <diipeag@gmail.com>',

    to: `info@stabiltarife.de, ${email}`,

      subject: "Einverständniserklärung",

      html: html,

attachments: [

{
filename: "einverstaendnis.pdf",
path: pdfPath
},

{
filename: "unterschrift.png",
path: unterschrift,
cid: "unterschrift"
}

]

    });

    return res.status(200).json({
      success: true
    });

  } catch (error) {

    console.log("MAIL FEHLER:");

    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

}

