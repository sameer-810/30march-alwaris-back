function toBillOfLadingDto(record) {
  if (!record) return null;

  const consignmentDetailsSource = record.consignmentDetails || {};

  return {
    id: String(record._id),
    hblNo: record.hblNo,
    jobNo: record.jobNo,
    referenceNo: record.referenceNo,
    status: record.status,
    blNumber: record.blNumber,
    consignmentDetails: {
      shipper: consignmentDetailsSource?.shipper || "",
      consignee: consignmentDetailsSource?.consignee || "",
      notifyParty: consignmentDetailsSource?.notifyParty || "",
      marksAndNos: consignmentDetailsSource?.marksAndNos || "",
      descriptionOfGoods: consignmentDetailsSource?.descriptionOfGoods || "",
      deliveryAgent: consignmentDetailsSource?.deliveryAgent || "",
      placeOfAcceptance: consignmentDetailsSource?.placeOfAcceptance || "",
      portOfLoading: consignmentDetailsSource?.portOfLoading || "",
      placeOfDischarge: consignmentDetailsSource?.placeOfDischarge || "",
      portOfDelivery: consignmentDetailsSource?.portOfDelivery || "",
      consigneeEmail: consignmentDetailsSource?.consigneeEmail || "",
      notifyEmail: consignmentDetailsSource?.notifyEmail || "",
      routePlaceOfTranshipment:
        consignmentDetailsSource?.routePlaceOfTranshipment || "",
      package: consignmentDetailsSource?.package || "",
      measurement: consignmentDetailsSource?.measurement || "",
      freeDaysAgreed: consignmentDetailsSource?.freeDaysAgreed || "",
      vesselVoyage: consignmentDetailsSource?.vesselVoyage || "",
      modeMeansOf: consignmentDetailsSource?.modeMeansOf || "",
      freightPayable: consignmentDetailsSource?.freightPayable || "",
      freightAmount: consignmentDetailsSource?.freightAmount ?? 0,
      place: consignmentDetailsSource?.place || "",
      date: consignmentDetailsSource?.date || "",
      dateOfIssue: consignmentDetailsSource?.dateOfIssue || "",
    },
    containerDetails: Array.isArray(record.containerDetails)
      ? record.containerDetails.map((item) => ({
          containerNo: item?.containerNo || "",
          size: item?.size || "20",
          type: item?.type || "GP",
          agentSeal: item?.agentSeal || "",
          customSeal: item?.customSeal || "",
          piece: item?.piece ?? 0,
          countPackage: item?.countPackage || "",
          commodity: item?.commodity || "General",
          netWeight: item?.netWeight ?? 0,
          grossWeight: item?.grossWeight ?? 0,
          shippingBill: item?.shippingBill || "",
          cbm: item?.cbm ?? 0,
          hbl: item?.hbl || "",
        }))
      : [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

module.exports = {
  toBillOfLadingDto,
};
