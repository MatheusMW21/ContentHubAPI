import React from 'react';
import { Link } from 'react-router-dom';
import { FaTags, FaMagic, FaCheckCircle } from 'react-icons/fa';

function LandingPage() {
  return (
    <div className="landing-page">

      <section className="hero-section">
        
        <div className="hero-text">
          <h2>O seu hub de conteúdo centralizado</h2>
          <p>
            Salve, organize e encontre os seus links importantes. 
            Sem confusão, apenas o seu conteúdo.
          </p>
          <Link 
            to="/register" 
            className="btn-primary" 
            style={{ fontSize: '1.2em', padding: '0.8em 1.5em' }}
          >
            Comece a usar gratuitamente
          </Link>
        </div>

        <div className="hero-image">
          <img 
            src="/dashboard-preview.png" 
            alt="Pré-visualização da dashboard do ContentHub" 
          />
        </div>
      </section>
      <section className="features-section">
        <h3>Funcionalidades Principais</h3>
        <div className="features-grid">
          
          <div className="feature-card">
            <div className="feature-card-icon"><FaMagic /></div>
            <h4>Títulos Automáticos</h4>
            <p>Basta colar a URL e nós tratamos de extrair o título automaticamente via web scraping.</p>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon"><FaTags /></div>
            <h4>Organização com Tags</h4>
            <p>Adicione múltiplas tags a cada link e filtre a sua lista com um único clique.</p>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon"><FaCheckCircle /></div>
            <h4>Marque como "Lido"</h4>
            <p>Mova os links para uma secção de "Lidos" e mantenha a sua lista principal limpa e organizada.</p>
          </div>

        </div>
      </section>
      
    </div>
  );
}

export default LandingPage;