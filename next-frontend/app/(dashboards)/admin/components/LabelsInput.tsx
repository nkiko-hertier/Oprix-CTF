import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface TagsTextareaProps {
  label?: string
  placeholder?: string
  value?: string[]
  onChange?: (tags: string[]) => void
  className?: string
}

export function TagsTextarea({
  label = "Labels",
  placeholder = "Type labels separated by commas...",
  value = [],
  onChange,
  className,
}: TagsTextareaProps) {
  const [input, setInput] = React.useState("")
  const [tags, setTags] = React.useState<string[]>(value)

  const addTags = (text: string) => {
    const newTags = text
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !tags.includes(t))

    if (newTags.length > 0) {
      const updated = [...tags, ...newTags]
      setTags(updated)
      onChange?.(updated)
    }
  }

  const removeTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag)
    setTags(updated)
    onChange?.(updated)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTags(input)
      setInput("")
    }
  }

  const handleBlur = () => {
    addTags(input)
    setInput("")
  }

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/40">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {tag}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 min-h-[40px] border-0 shadow-none resize-none focus-visible:ring-0 bg-transparent p-0"
        />
      </div>
    </div>
  )
}
