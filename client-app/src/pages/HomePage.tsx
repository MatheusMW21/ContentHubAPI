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
    }, []);

    if (loading) return <p>A carregar links...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

    return (
        <div>
          <h2>Links Salvos</h2>
          {/* O botão de logout foi REMOVIDO daqui */}
          {links.length === 0 ? (
            <p>Nenhum link salvo ainda.</p>
          ) : (
            <ul className="links-list">
              {links.map(link => (
                <li key={link.id} className="link-item">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title || link.url}
                  </a>
                  <div className="tags-container">
                    {link.tags.map(tag => (
                      <span key={tag.id} className="tag-item">
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