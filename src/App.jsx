import React, { useState } from 'react';
import ConfigOptionForm from './components/ConfigOptionForm';
import { generateVimConfig } from './utils/generateVimConfig';
import './App.css';

function App() {
  const [generatedConfig, setGeneratedConfig] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (configData) => {
    const result = generateVimConfig(configData);
    setGeneratedConfig(result);
    setCopied(false);
  };

  const handleCopy = () => {
    if (generatedConfig?.code) {
      navigator.clipboard.writeText(generatedConfig.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">
            <span className="vim-accent">Vim</span>.ai
          </h1>
          <p className="tagline">Generate beautiful Vim/Neovim configurations with ease</p>
        </div>
      </header>

      <main className="app-main">
        <section className="form-section">
          <ConfigOptionForm onGenerate={handleGenerate} />
        </section>

        {generatedConfig && (
          <section className="output-section">
            <div className="output-header">
              <h2>Generated Configuration</h2>
              <button 
                className={`btn-copy ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                aria-label="Copy to clipboard"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            
            {generatedConfig.success ? (
              <div className="code-output">
                <pre>
                  <code className={`language-${generatedConfig.language}`}>
                    {generatedConfig.code}
                  </code>
                </pre>
              </div>
            ) : (
              <div className="error-output">
                <p>❌ Error: {generatedConfig.error}</p>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Made with <span className="heart">♥</span> for the Vim community
        </p>
        <p className="footer-links">
          <a href="https://neovim.io" target="_blank" rel="noopener noreferrer">Neovim</a>
          <span className="separator">•</span>
          <a href="https://www.vim.org" target="_blank" rel="noopener noreferrer">Vim</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
