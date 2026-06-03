import { useState } from "react";
import { useLoaderData, Link } from "react-router";
import { sql } from "../sql";

export async function loader() {
  try {
    // zjistime ktery uzivatel je zrovna aktivni aby sme neukazovali cizi ukoly
    const resAktivni = await sql(
      "SELECT * FROM pzop_user WHERE is_active = 1 LIMIT 1",
    );
    const aktivniUzivatel = resAktivni[0];

    // kdys neni nikdo, proste vratime prazdny data a on si musi nekoho vybrat
    if (!aktivniUzivatel) {
      return { udalosti: [], predmety: [], aktivniUzivatel: null };
    }

    // nacitam ukoly co patri jenom jemu a radim to od nejblizsho
    const udalosti = await sql(
      `SELECT * FROM pzop_event WHERE user_id = ${aktivniUzivatel.id} ORDER BY event_date ASC`,
    );

    // stazeni predmetu na tu horni listu
    const predmety = await sql("SELECT * FROM pzop_subject");

    return {
      udalosti: udalosti || [],
      predmety: predmety || [],
      aktivniUzivatel,
    };
  } catch (e) {
    console.error("Chybka pri nacitani:", e);
    return { udalosti: [], predmety: [], aktivniUzivatel: null };
  }
}

// prevod ikon z db na ty spravny fontovy
function ziskejIkonu(icon_url) {
  if (icon_url === "chart-bar") return "bar_chart";
  if (icon_url === "camera") return "photo_camera";
  if (icon_url === "monitor") return "desktop_windows";
  if (icon_url === "book") return "menu_book";
  return icon_url || "assignment";
}

export default function Home() {
  const { udalosti, predmety, aktivniUzivatel } = useLoaderData();
  const [vybranyPredmet, setVybranyPredmet] = useState("Vše");

  // spojim slovo vsechno a pole ze zkratek predmetu dohromady
  const filtry = ["Vše", ...predmety.map((p) => p.shortcut)];

  // tady to filtruju podle toho na co kliknul uzivtel
  const vyfiltrovaneUdalosti =
    vybranyPredmet === "Vše"
      ? udalosti
      : udalosti.filter((u) => u.subject_shortcut === vybranyPredmet);

  // osetreni pro nikoho (zobrazi se upozorneni misto prazdny chyby)
  if (!aktivniUzivatel) {
    return (
      <main className="min-h-screen bg-[#e9ebf2] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-600 mb-4 font-medium">
          Nejprve si prosím zvolte nebo vytvořte uživatelský profil.
        </p>
        <Link
          to="/profile"
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg"
        >
          Přejít na Profil
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#e9ebf2] p-0 md:p-6 lg:p-8 font-sans antialiased text-gray-800 flex justify-center">
      <section className="w-full max-w-7xl bg-[#f4f5f9] min-h-screen md:min-h-[90vh] md:rounded-[2.5rem] md:shadow-2xl border-gray-200/50 md:border overflow-hidden flex flex-col">
        {/* hlavicka aplikace s odkazem na profil a pridani ukolu */}
        <header className="flex justify-between items-center px-6 lg:px-10 pt-6 lg:pt-8 pb-4 bg-white border-b border-gray-100">
          <Link to="/profile" className="flex items-center gap-4 group">
            {aktivniUzivatel.avatar_url ? (
              <img
                src={aktivniUzivatel.avatar_url}
                alt=""
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
              />
            ) : (
              <span className="material-icons text-gray-400 text-5xl">
                account_circle
              </span>
            )}
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Přihlášený uživatel
              </span>
              <span className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                {aktivniUzivatel.name}
              </span>
            </div>
          </Link>
          <Link
            to="/events/new"
            className="h-12 px-6 bg-[#3b52f6] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 gap-2 font-bold text-sm"
          >
            <span className="material-icons text-xl">add</span>
            <span className="hidden sm:inline">Nová událost</span>
          </Link>
        </header>

        {/* tlacitka co delaj to preklikavani v menu - na velkym displayi se hezky zarovnaj */}
        <nav className="px-6 lg:px-10 py-4 flex gap-3 overflow-x-auto flex-nowrap md:flex-wrap bg-white shadow-sm border-b border-gray-100">
          {filtry.map((f) => {
            const jeAktivni = vybranyPredmet === f;
            const predmetObj = predmety.find((p) => p.shortcut === f);
            const ikona = predmetObj ? ziskejIkonu(predmetObj.icon_url) : null;

            return (
              <button
                key={f}
                onClick={() => setVybranyPredmet(f)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all whitespace-nowrap cursor-pointer ${
                  jeAktivni
                    ? "bg-[#3b52f6] border-[#3b52f6] text-white shadow-md shadow-blue-600/20"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {ikona && (
                  <span className="material-icons text-base">{ikona}</span>
                )}
                {f}
              </button>
            );
          })}
        </nav>

        {/* OPRAVDOVA RESPONZIVITA - grid co se prepina na 1, 2 nebo 3 sloupce podle velikosti */}
        <article className="flex-1 p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 content-start overflow-y-auto">
          {vyfiltrovaneUdalosti.map((u) => {
            const jeTest = u.is_test === 1 || u.is_test === "1";
            const predmetObj = predmety.find(
              (p) => p.shortcut === u.subject_shortcut,
            );
            const ikonaPredmetu = predmetObj
              ? ziskejIkonu(predmetObj.icon_url)
              : "assignment";

            return (
              <Link
                to={`/events/${u.id}`}
                key={u.id}
                className="relative bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* ukazuje cervenej prouzek kdys je to test */}
                {jeTest && (
                  <aside className="absolute left-0 top-0 bottom-0 w-3 bg-[#f3534d]"></aside>
                )}

                <section className="w-28 flex flex-col items-center justify-center border-r border-gray-50 p-4 bg-gray-50/50 text-center select-none">
                  <span className="text-[11px] font-bold text-gray-400 mb-2">
                    {u.event_date || "—"}
                  </span>
                  <span className="material-icons text-gray-700 text-3xl mb-2">
                    {ikonaPredmetu}
                  </span>
                  <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                    {u.subject_shortcut}
                  </span>
                </section>

                <section className="flex-1 p-5 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-[#3b52f6] transition-colors line-clamp-1">
                    {u.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium line-clamp-3 leading-relaxed">
                    {u.description}
                  </p>
                </section>
              </Link>
            );
          })}

          {vyfiltrovaneUdalosti.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <span className="material-icons text-gray-300 text-6xl mb-3">
                inbox
              </span>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                Žádné události
              </p>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
