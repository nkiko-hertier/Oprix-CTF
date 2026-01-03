"use client";

import { Button } from "@/components/ui/button";
import { IoLogoDropbox } from "react-icons/io";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { openDropboxPicker } from "@/lib/googleDrivePicker";
import { Control, FieldValues, Path } from "react-hook-form";

interface DriveImageInputProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function DriveImageInput<T extends FieldValues>({
  form,
  name,
  label = "Image",
  placeholder = "Paste image URL or choose from Google Drive",
}: DriveImageInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          {/* URL input */}
          <FormControl>
            <Input {...field} placeholder={placeholder} />
          </FormControl>

          {/* Preview */}
          {field.value && typeof field.value === "string" && (
            <img
              src={field.value}
              alt="Preview"
              className="mt-3 w-full h-40 object-cover rounded-md border"
            />
          )}

          {/* Action */}
          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                openDropboxPicker((url: string, name: string) => field.onChange(url))
              }
            >
              Choose from Dropbox
            </Button>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const DropBoxButton = (
    {
        field
    }: any
) => {
    return (
        <div className="flex gap-2">
            <Button
              type="button"
              className="bg-blue-600 border-none text-white"
              onClick={() =>
                openDropboxPicker((url: string, name: string) => field.onChange(url))
              }
            >
              <IoLogoDropbox />
            </Button>
          </div>
    )
}