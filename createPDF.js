// import fontkit from "@pdf-lib/fontkit"
// import path from "path"
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { readFile, readFileSync, writeFileSync } = require("fs");
const path = require("path");
const { fontkit } = require("@pdf-lib/fontkit");

const PDF_WIDTH = 595.28
const WIDTH = PDF_WIDTH - 40
const PDF_HEIGHT = 841.89
const HEIGHT = PDF_HEIGHT - 40
const PRIMARY_DETAILS_HT = 200
const MIN_ITEMS_ROW = 28
const MAX_ITEMS_ROW_PAGE_01 = 58

const BOTTOM_LEFT = {
  x: 20,
  y: 20
}

const TOP_LEFT = {
  x: 20,
  y: PDF_HEIGHT - 20
}

const TOP_RIGHT = {
  x: PDF_WIDTH - 20,
  y: PDF_HEIGHT - 20
}

const BOTTOM_RIGHT = {
  x: PDF_WIDTH - 20,
  y: 20
}

const RECT_BORDER = {
  color: rgb(1, 1, 1),
  borderOpacity: 0.25,
  borderWidth: 0.25,
}

const LINE_COLOR = {
  color: rgb(0, 0, 0),
  opacity: 0.25,
  thickness: 0.25,
}

const BOLD_TEXT = {
  color: rgb(0, 0, 0),
  size: 12
}
const TEXT = {
  color: rgb(0, 0, 0),
  size: 9
}
const SMALL_TEXT = {
  color: rgb(0, 0, 0),
  size: 7
}

const BILL_TABLE_Y = TOP_LEFT.y - PRIMARY_DETAILS_HT

async function createPDF() {
  const PDFdoc = await PDFDocument.create([PDF_WIDTH, PDF_HEIGHT]);
  PDFdoc.registerFontkit(fontkit);
  // const fontBytes = readFileSync(path.join(__dirname, 'Figtree-Regular.ttf'));
  const customFont = await PDFdoc.embedFont(StandardFonts.TimesRoman);
  const page = PDFdoc.addPage();
  const custName = 'Karthik';
  const custAddress = '';
  // page.embed(StandardFonts.Helvetica);
  constructPage(page);
  const additionalDetailsValue = {
    'GST No': '33ACKPL8536A',
    Mobile: '9942142562'
  }
  addHomeCompanyDetails(page, additionalDetailsValue);
  addToDetails(page, 'Salthi masala Works private linmited', true);
  const miscDetailsValue = ['12/12/2022', '001', 'Erode', 'Salem', 'Company Vehicle', 'TN37D2233']
  invoiceMiscDetails(page, miscDetailsValue);
  billedItemsTable(page, customFont);
  taxSeparation(page);
  writeFileSync("blank.pdf", await PDFdoc.save());
}

function addHomeCompanyDetails(page, additionalDetailsValue) {
  const companyAddressX = TOP_LEFT.x + 10
  const companyAddressY = TOP_LEFT.y - 15
  const ADDITIONAL_DETAILS = ['GST No', 'Mobile'];

  page.drawText('Insuvaii Food Products', {
    x: companyAddressX,
    y: companyAddressY,
    lineHeight: 10,
    ...BOLD_TEXT,
  });
  page.drawText(`306/21, Kunnathur Road,\nPerundurai. 638052.`, {
    x: companyAddressX,
    y: companyAddressY - 10,
    lineHeight: 10,
    ...TEXT
  });
  ADDITIONAL_DETAILS.forEach((additionalDetail, index) => {
    page.drawText(additionalDetail, {
      x: companyAddressX,
      y: companyAddressY - 60 - (10 * index),
      lineHeight: 10,
      ...TEXT
    });
    page.drawText(`\t\t: ${additionalDetailsValue[additionalDetail]}`, {
      x: companyAddressX + 30,
      y: companyAddressY - 60 - (10 * index),
      lineHeight: 10,
      ...TEXT
    });
  })
  
  // page.drawText('Perundurai. 638052', {
  //   x: companyAddressX,
  //   y: companyAddressY - 20,
  //   size: 7,
  //   color: rgb(0, 0, 0),
  // })
}

