export const PHILSYS_DIGITS = 16;
export const formatPhilsys = (digits) => digits.replace(/(\d{4})(?=\d)/g, "$1-");

export default function PhilsysInput({ value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value.replace(/\D/g, "").slice(0, PHILSYS_DIGITS));
  };

  return (
    
    <input
      type="text"
      inputMode="numeric"
      value={formatPhilsys(value)}
      onChange={handleChange}
      maxLength={PHILSYS_DIGITS + Math.floor((PHILSYS_DIGITS - 1) / 4)}
      placeholder="0000-0000-0000"
      className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono tracking-wider"
    />
    
  );
}