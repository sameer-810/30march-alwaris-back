import { toNumber, toString } from "../common/shared-crud/dtoMappers.js";

function toBillOfLadingDto(record) {
  if (!record) return null;

  const consignmentDetailsSource = record.consignmentDetails || {};

  return {
    id: String(record._id),
    hblNo: toString(record.hblNo),
    jobNo: toString(record.jobNo),
    referenceNo: toString(record.referenceNo),
    status: toString(record.status),
    blNumber: toString(record.blNumber),
    consignmentDetails: {
      shipper: toString(consignmentDetailsSource?.shipper),
      consignee: toString(consignmentDetailsSource?.consignee),
      notifyParty: toString(consignmentDetailsSource?.notifyParty),
      marksAndNos: toString(consignmentDetailsSource?.marksAndNos),
      descriptionOfGoods: toString(
        consignmentDetailsSource?.descriptionOfGoods,
      ),
      deliveryAgent: toString(consignmentDetailsSource?.deliveryAgent),
      placeOfAcceptance: toString(consignmentDetailsSource?.placeOfAcceptance),
      portOfLoading: toString(consignmentDetailsSource?.portOfLoading),
      placeOfDischarge: toString(consignmentDetailsSource?.placeOfDischarge),
      portOfDelivery: toString(consignmentDetailsSource?.portOfDelivery),
      consigneeEmail: toString(consignmentDetailsSource?.consigneeEmail),
      notifyEmail: toString(consignmentDetailsSource?.notifyEmail),
      routePlaceOfTranshipment: toString(
        consignmentDetailsSource?.routePlaceOfTranshipment,
      ),
      package: toString(consignmentDetailsSource?.package),
      measurement: toString(consignmentDetailsSource?.measurement),
      freeDaysAgreed: toString(consignmentDetailsSource?.freeDaysAgreed),
      vesselVoyage: toString(consignmentDetailsSource?.vesselVoyage),
      modeMeansOf: toString(consignmentDetailsSource?.modeMeansOf),
      freightPayable: toString(consignmentDetailsSource?.freightPayable),
      freightAmount: toNumber(consignmentDetailsSource?.freightAmount, 0),
      place: toString(consignmentDetailsSource?.place),
      date: consignmentDetailsSource?.date || "",
      dateOfIssue: consignmentDetailsSource?.dateOfIssue || "",
    },
    containerDetails: Array.isArray(record.containerDetails)
      ? record.containerDetails.map((item) => ({
          containerNo: toString(item?.containerNo),
          size: toString(item?.size || "20"),
          type: toString(item?.type || "GP"),
          agentSeal: toString(item?.agentSeal),
          customSeal: toString(item?.customSeal),
          piece: toNumber(item?.piece, 0),
          countPackage: toString(item?.countPackage),
          commodity: toString(item?.commodity || "General"),
          netWeight: toNumber(item?.netWeight, 0),
          grossWeight: toNumber(item?.grossWeight, 0),
          shippingBill: toString(item?.shippingBill),
          cbm: toNumber(item?.cbm, 0),
          hbl: toString(item?.hbl),
        }))
      : [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export { toBillOfLadingDto };
