import { Form, redirect, useLoaderData, useNavigate } from "react-router";
import { sql } from "../sql";
import { User } from "../components/User";

/**
 * Načte data konkrétní události z databáze pro zobrazení v detailu.
 * @param {Object} args - Parametry z URL (id).
 */
export async function loader({ params }) {
  const vypis = await sql(`SELECT * FROM pzop_event WHERE id = ${params.id}`);
  return { ud: vypis[0] };
}

/**
 * Zpracuje uložení změn nebo smazání události.
 */
export async function action({ request, params }) {
  const f = await request.formData();
  const tlacitko = f.get("intent");

  if (tlacitko === "smazat") {
    await sql(`DELETE FROM pzop_event WHERE id = ${params.id}`);
  } else {
    const nadpis = f.get("title");
    const datum = f.get("date");
    const popis = f.get("description");
    const jeTest = f.get("is_test") === "on" ? 1 : 0;
    
    await sql(`
      UPDATE pzop_event 
      SET title = '${nadpis}', event_date = '${datum}', description = '${popis}', is_test = ${jeTest} 
      WHERE id = ${params.id}
    `);
  }
  return redirect("/");
}

export default function EventDetail() {
  const data = useLoaderData();
  const navigate = useNavigate();

  return (
    /* Tento vnější obal zajistí šedé pozadí a odsazení na PC (sm:py-10) */
    <main className="min-h-screen bg-gray-50 sm:py-10">
      
      {/* Vnitřní karta: 
          - max-w-md zajistí, že to na PC nebude širší než mobil
          - sm:rounded-3xl a sm:shadow-xl udělá na PC hezký vzhled karty
      */}
      <div className="max-w-md mx-auto bg-white min-h-screen sm:min-h-0 p-6 sm:rounded-3xl sm:shadow-xl">
        
        <header className="flex justify-between items-center mb-8">
          <User />
          <button onClick={() => navigate("/")} className="text-gray-400 font-bold hover:text-gray-600">
            Zavřít
          </button>
        </header>
        
        <h2 className="text-xl font-bold text-center mb-10 text-gray-800 uppercase tracking-tight">
          Upravit událost
        </h2>

        <Form method="post" className="space-y-8">
          
          {/* Všechny inputy zůstávají v původním "studentském" stylu s linkou */}
          <div className="border-b border-gray-200 pb-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase block">Název</label>
            <input 
              name="title" 
              defaultValue={data.ud.title} 
              required 
              className="w-full outline-none text-lg font-medium text-gray-700 bg-transparent" 
            />
          </div>

          <div className="border-b border-gray-200 pb-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase block">Datum</label>
            <input 
              type="date" 
              name="date" 
              defaultValue={data.ud.event_date} 
              required 
              className="w-full outline-none text-gray-700 bg-transparent" 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-3">Popis</label>
            <textarea 
              name="description" 
              defaultValue={data.ud.description} 
              className="w-full bg-gray-50 rounded-2xl p-4 outline-none h-32 text-gray-600 resize-none" 
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-400 font-medium">Plánovaný test</span>
            <input 
              type="checkbox" 
              name="is_test" 
              defaultChecked={data.ud.is_test == 1} 
              className="w-6 h-6 accent-blue-600 cursor-pointer" 
            />
          </div>

          {/* Tlačítka pod sebou pro snadné ovládání */}
          <div className="space-y-4 pt-6">
            <button 
              type="submit" 
              name="intent" 
              value="ulozit" 
              className="w-full bg-blue-600 text-white py-4 rounded-full font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Uložit změny
            </button>
            
            <button 
              type="submit" 
              name="intent" 
              value="smazat" 
              className="w-full bg-red-500 text-white py-4 rounded-full font-bold shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
            >
              Smazat událost
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}