import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const [result, setResult]   = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = localStorage.getItem('testResult');
    const storedUser   = localStorage.getItem('user');

    if (!storedResult) { navigate('/'); return; }

    setResult(JSON.parse(storedResult));

    // fullName is set from the "Name" field during registration — NOT the email
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUsername(parsed.fullName || 'User');
    }
  }, [navigate]);

  if (!result) return null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#4b525a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px 24px', // Increased top padding to clear fixed navbar
    }}>
      {/* Gray centered card — narrower width, taller height to match screenshot */}
      <div style={{
        backgroundColor: '#6b7280',
        borderRadius: '16px',
        padding: '60px 44px 60px',
        width: '100%',
        maxWidth: '520px',
        minHeight: '540px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>

        {/* Congratulations: Username */}
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '44px',
          color: '#ffffff',
          fontFamily: 'Inter, sans-serif',
        }}>
          <span style={{ color: '#86efac' }}>Congratulations:</span>{' '}
          <span style={{ color: '#ffffff', fontWeight: 400 }}>{username}</span>
        </div>

        {/* Answer rows */}
        {result.answers.map((answer, index) => (
          <div key={index} style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(255,255,255,0.3)',
            }}>
              {/* User's corrected sentence */}
              <span style={{
                fontSize: '15px',
                color: '#f3f4f6',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.5',
                flex: 1,
                paddingRight: '16px',
              }}>
                {answer.userAnswer}
              </span>

              {/* Correct / Incorrect icon image */}
              <img
                src={answer.isCorrect ? '/Group 3.png' : '/Group 5.png'}
                alt={answer.isCorrect ? 'Correct' : 'Incorrect'}
                style={{ width: '26px', height: '26px', flexShrink: 0 }}
              />
            </div>
          </div>
        ))}

        {/* Score line */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          fontSize: '16px',
          fontWeight: '700',
          color: '#ffffff',
          fontFamily: 'Inter, sans-serif',
        }}>
          You successfully corrected{' '}
          <span style={{ color: '#86efac' }}>{result.score}/{result.answers.length}</span>
          {' '}errors.
        </div>

      </div>
    </div>
  );
};

export default ResultPage;
