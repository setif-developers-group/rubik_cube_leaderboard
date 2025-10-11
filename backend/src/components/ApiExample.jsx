import React, { useState } from 'react';
import { generateQRCode, validateParticipantTime, getLeaderboard } from '../config/api.js';

const ApiExample = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  // Test de génération de QR code
  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const result = await generateQRCode('admin@test.com', {
        type: 'admin_session',
        timestamp: Date.now()
      });
      setMessage(`QR Code généré: ${result.sessionId}`);
      console.log('QR Data:', result.qrData);
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    }
    setLoading(false);
  };

  // Test de validation de temps
  const handleValidateTime = async () => {
    setLoading(true);
    try {
      const result = await validateParticipantTime(
        {
          sessionId: 'session_1758989670559_8h2riruh6',
          type: 'admin_session',
          email: 'admin@test.com'
        },
        'player002',
        '42.15',
        'Bob',
        "F2 U M2 U M2 U F2"
      );
      setMessage(`Temps validé: ${result.leaderboardEntry.participantName} - ${result.leaderboardEntry.timeInSeconds}s`);
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    }
    setLoading(false);
  };

  // Test de récupération du leaderboard
  const handleGetLeaderboard = async () => {
    setLoading(true);
    try {
      const result = await getLeaderboard();
      setLeaderboard(result.leaderboard);
      setMessage(`Leaderboard chargé: ${result.totalEntries} participants`);
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🧪 Test de l'API Backend</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleGenerateQR}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Générer QR Code
        </button>

        <button
          onClick={handleValidateTime}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Valider Temps
        </button>

        <button
          onClick={handleGetLeaderboard}
          disabled={loading}
          style={{ padding: '10px 20px' }}
        >
          Voir Leaderboard
        </button>
      </div>

      {loading && <p>⏳ Chargement...</p>}
      {message && <p style={{ color: 'blue' }}>{message}</p>}

      {leaderboard.length > 0 && (
        <div>
          <h2>🏆 Leaderboard</h2>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Position</th>
                <th>Nom</th>
                <th>Temps</th>
                <th>Session</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.position}</td>
                  <td>{entry.participantName}</td>
                  <td>{entry.timeInSeconds}s</td>
                  <td>{entry.sessionId.substring(0, 20)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApiExample;