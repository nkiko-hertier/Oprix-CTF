import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { DriveImageInput, DropBoxButton } from "../DriveImageInput";
import { toast as toaster1 } from 'sonner'

const learningMaterialSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnailUrl: z.string().url("Thumbnail must be a valid URL"),
  linkUrl: z.string().url("Link must be a valid URL"),
  isVisible: z.boolean().default(true),
  resources: z.array(z.object({ label: z.string().min(1), url: z.string().url() })).optional(),
});

type LearningMaterialFormData = z.infer<typeof learningMaterialSchema>;

interface LearningMaterialWithId {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  resources?: { label: string; url: string }[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: { id?: string; username?: string; email?: string };
};

interface LearningMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: LearningMaterialWithId | undefined;
}

export function LearningMaterialDialog({ open, onOpenChange, material }: LearningMaterialDialogProps) {
  const isEditing = Boolean(material);
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const PIXABAY_API_KEY = '53801820-41ac3159377ca4c1de99ceb55';

  const searchPixabay = async () => {
    if (!query) return;

    setLoading(true);
    const res = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
        query
      )}&image_type=photo&per_page=12`
    );

    const data = await res.json();
    setImages(data.hits || []);
    setLoading(false);
  };



  const form = useForm<LearningMaterialFormData>({
    resolver: zodResolver(learningMaterialSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailUrl: "",
      linkUrl: "",
      isVisible: true,
      resources: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  useEffect(() => {
    if (material) {
      form.reset({
        title: material.title,
        description: material.description,
        thumbnailUrl: material.thumbnailUrl,
        linkUrl: material.linkUrl,
        isVisible: material.isVisible,
        resources: material.resources || [],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        thumbnailUrl: "",
        linkUrl: "",
        isVisible: true,
        resources: [],
      });
    }
  }, [material, form]);

  const mutation = useMutation({
    mutationFn: async (data: LearningMaterialFormData) => {
      const url = isEditing ? `/api/v1/learning-materials/${material?.id}` : `/api/v1/learning-materials`;
      const method = isEditing ? "PUT" : "POST";
      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/learning-materials"] });
      toast({ title: `Learning material ${isEditing ? 'updated' : 'created'} successfully` });
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (data: LearningMaterialFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="dialog-learning-material">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Create'} Learning Material</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update' : 'Add a new'} learning material
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Material title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Material description" className="min-h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>

                  {/* URL input */}
                  <FormControl className="hidden">
                    <Input
                      {...field}
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </FormControl>

                  {/* Preview */}
                  {field.value && (
                    <div>
                      
                    <img
                      src={field.value}
                      onError={()=> {field.onChange(''); toaster1.error('We only support image files .(any image)')}}
                      alt="Thumbnail preview"
                      className="mt-3 w-full h-40 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  {/* Pixabay search */}
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Search images (Pixabay)"
                      value={query}
                      onFocus={()=>{}}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        searchPixabay();
                      }}
                    />
                    <Button type="button" className="h-fit" onClick={searchPixabay}>
                      Search
                    </Button>
                    <DropBoxButton field={field} />
                  </div>

                  {/* Results */}
                  {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

                  <div hidden={true} className="grid grid-cols-3 gap-2 mt-3 max-h-[200px] overflow-y-auto">
                    {images.map((img) => (
                      <img
                        key={img.id}
                        src={img.previewURL}
                        alt=""
                        className="cursor-pointer rounded-md border hover:ring-2 hover:ring-blue-500"
                        onClick={() => field.onChange(img.previewURL.replace('150', '1280'))}
                      />
                    ))}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="linkUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/course" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel>Visible</FormLabel>
                  <FormControl>
                    <Input type="checkbox" className="w-fit" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Resources</span>
                <Button type="button" size="sm" onClick={() => append({ label: '', url: '' })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </div>

              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="flex gap-2 items-center">
                  <FormField
                    control={form.control}
                    name={`resources.${index}.label` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="Label" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`resources.${index}.url` as const}
                    render={({ field }) => (
                      <div className="flex">
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="URL" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <DropBoxButton field={field} />
                      </div>
                    )}
                  />

                  <Button type="button" variant="destructive" onClick={() => remove(index)} size="icon"><Trash2 /></Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
