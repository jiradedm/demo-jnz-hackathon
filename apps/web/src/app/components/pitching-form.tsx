import { useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Wand2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { FileUpload } from "@/app/components/file-upload";
import { TopBar } from "@/app/components/top-bar";

const API_BASE =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

/** Normalise input to string: accept string/number/undefined/null (e.g. type="number" sends number). */
const stringFromInput = () =>
  z
    .union([z.string(), z.number(), z.undefined(), z.null()])
    .transform((v) => (v == null || v === "" ? "" : String(v)));

/** Schema: required fields + required file fields. Optional file not validated. */
const pitchingFormSchema = z.object({
  presentationTime: stringFromInput().pipe(
    z
      .string()
      .min(1, "กรุณากรอกเวลาที่ใช้ในการนำเสนอ")
      .refine(
        (val) => {
          const n = Number(val);
          return !Number.isNaN(n) && n >= 1;
        },
        { message: "อย่างน้อย 1 นาที" }
      )
  ),
  notes: stringFromInput().pipe(
    z.string().min(1, "กรุณากรอกข้อมูล Note จาก Sales")
  ),
  customerRequirements: stringFromInput().pipe(
    z.string().min(1, "กรุณากรอกความต้องการของลูกค้า")
  ),
  torDocument: z.custom<File | null>(
    (val) => val instanceof File,
    "กรุณาอัปโหลดเอกสาร TOR"
  ),
  referenceSlide: z.custom<File | null>(
    (val) => val instanceof File,
    "กรุณาอัปโหลดเอกสาร Slide อ้างอิง"
  ),
  slideBrief: z.union([z.instanceof(File), z.null()]).optional(),
});

type FormValues = z.infer<typeof pitchingFormSchema>;

const initialFormValues: FormValues = {
  presentationTime: "",
  notes: "",
  customerRequirements: "",
  torDocument: null,
  referenceSlide: null,
  slideBrief: null,
};

export function PitchingForm() {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(pitchingFormSchema) as Resolver<FormValues>,
    mode: "all",
    values: formValues,
  });

  const hasTorFile = watch("torDocument") instanceof File;

  const mutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      const body = {
        ...payload,
        hasTorFile: payload.torDocument instanceof File,
        timestamp: new Date().toISOString(),
      };
      const res = await fetch(`${API_BASE}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Request failed");
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Data from API:", data);
      alert("ฟอร์มถูกส่งเรียบร้อยแล้ว! ตรวจสอบ Console เพื่อดูข้อมูลจาก API");
    },
    onError: () => {
      alert("ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const handleGenerateRequirements = () => {
    const loremText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    setFormValues((prev) => ({ ...prev, customerRequirements: loremText }));
  };

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] py-12 px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5]/10 border border-[#4F46E5]/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#34d399]" />
              <span className="text-sm text-white/90">Powered by AI</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Decode the TOR.
              <br />
              Design the <span className="text-[#34d399]">Win.</span>
            </h1>
            <p className="text-white/70">
              แปลความต้องการ TOR เพื่อให้คุณสามารถสร้างบทนำเสนอที่ชนะใจทุกครั้ง
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Presentation Time */}
              <Controller
                name="presentationTime"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="presentationTime">
                      เวลาที่ใช้ในการนำเสนอ (นาที)
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="presentationTime"
                      type="number"
                      placeholder="เช่น 30"
                      className="bg-[#f8fafc] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v);
                        setFormValues((prev) => ({ ...prev, presentationTime: v }));
                      }}
                    />
                    {errors.presentationTime && (
                      <p className="text-sm text-red-500">
                        {errors.presentationTime.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* TOR Document Upload */}
              <Controller
                name="torDocument"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    id="torDocument"
                    label="อัปโหลดเอกสาร TOR"
                    accept=".pdf,.doc,.docx"
                    required
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);
                      setFormValues((prev) => ({ ...prev, torDocument: file }));
                    }}
                    error={errors.torDocument?.message}
                  />
                )}
              />

              {/* Customer Requirements */}
              <Controller
                name="customerRequirements"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="customerRequirements">
                      ความต้องการของลูกค้า
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="customerRequirements"
                        placeholder="กรุณากรอกความต้องการของลูกค้า..."
                        rows={5}
                        className="bg-[#f8fafc] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none pr-12"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v);
                          setFormValues((prev) => ({ ...prev, customerRequirements: v }));
                        }}
                      />
                      {hasTorFile && (
                        <button
                          type="button"
                          onClick={handleGenerateRequirements}
                          className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-[#4F46E5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4F46E5] text-white rounded-lg shadow-lg shadow-[#4F46E5]/30 transition-all duration-200 group"
                          title="สร้างความต้องการด้วย AI"
                        >
                          <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </button>
                      )}
                    </div>
                    {errors.customerRequirements && (
                      <p className="text-sm text-red-500">
                        {errors.customerRequirements.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {hasTorFile
                        ? "✨ กด AI button เพื่อให้ระบบดึงข้อมูลจากเอกสาร TOR"
                        : "อัปโหลดเอกสาร TOR เพื่อใช้ฟีเจอร์ AI"}
                    </p>
                  </div>
                )}
              />

              {/* Slide Brief Upload (Optional) */}
              <Controller
                name="slideBrief"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    id="slideBrief"
                    label="อัปโหลดเอกสาร Slide Brief"
                    accept=".pdf,.ppt,.pptx"
                    optional
                    value={field.value ?? null}
                    onChange={(file) => {
                      field.onChange(file);
                      setFormValues((prev) => ({ ...prev, slideBrief: file ?? null }));
                    }}
                    error={errors.slideBrief?.message}
                  />
                )}
              />

              {/* Reference Slide Upload */}
              <Controller
                name="referenceSlide"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    id="referenceSlide"
                    label="อัปโหลดเอกสาร Slide อ้างอิง"
                    accept=".pdf,.ppt,.pptx"
                    required
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);
                      setFormValues((prev) => ({ ...prev, referenceSlide: file }));
                    }}
                    error={errors.referenceSlide?.message}
                  />
                )}
              />

              {/* Sales Notes */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      ข้อมูล Note ที่ Sales ได้มาจากลูกค้า
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="กรุณากรอกข้อมูลที่ได้จากการพูดคุยกับลูกค้า เช่น ความต้องการเฉพาะ, ข้อกังวล, จุดเน้นที่สำคัญ..."
                      rows={6}
                      className="bg-[#f8fafc] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v);
                        setFormValues((prev) => ({ ...prev, notes: v }));
                      }}
                    />
                    {errors.notes && (
                      <p className="text-sm text-red-500">{errors.notes.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      ข้อมูลนี้จะช่วยให้เราสร้าง Pitch Deck
                      ที่ตรงกับความต้องการของลูกค้ามากที่สุด
                    </p>
                  </div>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-to-r from-[#4F46E5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4F46E5] text-white py-6 shadow-lg shadow-[#4F46E5]/30 transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {mutation.isPending ? "กำลังส่ง..." : "สร้าง Pitch Deck"}
                </Button>
              </div>

              {/* Info Text */}
              <p className="text-xs text-center text-muted-foreground pt-2">
                ระบบจะวิเคราะห์ข้อมูลและสร้างสไลด์นำเสนอที่เหมาะสมภายในไม่กี่นาที
              </p>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              💡 ระบบจะรักษาความลับของข้อมูลทั้งหมดตามมาตรฐานสากล
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
