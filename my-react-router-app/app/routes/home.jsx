import { useLoaderData, Link } from "react-router";
import { sql } from "../sql";
import { User } from "../components/User";

export async function loader() {
  try {
    // 1. Zjistíme, kdo je právě aktivní uživatel (opravený JS komentář)
    const resAktivni = await sql("SELECT * FROM pzop_user WHERE is_active = 1 LIMIT 1");
    const aktivniUzivatel = resAktivni[0];

    if (!aktivniUzivatel) {
      return { predmety: [], aktivniUzivatel: null };
    }

    // 2. Načteme POUZE předměty, které patří tomuto uživateli (opravený JS komentář)
    const predmety = await sql(`SELECT * FROM pzop_event WHERE user_id = ${aktivniUzivatel.id} ORDER BY id DESC`);
    
    return { predmety: predmety || [], aktivniUzivatel };
  } catch (e) {
    console.error("Chyba při načítání home:", e);
    return { predmety: [], aktivniUzivatel: null };
  }
}

export default function Home() {
  const { predmety, aktivniUzivatel } = useLoaderData();

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col gap-6">
        
        {/* Horní lišta s profilem */}
        <header className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Moje Předměty</h1>
            <p className="text-xs text-gray-500">Přehled tvých osobních uložených položek</p>
          </div>
          <div className="flex items-center gap-4">
            <User />
            <Link to="/users" className="text-xs font-semibold text-gray-500 hover:text-blue-600 bg-gray-50 p-2 rounded-xl transition-colors">
              Správa uživatelů
            </Link>
          </div>
        </header>

        {/* Seznam předmětů */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aktuální seznam</h2>
            <Link to="/events/new" className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl shadow-md transition-all flex items-center gap-1">
              <span className="material-icons text-sm">add</span> Nový předmět
            </Link>
          </div>

          <div className="space-y-3">
            {predmety.map(p => (
              <Link 
                to={`/events/${p.id}`} 
                key={p.id} 
                className="flex items-center justify-between p-4 border border-gray-200/70 rounded-2xl bg-white hover:border-blue-200 hover:shadow-sm transition-all group"
              >
                <div>
                  <span className="font-semibold text-gray-800 text-sm block group-hover:text-blue-600 transition-colors">
                    {p.title || p.name}
                  </span>
                  <p className="text-xs text-gray-400 truncate max-w-md">{p.description || "Bez popisu"}</p>
                </div>
                <span className="material-icons text-gray-300 group-hover:text-blue-500 transition-colors">chevron_right</span>
              </Link>
            ))}

            {predmety.length === 0 && (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <span className="material-icons text-gray-300 text-5xl mb-2">folder_open</span>
                <p className="text-sm text-gray-400 italic">Zatím tu nemáš žádné předměty. Přidej první!</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}