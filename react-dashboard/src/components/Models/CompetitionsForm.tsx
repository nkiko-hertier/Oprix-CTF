'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import {Button} from '@mui/material'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { GradientCard } from '../HomeCards'
import { toast } from 'sonner'
import getApiClient from '@/lib/api-client'
import { API_ENDPOINTS } from '@/config/api.config'

// --- Zod schema for validation ---
const competitionSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be at most 500 characters'),
    startTime: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: 'Invalid start time' }),
    endTime: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: 'Invalid end time' }),
    type: z.enum(['JEOPARDY', 'ATTACK_DEFEND', 'OTHER']),
    isTeamBased: z.boolean(),
    maxTeamSize: z.number().int().min(1).optional(),
    maxParticipants: z.number().int().min(1),
    requireApproval: z.boolean(),
    isPublic: z.boolean(),
    allowedCategories: z.array(z.string()).min(1),
    metadata: z.object({ difficulty: z.string().optional(), prizes: z.string().optional() }).optional(),
})

type CompetitionForm = z.infer<typeof competitionSchema>

// --- Helpers to convert between ISO and datetime-local input value ---
function isoToLocal(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    // pad to "YYYY-MM-DDTHH:MM" which input[type=datetime-local] expects
    const pad = (n: number) => String(n).padStart(2, '0')
    const YYYY = d.getFullYear()
    const MM = pad(d.getMonth() + 1)
    const DD = pad(d.getDate())
    const hh = pad(d.getHours())
    const mm = pad(d.getMinutes())
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}`
}

function localToIso(local: string) {
    // local is like "2025-07-01T00:00" (no timezone) — treat as local and convert to ISO
    if (!local) return ''
    const d = new Date(local)
    return d.toISOString()
}

export default function CTFCompetitionForm({
    children
}: {
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false)
    const defaultValues: CompetitionForm = {
        name: 'Summer CTF 2025',
        description: 'An exciting CTF competition for summer',
        startTime: '2025-07-01T00:00:00Z',
        endTime: '2025-07-03T23:59:59Z',
        type: 'JEOPARDY',
        isTeamBased: false,
        maxTeamSize: 4,
        maxParticipants: 100,
        requireApproval: false,
        isPublic: true,
        allowedCategories: ['WEB', 'CRYPTO', 'PWN'],
        metadata: { difficulty: 'beginner', prizes: 'Top 3 winners get prizes' },
    }

    const form = useForm<CompetitionForm>({
        resolver: zodResolver(competitionSchema),
        defaultValues,
    })

    const onSubmit = async (values: CompetitionForm) => {
        // ensure start/end are ISO strings
        const payload = {
            ...values,
            startTime: new Date(values.startTime).toISOString(),
            endTime: new Date(values.endTime).toISOString(),
        }

        try {
            const response = await getApiClient().post(
                API_ENDPOINTS.COMPETITIONS.CREATE,
                payload
            );
            
            toast.success('Competition created successfully!');
            form.reset(defaultValues);
            setIsOpen(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                'Failed to create competition. Please try again.';
            toast.error(errorMessage);
            console.error('Error creating competition:', error);
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </DialogTrigger>

                <DialogContent className="max-w-2xl p-0!">
                    <GradientCard className="p-4">
                        <DialogHeader>
                            <DialogTitle>Create New Competition</DialogTitle>
                            <DialogDescription>Fill the form to create a new CTF competition.</DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <div>
                                    <Label className='mb-1' htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Summer CTF 2025" {...form.register('name')} />
                                    {form.formState.errors.name && (
                                        <p className="text-xs text-red-400 mt-1">{String(form.formState.errors.name.message)}</p>
                                    )}
                                </div>

                                {/* Type */}
                                <div>
                                    <Label className='mb-1' htmlFor="type">Type</Label>
                                    <Controller
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="JEOPARDY">JEOPARDY</SelectItem>
                                                    <SelectItem value="ATTACK_DEFEND">ATTACK_DEFEND</SelectItem>
                                                    <SelectItem value="OTHER">OTHER</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {form.formState.errors.type && (
                                        <p className="text-xs text-red-400 mt-1">{String(form.formState.errors.type.message)}</p>
                                    )}
                                </div>

                                {/* startTime */}
                                <div>
                                    <Label className='mb-1' htmlFor="startTime">Start Time</Label>
                                    <Input
                                        id="startTime"
                                        type="datetime-local"
                                        {...form.register('startTime', {
                                            setValueAs: (v) => localToIso(v as any) || v,
                                        })}
                                        defaultValue={isoToLocal(defaultValues.startTime)}
                                    />
                                    {form.formState.errors.startTime && (
                                        <p className="text-xs text-red-400 mt-1">{String(form.formState.errors.startTime.message)}</p>
                                    )}
                                </div>

                                {/* endTime */}
                                <div>
                                    <Label className='mb-1' htmlFor="endTime">End Time</Label>
                                    <Input
                                        id="endTime"
                                        type="datetime-local"
                                        {...form.register('endTime', {
                                            setValueAs: (v) => localToIso(v as any) || v,
                                        })}
                                        defaultValue={isoToLocal(defaultValues.endTime)}
                                    />
                                    {form.formState.errors.endTime && (
                                        <p className="text-xs text-red-400 mt-1">{String(form.formState.errors.endTime.message)}</p>
                                    )}
                                </div>

                                {/* isPublic */}
                                <div className="flex items-center gap-3">
                                    <Label className='mb-1' htmlFor="isPublic">Public</Label>
                                    <Controller
                                        name="isPublic"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                </div>

                                {/* requireApproval */}
                                <div className="flex items-center gap-3">
                                    <Label className='mb-1' htmlFor="requireApproval">Require Approval</Label>
                                    <Controller
                                        name="requireApproval"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                </div>

                                {/* isTeamBased */}
                                <div className="flex items-center gap-3">
                                    <Label className='mb-1' htmlFor="isTeamBased">Team Based</Label>
                                    <Controller
                                        name="isTeamBased"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(val) => {
                                                    field.onChange(val)
                                                    // if toggled off, clear maxTeamSize
                                                    if (!val) form.setValue('maxTeamSize', 1)
                                                }}
                                            />
                                        )}
                                    />
                                </div>

                                {/* maxTeamSize */}
                                <div>
                                    <Label className='mb-1' htmlFor="maxTeamSize">Max Team Size</Label>
                                    <Input id="maxTeamSize" type="number" {...form.register('maxTeamSize', { valueAsNumber: true })} />
                                    {form.formState.errors.maxTeamSize && (
                                        <p className="text-xs text-red-400 mt-1">{String(form.formState.errors.maxTeamSize.message)}</p>
                                    )}
                                </div>

                                {/* maxParticipants */}
                                <div>
                                    <Label className='mb-1' htmlFor="maxParticipants">Max Participants</Label>
                                    <Input id="maxParticipants" type="number" {...form.register('maxParticipants', { valueAsNumber: true })} />
                                    {form.formState.errors.maxParticipants && (
                                        <p className="text-xs text-red-400 mt-1">{String(form.formState.errors.maxParticipants.message)}</p>
                                    )}
                                </div>

                                {/* allowedCategories */}
                                <div className="md:col-span-2">
                                    <Label className='mb-1'>Allowed Categories</Label>
                                    <div className="flex gap-3 flex-wrap mt-2">
                                        {['WEB', 'CRYPTO', 'PWN', 'REVERSE', 'MISC'].map((cat) => (
                                            <label key={cat} className="flex mb-1 items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={form.getValues('allowedCategories').includes(cat as any)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked
                                                        const prev = form.getValues('allowedCategories') || []
                                                        if (checked) form.setValue('allowedCategories', [...prev, cat as any])
                                                        else form.setValue('allowedCategories', prev.filter((c) => c !== cat))
                                                    }}
                                                />
                                                <span className="text-sm">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {form.formState.errors.allowedCategories && (
                                        <p className="text-xs text-red-400 mt-1">{String(form.formState.errors.allowedCategories.message)}</p>
                                    )}
                                </div>

                            </div>

                            <Separator className="my-4" />

                            {/* Description */}
                            <div>
                                <Label className='mb-1' htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Describe the competition" {...form.register('description')} />
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className='mb-1' htmlFor="difficulty">Difficulty</Label>
                                    <Input id="difficulty" {...form.register('metadata.difficulty' as const)} placeholder="beginner" />
                                </div>
                                <div>
                                    <Label className='mb-1' htmlFor="prizes">Prizes</Label>
                                    <Input id="prizes" {...form.register('metadata.prizes' as const)} placeholder="Top 3 winners get prizes" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outlined" type="button" onClick={() => form.reset(defaultValues)}>
                                    Reset
                                </Button>
                                <Button variant="contained" loading={form.formState.isSubmitting} type="submit">Create</Button>
                            </div>

                        </form>
                        <DialogFooter>
                            <small className="text-xs text-muted-foreground">All fields are validated with Zod before submit.</small>
                        </DialogFooter>

                    </GradientCard>
                </DialogContent>
            </Dialog>
        </div>
    )
}
