'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Printer, ArrowLeft, Eye, Download } from 'lucide-react'
import Link from 'next/link'
import { toPng } from 'html-to-image'

interface Dish {
  name: string
  description?: string
  isSignature?: boolean
}

interface BanquetData {
  id: string
  title: string
  date: string
  time: string
  guestCount: number
  roomName: string
  hostName: string
  hostPhone: string
  notes?: string
  menu: Dish[]
  restaurant: {
    name: string
    address: string
    phone: string
    chefName?: string
    chefTitle?: string
  }
  rsvps?: {
    status: string
    attendeeCount: number
    guestName: string
    dietaryRestrictions?: string
  }[]
}

export default function PrintPage() {
  const params = useParams()
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'guest' | 'staff'>('guest')
  
  const guestCardRef = useRef<HTMLDivElement>(null)
  const staffCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/banquet/${params.id}`)
        if (!response.ok) throw new Error('Not found')
        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${weekdays[date.getDay()]})`
  }

  const exportGuestCard = async () => {
    if (!guestCardRef.current) return
    try {
      const dataUrl = await toPng(guestCardRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `お品書き_${data?.title}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      alert('画像の保存に失敗しました')
    }
  }

  const exportStaffCard = async () => {
    if (!staffCardRef.current) return
    try {
      const dataUrl = await toPng(staffCardRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `仕込み帖_${data?.title}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      alert('画像の保存に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <div className="w-12 h-12 border border-[#C73E3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <p className="text-[#8A8680]">データが見つかりません</p>
      </div>
    )
  }

  const confirmedGuests = data.rsvps?.filter(r => r.status === 'confirmed') || []
  const confirmedCount = confirmedGuests.reduce((sum, r) => sum + r.attendeeCount, 0)
  const dietaryNotes = confirmedGuests
    .filter(r => r.dietaryRestrictions)
    .map(r => `${r.guestName}: ${r.dietaryRestrictions}`)
    .join(' / ')

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      {/* Header */}
      <header className="no-print fixed top-0 left-0 right-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#D8D4CC]">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/list" className="text-[#8A8680] hover:text-[#1A1A1A]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display-jp text-sm text-[#1A1A1A]">{data.title}</h1>
              <p className="text-xs text-[#8A8680]">印刷用データ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/invitation/${data.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#8A8680] hover:text-[#1A1A1A]"
            >
              <Eye className="w-4 h-4" />
              招待状
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2D2D2D]"
            >
              <Printer className="w-4 h-4" />
              印刷
            </button>
          </div>
        </div>
      </header>

      {/* Tab切换 */}
      <div className="no-print fixed top-16 left-0 right-0 z-40 bg-[#F7F5F0] border-b border-[#D8D4CC]">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex gap-1 bg-[#EDE9E0] p-1 w-fit">
            <button
              onClick={() => setActiveTab('guest')}
              className={`px-6 py-2.5 text-sm tracking-wider transition-colors ${
                activeTab === 'guest'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#8A8680] hover:text-[#1A1A1A]'
              }`}
            >
              お品書き
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-6 py-2.5 text-sm tracking-wider transition-colors ${
                activeTab === 'staff'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#8A8680] hover:text-[#1A1A1A]'
              }`}
            >
              仕込み帖
            </button>
          </div>
        </div>
      </header>

      {/* お品書き */}
      {activeTab === 'guest' && (
        <div className="pt-40 pb-20 px-8">
          <div className="no-print max-w-4xl mx-auto mb-6 flex justify-end">
            <button
              onClick={exportGuestCard}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C73E3A] text-white text-sm tracking-wider hover:bg-[#A52A2A]"
            >
              <Download className="w-4 h-4" />
              画像を保存
            </button>
          </div>

          <div 
            ref={guestCardRef}
            className="bg-white max-w-md mx-auto"
            style={{ width: '375px', minHeight: '600px' }}
          >
            <div className="h-1 bg-[#C73E3A]"></div>
            
            <div className="bg-[#1A1A1A] text-center py-8 px-6">
              <p className="text-[#C73E3A] text-[10px] tracking-[0.4em] mb-3">{data.restaurant.name}</p>
              <h1 className="font-display-jp text-2xl text-white tracking-wider">お品書き</h1>
            </div>

            <div className="text-center py-5 border-b border-[#D8D4CC]">
              <p className="font-display-jp text-lg text-[#1A1A1A] mb-1">{data.title}</p>
              <p className="text-xs text-[#8A8680]">{formatDate(data.date)} {data.time}〜</p>
            </div>

            <div className="py-5 px-6">
              {data.menu.map((dish, index) => (
                <div 
                  key={index}
                  className={`py-2.5 border-b border-[#D8D4CC] last:border-0 ${
                    dish.isSignature ? 'bg-[#F5F0E8] -mx-6 px-6' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#C73E3A] text-xs font-display-jp w-5">{index + 1}</span>
                    <span className={`text-sm ${dish.isSignature ? 'font-display-jp text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>
                      {dish.name}
                    </span>
                    {dish.isSignature && (
                      <span className="ml-auto text-[8px] tracking-wider text-[#C73E3A] border border-[#C73E3A] px-1.5 py-0.5">
                        おすすめ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto py-4 text-center border-t border-[#D8D4CC]">
              <p className="text-[10px] tracking-[0.2em] text-[#8A8680]">{data.restaurant.name}</p>
              <p className="text-[10px] text-[#C73E3A] mt-1">{data.restaurant.phone}</p>
            </div>
            
            <div className="h-1 bg-[#C73E3A]"></div>
          </div>
        </div>
      )}

      {/* 仕込み帖 */}
      {activeTab === 'staff' && (
        <div className="pt-40 pb-20 px-8">
          <div className="no-print max-w-4xl mx-auto mb-6 flex justify-end">
            <button
              onClick={exportStaffCard}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C73E3A] text-white text-sm tracking-wider hover:bg-[#A52A2A]"
            >
              <Download className="w-4 h-4" />
              画像を保存
            </button>
          </div>

          <div 
            ref={staffCardRef}
            className="bg-white mx-auto p-8"
            style={{ width: '297mm', minHeight: '210mm' }}
          >
            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-[#1A1A1A]">
              <div>
                <p className="text-xs tracking-[0.3em] text-[#C73E3A] mb-1">STAFF ONLY</p>
                <h1 className="font-display-jp text-2xl text-[#1A1A1A] tracking-wider">仕込み帖</h1>
              </div>
              <div className="text-right">
                <p className="font-display-jp text-lg text-[#1A1A1A]">{data.restaurant.name}</p>
                <p className="text-xs text-[#8A8680]">{formatDate(data.date)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="border-r border-[#D8D4CC] pr-6">
                <h3 className="text-xs tracking-[0.2em] text-[#C73E3A] mb-4">ご予約情報</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#8A8680]">お客様名：</span>
                    <span className="font-display-jp text-[#1A1A1A]">{data.title}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8680]">日時：</span>
                    <span className="text-[#1A1A1A]">{formatDate(data.date)} {data.time}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8680]">席：</span>
                    <span className="font-display-jp text-[#1A1A1A]">{data.roomName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8680]">人数：</span>
                    <span className="text-[#1A1A1A]">{data.guestCount}名</span>
                  </div>
                  <div className="pt-2 border-t border-[#D8D4CC]">
                    <span className="text-[#8A8680]">ご予約者：</span>
                    <span className="text-[#1A1A1A]">{data.hostName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A8680]">TEL：</span>
                    <span className="text-[#1A1A1A]">{data.hostPhone}</span>
                  </div>
                </div>
              </div>

              <div className="border-r border-[#D8D4CC] pr-6">
                <h3 className="text-xs tracking-[0.2em] text-[#C73E3A] mb-4">
                  お品書き <span className="text-[#8A8680]">({data.menu.length}品)</span>
                </h3>
                <div className="space-y-2 text-sm">
                  {data.menu.map((dish, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[#C73E3A] text-xs w-4">{index + 1}</span>
                      <span className={dish.isSignature ? 'font-display-jp text-[#1A1A1A]' : 'text-[#1A1A1A]'}>
                        {dish.name}
                      </span>
                      {dish.isSignature && (
                        <span className="text-[10px] text-[#C73E3A]">★</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs tracking-[0.2em] text-[#C73E3A] mb-4">注意事項</h3>
                
                <div className="space-y-4">
                  <div className="bg-[#F5F0E8] p-4">
                    <p className="text-xs text-[#8A8680] mb-1">出席確認</p>
                    <p className="font-display-jp text-3xl text-[#1A1A1A]">{confirmedCount} <span className="text-sm font-normal">名</span></p>
                    {data.rsvps && data.rsvps.length > 0 && (
                      <p className="text-xs text-[#8A8680] mt-1">返答{data.rsvps.length}名</p>
                    )}
                  </div>

                  {(dietaryNotes || data.notes) && (
                    <div className="bg-red-50 border border-red-100 p-4">
                      <p className="text-xs text-red-600 font-medium mb-2">⚠ 特記事項</p>
                      {dietaryNotes && (
                        <p className="text-xs text-red-700 leading-relaxed mb-2">
                          アレルギー：{dietaryNotes}
                        </p>
                      )}
                      {data.notes && (
                        <p className="text-xs text-red-700 leading-relaxed">
                          メモ：{data.notes}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="bg-[#F5F0E8] p-4">
                    <p className="text-xs text-[#8A8680] mb-3">チェックポイント</p>
                    <ul className="text-xs text-[#1A1A1A] space-y-2 list-disc list-inside">
                      <li>15分前に席準備</li>
                      <li>おしぼりとお茶</li>
                      <li>おすすめ商品の説明</li>
                      <li>ペース配分</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D8D4CC] flex justify-between text-xs text-[#8A8680]">
              <span>{data.restaurant.name} · {data.restaurant.address}</span>
              <span>TEL：{data.restaurant.phone}</span>
            </div>
          </div>
        </div>
      )}

      <div className="no-print max-w-4xl mx-auto px-8 pb-8 text-center">
        <p className="text-sm text-[#8A8680]">
          {activeTab === 'guest' ? 'お品書きはスマホサイズで印刷または画像保存' : '仕込み帖はA4横向きで印刷'}
        </p>
      </div>
    </div>
  )
}
