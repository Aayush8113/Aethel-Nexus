export const getExtension = (language) => {
  const map = {
    javascript: 'js', python: 'py', java: 'java', 'c++': 'cpp', cpp: 'cpp', csharp: 'cs',
    html: 'html', css: 'css', json: 'json', markdown: 'md', typescript: 'ts', tsx: 'tsx',
    jsx: 'jsx', sql: 'sql', bash: 'sh', shell: 'sh'
  };
  return map[language?.toLowerCase()] || 'txt';
};