import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CompactMinimalBanners() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Banner 1 */}
        <div className="bg-[#fcfcfc] border border-stone-200/60 rounded-lg p-5 relative overflow-hidden group h-[160px] flex flex-col justify-between transition-all duration-300 hover:border-stone-400">
          <div className="relative z-10 max-w-[65%]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
              Limited Offer
            </span>
            <h3 className="text-[16px] font-bold text-stone-800 leading-snug tracking-tight mb-1">
              Quality eggs at an affordable price
            </h3>
            <p className="text-[11px] text-stone-400 font-normal">Eat one every day</p>
          </div>

          <div className="relative z-10">
            <Link href="#" className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 group/btn border-b border-stone-800 pb-0.5">
              Shop Now
              <ArrowRight size={12} className="transform group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <img
            src="https://placehold.co/400x400/transparent/94a3b8?text=Eggs"
            className="absolute -right-6 -bottom-8 w-[140px] h-[140px] object-contain opacity-25 grayscale group-hover:scale-105 transition-transform duration-500"
            alt="Eggs"
          />
        </div>

        {/* Banner 2 */}
        <div className="bg-[#fcfcfc] border border-stone-200/60 rounded-lg p-5 relative overflow-hidden group h-[160px] flex flex-col justify-between transition-all duration-300 hover:border-stone-400">
          <div className="relative z-10 max-w-[65%]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
              Limited Offer
            </span>
            <h3 className="text-[16px] font-bold text-stone-800 leading-snug tracking-tight mb-1">
              Snacks that nourishes mind & body
            </h3>
            <p className="text-[11px] text-stone-400 font-normal">Shine the morning...</p>
          </div>

          <div className="relative z-10">
            <Link href="#" className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 group/btn border-b border-stone-800 pb-0.5">
              Shop Now
              <ArrowRight size={12} className="transform group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <img
            src="https://placehold.co/400x400/transparent/94a3b8?text=Limes"
            className="absolute -right-6 -bottom-8 w-[140px] h-[140px] object-contain opacity-25 grayscale group-hover:scale-105 transition-transform duration-500"
            alt="Limes"
          />
        </div>

        {/* Banner 3 */}
        <div className="bg-[#fcfcfc] border border-stone-200/60 rounded-lg p-5 relative overflow-hidden group h-[160px] flex flex-col justify-between transition-all duration-300 hover:border-stone-400">
          <div className="relative z-10 max-w-[65%]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
              Limited Offer
            </span>
            <h3 className="text-[16px] font-bold text-stone-800 leading-snug tracking-tight mb-1">
              Unbeatable quality & prices
            </h3>
            <p className="text-[11px] text-stone-400 font-normal">Don't miss out...</p>
          </div>

          <div className="relative z-10">
            <Link href="#" className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 group/btn border-b border-stone-800 pb-0.5">
              Shop Now
              <ArrowRight size={12} className="transform group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <img
            src="https://placehold.co/400x400/transparent/94a3b8?text=Snacks"
            className="absolute -right-6 -bottom-8 w-[140px] h-[140px] object-contain opacity-25 grayscale group-hover:scale-105 transition-transform duration-500"
            alt="Snacks"
          />
        </div>

      </div>
    </section>
  );
}