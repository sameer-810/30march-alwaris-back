import mongoose from "mongoose";
import { env } from "../src/config/env.js";

import { customerTypeService } from "../src/modules/masters/customer-type/customer-type.service.js";
import { customerService } from "../src/modules/masters/customer/customer.service.js";
import { employeeService } from "../src/modules/masters/employee/employee.service.js";
import { lineOfBixService } from "../src/modules/masters/line-of-bix/line-of-bix.service.js";
import { portService } from "../src/modules/masters/port/port.service.js";
import { serviceService } from "../src/modules/masters/service/service.service.js";
import { shipmentService } from "../src/modules/masters/shipment/shipment.service.js";
import { tariffDescriptionService } from "../src/modules/masters/tariff-description/tariff-description.service.js";
import { termsService } from "../src/modules/masters/terms/terms.service.js";
import { termsConditionService } from "../src/modules/masters/terms-condition/terms-condition.service.js";
import { vesselService } from "../src/modules/masters/vessel/vessel.service.js";
import { vendorAgentService } from "../src/modules/masters/vendor-agent/vendor-agent.service.js";
import { vendorTypeService } from "../src/modules/masters/vendor-type/vendor-type.service.js";
import { bookingService } from "../src/modules/booking/booking.service.js";
import { billOfLadingService } from "../src/modules/bill-of-lading/bill-of-lading.service.js";

const DEPARTMENTS = ["HOD", "Marketing", "Accounts", "Other"];
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune"];
const STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "West Bengal",
  "Maharashtra",
];

function pad(num, width = 3) {
  return String(num).padStart(width, "0");
}

function pick(arr, index) {
  return arr[index % arr.length];
}

async function createMany(label, count, createFn) {
  let success = 0;
  let failed = 0;
  const created = [];

  for (let i = 1; i <= count; i += 1) {
    try {
      const item = await createFn(i);
      created.push(item);
      success += 1;
    } catch (error) {
      failed += 1;
      console.log(`[${label}] failed at #${i}: ${error.message}`);
    }
  }

  console.log(`[${label}] success=${success}, failed=${failed}`);
  return created;
}

