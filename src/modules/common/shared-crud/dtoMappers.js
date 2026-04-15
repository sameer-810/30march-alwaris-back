const toString = (v) => (v == null ? "" : String(v));

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const DEFAULT_LABEL_KEYS = ["name", "label", "title"];

const toRef = (v, keys = []) => {
  if (!v) return { id: "", label: "" };

  const id =
    typeof v === "string" || typeof v === "number"
      ? String(v)
      : String(v._id || v.id || "");

  let label = "";

  if (typeof v === "object") {
    const allKeys = keys?.length
      ? keys.concat(DEFAULT_LABEL_KEYS)
      : DEFAULT_LABEL_KEYS;
    for (const k of allKeys) {
      const value = v[k];
      if (value != null && value !== "") {
        label = String(value);
        break;
      }
    }
  }

  return { id, label };
};

export { toNumber, toRef, toString };
