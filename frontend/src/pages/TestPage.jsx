import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ORIGINAL_SENTENCES = [
  { id: 1, text: "She don't know where is the keys to the house, and yesterday she have left it on a table near to the door." },
  { id: 2, text: "The team have worked very hard on there project, but the manager didn't gave them no feedback since two week." },
  { id: 3, text: "He goed to the market yesterday and buyed some apple and potato, but forget to brought his wallet with him." }
];

const TestPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [sentences, setSentences] = useState(ORIGINAL_SENTENCES.map(s => ({ ...s })));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (id, value) => {
    setSentences(prev => prev.map(s => s.id === id ? { ...s, text: value } : s));
  };

  const handleEditClick = () => {
    // Switch from view mode → edit mode
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        answers: sentences.map(s => ({
          sentenceId: s.id,
          original: ORIGINAL_SENTENCES.find(o => o.id === s.id).text,
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
      setLoading(false);
    }
  };

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

        <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'center' }}>
          {!isEditing ? (
            <button className="btn" onClick={handleEditClick}>Edit</button>
          ) : (
            <button className="btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
