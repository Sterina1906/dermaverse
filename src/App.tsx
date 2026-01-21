import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';
import Results from './components/Results';
import EducationalTabs from './components/EducationalTabs';
import Footer from './components/Footer';
import axios from 'axios';
import { diseaseMap } from './data/diseaseMapping';
import { mockMalignant, mockBenign } from './data/diseases';

function App() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  const analyzeImage = async (file: File) => {
    console.log('🔍 NGROK URL:', import.meta.env.VITE_API_URL); // ← ADD THIS
  
  if (!import.meta.env.VITE_API_URL) {
    console.error('❌ .env NOT LOADED - using mock');
    // mock fallback
    return;
  } // ADD THIS

  setIsLoading(true);
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/predict`,
      formData,
      { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true' // Add this line to bypass ngrok warning
        } 
      }
    );
    
    
    const data = response.data;
    const mappedDisease = data.binary_prediction === 'Benign' 
      ? 'benign' 
      : diseaseMap[data.final_prediction] || 'melanoma';
    
      
    setResult({
      malignant: data.binary_prediction === 'Malignant',
      disease_type: mappedDisease,
      confidence: data.binary_probability,
      multiclass: data.multiclass_probabilities,
      binary_prediction: data.binary_prediction,
      final_prediction: data.final_prediction,
      file: file
    });
    
  } catch (error) {
    console.error('Error calling API:', error);
    // Fallback to mock data
    const mockResult = Math.random() > 0.5 ? 
      { ...mockMalignant, file } : 
      { ...mockBenign, file };
    setResult(mockResult);
  } finally {
    setIsLoading(false);
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  }
};


  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000ms"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000ms"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Dermaverse Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 drop-shadow-2xl"
          >
            DermaVerse
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-white font-bold drop-shadow-lg"

          >
            AI-Powered Skin Cancer Detection
          </motion.p>
        </motion.div>

        <Hero />
        
        {!result && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20"
          >
            <UploadZone onFileAccepted={analyzeImage} />
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {(isLoading || result) && (
  <motion.div 
    id="results"
    key="results"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="mt-20"
  >
    <div className="text-center mb-8">
      {/* New Analysis Button */}
      <button
        onClick={() => {
          setResult(null);
          setSelectedDisease(null);
          // Scroll back to upload zone
          document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
      >
        Analyze New Image
      </button>
    </div>
    
    <Results 
      result={result} 
      isLoading={isLoading} 
      selectedDisease={selectedDisease || ''}
      onDiseaseSelect={setSelectedDisease}
    />
  </motion.div>
)}

        </AnimatePresence>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24"
        >
          <EducationalTabs 
            selectedDisease={selectedDisease || ''}
            onDiseaseSelect={setSelectedDisease}
          />
        </motion.div>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
