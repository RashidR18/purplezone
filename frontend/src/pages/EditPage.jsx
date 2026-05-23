import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const initialSentences = [
  { id: 1, text: "She don't know where is the keys to the house, and yesterday she have left it on a table near to the door." },
  { id: 2, text: "The team have worked very hard on there project, but the manager didn't gave them no feedback since two week." },
  { id: 3, text: "He goed to the market yesterday and buyed some apple and potato, but forget to brought his wallet with him." }
];

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [original, setOriginal] = useState('');
  const [correctedText, setCorrectedText] = useState('');

  useEffect(() => {
    const sentenceId = parseInt(id);
    const sentence = initialSentences.find(s => s.id === sentenceId);
    
    if (sentence) {
      setOriginal(sentence.text);
      
      const storedAnswers = localStorage.getItem('testAnswers');
      if (storedAnswers) {
        const parsed = JSON.parse(storedAnswers);
        const found = parsed.find(p => p.id === sentenceId);
        if (found) {
          setCorrectedText(found.correctedText);
        } else {
          setCorrectedText(sentence.text);
        }
      } else {
        setCorrectedText(sentence.text);
      }
    } else {
      navigate('/test');
    }
  }, [id, navigate]);

  const handleSave = () => {
    const sentenceId = parseInt(id);
    let storedAnswers = localStorage.getItem('testAnswers');
    storedAnswers = storedAnswers ? JSON.parse(storedAnswers) : [];
    
    const existingIndex = storedAnswers.findIndex(s => s.id === sentenceId);
    if (existingIndex !== -1) {
      storedAnswers[existingIndex].correctedText = correctedText;
    } else {
      storedAnswers.push({ id: sentenceId, correctedText });
    }
    
    localStorage.setItem('testAnswers', JSON.stringify(storedAnswers));
    navigate('/test');
  };

  const handleCancel = () => {
    navigate('/test');
  };

  return (
    <div className="card">
      <div className="header-title">Edit Sentence</div>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '8px', lineHeight: '1.5' }}>
        <strong>Original:</strong><br />
        {original}
      </div>

      <div className="input-group">
        <textarea
          rows={4}
          value={correctedText}
          onChange={(e) => setCorrectedText(e.target.value)}
          style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <button className="btn" onClick={handleSave}>Save</button>
        <button className="btn" onClick={handleCancel} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}>Cancel</button>
      </div>
    </div>
  );
};

export default EditPage;
