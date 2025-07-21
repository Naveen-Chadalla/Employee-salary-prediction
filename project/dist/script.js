document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prediction-form');
    const predictButton = document.querySelector('.predict-button');
    const resultSection = document.getElementById('result');
    const errorSection = document.getElementById('error');
    const predictionValue = document.getElementById('prediction-value');
    const errorMessage = document.getElementById('error-message');
    const confidenceSection = document.getElementById('confidence');
    const confidenceFill = document.getElementById('confidence-fill');
    const confidenceValue = document.getElementById('confidence-value');

    // Add animation delays to form groups
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      hideResults();
      predictButton.classList.add('loading');
    
      const formData = new FormData(form);
      const data = {
    age: parseInt(formData.get('age')) || 0,
    workclass: formData.get('workclass') || '',
    education: formData.get('education') || '',
    marital_status: formData.get('marital_status') || '',
    occupation: formData.get('occupation') || '',
    gender: formData.get('gender') || '',
    capital_gain: parseInt(formData.get('capital_gain')) || 0,
    capital_loss: parseInt(formData.get('capital_loss')) || 0,
    hours_per_week: parseInt(formData.get('hours_per_week')) || 0,
    native_country: formData.get('native_country') || '',
  };
    
      try {
        const API_URL = 'https://employee-salary-prediction-production.up.railway.app/predict';
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        const result = await response.json();
    
        if (!response.ok) {
          showError(result.detail || "Prediction failed");
        } else {
          showResult(result);
        }
    
      } catch (error) {
        showError('Network error: Unable to connect to the Railway API. Please check your internet connection and API endpoint.');
      } finally {
        predictButton.classList.remove('loading');
      }
    });


    function hideResults() {
        resultSection.style.display = 'none';
        errorSection.style.display = 'none';
        resultSection.classList.remove('show');
        errorSection.classList.remove('show');
    }

    function showResult(result) {
        // Format the prediction
        let predictionText;
        if (typeof result.prediction === 'string') {
            predictionText = result.prediction === '>50K' ? '> $50,000' : '≤ $50,000';
        } else if (typeof result.prediction === 'number') {
            predictionText = `$${result.prediction.toLocaleString()}`;
        } else {
            predictionText = String(result.prediction);
        }
        
        predictionValue.textContent = predictionText;
        
        // Show confidence if available
        if (result.probability && Array.isArray(result.probability[0])) {
            const confidence = Math.max(...result.probability[0]) * 100;
            confidenceValue.textContent = `${confidence.toFixed(1)}%`;
            
            // Animate confidence bar
            setTimeout(() => {
                confidenceFill.style.width = `${confidence}%`;
            }, 300);
            
            confidenceSection.style.display = 'flex';
        } else {
            confidenceSection.style.display = 'none';
        }
        
        // Show result with animation
        resultSection.style.display = 'block';
        setTimeout(() => {
            resultSection.classList.add('show');
        }, 10);
        
        // Add celebratory effect
        if (predictionText.includes('>') || predictionText.includes('50,000')) {
            celebrateResult();
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
        setTimeout(() => {
            errorSection.classList.add('show');
        }, 10);
    }

    function celebrateResult() {
        // Add a subtle celebration effect
        const card = document.querySelector('.prediction-card');
        card.style.animation = 'pulse 0.6s ease-in-out';
        
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    }

    // Add interactive hover effects to form inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Add floating label effect
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        // Check initial values
        if (input.value) {
            input.classList.add('has-value');
        }
    });

    // Add smooth scrolling to result
    function scrollToResult() {
        if (resultSection.style.display === 'block' || errorSection.style.display === 'block') {
            const target = resultSection.style.display === 'block' ? resultSection : errorSection;
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }

    // Trigger scroll after result is shown
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (mutation.target.style.display === 'block') {
                    setTimeout(scrollToResult, 300);
                }
            }
        });
    });

    observer.observe(resultSection, { attributes: true });
    observer.observe(errorSection, { attributes: true });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            form.dispatchEvent(new Event('submit'));
        }
    });

    // Add form validation animations
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.style.animation = 'shake 0.5s ease-in-out';
            this.style.borderColor = '#ef4444';
            
            setTimeout(() => {
                this.style.animation = '';
                this.style.borderColor = '';
            }, 500);
        });
    });
});

// Add shake animation for validation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);