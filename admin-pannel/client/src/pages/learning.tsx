import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Eye, EyeOff, ExternalLink, Pencil, Trash2, Plus, MoreHorizontal, ShieldCheck, ShieldX, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { LearningMaterialDialog } from "@/components/dialogs/LearningDialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { apiRequest, queryClient } from "@/lib/queryClient";

// =====================
// Types
// =====================
type LearningResource = {
    label: string;
    url: string;
};

type LearningMaterial = {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    linkUrl?: string;
    resources?: LearningResource[];
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: { id?: string; username?: string; email?: string };
};

type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export default function LearningPage() {
    // filters
    const [search, setSearch] = useState<string>("");
    const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | undefined>(undefined);
    const [createdBy, setCreatedBy] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    // pagination
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(20);

    // build query params
    const queryParams = useMemo(() => {
        return {
            page,
            limit,
            ...(search && { search }),
            ...(createdBy && { createdBy }),
        };
    }, [page, limit, search, createdBy]);

    // fetch learning materials
    const {
        data: materialsResp,
        isLoading,
        isFetching,
    } = useQuery<PaginatedResponse<LearningMaterial>>({
        queryKey: ["/api/v1/learning-materials", queryParams],
    });

    const deleteMaterialMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiRequest("DELETE", `/api/v1/learning-materials/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/learning-materials"] });
        },
    });
    const toggleMaterialMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiRequest("PATCH", `/api/v1/learning-materials/${id}/visibility`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/learning-materials"] });
            toast.success("Learning material visibility toggled successfully");
        },
    });

    const materials = materialsResp?.data ?? [];
    const totalPages = materialsResp?.totalPages ?? 1;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">Learning Materials</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage courses, articles, and external learning resources
                    </p>
                </div>
                <Button
                    onClick={() => { setEditingMaterial(undefined); setDialogOpen(true); }}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Material
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b border-card-border">
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[240px] max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="pl-10"
                                placeholder="Search title or description"
                            />
                        </div>

                        {/* Created by filter */}
                        <Input
                            value={createdBy}
                            onChange={(e) => { setCreatedBy(e.target.value); setPage(1); }}
                            placeholder="Filter by creator user ID"
                            className="w-[220px] hidden"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Creator</TableHead>
                                        <TableHead>Resources</TableHead>
                                        <TableHead>Visibility</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {materials.length > 0 ? (
                                        materials.map((item) => (
                                            <TableRow key={item.id} className="hover-elevate">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {item.thumbnailUrl && (
                                                            <img
                                                                src={item.thumbnailUrl}
                                                                alt={item.title}
                                                                className="w-12 h-12 rounded object-cover border"
                                                            />
                                                        )}
                                                        <div>
                                                            <div>{item.title}</div>
                                                            {item.description && (
                                                                <div className="text-xs text-muted-foreground line-clamp-2">
                                                                    {item.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-muted-foreground">
                                                    {item.createdBy?.username ?? item.createdBy?.email ?? "-"}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {item.resources?.length ?? 0} resources
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    {item.isVisible ? (
                                                        <Badge className="gap-1">
                                                            <Eye className="w-3 h-3" /> Visible
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="gap-1">
                                                            <EyeOff className="w-3 h-3" /> Hidden
                                                        </Badge>
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-muted-foreground">
                                                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {item.linkUrl && (
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                onClick={() => window.open(item.linkUrl, "_blank")}
                                                                title="Open link"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Button>
                                                        )}

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>

                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() => { setEditingMaterial(item); setDialogOpen(true); }}
                                                                >
                                                                    <PencilIcon className="w-4 h-4 mr-2" />
                                                                    Edit
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    onClick={() => { deleteMaterialMutation.mutate(item.id); }}
                                                                    className="text-destructive"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    onClick={() => { toggleMaterialMutation.mutate(item.id); }}
                                                                >
                                                                    {item.isVisible ? 
                                                                    <div className="flex gap-2">
                                                                        <EyeOff className="w-4 h-4" /> Hide
                                                                    </div> : 
                                                                    <div className="flex gap-2">
                                                                        <Eye className="w-4 h-4" /> Show
                                                                    </div>}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                No learning materials found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between p-4 border-t border-card-border">
                                <div className="text-sm text-muted-foreground">
                                    Page {materialsResp?.page ?? page} of {totalPages} — {materialsResp?.total ?? 0} total
                                    {isFetching && " (loading...)"}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                        className="px-3 py-1 rounded-md border"
                                    >
                                        Prev
                                    </button>

                                    <button
                                        onClick={() => page < totalPages && setPage((p) => p + 1)}
                                        disabled={page >= totalPages}
                                        className="px-3 py-1 rounded-md border"
                                    >
                                        Next
                                    </button>

                                    <select
                                        value={limit}
                                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                                        className="ml-4 rounded-md bg-sidebar border px-2 py-1"
                                    >
                                        <option value={10}>10 / page</option>
                                        <option value={20}>20 / page</option>
                                        <option value={50}>50 / page</option>
                                        <option value={100}>100 / page</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            <LearningMaterialDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                material={editingMaterial}
            />
        </div>
    );
}
