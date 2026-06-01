import { Form, redirect, useLoaderData, Link } from "react-router";
import { sql } from "../sql";

export async function loader() {
  // Ověříme, že je někdo přihlášen, než vůbec dovolíme vytvořit předmět
  const resAktivni = await sql("SELECT * FROM pzop_user WHERE is_active = 1 LIMIT 1");
  if (!resAktivni[0]) {
    // Pokud nikdo není aktivní, hodíme ho na profil, ať si vybere účet
    return redirect("/profile");
  }
  return { aktivniUzivatel: resAktivni[0] };
}

export async function action({ request }) {
  const f = await request.formData();
  const titulek = f.get("title");
  const popis = f.get("description");

  // 1. Zjistíme ID aktivního uživatele přímo v akci před zápisem
  const resAktivni = await sql("SELECT id FROM pzop_user WHERE is_active = 1 LIMIT 1");
  const aktivniId = resAktivni[0]?.id;

  if (titulek && aktivniId) {
    // 2. Vložíme předmět do DB společně s user_id!
    await sql(`INSERT INTO pzop_event (title, description, user_id) VALUES ('${titulek}', '${popis}', ${aktivniId})`);
  }

  return redirect("/");
}

export default function NewEvent() {
  const { aktivniUzivatel } = useLoaderData();

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col gap-6">
        
        <header className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Nový předmět</h1>
            <p className="text-xs text-gray-500">Vytváříš položku pro: <span className="font-semibold text-blue-600">{aktivniUzivatel?.name}</span></p>
          </div>
          <Link to="/" className="text-gray-400 hover:text-gray-600"><span className="material-icons">close</span></Link>
        </header>

        <Form method="post" className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Název předmětu</label>
            <input name="title" required placeholder="Např. Matematika, Nákupní seznam..." className="w-full bg-transparent outline-none text-sm font-medium text-gray-800" />
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Popis / detaily</label>
            <textarea name="description" rows="3" placeholder="Více informací..." className="w-full bg-transparent outline-none text-sm text-gray-700 resize-none" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer">
            Uložit předmět
          </button>
        </Form>
      </div>
    </main>
  );
}