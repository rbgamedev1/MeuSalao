// Máscara para telefone: (11) 98765-4321
export const maskPhone = (value) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
    .substring(0, 15);
};

// Máscara para data: DD/MM/AAAA
export const maskDate = (value) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .substring(0, 10);
};

// Máscara para moeda: R$ 00,00
export const maskCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  const number = value.replace(/\D/g, '');
  const amount = (parseInt(number || 0) / 100).toFixed(2);
  return `R$ ${amount.replace('.', ',')}`;
};

// Converter data de DD/MM/AAAA para AAAA-MM-DD
export const dateToISO = (dateStr) => {
  if (!dateStr || dateStr.length !== 10) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

// Converter data de AAAA-MM-DD para DD/MM/AAAA
export const dateFromISO = (isoStr) => {
  if (!isoStr) return '';
  const [year, month, day] = isoStr.split('-');
  return `${day}/${month}/${year}`;
};

// Remover máscara de moeda para número
export const unmaskCurrency = (value) => {
  if (!value) return 0;
  const number = value.replace(/\D/g, '');
  return parseFloat(number) / 100;
};

// Remover máscara de telefone
export const unmaskPhone = (value) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

// Validar data no formato DD/MM/AAAA
export const isValidDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 10) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
};

// Gerar opções de horário
export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

// Gerar opções de duração (5min até 3h)
export const generateDurationOptions = () => {
  const options = [];
  for (let minutes = 5; minutes <= 180; minutes += 5) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    let label = '';
    if (hours > 0) {
      label += `${hours}h`;
    }
    if (mins > 0) {
      if (hours > 0) label += ' ';
      label += `${mins}min`;
    }
    
    options.push({ value: minutes, label });
  }
  return options;
};