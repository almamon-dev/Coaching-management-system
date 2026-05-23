import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import SelectInput from '@/Components/SelectInput';

const ProductPagination = ({ products, filters, total, handlePerPageChange }) => {
     const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
     const hasCursor = searchParams.has('cursor');
     const startIdx = hasCursor ? parseInt(searchParams.get('start_index') || '1', 10) : 1;
     const perPage = parseInt(filters?.per_page || 10, 10);
     const count = products.data?.length || 0;

     const fromIdx = count > 0 ? startIdx : 0;
     const toIdx = count > 0 ? startIdx + count - 1 : 0;

     const getPaginatedUrl = (url, nextStartIndex) => {
          if (!url) return null;
          try {
               const urlObj = new URL(url, window.location.origin);
               urlObj.searchParams.set('start_index', nextStartIndex.toString());
               return urlObj.pathname + urlObj.search;
          } catch (e) {
               return url;
          }
     };

     const prevUrl = getPaginatedUrl(products.prev_page_url || products.links?.prev, Math.max(1, startIdx - perPage));
     const nextUrl = getPaginatedUrl(products.next_page_url || products.links?.next, startIdx + perPage);

     return (
          <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-slate-100 bg-white">
               <div className="flex items-center gap-2">
                    <div className="w-[85px]">
                         <SelectInput
                              value={filters?.per_page || 10}
                              onChange={handlePerPageChange}
                              showSearch={false}
                              direction="up"
                              options={[
                                   { id: '5', name: '5' },
                                   { id: '10', name: '10' },
                                   { id: '20', name: '20' },
                                   { id: '50', name: '50' },
                                   { id: '100', name: '100' }
                              ]}
                              className="[&_button]:h-[30px] [&_button]:py-0 min-w-0"
                         />
                    </div>
               </div>

               <div className="flex items-center gap-4">
                    <span className="text-[12px] text-[#081621] font-bold tabular-nums">
                         {(products.meta?.total !== undefined || products.total !== undefined) ? (
                              `${products.meta?.from || products.from || 0} - ${products.meta?.to || products.to || 0} of ${products.meta?.total || products.total || 0}`
                         ) : (
                              `${fromIdx} - ${toIdx}`
                         )}
                    </span>

                    <div className="flex gap-1">
                         {prevUrl ? (
                              <Link
                                   href={prevUrl}
                                   prefetch
                                   preserveState
                                   preserveScroll
                                   className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#ef4a23] hover:text-[#ef4a23] transition-all bg-white shadow-sm"
                              >
                                   <ChevronLeft size={16} />
                              </Link>
                         ) : (
                              <button
                                   disabled
                                   className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] opacity-30 cursor-not-allowed bg-white shadow-sm"
                              >
                                   <ChevronLeft size={16} />
                              </button>
                         )}

                         {nextUrl ? (
                              <Link
                                   href={nextUrl}
                                   prefetch
                                   preserveState
                                   preserveScroll
                                   className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#ef4a23] hover:text-[#ef4a23] transition-all bg-white shadow-sm"
                              >
                                   <ChevronRight size={16} />
                              </Link>
                         ) : (
                              <button
                                   disabled
                                   className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] opacity-30 cursor-not-allowed bg-white shadow-sm"
                              >
                                   <ChevronRight size={16} />
                              </button>
                         )}
                    </div>
               </div>
          </div>
     );
};

export default ProductPagination;