function addToDetails(page, to, isShippingAddress = false) {
  const toTitle = isShippingAddress ? 'Billed To:' : 'Billed & Shipped To:';
  var toAddressY = TOP_LEFT.y - (PRIMARY_DETAILS_HT / 2) - 15;
  var toAddressX = isShippingAddress ? 65 : TOP_LEFT.x + 5;

  page.drawText(`${toTitle}`, {
    x: TOP_LEFT.x + 5,
    y: toAddressY,
    lineHeight: 10,
    ...TEXT
  });
  page.drawText(`${to}`, {
    x: toAddressX,
    y: isShippingAddress ? toAddressY : toAddressY + 10,
    lineHeight: 10,
    ...BOLD_TEXT
  });
  if (isShippingAddress) {
    toAddressY -= 45;
    page.drawText('Shipped To:', {
      x: TOP_LEFT.x + 5,
      y: toAddressY,
      lineHeight: 10,
      ...TEXT
    });
    page.drawText(`${to}`, {
      x: toAddressX + 10,
      y: toAddressY,
      lineHeight: 10,
      ...BOLD_TEXT
    });
  }
}

function invoiceMiscDetails(page, miscDetailsValue) {
  const firstLine = {
    x: TOP_RIGHT.x - (TOP_LEFT.x * 2),
    y: TOP_RIGHT.y - 20
  }
  const MISC_DETAILS = [
    'Invoice Date',
    'Invoice No',
    'Dispatch From',
    'Destination',
    'Shipping',
    'Shipping Info'
  ]
  MISC_DETAILS.forEach((misc, index) => {
    page.drawText(misc, {
      x: BOTTOM_LEFT.x + ((WIDTH / 3) * 2) + 10,
      y: firstLine.y - (15 * index),
      lineHeight: 10,
      ...TEXT
    });
    page.drawText(`\t\t: ${miscDetailsValue[index]}`, {
      x: BOTTOM_LEFT.x + ((WIDTH / 3) * 2) + 60,
      y: firstLine.y - (15 * index),
      lineHeight: 10,
      ...TEXT
    });
  });

}

function constructPage(page) {
  // page.drawText('Tax Invoice', {
  //   x: 200,
  //   y: 800,
  //   size: 16,
  //   color: rgb(0, 0, 0),
  // });
  page.drawRectangle({
    x: BOTTOM_LEFT.x,
    y: BOTTOM_LEFT.y,
    width: WIDTH,
    height: HEIGHT,
    borderWidth: 0.25,
    ...RECT_BORDER
  });
  // PRIMARY DETAILS LINES
  page.drawLine({
    start: {x: BOTTOM_LEFT.x, y: TOP_LEFT.y - (PRIMARY_DETAILS_HT / 2)},
    end: {x: BOTTOM_LEFT.x + (WIDTH / 3) * 2, y: TOP_LEFT.y - (PRIMARY_DETAILS_HT / 2)},
    ...LINE_COLOR
  });
  page.drawLine({
    start: {x: BOTTOM_LEFT.x + (WIDTH / 3) * 2, y: BILL_TABLE_Y},
    end: {x: BOTTOM_LEFT.x + (WIDTH / 3) * 2, y: TOP_LEFT.y},
    ...LINE_COLOR
  });
  // BILL HEADER
  page.drawLine({
    start: {x: BOTTOM_LEFT.x, y: BILL_TABLE_Y},
    end: {x: BOTTOM_RIGHT.x, y: BILL_TABLE_Y},
    ...LINE_COLOR
  });
  page.drawLine({
    start: {x: BOTTOM_LEFT.x, y: BILL_TABLE_Y - 15},
    end: {x: BOTTOM_RIGHT.x, y: BILL_TABLE_Y - 15},
    ...LINE_COLOR
  });
}

