'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Loader2, CheckCircle, ArrowRight, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface Dish {
  name: string
  description?: string
  isSignature?: boolean
}

const DEFAULT_DATA = {
  restaurantName: '鮨心',
  restaurantAddress: '東京都中央区銀座7-8-7',
  restaurantPhone: '03-1234-5678',
  restaurantDesc: '銀座の高級寿司店。江戸前寿司の伝統を守りながら、現代の感性でおもてなしをいたします。',
  chefName: '斎藤 孝司',
  chefTitle: '板前',
  title: '',
  date: '',
  time: '18:00',
  guestCount: '4',
  roomName: 'カウンター',
  hostName: '',
  hostPhone: '',
  notes: '',
}

const DEFAULT_MENU: Dish[] = [
  { name: '先付', description: '季節の一品', isSignature: false },
  { name: 'お造り', description: '本日の鮮魚三種', isSignature: true },
  { name: '蒸し物', description: '茶碗蒸し', isSignature: false },
  { name: '焼き物', description: '鰤の幽庵焼き', isSignature: false },
  { name: '鮨', description: '握り十二貫', isSignature: true },
  { name: '巻物', description: 'トロたく', isSignature: false },
  { name: '椀物', description: '赤だし', isSignature: false },
  { name: '甘味', description: '自家製玉子焼き', isSignature: true },
]

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    invitationId: string
    invitationUrl: string
    printUrl: string
  } | null>(null)
  const [showQR, setShowQR] = useState(false)

  const [formData, setFormData] = useState({ ...DEFAULT_DATA })
  const [dishes, setDishes] = useState<Dish[]>([...DEFAULT_MENU])

  const loadDefaultData = () => {
    setFormData({ ...DEFAULT_DATA })
    setDishes([...DEFAULT_MENU])
  }

  const addDish = () => {
    setDishes([...dishes, { name: '', description: '', isSignature: false }])
  }

  const removeDish = (index: number) => {
    if (dishes.length > 1) {
      setDishes(dishes.filter((_, i) => i !== index))
    }
  }

  const updateDish = (index: number, field: keyof Dish, value: string | boolean) => {
    const newDishes = [...dishes]
    newDishes[index] = { ...newDishes[index], [field]: value }
    setDishes(newDishes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validDishes = dishes.filter(d => d.name.trim())
      
      const response = await fetch('/api/banquet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          menu: validDishes
        })
      })

      if (!response.ok) throw new Error('创建失败')

      const data = await response.json()
      setResult({
        invitationId: data.id,
        invitationUrl: `${window.location.origin}/invitation/${data.id}`,
        printUrl: `${window.location.origin}/print/${data.id}`
      })
    } catch (error) {
      alert('作成に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  // 成功页面
  if (result) {
    return (
      <div className="min-h-screen texture-washi py-20 px-8">
        <div className="max-w-2xl mx-auto">
          {/* 成功图标 */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 border border-[#C73E3A] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#C73E3A]" />
            </div>
            <h2 className="font-display-jp text-3xl text-[#1A1A1A] mb-3 tracking-wider">ご招待状が作成されました</h2>
            <p className="text-[#8A8680] text-sm tracking-wide">以下の方法でお客様にお知らせください</p>
          </div>

          <div className="space-y-8">
            {/* 操作按钮 */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href={result.invitationUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2D2D2D] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                招待状を見る
              </Link>
              <Link
                href={result.printUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 px-6 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-sm tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                印刷用データ
              </Link>
            </div>

            {/* 二维码 */}
            <div className="bg-white p-8 border border-[#D8D4CC]">
              <div className="text-center">
                <p className="text-xs tracking-[0.2em] text-[#8A8680] mb-6">QRコードをスキャンして招待状を表示</p>
                <div className="inline-block p-6 bg-[#F7F5F0]">
                  <QRCodeSVG 
                    value={result.invitationUrl}
                    size={180}
                    level="M"
                    bgColor="#F7F5F0"
                    fgColor="#1A1A1A"
                  />
                </div>
              </div>
            </div>

            {/* 链接 */}
            <div className="bg-[#F5F0E8] p-6">
              <p className="text-xs tracking-[0.2em] text-[#8A8680] mb-3">招待状URL</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={result.invitationUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border border-[#D8D4CC] text-sm text-[#4A4A4A]"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.invitationUrl)
                    alert('コピーしました')
                  }}
                  className="px-6 py-3 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2D2D2D] transition-colors"
                >
                  コピー
                </button>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="flex justify-center gap-8 pt-6">
              <button
                onClick={() => {
                  setResult(null)
                  setFormData({ ...DEFAULT_DATA })
                  setDishes([...DEFAULT_MENU])
                }}
                className="text-sm text-[#4A4A4A] hover:text-[#C73E3A] transition-colors border-b border-transparent hover:border-[#C73E3A] pb-1"
              >
                新しい招待状を作成
              </button>
              <Link
                href="/admin/list"
                className="text-sm text-[#4A4A4A] hover:text-[#C73E3A] transition-colors border-b border-transparent hover:border-[#C73E3A] pb-1"
              >
                一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen texture-washi">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#D8D4CC]">
        <div className="max-w-5xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#8A8680] hover:text-[#1A1A1A] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-display-jp text-sm tracking-[0.15em] text-[#1A1A1A]">ご招待状作成</span>
          </div>
          <button
            onClick={loadDefaultData}
            className="text-xs tracking-wider text-[#C73E3A] hover:text-[#A52A2A] transition-colors"
          >
            鮨心データを読み込む
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-20">
        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Section 1: ご予約情報 */}
          <section>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="font-display-jp text-5xl text-[#D8D4CC]">壱</span>
              <h2 className="font-display-jp text-xl text-[#1A1A1A] tracking-wider">ご予約情報</h2>
            </div>
            
            <div className="space-y-8 pl-12">
              <div>
                <label className="block text-xs tracking-[0.2em] text-[#8A8680] mb-3">お客様名 / ご宴会名 *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-jp"
                  placeholder="例：田中様ご一行"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8680] mb-3">ご来店日 *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="input-jp"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8680] mb-3">ご来店時間 *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="input-jp"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8680] mb-3">席の種類 *</label>
                  <input
                    type="text"
                    required
                    value={formData.roomName}
                    onChange={(e) => setFormData({...formData, roomName: e.target.value})}
                    className="input-jp"
                    placeholder="カウンター"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8680] mb-3">ご人数 *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="8"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                    className="input-jp"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8680] mb-3">ご予約者様お名前 *</label>
                  <input
                    type="text"
                    required
                    value={formData.hostName}
                    onChange={(e) => setFormData({...formData, hostName: e.target.value})}
                    className="input-jp"
                    placeholder="田中 太郎"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] text-[#8A8680] mb-3">ご連絡先 *</label>
                  <input
                    type="tel"
                    required
                    value={formData.hostPhone}
                    onChange={(e) => setFormData({...formData, hostPhone: e.target.value})}
                    className="input-jp"
                    placeholder="03-1234-5678"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs tracking-[0.2em] text-[#8A8680] mb-3">スタッフ用メモ</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-jp resize-none"
                  placeholder="アレルギー、好みなど"
                />
              </div>
            </div>
          </section>

          {/* Section 2: お品書き */}
          <section>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="font-display-jp text-5xl text-[#D8D4CC]">弐</span>
              <h2 className="font-display-jp text-xl text-[#1A1A1A] tracking-wider">お品書き</h2>
            </div>
            
            <div className="pl-12 space-y-6">
              {dishes.map((dish, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <span className="text-[#C73E3A] font-display-jp text-lg w-8">{index + 1}</span>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={dish.name}
                      onChange={(e) => updateDish(index, 'name', e.target.value)}
                      className="input-jp"
                      placeholder="品名"
                    />
                    <input
                      type="text"
                      value={dish.description}
                      onChange={(e) => updateDish(index, 'description', e.target.value)}
                      className="input-jp text-sm"
                      placeholder="説明"
                    />
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dish.isSignature}
                          onChange={(e) => updateDish(index, 'isSignature', e.target.checked)}
                          className="w-4 h-4 border border-[#C73E3A] accent-[#C73E3A]"
                        />
                        <span className="text-xs text-[#8A8680]">おすすめ</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeDish(index)}
                        className="ml-auto text-[#C5C5C5] hover:text-[#C73E3A] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addDish}
                className="flex items-center gap-2 text-sm text-[#8A8680] hover:text-[#C73E3A] transition-colors pt-4"
              >
                <Plus className="w-4 h-4" />
                お品を追加
              </button>
            </div>
          </section>

          {/* Section 3: 店舗情報 */}
          <section>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="font-display-jp text-5xl text-[#D8D4CC]">参</span>
              <h2 className="font-display-jp text-xl text-[#1A1A1A] tracking-wider">店舗情報</h2>
            </div>
            
            <div className="pl-12 py-8 bg-[#F5F0E8]">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8A8680]">店名</span>
                  <span className="text-[#1A1A1A] font-display-jp">{formData.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8680]">住所</span>
                  <span className="text-[#1A1A1A] text-right max-w-xs">{formData.restaurantAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8680]">電話</span>
                  <span className="text-[#1A1A1A]">{formData.restaurantPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8680]">板前</span>
                  <span className="text-[#1A1A1A]">{formData.chefName}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="pl-12 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-[#1A1A1A] text-white text-sm tracking-[0.2em] hover:bg-[#2D2D2D] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  作成中...
                </>
              ) : (
                <>
                  <span>ご招待状を作成する</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
