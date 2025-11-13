

interface NoContentProps {
    title: string;
    description?: string;
    src?: string;
}
function NoContent({ title, description, src }: NoContentProps) {
    return (
        <div className='bg-white/10 h-[220px] rounded-md w-full flex justify-center items-center flex-col my-4'>
            <img src={src ?? "/icons/wallet-money.png"} alt="No competitions" className='w-[100px]' />
            <h1 className='text-xl mt-2 text-slate-400'>{title ?? "Found 0 content here"}</h1>
            <p className='text-sm text-zinc-400'>{description ?? "(0) items was fetched"}</p>
        </div>
    )
}

export default NoContent