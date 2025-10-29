import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// Import the GitHub light and dark code block styles
// You can pick any themes from react-syntax-highlighter/dist/cjs/styles/prism
import { 
  vscDarkPlus, // Good dark theme
  vs         // Good light theme
} from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MdHtmlProps {
    children: string | null | undefined;
}

const MdHtml = ({ children }: MdHtmlProps) => {

  // A helper function to check for the 'dark' class on the HTML or Body
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark');
  
  // Choose the syntax highlighter theme based on the current mode
  const codeStyle = isDarkMode ? vscDarkPlus : vs;

  return (
    // 1. We apply the `markdown-body` class which the imported CSS targets
    // 2. We use 'p-4' (or your preferred padding) for visual spacing
    <div className="markdown-body p-4">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override the standard 'code' element to inject syntax highlighting
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            
            // Render as SyntaxHighlighter for code blocks
            return !inline && match ? (
              <SyntaxHighlighter
                style={codeStyle}
                language={match[1]}
                PreTag="div" // Use a div instead of pre to avoid some styling issues
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              // Fallback to a regular <code> for inline code (like `text`)
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  );
};

export default MdHtml;