import type { Genre } from "../models";
import { InputNumberYear } from "./input-number-year";
import { SelectList } from "./select-list";

interface MovieFiltersProps {
  genres: Genre[];
  genreId: number | "";
  setGenreId: (value: number | "") => void;
  minRating: number;
  setMinRating: (value: number) => void;
  yearMin: number | "";
  setYearMin: (value: number | "") => void;
  yearMax: number | "";
  setYearMax: (value: number | "") => void;
}

export function MovieFilters({
  genres,
  genreId,
  setGenreId,
  minRating,
  setMinRating,
  yearMin,
  setYearMin,
  yearMax,
  setYearMax,
}: MovieFiltersProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-slate-800 p-5 rounded-2xl shadow-lg mb-6 w-full max-w-sm mx-auto text-slate-200 border border-slate-700">
      <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
        <span>🎛️</span> Personalizar Sorteio
      </h3>

      <div className="flex flex-col gap-4">
        

        <SelectList titlelabel="Gênero" itemId={genreId} setItemId={setGenreId} allItemLst="Todos os gêneros" list={genres}/>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="rating"
              className="text-sm font-medium text-slate-300"
            >
              Nota Mínima
            </label>
            <span className="text-yellow-500 font-bold bg-slate-900 px-2 py-1 rounded-md text-xs border border-slate-700">
              ⭐ {minRating.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            name="rating"
            id="rating"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputNumberYear
            textLabel="Ano Inicial"
            currentYear={currentYear}
            value={yearMin}
            nameInput="yearMin"
            setYear={setYearMin}
          />

          <InputNumberYear
            textLabel="Ano Final"
            currentYear={currentYear}
            value={yearMax}
            nameInput="yearMax"
            setYear={setYearMax}
          />

        </div>
      </div>
    </div>
  );
}
