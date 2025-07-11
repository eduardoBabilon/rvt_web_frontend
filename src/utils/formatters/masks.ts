export const moneyMask = (value: string, currencySybol?: string) => {
  value = value.replace('.', '').replace(',', '').replace(/\D/g, '');

  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat('pt-BR', options).format(parseFloat(value) / 100);

  if (currencySybol) return `${currencySybol} ${result}`;

  return result;
};

export function toBrazilianCurrency(value?: number | string) {
  if (!value) return 'R$ 0,00';
  if (typeof value === 'string' && value.includes('R$')) return value;

  const normalizedValue = typeof value === 'string' ? Number(value) : value;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(normalizedValue);
}

export const onlyNumber = (maskNumber?: string) => {
  if (!maskNumber) return '';
  if (typeof maskNumber === 'number') return String(maskNumber);

  return maskNumber.replace(/\D/g, '');
};

export const onlyNumberDecimal = (maskNumber: string) => {
  return maskNumber.replaceAll('.', '').replace(',', '.');
};

export const toLocaleStringMoney = (value = 0) => {
  if (typeof value !== 'number') {
    return 'R$ 0,00';
  }

  return value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatCpf = (value?: string) => {
  if (!value) return '';
  const cleanValue = value.replace(/\D/g, '');
  const formattedCpf = `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(
    6,
    9,
  )}-${cleanValue.slice(9)}`;
  return formattedCpf;
};

export const formatPhone = (value?: string) => {
  if (!value) return '';
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length === 13) {
    return `(${cleanValue.slice(2, 4)}) ${cleanValue.slice(4, 9)}-${cleanValue.slice(9)}`;
  } else if (cleanValue.length === 11) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7)}`;
  }
  return value;
};

export const formatName = (value?: string) => {
  if (!value) return '';
  const words = value.toLowerCase().split(' ');
  const formattedName = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return formattedName;
};

export const formatCep = (value?: string) => {
  if (!value) return '';
  const cleanCep = value.replace(/\D/g, '');
  return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
};

export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export function unmaskBrazilianCurrency(value?: string) {
  if (!value) return 0;
  const unmaskedString = value
    ?.replaceAll(' ', '')
    .replaceAll('R$', '')
    .replaceAll('.', '')
    .replace(',', '.');
  return parseFloat(unmaskedString);
}
