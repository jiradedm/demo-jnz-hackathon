import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { FileUpload } from "@/app/components/file-upload";
import { TopBar } from "@/app/components/top-bar";

export function PitchingForm() {
  const [presentationTime, setPresentationTime] = useState("");
  const [notes, setNotes] = useState("");
  const [hasTorFile, setHasTorFile] = useState(false);
  const [customerRequirements, setCustomerRequirements] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      presentationTime,
      customerRequirements,
      notes,
      timestamp: new Date().toISOString(),
    };
    
    console.log("Form submitted:", formData);
    alert("ฟอร์มถูกส่งเรียบร้อยแล้ว! ตรวจสอบ Console เพื่อดูข้อมูล");
  };

  const handleGenerateRequirements = () => {
    const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    setCustomerRequirements(loremText);
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Presentation Time */}
              <div className="space-y-2">
                <Label htmlFor="presentationTime">
                  เวลาที่ใช้ในการนำเสนอ (นาที)
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="presentationTime"
                  type="number"
                  placeholder="เช่น 30"
                  value={presentationTime}
                  onChange={(e) => setPresentationTime(e.target.value)}
                  required
                  min="1"
                  className="bg-[#f8fafc] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>

              {/* TOR Document Upload */}
              <FileUpload
                id="torDocument"
                label="อัปโหลดเอกสาร TOR"
                accept=".pdf,.doc,.docx"
                required
                onFileChange={(file) => setHasTorFile(file !== null)}
              />

              {/* Customer Requirements */}
              <div className="space-y-2">
                <Label htmlFor="customerRequirements">
                  ความต้องการของลูกค้า
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="customerRequirements"
                    placeholder="กรุณากรอกความต้องการของลูกค้า..."
                    value={customerRequirements}
                    onChange={(e) => setCustomerRequirements(e.target.value)}
                    required
                    rows={5}
                    className="bg-[#f8fafc] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none pr-12"
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
                <p className="text-xs text-muted-foreground">
                  {hasTorFile ? "✨ กด AI button เพื่อให้ระบบดึงข้อมูลจากเอกสาร TOR" : "อัปโหลดเอกสาร TOR เพื่อใช้ฟีเจอร์ AI"}
                </p>
              </div>

              {/* Slide Brief Upload (Optional) */}
              <FileUpload
                id="slideBrief"
                label="อัปโหลดเอกสาร Slide Brief"
                accept=".pdf,.ppt,.pptx"
                optional
              />

              {/* Reference Slide Upload */}
              <FileUpload
                id="referenceSlide"
                label="อัปโหลดเอกสาร Slide อ้างอิง"
                accept=".pdf,.ppt,.pptx"
                required
              />

              {/* Sales Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  ข้อมูล Note ที่ Sales ได้มาจากลูกค้า
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="กรุณากรอกข้อมูลที่ได้จากการพูดคุยกับลูกค้า เช่น ความต้องการเฉพาะ, ข้อกังวล, จุดเน้นที่สำคัญ..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  rows={6}
                  className="bg-[#f8fafc] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  ข้อมูลนี้จะช่วยให้เราสร้าง Pitch Deck ที่ตรงกับความต้องการของลูกค้ามากที่สุด
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#4F46E5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4F46E5] text-white py-6 shadow-lg shadow-[#4F46E5]/30 transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  สร้าง Pitch Deck
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