import type { Genre } from "../models";

interface SelectListProps {
    titlelabel: string;
    list: Genre[] | any[];
    itemId: number | "";
    setItemId: (value: number | "") => void;
    allItemLst: string;
}

export function SelectList({ titlelabel, itemId, setItemId, list, allItemLst }: SelectListProps){

    return(
        <div className="flex flex-col gap-1">
          <label
            htmlFor="selectGenre"
            className="text-sm font-medium text-slate-300"
          >
            {titlelabel}
          </label>
          <select
            name="selectGenre"
            id="selectGenre"
            value={itemId}
            onChange={(e) =>
              setItemId(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer"
          >
            <option value="">{allItemLst}</option>
            {list.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
    )
}