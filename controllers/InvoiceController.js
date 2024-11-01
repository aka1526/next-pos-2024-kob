const prisma = require("../models/prismaClient");
const Joi = require("joi");
const pdfkit = require("pdfkit");
const fs = require("fs");
const dayjs = require("dayjs");

const donenv = require("dotenv");
donenv.config();
/*
.env
UPLOADS_INV="uploads/invoice"
UPLOADS_BILL="uploads/bill"
UPLOADS_LOGO="uploads/logo"
UPLOADS_USER="uploads/user"
UPLOADS_PRODUCT="uploads/product"
*/

const UPLOADS_INV = process.env.UPLOADS_INV;
const UPLOADS_BILL = process.env.UPLOADS_BILL;

exports.report1 = async (req, res) => {
  const Id = req.params.id ? req.params.id : 1;
  // const userId = req.body.userId ? req.body.userId : 1;
  // const tableNo = req.body.tableNo ? req.body.tableNo : 1;
  const status = "use";

  try {
    // organization

    const organization = await prisma.organization.findFirst();
    // rows in saleTemps
    const billSale = await prisma.billSale.findFirst({
      include: {
        BillSaleDetails: {
          include: {
            Food: true,
            FoodSize: true,
          },
        },
        User: true,
      },
      where: {
        id: parseInt(Id),
        // userId:  parseInt(userId),
        // tableNo: parseInt(tableNo),
        status: status,
      },
      orderBy: {
        id: "desc",
      },
    });

    function formatBillId(id) {
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
      const formattedId = String(id).padStart(4, "0");
      return `SI-${currentYear}${currentMonth}${formattedId}`;
    }

    let docno = formatBillId(billSale.id);

    const billSaleDetails = billSale.BillSaleDetails;

    //A5= 419.53 x 595.28
    const doc = new pdfkit({
      size: "A5", //[paperWidth, paperHieght],
      layout: "landscape", // portrait landscape

      margins: {
        top: 16,
        bottom: 16,
        left: 16,
        right: 16,
      },
    });

    const paperWidth = doc.page.width;
    const paperHieght = doc.page.height;
    const cornerRadius = 6;
    const padding = 16;
    const herderMargin = 16;

    const fileName =
      UPLOADS_BILL + `/bill-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.pdf`;
    const font = "Kanit/kanit-regular.ttf";
    const Angsana = "angsana-new/angsai.ttf";
    const AngsanaBold = "angsana-new/angsab.ttf";
    const font12 = "12";
    const font14 = "14";
    const font16 = "16";
    const font18 = "18";
    const font20 = "20";
    const font22 = "22";

    if (!fs.existsSync(UPLOADS_BILL)) {
      fs.mkdirSync(UPLOADS_BILL, { recursive: true }); // recursive: true จะสร้างโฟลเดอร์ย่อยได้
    }

    doc.pipe(fs.createWriteStream(fileName));

    // ฟังก์ชันสำหรับสร้างหัวกระดาษ
    function generateHeader(doc, index, docno) {
      // display logo
      const imageWidth = 40;
      const imageHieght = 40;
      if (organization.logo != "") {
        doc.image("uploads/" + organization.logo, 150, 18, {
          align: "center",
          width: imageWidth,
          height: imageHieght,
        });
      }

      // { align: 'right', width: 150 }
      //จัดชิดขวา กว้างไม่เกิน 150
      //ตำแหน่ง 240, 30
      doc.moveDown();

      // วาดเส้นขอบกระดาษ
      // doc.rect(padding, padding, paperWidth - 2 * padding, paperHieght - 2 * padding).stroke();

      // วาดเส้นขอบมน
      doc.lineWidth(0.6);
      doc
        .roundedRect(
          herderMargin,
          herderMargin,
          paperWidth - 2 * herderMargin,
          paperHieght - 2 * herderMargin,
          cornerRadius
        )
        .stroke();

      doc.font(AngsanaBold);
      doc.fontSize(20).text("ใบเบิก-จ่ายวัสดุสิ้นเปลือง", 200, doc.y + 8);
      doc.font(Angsana);
      doc
        .fontSize(font12)
        .text("หน้า   " + parseInt(index + 1).toString(), 460, 16, {
          align: "right",
          width: 100,
        });
      doc
        .fontSize(font12)
        .text(`เลขที่เอกสาร :`, 480, 30, { align: "left", width: 150 });
      doc.font(AngsanaBold);
      doc
        .fontSize(font12)
        .text(` ${docno}`, 530, 30, { align: "left", width: 150 });
      doc.font(Angsana);
      doc
        .fontSize(font12)
        .text(
          `วันที่ : ${dayjs(new Date()).format("DD/MM/YYYY HH:mm:ss")}`,
          480,
          doc.y + 2,
          { align: "left", width: 150 }
        );
      doc.moveDown();
    }

    function generateTableRowHeader(doc) {
      doc.font(Angsana);
      doc.fontSize(font16);
      doc.text("ลำดับ", 16, 66, { align: "center", width: 30 });
      doc.text("รหัสสินค้า", 46, 66, { align: "center", width: 120 }); // 40+6 =46
      doc.text("รายละเอียด", 166, 66, { align: "center", width: 200 }); // 120+46=166
      doc.text("ราคา", 366, 66, { align: "center", width: 80 }); // 200+ 166=
      doc.text("จำนวน", 446, 66, { align: "center", width: 60 }); // 80+366 =466
      doc.text("รวมเงิน", 506, 66, { align: "center", width: 73 });

      // วาดเส้นขอบรอบแต่ละช่องในหัวตาราง
      doc.lineWidth(1);
      doc.rect(16, 66, 30, parseInt(font16) + 2).stroke();
      doc.rect(46, 66, 120, parseInt(font16) + 2).stroke();
      doc.rect(166, 66, 200, parseInt(font16) + 2).stroke();
      doc.rect(366, 66, 80, parseInt(font16) + 2).stroke();
      doc.rect(446, 66, 60, parseInt(font16) + 2).stroke();
      doc.rect(506, 66, 73, parseInt(font16) + 2).stroke();
    }

    // set border height
    // ฟังก์ชันสำหรับสร้างแถวตาราง
    function generateTableRow(doc, y, c1, c2, c3, c4, c5, c6) {
      doc.lineWidth(0.6);
      let hh = parseInt(font14) + 6;
      doc.rect(16, y, 30, hh).stroke();
      doc.rect(46, y, 120, hh).stroke();
      doc.rect(166, y, 200, hh).stroke();
      doc.rect(366, y, 80, hh).stroke();
      doc.rect(446, y, 60, hh).stroke();
      doc.rect(506, y, 73, hh).stroke();

      doc.fontSize(font14).font(Angsana);
      doc.text(c1, 16, y, { align: "center", width: 30 });
      doc.text("  " + c2, 46, y, { align: "left", width: 120 });
      doc.text("  " + c3, 166, y, { align: "left", width: 200 });
      doc.text(c4, 366, y, { align: "center", width: 80 });
      doc.text(c5, 446, y, { align: "center", width: 60 });
      doc.text(c6, 506, y, { align: "right", width: 70 });
    }

    // เพิ่มหัวกระดาษสำหรับหน้าแรก
    generateHeader(doc, 0, docno);

    // สร้างหัวคอลัมน์สำหรับตาราง
    const tableTop = 66;
    const itemSpacing = 20;
    generateTableRowHeader(doc);
    let position = tableTop + itemSpacing;
    let page = 0;

    billSaleDetails.map((row, index) => {
      // ตรวจสอบว่าต้องเพิ่มหน้าใหม่หรือไม่
      if (position > 300) {
        //  ตำแหน่งขึ้นหน้าใหม่
        doc.addPage();
        page = page + 1;
        generateHeader(doc, page, docno); // เพิ่มหัวกระดาษในทุกหน้าใหม่
        generateTableRowHeader(doc);
        position = tableTop + itemSpacing;
      }

      // เพิ่มข้อมูลวัสดุในตาราง
      generateTableRow(
        doc,
        position,
        index + 1,
        "FA-CCROW-" + (index + 1).toString(),
        row.Food.name,
        row.Food.price,
        1,
        row.Food.price
      );
      position += itemSpacing;
    });
    // ปิดและบันทึกเอกสาร PDF
    doc.end();

    return res.send({ message: "success", fileName: fileName, docno: docno });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};
