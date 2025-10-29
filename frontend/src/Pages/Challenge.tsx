import MdHtml from '@/components/MdHtml';
import { Button } from '@mui/material';
import { Bell, ChevronLeft, Download, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

const sampleMarkdown = `
# GitHub Theme Demo

This is a **bold** paragraph.
| Header 1 | Header 2 |
|---|---|
| Cell A | Cell B |

## Code Example

\`\`\`javascript
function hello(name) {
  // This is a comment
  console.log(\`Hello, \${name}!\`);
}
\`\`\`
`;

function Challenge() {
    return (
        <div className='grid grid-cols-2 gap-3'>
            <div>
                <div className="rounded-md border border-border border-dashed p-1 mt-2 min-h-10 bg-background dark:bg-zinc-950/50">
                    <div className="flex items-center gap-2 p-2">
                        <Link to={document.referrer ? document.referrer : '#'} className='pr-5'>
                            <ChevronLeft />
                        </Link>
                        <div>
                            <div className="font-semibold text-foreground">Performing a soft Password brute force attack</div>
                            <div className="text-sm text-muted-foreground"><span className='text-foreground'>by</span> @Simon Kay</div>
                        </div>
                    </div>
                    <div className="dark:bg-card bg-sidebar jtext-muted-foreground rounded-md p-2">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod facilis sed aliquam distinctio dolore, molestias unde voluptate error nemo! Aspernatur, sapiente. Veritatis magnam odit repudiandae magni, eligendi aliquam ratione nobis. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet animi eum nisi mollitia perspiciatis aliquid commodi? Perferendis sed ducimus consectetur nesciunt recusandae reiciendis sunt, quisquam quibusdam quod itaque sit similique.</p>
                        {/* <MdHtml>{sampleMarkdown}</MdHtml> */}
                    </div>
                    <h1 className='my-2 text-muted-foreground'>Related & Resources:</h1>
                    <div className="dark:bg-card bg-sidebar jtext-muted-foreground rounded-md p-2 flex flex-wrap gap-2">
                        <Button variant="contained" color="primary" className='shadow-none! flex gap-2 text-sm! bg-indigo-500!'> <Download size={13}/> Passwords.txt </Button>
                        <Button variant="contained" color="primary" className='shadow-none! flex gap-2 text-sm! bg-indigo-500!'> <Download size={13}/> Data.txt </Button>
                        <Button variant="contained" color="primary" className='shadow-none! flex gap-2 text-sm! bg-indigo-500!'> <Download size={13}/> Passwords.txt </Button>
                        <Button variant="contained" color="primary" className='shadow-none! flex gap-2 text-sm! bg-indigo-500!'> <Download size={13}/> Passwords.txt </Button>
                    </div>
                </div>
            </div>
            <div className="mt-3">
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
                
            </div>
        </div>
    )
}

export default Challenge