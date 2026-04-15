import { toNumber, toRef, toString } from "../common/shared-crud/dtoMappers.js";

function toBookingDto(booking) {
  if (!booking) return null;

  const incomeDetails = Array.isArray(booking.incomeDetails)
    ? booking.incomeDetails.map((item) => {
        const incomeBillingPartyRef = toRef(item?.incomeBillingParty, [
          "customerName",
          "vendorName",
          "employeeName",
        ]);
        const chargeDescriptionRef = toRef(item?.chargeDescription, [
          "description",
        ]);

        return {
          incomeBillingPartyId: incomeBillingPartyRef.id,
          incomeBillingPartyName: incomeBillingPartyRef.label,
          chargeDescriptionId: chargeDescriptionRef.id,
          chargeDescriptionName: chargeDescriptionRef.label,
          chargedPer: item?.chargedPer || "DOCS",
          qty: item?.qty ?? 1,
          rate: item?.rate ?? 0,
          currency: item?.currency || "USD",
          size: item?.size || "20",
          type: item?.type || "GP",
          amount: item?.amount ?? 0,
          exRate: item?.exRate ?? 1,
          remarks: toString(item?.remarks),
        };
      })
    : [];

  const expenseDetails = Array.isArray(booking.expenseDetails)
    ? booking.expenseDetails.map((item) => {
        const vendorRef = toRef(item?.vendor, ["vendorName"]);
        const chargeDescriptionRef = toRef(item?.chargeDescription, [
          "description",
        ]);

        return {
          vendorId: vendorRef.id,
          vendorName: vendorRef.label,
          chargeDescriptionId: chargeDescriptionRef.id,
          chargeDescriptionName: chargeDescriptionRef.label,
          chargedPer: item?.chargedPer || "DOCS",
          qty: item?.qty ?? 1,
          rate: item?.rate ?? 0,
          currency: item?.currency || "USD",
          size: item?.size || "20",
          type: item?.type || "GP",
          amount: item?.amount ?? 0,
          exRate: item?.exRate ?? 1,
          invoiceNo: toString(item?.invoiceNo),
          date: item?.date || "",
          remarks: toString(item?.remarks),
        };
      })
    : [];

  const computedIncomeTotalInAed = Number(
    incomeDetails
      .reduce((sum, row) => sum + Number(row.amount || 0), 0)
      .toFixed(2),
  );
  const computedExpenseTotalInAed = Number(
    expenseDetails
      .reduce((sum, row) => sum + Number(row.amount || 0), 0)
      .toFixed(2),
  );

  const incomeTotalInAed =
    typeof booking.incomeTotalInAed === "number"
      ? booking.incomeTotalInAed
      : computedIncomeTotalInAed;
  const expenseTotalInAed =
    typeof booking.expenseTotalInAed === "number"
      ? booking.expenseTotalInAed
      : computedExpenseTotalInAed;
  const netAmountInAed =
    typeof booking.netAmountInAed === "number"
      ? booking.netAmountInAed
      : Number((incomeTotalInAed - expenseTotalInAed).toFixed(2));

  const rateAgreedByRef = toRef(booking.rateAgreedBy, ["employeeName"]);
  const bookingPartyRef = toRef(booking.bookingParty, ["customerName"]);
  const kindAttentionRef = toRef(booking.kindAttention, ["employeeName"]);
  const portOfLoadingRef = toRef(booking.portOfLoading, ["portName"]);
  const portOfDestinationRef = toRef(booking.portOfDestination, ["portName"]);
  const termsRef = toRef(booking.terms, ["terms"]);
  const lineOfBixRef = toRef(booking.lineOfBix, ["lineOfBix"]);
  const billingPartyRef = toRef(booking.billingParty, [
    "customerName",
    "vendorName",
    "employeeName",
  ]);

  return {
    id: String(booking._id),
    jobNo: booking.jobNo,
    jobDate: booking.jobDate,
    rateAgreedBy: rateAgreedByRef.id,
    rateAgreedByName: rateAgreedByRef.label,
    bookingParty: bookingPartyRef.id,
    bookingPartyName: bookingPartyRef.label,
    kindAttention: kindAttentionRef.id,
    kindAttentionName: kindAttentionRef.label,
    shipper: booking.shipper,
    consignee: booking.consignee,
    modeOfTransport: booking.modeOfTransport,
    exportImport: booking.exportImport,
    portOfLoading: portOfLoadingRef.id,
    portOfLoadingName: portOfLoadingRef.label,
    portOfDestination: portOfDestinationRef.id,
    portOfDestinationName: portOfDestinationRef.label,
    line: booking.line,
    status: booking.status,
    terms: termsRef.id,
    termsName: termsRef.label,
    lineOfBix: lineOfBixRef.id,
    lineOfBixName: lineOfBixRef.label,
    mbl: booking.mbl,
    orderReference: booking.orderReference,
    defaultCurrency: booking.defaultCurrency,
    billingParty: billingPartyRef.id,
    billingPartyName: billingPartyRef.label,
    shipmentDetails: Array.isArray(booking.shipmentDetails)
      ? booking.shipmentDetails.map((item) => ({
          generatedReference: toString(item?.generatedReference),
          containerNo: toString(item?.containerNo),
          qty: item?.qty ?? 1,
          size: item?.size || "20",
          type: item?.type || "GP",
          commodity: toString(item?.commodity),
          netWeight: toNumber(item?.netWeight, 0),
          grossWeight: toNumber(item?.grossWeight, 0),
          volume: toNumber(item?.volume, 0),
          vessel: toRef(item?.vessel, ["vesselName"]).id,
          vesselName: toRef(item?.vessel, ["vesselName"]).label,
          voyage: toString(item?.voyage),
          etd: item?.etd || "",
          eta: item?.eta || "",
          hbl: toString(item?.hbl),
          remarks: toString(item?.remarks),
        }))
      : [],
    incomeDetails,
    incomeTotalInAed,
    expenseDetails,
    expenseTotalInAed,
    netAmountInAed,
    isDeleted: booking.isDeleted,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

export { toBookingDto };