function billedItemsTable(page, customFont) {
  //SET UP
  const TABLE_COL_HEADER = [
    {
      title: 'S.No.',
      pos: 5,
      length: 22,
    },
    {
      title: 'Items',
      pos: 75,
      length: 150,
    },
    {
      title: 'HSN/SAC',
      pos: 25,
      length: 50,
    },
    {
      title: 'Qty Nos',
      pos: 20,
      length: 40,
    },
    {
      title: 'Unit',
      pos: 15,
      length: 30
    },
    {
      title: 'Rate (Rs)',
      pos: 25,
      length: 48.5
    },
    {
      title: 'GST(%)',
      pos: 15,
      length: 30
    },
    {
      title: 'Tax Rs',
      pos: 40,
      length: 80
    },
    {
      title: 'Amount',
      pos: 50,
      length: 100
    },
  ];
  // ADD BILL ITEMS
  const billData = [
    {
      item: '200gm Sandwich Bread 200gm Sandwich Bread 200gm Sandwich Bread 200gm Sandwich Bread',
      hsn: '12345678',
      qty: '5012500',
      unit: 'crate',
      rate: '9999999',
      gst: '15',
      tax: '9999999.99',
      amt: '99999999.99'
    },
    {
      item: '200gm Brown Bread',
      hsn: '12123',
      qty: '2500',
      unit: 'crate',
      rate: '16',
      gst: '15',
      tax: '4505.55',
      amt: '22500'
    }
  ]
  var textSpillRows = 0;
  var totalBillRows = 0;
  billData.forEach((bill, index) => {
    const posX = TOP_LEFT.x;
    // Table position - Header height - bottom buffer - height of every row
    const posY = BILL_TABLE_Y - 15 - 4 - (10 * (index + textSpillRows + 1));
    var tabColHeaderIndex = 0;
    var newPosX = posX + TABLE_COL_HEADER[tabColHeaderIndex].length + 4;
    totalBillRows += textSpillRows + 1
    textSpillRows = 0;
    page.drawText(String(index + 1), {
      x: posX + TABLE_COL_HEADER[tabColHeaderIndex].length / 2,
      y: posY,
      lineHeight: 10,
      ...TEXT
    });
    const itemWidth = customFont.widthOfTextAtSize(bill.item, 9);
    var newBillItem = bill.item;
    if (itemWidth > 150) {
      var breakPoint = 0;
      newBillItem = '';
      for (let i=0; i<bill.item.length; i++) {
        if (customFont.widthOfTextAtSize(bill.item.slice(breakPoint, i), 9) > 149) {
          newBillItem = newBillItem == '' ? 
            bill.item.slice(breakPoint, i-1) : newBillItem.concat('\n', bill.item.slice(breakPoint, i-1))
          breakPoint = i-1;
          textSpillRows++;
        } else if (i == bill.item.length - 1) {
          newBillItem = newBillItem.concat('\n', bill.item.slice(breakPoint, bill.item.length));
        }
      }
    }
    page.drawText(newBillItem, {
      x: newPosX,
      y: posY,
      lineHeight: 10,
      font: customFont,
      ...TEXT
    });
    newPosX += TABLE_COL_HEADER[++tabColHeaderIndex].length;
    page.drawText(bill.hsn, {
      x: newPosX,
      y: posY,
      lineHeight: 10,
      ...TEXT
    });
    newPosX += TABLE_COL_HEADER[++tabColHeaderIndex].length;
    page.drawText(bill.qty, {
      x: newPosX,
      y: posY,
      lineHeight: 10,
      ...TEXT
    });
    newPosX += TABLE_COL_HEADER[++tabColHeaderIndex].length;
    page.drawText(bill.unit, {
      x: newPosX,
      y: posY,
      lineHeight: 10,
      ...TEXT
    });
    newPosX += TABLE_COL_HEADER[++tabColHeaderIndex].length;
    page.drawText(bill.rate, {
      x: newPosX,
      y: posY,
      lineHeight: 10,
      ...TEXT
    });
    newPosX += TABLE_COL_HEADER[++tabColHeaderIndex].length;
    page.drawText(bill.gst, {
      x: newPosX,
      y: posY,
      lineHeight: 10,
      ...TEXT
    });
    newPosX += TABLE_COL_HEADER[++tabColHeaderIndex].length;
    page.drawText(bill.tax, {
      x: newPosX,
      y: posY,
      lineHeight: 10,
      ...TEXT
    });
    newPosX += TABLE_COL_HEADER[++tabColHeaderIndex].length;
    page.drawText(bill.amt, {
      x: newPosX,
      y: posY,
      lineHeight: 10,
      ...TEXT
    });
  })
  if (MIN_ITEMS_ROW >= totalBillRows) {
    var pointX = TOP_LEFT.x;
    TABLE_COL_HEADER.forEach((header, index) => {
      page.drawText(header.title, {
        x: pointX + 4,
        y: BILL_TABLE_Y - 10,
        lineHeight: 10,
        ...SMALL_TEXT
      });
      if (index != TABLE_COL_HEADER.length - 1) {
        pointX += header.length;
        page.drawLine({
          start: {x: pointX, y: BILL_TABLE_Y},
          end: {x: pointX, y: BILL_TABLE_Y - 15 - (10 * MIN_ITEMS_ROW)},
          ...LINE_COLOR
        });
      }
    });
    page.drawLine({
      start: {x: TOP_LEFT.x, y: TOP_LEFT.y - PRIMARY_DETAILS_HT - 15 - (10 * MIN_ITEMS_ROW)},
      end: {x: BOTTOM_RIGHT.x, y: TOP_LEFT.y - PRIMARY_DETAILS_HT - 15 - (10 * MIN_ITEMS_ROW)},
      ...LINE_COLOR
    });
  }
}

