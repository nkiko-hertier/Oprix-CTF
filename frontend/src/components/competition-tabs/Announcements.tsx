import { cn } from '@/lib/utils'
import { Bell, FileQuestion, Podcast } from 'lucide-react';
import React from 'react'
import RequireAccess from '../RequireAccess';
interface AnnouncementsProps {
  activeTab: string;
}
function Announcements({ activeTab }: AnnouncementsProps) {
  return (
    <div className={cn("", activeTab == 'Announcements' ? 'block' : 'hidden')}>
      <div className="mt-3">
        <RequireAccess roles={['admin', 'hoster']}>
        <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="px-5 py-2 text-muted-foreground text-sm">
            <div>Create Announcement</div>
          </div>
          <div className="bg-card border border-border border-dashed rounded-md">
            <textarea placeholder='whats new today?' className='w-full p-3 outline-none min-h-[100px]'></textarea>
          </div>
          <div>
            <button className="flex ml-auto mt-1 items-center text-sm gap-1 bg-indigo-500 text-white rounded-md p-1 px-3 h-fit"><Bell size={15} /> Post Announcement</button>
          </div>
        </div>
        </RequireAccess>
        <div className="rounded-md p-1 mt-2 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="flex items-center gap-2 p-2">
            <div>
              <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center"> <FileQuestion size={14} /> </div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Amanda Clerk</div>
              <div className="text-sm text-muted-foreground">@moderator</div>
            </div>
          </div>
          <div className="bg-card border border-border border-dashed jtext-muted-foreground rounded-md p-2">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod facilis sed aliquam distinctio dolore, molestias unde voluptate error nemo! Aspernatur, sapiente. Veritatis magnam odit repudiandae magni, eligendi aliquam ratione nobis. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet animi eum nisi mollitia perspiciatis aliquid commodi? Perferendis sed ducimus consectetur nesciunt recusandae reiciendis sunt, quisquam quibusdam quod itaque sit similique.</p>
          </div>
        </div>
        <div className="rounded-md p-1 mt-2 min-h-10 bg-background dark:bg-zinc-950/50">
          <div className="flex items-center gap-2 p-2">
            <div>
              <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center"> <FileQuestion size={14} /> </div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Amanda Clerk</div>
              <div className="text-sm text-muted-foreground">@moderator</div>
            </div>
          </div>
          <div className="bg-card border border-border border-dashed jtext-muted-foreground rounded-md p-2">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod facilis sed aliquam distinctio dolore, molestias unde voluptate error nemo! Aspernatur, sapiente. Veritatis magnam odit repudiandae magni, eligendi aliquam ratione nobis. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet animi eum nisi mollitia perspiciatis aliquid commodi? Perferendis sed ducimus consectetur nesciunt recusandae reiciendis sunt, quisquam quibusdam quod itaque sit similique.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Announcements