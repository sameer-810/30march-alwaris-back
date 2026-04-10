function toBookingDto(booking) {
  if (!booking) return null;

  const getRefId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return String(value._id || "");
    return String(value);
  };

  const getRefLabel = (value) => {
    if (!value) return "";
    if (typeof value === "string") return "";
    if (typeof value === "object") {
      if (value.vendorName) return value.vendorName;
      if (value.customerName) return value.customerName;
      if (value.employeeName) return value.employeeName;
      if (value.portName) return value.portName;
      if (value.terms) return value.terms;
      if (value.lineOfBix) return value.lineOfBix;
      if (value.vesselName) return value.vesselName;
      if (value.description) return value.description;
      return "";
    }
    return "";
  };

  const incomeDetails = Array.isArray(booking.incomeDetails)
    ? booking.incomeDetails.map((item) => ({
        incomeBillingParty: getRefId(item?.incomeBillingParty),
        incomeBillingPartyName: getRefLabel(item?.incomeBillingParty),
        chargeDescription: getRefId(item?.chargeDescription),
        chargeDescriptionName: getRefLabel(item?.chargeDescription),
        chargedPer: item?.chargedPer || "DOCS",
        qty: item?.qty ?? 1,
        rate: item?.rate ?? 0,
        currency: item?.currency || "USD",
        size: item?.size || "20",
        type: item?.type || "GP",
        amount: item?.amount ?? 0,
        exRate: item?.exRate ?? 1,
        remarks: item?.remarks || "",
      }))
    : [];

  const expenseDetails = Array.isArray(booking.expenseDetails)
    ? booking.expenseDetails.map((item) => ({
        vendorName: getRefId(item?.vendorName),
        vendorNameName: getRefLabel(item?.vendorName),
        chargeDescription: getRefId(item?.chargeDescription),
        chargeDescriptionName: getRefLabel(item?.chargeDescription),
        chargedPer: item?.chargedPer || "DOCS",
        qty: item?.qty ?? 1,
        rate: item?.rate ?? 0,
        currency: item?.currency || "USD",
        size: item?.size || "20",
        type: item?.type || "GP",
        amount: item?.amount ?? 0,
        exRate: item?.exRate ?? 1,
        invoiceNo: item?.invoiceNo || "",
        date: item?.date || "",
        remarks: item?.remarks || "",
      }))
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

  return {
    id: booking._id,
    jobNo: booking.jobNo,
    jobDate: booking.jobDate,
    rateAgreedBy: getRefId(booking.rateAgreedBy),
    rateAgreedByName: getRefLabel(booking.rateAgreedBy),
    bookingParty: getRefId(booking.bookingParty),
    bookingPartyName: getRefLabel(booking.bookingParty),
    kindAttention: getRefId(booking.kindAttention),
    kindAttentionName: getRefLabel(booking.kindAttention),
    shipper: booking.shipper,
    consignee: booking.consignee,
    modeOfTransport: booking.modeOfTransport,
    exportImport: booking.exportImport,
    portOfLoading: getRefId(booking.portOfLoading),
    portOfLoadingName: getRefLabel(booking.portOfLoading),
    portOfDestination: getRefId(booking.portOfDestination),
    portOfDestinationName: getRefLabel(booking.portOfDestination),
    line: booking.line,
    status: booking.status,
    terms: getRefId(booking.terms),
    termsName: getRefLabel(booking.terms),
    lineOfBix: getRefId(booking.lineOfBix),
    lineOfBixName: getRefLabel(booking.lineOfBix),
    mbl: booking.mbl,
    orderReference: booking.orderReference,
    defaultCurrency: booking.defaultCurrency,
    billingParty: getRefId(booking.billingParty),
    billingPartyName: getRefLabel(booking.billingParty),
    shipmentDetails: Array.isArray(booking.shipmentDetails)
      ? booking.shipmentDetails.map((item) => ({
          generatedReference: item?.generatedReference || "",
          containerNo: item?.containerNo || "",
          qty: item?.qty ?? 1,
          size: item?.size || "20",
          type: item?.type || "GP",
          commodity: item?.commodity || "",
          netWeight: item?.netWeight ?? 0,
          grossWeight: item?.grossWeight ?? 0,
          volume: item?.volume ?? 0,
          vessel: getRefId(item?.vessel),
          vesselName: getRefLabel(item?.vessel),
          voyage: item?.voyage || "",
          etd: item?.etd || "",
          eta: item?.eta || "",
          hbl: item?.hbl || "",
          remarks: item?.remarks || "",
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

module.exports = { toBookingDto };
