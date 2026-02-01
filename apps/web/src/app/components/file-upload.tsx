import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Label } from "@/app/components/ui/label";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  required?: boolean;
  optional?: boolean;
  onFileChange?: (file: File | null) => void;
}

export function FileUpload({
  id,
  label,
  accept,
  required = false,
  optional = false,
  onFileChange,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange?.(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileChange?.(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    onFileChange?.(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        {label}
        {optional && (
          <span className="text-sm text-muted-foreground">(Optional)</span>
        )}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={label}
        />

        {file ? (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
              <div className="hidden">Delete</div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-3">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm mb-1">
              <span className="text-primary font-medium">คลิกเพื่ออัปโหลด</span>{" "}
              หรือลากไฟล์มาวางที่นี่
            </p>
            <p className="text-xs text-muted-foreground">
              {accept ? `รองรับไฟล์: ${accept}` : "รองรับไฟล์ทุกประเภท"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
