'use client'

// Simple logistic regression model
class LogisticRegression {
  constructor() {
    // Initialize model coefficients (these would normally be learned from data)
    this.coefficients = {
      intercept: -5.5,
      income: 0.00005,
      creditScore: 0.01,
      loanAmount: -0.00002,
      loanTerm: 0.1
    };
  }

  sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }

  predict(features) {
    const z = this.coefficients.intercept +
              this.coefficients.income * features.income +
              this.coefficients.creditScore * features.creditScore +
              this.coefficients.loanAmount * features.loanAmount +
              this.coefficients.loanTerm * features.loanTerm;
    
    return this.sigmoid(z);
  }
}

function LoanEligibilityForm() {
  const [formData, setFormData] = React.useState({
    income: '',
    creditScore: '',
    loanAmount: '',
    loanTerm: ''
  });
  const [result, setResult] = React.useState(null);
  const model = React.useMemo(() => new LogisticRegression(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const features = {
      income: parseFloat(formData.income),
      creditScore: parseFloat(formData.creditScore),
      loanAmount: parseFloat(formData.loanAmount),
      loanTerm: parseFloat(formData.loanTerm)
    };

    const probability = model.predict(features);
    const eligible = probability > 0.5;

    setResult({
      eligible: eligible,
      probability: probability
    });
  };

  return (
    <div className="container">
      <h1>Loan Eligibility Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="income">Annual Income ($):</label>
          <input
            type="number"
            id="income"
            name="income"
            value={formData.income}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="creditScore">Credit Score:</label>
          <input
            type="number"
            id="creditScore"
            name="creditScore"
            value={formData.creditScore}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount ($):</label>
          <input
            type="number"
            id="loanAmount"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="loanTerm">Loan Term (months):</label>
          <input
            type="number"
            id="loanTerm"
            name="loanTerm"
            value={formData.loanTerm}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Predict Eligibility</button>
      </form>
      {result && (
        <div className="result">
          <h2>Prediction Result</h2>
          <p className={result.eligible ? 'eligible' : 'not-eligible'}>
            {result.eligible ? 'You are eligible for the loan!' : 'You are not eligible for the loan.'}
          </p>
          <p>Probability of approval: {(result.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<LoanEligibilityForm />, document.getElementById('root'));