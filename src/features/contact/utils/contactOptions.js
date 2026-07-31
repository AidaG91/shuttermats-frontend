export const CONTACT_SUBJECT_OPTIONS = [
  { value: "", label: "Selecciona un asunto" },
  { value: "COVERAGE_INQUIRY", label: "Consulta de cobertura" },
  { value: "BILLING", label: "Facturación" },
  { value: "PRESS_COLLABORATION", label: "Prensa / colaboración" },
  { value: "OTHER", label: "Otro" },
];

export const CONTACT_SUBJECT_LABELS = CONTACT_SUBJECT_OPTIONS.reduce(
  (labels, option) => ({ ...labels, [option.value]: option.label }),
  {},
);
