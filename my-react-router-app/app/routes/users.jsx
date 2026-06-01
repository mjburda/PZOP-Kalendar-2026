import { Form, redirect, useLoaderData, Link } from "react-router";
import { sql } from "../sql";

export async function loader() {
  try {
    const uzivatele = await sql("SELECT * FROM pzop_user ORDER BY id DESC");
    return { uzivatele: uzivatele || [] };
  } catch (e) {
    console.error("Chyba při načítání uživatelů:", e);
    return { uzivatele: [] };
  }
}

export async function action({ request }) {
  const f = await request.formData();
  const intent = f.get("intent");

  if (intent === "add") {
    const jmeno = f.get("name");
    const avatar = f.get("avatar_url") || "";
    if (jmeno) {
      await sql(`INSERT INTO pzop_user (name, avatar_url) VALUES ('${jmeno}', '${avatar}')`);
    }
  }

  if (intent === "delete") {
    const idUzivatele = f.get("id");
    if (idUzivatele) {
      await sql(`DELETE FROM pzop_user WHERE id = ${idUzivatele}`);
    }
  }

  return redirect("/users");
}

export default function UsersManagement() {
  const { uzivatele } = useLoaderData();

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8 flex flex-col gap-6">
        
        {/* Hlavička stránky */}
        <header className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Správa Uživatelů</h1>
            <p className="text-xs text-gray-500 mt-0.5">Přidávání, odebírání a přehled registrovaných účtů</p>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <span className="material-icons text-base">close</span>
            Zavřít
          </Link>
        </header>

        {/* Responzivní mřížka: 1 sloupec na mobilu, 2 sloupce (40% ku 60%) na počítači */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEVÝ PANEL: Formulář pro vytvoření nového uživatele */}
          <section className="lg:col-span-2 bg-gray-50/60 p-5 md:p-6 rounded-2xl border border-gray-100 h-fit">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
              Nový uživatel
            </h2>
            
            <Form method="post" className="space-y-5">
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Jméno a příjmení
                </label>
                <input 
                  name="name" 
                  required 
                  placeholder="Např. Jan Horák"
                  className="w-full outline-none bg-transparent text-sm font-medium text-gray-800 placeholder-gray-300" 
                />
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  URL adresa avataru (nepovinné)
                </label>
                <input 
                  name="avatar_url" 
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full outline-none bg-transparent text-xs text-gray-700 placeholder-gray-300 truncate" 
                />
              </div>

              <button 
                type="submit" 
                name="intent" 
                value="add" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-icons text-lg">person_add</span>
                Vytvořit účet
              </button>
            </Form>
          </section>

          {/* PRAVÝ PANEL: Seznam stávajících uživatelů */}
          <section className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Seznam registrovaných účtů
              </h3>
              <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                {uzivatele.length} {uzivatele.length === 1 ? 'uživatel' : (uzivatele.length >= 2 && uzivatele.length <= 4 ? 'uživatelé' : 'uživatelů')}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {uzivatele.map(u => (
                <article 
                  key={u.id} 
                  className="flex items-center justify-between p-3.5 border border-gray-200/70 rounded-2xl bg-white hover:border-blue-100 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {u.avatar_url ? (
                      <img 
                        src={u.avatar_url} 
                        alt={u.name} 
                        className="w-11 h-11 rounded-full object-cover bg-gray-50 border border-gray-100" 
                      />
                    ) : (
                      <span className="material-icons text-gray-400 text-4xl bg-gray-50 rounded-full p-1 border border-gray-100">account_circle</span>
                    )}
                    <div>
                      <span className="font-semibold text-gray-800 text-sm block group-hover:text-blue-600 transition-colors">
                        {u.name}
                      </span>
                      {u.is_active === 1 && (
                        <span className="text-[9px] font-bold text-green-500 uppercase bg-green-50 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                          Aktivní relace
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Form method="post" onSubmit={(e) => {
                    if(!confirm(`Opravdu chcete smazat uživatele ${u.name}?`)) e.preventDefault();
                  }}>
                    <input type="hidden" name="id" value={u.id} />
                    <button 
                      type="submit" 
                      name="intent" 
                      value="delete" 
                      className="flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                      title="Smazat uživatele"
                    >
                      <span className="material-icons text-xl">delete_outline</span>
                    </button>
                  </Form>
                </article>
              ))}

              {uzivatele.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <span className="material-icons text-gray-300 text-5xl mb-2">group_off</span>
                  <p className="text-sm text-gray-400 italic">V databázi nejsou žádní uživatelé.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}