function taxSeparation(page) {
  const TAX_SEPARATION = [
    {
      title: 'Tax (%)',
      length: 60
    },
    {
      title: 'CGST',
      length: 60
    },
    {
      title: 'SGST',
      length: 60
    },
    {
      title: 'Total',
      length: 60
    },
  ];
  const TAX_RATES = [ '5%', '12%', '18%'];
  var posX = TOP_LEFT.x;
  const posY = TOP_LEFT.y - PRIMARY_DETAILS_HT - 15 - (10 * MIN_ITEMS_ROW);
  TAX_SEPARATION.forEach((taxHeader, index) => {
    page.drawText(taxHeader.title, {
      x: posX + (taxHeader.length / 2),
      y: posY - 10,
      lineHeight: 10,
      ...SMALL_TEXT
    });
    posX += taxHeader.length;
    // page.drawLine({
    //   start: {x: posX, y: posY},
    //   end: {x: posX, y: posY - 15},
    //   ...LINE_COLOR
    // });
  });
  TAX_RATES.forEach((tax, index) => {
    page.drawText(tax, {
      x: TOP_LEFT.x + (TAX_SEPARATION[index].length / 2),
      y: posY - 10 - (20 * (index + 1)),
      lineHeight: 10,
      ...SMALL_TEXT
    })
  })
  page.drawText('Total tax value', {
    x: TOP_LEFT.x + 370.5,
    y: posY - 10,
    lineHeight: 10,
    ...SMALL_TEXT
  });
  page.drawText('11,99,99,999.00', {
    x: TOP_LEFT.x + 450.5,
    y: posY - 10,
    lineHeight: 10,
    ...SMALL_TEXT
  });
  // Round off
  page.drawText('Rounded off', {
    x: TOP_LEFT.x + 370.5,
    y: posY - 25,
    lineHeight: 10,
    ...SMALL_TEXT
  });
  page.drawText('0.32', {
    x: TOP_LEFT.x + 450.5,
    y: posY - 25,
    lineHeight: 10,
    ...SMALL_TEXT
  });
  // Net Amount
  page.drawText('Net Amount', {
    x: TOP_LEFT.x + 370.5,
    y: posY - 45,
    lineHeight: 10,
    ...BOLD_TEXT
  });
  page.drawText('11,99,99,999.00', {
    x: TOP_LEFT.x + 450.5,
    y: posY - 45,
    lineHeight: 10,
    ...BOLD_TEXT
  });
}

createPDF().catch((err) => console.log(err));