import React from 'react'

interface TabProps {
    tab: string;
    activeTab: string;
    children?: React.ReactNode;
}

function MainTab({tab, activeTab, children}: TabProps) {
    if (!tab.includes(activeTab)) return null;
  return (
    <div className='mt-5'>
        {children}
    </div>
  )
}

export default MainTab