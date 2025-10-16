import React, { useState, useEffect } from 'react';
import { getLinks, type LinkDto } from '../services/apiService';

function HomePage() {
  const [links, setLinks] = useState<LinkDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getLinks();
        setLinks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []); // O array vazio [] faz com que este useEffect seja executado apenas uma vez

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login'; // Redireciona para o login
  };

  if (loading) return <p>A carregar links...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div>
      <h2>Meus Links Salvos</h2>
      <button onClick={handleLogout}>Sair</button>
      {links.length === 0 ? (
        <p>Nenhum link salvo ainda.</p>
      ) : (
        <ul>
          {links.map(link => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title || link.url}
              </a>
              <div>
                {link.tags.map(tag => (
                  <span key={tag.id} style={{ marginRight: '5px', backgroundColor: '#eee', padding: '2px 5px', borderRadius: '3px' }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;