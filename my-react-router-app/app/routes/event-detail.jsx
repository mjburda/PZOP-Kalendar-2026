import { Form, redirect, useLoaderData, useNavigate } from "react-router";
import { sql } from "../sql";
import { User } from "../components/User";

export async function loader({ params }) {
  const res = await sql(`SELECT * FROM pzop_event WHERE id = ${params.id}`);
  return { ud: res[0] };
}

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
    <main className="p-6 bg-white min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <User />
        <button onClick={() => navigate("/")} className="text-gray-400 font-bold">Zavřít</button>
      </header>
      
      <h2 className="text-xl font-bold text-center mb-10 text-gray-800 uppercase">Upravit událost</h2>

      <Form method="post" className="space-y-8">
        <div className="border-b border-gray-200 pb-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase block">Název</label>
          <input name="title" defaultValue={data.ud.title} required className="w-full outline-none text-lg font-medium text-gray-700 bg-transparent" />
        </div>

        <div className="border-b border-gray-200 pb-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase block">Datum</label>
          <input type="date" name="date" defaultValue={data.ud.event_date} required className="w-full outline-none text-gray-700 bg-transparent" />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-3">Popis</label>
          <textarea name="description" defaultValue={data.ud.description} className="w-full bg-gray-50 rounded-2xl p-4 outline-none h-32 text-gray-600 resize-none" />
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-400 font-medium">Plánovaný test</span>
          <input type="checkbox" name="is_test" defaultChecked={data.ud.is_test == 1} className="w-6 h-6 accent-blue-600" />
        </div>

        <div className="space-y-4 pt-6">
          <button type="submit" name="intent" value="ulozit" className="w-full bg-blue-600 text-white py-4 rounded-full font-bold shadow-lg">
            Uložit změny
          </button>
          <button type="submit" name="intent" value="smazat" className="w-full bg-red-500 text-white py-4 rounded-full font-bold shadow-lg">
            Smazat událost
          </button>
        </div>
      </Form>
    </main>
  );
}