async function run() {
  const count = 30;
  const tag = String(Date.now()).slice(-8);

  if (!Number.isFinite(count) || count <= 0) {
    throw new Error("Seed count must be a positive number");
  }

  console.log(`Connecting to DB: seeding ${count} rows per module...`);
  await mongoose.connect(env.MONGODB_URI);

  const customerTypes = await createMany("customer-type", count, async (i) => {
    return customerTypeService.create({
      customerType: `Customer Type ${tag}-${pad(i)}`,
    });
  });

  const vendorTypes = await createMany("vendor-type", count, async (i) => {
    return vendorTypeService.create({
      vendorType: `Vendor Type ${tag}-${pad(i)}`,
    });
  });

  const lineOfBixRows = await createMany("line-of-bix", count, async (i) => {
    return lineOfBixService.create({
      code: `LOB${tag}${pad(i)}`,
      lineOfBix: `Line Of Bix ${tag}-${pad(i)}`,
    });
  });

  const ports = await createMany("port", count, async (i) => {
    return portService.create({
      portCode: `PRT${tag}${pad(i)}`,
      portName: `Port ${tag}-${pad(i)}`,
    });
  });

  await createMany("service", count, async (i) => {
    return serviceService.create({
      serviceType: `Service Type ${tag}-${pad(i)}`,
    });
  });

  await createMany("shipment", count, async (i) => {
    return shipmentService.create({
      shipmentType: `Shipment Type ${tag}-${pad(i)}`,
    });
  });

  const tariffDescriptions = await createMany(
    "tariff-description",
    count,
    async (i) => {
      return tariffDescriptionService.create({
        description: `Tariff Description ${tag}-${pad(i)}`,
      });
    },
  );

  const terms = await createMany("terms", count, async (i) => {
    return termsService.create({
      terms: `Terms ${tag}-${pad(i)}`,
      description: `Terms description ${tag}-${pad(i)}`,
    });
  });

  const vessels = await createMany("vessel", count, async (i) => {
    return vesselService.create({
      vesselName: `Vessel ${tag}-${pad(i)}`,
    });
  });

  const employees = await createMany("employee", count, async (i) => {
    const city = pick(CITIES, i);
    const state = pick(STATES, i);
    return employeeService.create({
      isActive: i % 5 !== 0,
      isApproved: i % 4 !== 0,
      employeeName: `Employee ${tag}-${pad(i)}`,
      department: pick(DEPARTMENTS, i),
      address: `${i} Business Park, Sector ${i % 20}`,
      city,
      pincode: String(400000 + i),
      state,
      country: "India",
      contactNo: `+9199${String(10000000 + i).slice(-8)}`,
      emailId: `employee.${tag}.${i}@example.com`,
    });
  });

  await createMany("terms-condition", count, async (i) => {
    if (lineOfBixRows.length === 0) {
      throw new Error("No line-of-bix records available");
    }

    const line = lineOfBixRows[(i - 1) % lineOfBixRows.length];
    return termsConditionService.create({
      lineOfBixId: String(line._id || line.id),
      description: `Terms Condition ${tag}-${pad(i)} mapped to ${line.code}`,
    });
  });

  const customers = await createMany("customer", count, async (i) => {
    if (customerTypes.length === 0) {
      throw new Error("No customer-type records available");
    }

    const type = customerTypes[(i - 1) % customerTypes.length];
    return customerService.create({
      customerTypeId: String(type._id || type.id),
      mail: i % 2 === 0 ? "Y" : "N",
      customerName: `Customer ${tag}-${pad(i)}`,
      address: `${10 + i} Trade Center Road`,
      city: pick(CITIES, i),
      country: "India",
      state: pick(STATES, i),
      pincode: String(500000 + i),
      contactPerson: `Contact ${tag}-${pad(i)}`,
      contactNo: `+9188${String(10000000 + i).slice(-8)}`,
      emailId: `customer.${tag}.${i}@example.com`,
      additionalEmailIds: [`accounts.${tag}.${i}@example.com`],
      gstVatNo: `GST${tag}${pad(i, 4)}`,
      creditDays: i % 30,
      stateCode: String((i % 35) + 1).padStart(2, "0"),
      panNo: `PAN${tag}${pad(i, 4)}`,
    });
  });

  const vendorAgents = await createMany("vendor-agent", count, async (i) => {
    if (vendorTypes.length === 0) {
      throw new Error("No vendor-type records available");
    }

    const type = vendorTypes[(i - 1) % vendorTypes.length];
    return vendorAgentService.create({
      vendorTypeId: String(type._id || type.id),
      mail: i % 2 === 0 ? "Y" : "N",
      vendorName: `Vendor Agent ${tag}-${pad(i)}`,
      address: `${20 + i} Logistics Hub Road`,
      city: pick(CITIES, i),
      country: "India",
      state: pick(STATES, i),
      pincode: String(600000 + i),
      contactPerson: `Agent Contact ${tag}-${pad(i)}`,
      contactNo: `+9177${String(10000000 + i).slice(-8)}`,
      emailId: `vendoragent.${tag}.${i}@example.com`,
      additionalEmailIds: [`billing.vendoragent.${tag}.${i}@example.com`],
      gstVatNo: `GSTVA${tag}${pad(i, 4)}`,
      creditDays: i % 45,
      stateCode: String((i % 35) + 1).padStart(2, "0"),
      panNo: `PVA${tag}${pad(i, 4)}`,
    });
  });

  const bookings = await createMany("booking", count, async (i) => {
    if (employees.length === 0) {
      throw new Error("No employee records available");
    }
    if (customers.length === 0) {
      throw new Error("No customer records available");
    }
    if (ports.length === 0) {
      throw new Error("No port records available");
    }
    if (terms.length === 0) {
      throw new Error("No terms records available");
    }
    if (lineOfBixRows.length === 0) {
      throw new Error("No line-of-bix records available");
    }
    if (vessels.length === 0) {
      throw new Error("No vessel records available");
    }
    if (vendorAgents.length === 0) {
      throw new Error("No vendor-agent records available");
    }
    if (tariffDescriptions.length === 0) {
      throw new Error("No tariff-description records available");
    }

    const employee = employees[(i - 1) % employees.length];
    const customer = customers[(i - 1) % customers.length];
    const billingCustomer = customers[i % customers.length];
    const portLoad = ports[(i - 1) % ports.length];
    const portDest = ports[i % ports.length];
    const term = terms[(i - 1) % terms.length];
    const lineOfBix = lineOfBixRows[(i - 1) % lineOfBixRows.length];
    const vessel = vessels[(i - 1) % vessels.length];
    const tariffDescription =
      tariffDescriptions[(i - 1) % tariffDescriptions.length];
    const vendorAgent = vendorAgents[(i - 1) % vendorAgents.length];

    const generatedReference = await bookingService.getNextReference();

    return bookingService.create({
      jobDate: new Date(Date.now() + i * 86400000).toISOString(),
      rateAgreedBy: String(employee._id || employee.id),
      bookingParty: String(customer._id || customer.id),
      kindAttention: String(employee._id || employee.id),
      shipper: `Shipper ${tag}-${pad(i)}`,
      consignee: `Consignee ${tag}-${pad(i)}`,
      modeOfTransport: "Sea",
      exportImport: i % 2 === 0 ? "Export" : "Import",
      portOfLoading: String(portLoad._id || portLoad.id),
      portOfDestination: String(portDest._id || portDest.id),
      line: ["ACL", "AGL", "ASR"][(i - 1) % 3],
      status: "Pending",
      terms: String(term._id || term.id),
      lineOfBix: String(lineOfBix._id || lineOfBix.id),
      mbl: `MBL-${tag}-${pad(i)}`,
      orderReference: `OR-${tag}-${pad(i)}`,
      defaultCurrency: i % 2 === 0 ? "USD" : "AED",
      billingParty: String(billingCustomer._id || billingCustomer.id),
      shipmentDetails: [
        {
          generatedReference,
          containerNo: `CNT-${tag}-${pad(i, 5)}`,
          qty: 1,
          size: "20",
          type: "GP",
          commodity: `Commodity ${tag}-${pad(i)}`,
          netWeight: 1000,
          grossWeight: 1200,
          volume: 10,
          vessel: String(vessel._id || vessel.id),
          voyage: `V${pad(i, 2)}`,
          etd: new Date(Date.now() + i * 86400000).toISOString(),
          eta: new Date(Date.now() + (i + 7) * 86400000).toISOString(),
          hbl: `HBL-${tag}-${pad(i)}`,
          remarks: `Shipment detail seeded ${tag}-${pad(i)}`,
        },
      ],
      incomeDetails: [
        {
          incomeBillingParty: String(billingCustomer._id || billingCustomer.id),
          chargeDescription: String(
            tariffDescription._id || tariffDescription.id,
          ),
          chargedPer: "DOCS",
          qty: 1,
          rate: 500,
          currency: "USD",
          size: "20",
          type: "GP",
          amount: 500,
          exRate: 1,
          remarks: `Income for booking ${tag}-${pad(i)}`,
        },
      ],
      expenseDetails: [
        {
          vendorName: String(vendorAgent._id || vendorAgent.id),
          chargeDescription: String(
            tariffDescription._id || tariffDescription.id,
          ),
          chargedPer: "DOCS",
          qty: 1,
          rate: 300,
          currency: "USD",
          size: "20",
          type: "GP",
          amount: 300,
          exRate: 1,
          invoiceNo: `INV-${tag}-${pad(i)}`,
          date: new Date(Date.now() + i * 86400000).toISOString(),
          remarks: `Expense for booking ${tag}-${pad(i)}`,
        },
      ],
    });
  });

  await createMany("bill-of-lading", count, async (i) => {
    if (bookings.length === 0) {
      throw new Error("No booking records available");
    }

    const booking = bookings[(i - 1) % bookings.length];
    const shipmentDetails = Array.isArray(booking.shipmentDetails)
      ? booking.shipmentDetails
      : [];
    const shipment = shipmentDetails[0] || {};
    const referenceNo = String(shipment.generatedReference || "").trim();
    const blNumber = await billOfLadingService.getNextBlNumber();

    return billOfLadingService.create({
      jobNo: Number(booking.jobNo),
      referenceNo: referenceNo || `REF-BL-${tag}-${pad(i)}`,
      status: ["Draft", "RFS", "SOB"][(i - 1) % 3],
      blNumber,
      consignmentDetails: {
        shipper: String(booking.shipper || `Shipper ${tag}-${pad(i)}`),
        consignee: String(booking.consignee || `Consignee ${tag}-${pad(i)}`),
        notifyParty: `Notify Party ${tag}-${pad(i)}`,
        marksAndNos: `Marks-${tag}-${pad(i)}`,
        descriptionOfGoods: `Description of goods ${tag}-${pad(i)}`,
        deliveryAgent: `Delivery Agent ${tag}-${pad(i)}`,
        placeOfAcceptance: `Place Of Acceptance ${tag}-${pad(i)}`,
        portOfLoading: `Port Of Loading ${tag}-${pad(i)}`,
        placeOfDischarge: `Place Of Discharge ${tag}-${pad(i)}`,
        portOfDelivery: `Port Of Delivery ${tag}-${pad(i)}`,
        consigneeEmail: `consignee.${tag}.${i}@example.com`,
        notifyEmail: `notify.${tag}.${i}@example.com`,
        routePlaceOfTranshipment: `Route ${tag}-${pad(i)}`,
        package: `Package ${i}`,
        measurement: `${10 + i} CBM`,
        freeDaysAgreed: String((i % 14) + 1),
        vesselVoyage: `Vessel/Voyage ${tag}-${pad(i)}`,
        modeMeansOf: "Sea",
        freightPayable: i % 2 === 0 ? "Prepaid" : "Collect",
        freightAmount: 1000 + i,
        place: pick(CITIES, i),
        date: new Date(Date.now() + i * 86400000).toISOString(),
        dateOfIssue: new Date(Date.now() + i * 86400000).toISOString(),
      },
      containerDetails: [
        {
          containerNo: String(shipment.containerNo || `BLCNT-${tag}-${pad(i)}`),
          size: String(shipment.size || "20"),
          type: String(shipment.type || "GP"),
          agentSeal: `AG-SEAL-${tag}-${pad(i)}`,
          customSeal: `CU-SEAL-${tag}-${pad(i)}`,
          piece: i,
          countPackage: `${i} PKG`,
          commodity: ["General", "Hazardous", "ODC"][(i - 1) % 3],
          netWeight: Number(shipment.netWeight || 1000),
          grossWeight: Number(shipment.grossWeight || 1200),
          shippingBill: `SB-${tag}-${pad(i)}`,
          cbm: Number(shipment.volume || 10),
          hbl: String(shipment.hbl || `HBL-${tag}-${pad(i)}`),
        },
      ],
    });
  });

  console.log("Seeding completed for all master modules.");
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("Seeding failed:", error);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    console.error("Disconnect failed:", disconnectError);
  }
  process.exit(1);
});
