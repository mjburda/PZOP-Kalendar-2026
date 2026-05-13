import { Form, redirect, Link } from "react-router";
import { sql } from "../sql";
import { User } from "../components/User";

/**
 * Akce pro uložení nové události do databáze.
 * @param {Object} args - Argumenty routeru (request).
 */
export async function action({ request }) {
  const formData = await request.formData();
  
  const title = formData.get("title");
  const date = formData.get("date");
  const subject = formData.get("subject");
  const description = formData.get("description");
  const isTest = formData.get("is_test") === "on" ? 1 : 0;

  // SQL zápis do tabulky pzop_event
  await sql(`
    INSERT INTO pzop_event (title, description, event_date, subject_shortcut, is_test) 
    VALUES ('${title}', '${description}', '${date}', '${subject}', ${isTest})
  `);

  return redirect("/");
}

/**
 * Stránka s formulářem pro novou událost.
 */
export default function NewEvent() {
  return (
    /* Obal, který na PC přidá šedé pozadí a odsazení shora (sm:py-10) */
    <main className="min-h-screen bg-gray-50 sm:py-10">
      
      {/* Hlavní karta formuláře: 
          - max-w-md zajistí, že to bude mít šířku jako mobil i na PC 
          - sm:rounded-3xl a sm:shadow-xl udělají na PC hezký vzhled karty */}
      <div className="max-w-md mx-auto bg-white min-h-screen sm:min-h-0 p-6 sm:rounded-3xl sm:shadow-xl">
        
        <header className="flex justify-between items-center mb-8">
          <User />
          <Link to="/" className="text-gray-400 font-medium hover:text-gray-600">
            Zavřít
          </Link>
        </header>
        
        <h2 className="text-xl font-bold text-center mb-10 text-gray-800 uppercase tracking-tight">
          Nová událost
        </h2>

        <Form method="post" className="space-y-8">
          {/* Původní styl s linkou (border-b) */}
          <div className="border-b border-gray-200 pb-2">
            <label className="text-xs font-bold text-gray-400 uppercase block">Název</label>
            <input 
              name="title" 
              required 
              className="w-full outline-none text-lg font-medium text-gray-700 bg-transparent" 
              placeholder="Zadejte název..."
            />
          </div>

          <div className="border-b border-gray-200 pb-2">
            <label className="text-xs font-bold text-gray-400 uppercase block">Datum</label>
            <input 
              type="date" 
              name="date" 
              required 
              className="w-full outline-none text-gray-700 bg-transparent" 
            />
          </div>

          <div className="border-b border-gray-200 pb-2">
            <label className="text-xs font-bold text-gray-400 uppercase block">Předmět</label>
            <select name="subject" className="w-full outline-none text-gray-700 bg-transparent py-1">
              <option value="WAP">WAP</option>
              <option value="CJL">CJL</option>
              <option value="MAT">MAT</option>
              <option value="MUL">MUL</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-3">Popis</label>
            <textarea 
              name="description" 
              maxLength="150" 
              className="w-full bg-gray-50 rounded-2xl p-4 outline-none h-32 text-gray-600 resize-none focus:ring-1 focus:ring-blue-100"
              placeholder="Podrobnosti úkolu..."
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-400 font-medium">Plánovaný test</span>
            <input 
              type="checkbox" 
              name="is_test" 
              className="w-6 h-6 accent-blue-600 cursor-pointer" 
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Uložit událost
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}