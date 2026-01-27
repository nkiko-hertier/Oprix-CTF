import { useEffect, useState } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import { ArrowRight, ExternalLink } from 'lucide-react'

import getApiClient from '@/lib/api-client'
import { API_ENDPOINTS } from '@/config/api.config'

import NoContent from '@/components/NoContent'
import PublicChallanges from '@/components/CompetitionsPages/NewChallanges'

import type { PaginatedResponse, LearningMaterial } from '@/types'

// shadcn tabs
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

function LearningPage() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 9

  useEffect(() => {
    fetchLearningMaterials()
  }, [page])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchLearningMaterials()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchLearningMaterials = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await getApiClient().get<
        PaginatedResponse<LearningMaterial>
      >(`${API_ENDPOINTS.LEARNING.LIST}?${params.toString()}`)

      setMaterials(response.data.data || [])
      setTotalPages(response.data.pagination.pages || 1)
    } catch (error) {
      console.error('Failed to fetch learning materials:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl mt-5 sm:text-3xl text-center sm:text-left">
        Learn 📚 <br /> Strengthen your fundamentals
      </h1>

      {/* Tabs */}
      <Tabs defaultValue="learning" className="mt-8">
        <TabsList className="bg-[#17202f]">
          <TabsTrigger value="learning">Learning</TabsTrigger>
          {/* <TabsTrigger value="challenges">Challenges</TabsTrigger> */}
        </TabsList>

        {/* ================= LEARNING TAB ================= */}
        <TabsContent value="learning" className="mt-6">
          {/* Search */}
          <div className="flex justify-end mt-6 mb-5">
            <div className="flex items-center bg-[#17202f] px-3 gap-2 rounded-md w-full sm:w-[300px]">
              <RiSearch2Line className="text-gray-400" />
              <input
                type="text"
                placeholder="Search learning materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-2 py-2 text-sm bg-transparent outline-none text-white placeholder-gray-400 w-full"
              />
            </div>
          </div>

          {/* Empty state */}
          {!loading && materials.length === 0 && (
            <NoContent
              title="No learning materials found"
              description="Try a different keyword or check back later."
            />
          )}

          {/* Learning cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
            {loading &&
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton min-h-[160px]" />
              ))}

            {materials.map((item) => (
              <div
                key={item.id}
                className="bg-[#17202f] hover:bg-slate-800 p-4 rounded-lg cursor-pointer"
              >
                <div className="h-[150px] mb-3">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="rounded-md size-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {item.description}
                </p>

                {/* Resources */}
                {item.resources?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {item.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 flex items-center gap-1 hover:text-white"
                      >
                        <ExternalLink size={12} />
                        {res.label}
                      </a>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <a
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 flex items-center gap-1 mt-4"
                >
                  Start learning <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-sm rounded-md bg-[#17202f] disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 py-1 text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-sm rounded-md bg-[#17202f] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </TabsContent>

        {/* ================= CHALLENGES TAB ================= */}
        <TabsContent value="challenges" className="mt-6">
          <PublicChallanges />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LearningPage
