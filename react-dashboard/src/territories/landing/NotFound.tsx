import { Button } from '@mui/material';
import React from 'react';

function NotFound() {
  return (
    <div className="w-screen overflow-x-auto flex justify-center py-10 bg-slate-950">

      {/* 404 Box */}
      <div className="bg-white/10 h-[250px] w-[500px] rounded-md flex justify-center items-center flex-col my-4">
        <img src="/icons/404-not-found-shopping.png" alt="No competitions" className="w-[100px]" />
        <h1 className="text-3xl mt-2 text-slate-400">Page not found</h1>
        <p className="text-sm text-zinc-400">Looks like this page isn't available</p>
        <Button className="mt-4 bg-white! text-black! capitalize! px-5! my-4!" href="/">Go Back Home</Button>
      </div>
    </div>
  );
}

export default NotFound;
