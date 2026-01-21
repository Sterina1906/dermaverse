import { skinDiseases } from '../data/diseases';

interface EducationalTabsProps {
  selectedDisease: string;
  onDiseaseSelect: (disease: string) => void;
}

export default function EducationalTabs({ selectedDisease, onDiseaseSelect }: EducationalTabsProps) {
  const diseases = Object.entries(skinDiseases);
  const activeTab = selectedDisease || 'melanoma';

  const handleTabClick = (diseaseKey: string) => {
    onDiseaseSelect(diseaseKey);
  };

  const currentDisease = skinDiseases[activeTab as keyof typeof skinDiseases];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white-900 mb-6 text-center">
        Learn About Skin Conditions
      </h2>
      
      <div className="border-b border-white-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {diseases.map(([key, disease]) => (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-white-500 hover:text-pink-400 hover:border-gray-300'
              }`}
            >
              {disease.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {currentDisease.name}
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900">Description:</h4>
              <p>{currentDisease.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Common Causes:</h4>
              <p>{currentDisease.causes}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${
              currentDisease.severity === 'critical' 
                ? 'bg-red-50 border-l-4 border-red-500' 
                : currentDisease.severity === 'high'
                ? 'bg-yellow-50 border-l-4 border-yellow-500'
                : 'bg-green-50 border-l-4 border-green-500'
            }`}>
              <h4 className="font-medium text-gray-900">Recommended Action:</h4>
              <p className={`${
                currentDisease.severity === 'critical' 
                  ? 'text-red-700' 
                  : currentDisease.severity === 'high'
                  ? 'text-yellow-700'
                  : 'text-green-700'
              } font-medium`}>
                {currentDisease.action}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}