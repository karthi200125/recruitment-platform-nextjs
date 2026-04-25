'use client';

import Link from 'next/link';
import { Sparkles, TrendingUp, Eye, Star, ArrowRight } from 'lucide-react';

const PERKS = [
    { icon: Eye, text: "See who viewed your profile" },
    { icon: TrendingUp, text: "Know where you rank as an applicant" },
    { icon: Star, text: "Stand out with a Premium badge" },
];

const JobPremium = () => {
    return (
        <div className="w-full rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">

            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-400" />

            <div className="p-5 space-y-4">

                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-0.5">Unlock Premium</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Get exclusive tools to move faster and stand out from other applicants.
                        </p>
                    </div>
                </div>

                {/* Perk list */}
                <ul className="space-y-2">
                    {PERKS.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2.5 text-xs text-slate-600">
                            <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3 h-3 text-amber-600" strokeWidth={2} />
                            </div>
                            {text}
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <Link
                    href="/subscription"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-sm shadow-amber-200"
                >
                    <Sparkles className="w-4 h-4" strokeWidth={2} />
                    Activate Premium
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </Link>

                <p className="text-center text-[11px] text-slate-400">Cancel anytime, for any reason.</p>
            </div>
        </div>
    );
};

export default JobPremium;