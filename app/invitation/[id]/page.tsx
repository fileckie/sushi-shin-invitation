'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { toPng } from 'html-to-image'
import { Download, MapPin, Phone } from 'lucide-react'

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
  menu: Dish[]
  restaurant: {
    name: string
    address: string
    phone: string
    chefName?: string
    chefTitle?: string
  }
}

export default function InvitationPage() {
  const params = useParams()
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const invitationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/banquet/${params.id}`)
        if (!response.ok) throw new Error('Not found')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError('ご招待状が見つかりません')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const exportImage = async () => {
    if (!invitationRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(invitationRef.current, { 
        quality: 0.95, 
        pixelRatio: 2
      })
      
      const link = document.createElement('a')
      link.download = `ご招待状_${data?.title}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      alert('画像の保存に失敗しました')
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: weekdays[date.getDay()]
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <div className="w-12 h-12 border border-[#C73E3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <p className="text-white/60">{error}</p>
      </div>
    )
  }

  const dateInfo = formatDate(data.date)

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* 导出按钮 */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={exportImage}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-3 bg-[#C73E3A] text-white text-sm tracking-wider hover:bg-[#A52A2A] transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? '保存中...' : '画像を保存'}
        </button>
      </div>

      {/* 邀请函主体 */}
      <div 
        ref={invitationRef}
        className="max-w-lg mx-auto bg-[#F7F5F0] min-h-screen relative"
      >
        {/* 顶部装饰 */}
        <div className="h-1 bg-[#C73E3A]"></div>
        
        {/* 头部 */}
        <div className="bg-[#1A1A1A] text-center py-14 px-8">
          <p className="text-[#C73E3A] text-xs tracking-[0.4em] mb-4">{data.restaurant.name}</p>
          <h1 className="font-display-jp text-4xl text-white mb-3 tracking-wider">ご招待状</h1>
          <div className="w-12 h-px bg-[#C73E3A] mx-auto"></div>
        </div>

        {/* 日期时间 */}
        <div className="py-10 px-8 text-center border-b border-[#D8D4CC]">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="font-display-jp text-4xl text-[#1A1A1A]">{dateInfo.year}</p>
              <p className="text-xs tracking-[0.2em] text-[#8A8680] mt-1">年</p>
            </div>
            <div className="text-center">
              <p className="font-display-jp text-4xl text-[#1A1A1A]">{dateInfo.month}</p>
              <p className="text-xs tracking-[0.2em] text-[#8A8680] mt-1">月</p>
            </div>
            <div className="text-center">
              <p className="font-display-jp text-4xl text-[#1A1A1A]">{dateInfo.day}</p>
              <p className="text-xs tracking-[0.2em] text-[#8A8680] mt-1">日</p>
            </div>
            <div className="text-center">
              <p className="font-display-jp text-2xl text-[#1A1A1A]">{dateInfo.weekday}</p>
              <p className="text-xs tracking-[0.2em] text-[#8A8680] mt-2">曜日</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-display-jp text-2xl text-[#1A1A1A]">{data.time} <span className="text-base">〜</span></p>
          </div>
        </div>

        {/* 宴会信息 */}
        <div className="py-8 px-8 border-b border-[#D8D4CC]">
          <div className="text-center mb-6">
            <p className="font-display-jp text-xl text-[#1A1A1A] tracking-wider">{data.title}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C73E3A] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-display-jp text-[#1A1A1A] mb-1">{data.restaurant.name}</p>
                <p className="text-sm text-[#8A8680]">{data.restaurant.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-8">
              <span className="text-sm text-[#8A8680]">席：</span>
              <span className="font-display-jp text-[#1A1A1A]">{data.roomName}</span>
            </div>
          </div>
        </div>

        {/* お品書き */}
        <div className="py-8 px-8">
          <div className="text-center mb-6">
            <p className="text-xs tracking-[0.4em] text-[#C73E3A] mb-2">MENU</p>
            <h2 className="font-display-jp text-lg text-[#1A1A1A] tracking-wider">お品書き</h2>
          </div>
          
          <div className="space-y-0">
            {data.menu.map((dish, index) => (
              <div 
                key={index}
                className={`py-3 border-b border-[#D8D4CC] last:border-0 ${
                  dish.isSignature ? 'bg-[#F5F0E8] -mx-8 px-8' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#C73E3A] font-display-jp text-sm w-6">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`${dish.isSignature ? 'font-display-jp text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>
                        {dish.name}
                      </span>
                      {dish.isSignature && (
                        <span className="text-[10px] tracking-wider text-[#C73E3A] border border-[#C73E3A] px-1.5 py-0.5">
                          おすすめ
                        </span>
                      )}
                    </div>
                    {dish.description && (
                      <p className="text-xs text-[#8A8680] mt-1">{dish.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ご予約者 */}
        <div className="py-6 px-8 border-t border-[#D8D4CC]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#8A8680] mb-1">ご予約者</p>
              <p className="font-display-jp text-lg text-[#1A1A1A]">{data.hostName}</p>
            </div>
            <a 
              href={`tel:${data.hostPhone}`}
              className="flex items-center gap-2 text-[#C73E3A] text-sm"
            >
              <Phone className="w-4 h-4" />
              お問い合わせ
            </a>
          </div>
        </div>

        {/* 店舗电话 */}
        <div className="py-5 px-8 bg-[#F5F0E8] text-center">
          <p className="text-xs tracking-[0.2em] text-[#8A8680] mb-1">ご予約・お問い合わせ</p>
          <a href={`tel:${data.restaurant.phone}`} className="font-display-jp text-xl text-[#1A1A1A]">
            {data.restaurant.phone}
          </a>
        </div>

        {/* 底部装饰 */}
        <div className="h-1 bg-[#C73E3A]"></div>
        
        {/* 底部信息 */}
        <div className="py-5 text-center">
          <p className="text-xs tracking-[0.2em] text-[#8A8680]">
            {data.restaurant.name} · 一期一会
          </p>
        </div>
      </div>
    </div>
  )
}
