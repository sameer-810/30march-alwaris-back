const mongoose = require("mongoose");
const { env } = require("../src/config/env");

const {
  customerTypeService,
} = require("../src/modules/masters/customer-type/customer-type.service");
const {
  customerService,
} = require("../src/modules/masters/customer/customer.service");
const {
  employeeService,
} = require("../src/modules/masters/employee/employee.service");
const {
  lineOfBixService,
} = require("../src/modules/masters/line-of-bix/line-of-bix.service");
const { portService } = require("../src/modules/masters/port/port.service");
const {
  serviceService,
} = require("../src/modules/masters/service/service.service");
const {
  shipmentService,
} = require("../src/modules/masters/shipment/shipment.service");
const {
  tariffDescriptionService,
} = require("../src/modules/masters/tariff-description/tariff-description.service");
const { termsService } = require("../src/modules/masters/terms/terms.service");
const {
  termsConditionService,
} = require("../src/modules/masters/terms-condition/terms-condition.service");
const {
  vesselService,
} = require("../src/modules/masters/vessel/vessel.service");

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
  const count = Number(process.env.SEED_COUNT || 50);
  const tag = String(Date.now()).slice(-8);

  if (!Number.isFinite(count) || count <= 0) {
    throw new Error("SEED_COUNT must be a positive number");
  }

  console.log(`Connecting to DB: seeding ${count} rows per module...`);
  await mongoose.connect(env.MONGODB_URI);

  const customerTypes = await createMany("customer-type", count, async (i) => {
    return customerTypeService.createCustomerType({
      customerType: `Customer Type ${tag}-${pad(i)}`,
    });
  });

  const lineOfBixRows = await createMany("line-of-bix", count, async (i) => {
    return lineOfBixService.createLineOfBix({
      code: `LOB${tag}${pad(i)}`,
      lineOfBix: `Line Of Bix ${tag}-${pad(i)}`,
    });
  });

  await createMany("port", count, async (i) => {
    return portService.createPort({
      portCode: `PRT${tag}${pad(i)}`,
      portName: `Port ${tag}-${pad(i)}`,
    });
  });

  await createMany("service", count, async (i) => {
    return serviceService.createService({
      serviceType: `Service Type ${tag}-${pad(i)}`,
    });
  });

  await createMany("shipment", count, async (i) => {
    return shipmentService.createShipment({
      shipmentType: `Shipment Type ${tag}-${pad(i)}`,
    });
  });

  await createMany("tariff-description", count, async (i) => {
    return tariffDescriptionService.createTariffDescription({
      description: `Tariff Description ${tag}-${pad(i)}`,
    });
  });

  await createMany("terms", count, async (i) => {
    return termsService.createTerms({
      terms: `Terms ${tag}-${pad(i)}`,
      description: `Terms description ${tag}-${pad(i)}`,
    });
  });

  await createMany("vessel", count, async (i) => {
    return vesselService.createVessel({
      vesselName: `Vessel ${tag}-${pad(i)}`,
    });
  });

  await createMany("employee", count, async (i) => {
    const city = pick(CITIES, i);
    const state = pick(STATES, i);
    return employeeService.createEmployee({
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
    return termsConditionService.createTermsCondition({
      lineOfBixId: String(line._id || line.id),
      description: `Terms Condition ${tag}-${pad(i)} mapped to ${line.code}`,
    });
  });

  await createMany("customer", count, async (i) => {
    if (customerTypes.length === 0) {
      throw new Error("No customer-type records available");
    }

    const type = customerTypes[(i - 1) % customerTypes.length];
    return customerService.createCustomer({
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
