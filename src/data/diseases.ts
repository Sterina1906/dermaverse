// data/diseases.ts (FINAL)

export interface SkinDisease {
  name: string;
  severity: "critical" | "high" | "low";
  description: string;
  causes: string;
  action: string;
}

export const skinDiseases: Record<string, SkinDisease> = {
  melanoma: {
    name: "Melanoma",
    severity: "critical",
    description:
      "Most dangerous form of skin cancer that develops in melanocytes. Can spread to other organs if not treated early.",
    causes: "UV exposure, genetic factors, and numerous moles increase risk.",
    action: "SEE DOCTOR IMMEDIATELY for biopsy and treatment planning.",
  },
  basal_cell: {
    name: "Basal Cell Carcinoma",
    severity: "high",
    description:
      "Most common and least dangerous form of skin cancer. Grows slowly and rarely spreads.",
    causes:
      "Long-term sun exposure, fair skin, and age are primary risk factors.",
    action:
      "Surgical removal is typically recommended. Schedule a dermatology appointment.",
  },
  squamous_cell: {
    name: "Squamous Cell Carcinoma",
    severity: "high",
    description:
      "A type of skin cancer that can grow deep into the skin and spread to other parts of the body.",
    causes: "Cumulative UV exposure, fair skin, and weakened immune system.",
    action:
      "Biopsy needed. Early treatment is crucial to prevent spreading.",
  },
  benign: {
    name: "Benign",
    severity: "low",
    description:
      "Non-cancerous skin lesion. No immediate medical treatment required.",
    causes: "Natural skin variations, sun exposure, or minor skin damage.",
    action:
      "Self-monitor monthly for any changes in size, shape, or color.",
  },
};

// ONE SINGLE PredictionResult interface used everywhere
export interface PredictionResult {
  malignant: boolean;
  // always optional here; frontend can set it after mapping
  disease_type?: keyof typeof skinDiseases | "benign";
  confidence: number;

  // optional extra data from backend
  multiclass?: {
    MEL: number;
    BCC: number;
    AKIEC: number;
    [key: string]: number;
  };
  binary_prediction?: string;
  final_prediction?: string;

  // frontend only
  description?: string;
  file?: File;
}

// Mock API responses (for dev / fallback)
export const mockMalignant: PredictionResult = {
  malignant: true,
  disease_type: "melanoma",
  confidence: 0.92,
};

export const mockBenign: PredictionResult = {
  malignant: false,
  disease_type: "benign",
  confidence: 0.88,
};
