import { motion } from 'framer-motion';
import { skinDiseases } from '../data/diseases';

interface MulticlassProbabilities {
  MEL: number;
  BCC: number;
  AKIEC: number;
  [key: string]: number;
}

interface ResultType {
  malignant: boolean;
  disease_type?: string;
  confidence: number;
  file?: File;
  multiclass?: MulticlassProbabilities;
  binary_prediction?: string;
  final_prediction?: string;
}

interface ResultsProps {
  result: ResultType | null;
  isLoading: boolean;
  selectedDisease: string;
  onDiseaseSelect: (disease: string) => void;
}

export default function Results({ result, isLoading, selectedDisease, onDiseaseSelect }: ResultsProps) {
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-48 h-48 bg-gray-200 rounded-lg animate-pulse mb-6 md:mb-0 md:mr-8"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const disease = result.malignant 
    ? skinDiseases[result.disease_type as keyof typeof skinDiseases] || skinDiseases.melanoma
    : skinDiseases.benign;

  const isMalignant = result.malignant;
  const confidence = (result.confidence * 100).toFixed(0);

  // Multiclass probabilities display
  const renderMulticlassPills = () => {
    if (!result.multiclass) return null;

    return (
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Condition Probabilities:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(result.multiclass).map(([key, value]) => (
            <div 
              key={key} 
              className="px-3 py-1.5 bg-white border rounded-full text-black flex items-center gap-2 shadow-sm"
            >
              <span className="font-medium">
                {key === 'MEL' ? 'Melanoma' : 
                 key === 'BCC' ? 'Basal Cell' : 
                 key === 'AKIEC' ? 'Actinic Keratosis' : key}
              </span>
              <span className="text-gray-600 font-mono text-xs">{(value * 100).toFixed(0)}%</span>
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: 
                    key === 'MEL' ? '#DC2626' : 
                    key === 'BCC' ? '#F59E0B' : 
                    '#F97316'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className={`rounded-xl overflow-hidden shadow-xl border ${
        isMalignant ? 'bg-gradient-to-r from-red-500 to-red-400 border-red-200' : 'bg-green-300  border-green-200'
      }`}>
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Image + Binary Prediction */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-64 h-64 rounded-2xl overflow-hidden bg-white p-3 shadow-lg border border-gray-100">
                {result.file && (
                  <img
                    src={URL.createObjectURL(result.file)}
                    alt="Uploaded skin lesion"
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>
              
              {/* Binary Prediction Badge */}
              {result.binary_prediction && (
                <div className="mt-6 text-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold shadow-lg ${
                    result.malignant 
                      ? 'bg-white text-red-600' 
                      : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                  }`}>
                    {isMalignant ? '🚨 ' : '✅ '}
                    {result.binary_prediction} ({confidence}%)
                  </div>
                </div>
              )}
            </div>
            
            {/* Right side - Diagnosis + Details */}
            <div className="flex-1 space-y-6">
              {/* Diagnosis Header */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                  {disease.name.toUpperCase()}
                </h2>
                
                {result.final_prediction && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      {result.final_prediction === 'MEL' ? 'Melanoma' : 
                       result.final_prediction === 'BCC' ? 'Basal Cell Carcinoma' : 
                       result.final_prediction === 'AKIEC' ? 'Actinic Keratosis' : 
                       result.final_prediction}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                {disease.description}
              </p>
              
              {/* Recommended Action */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-semibold text-xl text-gray-900 mb-3">Recommended Action</h4>
                <p className={`text-lg font-medium ${
                  disease.severity === 'critical' ? 'text-red-700' : 
                  disease.severity === 'high' ? 'text-orange-700' : 
                  'text-emerald-700'
                }`}>
                  {disease.action}
                </p>
              </div>
              
              {/* Multiclass Probabilities */}
              {renderMulticlassPills()}
              
              {/* Critical Warning for Malignant */}
              {isMalignant && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-2xl shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-xl">⚠️</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-xl text-red-900 mb-2">URGENT MEDICAL ATTENTION REQUIRED</h5>
                      <p className="text-red-800 leading-relaxed">
                        This result indicates a potentially serious condition. Please consult a dermatologist immediately for biopsy and treatment planning.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
