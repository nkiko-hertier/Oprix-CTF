import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Search,
    MoreHorizontal,
    RefreshCw,
    ShieldCheck,
    ShieldX,
} from "lucide-react";

import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { toast as toaster } from "sonner"
import { useParams } from "wouter";

export default function CertificatesPage(
) {
    const params = useParams();
    const competitionId = params.id as string;
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [competitionFilter, setCompetitionFilter] = useState(competitionId || "all");
    const [userFilter, setUserFilter] = useState("all");

    const { toast } = useToast();

    // Fetch competitions
    const { data: competitionsData } = useQuery({
        queryKey: ["/api/v1/competitions"],
    });

    const competitions = Array.isArray(competitionsData)
        ? competitionsData
        : competitionsData?.data || [];

    // Build query options
    const queryParams: Record<string, any> = {
        page: 1,
        limit: 20,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(competitionFilter !== "all" && { competitionId: competitionFilter }),
        ...(userFilter !== "all" && { userId: userFilter }),
        ...(search && { search }),
    };

    const { data: certificates, isLoading } = useQuery({
        queryKey: ["/api/v1/certificates/admin/list", queryParams],
    });

    // Update status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            return apiRequest("PATCH", `/api/v1/certificates/admin/${id}/status`, {
                status,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/api/v1/certificates/admin/list"],
            });
            toast({ title: "Certificate status updated successfully" });
        },
    });

    // Generate certificates
    const generateMutation = useMutation({
        mutationFn: async (competitionId: string) => {
            return apiRequest(
                "POST",
                `/api/v1/certificates/admin/generate/${competitionId}`
            );
        },
        onSuccess: () => {
            toast({ title: "Certificate generation triggered" });
            queryClient.invalidateQueries({
                queryKey: ["/api/v1/certificates/admin/list"],
            });
        },
    });

    const statusColors: Record<string, string> = {
        PENDING: "bg-gray-200 text-gray-700",
        APPROVED: "bg-green-500 text-white",
        ISSUED: "bg-blue-500 text-white",
        REJECTED: "bg-red-500 text-white",
        REVOKED: "bg-orange-500 text-white",
    };

    return (
        <div className="space-y-6">
            <div className={`flex items-center justify-between flex-wrap gap-4 ${competitionId ? "hidden" : ""}`}>
                <div>
                    <h1 className="text-3xl font-semibold">Certificates</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage user certificates and status updates
                    </p>
                </div>

                <Button

                    onClick={() => {
                        if (competitionFilter === "all") {
                            toaster.error("Please s select a competition to generate certificates.");
                            return;
                        }
                        competitionFilter !== "all" &&
                            generateMutation.mutate(competitionFilter);
                    }
                    }
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Certificates
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b border-card-border">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[200px] max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search certificates..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Competition Filter */}
                        <div className={competitionId ? "hidden" : ""}>
                            <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Competition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Competitions</SelectItem>
                                    {competitions?.map((comp: any) => (
                                        <SelectItem key={comp.id} value={comp.id}>
                                            {comp.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="ISSUED">Issued</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                <SelectItem value="REVOKED">Revoked</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className={!competitionId ? "hidden" : ""}>

                            <Button

                                onClick={() => {
                                    if (competitionFilter === "all") {
                                        toaster.error("Please s select a competition to generate certificates.");
                                        return;
                                    }
                                    competitionFilter !== "all" &&
                                        generateMutation.mutate(competitionFilter);
                                }
                                }
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Generate Certificates
                            </Button>
                        </div>
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Competition</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Issued</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {certificates && certificates.certificates?.length > 0 ? (
                                    certificates.certificates.map((cert: any) => (
                                        <TableRow key={cert.id} className="hover:bg-muted/40">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {cert.user?.username || "Anonymous"}
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {cert.user?.email}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {cert.competition?.title || "N/A"}
                                            </TableCell>

                                            <TableCell>
                                                <Badge className={statusColors[cert.status]}>
                                                    {cert.status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "-"}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                updateStatusMutation.mutate({
                                                                    id: cert.id,
                                                                    status: "APPROVED",
                                                                })
                                                            }
                                                        >
                                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                                            Approve
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                updateStatusMutation.mutate({
                                                                    id: cert.id,
                                                                    status: "REJECTED",
                                                                })
                                                            }
                                                            className="text-destructive"
                                                        >
                                                            <ShieldX className="w-4 h-4 mr-2" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            No certificates found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
