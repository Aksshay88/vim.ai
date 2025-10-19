/**
 * generateVimConfig - Core logic for generating Vim/Neovim configurations
 * Supports Lua and Vimscript output for various config types
 */

/**
 * Escape special characters for Lua strings
 */
const escapeLua = (str) => {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
};

/**
 * Escape special characters for Vimscript strings
 */
const escapeVimscript = (str) => {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
};

/**
 * Parse string value to appropriate Lua type
 */
const parseLuaValue = (value) => {
  if (value === 'true' || value === 'false') {
    return value;
  }
  if (!isNaN(value) && value.trim() !== '') {
    return value;
  }
  // If it starts with { or [, assume it's already a Lua table/array
  if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
    return value;
  }
  return `'${escapeLua(value)}'`;
};

/**
 * Generate keymap configuration
 */
const generateKeymap = (data, lang) => {
  const { mode, lhs, rhs, description, noremap, buffer, silent, expr } = data;
  
  if (lang === 'lua') {
    const opts = [];
    if (description) opts.push(`desc = '${escapeLua(description)}'`);
    if (noremap !== false) opts.push(`noremap = true`);
    if (buffer) opts.push(`buffer = true`);
    if (silent) opts.push(`silent = true`);
    if (expr) opts.push(`expr = true`);
    
    const optsStr = opts.length > 0 ? `{ ${opts.join(', ')} }` : '{}';
    const modeStr = mode ? `'${mode}'` : "''";
    
    let code = '';
    if (description) {
      code += `-- ${description}\n`;
    }
    code += `vim.keymap.set(${modeStr}, '${escapeLua(lhs)}', '${escapeLua(rhs)}', ${optsStr})`;
    
    return code;
  } else {
    // Vimscript
    let cmd = '';
    
    // Determine command prefix
    const modeMap = {
      'n': 'n',
      'i': 'i',
      'v': 'v',
      'x': 'x',
      't': 't',
      'c': 'c',
      '': ''
    };
    const prefix = modeMap[mode] || '';
    const mapType = (noremap !== false) ? 'noremap' : 'map';
    cmd = `${prefix}${mapType}`;
    
    // Add options
    if (silent) cmd += ' <silent>';
    if (buffer) cmd += ' <buffer>';
    if (expr) cmd += ' <expr>';
    
    let code = '';
    if (description) {
      code += `" ${description}\n`;
    }
    code += `${cmd} ${lhs} ${rhs}`;
    
    return code;
  }
};

/**
 * Generate plugin configuration
 */
const generatePlugin = (data, lang) => {
  const { plugin_name, config_type, dependencies, setup_config, add_config, is_optional } = data;
  
  if (lang === 'lua') {
    if (config_type === 'lazy.nvim') {
      let code = `{\n  '${escapeLua(plugin_name)}'`;
      
      if (dependencies) {
        const deps = dependencies.split(',').map(d => d.trim()).filter(d => d);
        if (deps.length > 0) {
          code += `,\n  dependencies = {`;
          deps.forEach((dep, idx) => {
            code += `\n    '${escapeLua(dep)}'${idx < deps.length - 1 ? ',' : ''}`;
          });
          code += `\n  }`;
        }
      }
      
      if (is_optional) {
        code += `,\n  lazy = true`;
      }
      
      if (add_config) {
        code += `,\n  config = function()`;
        code += `\n    require('${plugin_name.split('/').pop().replace('.nvim', '').replace('nvim-', '')}').setup(`;
        
        if (setup_config && setup_config.trim()) {
          code += setup_config.trim();
        } else {
          code += `{}`;
        }
        
        code += `)\n  end`;
      }
      
      code += `\n}`;
      return code;
      
    } else if (config_type === 'packer') {
      let code = `use {\n  '${escapeLua(plugin_name)}'`;
      
      if (dependencies) {
        const deps = dependencies.split(',').map(d => d.trim()).filter(d => d);
        if (deps.length > 0) {
          code += `,\n  requires = {`;
          deps.forEach((dep, idx) => {
            code += `'${escapeLua(dep)}'${idx < deps.length - 1 ? ', ' : ''}`;
          });
          code += `}`;
        }
      }
      
      if (is_optional) {
        code += `,\n  opt = true`;
      }
      
      if (add_config) {
        code += `,\n  config = function()`;
        code += `\n    require('${plugin_name.split('/').pop().replace('.nvim', '').replace('nvim-', '')}').setup(`;
        
        if (setup_config && setup_config.trim()) {
          code += setup_config.trim();
        } else {
          code += `{}`;
        }
        
        code += `)\n  end`;
      }
      
      code += `\n}`;
      return code;
    }
  } else {
    // Vimscript
    if (config_type === 'vim-plug') {
      let code = `Plug '${plugin_name}'`;
      
      if (dependencies) {
        const deps = dependencies.split(',').map(d => d.trim()).filter(d => d);
        deps.forEach(dep => {
          code += `\nPlug '${dep}'`;
        });
      }
      
      if (is_optional) {
        code += ` { 'on': [] } " Lazy load`;
      }
      
      return code;
    } else if (config_type === 'dein') {
      let code = `call dein#add('${plugin_name}')`;
      return code;
    }
  }
  
  return `" Plugin configuration for ${plugin_name}`;
};

