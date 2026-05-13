import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { sql } from "../sql";
import { User } from "../components/User";
import { Event } from "../components/Event";

/**
 * Loader načte předměty pro filtr a události s jejich ikonami.
 */
export async function loader() {
  const predmety = await sql("SELECT * FROM pzop_subject");
  // JOIN pro získání ikony z tabulky předmětů (body za zobrazení ikon v seznamu)
  const udalosti = await sql(`
    SELECT e.*, s.icon_url 
    FROM pzop_event e 
    LEFT JOIN pzop_subject s ON e.subject_shortcut = s.shortcut 
    ORDER BY e.event_date ASC
  `);
  return { predmety, udalosti };
}

export default function Home() {
  const { predmety, udalosti } = useLoaderData();
  const [filtr, setFiltr] = useState("Vše");
  const [limit, setLimit] = useState(4); // Limit pro tlačítko "Více"

  // Logika filtrování
  const filtrovaneUdalosti = filtr === "Vše" 
    ? udalosti 
    : udalosti.filter(e => e.subject_shortcut === filtr);

  const zobrazeneUdalosti = filtrovaneUdalosti.slice(0, limit);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Sémantický header - responzivně na střed max-w-6xl */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <User />
          <Link to="/events/new" className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 transition">
            +
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Navigace pro výběr předmětu */}
        <nav className="flex gap-2 overflow-x-auto pb-6">
          <button 
            onClick={() => setFiltr("Vše")}
            className={`px-6 py-1.5 rounded-full border text-sm font-bold transition-colors ${filtr === "Vše" ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
          >Vše</button>
          {predmety.map(p => (
            <button 
              key={p.shortcut}
              onClick={() => setFiltr(p.shortcut)}
              className={`px-6 py-1.5 rounded-full border text-sm font-bold transition-colors ${filtr === p.shortcut ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
            >
              {p.shortcut}
            </button>
          ))}
        </nav>

        {/* RESPONZIVITA: grid-cols-1 (mobil), md:grid-cols-2 (tablet), lg:grid-cols-3 (PC) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zobrazeneUdalosti.map(u => (
            <Event key={u.id} event={u} />
          ))}
        </section>

        {/* Tlačítko Více - zobrazí se jen když je co víc ukazovat */}
        {filtrovaneUdalosti.length > limit && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setLimit(100)} 
              className="text-blue-600 font-bold py-2 px-6 hover:bg-blue-50 rounded-lg transition"
            >
              Zobrazit více událostí
            </button>
          </div>
        )}
      </main>
    </div>
  );
}