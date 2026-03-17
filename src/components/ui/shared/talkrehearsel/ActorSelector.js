import { User, ArrowLeft, History } from "lucide-react";

export default function ActorSelector({ actors, onSelect, onBack, onBackToRecordings }) {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Choose Your Role
        </h2>
        <p className="text-slate-500 font-medium tracking-wide">
          Select which character you want to represent in this rehearsal.
        </p>
      </div>

      {/* Actor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {actors.map((actor) => (
          <button
            key={actor.id}
            onClick={() => onSelect(actor)}
            className="
              group relative flex flex-col items-center gap-6
              rounded-[3rem] p-12 text-center
              bg-white border border-slate-200
              shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 
              hover:-translate-y-2 transition-all duration-500
            "
          >
            {/* Avatar with dynamic glow */}
            <div className="
              w-24 h-24 rounded-full
              bg-slate-50 text-slate-400
              flex items-center justify-center
              group-hover:bg-indigo-600 group-hover:text-white
              transition-all duration-500 shadow-inner ring-8 ring-slate-50 group-hover:ring-indigo-50
            ">
              <User size={40} strokeWidth={2.5} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {actor.name}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 opacity-80">
                Practice This Role
              </p>
            </div>

            <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-slate-100 group-hover:bg-indigo-500 transition-colors" />
          </button>
        ))}
      </div>

      {/* Multi-Action Footer */}
      <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            Back to Mode
          </button>

          <button
            onClick={onBackToRecordings}
            className="flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-all"
          >
            <History className="w-4 h-4" strokeWidth={3} />
            Previous Recordings
          </button>
        </div>
      </div>
    </div>
  );
}
