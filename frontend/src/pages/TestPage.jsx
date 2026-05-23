import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [sentences, setSentences] = useState([]);
  const [originalSentences, setOriginalSentences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${baseUrl}/submissions/sentences`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSentences(res.data.map(s => ({ ...s })));
        setOriginalSentences(res.data.map(s => ({ ...s })));
      } catch (err) {
        console.error(err);
        alert('Failed to load test sentences. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchSentences();
  }, []);

  const handleChange = (id, value) => {
    setSentences(prev => prev.map(s => s.id === id ? { ...s, text: value } : s));
  };

  const handleEditClick = () => {
    // Switch from view mode → edit mode
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        answers: sentences.map(s => ({
          sentenceId: s.id,
          original: originalSentences.find(o => o.id === s.id).text,
          userAnswer: s.text
        }))
      };

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${baseUrl}/submissions`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('testResult', JSON.stringify(res.data));
      navigate('/result');
    } catch (err) {
      console.error(err);
      alert('Failed to submit. Make sure the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="test-page-container">
        <div className="card test-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
          <div>Loading sentences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page-container">
      <div className="card test-card">
        <div className="header-title">Test 1</div>

        <div className="sentences-list">
          {sentences.map((s) => (
            <div key={s.id} className="sentence-item-line">
              {isEditing ? (
                <input
                  type="text"
                  value={s.text}
                  onChange={(e) => handleChange(s.id, e.target.value)}
                  className="editable-line"
                />
              ) : (
                <div className="static-line">{s.text}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          {!isEditing ? (
            <button className="btn" onClick={handleEditClick}>Edit</button>
          ) : (
            <button className="btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
