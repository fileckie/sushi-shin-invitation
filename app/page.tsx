'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen texture-washi">
      {/* Navigation - 极简日式 */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-8 md:px-16 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display-jp text-xl text-[#1A1A1A] tracking-[0.3em]">鮨心</span>
            <span className="text-[10px] text-[#8A8680] tracking-[0.2em] mt-1">SUSHI SHIN</span>
          </div>
          <Link 
            href="/admin" 
            className="text-xs tracking-[0.2em] text-[#4A4A4A] hover:text-[#C73E3A] transition-colors border-b border-transparent hover:border-[#C73E3A] pb-1"
          >
            おもてなし
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center px-8 md:px-16 pt-24">
        <div className="max-w-6xl w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <p className="text-xs tracking-[0.4em] text-[#8A8680] animate-fade-jp">
                一期一会 · 鮨の心得
              </p>
              
              <div className="space-y-6">
                <h1 className="font-display-jp text-5xl md:text-6xl lg:text-7xl text-[#1A1A1A] leading-[1.3] tracking-[0.15em] animate-fade-jp" style={{ animationDelay: '0.2s' }}>
                  一期一会
                </h1>
                <p className="font-serif-jp text-xl text-[#4A4A4A] tracking-[0.1em] animate-fade-jp" style={{ animationDelay: '0.4s' }}>
                  每一场宴请，都是独一无二的相遇
                </p>
              </div>
              
              <div className="divider-horizontal animate-fade-jp" style={{ animationDelay: '0.6s' }}></div>
              
              <p className="text-sm text-[#4A4A4A] leading-[2.2] max-w-md tracking-wide animate-fade-jp" style={{ animationDelay: '0.8s' }}>
                专为鮨心打造的高端私宴邀请函系统。<br/>
                以江户前寿司的传统精神，<br/>
                呈现每一场 bespoke omakase 的独特心意。
              </p>
              
              <div className="flex items-center gap-8 pt-4 animate-fade-jp" style={{ animationDelay: '1s' }}>
                <Link href="/admin" className="btn-jp">
                  <span>ご予約作成</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/admin/list" className="text-xs tracking-[0.2em] text-[#8A8680] hover:text-[#1A1A1A] transition-colors">
                  一覧を見る
                </Link>
              </div>
            </div>
            
            <div className="hidden md:flex justify-end items-center h-full">
              <div className="writing-vertical font-display-jp text-6xl lg:text-7xl text-[#1A1A1A]/5 tracking-[0.3em] h-[500px]">
                鮨心 · 一期一会
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 品牌介绍 */}
      <section className="py-32 px-8 md:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-xs tracking-[0.4em] text-[#C73E3A] mb-4">ABOUT</p>
              <h2 className="font-display-jp text-3xl text-[#1A1A1A] tracking-[0.2em] leading-relaxed">
                鮨の精神
              </h2>
              <div className="w-8 h-px bg-[#C73E3A] mt-8"></div>
            </div>
            
            <div className="md:col-span-8 space-y-8">
              <p className="text-[#4A4A4A] leading-[2.2] tracking-wide">
                鮨心（すししん）坐落于银座核心地带，是一家传承江户前寿司精髓的高端寿司店。
                店主曾修业于银座久兵卫，以超过二十年的握寿司经验，
                追求每一贯寿司的舍利、种、わさび、醤油之间的完美统一。
              </p>
              <p className="text-[#4A4A4A] leading-[2.2] tracking-wide">
                店名「心」取自「寿司の心」——不仅是食材与技艺的呈现，
                更是待客之心的传达。在仅有八个座位的吧台前，
                每一道料理都是为客人量身定制的独一无二的体验。
              </p>
              <div className="pt-8 border-t border-[#D8D4CC]">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="font-display-jp text-3xl text-[#1A1A1A] mb-2">8</p>
                    <p className="text-xs tracking-[0.2em] text-[#8A8680]">座席</p>
                  </div>
                  <div>
                    <p className="font-display-jp text-3xl text-[#1A1A1A] mb-2">20+</p>
                    <p className="text-xs tracking-[0.2em] text-[#8A8680]">年修业</p>
                  </div>
                  <div>
                    <p className="font-display-jp text-3xl text-[#C73E3A] mb-2">★</p>
                    <p className="text-xs tracking-[0.2em] text-[#8A8680]">米其林</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能介绍 */}
      <section className="py-32 px-8 md:px-16 texture-washi">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] text-[#8A8680] mb-4">SERVICE</p>
            <h2 className="font-display-jp text-3xl text-[#1A1A1A] tracking-[0.2em]">ご招待の心得</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-px bg-[#D8D4CC]">
            {[
              {
                num: '壱',
                title: '招待状作成',
                desc: 'お客様のご都合に合わせた、心尽くしの招待状を作成。鮨心の世界観を反映したデザインで、特別な一日の始まりを演出します。'
              },
              {
                num: '弐',
                title: '二重のおもてなし',
                desc: 'お客様向けの「お品書き」と、担当者向けの「仕込み帖」を自動生成。それぞれの目的に応じた情報を適切に提供します。'
              },
              {
                num: '参',
                title: '一期一会の記録',
                desc: 'すべてのご招待を記録し、お客様の好みやアレルギー情報を管理。次回のご来店に活かし、より良いおもてなしを実現します。'
              }
            ].map((item, index) => (
              <div key={index} className="bg-[#F7F5F0] p-12 group hover:bg-white transition-colors duration-500">
                <span className="font-display-jp text-4xl text-[#D8D4CC] group-hover:text-[#C73E3A] transition-colors duration-500">
                  {item.num}
                </span>
                <h3 className="font-display-jp text-xl text-[#1A1A1A] mt-8 mb-6 tracking-[0.15em]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-[2] tracking-wide">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 md:px-16 texture-washi">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] text-[#8A8680] mb-6">RESERVATION</p>
          <h2 className="font-display-jp text-3xl md:text-4xl text-[#1A1A1A] tracking-[0.15em] mb-8">
            ご招待状の作成
          </h2>
          <p className="text-[#4A4A4A] leading-[2.2] mb-12 tracking-wide">
            お客様の特別な一日に、<br/>
            心尽くしのおもてなしを。
          </p>
          <Link href="/admin" className="btn-jp inline-flex">
            <span>作成を始める</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 md:px-16 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="font-display-jp text-2xl text-white tracking-[0.3em]">鮨心</span>
              <p className="text-xs text-white/40 tracking-[0.2em] mt-2">SUSHI SHIN · 銀座</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-white/40 tracking-wider">
                東京都中央区銀座7-8-7
              </p>
              <p className="text-xs text-white/40 tracking-wider mt-1">
                完全予約制 · 紹介制
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-[10px] text-white/30 tracking-[0.2em]">
              一期一会 · 鮨心
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
