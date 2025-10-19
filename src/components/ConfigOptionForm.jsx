import React, { useState, useEffect } from 'react';
import './ConfigOptionForm.css';

/**
 * ConfigOptionForm - Dynamic form component for generating Vim/Neovim configurations
 * Supports multiple config types: Keymap, Autocmd, Option, Plugin
 */
const ConfigOptionForm = ({ onGenerate }) => {
  const [configType, setConfigType] = useState('Keymap');
  const [configLang, setConfigLang] = useState('lua'); // 'lua' or 'vimscript'
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Reset form data when config type changes
  useEffect(() => {
    setFormData({});
    setErrors({});
  }, [configType]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form based on config type
  const validateForm = () => {
    const newErrors = {};

    switch (configType) {
      case 'Keymap':
        if (!formData.mode) newErrors.mode = 'Mode is required';
        if (!formData.lhs) newErrors.lhs = 'Key binding (lhs) is required';
        if (!formData.rhs) newErrors.rhs = 'Action (rhs) is required';
        break;
      
      case 'Plugin':
        if (!formData.plugin_name) newErrors.plugin_name = 'Plugin name is required';
        if (!formData.config_type) newErrors.config_type = 'Config type is required';
        break;
      
      case 'Option':
        if (!formData.option_name) newErrors.option_name = 'Option name is required';
        if (!formData.option_value) newErrors.option_value = 'Option value is required';
        break;
      
      case 'Autocmd':
        if (!formData.event) newErrors.event = 'Event is required';
        if (!formData.pattern) newErrors.pattern = 'Pattern is required';
        if (!formData.command) newErrors.command = 'Command is required';
        break;
      
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onGenerate({
        configType,
        configLang,
        data: formData
      });
    }
  };

  // Render form fields based on config type
  const renderFormFields = () => {
    switch (configType) {
      case 'Keymap':
        return (
          <>
            <div className="form-group">
              <label htmlFor="mode">
                Mode <span className="required">*</span>
              </label>
              <select
                id="mode"
                name="mode"
                value={formData.mode || ''}
                onChange={handleInputChange}
                className={errors.mode ? 'error' : ''}
                aria-required="true"
              >
                <option value="">Select mode...</option>
                <option value="n">Normal (n)</option>
                <option value="i">Insert (i)</option>
                <option value="v">Visual (v)</option>
                <option value="x">Visual Block (x)</option>
                <option value="t">Terminal (t)</option>
                <option value="c">Command (c)</option>
                <option value="">All modes</option>
              </select>
              {errors.mode && <span className="error-message">{errors.mode}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lhs">
                Key Binding (lhs) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lhs"
                name="lhs"
                value={formData.lhs || ''}
                onChange={handleInputChange}
                placeholder="e.g., <leader>ff, <C-n>, jk"
                className={errors.lhs ? 'error' : ''}
                aria-required="true"
              />
              {errors.lhs && <span className="error-message">{errors.lhs}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rhs">
                Action (rhs) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="rhs"
                name="rhs"
                value={formData.rhs || ''}
                onChange={handleInputChange}
                placeholder="e.g., :Telescope find_files<CR>, :w<CR>"
                className={errors.rhs ? 'error' : ''}
                aria-required="true"
              />
              {errors.rhs && <span className="error-message">{errors.rhs}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="What does this keymap do?"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="noremap"
                  checked={formData.noremap || false}
                  onChange={handleInputChange}
                />
                <span>Non-recursive (noremap)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="buffer"
                  checked={formData.buffer || false}
                  onChange={handleInputChange}
                />
                <span>Buffer-local</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="silent"
                  checked={formData.silent || false}
                  onChange={handleInputChange}
                />
                <span>Silent</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="expr"
                  checked={formData.expr || false}
                  onChange={handleInputChange}
                />
                <span>Expression</span>
              </label>
            </div>
          </>
        );

      case 'Plugin':
        return (
          <>
            <div className="form-group">
              <label htmlFor="plugin_name">
                Plugin Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="plugin_name"
                name="plugin_name"
                value={formData.plugin_name || ''}
                onChange={handleInputChange}
                placeholder="e.g., nvim-telescope/telescope.nvim"
                className={errors.plugin_name ? 'error' : ''}
                aria-required="true"
              />
              {errors.plugin_name && <span className="error-message">{errors.plugin_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="config_type">
                Plugin Manager <span className="required">*</span>
              </label>
              <select
                id="config_type"
                name="config_type"
                value={formData.config_type || ''}
                onChange={handleInputChange}
                className={errors.config_type ? 'error' : ''}
                aria-required="true"
              >
                <option value="">Select plugin manager...</option>
                <option value="lazy.nvim">lazy.nvim</option>
                <option value="packer">Packer</option>
                <option value="vim-plug">vim-plug</option>
                <option value="dein">dein.vim</option>
              </select>
              {errors.config_type && <span className="error-message">{errors.config_type}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dependencies">Dependencies</label>
              <input
                type="text"
                id="dependencies"
                name="dependencies"
                value={formData.dependencies || ''}
                onChange={handleInputChange}
                placeholder="Comma-separated, e.g., nvim-lua/plenary.nvim"
              />
            </div>

            <div className="form-group">
              <label htmlFor="setup_config">Setup Config (Lua table)</label>
              <textarea
                id="setup_config"
                name="setup_config"
                value={formData.setup_config || ''}
                onChange={handleInputChange}
                placeholder="e.g., { defaults = { file_ignore_patterns = {'node_modules'} } }"
                rows="4"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="add_config"
                  checked={formData.add_config || false}
                  onChange={handleInputChange}
                />
                <span>Add setup() function</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_optional"
                  checked={formData.is_optional || false}
                  onChange={handleInputChange}
                />
                <span>Optional/Lazy load</span>
              </label>
            </div>
          </>
        );

      case 'Option':
        return (
          <>
            <div className="form-group">
              <label htmlFor="option_name">
                Option Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="option_name"
                name="option_name"
                value={formData.option_name || ''}
                onChange={handleInputChange}
                placeholder="e.g., tabstop, number, relativenumber"
                className={errors.option_name ? 'error' : ''}
                aria-required="true"
                list="common-options"
              />
              <datalist id="common-options">
                <option value="number" />
                <option value="relativenumber" />
                <option value="tabstop" />
                <option value="shiftwidth" />
                <option value="expandtab" />
                <option value="smartindent" />
                <option value="wrap" />
                <option value="cursorline" />
                <option value="termguicolors" />
                <option value="signcolumn" />
              </datalist>
              {errors.option_name && <span className="error-message">{errors.option_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="option_value">
                Value <span className="required">*</span>
              </label>
              <input
                type="text"
                id="option_value"
                name="option_value"
                value={formData.option_value || ''}
                onChange={handleInputChange}
                placeholder="e.g., true, 4, 'yes'"
                className={errors.option_value ? 'error' : ''}
                aria-required="true"
              />
              {errors.option_value && <span className="error-message">{errors.option_value}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="scope">Scope</label>
              <select
                id="scope"
                name="scope"
                value={formData.scope || 'opt'}
                onChange={handleInputChange}
              >
                <option value="opt">vim.opt (recommended)</option>
                <option value="o">vim.o (global)</option>
                <option value="bo">vim.bo (buffer)</option>
                <option value="wo">vim.wo (window)</option>
                <option value="g">vim.g (global variable)</option>
              </select>
            </div>
          </>
        );

      case 'Autocmd':
        return (
          <>
            <div className="form-group">
              <label htmlFor="event">
                Event <span className="required">*</span>
              </label>
              <input
                type="text"
                id="event"
                name="event"
                value={formData.event || ''}
                onChange={handleInputChange}
                placeholder="e.g., BufWritePre, FileType"
                className={errors.event ? 'error' : ''}
                aria-required="true"
                list="common-events"
              />
              <datalist id="common-events">
                <option value="BufWritePre" />
                <option value="BufWritePost" />
                <option value="BufRead" />
                <option value="BufNewFile" />
                <option value="FileType" />
                <option value="VimEnter" />
                <option value="InsertEnter" />
                <option value="InsertLeave" />
                <option value="TextYankPost" />
              </datalist>
              {errors.event && <span className="error-message">{errors.event}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pattern">
                Pattern <span className="required">*</span>
              </label>
              <input
                type="text"
                id="pattern"
                name="pattern"
                value={formData.pattern || ''}
                onChange={handleInputChange}
                placeholder="e.g., *.md, python, *"
                className={errors.pattern ? 'error' : ''}
                aria-required="true"
              />
              {errors.pattern && <span className="error-message">{errors.pattern}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="command">
                Command <span className="required">*</span>
              </label>
              <textarea
                id="command"
                name="command"
                value={formData.command || ''}
                onChange={handleInputChange}
                placeholder="e.g., setlocal spell, lua vim.lsp.buf.format()"
                className={errors.command ? 'error' : ''}
                aria-required="true"
                rows="3"
              />
              {errors.command && <span className="error-message">{errors.command}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="group">Augroup Name</label>
              <input
                type="text"
                id="group"
                name="group"
                value={formData.group || ''}
                onChange={handleInputChange}
                placeholder="Optional: organize autocmds"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="config-option-form">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="form-group">
            <label htmlFor="configType">Configuration Type</label>
            <select
              id="configType"
              value={configType}
              onChange={(e) => setConfigType(e.target.value)}
              className="config-type-select"
            >
              <option value="Keymap">⌨️ Keymap</option>
              <option value="Plugin">🔌 Plugin</option>
              <option value="Option">⚙️ Option</option>
              <option value="Autocmd">🤖 Autocmd</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="configLang">Language</label>
            <select
              id="configLang"
              value={configLang}
              onChange={(e) => setConfigLang(e.target.value)}
              className="config-lang-select"
            >
              <option value="lua">Lua (Neovim)</option>
              <option value="vimscript">Vimscript</option>
            </select>
          </div>
        </div>

        <div className="form-body">
          {renderFormFields()}
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-generate">
            Generate Config
          </button>
          <button 
            type="button" 
            className="btn-reset"
            onClick={() => setFormData({})}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigOptionForm;
