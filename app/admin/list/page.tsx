'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Calendar, Users, Trash2, Eye, QrCode, Printer, ArrowRight } from 'lucide-react'

interface Banquet {
  id: string
  title: string
  date: string
  time: string
  guestCount: number
  roomName: string
  hostName: string
  status: string
  createdAt: string
  rsvps: {
    status: string
    attendeeCount: number
  }[]
}

export default function AdminListPage() {
  const [banquets, setBanquets] = useState<Banquet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanquets()
  }, [])

  const fetchBanquets = async () => {
    try {
      const response = await fetch('/api/banquets')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setBanquets(data.banquets)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('削除してもよろしいですか？')) return
    
    try {
      const response = await fetch(`/api/banquet/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete')
      
      setBanquets(banquets.filter(b => b.id !== id))
    } catch (error) {
      alert('削除に失敗しました')
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const getConfirmedCount = (banquet: Banquet) => {
    return banquet.rsvps?.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.attendeeCount, 0) || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen texture-washi flex items-center justify-center">
        <div className="w-12 h-12 border border-[#C73E3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen texture-washi">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#D8D4CC]">
        <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#8A8680] hover:text-[#1A1A1A] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-display-jp text-sm tracking-[0.15em] text-[#1A1A1A]">ご招待状一覧</span>
          </div>
          <Link 
            href="/admin"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-xs tracking-wider hover:bg-[#2D2D2D] transition-colors"
          >
            <Plus className="w-4 h-4" />
            新規作成
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-32 pb-20">
        {banquets.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 border border-[#D8D4CC] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-[#8A8680]" />
            </div>
            <h3 className="font-display-jp text-xl text-[#1A1A1A] mb-3 tracking-wider">ご招待状がありません</h3>
            <p className="text-sm text-[#8A8680] mb-8">新しいご招待状を作成してください</p>
            <Link 
              href="/admin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white text-sm tracking-wider hover:bg-[#2D2D2D] transition-colors"
            >
              <Plus className="w-4 h-4" />
              作成する
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {banquets.map((banquet) => (
              <div 
                key={banquet.id}
                className="bg-white border border-[#D8D4CC] p-6 hover:border-[#C73E3A] transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* 信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display-jp text-lg text-[#1A1A1A] tracking-wider">{banquet.title}</h3>
                      <span className={`text-xs px-2 py-1 ${
                        banquet.status === 'active' 
                          ? 'bg-[#C73E3A]/10 text-[#C73E3A]' 
                          : 'bg-[#8A8680]/10 text-[#8A8680]'
                      }`}>
                        {banquet.status === 'active' ? '予約受付中' : '終了'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-[#8A8680]">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C73E3A]" />
                        {formatDate(banquet.date)} {banquet.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#C73E3A]" />
                        {banquet.guestCount}名 · {banquet.roomName}
                      </span>
                      <span>ご予約者：{banquet.hostName}</span>
                    </div>
                    {banquet.rsvps && banquet.rsvps.length > 0 && (
                      <div className="mt-3 text-sm">
                        <span className="text-[#8A8680]">出席確認：</span>
                        <span className="text-[#C73E3A] font-display-jp">{getConfirmedCount(banquet)}名</span>
                        <span className="text-[#8A8680] text-xs"> / {banquet.rsvps.length}名返答</span>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/invitation/${banquet.id}`}
                      target="_blank"
                      className="p-2.5 text-[#8A8680] hover:text-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors"
                      title="招待状を見る"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/print/${banquet.id}`}
                      target="_blank"
                      className="p-2.5 text-[#8A8680] hover:text-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors"
                      title="印刷用データ"
                    >
                      <Printer className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(banquet.id)}
                      className="p-2.5 text-[#8A8680] hover:text-[#C73E3A] hover:bg-red-50 transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
