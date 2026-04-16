interface InputNumberYearProps {
textLabel: string;
nameInput: string;
currentYear: number;
value: string | number | readonly string[] | undefined;
setYear: (value: number | '') => void;
}


export function InputNumberYear({ textLabel, currentYear, value, setYear, nameInput }: InputNumberYearProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={nameInput} className="text-sm font-medium text-slate-300">
        {textLabel}
      </label>
      <input
        type="number"
        name={nameInput}
        id={nameInput}
        min="1900"
        max={currentYear}
        value={value}
        onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')}
        placeholder="Ex: 1990"
        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
      />
    </div>
  );
}