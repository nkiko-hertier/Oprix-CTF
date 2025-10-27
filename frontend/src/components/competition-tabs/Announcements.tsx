import { cn } from '@/lib/utils'
import { FileQuestion } from 'lucide-react';
import React from 'react'
interface AnnouncementsProps {
  activeTab: string;
}
function Announcements({activeTab}: AnnouncementsProps) {
  return (
    <div className={cn("", activeTab == 'Announcements' ? 'block' : 'hidden')}>
      <div className="mt-3">
        <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="px-5 py-2 text-muted-foreground text-sm">
            <div>Create Announcement</div>
          </div>
          <div className="bg-card border border-border border-dashed rounded-md">
            <div className="grid grid-cols-4 items-center px-5 py-2 text-muted-foreground text-sm">
              <div className='col-span-3'>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center"> <FileQuestion size={14} /> </div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Cyber URL injection attack!</div>
                    <div className="text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum porro et corrupti pariatur fuga repellendus, iste magnam iure? Deleniti distinctio cumque consequatur, ipsum exercitationem voluptas sint aut tempora earum molestiae.</div>
                  </div>
                </div>
              </div>
              <div>Actions</div>
            </div>
            <div className="grid grid-cols-4 items-center px-5 py-2 text-muted-foreground text-sm">
              <div className='col-span-3'>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center"> <FileQuestion size={14} /> </div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Cyber URL injection attack!</div>
                    <div className="text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum porro et corrupti pariatur fuga repellendus, iste magnam iure? Deleniti distinctio cumque consequatur, ipsum exercitationem voluptas sint aut tempora earum molestiae.</div>
                  </div>
                </div>
              </div>
              <div>Actions</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Announcements