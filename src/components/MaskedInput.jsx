import { maskPhone, maskDate, maskCurrency } from '../utils/masks';

const MaskedInput = ({ mask, value, onChange, name, ...props }) => {
  const handleChange = (e) => {
    let maskedValue = e.target.value;
    
    if (mask === 'phone') {
      maskedValue = maskPhone(maskedValue);
    } else if (mask === 'date') {
      maskedValue = maskDate(maskedValue);
    } else if (mask === 'currency') {
      maskedValue = maskCurrency(maskedValue);
    }
    
    onChange({ target: { name, value: maskedValue } });
  };

  return (
    <input
      {...props}
      name={name}
      value={value}
      onChange={handleChange}
      className={props.className || "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"}
    />
  );
};

export default MaskedInput;