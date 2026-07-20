import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { motion } from 'motion/react';
import {
  Brain, Dna, Leaf, CreditCard, Sparkles, Sprout, ShieldAlert, GraduationCap,
  ArrowRight, Users, Rocket, Network, Milestone, Landmark, PlayCircle, Eye
} from 'lucide-react';
import { SECTORS, TRENDING_MISSIONS, TIMELINE_STEPS, IMAGES } from '../../constants/data.js';
import './Landing.css';

const iconMap = {
  Brain: <Brain className="w-6 h-6 text-indigo-600" />,
  Dna: <Dna className="w-6 h-6 text-emerald-600" />,
  Leaf: <Leaf className="w-6 h-6 text-teal-600" />,
  CreditCard: <CreditCard className="w-6 h-6 text-cyan-600" />,
  Sparkles: <Sparkles className="w-6 h-6 text-amber-600" />,
  Sprout: <Sprout className="w-6 h-6 text-lime-600" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-rose-600" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-violet-600" />
};

export default function Landing() {
  const { currentUser } = useApp();

  // Simple staggered animation configs
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-linear-to-b from-gray-50/50 via-white to-gray-50/30">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-800 border border-gray-200/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Syndicated Co-founder Matching Engine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
            >
              Collaborate with <span className="bg-linear-to-r from-gray-900 via-indigo-900 to-black bg-clip-text text-transparent">Visionaries</span> to Build the Future.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-500 max-w-xl leading-relaxed"
            >
              The unified sandbox where deep-tech founders post open ledgers, modular technical stacks, and seed equity allocations to match directly with vetted co-builders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/browse"
                className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-3.5 rounded-full shadow-md hover:shadow-lg flex items-center gap-2 group transition-all duration-200"
              >
                Explore Ventures
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!currentUser && (
                <Link
                  to="/register"
                  className="bg-white border border-gray-200 hover:border-black font-semibold text-gray-700 hover:text-black px-6 py-3.5 rounded-full transition-colors flex items-center gap-2"
                >
                  Join the Syndicate
                </Link>
              )}
            </motion.div>
          </div>

          {/* Hero image/mockup */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 80, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-md lg:max-w-none mx-auto bg-white p-2 group"
            >
              <img
                src={IMAGES.landingHero}
                alt="StartupConnect workspace"
                referrerPolicy="no-referrer"
                className="rounded-2xl object-cover w-full aspect-4/3 shadow-inner group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-2xl" />
            </motion.div>

            {/* Float badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white border border-gray-100 p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3"
            >
              <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-gray-400 font-semibold uppercase tracking-wider">Matched Founders</p>
                <p className="text-lg font-bold text-gray-900">1,248 Specialists</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-6 -right-6 bg-white border border-gray-100 p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3"
            >
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-gray-400 font-semibold uppercase tracking-wider">Active Ventures</p>
                <p className="text-lg font-bold text-gray-900">410 Live Leads</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-gray-100/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">14,200+</p>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Collaborators Registered</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">420M+</p>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Venture Funding Logged</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">89%</p>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Match Satisfaction Index</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">550+</p>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Successful Team Handshakes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">The Domains</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            Core Technological Sectors
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            We curate verified syndicates across high-impact fields requiring highly specific technical and product capabilities.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {SECTORS.map((sector) => (
            <motion.div
              key={sector.id}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}
              className="bg-white border border-gray-100 p-6 rounded-2xl text-left transition-all group cursor-pointer"
            >
              <div className="mb-4 bg-gray-50 p-3 rounded-xl inline-block group-hover:bg-gray-100/80 transition-colors">
                {iconMap[sector.icon] || <Brain className="w-6 h-6" />}
              </div>
              <h4 className="font-bold text-gray-900 text-base group-hover:text-black transition-colors">
                {sector.name}
              </h4>
              <p className="text-xs text-gray-400 font-mono font-medium mt-1">Explore listings &rarr;</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trending Missions */}
      <section className="bg-gray-50/60 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div className="space-y-4 text-left">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">Dynamic Progress</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Trending Missions</h2>
              <p className="text-gray-500 max-w-md text-sm leading-relaxed">
                Founders leading these high-momentum concepts are actively evaluating profile applications and scheduling mutual interviews.
              </p>
            </div>
            <Link
              to="/browse"
              className="font-semibold text-sm bg-white hover:bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-full transition-colors flex items-center gap-1"
            >
              All Open Ventures
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRENDING_MISSIONS.map((mission) => (
              <motion.div
                key={mission.id}
                whileHover={{ y: -6 }}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={mission.image}
                      alt={mission.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {mission.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3 text-left">
                    <h4 className="font-extrabold text-gray-900 text-lg leading-snug">{mission.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {mission.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-4">
                  {/* Dynamic funding representation */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium">Activity Score</span>
                      <span className="font-bold text-gray-900 font-mono">92% High</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-black h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-4 text-xs">
                    <div>
                      <p className="text-gray-400">Applications</p>
                      <p className="font-bold text-gray-900 font-mono">{mission.backers} submitted</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Target equity pool</p>
                      <p className="font-bold text-gray-900 font-mono text-right">{mission.goal}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Timeline / Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">Syndicate Workflow</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            How StartupConnect Coordinates
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            A frictionless handshake cycle designed to eliminate standard hiring delays and bring core developers and product owners together.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-[60px] left-[5%] right-[5%] h-0.5 bg-gray-100 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {TIMELINE_STEPS.map((step, idx) => (
              <div key={idx} className="text-left space-y-4 group">
                <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
                  <div className="relative z-10 w-14 h-14 bg-white border-2 border-black rounded-full flex items-center justify-center font-extrabold text-lg text-black group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-md">
                    {step.step}
                  </div>
                  <div className="h-[2px] bg-indigo-100 flex-1 hidden md:block lg:hidden" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-gray-900 text-base">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beautiful High Contrast CTA Block */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-black text-white rounded-[2.5rem] p-8 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          {/* Abstract visual backgrounds */}
          <div className="absolute inset-0 bg-radial-gradient from-indigo-950/40 via-transparent to-transparent pointer-events-none opacity-60" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Ready to build?</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Begin Orchestrating Your Co-founding Team Today.
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Ditch cold LinkedIn reach-outs. Connect with innovators who have already laid out their engineering schemas, funding pipelines, and equity plans.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/browse"
                className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-3.5 rounded-full shadow-md transition-colors"
              >
                Browse All Ventures
              </Link>
              {!currentUser && (
                <Link
                  to="/register"
                  className="bg-transparent border border-white/30 hover:border-white font-semibold text-white px-6 py-3.5 rounded-full transition-colors"
                >
                  Create Your Identity
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
