const mongoose = require("mongoose");

const EmployeeCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false },
);

const EmployeeCounterModel = mongoose.model(
  "EmployeeCounter",
  EmployeeCounterSchema,
);

module.exports = { EmployeeCounterModel };
