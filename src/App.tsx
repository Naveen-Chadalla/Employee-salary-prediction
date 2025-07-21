import React, { useState, useEffect } from 'react';
import { DollarSign, User, GraduationCap, Briefcase, Heart, Users, TrendingUp, Clock, Globe } from 'lucide-react';

interface PredictionResult {
  prediction: string | number;
  probability?: number[][];
}

function App() {
  const [formData, setFormData] = useState({
    age: 30,
    workclass: 'Private',
    education: 'Bachelors',
    marital_status: 'Married-civ-spouse',
    occupation: 'Tech-support',
    gender: 'Male',
    capital_gain: 0,
    capital_loss: 0,
    hours_per_week: 40,
    native_country: 'United-States'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'capital_gain' || name === 'capital_loss' || name === 'hours_per_week' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const API_URL = 'https://employee-salary-prediction-production.up.railway.app/predict';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Prediction failed");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error: Unable to connect to the Railway API. Please check your internet connection and API endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrediction = (prediction: string | number) => {
    if (typeof prediction === 'string') {
      return prediction === '>50K' ? '> $50,000' : '≤ $50,000';
    } else if (typeof prediction === 'number') {
      return `$${prediction.toLocaleString()}`;
    }
    return String(prediction);
  };

  const getConfidence = () => {
    if (result?.probability && Array.isArray(result.probability[0])) {
      return Math.max(...result.probability[0]) * 100;
    }
    return null;
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-4 mb-4">
            <DollarSign className="w-12 h-12 text-white animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              AI Salary Predictor
            </h1>
          </div>
          <p className="text-white/90 text-lg md:text-xl font-light">
            Predict employee salary using advanced machine learning
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex justify-center items-start">
          <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div className="form-group animate-slide-in-left">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    AGE
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="16"
                    max="90"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  />
                </div>

                {/* Work Class */}
                <div className="form-group animate-slide-in-right">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4" />
                    WORK CLASS
                  </label>
                  <select
                    name="workclass"
                    value={formData.workclass}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  >
                    <option value="Private">Private</option>
                    <option value="Self-emp-not-inc">Self-employed (not incorporated)</option>
                    <option value="Self-emp-inc">Self-employed (incorporated)</option>
                    <option value="Federal-gov">Federal Government</option>
                    <option value="Local-gov">Local Government</option>
                    <option value="State-gov">State Government</option>
                    <option value="Without-pay">Without Pay</option>
                    <option value="Never-worked">Never Worked</option>
                  </select>
                </div>

                {/* Education */}
                <div className="form-group animate-slide-in-left">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    EDUCATION
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  >
                    <option value="Bachelors">Bachelors</option>
                    <option value="Some-college">Some College</option>
                    <option value="11th">11th Grade</option>
                    <option value="HS-grad">High School Graduate</option>
                    <option value="Prof-school">Professional School</option>
                    <option value="Assoc-acdm">Associates (Academic)</option>
                    <option value="Assoc-voc">Associates (Vocational)</option>
                    <option value="9th">9th Grade</option>
                    <option value="7th-8th">7th-8th Grade</option>
                    <option value="12th">12th Grade</option>
                    <option value="Masters">Masters</option>
                    <option value="1st-4th">1st-4th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="5th-6th">5th-6th Grade</option>
                    <option value="Preschool">Preschool</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div className="form-group animate-slide-in-right">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Heart className="w-4 h-4" />
                    MARITAL STATUS
                  </label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  >
                    <option value="Married-civ-spouse">Married (Civilian Spouse)</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Never-married">Never Married</option>
                    <option value="Separated">Separated</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Married-spouse-absent">Married (Spouse Absent)</option>
                    <option value="Married-AF-spouse">Married (Armed Forces Spouse)</option>
                  </select>
                </div>

                {/* Occupation */}
                <div className="form-group animate-slide-in-left">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4" />
                    OCCUPATION
                  </label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  >
                    <option value="Tech-support">Tech Support</option>
                    <option value="Craft-repair">Craft & Repair</option>
                    <option value="Other-service">Other Service</option>
                    <option value="Sales">Sales</option>
                    <option value="Exec-managerial">Executive/Managerial</option>
                    <option value="Prof-specialty">Professional Specialty</option>
                    <option value="Handlers-cleaners">Handlers & Cleaners</option>
                    <option value="Machine-op-inspct">Machine Operator/Inspector</option>
                    <option value="Adm-clerical">Administrative/Clerical</option>
                    <option value="Farming-fishing">Farming & Fishing</option>
                    <option value="Transport-moving">Transport & Moving</option>
                    <option value="Priv-house-serv">Private House Service</option>
                    <option value="Protective-serv">Protective Service</option>
                    <option value="Armed-Forces">Armed Forces</option>
                  </select>
                </div>

                {/* Gender */}
                <div className="form-group animate-slide-in-right">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    GENDER
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Capital Gain */}
                <div className="form-group animate-slide-in-left">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    CAPITAL GAIN
                  </label>
                  <input
                    type="number"
                    name="capital_gain"
                    value={formData.capital_gain}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  />
                </div>

                {/* Capital Loss */}
                <div className="form-group animate-slide-in-right">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 rotate-180" />
                    CAPITAL LOSS
                  </label>
                  <input
                    type="number"
                    name="capital_loss"
                    value={formData.capital_loss}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  />
                </div>

                {/* Hours per Week */}
                <div className="form-group animate-slide-in-left">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4" />
                    HOURS PER WEEK
                  </label>
                  <input
                    type="number"
                    name="hours_per_week"
                    value={formData.hours_per_week}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  />
                </div>

                {/* Native Country */}
                <div className="form-group animate-slide-in-right">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="w-4 h-4" />
                    NATIVE COUNTRY
                  </label>
                  <select
                    name="native_country"
                    value={formData.native_country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:scale-105"
                  >
                    <option value="United-States">United States</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="England">England</option>
                    <option value="Puerto-Rico">Puerto Rico</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                    <option value="Greece">Greece</option>
                    <option value="China">China</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Iran">Iran</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Italy">Italy</option>
                    <option value="Poland">Poland</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Ireland">Ireland</option>
                    <option value="France">France</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Thailand">Thailand</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>PREDICTING...</span>
                  </div>
                ) : (
                  'PREDICT SALARY'
                )}
              </button>
            </form>

            {/* Results */}
            {result && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl animate-fade-in-up">
                <h3 className="text-xl font-semibold mb-4 text-center">Prediction Result</h3>
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm opacity-90">Predicted Salary Range:</p>
                    <p className="text-3xl font-bold">{formatPrediction(result.prediction)}</p>
                  </div>
                  {getConfidence() && (
                    <div>
                      <p className="text-sm opacity-90 mb-2">Confidence:</p>
                      <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                        <div 
                          className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${getConfidence()}%` }}
                        ></div>
                      </div>
                      <p className="text-lg font-semibold">{getConfidence()?.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-8 p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl animate-fade-in-up">
                <h3 className="text-xl font-semibold mb-2 text-center">⚠️ Error</h3>
                <p className="text-center">{error}</p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-white/80 text-sm">
          <p>&copy; 2025 AI Salary Predictor. Powered by Machine Learning.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;