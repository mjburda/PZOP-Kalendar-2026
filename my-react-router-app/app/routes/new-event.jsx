import { Form, redirect, useLoaderData, Link } from "react-router";
import { sql } from "../sql";

export async function loader() {
  const resAktivni = await sql(
    "SELECT * FROM pzop_user WHERE is_active = 1 LIMIT 1",
  );
  if (!resAktivni[0]) return redirect("/profile");

  // tahame predmety at je z ceho vybirat v tom selectu
  const predmety = await sql("SELECT * FROM pzop_subject");
  return { aktivniUzivatel: resAktivni[0], predmety: predmety || [] };
}

export async function action({ request }) {
  // stahnuti dat co poslal formular na webu
  const f = await request.formData();
  const title = f.get("title");
  const event_date = f.get("event_date");
  const subject_shortcut = f.get("subject_shortcut");
  const description = f.get("description");
  const is_test = f.get("is_test") === "on" ? 1 : 0;

  // zjistujeme kdo zrovna prihlaseny aby sme to ulozili jemu
  const resAktivni = await sql(
    "SELECT id FROM pzop_user WHERE is_active = 1 LIMIT 1",
  );
  const aktivniId = resAktivni[0]?.id;

  if (title && aktivniId) {
    // ulozeni dat zpet do sql db
    await sql(`
      INSERT INTO pzop_event (title, event_date, subject_shortcut, description, is_test, user_id) 
      VALUES ('${title}', '${event_date}', '${subject_shortcut}', '${description}', ${is_test}, ${aktivniId})
    `);
  }
  return redirect("/");
}

export default function NewEvent() {
  const { predmety } = useLoaderData();

  return (
    <main className="min-h-screen bg-[#e9ebf2] p-0 md:p-6 lg:p-8 font-sans antialiased text-gray-800 flex items-center justify-center">
      <section className="w-full max-w-3xl bg-[#f4f5f9] min-h-screen md:min-h-fit md:rounded-[2.5rem] md:shadow-2xl border-gray-200/50 md:border p-6 md:p-10 flex flex-col justify-center">
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col">
          <header className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
            <h2 className="font-bold text-gray-800 text-xl">Nová událost</h2>
            <Link
              to="/"
              className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center"
            >
              <span className="material-icons">close</span>
            </Link>
          </header>

          {/* Mrizka - na pocitaci sou texty vedle sebe ve 2 sloupcich, na mobilu 1 */}
          <Form
            method="post"
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          >
            <label className="flex flex-col gap-2 border-b border-gray-200 pb-2 focus-within:border-blue-500 cursor-text group">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors">
                Název úkolu
              </span>
              <input
                name="title"
                required
                className="w-full bg-transparent outline-none text-sm font-medium text-gray-800"
                placeholder="Např. Projekt z fyziky"
              />
            </label>

            <label className="flex flex-col gap-2 border-b border-gray-200 pb-2 focus-within:border-blue-500 cursor-text group">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors">
                Datum
              </span>
              <input
                type="date"
                name="event_date"
                required
                className="w-full bg-transparent outline-none text-sm font-medium text-gray-800"
              />
            </label>

            <label className="flex flex-col gap-2 border-b border-gray-200 pb-2 focus-within:border-blue-500 cursor-pointer group md:col-span-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors">
                Předmět
              </span>
              <select
                name="subject_shortcut"
                required
                className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 cursor-pointer"
              >
                {predmety.map((p) => (
                  <option key={p.shortcut} value={p.shortcut}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 border-b border-gray-200 pb-2 focus-within:border-blue-500 cursor-text group md:col-span-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors">
                Popis zadání
              </span>
              <textarea
                name="description"
                rows="4"
                className="w-full bg-transparent outline-none text-sm font-medium text-gray-800 resize-none"
                placeholder="Co se musí udělat..."
              />
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl select-none cursor-pointer md:col-span-2 border border-transparent hover:border-gray-200 transition-all">
              <input
                type="checkbox"
                name="is_test"
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700">
                Tato událost je zkouška / test
              </span>
            </label>

            <footer className="pt-6 flex justify-end gap-4 md:col-span-2">
              <Link
                to="/"
                className="text-sm font-bold text-gray-500 px-6 py-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                Zrušit
              </Link>
              <button
                type="submit"
                className="bg-[#3b52f6] text-white px-8 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <span className="material-icons text-lg">add</span> Vytvořit
              </button>
            </footer>
          </Form>
        </article>
      </section>
    </main>
  );
}
