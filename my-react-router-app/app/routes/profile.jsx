import { Form, redirect, useLoaderData, Link } from "react-router";
import { sql } from "../sql";

export async function loader() {
  try {
    // 1. Načteme všechny uživatele pro seznam na přepínání
    const vsichni = await sql("SELECT * FROM pzop_user ORDER BY id ASC");
    
    // 2. Aktivního uživatele vytáhneme přímo přes SQL
    const resAktivni = await sql("SELECT * FROM pzop_user WHERE is_active = 1 LIMIT 1");
    const aktivni = resAktivni[0] || vsichni[0];
    
    return { vsichni: vsichni || [], aktivni: aktivni || null };
  } catch (e) {
    console.error("Chyba při načítání profilu:", e);
    return { vsichni: [], aktivni: null };
  }
}

export async function action({ request }) {
  const f = await request.formData();
  const noveId = f.get("user_id");

  if (noveId) {
    await sql(`UPDATE pzop_user SET is_active = 0`);
    await sql(`UPDATE pzop_user SET is_active = 1 WHERE id = ${noveId}`);
  }

  return redirect("/");
}

export default function Profile() {
  const { vsichni, aktivni } = useLoaderData();

  // Vyfiltrujeme ostatní uživatele pro seznam přepínání
  const ostatniUzivatele = vsichni.filter(u => u?.id !== aktivni?.id);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8 flex flex-col gap-6">
        
        {/* Hlavička karty */}
        <header className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Můj Profil</h1>
            <p className="text-xs text-gray-500 mt-0.5">Správa a přepínání uživatelských účtů</p>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <span className="material-icons text-base">close</span>
            Zavřít
          </Link>
        </header>

        {/* Responzivní mřížka: na mobilu pod sebou (1 sloupec), na PC vedle sebe (grid o 5 sloupcích) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* LEVÝ HORNÍ PANEL: Aktuálně aktivní uživatel */}
          <section className="md:col-span-2 bg-gradient-to-b from-blue-50/70 to-transparent p-6 rounded-2xl border border-blue-100/50 flex flex-col items-center justify-center text-center min-h-[260px]">
            {aktivni ? (
              <>
                <div className="relative mb-4">
                  {aktivni.avatar_url ? (
                    <img 
                      src={aktivni.avatar_url} 
                      alt={aktivni.name} 
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white" 
                    />
                  ) : (
                    <span className="material-icons text-gray-300 text-7xl bg-white rounded-full p-2 shadow-sm">account_circle</span>
                  )}
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 leading-snug">{aktivni.name}</h2>
                <span className="text-[10px] font-bold text-green-600 uppercase mt-2 bg-green-100/60 px-3 py-1 rounded-full tracking-wider">
                  Právě aktivní
                </span>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">Žádný uživatel není aktivní.</p>
            )}
          </section>

          {/* PRAVÝ / SPODNÍ PANEL: Seznam ostatních účtů na přepnutí */}
          <section className="md:col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Přepnout na jiný účet
            </h3>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {ostatniUzivatele.map(u => (
                <article 
                  key={u.id} 
                  className="flex items-center justify-between p-3.5 border border-gray-200/70 rounded-2xl bg-white hover:border-blue-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {u.avatar_url ? (
                      <img 
                        src={u.avatar_url} 
                        alt={u.name} 
                        className="w-11 h-11 rounded-full object-cover bg-gray-50 border border-gray-100" 
                      />
                    ) : (
                      <span className="material-icons text-gray-400 text-4xl">account_circle</span>
                    )}
                    <span className="font-semibold text-gray-700 text-sm group-hover:text-blue-600 transition-colors">
                      {u.name}
                    </span>
                  </div>

                  <Form method="post">
                    <input type="hidden" name="user_id" value={u.id} />
                    <button 
                      type="submit" 
                      className="text-xs bg-gray-50 hover:bg-blue-600 border border-gray-200 text-gray-700 hover:text-white hover:border-blue-600 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Přepnout
                    </button>
                  </Form>
                </article>
              ))}

              {ostatniUzivatele.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <span className="material-icons text-gray-300 text-4xl mb-1">group_blur</span>
                  <p className="text-xs text-gray-400 italic">Žádní další uživatelé nejsou k dispozici.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}