/**
 * Generate option configuration
 */
const generateOption = (data, lang) => {
  const { option_name, option_value, scope = 'opt' } = data;
  
  if (lang === 'lua') {
    const value = parseLuaValue(option_value);
    return `vim.${scope}.${option_name} = ${value}`;
  } else {
    // Vimscript
    let value = option_value;
    
    // Handle boolean values
    if (value === 'true') {
      return `set ${option_name}`;
    } else if (value === 'false') {
      return `set no${option_name}`;
    }
    
    // Handle numeric and string values
    if (!isNaN(value)) {
      return `set ${option_name}=${value}`;
    } else {
      return `set ${option_name}=${value}`;
    }
  }
};

/**
 * Generate autocmd configuration
 */
const generateAutocmd = (data, lang) => {
  const { event, pattern, command, group } = data;
  
  if (lang === 'lua') {
    let code = '';
    
    if (group) {
      code += `-- Augroup: ${group}\n`;
      code += `local ${group} = vim.api.nvim_create_augroup('${group}', { clear = true })\n`;
      code += `vim.api.nvim_create_autocmd('${event}', {\n`;
      code += `  group = ${group},\n`;
      code += `  pattern = '${escapeLua(pattern)}',\n`;
      
      // Check if command is Lua or Vimscript
      if (command.trim().startsWith('lua ')) {
        const luaCmd = command.trim().substring(4);
        code += `  callback = function()\n`;
        code += `    ${luaCmd}\n`;
        code += `  end,\n`;
      } else {
        code += `  command = '${escapeLua(command)}',\n`;
      }
      
      code += `})`;
    } else {
      code += `vim.api.nvim_create_autocmd('${event}', {\n`;
      code += `  pattern = '${escapeLua(pattern)}',\n`;
      
      if (command.trim().startsWith('lua ')) {
        const luaCmd = command.trim().substring(4);
        code += `  callback = function()\n`;
        code += `    ${luaCmd}\n`;
        code += `  end,\n`;
      } else {
        code += `  command = '${escapeLua(command)}',\n`;
      }
      
      code += `})`;
    }
    
    return code;
  } else {
    // Vimscript
    let code = '';
    
    if (group) {
      code += `augroup ${group}\n`;
      code += `  autocmd!\n`;
      code += `  autocmd ${event} ${pattern} ${command}\n`;
      code += `augroup END`;
    } else {
      code += `autocmd ${event} ${pattern} ${command}`;
    }
    
    return code;
  }
};

/**
 * Main function to generate Vim configuration
 */
export const generateVimConfig = ({ configType, configLang, data }) => {
  try {
    let generatedCode = '';
    
    switch (configType) {
      case 'Keymap':
        generatedCode = generateKeymap(data, configLang);
        break;
      
      case 'Plugin':
        generatedCode = generatePlugin(data, configLang);
        break;
      
      case 'Option':
        generatedCode = generateOption(data, configLang);
        break;
      
      case 'Autocmd':
        generatedCode = generateAutocmd(data, configLang);
        break;
      
      default:
        throw new Error(`Unsupported config type: ${configType}`);
    }
    
    return {
      success: true,
      code: generatedCode,
      language: configLang
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: ''
    };
  }
};

export default generateVimConfig;
